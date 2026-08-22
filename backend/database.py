import functools
import json

import psycopg


class PGHandler:
    """Wrapper class to handle PostgreSQL DB operations"""

    def __init__(self, db_url: str):
        """Initialize the PGHandler class

        Args:
            db_url (str): The URL where the PG database is hosted
        """
        self.db_url = db_url

    def connect(func):
        """Helper decorator to gracefully handle DB connections"""

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            self = args[0]
            with psycopg.connect(self.db_url) as conn:
                with conn.cursor() as cur:
                    kwargs["cur"] = cur
                    return func(*args, **kwargs)

        return wrapper

    @connect
    def get_party_guests(self, last_name: str, cur: psycopg.Cursor) -> list[tuple[str]]:
        """Get data for all guests with the provided last name

        Args:
            last_name (str): A guest's last name
            cur (psycopg.Cursor): An object to send commands to the PG DB session

        Returns:
            list[tuple[str]]: Information for guests associated with the provided last name
        """
        _sql = f"""
            SELECT *
            FROM guests
            WHERE group_id IN (
                SELECT group_id
                FROM guests
                WHERE LOWER(last_name) LIKE '%{last_name}%');
        """
        cur.execute(_sql)
        return cur.fetchall()

    @connect
    def update_rsvp_status(self, payload: dict[str, str], cur: psycopg.Cursor) -> None:
        """TODO"""
        _sql = f"""
        UPDATE guests as t
        SET rsvp = j.value
        FROM JSON_EACH_TEXT('{json.dumps(payload)}'::json) as j(key, value)
        WHERE t.full_name = j.key;
        """
        cur.execute(_sql)
