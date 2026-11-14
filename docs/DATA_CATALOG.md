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

This catalog is initially populated with a source review and planned coverage structure. It will be expanded as the ingestion and validation pipeline is implemented.
