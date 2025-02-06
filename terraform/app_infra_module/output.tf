output "cluster" {
  value     = aws_ecs_cluster.tpg_ci_cluster
  sensitive = true
}

output "frontend_tg_arn" {
  value     = aws_lb_target_group.frontend_tg.arn
  sensitive = true
}

output "public_subnet" {
  value     = aws_subnet.public_subnet
  sensitive = true
}

output "public_subnet2" {
  value     = aws_subnet.public_subnet2
  sensitive = true
}

output "front_sg_id" {
  value     = aws_security_group.front_sg.id
  sensitive = true
}

output "db_address" {
  value     = aws_db_instance.postgresql_from_snapshot.address
  sensitive = true
}

output "backend_sg_id" {
  value     = aws_security_group.backend_sg.id
  sensitive = true
}

output "backend_tg_arn" {
  value     = aws_lb_target_group.backend_tg.arn
  sensitive = true
}

output "vpc" {
  value     = aws_vpc.main
  sensitive = true
}

output "load_balancer" {
  value     = aws_lb.my_load_balancer
  sensitive = true
}