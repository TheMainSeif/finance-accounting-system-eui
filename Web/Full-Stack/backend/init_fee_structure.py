"""
Simple script to create fee_structure table
Run this with: python init_fee_structure.py
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, FeeStructure

def init_fee_structure():
    """Initialize fee_structure table with sample data."""
    app = create_app()
    
    with app.app_context():
        try:
            print("Creating fee_structure table...")
            
            # Create all tables (will only create missing ones)
            db.create_all()
            
            print("✅ Table created!")
            
            # Check if data already exists
            existing = FeeStructure.query.first()
            if existing:
                print("ℹ️  Sample data already exists.")
                return
            
            # Add sample data
            print("Adding sample fee data...")
            
            fees = [
                FeeStructure(category='tuition', name='Registration Fee', amount=500.00, is_per_credit=False),
                FeeStructure(category='tuition', name='Library Fee', amount=200.00, is_per_credit=False),
                FeeStructure(category='tuition', name='Technology Fee', amount=300.00, is_per_credit=False),
                FeeStructure(category='bus', name='Bus Service (Semester)', amount=800.00, is_per_credit=False),
            ]
            
            for fee in fees:
                db.session.add(fee)
            
            db.session.commit()
            print(f"✅ Added {len(fees)} fee items!")
            
            # Display summary
            print("\n" + "="*50)
            print("FEE STRUCTURE INITIALIZED")
            print("="*50)
            all_fees = FeeStructure.query.all()
            for fee in all_fees:
                print(f"  {fee.category.upper()}: {fee.name} - ${fee.amount:.2f}")
            print("="*50)
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    init_fee_structure()
