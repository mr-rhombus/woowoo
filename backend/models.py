from pydantic import BaseModel


class Guest(BaseModel):
    full_name: str
    first_name: str | None
    last_name: str | None
    group_id: int
    rsvp: str | None
    is_plus_one: bool
    sort_order: int | None
    id: int


class PasswordRequest(BaseModel):
    password: str


class GuestUpdatePayload(BaseModel):
    guest_id: int
    full_name: str
