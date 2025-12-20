"""
Check student1's faculty and what courses they should have
"""
from app import create_app
from models import db, User, Enrollment, Course

app = create_app()

with app.app_context():
    student = User.query.filter_by(username='student1').first()
    
    print("=" * 70)
    print(f"STUDENT1 DETAILS:")
    print("=" * 70)
    print(f"Username: {student.username}")
    print(f"Faculty: {student.faculty.name if student.faculty else 'None'}")
    print(f"Faculty Code: {student.faculty.code if student.faculty else 'None'}")
    print()
    
    # Get current enrollments
    enrollments = Enrollment.query.filter_by(student_id=student.id).all()
    print(f"CURRENT ENROLLMENTS ({len(enrollments)}):")
    for e in enrollments:
        if e.course:
            print(f"  - {e.course.course_id}: {e.course.name}")
            print(f"    Faculty: {e.course.faculty.code}")
    
    print()
    print("=" * 70)
    print(f"COURSES AVAILABLE IN STUDENT1'S FACULTY ({student.faculty.code if student.faculty else 'None'}):")
    print("=" * 70)
    
    if student.faculty:
        faculty_courses = Course.query.filter_by(faculty_id=student.faculty.id).all()
        for course in faculty_courses:
            print(f"  - {course.course_id}: {course.name} ({course.credits} credits, ${course.total_fee})")
