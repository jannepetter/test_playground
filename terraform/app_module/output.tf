output "frontend_task" {
  value     = aws_ecs_task_definition.frontend_task
  sensitive = true
}

output "frontend_service" {
  value     = aws_ecs_service.frontend_service
  sensitive = true
}

output "backend_task" {
  value     = aws_ecs_task_definition.backend_task
  sensitive = true
}
output "backend_service" {
  value     = aws_ecs_service.backend_service
  sensitive = true
}