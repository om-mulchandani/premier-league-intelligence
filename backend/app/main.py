from fastapi import FastAPI

app = FastAPI(title="Premier League Intelligence API")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "premier-league-intelligence"}
