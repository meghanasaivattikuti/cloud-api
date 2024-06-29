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

# resource "aws_iam_role" "lambda_exec_role" {
#   name = "lambda_exec_role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [{
#       Action = "sts:AssumeRole",
#       Effect = "Allow",
#       Principal = {
#         Service = "lambda.amazonaws.com"
#       },
#     }]
#   })
# }

# resource "aws_iam_policy" "lambda_policy" {
#   name        = "lambda_policy"
#   description = "IAM policy for Lambda to access DynamoDB"

#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [{
#       Action   = ["dynamodb:GetItem", "dynamodb:Scan", "dynamodb:Query", "dynamodb:UpdateItem", "dynamodb:PutItem"],
#       Effect   = "Allow",
#       Resource = aws_dynamodb_table.resumes.arn
#     }]
#   })
# }

# resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
#   role       = aws_iam_role.lambda_exec_role.name
#   policy_arn = aws_iam_policy.lambda_policy.arn
# }

# resource "aws_lambda_function" "resume_fetcher" {
#   function_name = "resumeFetcher"
#   handler       = "index.handler"
#   runtime       = "nodejs14.x"
#   role          = aws_iam_role.lambda_exec_role.arn
#   filename      = "C:/Users/HP/Desktop/cloud-api/lambda-function/resume-fetch.zip"

#   source_code_hash = filebase64sha256("C:/Users/HP/Desktop/cloud-api/lambda-function/resume-fetch.zip")
# }


# resource "aws_api_gateway_rest_api" "resume_api" {
#   name        = "ResumeAPI"
# }

# resource "aws_api_gateway_resource" "resume_resource" {
#   rest_api_id = aws_api_gateway_rest_api.resume_api.id
#   parent_id   = aws_api_gateway_rest_api.resume_api.root_resource_id
#   path_part   = "resume"
# }

# resource "aws_api_gateway_method" "resume_get" {
#   rest_api_id   = aws_api_gateway_rest_api.resume_api.id
#   resource_id   = aws_api_gateway_resource.resume_resource.id
#   http_method   = "GET"
#   authorization = "NONE"
# }

# resource "aws_api_gateway_integration" "resume_get_integration" {
#   rest_api_id = aws_api_gateway_rest_api.resume_api.id
#   resource_id = aws_api_gateway_resource.resume_resource.id
#   http_method = aws_api_gateway_method.resume_get.http_method
#   type        = "AWS_PROXY"
#   uri         = aws_lambda_function.resume_handler.invoke_arn
# }

# resource "aws_api_gateway_deployment" "resume_api_deployment" {
#   depends_on = [
#     aws_api_gateway_integration.resume_get_integration
#   ]
#   rest_api_id = aws_api_gateway_rest_api.resume_api.id
#   stage_name  = "prod"
# }