# Project Blueprint

## Goal

Create a Premier League intelligence platform covering all 20 clubs with a premium editorial analytics design, a modular frontend, a FastAPI backend, analytical pipelines, and simulation tooling.

## Functional domains

1. Intelligence Overview
2. Player Lab
3. Team Intelligence
4. Tactical Lab
5. Transfer Intelligence
6. Season Simulator

## Architectural plan

- Frontend: `frontend/` using Next.js and TypeScript.
- Backend: `backend/app/` using FastAPI and SQLAlchemy.
- Data intake: `backend/ingestion/` and `backend/data/`.
- Analytics and ML: `backend/analytics/`, `backend/machine_learning/`, `backend/simulation/`.
- Documentation: `docs/` containing status, architecture, data catalog, and decisions.

## Data strategy

- Start with a verified Premier League dataset model and a provider audit.
- Map feature requirements to available provider coverage.
- Track sources, season coverage, and missing metrics in the central data catalog.

## Delivery order

- Phase 0: Architecture and data-source audit
- Phase 1: Data foundation and ingestion
- Phase 2: Frontend design system and six routes
- Phase 3–8: Analytics, ML, simulation, validation, and final handover

## Risks and constraints

- Some external data providers may have restricted access or licensing terms.
- Full current-season tactical coverage may not exist in public open datasets.
- GitHub sync requires authentication and is presently blocked by lack of login.
