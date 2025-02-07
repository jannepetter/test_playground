provider "aws" {
  region = "eu-central-1"
}

variables {
  AWS_REPO       = "test"
  AWS_ACCOUNT_ID = "123456789012"
  environment    = "joo"

  # Mock variables from infra
  cluster = {
    id   = "1"
    name = "cluster"
    tags = {
      Name = "test1"
    }
  }
  subnet = {
    id = "2"
    tags = {
      Name = "test"
    }
  }
  vpc = {
    id = "1"
  }
  load_balancer = {
    id       = "1"
    dns_name = "somename"
  }
}

run "test_testrunner" {

  command = plan

  module {
    source = "../trunner_module"
  }

  assert {
    condition     = aws_ecs_task_definition.testrunner_task.cpu == "256"
    error_message = "Incorrect cpu resources"
  }

  assert {
    condition     = aws_ecs_task_definition.testrunner_task.memory == "512"
    error_message = "Incorrect memory resources"
  }
  assert {
    condition = jsondecode(aws_ecs_task_definition.testrunner_task.container_definitions)[0].environment == [
      {
        name  = "APP_ENV"
        value = "ENV"
      },
      {
        name  = "NEXT_PUBLIC_APP_ENV"
        value = "ENV"
      },
      {
        name  = "SET_CRONJOBS"
        value = "cloud"
      },
      {
        name  = "TEST_URL"
        value = "http://somename"
      },
      {
        name  = "environment"
        value = "joo"
      }
    ]
    error_message = "Incorrect environment variables"
  }
  assert {
    condition     = jsondecode(aws_ecs_task_definition.testrunner_task.container_definitions)[0].name == "joo-testrunner"
    error_message = "Incorrect container name"
  }
  assert {
    condition     = aws_ecs_service.testrunner_service.enable_execute_command == true
    error_message = "Execute command not on"
  }
  assert {
    condition     = aws_ecs_service.testrunner_service.desired_count == 1
    error_message = "Incorrect testrunner service desired count"
  }
}