#!/bin/sh

service cron start
if [ "$SET_CRONJOBS" = "1" ]; then
    crontab /scripts/container/cronjobs.txt
fi
exec "$@"