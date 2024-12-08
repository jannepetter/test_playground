from .settings import *  # noqa: F403

DEBUG = False

# no permanent domain for the app in ci environment -> allow all
ALLOWED_HOSTS = ["*"]

CORS_ORIGIN_ALLOW_ALL = True
