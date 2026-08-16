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
    guests = [
        Guest.model_validate(
            {
                "full_name": guest[0],
                "first_name": guest[1],
                "last_name": guest[2],
                "group_id": guest[3],
            }
        )
        for guest in guests
    ]
    return {"guests": guests}
