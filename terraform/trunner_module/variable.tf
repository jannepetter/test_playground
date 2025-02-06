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

variable "vpc" {
  type = object({
    id = string
  })
  sensitive = true
}

variable "subnet" {
  type = object({
    id   = string
    tags = map(string)
  })
  sensitive = true
}

variable "cluster" {
  type = object({
    id   = string
    name = string
  })
  sensitive = true
}

variable "load_balancer" {
  type = object({
    id       = string
    dns_name = string
  })
  sensitive = true
}