# Serverless Resume API

Welcome to the Serverless Resume API project! This guide will walk you through creating a serverless API that fetches and serves resume data stored in a DynamoDB table. The infrastructure is managed using Terraform, and continuous integration and deployment (CI/CD) are handled using GitHub Actions.

## Prerequisites

Before you begin, ensure you have the following:

- **AWS Account**: An AWS account with appropriate permissions.
- **Terraform**: [Install Terraform](https://www.terraform.io/downloads.html) on your local machine.
- **AWS CLI**: [Install and configure the AWS CLI](https://aws.amazon.com/cli/) on your local machine.
- **GitHub Account**: A GitHub account to host your repository and set up GitHub Actions.
- **Node.js**: [Install Node.js](https://nodejs.org/) on your local machine to develop and package your Lambda function.

## Setup

### 1. Configure AWS CLI

Open your terminal and run the following command to configure your AWS CLI:

aws configure


Enter your AWS Access Key ID, Secret Access Key, region (e.g., `us-east-1`), and output format.

### 2. Create Terraform Configuration

Create a `main.tf` file to define your infrastructure:

- **DynamoDB Table**: Stores resume data.
- **Lambda Function**: Handles API requests and interacts with DynamoDB.
- **IAM Role and Policies**: Grants necessary permissions for Lambda to access DynamoDB and CloudWatch logs.
- **API Gateway**: Exposes the Lambda function as a REST API.

### 3. Deploy Infrastructure

Run the following commands to deploy your infrastructure:

terraform init

terraform apply


### 4. Automate with GitHub Actions

Set up a GitHub Actions workflow to automatically deploy updates:

1. **Create a `.github/workflows/deploy.yml`** file.
2. Configure the workflow to:
   - Checkout code.
   - Set up Node.js.
   - Package Lambda function.
   - Configure AWS credentials.
   - Deploy with Terraform.

### Note

This README includes only some code snippets. Check out for further details

Happy coding! 🎉