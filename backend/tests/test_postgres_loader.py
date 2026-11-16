import unittest
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
import tempfile

from backend.app.data.mock_data import overview
from backend.ingestion.football_data_csv import ingest_csv
from backend.ingestion.postgres_loader import DatasetError, _validate_dataset


class PostgresLoaderValidationTests(unittest.TestCase):
    def test_accepts_dataset_generated_by_csv_adapter(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            source = Path(temp_dir) / "E0.csv"
            source.write_text(
                "Div,Date,HomeTeam,AwayTeam,FTHG,FTAG,FTR\n"
                "E0,15/08/25,Arsenal,Everton,2,1,H\n",
                encoding="utf-8",
            )
            dataset = ingest_csv(
                source,
                "2025-26",
                datetime(2026, 11, 14, tzinfo=timezone.utc),
            )

        season, metadata, matches = _validate_dataset(dataset)

        self.assertEqual(season, "2025-26")
        self.assertEqual(metadata["provider"], "football-data.co.uk")
        self.assertEqual(len(matches), 1)

    def test_rejects_modified_fixture_identity(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            source = Path(temp_dir) / "E0.csv"
            source.write_text(
                "Div,Date,HomeTeam,AwayTeam,FTHG,FTAG,FTR\n"
                "E0,15/08/25,Arsenal,Everton,2,1,H\n",
                encoding="utf-8",
            )
            dataset = ingest_csv(
                source,
                "2025-26",
                datetime(2026, 11, 14, tzinfo=timezone.utc),
            )

        modified = deepcopy(dataset)
        modified["matches"][0]["home_team"] = "Chelsea"
        with self.assertRaisesRegex(DatasetError, "match_id does not match"):
            _validate_dataset(modified)

    def test_rejects_result_that_disagrees_with_score(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            source = Path(temp_dir) / "E0.csv"
            source.write_text(
                "Div,Date,HomeTeam,AwayTeam,FTHG,FTAG,FTR\n"
                "E0,15/08/25,Arsenal,Everton,2,1,H\n",
                encoding="utf-8",
            )
            dataset = ingest_csv(
                source,
                "2025-26",
                datetime(2026, 11, 14, tzinfo=timezone.utc),
            )

        modified = deepcopy(dataset)
        modified["matches"][0]["result"] = "D"
        with self.assertRaisesRegex(DatasetError, "result conflicts"):
            _validate_dataset(modified)

    def test_rejects_provenance_from_another_source_file(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            source = Path(temp_dir) / "E0.csv"
            source.write_text(
                "Div,Date,HomeTeam,AwayTeam,FTHG,FTAG,FTR\n"
                "E0,15/08/25,Arsenal,Everton,2,1,H\n",
                encoding="utf-8",
            )
            dataset = ingest_csv(
                source,
                "2025-26",
                datetime(2026, 11, 14, tzinfo=timezone.utc),
            )

        modified = deepcopy(dataset)
        modified["matches"][0]["provenance"]["source_file_sha256"] = "0" * 64
        with self.assertRaisesRegex(DatasetError, "source digest conflicts"):
            _validate_dataset(modified)

    def test_rejects_non_match_payload(self) -> None:
        with self.assertRaisesRegex(DatasetError, "Unsupported dataset"):
            _validate_dataset(overview)


if __name__ == "__main__":
    unittest.main()
