output "frontend_task" {
  value = aws_ecs_task_definition.frontend_task
}

output "frontend_service" {
  value = aws_ecs_service.frontend_service
}

output "backend_service" {
  value = aws_ecs_service.backend_service
}