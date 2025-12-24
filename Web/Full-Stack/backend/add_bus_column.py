from app import create_app
from models import db
from sqlalchemy import text

app = create_app()

def add_bus_column():
    with app.app_context():
        try:
            # Check if column exists
            with db.engine.connect() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN has_bus_service BOOLEAN DEFAULT FALSE"))
                conn.commit()
                print("Column 'has_bus_service' added successfully.")
        except Exception as e:
            print(f"Error adding column: {e}")
            if "Duplicate column name" in str(e):
                print("Column already exists.")

if __name__ == "__main__":
    add_bus_column()
