variable "region" {
  default = "ap-south-1"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "key_name" {
  default = "devops-key"
}

variable "ami" {
  default = "ami-05d2d839d4f73aafb"
}

variable "vpc_id" {
}

variable "subnet_id" {
}