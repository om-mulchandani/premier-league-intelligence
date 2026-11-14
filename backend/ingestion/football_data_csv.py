"""Normalize football-data.co.uk Premier League match CSV files."""

import argparse
import csv
import hashlib
import io
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


REQUIRED_COLUMNS = {"Div", "Date", "HomeTeam", "AwayTeam", "FTHG", "FTAG"}
SEASON_PATTERN = re.compile(r"^(\d{4})-(\d{2})$")


class IngestionError(ValueError):
    """Raised when an input match file does not meet the expected schema."""


def _validate_season(season: str) -> None:
    match = SEASON_PATTERN.fullmatch(season)
    if not match or int(match.group(2)) != (int(match.group(1)) + 1) % 100:
        raise IngestionError(f"Invalid season {season!r}; expected format YYYY-YY.")


def _parse_date(value: str, line_number: int) -> str:
    for date_format in ("%d/%m/%y", "%d/%m/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(value.strip(), date_format).date().isoformat()
        except ValueError:
            continue
    raise IngestionError(f"Line {line_number}: invalid match date {value!r}.")


def _parse_goals(value: str, column: str, line_number: int) -> int:
    try:
        goals = int(value.strip())
    except (AttributeError, ValueError) as error:
        raise IngestionError(
            f"Line {line_number}: {column} must be a non-negative integer."
        ) from error
    if goals < 0:
        raise IngestionError(
            f"Line {line_number}: {column} must be a non-negative integer."
        )
    return goals


def ingest_csv(
    input_path: Path,
    season: str,
    ingested_at: datetime | None = None,
) -> dict[str, Any]:
    """Read and validate one football-data.co.uk E0 match CSV."""
    _validate_season(season)
    source_bytes = input_path.read_bytes()
    try:
        source_text = source_bytes.decode("utf-8-sig")
    except UnicodeDecodeError as error:
        raise IngestionError("Input file must be UTF-8 or UTF-8 with a BOM.") from error

    reader = csv.DictReader(io.StringIO(source_text))
    headers = reader.fieldnames or []
    if len(headers) != len(set(headers)):
        raise IngestionError("Input file contains duplicate column names.")
    missing_columns = REQUIRED_COLUMNS.difference(headers)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise IngestionError(f"Input file is missing required columns: {missing}.")

    timestamp = ingested_at or datetime.now(timezone.utc)
    if timestamp.tzinfo is None:
        raise IngestionError("ingested_at must include a timezone.")
    timestamp_text = timestamp.astimezone(timezone.utc).isoformat()
    source_digest = hashlib.sha256(source_bytes).hexdigest()
    matches: list[dict[str, Any]] = []
    seen_match_ids: set[str] = set()

    for line_number, row in enumerate(reader, start=2):
        if not row or all(not (value or "").strip() for value in row.values() if value is not None):
            continue
        if None in row:
            raise IngestionError(f"Line {line_number}: row has more values than headers.")
        if (row["Div"] or "").strip().upper() != "E0":
            raise IngestionError(
                f"Line {line_number}: expected Premier League division E0, "
                f"got {(row['Div'] or '').strip()!r}."
            )

        match_date = _parse_date(row["Date"] or "", line_number)
        season_start = int(season[:4])
        if int(match_date[:4]) not in (season_start, season_start + 1):
            raise IngestionError(
                f"Line {line_number}: match date {match_date} falls outside season {season}."
            )
        home_team = (row["HomeTeam"] or "").strip()
        away_team = (row["AwayTeam"] or "").strip()
        if not home_team or not away_team:
            raise IngestionError(f"Line {line_number}: home and away teams are required.")

        home_goals = _parse_goals(row["FTHG"] or "", "FTHG", line_number)
        away_goals = _parse_goals(row["FTAG"] or "", "FTAG", line_number)
        result = "H" if home_goals > away_goals else "A" if home_goals < away_goals else "D"
        supplied_result = (row.get("FTR") or "").strip().upper()
        if supplied_result and supplied_result != result:
            raise IngestionError(
                f"Line {line_number}: FTR {supplied_result!r} conflicts with the final score."
            )

        identity = "\x1f".join(
            (season, match_date, home_team.casefold(), away_team.casefold())
        )
        match_id = hashlib.sha256(identity.encode("utf-8")).hexdigest()
        if match_id in seen_match_ids:
            raise IngestionError(
                f"Line {line_number}: duplicate fixture for {home_team} vs {away_team}."
            )
        seen_match_ids.add(match_id)
        matches.append(
            {
                "match_id": match_id,
                "season": season,
                "match_date": match_date,
                "home_team": home_team,
                "away_team": away_team,
                "home_goals": home_goals,
                "away_goals": away_goals,
                "result": result,
                "provenance": {
                    "provider": "football-data.co.uk",
                    "source_record": line_number,
                    "source_file_sha256": source_digest,
                    "ingested_at": timestamp_text,
                },
            }
        )

    if not matches:
        raise IngestionError("Input file contains no Premier League match records.")

    return {
        "schema_version": "1",
        "dataset": "premier_league_matches",
        "season": season,
        "source": {
            "provider": "football-data.co.uk",
            "file_name": input_path.name,
            "file_sha256": source_digest,
            "ingested_at": timestamp_text,
        },
        "matches": matches,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate and normalize a football-data.co.uk Premier League CSV."
    )
    parser.add_argument("input", type=Path, help="Path to the locally obtained CSV file")
    parser.add_argument("--season", required=True, help="Season in YYYY-YY format")
    parser.add_argument("--output", required=True, type=Path, help="Destination JSON file")
    arguments = parser.parse_args()

    try:
        dataset = ingest_csv(arguments.input, arguments.season)
        arguments.output.parent.mkdir(parents=True, exist_ok=True)
        arguments.output.write_text(
            json.dumps(dataset, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
    except (IngestionError, OSError) as error:
        print(f"Ingestion failed: {error}", file=sys.stderr)
        return 1

    print(f"Ingested {len(dataset['matches'])} matches to {arguments.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
