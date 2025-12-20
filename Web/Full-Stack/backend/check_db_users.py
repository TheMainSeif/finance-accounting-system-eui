from app import create_app
from models import db, User

app = create_app()

with app.app_context():
    users = User.query.all()
    if not users:
        print("No users found in database!")
    else:
        for u in users:
            print(f"User: {u.username}, Role: {'Admin' if u.is_admin else 'Student'}")
