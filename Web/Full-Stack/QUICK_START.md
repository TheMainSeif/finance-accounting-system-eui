# Quick Start Guide - Student Dashboard

## Prerequisites
- Node.js installed
- Python 3.8+ installed
- Both backend and frontend code

## 1. Start Backend (First Terminal)

```powershell
cd d:\FMproject\finance-accounting-system-eui-main\finance-accounting-system-eui-main\Web\Full-Stack\backend

# First time only: Seed the database
python seed.py

# Start the server
python app.py
```

**Expected:** Server running on `http://localhost:5000`

## 2. Start Frontend (Second Terminal)

```powershell
cd d:\FMproject\finance-accounting-system-eui-main\finance-accounting-system-eui-main\Web\Full-Stack\frontend

npm run dev
```

**Expected:** Frontend running on `http://localhost:5173`

## 3. Test Login

1. Open browser: `http://localhost:5173`
2. Click **Login** → **Student**
3. Enter:
   - Username: `student1`
   - Password: `pass123`
4. Click **Sign In**

**Expected:** Redirect to dashboard with sidebar showing "Welcome back, student1!"

## Test Credentials

**Students:**
- `student1` / `pass123` (Dues: $5000)
- `student2` / `pass123` (Dues: $2500)
- `student3` / `pass123` (Dues: $6500)
- `student4` / `pass123` (Dues: $8000)
- `student5` / `pass123` (Dues: $2000)

**Admin:**
- `admin` / `admin123`

## Troubleshooting

**Backend won't start:**
```powershell
pip install -r requirements.txt
```

**Frontend errors:**
```powershell
npm install
```

**Database errors:**
```powershell
python seed.py
```

## File Structure

```
frontend/
├── src/
│   ├── services/
│   │   ├── api.js              # Axios instance
│   │   └── authService.js      # Login/Register
│   ├── contexts/
│   │   └── AuthContext.jsx     # Global auth state
│   ├── components/
│   │   └── common/
│   │       └── ProtectedRoute.jsx
│   ├── layouts/
│   │   └── DashboardLayout.jsx # Sidebar + Layout
│   └── pages/
│       ├── auth/
│       │   └── Login.jsx       # Login modal
│       └── student/
│           └── StudentDashboard.jsx

backend/
├── app.py                      # Flask server
├── seed.py                     # Database seeding
├── .env                        # Config (SQLite)
└── fas_db.sqlite              # Database file
```

## Next Steps

See `AUTHENTICATION_IMPLEMENTATION.md` for:
- Detailed architecture
- API documentation
- Implementation plan for Phase 2
