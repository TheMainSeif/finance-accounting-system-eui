"""
Database seeding script to populate the database with sample data for testing.
Run this script after initializing the database.

Usage:
    python seed.py
"""

from app import create_app, db
from models import User, Course, Enrollment, Payment, Notification, ActionLog, Faculty, FeeStructure, Penalty
from datetime import datetime, timedelta
from sqlalchemy import text
import random

def generate_student_id(entry_year, sequence_number):
    """
    Generate student ID in format YY-XXXXXX
    Args:
        entry_year: 22-25 (representing 2022-2025)
        sequence_number: Sequential number for the student
    Returns:
        String in format like "22-101153"
    """
    return f"{entry_year}-{sequence_number:06d}"

def seed_database():
    """Populate the database with sample data."""
    
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        
        # Simply drop and recreate all tables
        db.drop_all()
        print("All tables dropped successfully.")
        
        # Create all tables
        print("Creating all tables...")
        db.create_all()
        
        # Create Faculties
        print("Creating faculties...")
        faculties = [
            Faculty(
                name="Computer and Information Sciences",
                code="CIS",
                description="Faculty of Computer and Information Sciences, offering programs in Computer Science, Software Engineering, and Data Science."
            ),
            Faculty(
                name="Digital Arts and Design",
                code="DAD",
                description="Faculty of Digital Arts and Design, focusing on creative digital media, animation, and design."
            ),
            Faculty(
                name="Business Informatics",
                code="BI",
                description="Faculty of Business Informatics, combining business administration with information technology."
            ),
            Faculty(
                name="Engineering",
                code="ENG",
                description="Faculty of Engineering, offering various engineering disciplines and specializations."
            )
        ]
        db.session.add_all(faculties)
        db.session.commit()
        
        # Get faculty IDs for reference
        cis_faculty = Faculty.query.filter_by(code="CIS").first()
        dad_faculty = Faculty.query.filter_by(code="DAD").first()
        bi_faculty = Faculty.query.filter_by(code="BI").first()
        eng_faculty = Faculty.query.filter_by(code="ENG").first()
        
        if not all([cis_faculty, dad_faculty, bi_faculty, eng_faculty]):
            raise ValueError("Failed to create all required faculties")
        
        print("Seeding database with sample data...\\n")
        
        # ====================================================================
        # Create Sample Users
        # ====================================================================
        print("Creating users...")
        # Create Admin User
        print("Creating admin user...")
        admin = User(
            username="admin",
            email="admin@example.com",
            password_hash=User.generate_hash("admin123"),
            is_admin=True,
            faculty=None  # Admin doesn't need to be in a faculty
        )
        db.session.add(admin)
        
        # Create Sample Students with realistic IDs
        print("Creating sample students...")
        students = []
        faculties_list = [cis_faculty, dad_faculty, bi_faculty, eng_faculty]
        entry_years = [22, 23, 24, 25]  # 2022-2025
        
        # Create 20 students distributed across faculties and entry years
        student_counter = 101150  # Starting sequence number
        
        for i in range(20):
            # Distribute students across faculties
            faculty = faculties_list[i % len(faculties_list)]
            # Distribute across entry years
            entry_year = entry_years[i % len(entry_years)]
            
            student_id = generate_student_id(entry_year, student_counter + i)
            
            student = User(
                username=student_id,  # Use student ID as username
                email=f"student{student_id.replace('-', '')}@university.edu",
                password_hash=User.generate_hash("pass123"),
                is_admin=False,
                faculty=faculty,
                dues_balance=0.0  # Will be calculated later
            )
            students.append(student)
        
        db.session.add_all(students)
        db.session.commit()
        print(f"✓ Created 1 admin and {len(students)} student users")
        # ====================================================================
        
        # ====================================================================
        # Create Fee Structures (Finance Reconciliation)
        # ====================================================================
        print("Creating fee structures...")
        fee_structures = [
            FeeStructure(category="tuition", name="Credit Hour Fee (Standard)", amount=500.0, is_per_credit=True),
            FeeStructure(category="tuition", name="Credit Hour Fee (Lab)", amount=600.0, is_per_credit=True),
            FeeStructure(category="admin", name="Registration Fee", amount=200.0, is_per_credit=False),
            FeeStructure(category="admin", name="Technology Fee", amount=150.0, is_per_credit=False),
            FeeStructure(category="other", name="Library Access", amount=50.0, is_per_credit=False),
            FeeStructure(category="other", name="Student Activities", amount=100.0, is_per_credit=False),
        ]
        db.session.add_all(fee_structures)
        db.session.commit()
        print(f"✓ Created {len(fee_structures)} fee structures")

        # ====================================================================
        # Create Sample Courses (Expanded)
        # ====================================================================
        print("Creating sample courses...")
        courses = []
        
        # CIS Courses (Computer and Information Sciences)
        cis_courses = [
            # First Year
            Course(course_id="CS101", name="Introduction to Computer Science", credits=3, total_fee=1500.00, faculty=cis_faculty, description="Fundamentals of computer science and programming"),
            Course(course_id="CS102", name="Programming Fundamentals", credits=3, total_fee=1500.00, faculty=cis_faculty, description="Basic programming concepts using Python"),
            Course(course_id="CS103", name="Discrete Mathematics", credits=3, total_fee=1500.00, faculty=cis_faculty, description="Mathematical foundations for computer science"),
            Course(course_id="CS104", name="Computer Organization", credits=3, total_fee=1500.00, faculty=cis_faculty, description="Hardware and low-level programming"),
            
            # Second Year
            Course(course_id="CS201", name="Data Structures and Algorithms", credits=4, total_fee=2000.00, faculty=cis_faculty, description="Advanced data structures and algorithm analysis"),
            Course(course_id="CS202", name="Object-Oriented Programming", credits=3, total_fee=1500.00, faculty=cis_faculty, description="OOP principles using Java"),
            Course(course_id="CS203", name="Web Development", credits=3, total_fee=1800.00, faculty=cis_faculty, description="Full-stack web development"),
            Course(course_id="CS204", name="Operating Systems", credits=4, total_fee=2000.00, faculty=cis_faculty, description="OS concepts and implementation"),
            
            # Third Year
            Course(course_id="CS301", name="Database Systems", credits=3, total_fee=1800.00, faculty=cis_faculty, description="Design and implementation of database systems"),
            Course(course_id="CS302", name="Software Engineering", credits=3, total_fee=1800.00, faculty=cis_faculty, description="Software development methodologies"),
            Course(course_id="CS303", name="Computer Networks", credits=3, total_fee=1800.00, faculty=cis_faculty, description="Network protocols and architecture"),
            Course(course_id="CS304", name="Artificial Intelligence", credits=4, total_fee=2400.00, faculty=cis_faculty, description="AI algorithms and applications"),
            
            # Fourth Year
            Course(course_id="CS401", name="Machine Learning", credits=4, total_fee=2400.00, faculty=cis_faculty, description="ML algorithms and deep learning"),
            Course(course_id="CS402", name="Cloud Computing", credits=3, total_fee=2000.00, faculty=cis_faculty, description="Cloud platforms and services"),
            Course(course_id="CS403", name="Cybersecurity", credits=3, total_fee=2000.00, faculty=cis_faculty, description="Security principles and practices"),
        ]
        
        # DAD Courses (Digital Arts and Design)
        dad_courses = [
            # First Year
            Course(course_id="DAD101", name="Digital Design Fundamentals", credits=3, total_fee=1800.00, faculty=dad_faculty, description="Introduction to digital design principles and tools"),
            Course(course_id="DAD102", name="Drawing and Illustration", credits=3, total_fee=1800.00, faculty=dad_faculty, description="Traditional and digital drawing techniques"),
            Course(course_id="DAD103", name="Color Theory", credits=2, total_fee=1200.00, faculty=dad_faculty, description="Understanding color in design"),
            Course(course_id="DAD104", name="Typography", credits=2, total_fee=1200.00, faculty=dad_faculty, description="Type design and usage"),
            
            # Second Year
            Course(course_id="DAD201", name="3D Modeling", credits=4, total_fee=2400.00, faculty=dad_faculty, description="Creating 3D models and assets"),
            Course(course_id="DAD202", name="Motion Graphics", credits=3, total_fee=2000.00, faculty=dad_faculty, description="Animated graphics and effects"),
            Course(course_id="DAD203", name="UI/UX Design", credits=3, total_fee=2000.00, faculty=dad_faculty, description="User interface and experience design"),
            Course(course_id="DAD204", name="Digital Photography", credits=3, total_fee=1800.00, faculty=dad_faculty, description="Photography techniques and editing"),
            
            # Third Year
            Course(course_id="ANI301", name="3D Animation", credits=4, total_fee=2400.00, faculty=dad_faculty, description="Creating 3D animations using industry-standard software"),
            Course(course_id="DAD301", name="Game Design", credits=4, total_fee=2400.00, faculty=dad_faculty, description="Video game design and development"),
            Course(course_id="DAD302", name="Visual Effects", credits=4, total_fee=2400.00, faculty=dad_faculty, description="VFX for film and media"),
            Course(course_id="DAD303", name="Branding and Identity", credits=3, total_fee=1800.00, faculty=dad_faculty, description="Corporate branding design"),
            
            # Fourth Year
            Course(course_id="DAD401", name="Advanced Animation", credits=4, total_fee=2600.00, faculty=dad_faculty, description="Character animation and rigging"),
            Course(course_id="DAD402", name="Portfolio Development", credits=3, total_fee=1800.00, faculty=dad_faculty, description="Professional portfolio creation"),
        ]
        
        # BI Courses (Business Informatics)
        bi_courses = [
            # First Year
            Course(course_id="BI101", name="Introduction to Business", credits=3, total_fee=1500.00, faculty=bi_faculty, description="Fundamentals of business administration"),
            Course(course_id="BI102", name="Business Mathematics", credits=3, total_fee=1500.00, faculty=bi_faculty, description="Mathematical methods for business"),
            Course(course_id="BI103", name="Accounting Principles", credits=3, total_fee=1500.00, faculty=bi_faculty, description="Financial and managerial accounting"),
            Course(course_id="BI104", name="Information Systems", credits=3, total_fee=1500.00, faculty=bi_faculty, description="Business information systems"),
            
            # Second Year
            Course(course_id="BI201", name="Business Analytics", credits=3, total_fee=1800.00, faculty=bi_faculty, description="Using data analysis for business decision making"),
            Course(course_id="BI202", name="Enterprise Systems", credits=3, total_fee=1800.00, faculty=bi_faculty, description="Overview of enterprise resource planning systems"),
            Course(course_id="BI203", name="Database Management", credits=3, total_fee=1800.00, faculty=bi_faculty, description="Database design for business applications"),
            Course(course_id="BI204", name="E-Commerce", credits=3, total_fee=1800.00, faculty=bi_faculty, description="Online business models and platforms"),
            
            # Third Year
            Course(course_id="BI301", name="Business Intelligence", credits=4, total_fee=2000.00, faculty=bi_faculty, description="BI tools and data warehousing"),
            Course(course_id="BI302", name="Project Management", credits=3, total_fee=1800.00, faculty=bi_faculty, description="IT project management methodologies"),
            Course(course_id="BI303", name="Supply Chain Management", credits=3, total_fee=1800.00, faculty=bi_faculty, description="Supply chain optimization"),
            Course(course_id="BI304", name="Digital Marketing", credits=3, total_fee=1800.00, faculty=bi_faculty, description="Online marketing strategies"),
            
            # Fourth Year
            Course(course_id="BI401", name="Data Science for Business", credits=4, total_fee=2400.00, faculty=bi_faculty, description="Advanced analytics and ML for business"),
            Course(course_id="BI402", name="Strategic IT Management", credits=3, total_fee=2000.00, faculty=bi_faculty, description="IT strategy and governance"),
        ]
        
        # Engineering Courses
        eng_courses = [
            # First Year
            Course(course_id="ENG101", name="Engineering Mathematics I", credits=4, total_fee=1600.00, faculty=eng_faculty, description="Mathematical methods for engineering applications"),
            Course(course_id="ENG102", name="Engineering Physics", credits=4, total_fee=1600.00, faculty=eng_faculty, description="Physics principles for engineers"),
            Course(course_id="ENG103", name="Engineering Drawing", credits=3, total_fee=1500.00, faculty=eng_faculty, description="Technical drawing and CAD"),
            Course(course_id="ENG104", name="Introduction to Engineering", credits=2, total_fee=1000.00, faculty=eng_faculty, description="Overview of engineering disciplines"),
            
            # Second Year
            Course(course_id="ENG201", name="Engineering Mathematics II", credits=4, total_fee=1600.00, faculty=eng_faculty, description="Advanced engineering mathematics"),
            Course(course_id="MECH201", name="Thermodynamics", credits=4, total_fee=2000.00, faculty=eng_faculty, description="Fundamentals of energy and thermodynamics"),
            Course(course_id="EE201", name="Circuit Analysis", credits=4, total_fee=2000.00, faculty=eng_faculty, description="Electrical circuit theory"),
            Course(course_id="ENG202", name="Materials Science", credits=3, total_fee=1800.00, faculty=eng_faculty, description="Properties of engineering materials"),
            
            # Third Year
            Course(course_id="MECH301", name="Fluid Mechanics", credits=4, total_fee=2000.00, faculty=eng_faculty, description="Fluid dynamics and applications"),
            Course(course_id="EE301", name="Control Systems", credits=4, total_fee=2000.00, faculty=eng_faculty, description="Automatic control theory"),
            Course(course_id="ENG301", name="Engineering Design", credits=3, total_fee=1800.00, faculty=eng_faculty, description="Design methodology and projects"),
            Course(course_id="MECH302", name="Machine Design", credits=4, total_fee=2000.00, faculty=eng_faculty, description="Mechanical component design"),
            
            # Fourth Year
            Course(course_id="ENG401", name="Senior Design Project", credits=6, total_fee=3000.00, faculty=eng_faculty, description="Capstone engineering project"),
            Course(course_id="MECH401", name="Robotics", credits=4, total_fee=2400.00, faculty=eng_faculty, description="Robot design and control"),
        ]
        
        # Add all courses to the list
        courses.extend(cis_courses)
        courses.extend(dad_courses)
        courses.extend(bi_courses)
        courses.extend(eng_courses)
        db.session.add_all(courses)
        
        db.session.commit()
        print(f"✓ Created {len(courses)} courses")
        print(f"  - CIS: {len(cis_courses)} courses")
        print(f"  - DAD: {len(dad_courses)} courses")
        print(f"  - BI: {len(bi_courses)} courses")
        print(f"  - ENG: {len(eng_courses)} courses")
        
        # ====================================================================
        # Create Sample Enrollments
        # ====================================================================
        print("\\nCreating enrollments...")
        
        enrollments = []
        
        for student in students:
            # Get courses for this student's faculty
            faculty_courses = [c for c in courses if c.faculty_id == student.faculty_id]
            
            if faculty_courses:
                # Enroll students in 2-5 courses based on their entry year
                # Newer students (25) get fewer courses, older students (22) get more
                entry_year = int(student.username.split('-')[0])
                if entry_year == 22:
                    num_courses = random.randint(4, 6)  # Senior students
                elif entry_year == 23:
                    num_courses = random.randint(3, 5)  # Junior students
                elif entry_year == 24:
                    num_courses = random.randint(2, 4)  # Sophomore students
                else:  # 25
                    num_courses = random.randint(2, 3)  # Freshman students
                
                # Randomly select courses for enrollment
                num_courses = min(num_courses, len(faculty_courses))
                selected_courses = random.sample(faculty_courses, num_courses)
                
                for course in selected_courses:
                    enrollments.append(
                        Enrollment(
                            student_id=student.id,
                            course_id=course.id,
                            course_fee=course.total_fee,
                            status='ACTIVE'
                        )
                    )
        
        for enrollment in enrollments:
            db.session.add(enrollment)
        
        db.session.commit()
        print(f"✓ Created {len(enrollments)} enrollments")
        
        # Update student dues_balance based on enrollments
        for student in students:
            total_dues = sum(
                e.course_fee for e in Enrollment.query.filter_by(student_id=student.id).all()
            )
            student.dues_balance = total_dues
        
        db.session.commit()
        print("✓ Updated student dues_balance")
        
        # ====================================================================
        # Create Sample Payments
        # ====================================================================
        print("\\nCreating payments...")
        
        payments = []
        payment_methods = ["ONLINE", "BANK_TRANSFER", "MANUAL"]
        
        # Create payments for random students (about 60% of students make payments)
        students_with_payments = random.sample(students, k=int(len(students) * 0.6))
        
        for idx, student in enumerate(students_with_payments):
            # Students pay between 30% to 100% of their dues
            payment_percentage = random.uniform(0.3, 1.0)
            payment_amount = round(student.dues_balance * payment_percentage, 2)
            
            if payment_amount > 0:
                payment = Payment(
                    student_id=student.id,
                    amount=payment_amount,
                    payment_method=random.choice(payment_methods),
                    reference_number=f"TXN{1000 + idx:04d}",
                    status="RECEIVED",
                    recorded_by=admin.id,
                    notes=f"Payment received for semester fees"
                )
                payments.append(payment)
        
        for payment in payments:
            db.session.add(payment)
        
        db.session.commit()
        print(f"✓ Created {len(payments)} payments")
        
        # ====================================================================
        # Create Penalties & Late Fees
        # ====================================================================
        print("\\nCreating penalties...")
        
        # Apply late fees to students who haven't paid enough (less than 50%)
        penalty_count = 0
        for student in students:
            total_paid = sum(
                p.amount for p in Payment.query.filter_by(student_id=student.id).all()
            )
            payment_ratio = total_paid / student.dues_balance if student.dues_balance > 0 else 1.0
            
            if payment_ratio < 0.5 and student.dues_balance > 1000:
                late_fee = Penalty(
                    student_id=student.id,
                    amount=150.0,
                    penalty_type="LATE_FEE",
                    notes="Late payment penalty for outstanding dues",
                    applied_by=admin.id
                )
                db.session.add(late_fee)
                penalty_count += 1
                
                # Block students with very high outstanding dues
                if student.dues_balance > 5000 and payment_ratio < 0.3:
                    student.is_blocked = True
                    student.blocked_at = datetime.now()
                    student.blocked_reason = f"Outstanding dues: ${student.dues_balance:.2f}"
        
        db.session.commit()
        print(f"✓ Created {penalty_count} penalties")

        # Update student dues_balance based on enrollments + penalties - payments
        for student in students:
            total_paid = sum(
                p.amount for p in Payment.query.filter_by(student_id=student.id).all()
            )
            total_fees = sum(
                e.course_fee for e in Enrollment.query.filter_by(student_id=student.id).all()
            )
            total_penalties = sum(
                p.amount for p in Penalty.query.filter_by(student_id=student.id).all()
            )
            
            # Single Source of Truth Calculation:
            student.dues_balance = (total_fees + total_penalties) - total_paid
        
        db.session.commit()
        print("✓ Updated student dues_balance after payments and penalties")
        
        # ====================================================================
        # Create Sample Notifications
        # ====================================================================
        print("\\nCreating notifications...")
        
        notifications = []
        
        # Create enrollment notifications for first 5 students
        for student in students[:5]:
            student_enrollments = Enrollment.query.filter_by(student_id=student.id).all()
            for enrollment in student_enrollments[:2]:  # First 2 enrollments
                course = Course.query.get(enrollment.course_id)
                notifications.append(
                    Notification(
                        student_id=student.id,
                        notification_type="ENROLLMENT",
                        message=f"You have successfully enrolled in {course.name}. Course fee: ${course.total_fee:.2f}"
                    )
                )
        
        # Create payment notifications
        for payment in payments[:5]:
            student = User.query.get(payment.student_id)
            notifications.append(
                Notification(
                    student_id=payment.student_id,
                    notification_type="PAYMENT_RECEIVED",
                    message=f"Payment of ${payment.amount:.2f} received. Remaining dues: ${student.dues_balance:.2f}"
                )
            )
        
        for notification in notifications:
            db.session.add(notification)
        
        db.session.commit()
        print(f"✓ Created {len(notifications)} notifications")
        
        # ====================================================================
        # Create Sample Action Logs
        # ====================================================================
        print("\\nCreating action logs...")
        
        action_logs = []
        
        # Log enrollments
        for enrollment in enrollments[:10]:
            course = Course.query.get(enrollment.course_id)
            action_logs.append(
                ActionLog(
                    student_id=enrollment.student_id,
                    action_type="ENROLLMENT",
                    action_description=f"Student enrolled in {course.name}",
                    performed_by=admin.id
                )
            )
        
        # Log payments
        for payment in payments[:10]:
            action_logs.append(
                ActionLog(
                    student_id=payment.student_id,
                    action_type="PAYMENT_RECORDED",
                    action_description=f"Payment of ${payment.amount:.2f} recorded via {payment.payment_method}. Reference: {payment.reference_number}",
                    performed_by=admin.id
                )
            )
        
        for action_log in action_logs:
            db.session.add(action_log)
        
        db.session.commit()
        print(f"✓ Created {len(action_logs)} action logs")
        
        # ====================================================================
        # Print Summary
        # ====================================================================
        print("\\n" + "="*60)
        print("DATABASE SEEDING COMPLETED SUCCESSFULLY")
        print("="*60)
        
        print("\\nSample Credentials:")
        print("-" * 60)
        print("Admin User:")
        print("  Username: admin")
        print("  Password: admin123")
        print("  is_admin: true")
        print()
        print("Student Users (Sample):")
        for i, student in enumerate(students[:5], 1):
            enrollments_count = len(Enrollment.query.filter_by(student_id=student.id).all())
            print(f"  {i}. Username: {student.username}")
            print(f"     Password: pass123")
            print(f"     Email: {student.email}")
            print(f"     Faculty: {student.faculty.code}")
            print(f"     Enrollments: {enrollments_count} courses")
            print(f"     Dues Balance: ${student.dues_balance:.2f}")
            print()
        
        print(f"... and {len(students) - 5} more students")
        print()
        
        print("Course Summary by Faculty:")
        print("-" * 60)
        for faculty in [cis_faculty, dad_faculty, bi_faculty, eng_faculty]:
            faculty_course_list = [c for c in courses if c.faculty_id == faculty.id]
            print(f"  {faculty.code}: {len(faculty_course_list)} courses")
        
        print("\\n" + "="*60)
        print("You can now start the Flask application and test the API")
        print("="*60)


if __name__ == "__main__":
    seed_database()
