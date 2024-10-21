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

variable "vpc" {
  type = object({
    id = string
  })
}

variable "subnet" {
  type = object({
    id   = string
    tags = map(string)
  })
}

variable "cluster" {
  type = object({
    id   = string
    name = string
  })
}

variable "load_balancer" {
  type = object({
    id       = string
    dns_name = string
  })
}