#!/bin/bash

python manage.py reset_db
python manage.py loaddata test_fixture.json
