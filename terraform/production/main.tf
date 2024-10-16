provider "aws" {
  region = "eu-central-1"
}
module "prod_infra" {
  source = "../app_infra_module"

  POSTGRES_USER     = var.POSTGRES_USER
  POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
  environment = "production"
}

module "prod_app" {
  source = "../app_module"

  POSTGRES_USER     = var.POSTGRES_USER
  POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
  JWT_SIGNING_KEY   = var.JWT_SIGNING_KEY
  JWT_VERIFYING_KEY = var.JWT_VERIFYING_KEY
  DJANGO_SECRET_KEY = var.DJANGO_SECRET_KEY
  AWS_ACCOUNT_ID    = var.AWS_ACCOUNT_ID
  AWS_REPO          = var.AWS_REPO

  DJANGO_ENV = "production"
  environment = "production"

  depends_on = [ module.prod_infra ]
}