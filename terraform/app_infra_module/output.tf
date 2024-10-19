output "cluster" {
  value = aws_ecs_cluster.tpg_ci_cluster
}

output "frontend_tg_arn" {
  value = aws_lb_target_group.frontend_tg.arn
}

output "public_subnet" {
  value = aws_subnet.public_subnet
}

output "public_subnet2" {
  value = aws_subnet.public_subnet2
}

output "front_sg_id" {
  value = aws_security_group.front_sg.id
}

output "db_address" {
  value = aws_db_instance.postgresql_from_snapshot.address
}

output "backend_sg_id" {
  value = aws_security_group.backend_sg.id
}

output "backend_tg_arn" {
  value = aws_lb_target_group.backend_tg.arn
}

output "vpc" {
  value = aws_vpc.main
}

output "load_balancer" {
  value = aws_lb.my_load_balancer
}