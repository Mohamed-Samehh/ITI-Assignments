from typing import TypedDict

from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, StateGraph

from .config import (
    AGENT_INTRO,
    AGENT_NAME,
    OPENAI_API_KEY,
    OPENAI_MODEL,
    SPECIALIZATION,
)
from .retriever import get_retriever


class AgentState(TypedDict, total=False):
    user_query: str
    classification: str       # "in_scope" or "out_of_scope"
    retrieved_docs: list[dict]
    relevance: str            # "relevant" or "not_relevant"
    answer: str
    route: str                # final route taken: out_of_scope | rag_hit | rag_miss


def _llm(temperature: float = 0.0) -> ChatOpenAI:
    return ChatOpenAI(
        model=OPENAI_MODEL,
        api_key=OPENAI_API_KEY,
        temperature=temperature,
    )


# Nodes

def classify_node(state: AgentState) -> dict:
    """Decide whether the query is within the agent's specialization."""
    query = state["user_query"]
    prompt = f"""You are a strict topic classifier for an assistant whose ONLY specialization is:
{SPECIALIZATION}.

Topics that ARE in scope include: machine learning, deep learning, neural networks,
supervised/unsupervised learning, transformers, attention, embeddings, vector
databases, RAG, fine-tuning, LoRA, evaluation metrics, model training, and related
AI/ML concepts.

Topics that are OUT of scope: greetings, small talk, identity questions, cooking,
sports, history, geography, programming questions unrelated to ML/AI, weather, etc.

User query: "{query}"

Reply with EXACTLY one token: IN or OUT."""
    raw = _llm(0.0).invoke([HumanMessage(content=prompt)]).content.strip().upper()
    classification = "in_scope" if raw.startswith("IN") else "out_of_scope"
    return {"classification": classification}


def retrieve_node(state: AgentState) -> dict:
    retriever = get_retriever()
    docs = retriever.invoke(state["user_query"])
    retrieved = [
        {"source": d.metadata.get("source", "unknown"), "content": d.page_content}
        for d in docs
    ]
    return {"retrieved_docs": retrieved}


def grade_node(state: AgentState) -> dict:
    """Decide if the retrieved chunks actually answer the user's question."""
    query = state["user_query"]
    docs = state.get("retrieved_docs", [])
    if not docs:
        return {"relevance": "not_relevant"}

    joined = "\n\n---\n\n".join(d["content"] for d in docs)
    prompt = f"""You are a strict relevance judge for a retrieval-augmented assistant.

User question: "{query}"

Retrieved context:
\"\"\"
{joined}
\"\"\"

Does the retrieved context contain information that DIRECTLY answers the user's
question? If the context is only loosely related or covers a different concept,
answer NO.

Reply with EXACTLY one token: YES or NO."""
    raw = _llm(0.0).invoke([HumanMessage(content=prompt)]).content.strip().upper()
    relevance = "relevant" if raw.startswith("YES") else "not_relevant"
    return {"relevance": relevance}


def generate_node(state: AgentState) -> dict:
    query = state["user_query"]
    docs = state.get("retrieved_docs", [])
    joined = "\n\n---\n\n".join(d["content"] for d in docs)

    prompt = f"""You are {AGENT_NAME}, an assistant specialized in {SPECIALIZATION}.

Answer the user's question using ONLY the context below. Be clear, accurate,
and concise. If the context partially covers the question, answer what you can
from it and do not invent details outside the context.

Context:
\"\"\"
{joined}
\"\"\"

Question: {query}

Answer:"""
    response = _llm(0.2).invoke([HumanMessage(content=prompt)]).content.strip()
    return {"answer": response, "route": "rag_hit"}


def idk_node(state: AgentState) -> dict:
    return {"answer": "I don't know.", "route": "rag_miss"}


def intro_node(state: AgentState) -> dict:
    return {"answer": AGENT_INTRO, "route": "out_of_scope"}


# Routing

def route_after_classify(state: AgentState) -> str:
    return "retrieve" if state.get("classification") == "in_scope" else "intro"


def route_after_grade(state: AgentState) -> str:
    return "generate" if state.get("relevance") == "relevant" else "idk"


def build_graph():
    g = StateGraph(AgentState)
    g.add_node("classify", classify_node)
    g.add_node("retrieve", retrieve_node)
    g.add_node("grade", grade_node)
    g.add_node("generate", generate_node)
    g.add_node("idk", idk_node)
    g.add_node("intro", intro_node)

    g.add_edge(START, "classify")
    g.add_conditional_edges(
        "classify",
        route_after_classify,
        {"retrieve": "retrieve", "intro": "intro"},
    )
    g.add_edge("retrieve", "grade")
    g.add_conditional_edges(
        "grade",
        route_after_grade,
        {"generate": "generate", "idk": "idk"},
    )
    g.add_edge("generate", END)
    g.add_edge("idk", END)
    g.add_edge("intro", END)

    return g.compile()


_graph = None


def _get_graph():
    global _graph
    if _graph is None:
        _graph = build_graph()
    return _graph


def run_agent(user_query: str) -> dict:
    if not OPENAI_API_KEY:
        return {
            "answer": "OPENAI_API_KEY is missing. Add it to .env to use this agent.",
            "route": "error",
            "classification": "",
            "relevance": "",
            "retrieved_docs": [],
        }

    result = _get_graph().invoke({"user_query": user_query})

    return {
        "answer": result.get("answer", ""),
        "route": result.get("route", ""),
        "classification": result.get("classification", ""),
        "relevance": result.get("relevance", ""),
        "retrieved_docs": [
            {"source": d["source"], "preview": d["content"][:240]}
            for d in result.get("retrieved_docs", [])
        ],
    }
