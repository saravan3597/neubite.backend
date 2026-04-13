# AWS Deployment Guide — Neubite Backend

This guide walks through deploying the NestJS backend to AWS using ECS + Fargate with an RDS PostgreSQL database. Follow each phase in order.

---

## Architecture

```
GitHub → GitHub Actions → ECR (Docker image)
                               ↓
Internet → ALB → ECS Fargate (NestJS) → RDS Postgres
                       ↓                      ↓
               Secrets Manager        Cognito (JWT validation)
           (GPT_API_KEY, DB URL,      Frontend sends idToken →
            Cognito config)           Backend verifies per-user
```

---

## Prerequisites

- AWS account with admin access
- AWS CLI installed and configured (`brew install awscli` → `aws configure`)
- Docker installed locally
- Your GitHub repo connected (for the CI/CD pipeline)

---

## Phase 1 — ECR (Container Registry)

This is where your Docker images are stored.

1. Go to **ECR** in the AWS Console
2. Click **Create repository**
3. Set:
   - Visibility: **Private**
   - Repository name: `neubite-backend`
4. Click **Create repository**
5. **Save the repository URI** — it looks like:
   ```
   123456789.dkr.ecr.us-east-1.amazonaws.com/neubite-backend
   ```

---

## Phase 2 — RDS (PostgreSQL Database)

1. Go to **RDS** → **Create database**
2. Choose:
   - Creation method: **Standard create**
   - Engine: **PostgreSQL**
   - Version: **PostgreSQL 16**
   - Template: **Free tier** (for testing) or **Production**
3. Settings:
   - DB instance identifier: `neubite-db`
   - Master username: `neubite`
   - Master password: choose a strong password and **save it securely**
4. Instance configuration:
   - DB instance class: `db.t3.micro`
5. Connectivity:
   - VPC: **Default VPC**
   - Public access: **No**
   - VPC security group: create new → name it `neubite-rds-sg`
6. Additional configuration:
   - Initial database name: `neubite`
7. Click **Create database** (takes ~5 minutes)
8. Once created, go to the database and **save the endpoint** — it looks like:
   ```
   neubite-db.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com
   ```

---

## Phase 3 — Security Groups

You need three security groups. Go to **EC2 → Security Groups → Create security group**.

### 3a. ALB Security Group (`neubite-alb-sg`)

Allows internet traffic into the load balancer.

| Direction | Type  | Port | Source    |
| --------- | ----- | ---- | --------- |
| Inbound   | HTTP  | 80   | 0.0.0.0/0 |
| Inbound   | HTTPS | 443  | 0.0.0.0/0 |
| Outbound  | All   | All  | 0.0.0.0/0 |

### 3b. ECS Security Group (`neubite-ecs-sg`)

Allows traffic from the ALB into ECS tasks.

| Direction | Type   | Port | Source           |
| --------- | ------ | ---- | ---------------- |
| Inbound   | Custom | 3000 | `neubite-alb-sg` |
| Outbound  | All    | All  | 0.0.0.0/0        |

### 3c. Update RDS Security Group (`neubite-rds-sg`)

Go to the `neubite-rds-sg` group created in Phase 2 and add:

| Direction | Type       | Port | Source           |
| --------- | ---------- | ---- | ---------------- |
| Inbound   | PostgreSQL | 5432 | `neubite-ecs-sg` |

---

## Phase 4 — Secrets Manager

Never store secrets as plain environment variables. Store them here.

1. Go to **Secrets Manager** → **Store a new secret**

### Secret 1 — Database URL

- Secret type: **Other type of secret**
- Key: `DATABASE_URL`
- Value:
  ```
  postgresql://neubite:YOUR_PASSWORD@neubite-db.xxxx.us-east-1.rds.amazonaws.com:5432/neubite
  ```
  _(Replace `YOUR_PASSWORD` and the endpoint with your actual values)_
- Secret name: `neubite/backend/DATABASE_URL`
- Click through and **Save**
- **Copy the Secret ARN** from the secret details page

### Secret 2 — GPT API Key

- Secret type: **Other type of secret**
- Key: `GPT_API_KEY`
- Value: your OpenAI API key (`sk-proj-...`)
- Secret name: `neubite/backend/GPT_API_KEY`
- Click through and **Save**
- **Copy the Secret ARN**

### Secret 3 — Cognito User Pool ID

- Secret type: **Other type of secret**
- Key: `COGNITO_USER_POOL_ID`
- Value: `us-east-2_h28swzclb`
- Secret name: `neubite/backend/COGNITO_USER_POOL_ID`
- Click through and **Save**
- **Copy the Secret ARN**

### Secret 4 — Cognito Region

- Secret type: **Other type of secret**
- Key: `COGNITO_REGION`
- Value: `us-east-2`
- Secret name: `neubite/backend/COGNITO_REGION`
- Click through and **Save**
- **Copy the Secret ARN**

> **Why Cognito config here?** The backend uses these to fetch Cognito's public JWKS keys and validate the JWT sent by the frontend on every request. This ensures each user can only access their own pantry, grocery, and saved recipe data.

---

## Phase 5 — IAM Role for ECS

ECS needs permission to pull your Docker image and read secrets.

1. Go to **IAM** → **Roles** → **Create role**
2. Trusted entity: **AWS service** → use case: **Elastic Container Service Task**
3. Attach permissions:
   - Search and select: `AmazonECSTaskExecutionRolePolicy`
4. Role name: `neubite-ecs-execution-role`
5. Click **Create role**
6. Open the role you just created → **Add permissions** → **Create inline policy**
7. Switch to **JSON** tab and paste:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["secretsmanager:GetSecretValue"],
         "Resource": [
           "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:neubite/backend/*"
         ]
       }
     ]
   }
   ```
   _(Replace `YOUR_ACCOUNT_ID` with your 12-digit AWS account ID)_
8. Policy name: `neubite-secrets-access`
9. Click **Create policy**

---

## Phase 6 — ECS Cluster

1. Go to **ECS** → **Clusters** → **Create cluster**
2. Cluster name: `neubite-cluster`
3. Infrastructure: **AWS Fargate** (serverless)
4. Click **Create**

---

## Phase 7 — ECS Task Definition

This defines what container to run and how.

1. Go to **ECS** → **Task definitions** → **Create new task definition**
2. Task definition family: `neubite-backend`
3. Launch type: **AWS Fargate**
4. CPU: **0.5 vCPU** — Memory: **1 GB**
5. Task execution role: `neubite-ecs-execution-role`
6. Under **Container — 1**:
   - Container name: `backend`
   - Image URI: `YOUR_ECR_REPOSITORY_URI:latest`
   - Port mappings: container port `3000`, protocol `TCP`
7. Under **Environment variables**, add the following. Use **ValueFrom** for secrets (reads from Secrets Manager) and **Value** for plain config:

   | Key                    | Type      | Value                                                |
   | ---------------------- | --------- | ---------------------------------------------------- |
   | `DATABASE_URL`         | ValueFrom | ARN of `neubite/backend/DATABASE_URL` secret         |
   | `GPT_API_KEY`          | ValueFrom | ARN of `neubite/backend/GPT_API_KEY` secret          |
   | `COGNITO_USER_POOL_ID` | ValueFrom | ARN of `neubite/backend/COGNITO_USER_POOL_ID` secret |
   | `COGNITO_REGION`       | ValueFrom | ARN of `neubite/backend/COGNITO_REGION` secret       |
   | `NODE_ENV`             | Value     | `production`                                         |

8. Under **Logging**, enable **CloudWatch Logs**:
   - Log group: `/ecs/neubite-backend`
   - Auto-create the log group
9. Click **Create**

---

## Phase 8 — Application Load Balancer

1. Go to **EC2** → **Load Balancers** → **Create load balancer**
2. Select **Application Load Balancer**
3. Configure:
   - Name: `neubite-alb`
   - Scheme: **Internet-facing**
   - IP address type: IPv4
   - VPC: Default VPC
   - Subnets: select **at least 2 availability zones**
   - Security groups: select `neubite-alb-sg`
4. Listeners and routing:
   - Protocol: HTTP, Port: 80
   - Default action: **Create target group**
     - Target type: **IP addresses**
     - Target group name: `neubite-backend-tg`
     - Protocol: HTTP, Port: 3000
     - Health check path: `/api/health`
     - Click **Next** → **Create target group** (leave targets empty for now)
   - Back on the ALB page, select the target group you just created
5. Click **Create load balancer**
6. **Save the ALB DNS name** — looks like:
   ```
   neubite-alb-xxxxxxxxxxxx.us-east-1.elb.amazonaws.com
   ```

---

## Phase 9 — ECS Service

This runs your container and keeps it alive.

1. Go to **ECS** → **neubite-cluster** → **Create service**
2. Configure:
   - Launch type: **Fargate**
   - Task definition: `neubite-backend` (latest revision)
   - Service name: `neubite-backend-service`
   - Desired tasks: `1`
3. Networking:
   - VPC: Default VPC
   - Subnets: select at least 2
   - Security group: `neubite-ecs-sg`
   - Public IP: **Turned off** (traffic comes through the ALB)
4. Load balancing:
   - Load balancer type: **Application Load Balancer**
   - Load balancer: `neubite-alb`
   - Container to load balance: `backend:3000`
   - Listener: select the HTTP:80 listener
   - Target group: `neubite-backend-tg`
5. Click **Create service**

The service will pull the image from ECR and start a Fargate task. Check the **Tasks** tab — it should show `RUNNING` within a minute or two.

---

## Phase 10 — Verify the Deployment

Once the ECS task shows `RUNNING`:

```
# Replace with your ALB DNS name
curl http://neubite-alb-xxxx.us-east-1.elb.amazonaws.com/api/health
```

Expected response:

```json
{ "status": "ok" }
```

If the task fails to start, check the logs:
**ECS → neubite-cluster → neubite-backend-service → Logs tab**

---

## Phase 11 — GitHub Actions CI/CD

Every push to `main` that changes the backend will automatically build a new image, push it to ECR, and deploy it to ECS.

### 11a. Create an IAM user for GitHub Actions

1. Go to **IAM** → **Users** → **Create user**
2. Username: `neubite-github-actions`
3. Attach policies:
   - `AmazonEC2ContainerRegistryPowerUser`
   - Create an inline policy:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "ecs:RegisterTaskDefinition",
             "ecs:DescribeTaskDefinition",
             "ecs:UpdateService",
             "ecs:DescribeServices",
             "iam:PassRole"
           ],
           "Resource": "*"
         }
       ]
     }
     ```
4. After creating, go to the user → **Security credentials** → **Create access key**
5. Choose **Application running outside AWS**
6. **Download the access key CSV** — you won't see it again

### 11b. Add secrets to GitHub

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Add each of these:

| Secret name             | Value                         |
| ----------------------- | ----------------------------- |
| `AWS_ACCESS_KEY_ID`     | From the CSV downloaded above |
| `AWS_SECRET_ACCESS_KEY` | From the CSV downloaded above |
| `AWS_REGION`            | `us-east-1`                   |
| `ECR_REPOSITORY`        | `neubite-backend`             |
| `ECS_CLUSTER`           | `neubite-b-cluster`           |
| `ECS_SERVICE`           | `neubite-backend-service`     |
| `CONTAINER_NAME`        | `backend`                     |

### 11c. The workflow file

The file `.github/workflows/deploy-backend.yml` is already in the repo. It triggers on every push to `main` that touches the `neubite.backend/` folder.

---

## Phase 12 — Update the Frontend

Since the frontend is deployed to S3, update the environment variable pointing to the backend and redeploy:

```
VITE_AI_API_URL=http://neubite-alb-xxxx.us-east-1.elb.amazonaws.com/api
VITE_API_URL=http://neubite-alb-xxxx.us-east-1.elb.amazonaws.com/api
```

> If you add a custom domain or CloudFront in front of the ALB later, update these URLs accordingly.

---

## Deployment Order Checklist

- [ ] ECR repository created
- [ ] RDS database created and endpoint saved
- [ ] Security groups created (`neubite-alb-sg`, `neubite-ecs-sg`, `neubite-rds-sg`)
- [ ] Secrets stored in Secrets Manager (`DATABASE_URL`, `GPT_API_KEY`, `COGNITO_USER_POOL_ID`, `COGNITO_REGION`)
- [ ] IAM execution role created with secrets access
- [ ] ECS cluster created
- [ ] Task definition created with correct image, env vars, and logging
- [ ] ALB and target group created
- [ ] ECS service created and task shows RUNNING
- [ ] Health check endpoint returns `{ "status": "ok" }`
- [ ] GitHub Actions secrets added
- [ ] Push to `main` triggers a successful pipeline run
- [ ] Frontend env vars updated and redeployed

---

## Costs (approximate, us-east-1)

| Service      | Spec                | ~Monthly Cost |
| ------------ | ------------------- | ------------- |
| ECS Fargate  | 0.5vCPU/1GB, 1 task | ~$15          |
| RDS Postgres | db.t3.micro         | ~$15          |
| ALB          | 1 instance          | ~$18          |
| ECR          | <1 GB storage       | ~$0.10        |
| **Total**    |                     | **~$48/mo**   |

> Use **Free Tier** RDS and keep 1 Fargate task to minimise cost while testing.
