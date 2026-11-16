# Data Catalog

## Canonical data catalogue

This file is the authoritative source for provider and field coverage details for the Premier League Intelligence project.

## Provider review

### 1. football-data.co.uk

- Purpose: historical league and match results
- Seasons: historical Premier League seasons available in public data files
- Coverage: fixtures, results, and limited match statistics
- Details: useful for historical league tables and season-level trend analysis
- Restrictions: verify licensing and attribution before redistribution
- Notes: best for non-event historical context and season comparison

### 2. football-data.org

- Purpose: structured competition and fixtures
- Coverage: competition, club, match, and standings data
- Restrictions: may require a subscription and request limits
- Notes: useful for a managed API layer if supported

### 3. API-Football

- Purpose: player, club, fixture, and team statistics
- Coverage: varies by plan and season
- Restrictions: free tier limitations and rate limits
- Notes: suitable for supplemental current-season or recent historical records where available

### 4. StatsBomb Open Data

- Purpose: event-level tactical and possession data
- Coverage: selected competitions and seasons only
- Requirements: preserve attribution and respect dataset usage rules
- Notes: recommended for tactical analysis where coverage exists

### 5. Kaggle

- Purpose: historical quantitative datasets
- Coverage: depends on the specific dataset
- Restrictions: licensing and provenance vary by file and uploader
- Notes: useful for supplementary historical training data when legally usable

### 6. Transfermarkt-derived datasets

- Purpose: market-value and player profile history
- Coverage: historical valuation records
- Restrictions: verify usage and attribution rules carefully
- Notes: useful for transfer intelligence but not as a guaranteed live feed

## Planned data entities

- Teams
- Players
- Seasons
- Matches
- Player appearances
- Team match statistics
- Tactical events
- Player valuations
- Data sources
- Model runs

## Missing and unsupported metrics

- Event data coverage may not exist for all current-season matches.
- Player market valuation data may be incomplete across seasons.
- Some tactical metrics require event-level or tracking-level data not present in public historical sets.
- Team or player records may require normalization and deduplication across provider sources.

## Provenance requirements

Every data record should retain:

- provider name
- original source identifier
- retrieval timestamp
- season
- match or player identifier
- transformation history

## Local data folder plan

- `backend/data/raw/`: raw provider snapshots
- `backend/data/processed/`: cleaned and normalized datasets
- `backend/data/analytical/`: analytical training and reporting data

## Current status

The first executable adapter is `backend/ingestion/football_data_csv.py`. It imports a locally supplied football-data.co.uk `E0` CSV into a normalized match JSON file and records the source file digest, source row number, and ingestion timestamp. No external files are downloaded automatically. The adapter covers final scores and match dates only; it does not provide player, event, or tactical data.

The import timestamp records when the local pipeline processed the source, not when the provider originally published or the user downloaded it. Provider licensing and redistribution terms still require review before broader use.

The initial PostgreSQL schema is defined in `backend/migrations/001_initial_schema.sql`. It normalizes competitions, seasons, teams, matches, data sources, ingestion runs, and match provenance. `backend/ingestion/postgres_loader.py` validates the normalized JSON and loads it transactionally, including a provenance link for each row. Applying migrations and loading data require a locally running PostgreSQL instance; the schema has not been exercised against a live database in this environment.
