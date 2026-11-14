# Premier League Intelligence

A local-first Premier League analytics platform for data engineering, player analytics, tactical intelligence, transfer valuation, and Monte Carlo season simulation.

## Status

The Phase 0 blueprint and the Phase 2 frontend shell are now in place locally. The application foundation has been built in the workspace with a pastel editorial design system and six route pages, while the data pipeline and deployment sync remain in active preparation.

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

## Verified local checks

- `cd frontend && npm run lint` -> Passed
- `cd frontend && npm run build` -> Passed
- `python -m compileall backend` -> Passed

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
