import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import PGHandler
from models import Guest

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

PG_DB = PGHandler(os.getenv("PG_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows connections from any origin location
    allow_credentials=True,
    allow_methods=["*"],  # Crucial: Allows POST, OPTIONS, GET, etc.
    allow_headers=["*"],
)


@app.post("/api/lastName")
def find_matching_guests(payload: dict[str, str]) -> dict[str, list[Guest]]:
    """Find all guests associated with a user-provided last names.

    Args:
        payload (dict[str, str]): The payload containing identifying info about a guest

    Returns:
        dict[str, list[Guest]]: The list of all related guests
    """
    guests = PG_DB.get_party_guests(payload["last_name"])
    field_names = list(Guest.model_fields.keys())
    guests = [Guest.model_validate(dict(zip(field_names, guest))) for guest in guests]
    return {"guests": guests}


@app.post("/api/update_rsvp")
def update_rsvp(payload: dict[str, str]):
    """TODO"""
    PG_DB.update_rsvp_status(payload)
