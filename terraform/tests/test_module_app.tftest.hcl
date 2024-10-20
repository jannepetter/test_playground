provider "aws" {
  region = "eu-central-1"
}

variables {
  be_enable_execute_command = true
  DJANGO_ENV                = "test"
  JWT_VERIFYING_KEY         = "test"
  JWT_SIGNING_KEY           = "test"
  POSTGRES_PASSWORD         = "test"
  POSTGRES_USER             = "test"
  AWS_REPO                  = "test"
  AWS_ACCOUNT_ID            = "123456789012"
  DJANGO_SECRET_KEY         = "test"

  # Mock variables from infra
  cluster = {
    id   = "1"
    name = "cluster"
    tags = {
      Name = "test1"
    }
  }
  frontend_tg_arn = "arn:aws:elasticloadbalancing:eu-central-1:123456789012:targetgroup/my-target-group/1234567890123456"
  subnet1 = {
    id = "1"
    tags = {
      Name = "test1"
    }
  }
  subnet2 = {
    id = "2"
    tags = {
      Name = "test"
    }
  }
  front_sg_id    = "1"
  backend_sg_id  = "2"
  db_address     = "somedb"
  backend_tg_arn = "arn:aws:elasticloadbalancing:eu-central-1:123456789012:targetgroup/my-target-group/1234567890123456"
}

run "test_app_module" {

  command = plan

  module {
    source = "../app_module"
  }

  assert {
    condition     = aws_ecs_task_definition.frontend_task.cpu == "256"
    error_message = "Frontend task returned wrong cpu amount"
  }
  assert {
    condition     = aws_ecs_task_definition.frontend_task.memory == "512"
    error_message = "Frontend task returned wrong memory amount"
  }
  assert {
    condition     = aws_ecs_service.frontend_service.enable_execute_command == false
    error_message = "Execute command should not be enabled"
  }
  assert {
    condition     = aws_ecs_service.frontend_service.desired_count == 1
    error_message = "Desired count returned wrong value"
  }

  # backend checks
  assert {
    condition     = aws_ecs_task_definition.backend_task.cpu == "256"
    error_message = "Backend task returned wrong cpu amount"
  }
  assert {
    condition     = aws_ecs_task_definition.backend_task.memory == "512"
    error_message = "Backend task returned wrong memory amount"
  }
  assert {
    condition     = aws_ecs_service.backend_service.desired_count == 1
    error_message = "Desired count returned wrong value"
  }
  assert {
    condition     = aws_ecs_service.backend_service.enable_execute_command == true
    error_message = "Execute command should be enabled"
  }
}