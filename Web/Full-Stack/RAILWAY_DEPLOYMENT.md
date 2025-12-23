# Railway Deployment Guide

This guide explains how to deploy your full-stack application to Railway.

## Step 1: Initialize Railway Project

1. Go to [Railway Dashboard](https://railway.app/).
2. Click **New Project**.
3. Select **Deploy from GitHub repo** and choose your repository.

### For Monorepo Setup (Two Services)

You should create **two** separate services in the same project pointing to the same repository:

#### A. Backend Service (API)

- **Repo**: Your GitHub repository.
- **Root Directory**: `Web/Full-Stack/backend`
- Railway will automatically detect the `backend/railway.toml` and build the container.

#### B. Frontend Service

- **Repo**: Your GitHub repository.
- **Root Directory**: `Web/Full-Stack/frontend`
- Railway will automatically detect the `frontend/railway.toml` and build the container.

## Step 2: Provision MySQL Database

1. In your Railway project, click **New > Database > Add MySQL**.
2. Railway will automatically provide connection variables.

## Step 3: Configure Environment Variables

For the **api** (backend) service, add the following variables:

- `DB_HOST`: `${{MySQL.MYSQLHOST}}`
- `DB_PORT`: `${{MySQL.MYSQLPORT}}`
- `DB_USER`: `${{MySQL.MYSQLUSER}}`
- `DB_PASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
- `DB_NAME`: `${{MySQL.MYSQLDATABASE}}`
- `SECRET_KEY`: A random string for Flask.
- `JWT_SECRET_KEY`: A random string for authentication.

## Step 4: Verify Deployment

1. Check the logs for both the `api` and `frontend` services.
2. The `api` service should show "Running database migrations..." followed by "Starting gunicorn server...".
3. Access the `frontend` URL provided by Railway.

## Troubleshooting

- **Database Errors**: Ensure the environment variables match the MySQL service variables.
- **Port Errors**: The backend is configured to listen on port `5000`. Railway handles internal routing, but ensure the `PORT` variable is set correctly if needed (default is 5000).
