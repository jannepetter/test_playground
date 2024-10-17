#!/bin/bash

K6_SCRIPT=$1
CASE=$2
RESET=$3
ADDRESS=$4


INFLUXDB_URL="http://influxdb:8086/k6db"

echo "K6_SCRIPT: $K6_SCRIPT"
echo "ADDRESS: $ADDRESS"
echo "case: $CASE"

# CASE 1 -> cloud cronjobs
# CASE 2 -> local cronjobs against cloud, local or whatever

LOG_FILE="/var/log/script_log.log"
LINES=50

if [ "$RESET" = "cloud_reset" ]; then
    sh /scripts/aws_reset_db.sh
elif [ "$RESET" = "reset" ]; then
    docker exec test_playground-server-1 /test_playground/backend/reset_db.sh
fi

if [ "$CASE" = "1" ] && [ "$ADDRESS" ]; then
    /usr/bin/k6 run "/scripts/$K6_SCRIPT" --env TEST_URL=${ADDRESS} > $LOG_FILE
elif [ "$CASE" = "1" ]; then
    /usr/bin/k6 run "/scripts/$K6_SCRIPT" > $LOG_FILE
elif [ "$CASE" = "2" ]  && [ "$ADDRESS" ]; then
    /usr/bin/k6 run --out influxdb="$INFLUXDB_URL" "/scripts/$K6_SCRIPT" --env TEST_URL=${ADDRESS} > $LOG_FILE
elif [ "$CASE" = "2" ]; then
    /usr/bin/k6 run --out influxdb="$INFLUXDB_URL" "/scripts/$K6_SCRIPT" > $LOG_FILE
else
    echo "Invalid action. Usage: $0 script case-{1|2} reset-{reset|cloud_reset} address"
fi

echo $(date) >> $LOG_FILE
tail -n $LINES $LOG_FILE >> /proc/1/fd/1
