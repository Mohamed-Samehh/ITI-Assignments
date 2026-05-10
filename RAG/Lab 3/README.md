# Lab 3 — Agentic RAG Chatbot (MLBot)

A Flask + HTML/CSS/JS chatbot powered by an **agentic RAG** pipeline built with
LangGraph. The agent specializes in **Machine Learning & AI concepts** and
routes every user query through one of three paths.

## Behavior

For each user message, the agent does the following:

1. **Classify topic** — is this query inside the agent's specialization?
   - **Out of scope** → the agent introduces / identifies itself.
2. **Retrieve from KB** — embed the query, top-k vector search over the
   knowledge base.
3. **Grade relevance** — judge whether the retrieved chunks actually answer
   the question.
   - **Relevant** → **generate** an answer grounded in the retrieved chunks.
   - **Not relevant** → reply with `"I don't know."`

This matches the three required scenarios:

| User query                         | Route          | Reply                          |
|------------------------------------|----------------|--------------------------------|
| Outside specialization             | `out_of_scope` | Self-introduction              |
| In specialization, in KB           | `rag_hit`      | Grounded answer from documents |
| In specialization, **not** in KB   | `rag_miss`     | `I don't know.`                |

The sidebar shows the agent's reasoning trace for every turn: route,
classification, relevance, and the retrieved chunks.

## Architecture

```
User
 │
 ▼
classify ──out──▶ intro      ──▶ END
 │
 in
 ▼
retrieve ──▶ grade ──relevant──▶ generate ──▶ END
              │
              not_relevant
              ▼
              idk ("I don't know.") ──▶ END
```

- **Frontend**: `templates/index.html`, `static/style.css`, `static/script.js`.
- **Flask app**: `app.py` and `ragbot/routes.py`.
- **Agent graph**: `ragbot/agent.py` (LangGraph `StateGraph`).
- **Vector retrieval**: `ragbot/retriever.py` (FAISS + OpenAI embeddings).
- **Knowledge base**: `ragbot/docs/*.md` — 8 curated ML/AI topics.

## Setup

```bash
cd "RAG/Lab 3"
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# edit .env and set OPENAI_API_KEY
```

## Run

```bash
python app.py
```

Open <http://localhost:8000>.

## Try it

- "What is supervised learning?" → grounded answer from `01_supervised_learning.md`.
- "Explain self-attention." → grounded answer from `04_transformers.md`.
- "How are embeddings used in RAG?" → grounded answer combining multiple docs.
- "What is the capital of France?" → out of scope, agent introduces itself.
- "What is reinforcement learning from human feedback?" → in scope but not
  deeply covered in the KB → `"I don't know."`

## Configuration

Environment variables (see `.env.example`):

- `OPENAI_API_KEY` — required.
- `OPENAI_MODEL` — default `gpt-4o-mini`.
- `EMBEDDING_MODEL` — default `text-embedding-3-small`.
