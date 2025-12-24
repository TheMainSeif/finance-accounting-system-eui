# 📊 Finance Portal - Folder Structure & Components

**Location:** `frontend/src/pages/finance/`

---

## 📁 File Overview (30 Files Total)

### 🏠 **Main Pages** (Core Features)

| File | Purpose | Key Features |
|------|---------|--------------|
| **FinanceDashboard.jsx** | Main dashboard for finance staff | Summary stats, recent payments, faculty breakdown, bank reconciliation overview |
| **FinanceDashboard.css** | Dashboard styling | Cards, charts, responsive layout |
| **StudentList.jsx** | List of all students with financial data | Search, filter, view dues, payment history |
| **StudentList.css** | Student list styling | Table layout, status badges |
| **UnpaidStudents.jsx** | Students with outstanding dues | Overdue tracking, bulk actions, individual contact |
| **UnpaidStudents.css** | Unpaid students styling | Alert colors, action buttons |
| **PendingPayments.jsx** | Bank transfer verification queue | Review proofs, approve/reject payments |
| **PendingPayments.css** | Pending payments styling | Card grid, modal overlays |
| **Reports.jsx** | Financial reports generation | Payment status, faculty reports, date ranges |
| **Reports.css** | Reports styling | Charts, export buttons |
| **FeeCalculation.jsx** | Fee structure configuration | Per-credit fees, fixed fees, bus fees |
| **FeeCalculation.css** | Fee calculator styling | Form inputs, preview section |
| **BankReconciliation.jsx** | Match bank statements with payments | Transaction matching, discrepancy detection |
| **BankReconciliation.css** | Bank reconciliation styling | Split view, match indicators |

---

## 🔧 **Modal Components** (Reusable Dialogs)

### Student Management Modals
| File | Purpose |
|------|---------|
| **StudentDetailsModal.jsx** | View detailed student financial info |
| **StudentDetailsModal.css** | Student details modal styling |
| **IndividualActionModal.jsx** | Contact/block individual student |
| **IndividualActionModal.css** | Individual action modal styling |
| **IndividualActionSuccessModal.jsx** | Confirmation after individual action |
| **IndividualActionSuccessModal.css** | Success modal styling |

### Bulk Operations Modals
| File | Purpose |
|------|---------|
| **BulkActionModal.jsx** | Perform actions on multiple students |
| **BulkActionModal.css** | Bulk action modal styling |
| **BulkActionResultModal.jsx** | Show results of bulk operations |
| **BulkActionResultModal.css** | Bulk result modal styling |

### Bank Reconciliation Modals
| File | Purpose |
|------|---------|
| **BankDataFormModal.jsx** | Upload/input bank statement data |
| **BankDataFormModal.css** | Bank data form styling |
| **BankSyncModal.jsx** | Sync with bank API (if configured) |
| **BankSyncModal.css** | Bank sync modal styling |
| **MatchTransactionModal.jsx** | Manually match transaction to payment |
| **MatchTransactionModal.css** | Match transaction modal styling |

---

## 🎯 Component Relationships

```
FinanceDashboard (Main Hub)
├── Quick Stats Cards
├── Recent Payments Table
├── Faculty Payment Breakdown Chart
└── Bank Reconciliation Summary

StudentList (All Students)
├── Search & Filter Bar
├── Student Table
└── → StudentDetailsModal (on row click)
    └── Payment History
    └── Enrollment Details

UnpaidStudents (Overdue Management)
├── Overdue Students Table
├── Bulk Action Button → BulkActionModal
│   └── → BulkActionResultModal (after execution)
└── Individual Action Button → IndividualActionModal
    └── → IndividualActionSuccessModal (after execution)

PendingPayments (Payment Verification)
├── Pending Payment Cards
└── Review Modal
    ├── Proof Document Viewer
    ├── Approve Button
    └── Reject Button (with reason input)

Reports (Analytics)
├── Report Type Selector
├── Date Range Picker
├── Generate Button
└── Export Options (PDF, Excel)

FeeCalculation (Configuration)
├── Tuition Fees Section
│   ├── Per-Credit Fees (add/edit/delete)
│   └── Fixed Fees (add/edit/delete)
├── Bus Fees Section
└── Preview Calculator

BankReconciliation (Transaction Matching)
├── Upload Bank Statement → BankDataFormModal
├── Sync with Bank → BankSyncModal
├── Unmatched Transactions List
└── Match Button → MatchTransactionModal
```

---

## 📊 Feature Breakdown

### 1. **Dashboard** (`FinanceDashboard.jsx`)
**What it does:**
- Shows total revenue, pending payments, overdue students
- Displays recent payment activity
- Faculty-wise payment breakdown chart
- Quick access to all features

**API Calls:**
- `GET /api/finance/summary` - Overall stats
- `GET /api/finance/payments/recent` - Recent payments
- `GET /api/finance/payments/by-faculty` - Faculty breakdown
- `GET /api/finance/bank/reconciliation/summary` - Bank status

---

### 2. **Student List** (`StudentList.jsx`)
**What it does:**
- View all students with their financial status
- Search by name, ID, or email
- Filter by faculty, payment status
- Click student to see detailed modal

**API Calls:**
- `GET /api/finance/students` - All students with dues

---

### 3. **Unpaid Students** (`UnpaidStudents.jsx`)
**What it does:**
- List students with overdue payments
- Bulk actions: Send reminders, apply penalties, block access
- Individual actions: Contact student, view details

**API Calls:**
- `GET /api/finance/unpaid-report` - Overdue students
- `POST /api/finance/action/contact/:id` - Send reminder
- `POST /api/finance/action/penalty/:id` - Apply penalty
- `POST /api/finance/action/block/:id` - Block student

---

### 4. **Pending Payments** (`PendingPayments.jsx`)
**What it does:**
- Review bank transfer payment proofs
- Approve or reject payments
- View uploaded proof documents
- Update student balance on approval

**API Calls:**
- `GET /api/finance/payments/pending` - Pending bank transfers
- `POST /api/finance/payments/:id/verify` - Approve payment
- `POST /api/finance/payments/:id/reject` - Reject payment
- `GET /api/finance/payments/:id/proof` - View proof document

---

### 5. **Reports** (`Reports.jsx`)
**What it does:**
- Generate payment status reports
- Faculty-wise revenue reports
- Date range filtering
- Export to PDF/Excel

**API Calls:**
- `GET /api/finance/reports/status` - Payment status report
- `GET /api/finance/reports/faculty/:id` - Faculty report
- `POST /api/finance/reports/generate` - Custom report

---

### 6. **Fee Calculation** (`FeeCalculation.jsx`)
**What it does:**
- Configure tuition fee structure
- Set per-credit hour fees
- Set fixed fees (registration, lab, etc.)
- Configure bus fees
- Preview fee calculator

**API Calls:**
- `GET /api/finance/fee-structures` - Current fee structure
- `POST /api/finance/fee-structures` - Add new fee
- `PUT /api/finance/fee-structures/:id` - Update fee
- `DELETE /api/finance/fee-structures/:id` - Remove fee

---

### 7. **Bank Reconciliation** (`BankReconciliation.jsx`)
**What it does:**
- Upload bank statement CSV
- Match bank transactions with student payments
- Identify discrepancies
- Manual matching for unclear transactions

**API Calls:**
- `POST /api/finance/bank/upload` - Upload statement
- `GET /api/finance/bank/unmatched` - Unmatched transactions
- `POST /api/finance/bank/match` - Match transaction to payment

---

## 🎨 Styling Patterns

All CSS files follow consistent patterns:
- **Card-based layouts** for data display
- **Modal overlays** for forms and details
- **Responsive design** (mobile-friendly)
- **Status badges** (Paid, Pending, Overdue, Blocked)
- **Action buttons** with hover effects
- **Dark theme** compatibility

---

## 🔐 Security

All components use:
- `@require_admin` decorator on backend
- JWT token authentication
- Role-based access control (finance only)
- Protected routes in React Router

---

## 📈 Usage Flow

**Typical Finance Staff Workflow:**

1. **Login** → Finance Dashboard
2. **Check Dashboard** → See pending payments, overdue students
3. **Verify Payments** → Go to Pending Payments → Approve/Reject
4. **Manage Overdue** → Go to Unpaid Students → Send reminders or apply penalties
5. **Configure Fees** → Go to Fee Calculation → Update fee structure
6. **Generate Reports** → Go to Reports → Export monthly revenue report
7. **Bank Reconciliation** → Upload statement → Match transactions

---

**Total Lines of Code:** ~200,000+ (including CSS)
**Total Components:** 14 main pages + 9 modals = 23 components
**API Endpoints Used:** 20+ finance-specific endpoints

This is a **full-featured financial management system** for university administration! 🎓💰
