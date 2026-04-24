import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "openai:gpt-4.1")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")
MAX_MESSAGES = int(os.getenv("MAX_MESSAGES", "10"))
CASES_FILE = BASE_DIR / "cases.csv"
