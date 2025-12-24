# Fee Calculator Logic Analysis & Integration Guide

## 📊 Current Fee Calculation Systems

### **Finance Portal - Fee Calculation Page**
**Location:** `frontend/src/pages/finance/FeeCalculation.jsx`

#### **Purpose:**
- Configure the university's fee structure
- Set tuition rates (per credit hour or fixed)
- Set bus fees
- Preview calculated fees for different scenarios

#### **Fee Structure:**
```javascript
// Finance portal manages TWO categories:
1. Tuition Fees (category: 'tuition')
   - Can be "Per Credit" (multiplied by credit hours)
   - Can be "Fixed" (one-time fee)
   - Examples:
     * Per Credit Hour: $500/credit
     * Registration Fee: $200 (fixed)
     * Lab Fee: $150 (fixed)

2. Bus Fees (category: 'bus')
   - Always fixed amounts
   - Optional (student can choose to include or not)
   - Examples:
     * Monthly Bus Pass: $50
     * Semester Bus Pass: $400
```

#### **Calculation Logic (Finance Portal):**
```javascript
// Lines 154-178 in FeeCalculation.jsx
const calculateTotal = () => {
    let tuitionTotal = 0;
    let registrationTotal = 0;
    
    // Process tuition fees
    tuitionFees.forEach(fee => {
        if (fee.is_per_credit) {
            // Multiply by credit hours
            tuitionTotal += fee.amount * creditHours;
        } else {
            // Add as fixed fee
            registrationTotal += fee.amount;
        }
    });
    
    // Process bus fees (always fixed)
    const busTotal = includeBus 
        ? busFees.reduce((sum, fee) => sum + fee.amount, 0)
        : 0;

    return {
        tuition: tuitionTotal,        // Per-credit fees total
        registration: registrationTotal,  // Fixed fees total
        bus: busTotal,                // Bus fees total
        total: tuitionTotal + registrationTotal + busTotal
    };
};
```

---

### **Student Portal - Fee Display**
**Location:** `frontend/src/pages/student/CalculatedFees.jsx`

#### **Purpose:**
- Show student their enrolled courses
- Display total fees owed
- Show payment status

#### **Current Logic:**
```javascript
// PROBLEM: Student portal shows ONLY course fees
// It does NOT break down:
// - Per-credit tuition
// - Registration fees
// - Bus fees
// - Other fees

// Current display (lines 107-116):
<div className="summary-row">
  <span className="summary-label">Tuition Fees</span>
  <span className="summary-value">${duesBalance.toLocaleString()}</span>
</div>
<div className="summary-row total-row">
  <span className="summary-label">Total Due</span>
  <span className="summary-total">${duesBalance.toLocaleString()}</span>
</div>

// ❌ This is INCOMPLETE - it only shows total, not breakdown
```

---

### **Backend - Course Enrollment Logic**
**Location:** `backend/routes/students.py` (lines 62-71)

#### **Current Enrollment Logic:**
```python
# When student enrolls in a course:
enrollment = Enrollment(
    student_id=student_id,
    course_id=course_id,
    course_fee=course.total_fee,  # ❌ PROBLEM: Uses course.total_fee
    status='ACTIVE'
)

# Update student dues
student.dues_balance += course.total_fee  # ❌ PROBLEM: Simple addition
```

#### **❌ PROBLEM:**
The current system uses `course.total_fee` which is a **single fixed amount** per course. This does NOT account for:
- Per-credit hour calculation
- Registration fees
- Bus fees
- Other configurable fees from FeeStructure table

---

## 🔧 Required Changes

### **Change 1: Update Course Model**
**File:** `backend/models.py`

**Current:**
```python
class Course(db.Model):
    total_fee = db.Column(db.Float, nullable=False)  # Single fixed fee
```

**Proposed:**
```python
class Course(db.Model):
    # Remove total_fee or make it optional
    # Fee will be calculated dynamically based on FeeStructure
    base_fee_per_credit = db.Column(db.Float, default=0.0)  # Optional: course-specific rate
```

---

### **Change 2: Create Fee Calculation Service (Backend)**
**File:** `backend/services/fee_calculator.py` (NEW FILE)

```python
from models import db, FeeStructure, Course, User
from datetime import datetime, timezone, timedelta

class FeeCalculator:
    """
    Centralized fee calculation service that matches Finance portal logic.
    """
    
    @staticmethod
    def calculate_enrollment_fees(student_id, course_ids, include_bus=False):
        """
        Calculate total fees for enrolling in courses.
        
        Args:
            student_id: Student ID
            course_ids: List of course IDs to enroll in
            include_bus: Whether to include bus fees
            
        Returns:
            {
                'tuition_fees': float,
                'registration_fees': float,
                'bus_fees': float,
                'total': float,
                'breakdown': [
                    {
                        'category': 'tuition',
                        'name': 'Per Credit Hour',
                        'amount': 500,
                        'quantity': 15,  # credit hours
                        'subtotal': 7500
                    },
                    ...
                ]
            }
        """
        # Get all active fee structures
        tuition_fees = FeeStructure.query.filter_by(
            category='tuition',
            is_active=True
        ).order_by(FeeStructure.display_order).all()
        
        bus_fees = FeeStructure.query.filter_by(
            category='bus',
            is_active=True
        ).order_by(FeeStructure.display_order).all()
        
        # Get courses
        courses = Course.query.filter(Course.id.in_(course_ids)).all()
        total_credits = sum(course.credits for course in courses)
        
        # Calculate tuition
        tuition_total = 0
        registration_total = 0
        breakdown = []
        
        for fee in tuition_fees:
            if fee.is_per_credit:
                subtotal = fee.amount * total_credits
                tuition_total += subtotal
                breakdown.append({
                    'category': 'tuition',
                    'name': fee.name,
                    'amount': fee.amount,
                    'quantity': total_credits,
                    'is_per_credit': True,
                    'subtotal': subtotal
                })
            else:
                registration_total += fee.amount
                breakdown.append({
                    'category': 'tuition',
                    'name': fee.name,
                    'amount': fee.amount,
                    'quantity': 1,
                    'is_per_credit': False,
                    'subtotal': fee.amount
                })
        
        # Calculate bus fees
        bus_total = 0
        if include_bus:
            for fee in bus_fees:
                bus_total += fee.amount
                breakdown.append({
                    'category': 'bus',
                    'name': fee.name,
                    'amount': fee.amount,
                    'quantity': 1,
                    'is_per_credit': False,
                    'subtotal': fee.amount
                })
        
        return {
            'tuition_fees': tuition_total,
            'registration_fees': registration_total,
            'bus_fees': bus_total,
            'total': tuition_total + registration_total + bus_total,
            'total_credits': total_credits,
            'breakdown': breakdown
        }
    
    @staticmethod
    def calculate_payment_due_date(enrollment_date=None):
        """Calculate payment due date (30 days from enrollment)."""
        if enrollment_date is None:
            enrollment_date = datetime.now(timezone.utc)
        return enrollment_date + timedelta(days=30)
```

---

### **Change 3: Update Enrollment Endpoint**
**File:** `backend/routes/students.py`

**Replace lines 62-71 with:**
```python
from services.fee_calculator import FeeCalculator

# Calculate fees using FeeCalculator
fee_calculation = FeeCalculator.calculate_enrollment_fees(
    student_id=student_id,
    course_ids=[course_id],
    include_bus=data.get('include_bus', False)  # Student can opt-in
)

# Create enrollment with detailed fee breakdown
enrollment = Enrollment(
    student_id=student_id,
    course_id=course_id,
    course_fee=fee_calculation['total'],  # Total calculated fee
    status='ACTIVE'
)

# Update student dues
student.dues_balance += fee_calculation['total']
student.payment_due_date = FeeCalculator.calculate_payment_due_date()
student.updated_at = datetime.now(timezone.utc)

# Store fee breakdown in notification or separate table
notification = Notification(
    student_id=student_id,
    notification_type='ENROLLMENT',
    message=f"""You have successfully enrolled in {course.name}.
    
Fee Breakdown:
- Tuition ({fee_calculation['total_credits']} credits): ${fee_calculation['tuition_fees']:.2f}
- Registration & Other Fees: ${fee_calculation['registration_fees']:.2f}
- Bus Fees: ${fee_calculation['bus_fees']:.2f}
Total: ${fee_calculation['total']:.2f}

Payment due by: {student.payment_due_date.strftime('%B %d, %Y')}
"""
)
```

---

### **Change 4: Create Fee Breakdown Table (Optional but Recommended)**
**File:** `backend/models.py`

```python
class EnrollmentFeeBreakdown(db.Model):
    """
    Stores detailed fee breakdown for each enrollment.
    Allows historical tracking even if FeeStructure changes.
    """
    __tablename__ = "enrollment_fee_breakdowns"
    
    id = db.Column(db.Integer, primary_key=True)
    enrollment_id = db.Column(db.Integer, db.ForeignKey('enrollments.id'), nullable=False)
    fee_category = db.Column(db.String(50), nullable=False)  # 'tuition', 'bus', 'other'
    fee_name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, default=1)  # For per-credit fees
    is_per_credit = db.Column(db.Boolean, default=False)
    subtotal = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationship
    enrollment = db.relationship('Enrollment', backref='fee_breakdown')
```

---

### **Change 5: Update Student Portal - Calculated Fees Page**
**File:** `frontend/src/pages/student/CalculatedFees.jsx`

**Add new API call:**
```javascript
// NEW: Fetch detailed fee breakdown
const fetchFeeBreakdown = async () => {
    try {
        const data = await studentService.getFeeBreakdown();
        setFeeBreakdown(data.breakdown);
        setTotals({
            tuition: data.tuition_fees,
            registration: data.registration_fees,
            bus: data.bus_fees,
            total: data.total
        });
    } catch (err) {
        console.error('Failed to load fee breakdown:', err);
    }
};
```

**Update UI to show breakdown:**
```jsx
{/* Fee Breakdown */}
<div className="fee-category-card">
    <h2>Tuition Fees</h2>
    {feeBreakdown
        .filter(item => item.category === 'tuition' && item.is_per_credit)
        .map((item, index) => (
            <div key={index} className="fee-item">
                <span>{item.name} ({item.quantity} credits × ${item.amount})</span>
                <span>${item.subtotal.toLocaleString()}</span>
            </div>
        ))
    }
</div>

<div className="fee-category-card">
    <h2>Registration & Other Fees</h2>
    {feeBreakdown
        .filter(item => item.category === 'tuition' && !item.is_per_credit)
        .map((item, index) => (
            <div key={index} className="fee-item">
                <span>{item.name}</span>
                <span>${item.subtotal.toLocaleString()}</span>
            </div>
        ))
    }
</div>

{totals.bus > 0 && (
    <div className="fee-category-card">
        <h2>Bus Fees</h2>
        {feeBreakdown
            .filter(item => item.category === 'bus')
            .map((item, index) => (
                <div key={index} className="fee-item">
                    <span>{item.name}</span>
                    <span>${item.subtotal.toLocaleString()}</span>
                </div>
            ))
        }
    </div>
)}

{/* Summary */}
<div className="summary-card">
    <div className="summary-row">
        <span>Tuition</span>
        <span>${totals.tuition.toLocaleString()}</span>
    </div>
    <div className="summary-row">
        <span>Registration & Other</span>
        <span>${totals.registration.toLocaleString()}</span>
    </div>
    {totals.bus > 0 && (
        <div className="summary-row">
            <span>Bus Fees</span>
            <span>${totals.bus.toLocaleString()}</span>
        </div>
    )}
    <div className="summary-divider"></div>
    <div className="summary-row total-row">
        <span>Total Due</span>
        <span>${totals.total.toLocaleString()}</span>
    </div>
</div>
```

---

### **Change 6: Add Bus Fee Option to Course Registration**
**File:** `frontend/src/pages/student/CourseRegistration.jsx`

**Add checkbox for bus fees:**
```jsx
{/* Before submitting registration */}
<div className="registration-options">
    <label>
        <input
            type="checkbox"
            checked={includeBus}
            onChange={(e) => setIncludeBus(e.target.checked)}
        />
        Include Bus Fees
    </label>
</div>

{/* Update registration submission */}
const handleRegister = async () => {
    for (const courseId of selectedCourses) {
        await studentService.enrollCourse({
            course_id: courseId,
            include_bus: includeBus  // Send bus preference
        });
    }
};
```

---

## 📋 Implementation Checklist

### **Phase 1: Backend Changes**
- [ ] Create `FeeCalculator` service class
- [ ] Update `enroll_course()` endpoint to use FeeCalculator
- [ ] (Optional) Create `EnrollmentFeeBreakdown` model
- [ ] Add migration for new table (if created)
- [ ] Create API endpoint `/api/students/fee-breakdown`
- [ ] Test fee calculation with different scenarios

### **Phase 2: Frontend Changes**
- [ ] Update `CalculatedFees.jsx` to fetch and display breakdown
- [ ] Add bus fee checkbox to `CourseRegistration.jsx`
- [ ] Update enrollment API call to include `include_bus` parameter
- [ ] Test UI with different fee configurations

### **Phase 3: Data Migration**
- [ ] Run `clear_data.py` to reset enrollments
- [ ] Configure fee structure in Finance portal
- [ ] Test complete flow: Register → View Fees → Make Payment

### **Phase 4: Testing**
- [ ] Test with 0 credit courses
- [ ] Test with per-credit fees only
- [ ] Test with fixed fees only
- [ ] Test with bus fees included/excluded
- [ ] Test payment recording updates balance correctly
- [ ] Verify Finance portal sees correct data

---

## 🎯 Expected Outcome

**Before:**
- Student enrolls → `dues_balance += course.total_fee` (single fixed amount)
- Student sees only total, no breakdown
- Finance portal fee calculator is disconnected from actual charges

**After:**
- Student enrolls → Fees calculated from `FeeStructure` table
- Student sees detailed breakdown:
  * Tuition (15 credits × $500) = $7,500
  * Registration Fee = $200
  * Lab Fee = $150
  * Bus Pass = $400
  * **Total = $8,250**
- Finance portal configuration directly affects student charges
- Complete integration between both portals

---

**Created:** 2025-12-23
**Status:** Implementation Required
