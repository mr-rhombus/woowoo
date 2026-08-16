from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows connections from any origin location
    allow_credentials=True,
    allow_methods=["*"],  # Crucial: Allows POST, OPTIONS, GET, etc.
    allow_headers=["*"],
)


@app.post("/api/lastName")
def get_party(payload: dict):
    return {"msg": "success!"}
