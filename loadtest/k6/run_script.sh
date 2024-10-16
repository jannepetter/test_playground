#!/bin/bash

K6_SCRIPT=$1
CASE=$2
ADDRESS=$3


INFLUXDB_URL="http://influxdb:8086/k6db"

echo "K6_SCRIPT: $K6_SCRIPT"
echo "ADDRESS: $ADDRESS"
echo "case: $CASE"

# CASE 1 -> cloud cronjobs
# CASE 2 -> local cronjobs against cloud, local or whatever

if [ "$CASE" = "1" ] && [ "$ADDRESS" ]; then

    echo "Running case 1 with address $ADDRESS"
    k6 run "/scripts/$K6_SCRIPT" --env TEST_URL=${ADDRESS}

elif [ "$CASE" = "1" ]; then

    # from container and address from env
    echo "Running case 1"
    k6 run "/scripts/$K6_SCRIPT"

elif [ "$CASE" = "2" ]  && [ "$ADDRESS" ]; then
    echo "Running case 2 with address $ADDRESS"
    k6 run --out influxdb="$INFLUXDB_URL" "/scripts/$K6_SCRIPT" --env TEST_URL=${ADDRESS}

elif [ "$CASE" = "2" ]; then
    echo "Running case 2"
    k6 run --out influxdb="$INFLUXDB_URL" "/scripts/$K6_SCRIPT" 
else
    echo "Invalid action. Usage: $0 script case address"
fi
