from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.data.mock_data import overview, players, simulator, tactics, teams, transfers

app = FastAPI(title="Premier League Intelligence API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "premier-league-intelligence"}


@app.get("/api/overview")
def get_overview():
    return overview


@app.get("/api/players")
def get_players():
    return players


@app.get("/api/teams")
def get_teams():
    return teams


@app.get("/api/tactics")
def get_tactics():
    return tactics


@app.get("/api/transfers")
def get_transfers():
    return transfers


@app.get("/api/simulator")
def get_simulator():
    return simulator
