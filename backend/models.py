from pydantic import BaseModel


class Guest(BaseModel):
    full_name: str
    first_name: str | None
    last_name: str | None
    group_id: int
    rsvp: str | None
    is_plus_one: bool
    sort_order: int | None


class PasswordRequest(BaseModel):
    password: str
