
variable "POSTGRES_USER" {
  type      = string
  sensitive = true
}

variable "POSTGRES_PASSWORD" {
  type      = string
  sensitive = true
}

variable "environment" {
  type      = string
  sensitive = true
}

