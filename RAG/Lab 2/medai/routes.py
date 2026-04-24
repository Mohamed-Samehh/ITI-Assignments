from flask import Blueprint, jsonify, request, send_from_directory

from .agent import get_cases, history_count, reset_history, run_agent
from .config import BASE_DIR

api = Blueprint("api", __name__)


@api.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@api.route("/api/chat", methods=["POST"])
def chat():
    data = request.json or {}
    user_message = data.get("message", "")
    image_data = data.get("image_data")
    image_type = data.get("image_type", "image/jpeg")

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    result = run_agent(user_message, image_data, image_type)
    if result.get("error"):
        return jsonify(result), 500
    return jsonify(result)


@api.route("/api/cases", methods=["GET"])
def cases():
    return jsonify({"cases": get_cases()})


@api.route("/api/reset", methods=["POST"])
def reset():
    reset_history()
    return jsonify({"status": "reset"})


@api.route("/api/history", methods=["GET"])
def history():
    count = history_count()
    return jsonify({"count": count, "messages": count})
