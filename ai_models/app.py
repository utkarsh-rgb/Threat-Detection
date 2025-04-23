# app.py

from flask import Flask, request, jsonify
import joblib
import traceback
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and vectorizer
try:
    model = joblib.load("threat_model.pkl")
    vectorizer = joblib.load("vectorizer.pkl")
except Exception as e:
    print("❌ Failed to load model/vectorizer:", e)
    model = None
    vectorizer = None

KEYWORD_FILE = "keywords.json"

@app.route("/")
def index():
    return "🚀 Threat Detection Model API is running."

@app.route("/predict", methods=["POST"])
def predict():
    if not model or not vectorizer:
        return jsonify({"error": "Model/vectorizer not loaded"}), 500

    try:
        data = request.get_json()
        text = data.get("text", "")

        if not text:
            return jsonify({"error": "No text provided"}), 400

        features = vectorizer.transform([text])
        prediction = model.predict(features)[0]

        return jsonify({
            "text": text,
            "threat": bool(prediction)
        })

    except Exception as e:
        return jsonify({
            "error": "Prediction failed",
            "message": str(e),
            "trace": traceback.format_exc()
        }), 500

@app.route("/add-keyword", methods=["POST"])
def add_keyword():
    data = request.get_json()
    keyword = data.get("keyword", "").strip()

    if not keyword:
        return jsonify({"message": "Keyword is empty!"}), 400

    # Ensure the file exists
    if not os.path.exists(KEYWORD_FILE):
        with open(KEYWORD_FILE, "w") as f:
            json.dump([], f)

    with open(KEYWORD_FILE, "r+") as f:
        keywords = json.load(f)
        if keyword not in keywords:
            keywords.append(keyword)
            f.seek(0)
            json.dump(keywords, f, indent=2)
            f.truncate()
            return jsonify({"message": "✅ Keyword added successfully!"})
        else:
            return jsonify({"message": "⚠️ Keyword already exists!"}), 409

if __name__ == "__main__":
    app.run(debug=True, port=5000)
