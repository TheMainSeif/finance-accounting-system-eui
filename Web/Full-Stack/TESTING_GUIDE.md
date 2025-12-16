# Backend Setup & Testing Guide

## Step 1: Start the Backend

Open a **new terminal** in the backend directory and run:

```powershell
cd d:\FMproject\finance-accounting-system-eui-main\finance-accounting-system-eui-main\Web\Full-Stack\backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Run the seed script (creates database + test users)
python seed.py

# Start the backend server
python app.py
```

**Expected Output:**
```
* Running on http://127.0.0.1:5000
```

## Step 2: Test the Backend is Running

Open another terminal and test:

```powershell
curl http://localhost:5000/api/health
```

You should see a success response.

## Step 3: Test Login from Frontend

1. Open your browser to `http://localhost:5173` (your frontend)
2. Click the **Login** button in the navbar
3. Select **Student** portal
4. Use these credentials:
   - **Username:** `student1`
   - **Password:** `pass123`
5. Click **Sign In**

**Expected Result:**
- You should see "Login Successful! Redirecting..."
- The page should redirect to `/student/dashboard`
- You should see the dashboard with sidebar showing "Welcome back, student1!"

## Step 4: Verify the Data

Open browser DevTools (F12) → Network tab:
- Look for the `login` request
- Check the Response - you should see:
  ```json
  {
    "access_token": "eyJ0eXAi...",
    "user_id": 2,
    "username": "student1",
    "is_admin": false,
    "dues_balance": 0.0
  }
  ```

## Test Users (from seed.py)

**Admin:**
- Username: `admin`
- Password: `admin123`

**Students:**
- Username: `student1`, `student2`, `student3`, `student4`, `student5`
- Password: `pass123` (for all)

## Troubleshooting

### Backend won't start
- Make sure MySQL is running (or the seed script will fail)
- Check the `.env` file exists with correct database credentials

### "Invalid credentials" error
- Make sure you ran `python seed.py` to create the test users
- Double-check the username/password

### CORS errors in browser
- The backend has CORS enabled, but make sure it's running on port 5000
- Frontend proxy in `vite.config.js` should point to `http://localhost:5000`
