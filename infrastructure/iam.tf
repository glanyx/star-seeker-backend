data "aws_iam_policy_document" "ss_role_policy_doc" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ss_ecs_role" {
  name = "star_seeker_ecs_role"
  assume_role_policy = data.aws_iam_policy_document.ss_role_policy_doc.json
}

resource "aws_iam_role_policy_attachment" "ss_ecs_policy_attachment" {
  role = "${aws_iam_role.ss_ecs_role.name}"

  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"

}