import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

from backend.ingestion.football_data_csv import IngestionError, ingest_csv


class FootballDataCsvTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        self.input_path = Path(self.temp_dir.name) / "E0.csv"
        self.timestamp = datetime(2026, 11, 14, tzinfo=timezone.utc)

    def write_csv(self, content: str) -> None:
        self.input_path.write_text(content, encoding="utf-8")

    def test_normalizes_and_tracks_match_provenance(self) -> None:
        self.write_csv(
            "Div,Date,HomeTeam,AwayTeam,FTHG,FTAG,FTR\n"
            "E0,15/08/25,Arsenal,Everton,2,1,H\n"
        )

        result = ingest_csv(self.input_path, "2025-26", self.timestamp)

        self.assertEqual(result["dataset"], "premier_league_matches")
        self.assertEqual(result["matches"][0]["match_date"], "2025-08-15")
        self.assertEqual(result["matches"][0]["result"], "H")
        self.assertEqual(result["matches"][0]["provenance"]["source_record"], 2)
        self.assertEqual(
            result["matches"][0]["provenance"]["source_file_sha256"],
            result["source"]["file_sha256"],
        )
        self.assertEqual(
            result["matches"][0]["provenance"]["ingested_at"],
            "2026-11-14T00:00:00+00:00",
        )

    def test_rejects_non_premier_league_rows(self) -> None:
        self.write_csv(
            "Div,Date,HomeTeam,AwayTeam,FTHG,FTAG\n"
            "E1,15/08/25,Home,Away,1,0\n"
        )

        with self.assertRaisesRegex(IngestionError, "expected Premier League division E0"):
            ingest_csv(self.input_path, "2025-26", self.timestamp)

    def test_rejects_result_that_conflicts_with_score(self) -> None:
        self.write_csv(
            "Div,Date,HomeTeam,AwayTeam,FTHG,FTAG,FTR\n"
            "E0,15/08/25,Arsenal,Everton,2,1,A\n"
        )

        with self.assertRaisesRegex(IngestionError, "conflicts with the final score"):
            ingest_csv(self.input_path, "2025-26", self.timestamp)

    def test_rejects_match_date_outside_requested_season(self) -> None:
        self.write_csv(
            "Div,Date,HomeTeam,AwayTeam,FTHG,FTAG\n"
            "E0,15/08/24,Arsenal,Everton,2,1\n"
        )

        with self.assertRaisesRegex(IngestionError, "falls outside season"):
            ingest_csv(self.input_path, "2025-26", self.timestamp)

    def test_rejects_duplicate_fixtures(self) -> None:
        self.write_csv(
            "Div,Date,HomeTeam,AwayTeam,FTHG,FTAG\n"
            "E0,15/08/25,Arsenal,Everton,2,1\n"
            "E0,15/08/25,arsenal,Everton,0,0\n"
        )

        with self.assertRaisesRegex(IngestionError, "duplicate fixture"):
            ingest_csv(self.input_path, "2025-26", self.timestamp)


if __name__ == "__main__":
    unittest.main()
