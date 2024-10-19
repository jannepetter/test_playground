provider "aws" {
  region = "eu-central-1"
}

variables {
  POSTGRES_USER     = "some"
  POSTGRES_PASSWORD = "password"
  environment       = "testinfra"
}

run "test_infra_module" {

  command = plan

  module {
    source = "../app_infra_module"
  }

  assert {
    condition     = aws_vpc.main.tags.Name == "tpg-vpc-testinfra"
    error_message = "Wrong vpc tag name"
  }
  assert {
    condition     = aws_lb.my_load_balancer.name == "testinfra-loadbalancer"
    error_message = "Wrong loadbalancer name"
  }
  assert {
    condition     = aws_ecs_cluster.tpg_ci_cluster.name == "tpg-testinfra-cluster"
    error_message = "Wrong cluster name"
  }
  assert {
    condition     = aws_subnet.public_subnet.tags.Name == "testinfra-public-subnet"
    error_message = "Wrong subnet name"
  }
  assert {
    condition     = aws_subnet.public_subnet2.tags.Name == "testinfra-public-subnet2"
    error_message = "Wrong subnet name"
  }
}
