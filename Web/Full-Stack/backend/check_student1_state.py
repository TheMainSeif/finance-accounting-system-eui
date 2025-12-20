"""
Check current state of student1 in database
"""
from app import create_app
from models import db, User, Enrollment

app = create_app()

with app.app_context():
    student = User.query.filter_by(username='student1').first()
    enrollments = Enrollment.query.filter_by(student_id=student.id).all()
    
    print(f"DATABASE STATE FOR STUDENT1:")
    print(f"Username: {student.username}")
    print(f"Student ID: {student.id}")
    print(f"Total Enrollments: {len(enrollments)}")
    print(f"Dues Balance: ${student.dues_balance}")
    print()
    
    if len(enrollments) == 0:
        print("NO ENROLLMENTS - Student1 has no courses")
    else:
        print("ENROLLED COURSES:")
        for i, e in enumerate(enrollments, 1):
            if e.course:
                print(f"{i}. {e.course.course_id} - {e.course.name}")
                print(f"   Credits: {e.course.credits}, Fee: ${e.course_fee}")
