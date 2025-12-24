"""
Add Payment Verification Fields Migration
==========================================
Adds verified_by and verified_at fields to payments table
to support bank transfer verification workflow.
"""

from app import create_app
from models import db

def migrate():
    """Add verification fields to payments table."""
    app = create_app()
    
    with app.app_context():
        try:
            print("\n" + "=" * 70)
            print("ADDING PAYMENT VERIFICATION FIELDS")
            print("=" * 70)
            
            # Check if columns already exist
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('payments')]
            
            if 'verified_by' in columns and 'verified_at' in columns:
                print("\n✅ Verification fields already exist. No migration needed.")
                return
            
            # Add columns using raw SQL
            with db.engine.connect() as conn:
                if 'verified_by' not in columns:
                    print("\n➕ Adding verified_by column...")
                    conn.execute(db.text(
                        "ALTER TABLE payments ADD COLUMN verified_by INTEGER"
                    ))
                    conn.execute(db.text(
                        "ALTER TABLE payments ADD FOREIGN KEY (verified_by) REFERENCES users(id)"
                    ))
                    conn.commit()
                    print("✅ verified_by column added")
                
                if 'verified_at' not in columns:
                    print("\n➕ Adding verified_at column...")
                    conn.execute(db.text(
                        "ALTER TABLE payments ADD COLUMN verified_at DATETIME"
                    ))
                    conn.commit()
                    print("✅ verified_at column added")
            
            print("\n" + "=" * 70)
            print("MIGRATION COMPLETE")
            print("=" * 70)
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
    
    return True


if __name__ == "__main__":
    migrate()
