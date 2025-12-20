"""
Test script to verify password hashing for student1
"""
from app import create_app
from models import db, User

app = create_app()

with app.app_context():
    # Get student1
    user = User.query.filter_by(username='student1').first()
    
    if user:
        print(f"User found: {user.username}")
        print(f"Password hash: {user.password_hash[:50]}...")
        
        # Test password verification
        test_password = "pass123"
        is_valid = user.verify_password(test_password)
        
        print(f"\nTesting password: '{test_password}'")
        print(f"Password valid: {is_valid}")
        
        # Try generating a new hash for comparison
        new_hash = User.generate_hash(test_password)
        print(f"\nNew hash for same password: {new_hash[:50]}...")
        
        # Verify the new hash
        is_new_valid = User.verify_hash(test_password, new_hash)
        print(f"New hash valid: {is_new_valid}")
    else:
        print("User student1 not found!")
