"""
Script to display all test student credentials
"""
from app import create_app
from models import db, User

app = create_app()

with app.app_context():
    # Get all students
    students = User.query.filter_by(is_admin=False).order_by(User.username).all()
    
    print("\n" + "=" * 60)
    print("STUDENT TEST CREDENTIALS")
    print("=" * 60)
    
    for i, student in enumerate(students, 1):
        faculty_name = student.faculty.code if student.faculty else 'None'
        print(f"{i}. {student.username} / pass123 | Faculty: {faculty_name} | Dues: ${student.dues_balance:.2f}")
    
    # Get admin
    admin = User.query.filter_by(is_admin=True).first()
    if admin:
        print("\n" + "=" * 60)
        print("ADMIN CREDENTIALS")
        print("=" * 60)
        print(f"{admin.username} / admin123")
        print("=" * 60)
