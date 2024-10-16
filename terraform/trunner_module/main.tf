data "aws_vpc" "main" {
  filter {
    name   = "tag:Name"
    values = ["tpg-vpc-${var.environment}"]
  }
}

data "aws_subnet" "public_subnet2" {
  vpc_id = data.aws_vpc.main.id
  filter {
    name   = "tag:Name"
    values = ["${var.environment}-public-subnet2"]
  }
}

data "aws_ecs_cluster" "tpg_ci_cluster" {
  cluster_name = "tpg-${var.environment}-cluster"
}

data "aws_lb" "my_load_balancer" {
    name = "${var.environment}-loadbalancer"
}


resource "aws_iam_policy" "ssm_policy" {
  name        = "${var.environment}-ECSExecPolicyTestrunner"
  description = "Policy to allow ECS Exec for SSM commands"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecs:ExecuteCommand",
          "ecs:DescribeServices",
          "ecs:DescribeTasks",
          "ecs:ListTasks",
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task_role" {
  name = "${var.environment}-ECSTaskRoleTestrunner"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_policy_policy_attachment" {
  policy_arn = aws_iam_policy.ssm_policy.arn
  role       = aws_iam_role.ecs_task_role.name
}

resource "aws_security_group" "testrunner_sg" {
  vpc_id = data.aws_vpc.main.id
  name   = "${var.environment}-testrunner-sg"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}
resource "aws_cloudwatch_log_group" "ecs_testrunner_log_group" {
  name              = "/ecs/${var.environment}/testrunner-service"
  retention_in_days = 3
}

resource "aws_ecs_task_definition" "testrunner_task" {
  family                   = "testrunner-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([{
    name  = "${var.environment}-testrunner"
    image = "${var.AWS_ACCOUNT_ID}.dkr.ecr.eu-central-1.amazonaws.com/${var.AWS_REPO}:testrunner"

    environment = [
      {
        name  = "TEST_URL"
        value = "${data.aws_lb.my_load_balancer.dns_name}"
      },
      {
        name  = "SET_CRONJOBS"
        value = "0"
      }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "${aws_cloudwatch_log_group.ecs_testrunner_log_group.name}"
        awslogs-region        = "eu-central-1"
        awslogs-stream-prefix = "ecs"
      }
    }
  }])

}

resource "aws_ecs_service" "testrunner_service" {
  name            = "${var.environment}-testrunner-service"
  cluster         = data.aws_ecs_cluster.tpg_ci_cluster.id
  task_definition = aws_ecs_task_definition.testrunner_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  enable_execute_command = true

  network_configuration {
    subnets          = [data.aws_subnet.public_subnet2.id]
    security_groups  = [aws_security_group.testrunner_sg.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [
      cluster
    ]
  }
}

