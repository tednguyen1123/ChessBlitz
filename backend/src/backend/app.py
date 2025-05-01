from flask import Flask, request, jsonify
from flask_cors import CORS  # To handle cross-origin requests
import requests
from backend.functions import *
from typing import Dict, Any, Tuple
from openai import OpenAI
import os
import pyrebase
from dotenv import load_dotenv

load_dotenv()

# Firebase Config Dev Only
config = {
  "apiKey": os.getenv("FIREBASE_API_KEY"),
  "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
  "databaseURL": os.getenv("DATABASE_URL"),
  "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET")
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()
auth = firebase.auth()

# OpenAI API Config
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

openaiclient = OpenAI(
    api_key = OPENAI_API_KEY
)

# Flask Config
app = Flask(__name__)
CORS(app)  # Allow all domains for now (development only)

@app.route("/puzzles/random/", methods=["GET"])
def get_random_puzzle() -> Tuple[Dict[str, Any], int]:
    """Returns random puzzle from Firebase realtime database of puzzles"""
    try:
        puzzle = fetch_random_puzzle(db)
        if validate_puzzle(puzzle):
            return jsonify(puzzle), 200
        return jsonify({"error": "Puzzle does not exist"}), 404
    except:
        return jsonify({"error": "Server function error"}), 500

@app.route("/puzzles/<puzzle_id>/best-moves/<int:move_number>", methods=["GET"])
def get_best_move(puzzle_id: int, move_number: int) -> Tuple[Dict[str, Any], int]:
    """Gets best move based on the puzzle_id and current move_number"""
    try:
        # User Input Error Handling
        condpuzzle, errpuzzle = validate_puzzle_id(db, puzzle_id)
        if not condpuzzle:
            return jsonify({"error": errpuzzle}), 400

        puzzle = fetch_puzzle(db, puzzle_id)
        moves = puzzle["Moves"].split(' ')

        cond, err = validate_puzzle_move(moves, move_number)
        if not cond:
            return jsonify({"error": err}), 400

        # Success
        return jsonify({"best_move": moves[move_number-1]}), 200
    except:
        return jsonify({"error": "Server function error"}), 500

@app.route("/puzzles/<puzzle_id>/hints/<int:move_number>", methods=["GET"])
def gethint(puzzle_id: int, move_number: int, modelversion: str = "gpt-4-turbo") -> Tuple[Dict[str, Any], int]:
    """Send the puzzle_id and move_number to OpenAI for explanation."""
    try:
        # User Input Error Handling
        condpuzzle, errpuzzle = validate_puzzle_id(db, puzzle_id)
        if not condpuzzle:
            return jsonify({"error": errpuzzle}), 400

        puzzle = fetch_puzzle(db, puzzle_id)
        moves = puzzle["Moves"].split(' ')

        cond, err = validate_puzzle_move(moves, move_number)
        if not cond:
            return jsonify({"error": err}), 400

        # OpenAI API Call Formation
        move = moves[move_number-1]
        fen = get_fen(puzzle["FEN"], moves, move_number-1)
        player = get_current_player(fen)

        # OpenAI API Call
        response = openaiclient.responses.create(
            model=modelversion,
            temperature=0.7,
            max_output_tokens=300,
            instructions="You are a chess tutor, and you know how to play chess. You are tutoring a student, and you don't want to provide the best move explicitly, but guide the student towards their own discovery of the move. Please be as brief within two lines.",
            input=f"In the position: {fen} ; the move is for {player}, and the best move is: {move}. Please provide a hint to the student that is not obvious and is not too informative or easy, but reasonable enough."
        )
        response = response.output_text if response else "No explanation available."

        return jsonify({"hint": response}), 200
    except:
        return jsonify({"error": "Error fetching explanation."}), 500
    
@app.route('/sign_up', methods=['POST'])
def sign_up_route() -> Tuple[Dict[str, Any], int]:
    email = request.json.get('email')
    password = request.json.get('password')
    # Validate email and password
    cond_email, err_email = validate_email(email)
    cond_password, err_password = validate_password(password)
    if not cond_email:
        return jsonify({"error": err_email}), 400
    if not cond_password:
        return jsonify({"error": err_password}), 400
    user, message = sign_up(auth, email, password)
    if user:
        return jsonify({"message": message, "user": user}), 201
    else:
        return jsonify({"message": message}), 400

@app.route('/sign_in', methods=['POST'])
def sign_in_route() -> Tuple[Dict[str, Any], int]:
    email = request.json.get('email')
    password = request.json.get('password')
    # Validate email and password
    cond_email, err_email = validate_email(email)
    cond_password, err_password = validate_password(password)
    if not cond_email:
        return jsonify({"error": err_email}), 400
    if not cond_password:
        return jsonify({"error": err_password}), 400
    user, message = sign_in(auth, email, password)
    if user:
        return jsonify({"message": message, "user": user}), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 400

@app.route('/add_profile_info', methods=['POST'])
def add_profile_info_route():
    userUID = request.json.get('userUID')
    name = request.json.get('name')
    username = request.json.get('username')
    country = request.json.get('country')

    response = sign_up_page(db, userUID, name, username, country)
    return response


@app.route("/query", methods=["POST"])
def query():
   data = request.json
   fen = data.get("fen")


   if not fen:
       return jsonify({"error": "FEN notation missing"}), 400


   params = {"fen": fen, "depth": 15}
   response = requests.get(STOCKFISH_API_URL, params=params)


   if response.status_code == 200:
       stockfish_data = response.json()
       if stockfish_data.get("success"):
           eval_score = stockfish_data.get("evaluation", "N/A")
           depth_used = stockfish_data.get("depth", "N/A")  # Grab the depth
           return jsonify({
               "evaluation": eval_score,
               "depth": depth_used
           })
       else:
           return jsonify({"error": stockfish_data.get("data", "Unknown error")}), 400
   else:
       return jsonify({"error": "Stockfish API request failed."}), 500

@app.route("/add-friend", methods=["POST"])
def add_friend():
    package = request.json
    userId = package.get("userId")
    friendId = package.get("friendId")

    response = add_friends(db, userId, friendId)
    return response

@app.route("/theme/<theme>", methods=["POST"])
def apply_theme(theme: str, modelversion: str = "gpt-4-turbo") -> Tuple[Dict[str, Any], int]:
    """Apply a thematic style to chess hint text."""
    try:
        # Get hint from request body
        request_data = request.get_json()
        if not request_data or 'hint' not in request_data:
            return jsonify({"error": "Missing 'hint' in request body"}), 400
        
        hint = request_data['hint']
        
        # Validate inputs
        if not hint.strip():
            return jsonify({"error": "Hint cannot be empty"}), 400
        if not theme.strip():
            return jsonify({"error": "Theme cannot be empty"}), 400
        
        # Call OpenAI API to apply theme
        response = openaiclient.responses.create(
            model=modelversion,
            temperature=0.7,
            max_output_tokens=300,
            instructions=f"You are a creative writer who can rewrite chess hints in different thematic styles while preserving the essential chess guidance.",
            input=f"Please rewrite this chess hint in a {theme} theme while preserving the chess advice: '{hint}'. Keep it concise, within two lines."
        )
        
        themed_hint = response.output_text if response else "Unable to apply theme to hint."
        
        return jsonify({"themed_hint": themed_hint}), 200
    except Exception as e:
        return jsonify({"error": f"Error applying theme: {str(e)}"}), 500

# --- GLOBAL LEADERBOARD ENDPOINT ---
@app.route('/leaderboard/global', methods=['GET'])
def fetch_leaderboard():
    '''Fetches leaderboard globally'''
    try:
        leaderboard = global_leaderboard(db)
        return jsonify(leaderboard), 200
    except Exception as exp:
        return jsonify({"error": f"Failed to retrieve leaderboard: {exp}"}), 500

# --- COMMUNITY LEADERBOARD ENDPOINT ---
@app.route('/leaderboard/community/<string:community_name>', methods=['GET'])
def fetch_community_leaderboard(community_name):
    limit = int(request.args.get("limit", 25))
    try:
        leaderboard = community_leaderboard(db, community_name, limit)
        return jsonify(leaderboard), 200
    except Exception as exp:
        return jsonify({"error": f"Failed to retrieve community leaderboard: {exp}"}), 500

# --- FRIENDS LEADERBOARD ENDPOINT ---
@app.route('/leaderboard/friends/<string:userid>', methods=['GET'])
def fetch_friends_leaderboard(userid):
    limit = int(request.args.get("limit", 25))
    try:
        leaderboard = friends_leaderboard(db, userid, limit)
        return jsonify(leaderboard), 200
    except Exception as exp:
        return jsonify({"error": f"Failed to retrieve friends leaderboard: {exp}"}), 500

@app.route("/puzzles/ids", methods=["GET"])
def get_puzzle_ids():
    try:
        ids = fetch_puzzle_ids(db)
        return jsonify({"puzzle_ids": ids}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch puzzle IDs: {str(e)}"}), 500

@app.route("/puzzles/pv", methods=["POST"])
def get_principal_variation_route():
    data = request.get_json()
    fen = data.get("fen")
    if not fen:
        return jsonify({"error": "Missing 'fen' in request body"}), 400
    try:
        pv = get_principal_variation(fen)
        return jsonify({"principal_variation": [str(move) for move in pv]}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get principal variation: {str(e)}"}), 500

@app.route("/puzzles/score", methods=["POST"])
def get_score_route():
    data = request.get_json()
    fen = data.get("fen")
    if not fen:
        return jsonify({"error": "Missing 'fen' in request body"}), 400
    try:
        score = get_score(fen)
        return jsonify({"score": str(score)}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get score: {str(e)}"}), 500

@app.route("/puzzles/info", methods=["POST"])
def get_info_route():
    data = request.get_json()
    fen = data.get("fen")
    if not fen:
        return jsonify({"error": "Missing 'fen' in request body"}), 400
    try:
        info = get_info(fen)
        return jsonify({"info": str(info)}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get engine info: {str(e)}"}), 500

@app.route("/user/streaks/update", methods=["POST"])
def update_streaks_route():
    data = request.get_json()
    userid = data.get("userid")
    puzzleid = data.get("puzzleid")
    correct = data.get("correct")

    if not all([userid, puzzleid, isinstance(correct, bool)]):
        return jsonify({"error": "Missing or invalid parameters"}), 400

    try:
        update_streaks(db, userid, puzzleid, correct)
        return jsonify({"message": "Streaks updated"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update streaks: {str(e)}"}), 500

def main():
    app.run(debug=False, host='0.0.0.0', port=int(os.getenv("PORT", 5000)))

if __name__ == "__main__":
    main()
