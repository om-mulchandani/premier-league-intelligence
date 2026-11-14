# Premier League Intelligence

A local-first Premier League analytics platform for data engineering, player analytics, tactical intelligence, transfer valuation, and Monte Carlo season simulation.

## Status

This repository is being initialized as a standalone local project in line with the approved Phase 0–2 execution plan. The project is currently structured for a Next.js frontend and FastAPI backend, with the data, ML, and simulation layers planned under `backend/`.

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
└── docker-compose.yml (planned)
```

## Local setup

1. Install Node.js 20+ and Python 3.11+.
2. Create a Python virtual environment.
3. Install frontend dependencies in `frontend/`.
4. Install backend dependencies in the project environment.
5. Configure `.env` from `.env.example`.
6. Start PostgreSQL locally.
7. Run the backend and frontend.

## Notes

- Public deployment is not authorized yet.
- Data-source licensing and API limits must be reviewed before production use.
- Remote GitHub sync is pending GitHub authentication.

## Docs

- [docs/PROGRESS.md](docs/PROGRESS.md)
- [docs/PROJECT_BLUEPRINT.md](docs/PROJECT_BLUEPRINT.md)
- [docs/DATA_CATALOG.md](docs/DATA_CATALOG.md)
- [docs/DECISIONS.md](docs/DECISIONS.md)
- [docs/CHANGELOG.md](docs/CHANGELOG.md)
