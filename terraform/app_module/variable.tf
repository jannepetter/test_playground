
variable "POSTGRES_USER" {
  type = string
}

variable "POSTGRES_PASSWORD" {
  type = string
}

variable "JWT_SIGNING_KEY" {
  type = string
}

variable "JWT_VERIFYING_KEY" {
  type = string
}

variable "DJANGO_SECRET_KEY" {
  type = string
}

variable "AWS_ACCOUNT_ID" {
  type = string
}

variable "AWS_REPO" {
  type = string
}

variable "environment" {
  type    = string
  default = "ci"
}

variable "DJANGO_ENV" {
  type = string
}

variable "cluster" {
  type = object({
    id   = string
    name = string
  })
}

variable "frontend_tg_arn" {
  type = string
}

variable "subnet1" {
  type = object({
    id   = string
    tags = map(string)
  })
}

variable "subnet2" {
  type = object({
    id   = string
    tags = map(string)
  })
}

variable "front_sg_id" {
  type = string
}

variable "db_address" {
  type = string
}

variable "backend_sg_id" {
  type = string
}

variable "backend_tg_arn" {
  type = string
}

variable "be_enable_execute_command" {
  type    = bool
  default = false
}