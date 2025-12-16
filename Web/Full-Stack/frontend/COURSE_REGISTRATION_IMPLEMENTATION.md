# Course Registration System - Implementation Documentation

This document outlines the complete implementation of the Course Registration and Management system for the Student Dashboard.

## 1. Overview
The Course Registration module allows students to:
- View available courses.
- See their current enrollment status.
- Register for new courses (batch selection).
- Drop existing enrolled courses (immediate action).
- View a real-time summary of their "shopping cart" (new registrations).
- Persist state via backend synchronization.

---

## 2. Backend Implementation (Flask API)

### Files Modified
- **`backend/routes/students.py`**: Added Enrollment and Drop logic.
- **`backend/models.py`**: Referenced for schema (User, Course, Enrollment, Notification).

### Endpoints Implemented

#### 1. Get Available Courses
- **Endpoint**: `GET /api/courses`
- **Logic**: Returns a list of all active courses with details (ID, Name, Credits, Fee).

#### 2. Get Student Dashboard Status
- **Endpoint**: `GET /api/students/status`
- **Logic**: 
  - Retrieves the student's current enrollment data.
  - Used to populate the "Enrolled" state in the UI.
  - Returns a list of `enrollment` objects containing `course_id`.

#### 3. Enroll in Course
- **Endpoint**: `POST /api/students/enroll`
- **Body**: `{ "course_id": <int> }`
- **Logic**: checks for existing enrollment to avoid duplicates.
  - Creates a new `Enrollment` record.
  - **Updates Dues**: Adds the course fee to the student's `dues_balance`.
  - Creates a generic `Notification`.
  - Commits transaction atomically.

#### 4. Drop Course (New)
- **Endpoint**: `DELETE /api/students/enroll/<int:course_id>`
- **Logic**:
  - Verifies enrollment exists.
  - **Refunds Dues**: Subtracts the course fee from `dues_balance`.
  - Deletes the `Enrollment` record.
  - Creates a generic `Notification` about the drop.
  - Commits transaction.

---

## 3. Frontend Implementation (React)

### Files Created/Modified
- `src/services/studentService.js` (API Layer)
- `src/pages/student/CourseRegistration.jsx` (Main Component)
- `src/pages/student/CourseRegistration.css` (Styling)
- `src/layouts/DashboardLayout.jsx` (Navigation)
- `src/App.jsx` (Routing)

### A. API Service (`studentService.js`)
Abstracted backend calls into clean methods:
- `getCourses()`: Fetches course catalog.
- `getDashboardStatus()`: Fetches current enrollments.
- `enrollCourse(courseId)`: POST request to register.
- `dropCourse(courseId)`: DELETE request to drop.

### B. State Management
Used React `useState` and `useEffect` to manage complex interaction logic:
- **`courses`**: Complete catalog.
- **`enrolledCourseIds`**: List of IDs the student owns (Source of Truth from Backend).
- **`selectedCourses`**: "Shopping Cart" of *new* courses to be registered.

**Key Logic Flow:**
1. **On Load**: Fetch all courses AND student status.
2. **Sync**: Populate `enrolledCourseIds` to mark courses as currently owned.
3. **Filter**: Ensure `selectedCourses` does not include already enrolled items.

### C. UI Component (`CourseRegistration.jsx`)

#### Interaction Design
- **Enrolled Courses**: 
  - Visual: Gray background, "Enrolled" badge.
  - Action: **Drop Button** (Immediate, with confirmation).
- **Available Courses**: 
  - Visual: White background, Selectable.
  - Action: **Checkbox** (Batch selection).
- **Registration Summary**:
  - Only counts **newly selected** courses.
  - Shows total credits and estimated fees for the *current batch*.
  - **Submit Button**: Registers all selected courses at once.

#### Validation
- **Credit Limit**: Prevents selecting more than 18 credits per transaction.
- **Empty Submission**: Prevents submitting 0 courses.

### D. Styling (`CourseRegistration.css`)
- **Responsive Grid**: Course cards adapt to screen size.
- **Status Indicators**:
  - Gray styling (`.enrolled`) for owned courses.
  - Green highlights (`.selected`) for new selections.
  - Red/Amber buttons (`.btn-drop`) for dangerous actions.
- **Sticky Sidebar**: Summary stays visible while scrolling.

---

## 4. Workflow Summary

1. **Navigation**: Student clicks "Course Registration" in sidebar.
2. **View**: Student sees a list of courses. Owned courses are already grayed out.
3. **Add**: Student checks "Data Structures" (New).
   - Sidebar updates: "Selected Courses: 1", "Fees: $500".
4. **Drop**: Student clicks "Drop" on "English 101" (Old).
   - Alert: "Are you sure?" -> Yes.
   - UI: "English 101" reverts to white (Available).
   - Backend: Dues reduced.
5. **Submit**: Student clicks "Submit Registration".
   - Frontend calls `enrollCourse` for "Data Structures".
   - Success Message: "Registration successful!".
   - Page refreshes state.

## 5. Security & Persistence
- **Route Protection**: Access limited to logged-in users with `student` role via `ProtectedRoute.jsx`.
- **JWT**: All requests include the Bearer token.
- **Atomic Transactions**: Backend ensures enrollment and billing updates happen together or fail together.

---

## 6. Future Improvements (Backlog)
- [ ] Add semester filtering.
- [ ] Add prerequisites check before enrollment.
- [ ] Add waitlist functionality for full courses.
