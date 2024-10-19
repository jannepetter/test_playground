provider "aws" {
  region = "eu-central-1"
}
module "infra" {
  source = "../app_infra_module"

  POSTGRES_USER     = var.POSTGRES_USER
  POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
  environment       = "production"
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

  DJANGO_ENV  = "production"
  environment = "production"

  cluster         = module.infra.cluster
  frontend_tg_arn = module.infra.frontend_tg_arn
  public_subnet   = module.infra.public_subnet
  public_subnet2  = module.infra.public_subnet2
  front_sg_id     = module.infra.front_sg_id
  db_address      = module.infra.db_address
  backend_sg_id   = module.infra.backend_sg_id
  backend_tg_arn  = module.infra.backend_tg_arn

  depends_on = [module.infra]
}