# Premier League Intelligence

A local-first Premier League analytics platform for data engineering, player analytics, tactical intelligence, transfer valuation, and Monte Carlo season simulation.

## Status

The Phase 0 blueprint, the Phase 1 local API foundation, and the Phase 2 frontend shell are now in place locally. The application foundation has been built in the workspace with a pastel editorial design system, six route pages, and a working FastAPI data layer that serves mock analytics payloads while the real provider-audit pipeline remains in progress.

## Product scope

- Intelligence Overview
- Player Lab
- Team Intelligence
- Tactical Lab
- Transfer Intelligence
- Season Simulator

## Tech stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Lucide, Apache ECharts
- Backend: Python, FastAPI, Pydantic, SQLAlchemy, HTTPX
- Data: Pandas, NumPy, SciPy, DuckDB, Parquet, PostgreSQL
- ML: Scikit-learn, XGBoost, statsmodels
- Testing: Vitest, Pytest, Playwright

## Repository structure

```text
premier-league-intelligence/
├── frontend/
├── backend/
├── docs/
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml
└── ...
```

## Local setup

1. Install Node.js 20+ and Python 3.11+.
2. Create a Python virtual environment.
3. Install frontend dependencies in `frontend/`.
4. Install backend dependencies in the project environment.
5. Configure `.env` from `.env.example`.
6. Start PostgreSQL locally with Docker Compose.
7. Run the backend and frontend.

## Importing local match data

The first ingestion adapter accepts a locally obtained football-data.co.uk Premier League (`E0`) CSV. Place downloaded source files in `backend/data/raw/` and run from the repository root:

```powershell
python -m backend.ingestion.football_data_csv backend\data\raw\E0.csv --season 2025-26 --output backend\data\processed\premier-league-2025-26.json
```

The importer validates dates, scores, result codes, duplicate fixtures, and league division, then writes normalized JSON with source-file SHA-256 and row provenance. It does not download data; confirm source terms before using or redistributing datasets.

## PostgreSQL schema

The initial schema migration is `backend/migrations/001_initial_schema.sql`. With the local PostgreSQL service running, apply it from PowerShell at the repository root:

```powershell
Get-Content -Raw backend\migrations\001_initial_schema.sql | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U postgres -d premier_league_intelligence
```

The migration is safe to re-run and records its version in `schema_migrations`. It creates competition/season/team dimensions, match results, source records, ingestion runs, and per-match provenance. The CSV importer produces the validated processed JSON file; a separate loader below writes it into PostgreSQL.

After importing a source CSV and applying the migration, load its normalized JSON:

```powershell
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/premier_league_intelligence"
python -m backend.ingestion.postgres_loader backend\data\processed\premier-league-2025-26.json
```

The loader validates the payload before connecting and writes all records in one transaction. Re-running it does not duplicate matches, but records a separate ingestion run and provenance link. The database driver is listed in `backend/requirements.txt`; the command reports an error if it is unavailable and does not install it.

## Verified local checks

- `cd frontend && npm run lint` -> Passed
- `cd frontend && npm run build` -> Passed
- `python -m compileall backend` -> Passed
- `python -m unittest discover -s backend/tests` -> Passed

## Notes

- Public deployment is not authorized yet.
- Data-source licensing and API limits must be reviewed before production use.
- Remote GitHub sync is blocked until GitHub authentication is available in the environment.

## Docs

- [docs/PROGRESS.md](docs/PROGRESS.md)
- [docs/PROJECT_BLUEPRINT.md](docs/PROJECT_BLUEPRINT.md)
- [docs/DATA_CATALOG.md](docs/DATA_CATALOG.md)
- [docs/DECISIONS.md](docs/DECISIONS.md)
- [docs/CHANGELOG.md](docs/CHANGELOG.md)
