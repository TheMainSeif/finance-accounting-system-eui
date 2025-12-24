# 📋 Manual Merge Checklist - Student Portal Integration

**Purpose:** Guide for manually integrating Student Portal changes with Finance Portal branch

---

## ⚠️ CRITICAL FILES - MERGE CONFLICTS LIKELY

These files are most likely to have conflicts because both branches modified them:

### Backend Files

#### 1. **`backend/models.py`** ⚠️ HIGH PRIORITY
**Why:** Both branches added new models and fields
- Student Portal added: `EnrollmentFeeBreakdown` model
- Student Portal modified: `Payment` model (added `verified_by`, `verified_at`, `proof_document_url`)
- Finance Portal may have added: Other finance-specific models

**Action:** 
- Keep ALL models from both branches
- Verify no duplicate model names
- Check foreign key relationships are correct

---

#### 2. **`backend/routes/students.py`** ⚠️ HIGH PRIORITY
**Why:** Core student functionality modified
- Updated enrollment endpoint to use FeeCalculator
- Added `/fee-breakdown` endpoint
- Added `@require_student` decorators

**Action:**
- Merge all endpoint additions
- Ensure all endpoints have proper decorators (`@jwt_required`, `@require_student`)
- Test each endpoint after merge

---

#### 3. **`backend/routes/finance.py`** ⚠️ HIGH PRIORITY
**Why:** Finance endpoints expanded
- Added payment verification endpoints (`/payments/pending`, `/payments/:id/verify`, `/payments/:id/reject`)
- Updated existing endpoints with RBAC

**Action:**
- Keep all new endpoints from both branches
- Verify all use `@require_admin` decorator
- Check no duplicate route paths

---

#### 4. **`backend/routes/auth.py`** ⚠️ CRITICAL SECURITY
**Why:** Login logic changed for portal isolation
- Added mandatory `portal` parameter
- Added strict portal validation

**Action:**
- **MUST USE STUDENT PORTAL VERSION** - Security feature
- Verify login returns `role` field in response

---

#### 5. **`backend/app.py`**
**Why:** Blueprint registrations
- Verify all blueprints are registered
- Check CORS configuration

**Action:**
- Merge blueprint imports and registrations
- Keep CORS settings

---

### Frontend Files

#### 6. **`frontend/src/contexts/AuthContext.jsx`** ⚠️ CRITICAL
**Why:** Authentication state management
- Added explicit `role` field
- Added role validation logic
- Enhanced security checks

**Action:**
- **USE STUDENT PORTAL VERSION** - Has security enhancements
- Verify `hasRole()` function exists

---

#### 7. **`frontend/src/components/common/ProtectedRoute.jsx`** ⚠️ CRITICAL
**Why:** Route protection logic
- 4-layer security validation
- Portal isolation enforcement

**Action:**
- **USE STUDENT PORTAL VERSION** - Critical security feature
- Test both student and finance routes after merge

---

#### 8. **`frontend/src/services/api.js`**
**Why:** Axios configuration
- Request interceptor for JWT token

**Action:**
- Should be identical in both branches
- If different, use Student Portal version (has latest interceptor)

---

#### 9. **`frontend/src/services/studentService.js`**
**Why:** Student API calls
- Added `getFeeBreakdown()` method
- Updated `enrollCourse()` to accept `include_bus`

**Action:**
- Keep all methods from Student Portal
- Verify no conflicts with Finance branch changes

---

#### 10. **`frontend/src/App.jsx`**
**Why:** Route definitions
- Student routes
- Finance routes

**Action:**
- Merge all routes from both branches
- Verify ProtectedRoute wraps all protected routes
- Check no duplicate paths

---

## 🆕 NEW FILES - ADD TO FINANCE BRANCH

These files exist ONLY in Student Portal and must be copied:

### Backend New Files

```
✅ backend/services/fee_calculator.py          # Fee calculation logic
✅ backend/utils/rbac.py                       # Role-based access control decorators
✅ backend/migrate_payment_verification.py     # Database migration script
```

### Frontend New Files

```
✅ frontend/src/services/api-routes/finance-routes/paymentVerificationService.js
✅ frontend/src/pages/finance/PendingPayments.jsx
✅ frontend/src/pages/finance/PendingPayments.css
✅ frontend/src/pages/student/CalculatedFees.jsx    # (if not in Finance branch)
✅ frontend/src/pages/student/CalculatedFees.css
```

---

## 📦 DEPENDENCIES - VERIFY PACKAGE.JSON

### Backend (`backend/requirements.txt`)
No new dependencies added - should be compatible

### Frontend (`frontend/package.json`)
Check if Finance branch added any dependencies that Student Portal doesn't have

**Action:**
- Merge dependencies from both branches
- Run `npm install` after merge

---

## 🗄️ DATABASE MIGRATION STEPS

After merging code:

1. **Stop the backend server**
2. **Run migration:**
   ```bash
   cd backend
   python migrate_payment_verification.py
   ```
3. **Verify tables exist:**
   - `enrollment_fee_breakdowns`
   - `payments` (with new columns: `verified_by`, `verified_at`, `proof_document_url`)

4. **Re-seed database (optional):**
   ```bash
   python seed.py
   ```

---

## ✅ POST-MERGE TESTING CHECKLIST

### Security Tests
- [ ] Student cannot access `/finance/*` routes (should redirect)
- [ ] Finance cannot access `/student/*` routes (should redirect)
- [ ] Student cannot call `/api/finance/*` endpoints (should get 403)
- [ ] Finance cannot call `/api/students/*` endpoints (should get 403)
- [ ] Wrong portal login is rejected (not redirected)

### Feature Tests
- [ ] Student can view fee breakdown with categories
- [ ] Student can enroll in courses (fees calculated dynamically)
- [ ] Student can make bank transfer payment with proof upload
- [ ] Finance can view pending payments
- [ ] Finance can approve/reject bank transfers
- [ ] Finance can configure fee structures

### Integration Tests
- [ ] Backend server starts without errors
- [ ] Frontend builds without errors
- [ ] Login works for both portals
- [ ] Dashboard loads for both portals
- [ ] API calls return expected data

---

## 🚨 CONFLICT RESOLUTION STRATEGY

When you encounter a conflict:

1. **Identify the section:**
   - Is it a new function/endpoint? → Keep both
   - Is it a modification to existing code? → Analyze which version is newer/better
   - Is it a security feature? → Prefer Student Portal version (has latest RBAC)

2. **For imports:**
   - Merge all imports from both branches
   - Remove duplicates

3. **For decorators:**
   - Ensure all student endpoints have `@require_student`
   - Ensure all finance endpoints have `@require_admin`

4. **For models:**
   - Keep all fields from both branches
   - Verify no field name conflicts

---

## 📞 NEED HELP?

If you encounter issues:

1. Check the detailed documentation files:
   - `SECURITY_RBAC_IMPLEMENTATION.md`
   - `FEE_CALCULATOR_COMPLETE.md`
   - `BANK_TRANSFER_VERIFICATION_COMPLETE.md`
   - `STRICT_PORTAL_ISOLATION_SUMMARY.md`

2. Common issues:
   - **Import errors:** Check if new files were copied
   - **404 on routes:** Verify blueprint registration in `app.py`
   - **403 on API calls:** Check RBAC decorators are present
   - **Database errors:** Run migration script

---

**Last Updated:** 2025-12-24
**Integration Difficulty:** Medium-High
**Estimated Time:** 2-3 hours
