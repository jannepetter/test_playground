provider "aws" {
  region = "eu-central-1"
}

variables {
  JWT_VERIFYING_KEY = "test"
  JWT_SIGNING_KEY   = "test"
  POSTGRES_PASSWORD = "test"
  POSTGRES_USER     = "test"
  AWS_REPO          = "test"
  AWS_ACCOUNT_ID    = "123456789012"
  DJANGO_SECRET_KEY = "test"
}
run "test_production_env_infra" {

  command = plan

  module {
    source = "../production"
  }

  assert {
    condition     = module.infra.vpc.tags.Name == "tpg-vpc-production"
    error_message = "Wrong vpc tag name"
  }
  assert {
    condition     = module.infra.load_balancer.name == "production-loadbalancer"
    error_message = "Wrong loadbalancer name"
  }
  assert {
    condition     = module.infra.cluster.name == "tpg-production-cluster"
    error_message = "Wrong cluster name"
  }
  assert {
    condition     = module.infra.public_subnet.tags.Name == "production-public-subnet"
    error_message = "Wrong subnet name"
  }
  assert {
    condition     = module.infra.public_subnet2.tags.Name == "production-public-subnet2"
    error_message = "Wrong subnet name"
  }
}

run "test_production_env_apps" {

  command = plan

  module {
    source = "../production"
  }

  assert {
    condition     = module.app.frontend_task.cpu == "256"
    error_message = "Frontend task returned wrong cpu amount"
  }
  assert {
    condition     = module.app.frontend_task.memory == "512"
    error_message = "Frontend task returned wrong memory amount"
  }
  assert {
    condition     = module.app.frontend_service.enable_execute_command == false
    error_message = "Execute command should not be enabled"
  }
  assert {
    condition     = module.app.frontend_service.desired_count == 1
    error_message = "Desired count returned wrong value"
  }

  # Backend checks
  assert {
    condition     = module.app.backend_task.cpu == "256"
    error_message = "Backend task returned wrong cpu amount"
  }
  assert {
    condition     = module.app.backend_task.memory == "512"
    error_message = "Backend task returned wrong memory amount"
  }
  assert {
    condition     = module.app.backend_service.desired_count == 1
    error_message = "Desired count returned wrong value"
  }
  assert {
    condition     = module.app.backend_service.enable_execute_command == false
    error_message = "Execute command should not be enabled"
  }
}