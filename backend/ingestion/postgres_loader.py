"""Load normalized Premier League match JSON into PostgreSQL."""

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Any


_HASH_PATTERN = re.compile(r"^[0-9a-f]{64}$")
_SEASON_PATTERN = re.compile(r"^(\d{4})-(\d{2})$")
_PROVIDER = "football-data.co.uk"


class DatasetError(ValueError):
    """Raised when a normalized dataset fails validation."""


def _validate_dataset(dataset: Any) -> tuple[str, dict[str, Any], list[dict[str, Any]]]:
    if not isinstance(dataset, dict):
        raise DatasetError("Dataset root must be a JSON object.")
    if dataset.get("schema_version") != "1":
        raise DatasetError("Unsupported dataset schema_version; expected '1'.")
    if dataset.get("dataset") != "premier_league_matches":
        raise DatasetError("Unsupported dataset; expected 'premier_league_matches'.")

    season = dataset.get("season")
    season_match = _SEASON_PATTERN.fullmatch(season) if isinstance(season, str) else None
    if not season_match or int(season_match.group(2)) != (int(season_match.group(1)) + 1) % 100:
        raise DatasetError("Invalid season; expected format YYYY-YY.")
    season_start = int(season_match.group(1))

    source = dataset.get("source")
    if not isinstance(source, dict) or source.get("provider") != _PROVIDER:
        raise DatasetError(f"Dataset source provider must be {_PROVIDER!r}.")
    source_hash = source.get("file_sha256")
    if not isinstance(source_hash, str) or not _HASH_PATTERN.fullmatch(source_hash):
        raise DatasetError("Source file_sha256 must be a lowercase SHA-256 digest.")
    if not isinstance(source.get("file_name"), str) or not source["file_name"].strip():
        raise DatasetError("Source file_name is required.")

    matches = dataset.get("matches")
    if not isinstance(matches, list) or not matches:
        raise DatasetError("Dataset must contain at least one match.")

    seen_match_ids: set[str] = set()
    seen_source_records: set[int] = set()
    for index, match in enumerate(matches, start=1):
        label = f"Match {index}"
        if not isinstance(match, dict):
            raise DatasetError(f"{label} must be a JSON object.")
        if match.get("season") != season:
            raise DatasetError(f"{label} season does not match the dataset season.")

        match_date = match.get("match_date")
        try:
            parsed_date = date.fromisoformat(match_date) if isinstance(match_date, str) else None
        except ValueError as error:
            raise DatasetError(f"{label} has an invalid match_date.") from error
        if parsed_date is None or parsed_date.year not in (season_start, season_start + 1):
            raise DatasetError(f"{label} match_date falls outside season {season}.")

        home_team = match.get("home_team")
        away_team = match.get("away_team")
        if not isinstance(home_team, str) or not home_team.strip():
            raise DatasetError(f"{label} home_team is required.")
        if not isinstance(away_team, str) or not away_team.strip():
            raise DatasetError(f"{label} away_team is required.")
        if home_team.casefold().strip() == away_team.casefold().strip():
            raise DatasetError(f"{label} home and away teams must differ.")

        home_goals = match.get("home_goals")
        away_goals = match.get("away_goals")
        if type(home_goals) is not int or type(away_goals) is not int or min(home_goals, away_goals) < 0:
            raise DatasetError(f"{label} goals must be non-negative integers.")
        expected_result = "H" if home_goals > away_goals else "A" if home_goals < away_goals else "D"
        if match.get("result") != expected_result:
            raise DatasetError(f"{label} result conflicts with the final score.")

        identity = "\x1f".join(
            (season, parsed_date.isoformat(), home_team.casefold(), away_team.casefold())
        )
        expected_match_id = hashlib.sha256(identity.encode("utf-8")).hexdigest()
        match_id = match.get("match_id")
        if match_id != expected_match_id:
            raise DatasetError(f"{label} match_id does not match its fixture identity.")
        if match_id in seen_match_ids:
            raise DatasetError(f"{label} duplicates a match in the dataset.")
        seen_match_ids.add(match_id)

        provenance = match.get("provenance")
        if not isinstance(provenance, dict) or provenance.get("provider") != _PROVIDER:
            raise DatasetError(f"{label} has invalid provider provenance.")
        if provenance.get("source_file_sha256") != source_hash:
            raise DatasetError(f"{label} source digest conflicts with the dataset source.")
        source_record = provenance.get("source_record")
        if type(source_record) is not int or source_record <= 0:
            raise DatasetError(f"{label} source_record must be a positive integer.")
        if source_record in seen_source_records:
            raise DatasetError(f"{label} duplicates a source_record.")
        seen_source_records.add(source_record)

        ingested_at = provenance.get("ingested_at")
        try:
            timestamp = datetime.fromisoformat(ingested_at) if isinstance(ingested_at, str) else None
        except ValueError as error:
            raise DatasetError(f"{label} has an invalid provenance ingested_at.") from error
        if timestamp is None or timestamp.tzinfo is None:
            raise DatasetError(f"{label} provenance ingested_at must include a timezone.")

    return season, source, matches


def _normalized_team_name(name: str) -> str:
    return " ".join(name.casefold().split())


def load_dataset(dataset: Any, connection: Any) -> int:
    """Insert a validated dataset in one transaction; repeated loads are safe."""
    season, source, matches = _validate_dataset(dataset)
    season_match = _SEASON_PATTERN.fullmatch(season)
    if season_match is None:
        raise DatasetError("Invalid season; expected format YYYY-YY.")
    start_year = int(season_match.group(1))
    end_year = start_year + 1
    source_hash = source["file_sha256"]

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO data_sources (provider, source_file, source_sha256, metadata)
                VALUES (%s, %s, %s, %s::JSONB)
                ON CONFLICT (provider, source_sha256)
                DO UPDATE SET source_file = EXCLUDED.source_file
                RETURNING data_source_id
                """,
                (
                    source["provider"],
                    source["file_name"],
                    source_hash,
                    json.dumps({"dataset": dataset["dataset"], "schema_version": dataset["schema_version"]}),
                ),
            )
            data_source_id = cursor.fetchone()[0]

            cursor.execute(
                """
                INSERT INTO ingestion_runs (data_source_id, schema_version)
                VALUES (%s, %s)
                RETURNING ingestion_run_id
                """,
                (data_source_id, dataset["schema_version"]),
            )
            ingestion_run_id = cursor.fetchone()[0]

            cursor.execute(
                """
                SELECT competition_id
                FROM competitions
                WHERE slug = 'premier-league'
                """
            )
            competition = cursor.fetchone()
            if competition is None:
                raise RuntimeError(
                    "Premier League competition is missing; apply the initial database migration first."
                )
            competition_id = competition[0]

            cursor.execute(
                """
                INSERT INTO seasons (competition_id, season_code, start_year, end_year)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (competition_id, season_code)
                DO UPDATE SET season_code = EXCLUDED.season_code
                RETURNING season_id
                """,
                (competition_id, season, start_year, end_year),
            )
            season_id = cursor.fetchone()[0]

            inserted_matches = 0
            for match in matches:
                team_ids: list[int] = []
                for team_name in (match["home_team"], match["away_team"]):
                    cursor.execute(
                        """
                        INSERT INTO teams (canonical_name, normalized_name)
                        VALUES (%s, %s)
                        ON CONFLICT (normalized_name)
                        DO UPDATE SET canonical_name = teams.canonical_name
                        RETURNING team_id
                        """,
                        (team_name.strip(), _normalized_team_name(team_name)),
                    )
                    team_ids.append(cursor.fetchone()[0])

                values = (
                    match["match_id"],
                    season_id,
                    date.fromisoformat(match["match_date"]),
                    team_ids[0],
                    team_ids[1],
                    match["home_goals"],
                    match["away_goals"],
                    match["result"],
                )
                cursor.execute(
                    """
                    INSERT INTO matches (
                        match_id, season_id, match_date, home_team_id, away_team_id,
                        home_goals, away_goals, result
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (match_id) DO NOTHING
                    RETURNING match_id
                    """,
                    values,
                )
                inserted = cursor.fetchone()
                if inserted:
                    inserted_matches += 1
                else:
                    cursor.execute(
                        """
                        SELECT season_id, match_date, home_team_id, away_team_id,
                               home_goals, away_goals, result
                        FROM matches
                        WHERE match_id = %s
                        """,
                        (match["match_id"],),
                    )
                    existing = cursor.fetchone()
                    if existing != values[1:]:
                        raise DatasetError(
                            f"Existing match {match['match_id']} conflicts with this dataset."
                        )

                cursor.execute(
                    """
                    INSERT INTO match_provenance (
                        match_id, ingestion_run_id, source_record
                    )
                    VALUES (%s, %s, %s)
                    """,
                    (match["match_id"], ingestion_run_id, match["provenance"]["source_record"]),
                )

            cursor.execute(
                """
                UPDATE ingestion_runs
                SET status = 'succeeded',
                    completed_at = CURRENT_TIMESTAMP,
                    records_seen = %s,
                    records_loaded = %s
                WHERE ingestion_run_id = %s
                """,
                (len(matches), len(matches), ingestion_run_id),
            )

    return inserted_matches


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Load normalized Premier League match JSON into PostgreSQL."
    )
    parser.add_argument("input", type=Path, help="Path to normalized match JSON")
    parser.add_argument(
        "--database-url",
        default=os.environ.get("DATABASE_URL"),
        help="PostgreSQL connection URL (defaults to DATABASE_URL)",
    )
    arguments = parser.parse_args()
    if not arguments.database_url:
        print("Loading failed: set DATABASE_URL or pass --database-url.", file=sys.stderr)
        return 1

    try:
        dataset = json.loads(arguments.input.read_text(encoding="utf-8"))
        _validate_dataset(dataset)
    except (OSError, json.JSONDecodeError, DatasetError) as error:
        print(f"Loading failed: {error}", file=sys.stderr)
        return 1

    try:
        import psycopg2
    except ImportError:
        print(
            "Loading failed: psycopg2 is unavailable. Install backend requirements only after approval.",
            file=sys.stderr,
        )
        return 1

    connection = None
    try:
        connection = psycopg2.connect(arguments.database_url)
        inserted = load_dataset(dataset, connection)
    except (psycopg2.Error, DatasetError) as error:
        print(f"Loading failed: {error}", file=sys.stderr)
        return 1
    finally:
        if connection is not None:
            connection.close()

    print(f"Loaded {len(dataset['matches'])} records; inserted {inserted} new matches.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
