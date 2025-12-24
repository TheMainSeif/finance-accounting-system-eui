"""
Emergency fix script to add has_bus_service column to Railway database.
Run this once in Railway to fix the missing column issue.

Usage in Railway:
1. Add this file to your backend
2. Run: python fix_railway_db.py
"""

from app import create_app
from models import db
from sqlalchemy import text

app = create_app()

def fix_database():
    with app.app_context():
        try:
            print("Checking if has_bus_service column exists...")
            
            # Try to add the column
            with db.engine.connect() as conn:
                # Check if column exists first
                result = conn.execute(text("""
                    SELECT COUNT(*) as count
                    FROM information_schema.COLUMNS 
                    WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_NAME = 'users' 
                    AND COLUMN_NAME = 'has_bus_service'
                """))
                
                count = result.scalar()
                
                if count == 0:
                    print("Column does not exist. Adding has_bus_service column...")
                    conn.execute(text("ALTER TABLE users ADD COLUMN has_bus_service BOOLEAN DEFAULT FALSE"))
                    conn.commit()
                    print("✅ Column 'has_bus_service' added successfully!")
                else:
                    print("✅ Column 'has_bus_service' already exists!")
                    
        except Exception as e:
            print(f"❌ Error: {e}")
            if "Duplicate column name" in str(e):
                print("✅ Column already exists (duplicate column error is OK)")
            else:
                raise

if __name__ == "__main__":
    fix_database()
