#!/bin/sh

python manage.py migrate
python manage.py loaddata test_fixture.json
