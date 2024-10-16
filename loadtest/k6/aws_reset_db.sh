CLUSTER_NAME="tpg-ci-cluster"
SERVICE_NAME="ci-backend-service"
REGION="eu-central-1"

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
