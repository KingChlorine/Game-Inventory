import json
# Flask app for handling game search requests
from flask import Flask, request, jsonify
app = Flask(__name__)

# controls allowed browser based website requests to backend
from flask_cors import CORS
import requests
import os

def load_games():
    try:
        with open("games.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_games(games):
    with open("games.json", "w") as f:
        json.dump(games, f, indent=4)

@app.route("/games", methods=["GET", "POST"])
def games():
    if request.method == "POST":
        new_game = request.json
        games = load_games()
        games.append(new_game)
        save_games(games)
        return jsonify({"message": "Game added successfully!"}), 201
    else:
        games = load_games()
        return jsonify(games)

@app.route("/games/<string:title>", methods=["DELETE"])
def delete_game(title):
    games = load_games()
    if 0 <= title < len(games):
        deleted_game = games.pop(title)
        save_games(games)
        return jsonify({"message": f"Game '{deleted_game['title']}' deleted successfully!"}), 200
    else:
        return jsonify({"error": "Game not found!"}), 404

#get variables from .env file
from dotenv import load_dotenv

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app, origins=[
    "https://kingchlorine.github.io",
     "http://127.0.0.1:5500"
])


# Load .env file
load_dotenv()

# Read secrets from environment variables
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

# Step 1: Get access token
def get_token():
    url = "https://id.twitch.tv/oauth2/token"
    params = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    response = requests.post(url, params=params)
    return response.json()["access_token"]

ACCESS_TOKEN = get_token()

# Step 2: Search endpoint
@app.route("/search")
def search():
    query = request.args.get("query")
    url = "https://api.igdb.com/v4/games"
    headers = {
        "Client-ID": CLIENT_ID,
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }

    # IGDB API query to search for games by name and retrieve their cover images
    body = f'search "{query}"; fields name,cover.url; limit 10;'

    # Make the request to IGDB API
    response = requests.post(url, headers=headers, data=body)
    return jsonify(response.json())

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
