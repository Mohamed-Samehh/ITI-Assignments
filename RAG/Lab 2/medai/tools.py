import csv
import datetime
import json
from pathlib import Path

from langchain_core.tools import tool
from tavily import TavilyClient

from .config import CASES_FILE, TAVILY_API_KEY

medical_prompt = """you are a medical assistant agent that helps patients understand their symptoms.
user may upload image descriptions and patient information.
use tools when needed, especially when user asks to find nearby hospitals.
never provide a diagnosis, and always ask user to consult a doctor.
"""


def init_csv(cases_file: Path) -> None:
    if not cases_file.exists():
        with cases_file.open("w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(
                [
                    "case_id",
                    "timestamp",
                    "symptoms",
                    "mri_description",
                    "summary",
                    "insights",
                    "disclaimer",
                ]
            )


def _search_hospitals(condition: str, location: str) -> dict:
    hospitals = {
        "cairo": [
            {
                "name": "Cairo University Hospital",
                "specialty": condition,
                "address": "Kasr Al-Ainy St, Cairo",
                "phone": "+20-2-2364-7000",
            },
            {
                "name": "As-Salam International Hospital",
                "specialty": condition,
                "address": "Corniche El Nil, Maadi, Cairo",
                "phone": "+20-2-2524-0250",
            },
        ],
        "alexandria": [
            {
                "name": "Alexandria University Hospital",
                "specialty": condition,
                "address": "Champollion St, Alexandria",
                "phone": "+20-3-487-0000",
            }
        ],
        "default": [
            {
                "name": "Nearest General Hospital",
                "specialty": condition,
                "address": "Search hospitals near you",
                "phone": "Emergency: 123",
            }
        ],
    }

    location_key = location.lower() if location.lower() in hospitals else "default"
    return {
        "hospitals": hospitals[location_key],
        "condition": condition,
        "location": location,
    }


def _store_case(cases_file: Path, symptoms: str, summary: str, insights: str, mri_description: str = "") -> dict:
    timestamp = datetime.datetime.now().isoformat()
    case_id = f"CASE-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"

    with cases_file.open("a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(
            [
                case_id,
                timestamp,
                symptoms,
                mri_description,
                summary,
                insights,
                "This is not a medical diagnosis. Consult a doctor.",
            ]
        )

    return {"case_id": case_id, "status": "stored", "timestamp": timestamp}


@tool("WebSearch")
def web_search(condition: str, location: str) -> str:
    """search for the nearest hospital based on condition and location"""
    if not TAVILY_API_KEY:
        return json.dumps({"error": "TAVILY_API_KEY is missing"})

    tavily_client = TavilyClient(api_key=TAVILY_API_KEY)
    query = f"nearest hospital for {condition} near {location}"
    response = tavily_client.search(query)
    return json.dumps(response)


@tool
def search_hospitals(condition: str, location: str) -> str:
    """search local hospital list based on condition and location"""
    return json.dumps(_search_hospitals(condition, location))


@tool
def store_case(symptoms: str, summary: str, insights: str, mri_description: str = "") -> str:
    """store patient case data in csv"""
    return json.dumps(_store_case(CASES_FILE, symptoms, summary, insights, mri_description))


def get_agent_tools() -> list:
    return [web_search, search_hospitals, store_case]
