resource "aws_vpc" "star_seeker_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support = true
}

resource "aws_subnet" "public_a" {
  vpc_id = "${aws_vpc.star_seeker_vpc.id}"
  cidr_block = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"
}

resource "aws_subnet" "public_b" {
  vpc_id = "${aws_vpc.star_seeker_vpc.id}"
  cidr_block = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"
}

resource "aws_internet_gateway" "ss_internet_gateway" {
  vpc_id = "${aws_vpc.star_seeker_vpc.id}"
}

resource "aws_route" "ss_internet_access" {
  route_table_id = "${aws_vpc.star_seeker_vpc.main_route_table_id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = "${aws_internet_gateway.ss_internet_gateway.id}"
}

# security group for api
resource "aws_security_group" "ss_security_group" {
  name = "star_seeker_security_group"
  description = "Allow incoming TLS traffic"
  vpc_id = "${aws_vpc.star_seeker_vpc.id}"

  ingress {
    from_port = 80
    to_port = 3000
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "ss_rds_subnet_group" {
  name = "ss_rds_subnet_group"
  subnet_ids = ["${aws_subnet.public_a.id}", "${aws_subnet.public_b.id}"]
}

# security group for rds instance
resource "aws_security_group" "ss_rds_security_group" {
  name = "ss_rds_security_group"
  description = "Allow ECS access to RDS"
  vpc_id = "${aws_vpc.star_seeker_vpc.id}"

  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = ["${aws_vpc.star_seeker_vpc.cidr_block}"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
