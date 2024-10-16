#!/bin/sh

service cron start
if [ "$SET_CRONJOBS" = "local" ]; then
    crontab /scripts/container/cronjobs.txt
elif [ "$SET_CRONJOBS" = "cloud" ]; then
    crontab /scripts/container/cloud_cronjobs.txt
fi
exec "$@"