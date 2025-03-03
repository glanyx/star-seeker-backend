resource "aws_ecs_task_definition" "star_seeker_task" {

  family = "star_seeker_api_family"
  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"
  memory = "512"
  cpu = "256"
  execution_role_arn = "${aws_iam_role.ss_ecs_role.arn}"

  container_definitions = <<EOT
[
  {
    "name": "ss_api_container",
    "image": "312120001143.dkr.ecr.eu-west-2.amazonaws.com/star_seeker_api:latest",
    "memory": 512,
    "essential": true,
    "portMappings": [
      {
        "containerPort": 3000,
        "hostPort": 3000
      }
    ],
    "environment": [
      {
        "name": "DATABASE_HOSTNAME",
        "value": "${aws_db_instance.ss_rds_instance.address}"
      },
      {
        "name": "DATABASE_PORT",
        "value": "${aws_db_instance.ss_rds_instance.port}"
      },
      {
        "name": "DATABASE_USERNAME",
        "value": "${aws_db_instance.ss_rds_instance.username}"
      },
      {
        "name": "DATABASE_PASSWORD",
        "value": "${aws_db_instance.ss_rds_instance.password}"
      },
      {
        "name": "DATABASE_NAME",
        "value": "${aws_db_instance.ss_rds_instance.db_name}"
      }
    ]
  }
]
EOT
}

resource "aws_ecs_cluster" "ss_cluster" {
  name = "star_seeker_api_cluster"
}

resource "aws_ecs_service" "ss_service" {
  name = "star_seeker_api_service"
  cluster = "${aws_ecs_cluster.ss_cluster.id}"
  task_definition = "${aws_ecs_task_definition.star_seeker_task.arn}"
  launch_type = "FARGATE"
  desired_count = 1

  network_configuration {
    subnets = ["${aws_subnet.public_a.id}", "${aws_subnet.public_b.id}"]
    security_groups = ["${aws_security_group.ss_security_group.id}"]
    assign_public_ip = true
  }
}