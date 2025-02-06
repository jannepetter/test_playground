
variable "POSTGRES_USER" {
  type      = string
  sensitive = true
}

variable "POSTGRES_PASSWORD" {
  type      = string
  sensitive = true
}

variable "JWT_SIGNING_KEY" {
  type      = string
  sensitive = true
}

variable "JWT_VERIFYING_KEY" {
  type      = string
  sensitive = true
}

variable "DJANGO_SECRET_KEY" {
  type      = string
  sensitive = true
}

variable "AWS_ACCOUNT_ID" {
  type      = string
  sensitive = true
}

variable "AWS_REPO" {
  type      = string
  sensitive = true
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
  sensitive = true
}

variable "frontend_tg_arn" {
  type      = string
  sensitive = true
}

variable "subnet1" {
  type = object({
    id   = string
    tags = map(string)
  })
  sensitive = true
}

variable "subnet2" {
  type = object({
    id   = string
    tags = map(string)
  })
  sensitive = true
}

variable "front_sg_id" {
  type      = string
  sensitive = true
}

variable "db_address" {
  type      = string
  sensitive = true
}

variable "backend_sg_id" {
  type      = string
  sensitive = true
}

variable "backend_tg_arn" {
  type      = string
  sensitive = true
}

variable "be_enable_execute_command" {
  type      = bool
  default   = false
  sensitive = true
}