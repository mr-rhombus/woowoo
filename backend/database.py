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
    def get_party_guests(self, full_name: str, cur: psycopg.Cursor) -> list[tuple[str]]:
        """Get data for all guests associated with the provided full name.

        Args:
            last_name (str): A guest's full name
            cur (psycopg.Cursor): An object to send commands to the PG DB session

        Returns:
            list[tuple[str]]: Information for guests associated with the provided full name
        """
        name_split = full_name.split()
        fn = name_split[0]
        ln = " ".join(name_split[1:])
        _sql = f"""
            SELECT *
            FROM guests
            WHERE group_id IN (
                SELECT group_id
                FROM guests
                WHERE LOWER(last_name) LIKE '%{ln.lower()}%'
                AND (
                    '{fn.lower()}' LIKE CONCAT('%', LOWER(first_name), '%')
                    OR LOWER(first_name) LIKE '%{fn.lower()}%'
                )    
            );
        """
        cur.execute(_sql)
        return cur.fetchall()

    @connect
    def get_all_guests(self, cur: psycopg.Cursor) -> list[tuple[str]]:
        """Return information about all guests.

        Args:
            cur (psycopg.Cursor): An object to send commands to the PG DB session

        Returns:
            list[tuple[str]]: All information about all guests
        """
        _sql = "SELECT * FROM guests"
        cur.execute(_sql)
        return cur.fetchall()

    @connect
    def update_rsvp_status(self, payload: dict[str, str], cur: psycopg.Cursor) -> None:
        """Update guest RSVP status.

        Args:
            payload (dict[str, str]): The guest names and their RSVP statuses
            cur (psycopg.Cursor): An object to send commands to the PG DB session
        """
        _sql = f"""
        UPDATE guests as t
        SET rsvp = j.value
        FROM JSON_EACH_TEXT('{json.dumps(payload)}'::json) as j(key, value)
        WHERE t.full_name = j.key;
        """
        cur.execute(_sql)
