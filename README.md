Welcome to [Star Seeker](http://star-seeker-load-balancer-1543905369.eu-west-2.elb.amazonaws.com/), an application developed by Hyperspace Tunneling Corp., with [Express.js](https://expressjs.com/).

Thank you for choosing us to plan your interstellar journey. We couldn't be more pleased to take your credits. Err, help you with your trip across the stars! Start your cosmic adventure now!

---

## Using the API

The API itself can be found [here](http://18.175.152.119:3000/).
Full information on how to use the API can be found in the [documentation](https://documenter.getpostman.com/view/17845991/2sAYdcsCkh).

## Local Environment

To run the Express server, simply install the required modules with npm and run the server using the `dev` command. Postgres database information must be provided before starting the server. Database connection information must be provided in the `.env` file (see the [example file](.env.example) for reference).

```bash
npm install
npm run dev
```

## Deploying

The entire infrastructure is managed through Terraform, including the creation of a Postgres RDS instance that is connected to the API. The API itself is containerized and hosted on an ECS Fargate instance, with the image sitting on AWS ECR. To deploy the infrastructure, simply run the below Terraform commands. In order for the environment variables to be read correct, please use the `terraform.tfvars` file (see the [example file](terraform.tfvars.example) for reference). **Do not expose sensitive information by using the `variables.tf` file!**

```bash
terraform init
terraform validate
terraform apply
```

The deployment process for the actual API is completely automated, resulting in a fully functioning end-to-end CI/CD pipeline. Github Actions automatically starts a new Docker build whenever new code is pushed to the master branch. This build is pushed to the repository configured in the workflow file. To be able to use this workflow, a user must be configured on AWS IAM with sufficient policies to the EC2 Container Registry and ECS. This user will need access keys, with a key configured as a secret on the relevant Github repository.