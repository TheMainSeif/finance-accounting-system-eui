# Finance & Accounting System (F&AS) - EUI University

A comprehensive full-stack web application for managing student finances, course enrollments, payments, and financial reporting at Egyptian University for Informatics (EUI).

## 📋 Project Overview

The Finance & Accounting System is a complete software engineering case study that integrates three academic disciplines:
- **Web Programming**: Full-stack development with modern web technologies
- **Strategic Project Management**: Complete PMBOK-based project planning and documentation
- **Software Testing**: Comprehensive testing strategy and quality assurance

This system streamlines financial operations for a university environment, managing student enrollments, fee calculations, payment processing, bank reconciliation, and generating analytical reports for administrators.

---

## 🏗️ System Architecture

### Technology Stack

**Frontend:**
- React 19.2.0 with Vite build tool
- Ant Design (antd) 6.1.1 for professional UI components
- React Router DOM for client-side routing
- Axios for API communication
- jsPDF & html2canvas for PDF generation

**Backend:**
- Flask (Python) with RESTful API architecture
- SQLAlchemy ORM for database management
- Flask-JWT-Extended for secure authentication
- Flask-Migrate for database version control
- Gunicorn WSGI server for production deployment

**Database:**
- MySQL 8.0 with comprehensive relational schema
- 9 core data models with foreign key constraints
- Automated migrations and seeding

**Deployment:**
- Docker & Docker Compose for containerization
- Railway.app for cloud hosting
- Nginx as reverse proxy

---

## 📊 Database Design

The system implements 9 interconnected models:

### Core Models

1. **Faculty** - Represents university faculties
   - 4 faculties: CIS (Computer & Information Sciences), DAD (Digital Arts & Design), BI (Business Informatics), ENG (Engineering)
   - Each faculty has multiple courses and students

2. **User** - Students and administrators
   - Role-based access (Student/Admin)
   - Student ID format: `YY-XXXXXX` (e.g., `22-101153` where 22 is entry year)
   - Tracks dues balance, payment due dates, and blocking status
   - Secure password hashing with PBKDF2-SHA256

3. **Course** - Academic courses with fees
   - 57 courses across 4 faculties
   - Credit hours and total fee per course
   - Faculty association for proper organization

4. **Enrollment** - Student course registrations
   - Links students to courses
   - Tracks enrollment status (ACTIVE, COMPLETED, DROPPED)
   - Stores course fee snapshot at enrollment time

5. **EnrollmentFeeBreakdown** - Detailed fee itemization
   - Breaks down fees by category (tuition, bus, admin, other)
   - Per-credit vs. flat fee distinction
   - Historical tracking even if fee structure changes

### Financial Models

6. **Payment** - Payment transaction records
   - Multiple payment methods (ONLINE, BANK_TRANSFER, MANUAL)
   - Payment verification workflow
   - Reference numbers and proof documents
   - Status tracking (RECEIVED, PENDING, REJECTED, RECONCILED)

7. **Penalty** - Late fees and financial penalties
   - Automatic penalty calculation for late payments
   - Tracks who applied the penalty and when
   - Integrated into dues balance calculation

8. **BankTransaction** - Bank reconciliation records
   - Import bank statements for reconciliation
   - Match bank transactions to student payments
   - Track unmatched transactions

9. **GeneratedReport** - Financial reports
   - Multi-level reporting (Student, Faculty, University, Finance Overview)
   - PDF and Excel export formats
   - Stores report parameters and metadata

---

## 🎯 Core Functionality

### Student Portal

**Dashboard:**
- View enrolled courses with fee breakdown
- Check outstanding balance and payment history
- View notifications and account status
- Download payment receipts as PDF

**Course Management:**
- Browse available courses by faculty
- Enroll in new courses
- Drop courses (with fee implications)
- View course details and prerequisites

**Financial Management:**
- View detailed fee breakdown (tuition, admin, bus, other)
- Track payment history with dates and methods
- Download official payment receipts
- Check payment due dates and penalties

### Finance/Admin Portal

**Student Financial Overview:**
- Comprehensive dashboard of all students
- Filter by faculty, payment status, or dues amount
- Quick access to student financial details
- Student blocking/unblocking for non-payment

**Payment Management:**
- Record payments (manual, online, bank transfer)
- Verify and reconcile payments
- Upload payment proof documents
- Track payment verification workflow

**Bank Reconciliation:**
- Import bank transaction statements
- Match bank transactions to student payments
- Identify unmatched transactions
- Generate reconciliation reports

**Penalty Management:**
- Apply late fees to students
- Automatic penalty calculation
- Track penalty history
- Integrate penalties into dues balance

**Report Generation:**
- **Student-Level Reports**: Individual student financial statements
- **Faculty-Level Reports**: Aggregated data per faculty
- **University-Level Reports**: Institution-wide financial overview
- **Finance Overview Reports**: Payment trends and analytics
- Export all reports in PDF and Excel formats

---

## 🔐 Security & Authentication

**Authentication System:**
- JWT (JSON Web Token) based authentication
- Secure token storage and validation
- Token expiration and refresh mechanism
- Role-based access control (RBAC)

**Security Measures:**
- Password hashing with PBKDF2-SHA256 and salt
- SQL injection prevention via SQLAlchemy ORM
- CORS (Cross-Origin Resource Sharing) protection
- Input validation on both client and server
- Secure API endpoints with JWT verification

**Authorization:**
- Separate portals for students and administrators
- Route-level access control
- API endpoint protection based on user role
- Student data privacy enforcement

---

## 📁 Project Structure

```
finance-accounting-system-eui/
├── Web/Full-Stack/              # Full-stack application
│   ├── backend/                 # Flask backend
│   │   ├── routes/              # API endpoints
│   │   │   ├── auth.py          # Authentication
│   │   │   ├── students.py      # Student operations
│   │   │   ├── finance.py       # Finance operations
│   │   │   └── courses.py       # Course management
│   │   ├── models.py            # Database models
│   │   ├── app.py               # Application factory
│   │   ├── config.py            # Configuration
│   │   └── seed.py              # Database seeding
│   │
│   └── frontend/                # React frontend
│       ├── src/
│       │   ├── pages/           # Page components
│       │   │   ├── auth/        # Login/Register
│       │   │   ├── student/     # Student dashboard
│       │   │   └── finance/     # Finance dashboard
│       │   ├── layouts/         # Layout components
│       │   ├── contexts/        # React contexts (Auth, etc.)
│       │   └── services/        # API services
│       └── package.json
│
├── SITM/                        # Strategic IT Management
│   ├── Project charter.docx     # Project authorization
│   ├── WBS.pdf                  # Work Breakdown Structure
│   ├── PM baseline.pdf          # Project baseline
│   ├── Scope Management Plan.pdf
│   ├── Schedule Management Plan.pdf
│   ├── Stakeholder register.pdf
│   └── project schedule.pod
│
└── Testing/                     # Software Testing
    └── README.md                # Testing documentation
```

---

## 📊 Sample Data

The system includes a comprehensive seeding script that generates realistic test data:

**Users:**
- 1 admin user (username: `admin`, password: `admin123`)
- 20 students across 4 faculties with realistic IDs:
  - `22-XXXXXX`: Senior students (2022 entry year)
  - `23-XXXXXX`: Junior students (2023 entry year)
  - `24-XXXXXX`: Sophomore students (2024 entry year)
  - `25-XXXXXX`: Freshman students (2025 entry year)

**Courses:**
- **CIS**: 15 courses (CS101-CS403) covering programming, algorithms, databases, AI, cloud computing
- **DAD**: 14 courses (DAD101-DAD402) covering design, animation, UI/UX, game design
- **BI**: 14 courses (BI101-BI402) covering business analytics, enterprise systems, e-commerce
- **ENG**: 14 courses (ENG101-MECH401) covering mathematics, thermodynamics, robotics

**Enrollments:**
- Intelligent enrollment based on student year:
  - Seniors: 4-6 courses
  - Juniors: 3-5 courses
  - Sophomores: 2-4 courses
  - Freshmen: 2-3 courses

**Financial Data:**
- Realistic payment patterns (60% of students have made payments)
- Payments ranging from 30% to 100% of dues
- Automatic penalties for students with low payment ratios
- Student blocking for high outstanding dues

---

## 🛠️ Key Features

### Fee Management
- Multi-category fee structure (tuition, admin, bus, other)
- Per-credit hour fees and flat fees
- Automatic fee calculation on enrollment
- Fee breakdown visibility for students

### Payment Processing
- Multiple payment methods supported
- Payment verification workflow
- Reference number tracking
- Proof document upload
- Payment receipt generation (PDF)

### Bank Reconciliation
- Import bank transaction data
- Automated matching algorithms
- Manual reconciliation interface
- Unmatched transaction tracking

### Reporting System
- Multi-level report generation
- Customizable filters and parameters
- PDF and Excel export
- Report history and archiving

### Student Management
- Comprehensive student profiles
- Enrollment history tracking
- Payment history and dues tracking
- Notification system
- Account blocking for non-payment

---

## 📈 Strategic Project Management

This project follows PMBOK (Project Management Body of Knowledge) guidelines with complete documentation in the [SITM/](SITM/) directory:

### Project Management Artifacts

1. **Project Charter** - Project authorization, objectives, and high-level requirements
2. **Work Breakdown Structure (WBS)** - Hierarchical decomposition of all project deliverables
3. **Scope Management Plan** - Defines how scope is managed and controlled
4. **Schedule Management Plan** - Timeline planning and milestone tracking
5. **PM Baseline** - Integrated baseline for scope, schedule, and cost management
6. **Stakeholder Register** - Identification and analysis of all project stakeholders
7. **Project Schedule** - Detailed task scheduling with dependencies and resources

These artifacts demonstrate comprehensive project planning, risk management, stakeholder engagement, and resource allocation following industry best practices.

---

## 🧪 Software Testing

The project implements a comprehensive testing strategy covering:

### Testing Levels
- **Unit Testing**: Individual component and function testing
- **Integration Testing**: API endpoint and database integration testing
- **System Testing**: End-to-end workflow testing
- **Acceptance Testing**: User story validation

### Testing Areas
- **Backend**: Model validation, business logic, API endpoints
- **Frontend**: Component rendering, user interactions, routing
- **Database**: Migration testing, data integrity, constraints
- **Security**: Authentication, authorization, input validation
- **Performance**: Load testing, response time optimization

### Testing Tools
- Postman for API testing
- Pytest for backend unit tests
- Jest/React Testing Library for frontend tests
- Cypress/Playwright for E2E testing

See [Testing/README.md](Testing/README.md) for detailed testing documentation.

---

## 🎓 Academic Context

This project demonstrates comprehensive proficiency across three academic disciplines:

### Web Programming
- **Full-Stack Development**: React frontend with Flask backend
- **RESTful API Design**: Well-structured endpoints following REST principles
- **Database Design**: Normalized schema with proper relationships
- **Authentication & Authorization**: Secure JWT-based system
- **Responsive UI/UX**: Professional interface with Ant Design
- **Cloud Deployment**: Production deployment on Railway.app
- **Containerization**: Docker and Docker Compose configuration

### Strategic IT Management
- **Project Planning**: Complete PMBOK-based project documentation
- **Scope Management**: Clear definition and control of project scope
- **Schedule Management**: Detailed timeline with milestones and dependencies
- **Stakeholder Management**: Identification and engagement strategies
- **Risk Management**: Risk identification and mitigation planning
- **Resource Planning**: Team structure and resource allocation
- **Quality Management**: Quality standards and control processes

### Software Testing
- **Test Planning**: Comprehensive test strategy and approach
- **Test Design**: Test cases covering all functional requirements
- **Test Execution**: Automated and manual testing procedures
- **Defect Management**: Bug tracking and resolution workflow
- **Quality Assurance**: Code reviews and quality gates
- **Test Documentation**: Detailed test plans and reports

---

## 🤝 Project Team

**Egyptian University for Informatics (EUI)**
- Faculty of Computer and Information Sciences
- Fall 2025 Semester

---

## 📝 License

This project is developed as part of academic coursework at Egyptian University for Informatics (EUI).

---

**Built with ❤️ at Egyptian University for Informatics**
