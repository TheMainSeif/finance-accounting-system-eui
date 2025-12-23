# 🔒 STRICT PORTAL ISOLATION - TESTING GUIDE

## ✅ **IMPLEMENTED: Zero-Tolerance Cross-Portal Authentication**

**Policy**: Users MUST authenticate through the correct portal. Wrong portal = **REJECTED**, not redirected.

---

## Test Scenarios

### ✅ Scenario 1: Student Attempts Finance Portal Login

**Steps**:
1. Navigate to login page
2. Click "Finance" portal
3. Enter student credentials (e.g., `student1` / `pass123`)
4. Click "Sign In"

**Expected Result**:
```
❌ ERROR MESSAGE DISPLAYED:
"Access denied. You cannot access the finance portal with student credentials.
Please use the student portal to log in."

✅ User is NOT authenticated
✅ User is NOT redirected to any dashboard
✅ User remains on login page with error message
✅ No token is stored in localStorage
✅ Backend logs: "SECURITY: Portal access denied - User 'student1' (role: student) attempted to access finance portal"
```

**Backend Response**:
```json
{
  "error": "Access denied. You cannot access the finance portal with student credentials.",
  "code": "PORTAL_ACCESS_DENIED",
  "user_role": "student",
  "attempted_portal": "finance",
  "message": "Please use the student portal to log in."
}
```

**HTTP Status**: `403 Forbidden`

---

### ✅ Scenario 2: Finance User Attempts Student Portal Login

**Steps**:
1. Navigate to login page
2. Click "Student" portal
3. Enter finance credentials (e.g., `admin` / `admin123`)
4. Click "Sign In"

**Expected Result**:
```
❌ ERROR MESSAGE DISPLAYED:
"Access denied. You cannot access the student portal with finance credentials.
Please use the finance portal to log in."

✅ User is NOT authenticated
✅ User is NOT redirected to any dashboard
✅ User remains on login page with error message
✅ No token is stored in localStorage
✅ Backend logs: "SECURITY: Portal access denied - User 'admin' (role: finance) attempted to access student portal"
```

**Backend Response**:
```json
{
  "error": "Access denied. You cannot access the student portal with finance credentials.",
  "code": "PORTAL_ACCESS_DENIED",
  "user_role": "finance",
  "attempted_portal": "student",
  "message": "Please use the finance portal to log in."
}
```

**HTTP Status**: `403 Forbidden`

---

### ✅ Scenario 3: Student Correct Portal Login

**Steps**:
1. Navigate to login page
2. Click "Student" portal
3. Enter student credentials (e.g., `student1` / `pass123`)
4. Click "Sign In"

**Expected Result**:
```
✅ SUCCESS MESSAGE DISPLAYED:
"Login Successful! Redirecting..."

✅ User is authenticated
✅ Token is stored in localStorage
✅ User is redirected to /student/dashboard
✅ User can access all student routes
✅ User CANNOT access finance routes (blocked by ProtectedRoute)
```

**Backend Response**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user_id": 123,
  "username": "student1",
  "email": "student1@example.com",
  "is_admin": false,
  "role": "student",
  "dues_balance": 5000.0
}
```

**HTTP Status**: `200 OK`

---

### ✅ Scenario 4: Finance Correct Portal Login

**Steps**:
1. Navigate to login page
2. Click "Finance" portal
3. Enter finance credentials (e.g., `admin` / `admin123`)
4. Click "Sign In"

**Expected Result**:
```
✅ SUCCESS MESSAGE DISPLAYED:
"Login Successful! Redirecting..."

✅ User is authenticated
✅ Token is stored in localStorage
✅ User is redirected to /finance/dashboard
✅ User can access all finance routes
✅ User CANNOT access student routes (blocked by ProtectedRoute)
```

**Backend Response**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user_id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "is_admin": true,
  "role": "finance",
  "dues_balance": 0.0
}
```

**HTTP Status**: `200 OK`

---

### ✅ Scenario 5: Invalid Credentials

**Steps**:
1. Navigate to login page
2. Click any portal
3. Enter invalid credentials (e.g., `wronguser` / `wrongpass`)
4. Click "Sign In"

**Expected Result**:
```
❌ ERROR MESSAGE DISPLAYED:
"Invalid username or password"

✅ User is NOT authenticated
✅ User remains on login page
✅ No token is stored
```

**Backend Response**:
```json
{
  "error": "Invalid username or password",
  "code": "INVALID_CREDENTIALS"
}
```

**HTTP Status**: `401 Unauthorized`

---

### ✅ Scenario 6: Missing Portal Parameter (API Direct Call)

**Steps**:
1. Make direct API call without portal parameter:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "student1", "password": "pass123"}'
```

**Expected Result**:
```json
{
  "error": "Invalid or missing portal parameter",
  "code": "INVALID_PORTAL"
}
```

**HTTP Status**: `400 Bad Request`

---

### ✅ Scenario 7: Student Tries to Access Finance API

**Steps**:
1. Log in as student
2. Make API call to finance endpoint:
```javascript
fetch('http://localhost:5000/api/finance/summary', {
  headers: {
    'Authorization': 'Bearer <student_token>'
  }
})
```

**Expected Result**:
```json
{
  "error": "Access denied. Finance portal access requires admin privileges.",
  "code": "INSUFFICIENT_PRIVILEGES",
  "required_role": "finance",
  "user_role": "student"
}
```

**HTTP Status**: `403 Forbidden`

---

### ✅ Scenario 8: Finance Tries to Access Student API

**Steps**:
1. Log in as finance
2. Make API call to student endpoint:
```javascript
fetch('http://localhost:5000/api/students/status', {
  headers: {
    'Authorization': 'Bearer <finance_token>'
  }
})
```

**Expected Result**:
```json
{
  "error": "Access denied. Student portal is not accessible with finance credentials.",
  "code": "ROLE_MISMATCH",
  "required_role": "student",
  "user_role": "finance"
}
```

**HTTP Status**: `403 Forbidden`

---

### ✅ Scenario 9: Student Tries to Navigate to Finance Route

**Steps**:
1. Log in as student
2. Manually navigate to `/finance/dashboard` in browser

**Expected Result**:
```
✅ ProtectedRoute detects role mismatch
✅ Immediately redirects to /student/dashboard
✅ Console warning: "Student user attempted to access finance portal"
✅ No finance UI is rendered (no flash)
```

---

### ✅ Scenario 10: Finance Tries to Navigate to Student Route

**Steps**:
1. Log in as finance
2. Manually navigate to `/student/dashboard` in browser

**Expected Result**:
```
✅ ProtectedRoute detects role mismatch
✅ Immediately redirects to /finance/dashboard
✅ Console warning: "Finance user attempted to access student portal"
✅ No student UI is rendered (no flash)
```

---

## Security Validation Checklist

### Backend Protection
- [x] Login endpoint requires `portal` parameter
- [x] Login validates user role matches portal
- [x] Wrong portal returns 403 Forbidden (not 401)
- [x] No authentication token issued for wrong portal
- [x] All student endpoints have `@require_student`
- [x] All finance endpoints have `@require_admin`
- [x] Role validation happens on every API request
- [x] Security events are logged to console

### Frontend Protection
- [x] Login passes portal parameter to backend
- [x] Wrong portal shows error message (no redirect)
- [x] No auth state stored for rejected logins
- [x] ProtectedRoute validates role before rendering
- [x] Cross-portal navigation blocked
- [x] No UI flash of wrong portal
- [x] Console warnings for security events

### User Experience
- [x] Clear error messages for wrong portal
- [x] User stays on login page after rejection
- [x] User can try again with correct portal
- [x] Success message shown for correct portal
- [x] Smooth redirect to correct dashboard

---

## Error Code Reference

| Code | HTTP | Meaning | User Action |
|------|------|---------|-------------|
| `INVALID_PORTAL` | 400 | Portal parameter missing/invalid | Internal error - contact support |
| `INVALID_CREDENTIALS` | 401 | Wrong username/password | Check credentials and try again |
| `PORTAL_ACCESS_DENIED` | 403 | Correct credentials, wrong portal | Use the correct portal for your role |
| `INSUFFICIENT_PRIVILEGES` | 403 | Student accessing finance API | Not authorized - student account |
| `ROLE_MISMATCH` | 403 | Finance accessing student API | Not authorized - finance account |

---

## Testing Commands

### Test Student Login (Correct Portal)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "pass123",
    "portal": "student"
  }'
```

**Expected**: `200 OK` with token

---

### Test Student Login (Wrong Portal)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "pass123",
    "portal": "finance"
  }'
```

**Expected**: `403 Forbidden` with `PORTAL_ACCESS_DENIED`

---

### Test Finance Login (Correct Portal)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "portal": "finance"
  }'
```

**Expected**: `200 OK` with token

---

### Test Finance Login (Wrong Portal)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "portal": "student"
  }'
```

**Expected**: `403 Forbidden` with `PORTAL_ACCESS_DENIED`

---

## Implementation Summary

### What Changed

**Backend** (`routes/auth.py`):
- Login endpoint now requires `portal` parameter
- Validates user role matches portal before authentication
- Returns 403 Forbidden for portal mismatch
- Logs security events

**Frontend** (`authService.js`, `AuthContext.jsx`, `Login.jsx`):
- Login functions accept `portal` parameter
- Portal parameter passed from login form
- Error handling for `PORTAL_ACCESS_DENIED`
- Clear rejection messages (no redirects)

### What Stayed the Same

- ProtectedRoute still blocks cross-portal navigation
- Backend RBAC decorators still enforce API access
- Token structure unchanged
- User object structure unchanged

---

## Deployment Checklist

- [ ] Backend restarted to load changes
- [ ] Frontend hot-reloaded
- [ ] Test all 10 scenarios above
- [ ] Verify error messages are clear
- [ ] Verify no redirects on rejection
- [ ] Verify security logs appear
- [ ] Update user documentation

---

**Last Updated**: 2025-12-23
**Security Level**: Maximum ✅
**Policy**: Zero-Tolerance Cross-Portal Authentication
