overview = {
  "kpis": [
    {"label": "Matches played", "value": 380, "change": 12},
    {"label": "Goals scored", "value": 1042, "change": 44},
    {"label": "Avg goals / match", "value": 2.74, "change": 0.12},
    {"label": "Top scorer", "value": "Haaland", "change": "18 goals"},
    {"label": "Clean sheets", "value": 86, "change": 5},
  ],
  "standings": [
    {"club": "Liverpool", "position": 1, "played": 12, "gd": 17, "points": 30, "form": "W W D W W"},
    {"club": "Arsenal", "position": 2, "played": 12, "gd": 13, "points": 28, "form": "W D W L W"},
    {"club": "Man City", "position": 3, "played": 12, "gd": 10, "points": 25, "form": "W D W D W"},
    {"club": "Chelsea", "position": 4, "played": 12, "gd": 7, "points": 24, "form": "D W L W W"},
  ],
  "insights": [
    "Liverpool are converting a higher share of high-value chances than their expected-goals profile suggests.",
    "Arsenal’s pressing structure is producing the league’s strongest turnover rate in the final third.",
    "Chelsea’s expected-goals conceded has improved sharply over the last five fixtures.",
  ],
}

players = [
  {"name": "Mohamed Salah", "club": "Liverpool", "position": "RW", "goals": 14, "assists": 9, "xg": 12.7, "xa": 8.1},
  {"name": "Erling Haaland", "club": "Man City", "position": "ST", "goals": 18, "assists": 6, "xg": 17.3, "xa": 5.2},
  {"name": "Bukayo Saka", "club": "Arsenal", "position": "RW", "goals": 11, "assists": 8, "xg": 10.9, "xa": 9.4},
  {"name": "Rodri", "club": "Man City", "position": "CM", "goals": 4, "assists": 6, "xg": 3.2, "xa": 5.5},
]

teams = [
  {"club": "Liverpool", "points": 30, "xg": 27.3, "xga": 11.4, "form": "W W D W W"},
  {"club": "Arsenal", "points": 28, "xg": 24.7, "xga": 13.5, "form": "W D W L W"},
  {"club": "Man City", "points": 25, "xg": 22.1, "xga": 12.6, "form": "W D W D W"},
  {"club": "Chelsea", "points": 24, "xg": 21.4, "xga": 15.3, "form": "D W L W W"},
]

tactics = {
  "coverage": {
    "current_match_coverage": "82%",
    "shot_map_coverage": "76%",
    "passing_network_coverage": "68%",
    "pressing_indicators": "Limited",
  },
  "formation": [
    {"position": "GK"},
    {"position": "LB"},
    {"position": "CB"},
    {"position": "CB"},
    {"position": "RB"},
    {"position": "LM"},
    {"position": "CM"},
    {"position": "CAM"},
    {"position": "CM"},
    {"position": "RM"},
    {"position": "CF"},
    {"position": "ST"},
    {"position": "LW"},
    {"position": "RW"},
  ],
}

transfers = [
  {"name": "M. Rashford", "club": "Villa", "age": 27, "listed": 55, "model": 61, "gap": 6},
  {"name": "E. Eze", "club": "Crystal Palace", "age": 26, "listed": 42, "model": 49, "gap": 7},
  {"name": "B. Saka", "club": "Arsenal", "age": 23, "listed": 110, "model": 118, "gap": 8},
  {"name": "J. Bellingham", "club": "Real Madrid", "age": 21, "listed": 180, "model": 171, "gap": -9},
]

simulator = {
  "probabilities": [
    {"club": "Liverpool", "title": 23.4, "top4": 76.2, "relegation": 0.1},
    {"club": "Arsenal", "title": 19.8, "top4": 71.4, "relegation": 0.2},
    {"club": "Man City", "title": 16.9, "top4": 68.9, "relegation": 0.3},
    {"club": "Everton", "title": 0.3, "top4": 2.7, "relegation": 32.1},
  ],
  "summary": {
    "title_leader": "Liverpool",
    "top4_leader": "Liverpool",
    "relegation_leader": "Everton",
  },
}
