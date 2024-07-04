terraform {
    required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
    }
}

provider "aws" {
        region  = "us-east-1"
}

resource "aws_dynamodb_table" "resume_table" {
    name           = "Resumes"
    # billing_mode   = "PROVISIONED"  # Automatically scales with usage
    hash_key       = "ResumeId"
    read_capacity = 1
    write_capacity = 1

    attribute {
        name = "ResumeId"
        type = "S"
    }

   

  tags = {
    Name        = "dynamodb-table-1"
    Environment = "production"
  }
}



resource "aws_lambda_function" "my_lambda" {
    function_name = "MyLambdaFunction"
    handler       = "index.handler"
    runtime       = "nodejs16.x"
    role          = aws_iam_role.lambda_exec_role.arn

    filename         = "${path.module}/lambda-function/resume-fetch.zip"
    source_code_hash = filebase64sha256("${path.module}/lambda-function/resume-fetch.zip")

    environment {
    variables = {
        DYNAMODB_TABLE = aws_dynamodb_table.resume_table.name
    }
    }
}


resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
    }]
  })
}



resource "aws_iam_policy" "lambda_policy" {
  name        = "lambda_policy"
  description = "IAM policy for Lambda to access DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action   = ["dynamodb:GetItem", "dynamodb:Scan", "dynamodb:Query", "dynamodb:UpdateItem", "dynamodb:PutItem"],
      Effect   = "Allow",
      Resource = "arn:aws:dynamodb:*:*:table/Resumes"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}