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
    def update_rsvp_status(
        self, responses: dict[str, str], party_id: int, cur: psycopg.Cursor
    ) -> None:
        """Update guest RSVP status.

        Args:
            responses (dict[str, str]): The guest names and their RSVP statuses
            party_id (int): The party id for the guests
            cur (psycopg.Cursor): An object to send commands to the PG DB session
        """
        _sql = """
        UPDATE guests as t
        SET rsvp = j.value
        FROM JSON_EACH_TEXT(%s::json) as j(key, value)
        WHERE
            t.full_name = j.key AND
            t.group_id = %s;
        """
        cur.execute(_sql, (json.dumps(responses), party_id))

    @connect
    def update_guest_names(
        self, full_name: str, guest_id: int, cur: psycopg.Cursor
    ) -> None:
        """Update guest first, last, and full names.

        Args:
            full_name (str): The guest's full name
            guest_id (int): The guest's id
            cur (psycopg.Cursor): An object to send commands to the PG DB session
        """
        names = full_name.split()
        first_name = names[0]
        last_name = " ".join(names[1:])
        full_name = first_name + " " + last_name
        _sql = f"""
        UPDATE guests as t
        SET
            full_name = '{full_name}',
            first_name = '{first_name}',
            last_name = '{last_name}'
        WHERE t.id = {guest_id}
        """
        cur.execute(_sql)
