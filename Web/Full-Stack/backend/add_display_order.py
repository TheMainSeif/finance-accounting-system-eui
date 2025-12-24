"""
Add display_order column to fee_structure table
Run with: python add_display_order.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db

def add_display_order_column():
    """Add display_order column to fee_structure table."""
    app = create_app()
    
    with app.app_context():
        try:
            print("Adding display_order column to fee_structure table...")
            
            # Use text() for raw SQL
            from sqlalchemy import text
            
            # Try to add the column (will fail if it already exists)
            try:
                db.session.execute(text('ALTER TABLE fee_structure ADD COLUMN display_order INTEGER DEFAULT 0'))
                db.session.commit()
                print("✅ Column added successfully!")
            except Exception as e:
                if 'Duplicate column name' in str(e) or 'already exists' in str(e):
                    print("ℹ️  Column already exists, skipping...")
                else:
                    raise
            
            # Update existing rows to have display_order
            db.session.execute(text('''
                UPDATE fee_structure 
                SET display_order = id 
                WHERE display_order = 0 OR display_order IS NULL
            '''))
            db.session.commit()
            print("✅ Updated existing rows!")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    add_display_order_column()
