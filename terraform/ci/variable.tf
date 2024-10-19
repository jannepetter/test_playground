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
