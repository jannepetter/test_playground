import os
from .settings import *

DEBUG = False

# no permanent domain for the app in ci environment -> allow all
ALLOWED_HOSTS = ["*"]

CORS_ORIGIN_ALLOW_ALL = True
