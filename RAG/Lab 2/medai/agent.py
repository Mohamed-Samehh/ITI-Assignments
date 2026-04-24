import csv
import json
import re
from typing import Any
from uuid import uuid4

from langchain.agents import AgentState, create_agent
from langchain.agents.middleware import before_agent
from langchain_core.messages import AIMessage, HumanMessage, RemoveMessage, ToolMessage
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.runtime import Runtime

from .config import CASES_FILE, MAX_MESSAGES, OPENAI_API_KEY, OPENAI_MODEL
from .tools import get_agent_tools, init_csv, medical_prompt


@before_agent
def trim_messages(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    """Remove tool messages from memory to keep context small."""
    messages = state["messages"]
    tool_messages = [message for message in messages if isinstance(message, ToolMessage)]
    return {"messages": [RemoveMessage(id=message.id) for message in tool_messages]}


checkpointer = InMemorySaver()
chatbot = create_agent(
    model=OPENAI_MODEL,
    system_prompt=medical_prompt,
    tools=get_agent_tools(),
    checkpointer=checkpointer,
    middleware=[trim_messages],
)
current_thread_id = str(uuid4())
thread_summaries: dict[str, str] = {current_thread_id: ""}

DISCLAIMER = "This is not a medical diagnosis. Consult a doctor."

init_csv(CASES_FILE)


def _build_user_content(user_message: str, image_data: str | None, image_type: str) -> str | list:
    if not image_data:
        return user_message

    image_url = f"data:{image_type};base64,{image_data}"
    return [
        {"type": "text", "text": user_message},
        {"type": "image_url", "image_url": {"url": image_url}},
    ]


def _with_summary_context(user_message: str) -> str:
    summary = thread_summaries.get(current_thread_id, "").strip()
    if not summary:
        return user_message

    return (
        "Conversation summary for context:\n"
        f"{summary}\n\n"
        "Current patient input:\n"
        f"{user_message}"
    )


def _content_to_text(content: str | list) -> str:
    if isinstance(content, str):
        return content

    parts = []
    for item in content:
        if isinstance(item, str):
            parts.append(item)
        elif isinstance(item, dict) and item.get("type") == "text":
            parts.append(item.get("text", ""))
        elif isinstance(item, dict) and "text" in item:
            parts.append(str(item.get("text", "")))

    return "\n".join(part for part in parts if part).strip()


def _latest_turn_messages(messages: list) -> list:
    latest = []
    for message in reversed(messages):
        latest.append(message)
        if isinstance(message, HumanMessage):
            break
    return list(reversed(latest))


def _summarize_for_memory(messages: list, keep_last: int = 6) -> str:
    if len(messages) <= keep_last:
        return ""

    summary_lines = []
    for message in messages[:-keep_last]:
        if isinstance(message, HumanMessage):
            text = _content_to_text(message.content)
            if text:
                summary_lines.append(f"Patient: {text[:180]}")
        elif isinstance(message, AIMessage):
            text = _content_to_text(message.content)
            if text:
                summary_lines.append(f"Assistant: {text[:180]}")

    return "\n".join(summary_lines[-8:]).strip()


def _merge_summary(existing: str, new_summary: str) -> str:
    if not existing:
        return new_summary[:2000]
    if not new_summary:
        return existing[:2000]
    return f"{existing}\n{new_summary}"[-2000:]


def _is_disallowed_medical_output(text: str) -> bool:
    pattern = r"\b(diagnosis|diagnose|prescribe|prescription|dosage|take\s+\d+\s*mg|start\s+medication|stop\s+medication)\b"
    return re.search(pattern, text.lower()) is not None


def _enforce_safe_output(text: str) -> str:
    cleaned = text.strip()
    if _is_disallowed_medical_output(cleaned):
        cleaned = (
            "I can provide general medical information and safety guidance, "
            "but I cannot provide diagnosis or prescriptions. "
            "Please consult a licensed doctor."
        )

    if DISCLAIMER not in cleaned:
        if cleaned:
            cleaned = f"{cleaned}\n\n{DISCLAIMER}"
        else:
            cleaned = DISCLAIMER

    return cleaned


def run_agent(user_message: str, image_data: str | None = None, image_type: str = "image/jpeg") -> dict:
    global current_thread_id

    if not OPENAI_API_KEY:
        return {"error": "OPENAI_API_KEY is missing. Add it to .env."}

    user_content = _build_user_content(_with_summary_context(user_message), image_data, image_type)
    response = chatbot.invoke(
        {"messages": [HumanMessage(content=user_content)]},
        config={"configurable": {"thread_id": current_thread_id}},
    )

    messages = response.get("messages", [])
    latest_messages = _latest_turn_messages(messages)

    tool_call_name_by_id = {}
    tool_uses = []
    for message in latest_messages:
        if not isinstance(message, AIMessage):
            continue
        for tool_call in message.tool_calls or []:
            tool_name = tool_call.get("name", "")
            tool_input = tool_call.get("args", {})
            tool_call_id = tool_call.get("id")
            if tool_call_id:
                tool_call_name_by_id[tool_call_id] = tool_name
            tool_uses.append({"name": tool_name, "input": tool_input})

    tool_results_data = []
    for message in latest_messages:
        if not isinstance(message, ToolMessage):
            continue
        raw_content = _content_to_text(message.content)
        try:
            parsed_result = json.loads(raw_content)
        except json.JSONDecodeError:
            parsed_result = {"raw": raw_content}

        tool_name = getattr(message, "name", "") or tool_call_name_by_id.get(message.tool_call_id, "tool")
        tool_results_data.append({"name": tool_name, "result": parsed_result})

    final_text = ""
    for message in reversed(latest_messages):
        if isinstance(message, AIMessage) and message.content:
            final_text = _content_to_text(message.content)
            if final_text:
                break

    if not final_text:
        final_text = "I could not generate a response right now. Please try again."

    trimmed = False
    if len(messages) > MAX_MESSAGES:
        new_summary = _summarize_for_memory(messages)
        combined_summary = _merge_summary(thread_summaries.get(current_thread_id, ""), new_summary)

        current_thread_id = str(uuid4())
        thread_summaries[current_thread_id] = combined_summary
        trimmed = True

    final_text = _enforce_safe_output(final_text)

    return {
        "response": final_text,
        "tool_uses": tool_uses,
        "tool_results": tool_results_data,
        "message_count": len(messages),
        "trimmed": trimmed,
    }


def get_cases() -> list:
    if not CASES_FILE.exists():
        return []

    with CASES_FILE.open("r") as file:
        reader = csv.DictReader(file)
        return list(reader)


def reset_history() -> None:
    global current_thread_id
    current_thread_id = str(uuid4())
    thread_summaries[current_thread_id] = ""


def history_count() -> int:
    state = checkpointer.get_tuple({"configurable": {"thread_id": current_thread_id}})
    if not state or not state.checkpoint:
        return 0

    channel_values = state.checkpoint.get("channel_values", {})
    messages = channel_values.get("messages", [])
    return len(messages)
