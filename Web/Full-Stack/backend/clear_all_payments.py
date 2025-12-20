"""
Clear all payment history and reset all students' dues balances
"""
from models import db, Payment, User
from app import create_app

app = create_app()
with app.app_context():
    # Delete all payments
    payments = Payment.query.all()
    print(f'Found {len(payments)} payments to delete')
    
    for payment in payments:
        db.session.delete(payment)
    
    db.session.commit()
    print('✓ All payments deleted')
    
    # Reset ALL students' dues balances to match their enrolled courses
    students = User.query.filter_by(is_admin=False).all()
    print(f'\nResetting dues balance for {len(students)} students:')
    
    for student in students:
        total_fees = sum([e.course_fee for e in student.enrollments])
        old_balance = student.dues_balance
        student.dues_balance = total_fees
        print(f'  {student.username}: ${old_balance:.2f} → ${student.dues_balance:.2f}')
    
    db.session.commit()
    print('\n✓ All student dues balances reset successfully')
