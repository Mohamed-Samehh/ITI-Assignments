import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env", override=True)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")

DOCS_DIR = BASE_DIR / "ragbot" / "docs"

SPECIALIZATION = "Machine Learning and Artificial Intelligence concepts"
SPECIALIZATION_SHORT = "Machine Learning & AI"

AGENT_NAME = "MLBot"
AGENT_INTRO = (
    f"Hi! I'm {AGENT_NAME}, an assistant specialized in {SPECIALIZATION_SHORT}. "
    "I can answer questions about supervised/unsupervised learning, neural networks, "
    "transformers, embeddings, RAG, fine-tuning, and evaluation metrics. "
    "Feel free to ask me anything within that scope."
)

TOP_K = 3
