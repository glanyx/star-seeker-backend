
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-2"
}

resource "aws_ecr_repository" "star_seeker_api_server" {
  name = "star_seeker_api"
}

resource "aws_db_parameter_group" "ss_rds_parameter_group" {
  name = "star-seeker-parameter-group"
  family = "postgres17"

  parameter {
    name = "rds.force_ssl"
    value = "0"
  }

}

resource "aws_db_instance" "ss_rds_instance" {
  identifier = "star-seeker-db"
  db_name = "star_seeker"
  allocated_storage = 5
  engine = "postgres"
  engine_version = "17.4"
  instance_class = "db.t4g.micro"
  username = "${var.db_username}"
  password = "${var.db_password}"
  db_subnet_group_name = "${aws_db_subnet_group.ss_rds_subnet_group.name}"
  vpc_security_group_ids = ["${aws_security_group.ss_rds_security_group.id}"]
  parameter_group_name = "${aws_db_parameter_group.ss_rds_parameter_group.name}"
  availability_zone = "${var.aws_region}a"
  skip_final_snapshot = true
  auto_minor_version_upgrade = false
  backup_retention_period = 0
  apply_immediately = true
  publicly_accessible = true
}