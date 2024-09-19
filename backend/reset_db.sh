#!/bin/bash

USER="postgres"
DATABASE="postgres"

# SQL_SHOW_SEQUENCES="SELECT * FROM pg_sequences;"
# docker-compose exec -T db psql -U "$USER" -d "$DATABASE" -c "$SQL_SHOW_SEQUENCES"

SQL_TRUNCATE="TRUNCATE TABLE auth_user, auth_user_groups, auth_user_user_permissions, auth_permission, auth_group, auth_group_permissions, django_admin_log, django_content_type, django_session, authtoken_token CASCADE;"
SQL_RESET_SEQUENCES="ALTER SEQUENCE blogs_blog_id_seq RESTART WITH 1;ALTER SEQUENCE auth_user_id_seq RESTART WITH 1;"

docker-compose exec -T db psql -U "$USER" -d "$DATABASE" -c "$SQL_TRUNCATE $SQL_RESET_SEQUENCES"

python manage.py loaddata test_fixture.json
