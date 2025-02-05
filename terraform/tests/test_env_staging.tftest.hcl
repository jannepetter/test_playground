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
run "test_staging_env_infra" {

  command = plan

  module {
    source = "../staging"
  }

  assert {
    condition     = module.infra.vpc.tags.Name == "tpg-vpc-staging"
    error_message = "Wrong vpc tag name"
  }
  assert {
    condition     = module.infra.load_balancer.name == "staging-loadbalancer"
    error_message = "Wrong loadbalancer name"
  }
  assert {
    condition     = module.infra.cluster.name == "tpg-staging-cluster"
    error_message = "Wrong cluster name"
  }
  assert {
    condition     = module.infra.public_subnet.tags.Name == "staging-public-subnet"
    error_message = "Wrong subnet name"
  }
  assert {
    condition     = module.infra.public_subnet2.tags.Name == "staging-public-subnet2"
    error_message = "Wrong subnet name"
  }
}

run "test_staging_env_apps" {

  command = plan

  module {
    source = "../staging"
  }

  assert {
    condition     = module.infra.vpc.tags.Name == "tpg-vpc-staging"
    error_message = "Returned wrong vpc tag name"
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
    error_message = "Execute command should not be enabled for frontend"
  }
  assert {
    condition     = module.app.frontend_service.desired_count == 1
    error_message = "Desired count returned wrong value"
  }
  assert {
    condition     = module.app.backend_service.desired_count == 1
    error_message = "Desired count returned wrong value"
  }
  assert {
    condition     = module.app.backend_service.enable_execute_command == true
    error_message = "Execute command should be enabled for backend"
  }
}