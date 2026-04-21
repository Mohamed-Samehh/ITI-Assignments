from flask import Flask, render_template, request, jsonify, session
from chef_graph import chef_app, ChefState
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET", "chef-secret-key-change-me")

# In-memory session store (use Redis/DB in production)
sessions: dict[str, ChefState] = {}


def get_initial_state(creativity=0.7, detail_level="concise") -> ChefState:
    return {
        "messages": [],
        "ingredients": [],
        "suggested_meals": [],
        "chosen_meal": "",
        "current_step": 0,
        "total_steps": 0,
        "recipe_steps": [],
        "phase": "greet",
        "creativity": creativity,
        "detail_level": detail_level,
        "user_input": "",
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/start", methods=["POST"])
def start_chat():
    """Initialize a new chef session."""
    data = request.json or {}
    creativity = float(data.get("creativity", 0.7))
    detail = data.get("detail_level", "concise")
    
    sid = str(uuid.uuid4())
    state = get_initial_state(creativity, detail)
    
    # Run the greet node
    result = chef_app.invoke(state)
    sessions[sid] = result
    
    # Get the last AI message
    ai_msg = ""
    for msg in reversed(result["messages"]):
        if hasattr(msg, "content") and msg.__class__.__name__ == "AIMessage":
            ai_msg = msg.content
            break
    
    return jsonify({
        "session_id": sid,
        "message": ai_msg,
        "phase": result["phase"],
    })


@app.route("/api/chat", methods=["POST"])
def chat():
    """Process user message."""
    data = request.json
    sid = data.get("session_id")
    user_input = data.get("message", "").strip()
    
    if not sid or sid not in sessions:
        return jsonify({"error": "Invalid session. Please start a new chat."}), 400
    
    if not user_input:
        return jsonify({"error": "Please type a message."}), 400
    
    state = sessions[sid]
    state["user_input"] = user_input
    
    # Handle creativity/detail changes mid-conversation
    if data.get("creativity") is not None:
        state["creativity"] = float(data["creativity"])
    if data.get("detail_level"):
        state["detail_level"] = data["detail_level"]
    
    # Run the graph
    result = chef_app.invoke(state)
    sessions[sid] = result
    
    # Extract last AI message
    ai_msg = ""
    for msg in reversed(result["messages"]):
        if hasattr(msg, "content") and msg.__class__.__name__ == "AIMessage":
            ai_msg = msg.content
            break
    
    return jsonify({
        "message": ai_msg,
        "phase": result["phase"],
        "ingredients": result.get("ingredients", []),
        "chosen_meal": result.get("chosen_meal", ""),
        "current_step": result.get("current_step", 0),
        "total_steps": result.get("total_steps", 0),
    })


@app.route("/api/reset", methods=["POST"])
def reset():
    """Reset session."""
    data = request.json or {}
    sid = data.get("session_id")
    if sid and sid in sessions:
        del sessions[sid]
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=8000)