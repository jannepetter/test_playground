#!/bin/bash

environment=${environment:=ci}
CLUSTER_NAME="tpg-${environment}-cluster"
SERVICE_NAME="${environment}-backend-service"
REGION="eu-central-1"

echo "Cluster Name: $CLUSTER_NAME"
echo "Service Name: $SERVICE_NAME"

source /etc/environment

if [ "$1" = "testrunner" ]; then
    TASK_ID=$(/usr/local/bin/aws ecs list-tasks --cluster "$CLUSTER_NAME" --service-name "$SERVICE_NAME" --desired-status RUNNING --query "taskArns[0]")
    TASK_ID=${TASK_ID##*/}      # Get Task ID from ARN
    TASK_ID=${TASK_ID%\"} 

    stdbuf -oL -eL /usr/local/bin/aws ecs execute-command \
        --cluster "$CLUSTER_NAME" \
        --task "$TASK_ID" \
        --container "ci-backend" \
        --interactive \
        --command "sh reset_db.sh" \
        --output text
else
    TASK_ID=$(aws ecs list-tasks --cluster "$CLUSTER_NAME" --service-name "$SERVICE_NAME" --query "taskArns[0]")

    TASK_ID=${TASK_ID##*/}      # Get Task ID from ARN
    TASK_ID=${TASK_ID%\"} 

    aws ecs execute-command \
        --cluster "$CLUSTER_NAME" \
        --task "$TASK_ID" \
        --container "ci-backend" \
        --interactive \
        --command "sh reset_db.sh" \
        --output text
fi
