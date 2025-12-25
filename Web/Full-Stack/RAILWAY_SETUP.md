# Railway Setup Commands

## 1. Rebuild and Deploy Frontend (with timeout fix)

```bash
# Rebuild frontend with new nginx timeout settings
docker compose -f docker-compose.prod.yml build frontend

# Push to Railway (if using Git)
git add frontend/nginx.conf
git commit -m "Fix: Increase nginx timeout for Railway"
git push
```

## 2. Seed the Railway Database

**Option A: Via Railway CLI (Recommended)**

```bash
# Install Railway CLI if not installed
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run seed script on Railway backend
railway run python seed.py
```

**Option B: Via Railway Dashboard**

1. Go to Railway Dashboard → Backend Service
2. Click on "Settings" → "Deploy"
3. Add a one-time command: `python seed.py`
4. Or use the Railway shell to run: `python seed.py`

**Option C: Add to entrypoint.sh (Auto-seed on first deploy)**

Add this to `backend/entrypoint.sh` before starting gunicorn:

```bash
# Seed database if empty (only runs once)
python -c "from app import create_app; from models import db, User; app = create_app(); app.app_context().push(); print('Checking database...'); count = User.query.count(); print(f'Users in DB: {count}'); exec(open('seed.py').read()) if count == 0 else print('Database already seeded')"
```

## 3. Test the Deployment

```bash
# Test backend health endpoint
curl https://your-backend.railway.app/api/health

# Test login endpoint
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "student1", "password": "pass123", "portal": "student"}'

# Test from frontend
curl https://eui-finance.up.railway.app/api/health
```

## 4. Quick Deploy Commands

```bash
# Build both services locally
docker compose -f docker-compose.prod.yml build

# Push to Git (triggers Railway deployment)
git add .
git commit -m "Deploy: Railway fixes"
git push

# Or manually trigger Railway deployment
railway up
```

## 5. Check Logs

```bash
# Backend logs
railway logs --service backend

# Frontend logs  
railway logs --service frontend
```

## Environment Variables Checklist

**Frontend Service:**
- ✅ `BACKEND_URL=finance-accounting-system-eui.railway.internal:8080`

**Backend Service:**
- ✅ `DB_USER` = your Railway MySQL user
- ✅ `DB_PASSWORD` = your Railway MySQL password
- ✅ `DB_HOST` = your Railway MySQL host
- ✅ `DB_PORT` = 3306
- ✅ `DB_NAME` = your database name
- ✅ `SECRET_KEY` = your secret key
- ✅ `JWT_SECRET_KEY` = your JWT secret

## Troubleshooting

**If backend times out:**
- Check if database is seeded: `railway run python -c "from app import create_app; from models import User; app=create_app(); app.app_context().push(); print(User.query.count())"`
- Increase gunicorn timeout: `--timeout 300`
- Check Railway logs for errors

**If 500 errors persist:**
- Verify `has_bus_service` column exists
- Check Railway backend logs for SQL errors
- Ensure all migrations ran successfully
