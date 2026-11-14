# Engineering Decisions

## 2026-11-14

### Stack selection

- Use Next.js App Router for the frontend to align with the requirement for six independent routes and progressive web-app style analytics.
- Use FastAPI for the backend because it supports rapid API documentation and Python-based data-science integration.
- Keep PostgreSQL as the canonical relational store, with DuckDB and Parquet for analytical transformations.

### Project structure

- Maintain a clear separation between the frontend application, FastAPI backend, and machine-learning/data folders.
- Favor modular service boundaries over single monolithic files, especially for analytics and ingestion.

### Data strategy

- Treat source-provenance tracking as a core requirement.
- Avoid hardcoded 2026/27 club assumptions; use verified data-driven sources where available.
- Preserve raw and processed data separately to maintain reproducibility.

### GitHub workflow

- Keep the repository local-first while GitHub authentication is unavailable.
- Do not push or claim remote-sync success until authentication is present.
