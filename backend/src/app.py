from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

#Below is a sample Flask app

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from your React Native app

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/api/data', methods=['POST'])
def get_data():
    content = request.json
    return jsonify({'received': content}), 200

if __name__ == '__main__':
    app.run(debug=True)
