"""
Show all enrollments for student1 with full details
"""
from app import create_app
from models import db, User, Enrollment

app = create_app()

with app.app_context():
    student = User.query.filter_by(username='student1').first()
    enrollments = Enrollment.query.filter_by(student_id=student.id).all()
    
    print(f"Student1 has {len(enrollments)} enrollments:")
    print()
    
    for e in enrollments:
        if e.course:
            print(f"Course: {e.course.name}")
            print(f"  Code: {e.course.course_id}")
            print(f"  Credits: {e.course.credits}")
            print(f"  Fee: ${e.course_fee}")
            print(f"  Faculty: {e.course.faculty.code}")
            print()
