"""
Database Migration: Create fee_structure table

This migration creates the fee_structure table to manage additional fees
beyond course tuition (registration fees, bus fees, etc.)

Run this script with: python create_fee_structure_table.py
"""

from app import app, db
from models import FeeStructure

def create_fee_structure_table():
    """Create the fee_structure table and add sample data."""
    with app.app_context():
        try:
            # Create the table
            print("Creating fee_structure table...")
            db.create_all()
            print("✅ Table created successfully!")
            
            # Check if sample data already exists
            existing_fees = FeeStructure.query.first()
            if existing_fees:
                print("ℹ️  Sample data already exists. Skipping...")
                return
            
            # Add sample fee structure data
            print("\nAdding sample fee structure data...")
            
            sample_fees = [
                # Registration/Fixed Fees
                FeeStructure(
                    category='tuition',
                    name='Registration Fee',
                    amount=500.00,
                    is_per_credit=False,
                    is_active=True
                ),
                FeeStructure(
                    category='tuition',
                    name='Library Fee',
                    amount=200.00,
                    is_per_credit=False,
                    is_active=True
                ),
                FeeStructure(
                    category='tuition',
                    name='Technology Fee',
                    amount=300.00,
                    is_per_credit=False,
                    is_active=True
                ),
                
                # Bus Fees
                FeeStructure(
                    category='bus',
                    name='Bus Service (Semester)',
                    amount=800.00,
                    is_per_credit=False,
                    is_active=True
                ),
            ]
            
            for fee in sample_fees:
                db.session.add(fee)
            
            db.session.commit()
            print(f"✅ Added {len(sample_fees)} sample fee items!")
            
            # Display summary
            print("\n" + "="*60)
            print("FEE STRUCTURE SUMMARY")
            print("="*60)
            
            all_fees = FeeStructure.query.filter_by(is_active=True).all()
            categories = {}
            for fee in all_fees:
                if fee.category not in categories:
                    categories[fee.category] = []
                categories[fee.category].append(fee)
            
            for category, fees in categories.items():
                print(f"\n{category.upper()} FEES:")
                for fee in fees:
                    print(f"  - {fee.name}: ${fee.amount:.2f}")
            
            print("\n" + "="*60)
            print("Migration completed successfully!")
            print("="*60)
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    create_fee_structure_table()
