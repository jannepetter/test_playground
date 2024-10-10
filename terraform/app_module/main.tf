data "aws_vpc" "main" {
  filter {
    name   = "tag:Name"
    values = ["tpg-vpc-${var.environment}"]
  }
}
data "aws_subnet" "public_subnet" {
  vpc_id = data.aws_vpc.main.id
  filter {
    name   = "tag:Name"
    values = ["${var.environment}-public-subnet"]
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

data "aws_lb_target_group" "frontend_tg" {
  name        = "${var.environment}-frontend-tg"
}

resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([{
    name  = "${var.environment}-frontend"
    image = "${var.AWS_ACCOUNT_ID}.dkr.ecr.eu-central-1.amazonaws.com/${var.AWS_REPO}:frontend"

    portMappings = [
      {
        name          = "${var.environment}-frontend",
        containerPort = 3000,
        hostPort      = 3000,
        protocol      = "tcp",
        appProtocol   = "http"
      }
    ],
    essential = true,
  }])
}

data "aws_security_group" "front_sg" {
  vpc_id = data.aws_vpc.main.id
  name   = "${var.environment}-front-sg"
}

resource "aws_ecs_service" "frontend_service" {
  name            = "${var.environment}-frontend-service"
  cluster         = data.aws_ecs_cluster.tpg_ci_cluster.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [data.aws_subnet.public_subnet.id]
    security_groups  = [data.aws_security_group.front_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = data.aws_lb_target_group.frontend_tg.arn
    container_name   = "${var.environment}-frontend"
    container_port   = 3000
  }
  lifecycle {
    ignore_changes = [
      cluster
    ]
    create_before_destroy = true
  }
}

data "aws_lb_target_group" "backend_tg" {
  name        = "${var.environment}-backend-tg"
}

resource "aws_cloudwatch_log_group" "ecs_backend_log_group" {
  name              = "/ecs/${var.environment}/backend-service"
  retention_in_days = 3
}

resource "aws_iam_policy" "ssm_policy" {
  name        = "${var.environment}-ECSExecPolicy"
  description = "Policy to allow ECS Exec for SSM commands"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
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
  name = "${var.environment}-ECSTaskRole"
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

data "aws_db_instance" "postgresql_from_snapshot" {
  db_instance_identifier = "tpg-${var.environment}-db"
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([{
    name  = "${var.environment}-backend"
    image = "${var.AWS_ACCOUNT_ID}.dkr.ecr.eu-central-1.amazonaws.com/${var.AWS_REPO}:server"
    portMappings = [{
      containerPort = 8000
      hostPort      = 8000
      protocol      = "tcp"
      appProtocol   = "http"
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "${aws_cloudwatch_log_group.ecs_backend_log_group.name}"
        awslogs-region        = "eu-central-1"
        awslogs-stream-prefix = "ecs"
      }
    }

    environment = [
      {
        name  = "DB_HOST"
        value = "${data.aws_db_instance.postgresql_from_snapshot.address}"
      },
      {
        name  = "POSTGRES_USER"
        value = var.POSTGRES_USER
      },
      {
        name  = "POSTGRES_PASSWORD"
        value = var.POSTGRES_PASSWORD
      },
      {
        name  = "JWT_SIGNING_KEY"
        value = var.JWT_SIGNING_KEY
      },
      {
        name  = "JWT_VERIFYING_KEY"
        value = var.JWT_VERIFYING_KEY
      },
      {
        name  = "DJANGO_SECRET_KEY"
        value = var.DJANGO_SECRET_KEY
      },
      {
        name  = "DJANGO_SETTINGS_MODULE"
        value = "backend.settings_ci"
      }
    ]
    essential = true,
  }])

}
data "aws_security_group" "backend_sg" {
  vpc_id = data.aws_vpc.main.id
  name   = "${var.environment}-backend-sg"
}

resource "aws_ecs_service" "backend_service" {
  name            = "${var.environment}-backend-service"
  cluster         = data.aws_ecs_cluster.tpg_ci_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [data.aws_subnet.public_subnet2.id]
    security_groups  = [data.aws_security_group.backend_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = data.aws_lb_target_group.backend_tg.arn
    container_name   = "${var.environment}-backend"
    container_port   = 8000
  }
  lifecycle {
    ignore_changes = [
      cluster
    ]
    create_before_destroy = true
  }
}
