"""
Detailed check of student1's enrollments and what courses should appear
"""
from app import create_app
from models import db, User, Enrollment, Course

app = create_app()

with app.app_context():
    # Get student1
    student = User.query.filter_by(username='student1').first()
    if not student:
        print("Student1 not found!")
        exit(1)
    
    print("=" * 70)
    print(f"STUDENT: {student.username} (ID: {student.id})")
    print(f"Faculty: {student.faculty.name if student.faculty else 'None'}")
    print(f"Dues Balance: ${student.dues_balance:.2f}")
    print("=" * 70)
    
    # Get all enrollments for student1
    enrollments = Enrollment.query.filter_by(student_id=student.id).all()
    
    print(f"\nTotal Enrollments in Database: {len(enrollments)}")
    print("\nENROLLED COURSES:")
    print("-" * 70)
    
    for i, e in enumerate(enrollments, 1):
        if e.course:
            print(f"\n{i}. Enrollment ID: {e.id}")
            print(f"   Course ID: {e.course_id}")
            print(f"   Course Code: {e.course.course_id}")
            print(f"   Course Name: {e.course.name}")
            print(f"   Credits: {e.course.credits}")
            print(f"   Fee: ${e.course_fee:.2f}")
            print(f"   Faculty: {e.course.faculty.code if e.course.faculty else 'None'}")
            print(f"   Status: {e.status}")
            print(f"   Enrolled Date: {e.enrollment_date}")
        else:
            print(f"\n{i}. [ORPHANED] Enrollment ID: {e.id}")
            print(f"   Course ID: {e.course_id} (Course not found in database)")
    
    # Also check what the API would return
    print("\n" + "=" * 70)
    print("API RESPONSE SIMULATION:")
    print("=" * 70)
    
    enrollment_list = [
        {
            "id": e.id,
            "course_id": e.course_id,
            "course_name": e.course.name,
            "credits": e.course.credits,
            "course_fee": e.course_fee,
            "enrollment_date": e.enrollment_date.isoformat(),
            "status": e.status
        }
        for e in enrollments if hasattr(e, 'course') and e.course is not None
    ]
    
    print(f"\nCourses that will be returned by API: {len(enrollment_list)}")
    for item in enrollment_list:
        print(f"  - {item['course_name']} ({item['credits']} credits, ${item['course_fee']})")
