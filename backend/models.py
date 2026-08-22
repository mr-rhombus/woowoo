from pydantic import BaseModel


class Guest(BaseModel):
    full_name: str
    first_name: str
    last_name: str
    group_id: int
    rsvp: str | None
