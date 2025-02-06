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
