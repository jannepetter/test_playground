provider "aws" {
  region = "eu-central-1"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "tpg_vpc_ci"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-central-1a"

  tags = {
    Name = "PublicSubnet"
  }
}

resource "aws_subnet" "public_subnet2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-central-1b"
  tags = {
    Name = "PublicSubnet2"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_route_table.public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id
}

resource "aws_route_table_association" "public_subnet_association" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_subnet2_association" {
  subnet_id      = aws_subnet.public_subnet2.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table_association" "db_subnet_assosiation" {
  subnet_id      = aws_subnet.db_subnet.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "db_subnet2_assosiation" {
  subnet_id      = aws_subnet.db_subnet2.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_subnet" "db_subnet" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "eu-central-1a"
}

resource "aws_subnet" "db_subnet2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "eu-central-1b"
}

resource "aws_ecs_cluster" "tpg_ci_cluster" {
  name = "tpg_ci_cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_security_group" "load_balancer_sg" {
  vpc_id = aws_vpc.main.id
  name   = "load_balancer_sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

resource "aws_lb" "my_load_balancer" {
  name               = "my-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.load_balancer_sg.id]

  subnets = [aws_subnet.public_subnet.id, aws_subnet.public_subnet2.id]
}

resource "aws_lb_target_group" "frontend_tg" {
  name        = "frontend-tg"
  target_type = "ip"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.my_load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }
}

resource "aws_lb_listener_rule" "api_rule" {
  listener_arn = aws_lb_listener.http_listener.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}


resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/test-cluster-task-role"
  execution_role_arn       = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([{
    name  = "frontend"
    image = "${var.AWS_ACCOUNT_ID}.dkr.ecr.eu-central-1.amazonaws.com/${var.AWS_REPO}:frontend"

    portMappings = [
      {
        name          = "frontend",
        containerPort = 3000,
        hostPort      = 3000,
        protocol      = "tcp",
        appProtocol   = "http"
      }
    ],
    essential = true,
  }])
}

resource "aws_security_group" "front_sg" {
  vpc_id = aws_vpc.main.id
  name   = "front_sg"

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.load_balancer_sg.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "frontend_service" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.tpg_ci_cluster.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_subnet.id]
    security_groups  = [aws_security_group.front_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name   = "frontend"
    container_port   = 3000
  }
}

resource "aws_lb_target_group" "backend_tg" {
  name        = "backend-tg"
  target_type = "ip"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id

  health_check {
    path                = "/api/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_cloudwatch_log_group" "ecs_backend_log_group" {
  name              = "/ecs/backend-service"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/test-cluster-task-role"
  execution_role_arn       = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([{
    name  = "backend"
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
        value = "${aws_db_instance.postgresql_from_snapshot.address}"
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


resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.tpg_ci_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_subnet2.id]
    security_groups  = [aws_security_group.backend_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "backend"
    container_port   = 8000
  }
}

resource "aws_security_group" "backend_sg" {
  vpc_id = aws_vpc.main.id
  name   = "backend_sg"

  ingress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.load_balancer_sg.id]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.3.0/24", "10.0.4.0/24"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "db_sg" {
  vpc_id = aws_vpc.main.id
  name   = "db_sg"
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "main"
  subnet_ids = [aws_subnet.db_subnet.id, aws_subnet.db_subnet2.id]

  tags = {
    Name = "My DB subnet group"
  }
}

resource "aws_db_instance" "postgresql_from_snapshot" {
  identifier          = "tpg-ci-db"
  snapshot_identifier = "tpg-ci-db-snapshot"
  instance_class      = "db.t3.micro"
  engine              = "postgres"
  engine_version      = "16.3"
  username            = var.POSTGRES_USER
  password            = var.POSTGRES_PASSWORD

  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]

  publicly_accessible = false
  multi_az            = false
  allocated_storage   = 20

  skip_final_snapshot = true
  lifecycle {
    ignore_changes = [
      db_subnet_group_name
    ]
  }

}
