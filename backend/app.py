# Flask app for handling game search requests
from flask import Flask, request, jsonify

# controls allowed browser based website requests to backend
from flask_cors import CORS
import requests
import os

#get variables from .env file
from dotenv import load_dotenv

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

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
