"""
Test the /api/students/status endpoint to verify credits field is returned
"""
import requests
import json

# First, login to get a token
login_url = "http://localhost:5000/api/auth/login"
login_data = {
    "username": "student1",
    "password": "pass123"
}

print("Logging in as student1...")
response = requests.post(login_url, json=login_data)

if response.status_code == 200:
    data = response.json()
    token = data.get('access_token')
    print(f"✓ Login successful! Token: {token[:20]}...")
    
    # Now test the status endpoint
    status_url = "http://localhost:5000/api/students/status"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print("\nFetching student status...")
    status_response = requests.get(status_url, headers=headers)
    
    if status_response.status_code == 200:
        status_data = status_response.json()
        print(f"✓ Status retrieved successfully!")
        print(f"\nStudent: {status_data.get('username')}")
        print(f"Dues Balance: ${status_data.get('dues_balance'):.2f}")
        print(f"\nEnrollments ({len(status_data.get('enrollments', []))}):")
        
        for enrollment in status_data.get('enrollments', []):
            print(f"\n  Course: {enrollment.get('course_name')}")
            print(f"  Credits: {enrollment.get('credits', 'MISSING!')}")
            print(f"  Fee: ${enrollment.get('course_fee'):.2f}")
            print(f"  Status: {enrollment.get('status')}")
    else:
        print(f"✗ Failed to get status: {status_response.status_code}")
        print(status_response.text)
else:
    print(f"✗ Login failed: {response.status_code}")
    print(response.text)
