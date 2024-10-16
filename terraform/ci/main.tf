provider "aws" {
  region = "eu-central-1"
}
module "ci_infra" {
  source = "../app_infra_module"

  POSTGRES_USER     = var.POSTGRES_USER
  POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
  environment = "ci"
}

module "ci_testrunner" {
  source = "../trunner_module"

  AWS_ACCOUNT_ID    = var.AWS_ACCOUNT_ID
  AWS_REPO          = var.AWS_REPO

  environment = "ci"

  depends_on = [ module.ci_infra ]
}
module "ci_app" {
  source = "../app_module"

  POSTGRES_USER     = var.POSTGRES_USER
  POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
  JWT_SIGNING_KEY   = var.JWT_SIGNING_KEY
  JWT_VERIFYING_KEY = var.JWT_VERIFYING_KEY
  DJANGO_SECRET_KEY = var.DJANGO_SECRET_KEY
  AWS_ACCOUNT_ID    = var.AWS_ACCOUNT_ID
  AWS_REPO          = var.AWS_REPO
  DJANGO_ENV = "development"
  environment = "ci"

  depends_on = [ module.ci_infra ]
}