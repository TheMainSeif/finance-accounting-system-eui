"""
Check student1's enrollments to verify data integrity
"""
from app import create_app
from models import db, User, Enrollment

app = create_app()

with app.app_context():
    # Get student1's enrollments
    student = User.query.filter_by(username='student1').first()
    if not student:
        print("Student1 not found!")
        exit(1)
    
    enrollments = Enrollment.query.filter_by(student_id=student.id).all()
    
    print(f'Student: {student.username}')
    print(f'Total Enrollments: {len(enrollments)}')
    print(f'Dues Balance: ${student.dues_balance:.2f}')
    print('\nEnrollment Details:')
    
    for e in enrollments:
        if e.course:
            print(f'  - {e.course.name}')
            print(f'    Credits: {e.course.credits}')
            print(f'    Fee: ${e.course_fee:.2f}')
            print(f'    Status: {e.status}')
        else:
            print(f'  - [ORPHANED] Enrollment ID {e.id} - Course ID {e.course_id}')
