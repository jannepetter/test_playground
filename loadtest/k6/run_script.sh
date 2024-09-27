#!/bin/bash

K6_SCRIPT=$1

INFLUXDB_URL="http://influxdb:8086/k6db"

# summary to grafana:
docker-compose -f docker-compose.performance.yml run --rm k6 run --out influxdb="$INFLUXDB_URL" "/scripts/$K6_SCRIPT"
# docker-compose run --rm k6 run --out influxdb="$INFLUXDB_URL" "/scripts/$K6_SCRIPT"

# summary to console:
# docker-compose -f docker-compose.performance.yml run --rm k6 run /scripts/quick.js