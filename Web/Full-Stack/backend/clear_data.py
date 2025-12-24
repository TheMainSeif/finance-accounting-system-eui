"""
Clear Enrollments and Payments Script
======================================
This script clears all enrollments and payments from the database while preserving:
- Users (students and admin)
- Courses
- Faculties
- Fee structures

This allows testing the complete flow from course registration to payment.
"""

from app import create_app
from models import db, Enrollment, Payment, Notification, ActionLog, BankTransaction, GeneratedReport, Penalty, User
from datetime import datetime, timezone

def clear_transaction_data():
    """Clear all transaction-related data (enrollments, payments, etc.)"""
    app = create_app()
    
    with app.app_context():
        try:
            print("=" * 70)
            print("CLEARING TRANSACTION DATA")
            print("=" * 70)
            
            # Count records before deletion
            enrollment_count = Enrollment.query.count()
            payment_count = Payment.query.count()
            notification_count = Notification.query.count()
            action_log_count = ActionLog.query.count()
            bank_transaction_count = BankTransaction.query.count()
            generated_report_count = GeneratedReport.query.count()
            penalty_count = Penalty.query.count()
            
            print(f"\n📊 Current Database State:")
            print(f"   - Enrollments: {enrollment_count}")
            print(f"   - Payments: {payment_count}")
            print(f"   - Notifications: {notification_count}")
            print(f"   - Action Logs: {action_log_count}")
            print(f"   - Bank Transactions: {bank_transaction_count}")
            print(f"   - Generated Reports: {generated_report_count}")
            print(f"   - Penalties: {penalty_count}")
            
            # Reset all student dues balances to 0
            students = User.query.filter_by(is_admin=False).all()
            student_count = len(students)
            
            print(f"\n🔄 Resetting {student_count} student accounts...")
            for student in students:
                student.dues_balance = 0.0
                student.is_blocked = False
                student.blocked_at = None
                student.blocked_reason = None
                student.payment_due_date = None
            
            # Delete all transaction data
            print("\n🗑️  Deleting transaction data...")
            
            # Delete in correct order (respecting foreign key constraints)
            Penalty.query.delete()
            print(f"   ✓ Deleted {penalty_count} penalties")
            
            GeneratedReport.query.delete()
            print(f"   ✓ Deleted {generated_report_count} generated reports")
            
            BankTransaction.query.delete()
            print(f"   ✓ Deleted {bank_transaction_count} bank transactions")
            
            ActionLog.query.delete()
            print(f"   ✓ Deleted {action_log_count} action logs")
            
            Notification.query.delete()
            print(f"   ✓ Deleted {notification_count} notifications")
            
            Payment.query.delete()
            print(f"   ✓ Deleted {payment_count} payments")
            
            Enrollment.query.delete()
            print(f"   ✓ Deleted {enrollment_count} enrollments")
            
            # Commit all changes
            db.session.commit()
            
            print("\n✅ SUCCESS! All transaction data has been cleared.")
            print("\n📋 Database is now ready for fresh testing:")
            print("   - All students have $0 dues balance")
            print("   - No enrollments exist")
            print("   - No payments recorded")
            print("   - Students can register for courses from scratch")
            print("   - Finance can track new payments")
            
            print("\n" + "=" * 70)
            print("NEXT STEPS:")
            print("=" * 70)
            print("1. Login as a student")
            print("2. Register for courses (this will calculate fees)")
            print("3. Check Student Dashboard to see dues balance")
            print("4. Login as Finance admin")
            print("5. View unpaid students in Finance Dashboard")
            print("6. Record payments for students")
            print("7. Verify integration between both portals")
            print("=" * 70)
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
    
    return True


if __name__ == "__main__":
    print("\n⚠️  WARNING: This will delete all enrollments, payments, and related data!")
    print("Users, courses, and faculties will be preserved.\n")
    
    response = input("Are you sure you want to continue? (yes/no): ")
    
    if response.lower() in ['yes', 'y']:
        clear_transaction_data()
    else:
        print("\n❌ Operation cancelled.")
