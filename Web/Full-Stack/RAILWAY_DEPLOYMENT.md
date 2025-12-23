# Railway Deployment Guide

This guide explains how to deploy your full-stack application to Railway.

## Step 1: Initialize Railway Project

1. Go to [Railway Dashboard](https://railway.app/).
2. Click **New Project**.
3. Select **Deploy from GitHub repo** and choose your repository.

### For Monorepo Setup (Crucial Steps)

You need to create **separate services** within the **same Railway project**. Do not try to pack everything into one service.

#### 1. Add the Backend Service

- Click **New** > **GitHub Repo** > Select your repo.
- Go to the service **Settings** > **General** > **Root Directory**.
- Set it to: `Web/Full-Stack/backend`

#### 2. Add the Frontend Service (Repeat the process)

- Click the **New** button again (top right or empty space in canvas).
- Select **GitHub Repo** again > Select the **same repo**.
- Go to the new service **Settings** > **General** > **Root Directory**.
- Set it to: `Web/Full-Stack/frontend`

## Step 2: Provision MySQL Database

1. In the same project, click **New** > **Database** > **Add MySQL**.
2. This creates a third service in your project dashboard.

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

-   **`gunicorn: not found`**: This usually happens if `requirements.txt` is missing `gunicorn` or has the wrong encoding (UTF-16 instead of UTF-8). I have already fixed this for you.
-   **`OperationalError: (1045, "Access denied...")`**: This means your Backend service cannot connect to the MySQL database.
    1. Go to your **Backend Service** settings in Railway.
    2. Go to **Variables**.
    3. Ensure `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, and `DB_NAME` are correctly set.
    4. Instead of typing the values, use Railway's reference syntax:
        - `DB_HOST`: `${{MySQL.MYSQLHOST}}`
        - `DB_PORT`: `${{MySQL.MYSQLPORT}}`
        - `DB_USER`: `${{MySQL.MYSQLUSER}}`
        - `DB_PASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
        - `DB_NAME`: `${{MySQL.MYSQLDATABASE}}`
-   **Healthcheck Errors**: If the healthcheck fails, check the logs for any Python errors during startup. The current path is set to `/api/health`.
