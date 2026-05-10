from flask import Blueprint, jsonify, render_template, request

from .agent import run_agent
from .config import AGENT_INTRO, AGENT_NAME, SPECIALIZATION_SHORT

api = Blueprint("api", __name__)


@api.route("/")
def index():
    return render_template(
        "index.html",
        agent_name=AGENT_NAME,
        specialization=SPECIALIZATION_SHORT,
        intro=AGENT_INTRO,
    )


@api.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "Message is required"}), 400

    result = run_agent(message)
    return jsonify(result)


@api.route("/api/info", methods=["GET"])
def info():
    return jsonify(
        {
            "agent_name": AGENT_NAME,
            "specialization": SPECIALIZATION_SHORT,
            "intro": AGENT_INTRO,
        }
    )
