provider "aws" {
  region = "eu-central-1"
}
module "infra" {
  source = "../app_infra_module"

  POSTGRES_USER     = var.POSTGRES_USER
  POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
  environment       = "staging"
}

module "testrunner" {
  source = "../trunner_module"

  AWS_ACCOUNT_ID = var.AWS_ACCOUNT_ID
  AWS_REPO       = var.AWS_REPO

  environment = "staging"

  vpc           = module.infra.vpc
  subnet        = module.infra.public_subnet2
  cluster       = module.infra.cluster
  load_balancer = module.infra.load_balancer

  depends_on = [module.infra]
}
module "app" {
  source = "../app_module"

  POSTGRES_USER     = var.POSTGRES_USER
  POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
  JWT_SIGNING_KEY   = var.JWT_SIGNING_KEY
  JWT_VERIFYING_KEY = var.JWT_VERIFYING_KEY
  DJANGO_SECRET_KEY = var.DJANGO_SECRET_KEY
  AWS_ACCOUNT_ID    = var.AWS_ACCOUNT_ID
  AWS_REPO          = var.AWS_REPO

  DJANGO_ENV                = "development"
  environment               = "staging"
  be_enable_execute_command = true

  cluster         = module.infra.cluster
  frontend_tg_arn = module.infra.frontend_tg_arn
  subnet1         = module.infra.public_subnet
  subnet2         = module.infra.public_subnet2
  front_sg_id     = module.infra.front_sg_id
  db_address      = module.infra.db_address
  backend_sg_id   = module.infra.backend_sg_id
  backend_tg_arn  = module.infra.backend_tg_arn

  depends_on = [module.infra]
}