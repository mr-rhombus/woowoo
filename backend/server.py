import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.database import PGHandler
from backend.models import Guest, PasswordRequest

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

UI_DIR = os.path.join(os.path.dirname(__file__), "..", "ui")

app.mount("/ui", StaticFiles(directory=UI_DIR, html=True), name="ui")

PG_DB = PGHandler(os.getenv("PG_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows connections from any origin location
    allow_credentials=True,
    allow_methods=["*"],  # Crucial: Allows POST, OPTIONS, GET, etc.
    allow_headers=["*"],
)


@app.get("/")
async def serve_home():
    return FileResponse(os.path.join(UI_DIR, "index.html"))


@app.get("/pages/{folder_name}/{file_name}")
async def serve_page(folder_name: str, file_name: str):
    safe_folder = os.path.basename(folder_name)
    safe_file = os.path.basename(file_name)

    file_path = os.path.join(UI_DIR, "pages", safe_folder, safe_file)

    if os.path.exists(file_path):
        return FileResponse(file_path)

    raise HTTPException(status_code=404, detail="Page not found")


@app.get("/{page_name}")
async def serve_page_simple(page_name: str):
    safe_page = os.path.basename(page_name)

    file_path = os.path.join(UI_DIR, "pages", safe_page, safe_page + ".html")

    if os.path.exists(file_path):
        return FileResponse(file_path)

    raise HTTPException(status_code=404, detail="Page not found")


@app.get("/admin")
async def serve_admin_page():
    return FileResponse(os.path.join(UI_DIR, "pages", "admin", "admin.html"))


@app.post("/api/password/{page}")
def password_is_valid(page: str, payload: PasswordRequest):
    passwords = json.loads(os.getenv("PASSWORDS"))
    return passwords[page] == payload.password


@app.post("/api/find_guests")
def find_matching_guests(payload: dict[str, str]) -> dict[str, list[Guest]]:
    """Find all guests associated with a user-provided last names.

    Args:
        payload (dict[str, str]): The payload containing identifying info about a guest

    Returns:
        dict[str, list[Guest]]: The list of all related guests
    """
    if payload["full_name"] == "":
        return {"guests": []}
    guests = PG_DB.get_party_guests(payload["full_name"])
    field_names = list(Guest.model_fields.keys())
    guests = [Guest.model_validate(dict(zip(field_names, guest))) for guest in guests]
    return {"guests": guests}


@app.get("/api/get_all_guests")
def get_all_guests() -> dict[str, list[Guest]]:
    """Get information about all guests.

    Returns:
        dict[str, list[Guest]]: The list of all guests
    """
    guests = PG_DB.get_all_guests()
    field_names = list(Guest.model_fields.keys())
    guests = [Guest.model_validate(dict(zip(field_names, guest))) for guest in guests]
    return {"guests": guests}


@app.post("/api/update_rsvp")
def update_rsvp(payload: dict[str, str]):
    """Update guest RSVP status in the database

    Args:
        payload (dict[str, str]): The payload mapping guest names to their RSVP status
    """
    PG_DB.update_rsvp_status(payload)
