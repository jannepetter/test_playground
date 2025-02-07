resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.environment}-db-subnet-group"
  subnet_ids = [aws_subnet.db_subnet.id, aws_subnet.db_subnet2.id]
}

resource "aws_db_instance" "postgresql_from_snapshot" {
  identifier          = "tpg-${var.environment}-db"
  snapshot_identifier = "tpg-ci-db-snapshot"
  instance_class      = "db.t3.micro"
  engine              = "postgres"
  engine_version      = "16.3"
  username            = var.POSTGRES_USER
  password            = var.POSTGRES_PASSWORD

  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]

  publicly_accessible = false
  multi_az            = false
  allocated_storage   = 20
  storage_encrypted   = true
  skip_final_snapshot = true

  lifecycle {
    prevent_destroy = false
    ignore_changes = [
      storage_encrypted
    ]
  }
}
