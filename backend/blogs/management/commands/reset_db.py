from django.core.management.base import BaseCommand
from django.core.management.color import no_style
from django.core.management.sql import sql_flush
from django.db import connection
import os


class Command(BaseCommand):
    help = "Truncate all tables in the database"

    def handle(self, *args, **kwargs):

        django_env = os.environ.get("DJANGO_ENV", "production")

        if django_env == "development":
            sql_flush_commands = sql_flush(
                no_style(), connection, allow_cascade=True)
            with connection.cursor() as cursor:
                for statement in sql_flush_commands:
                    cursor.execute(statement)
            print("Tables truncated!")
        else:
            print("Reset_db command not available in production!")
