from flask import Blueprint, request, jsonify, current_app
from models import db, User, Course, Enrollment, Payment, Notification
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import os
from werkzeug.utils import secure_filename

students_bp = Blueprint("students", __name__)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ... (enroll_course and drop_course endpoints remain unchanged) ...

# ============================================================================
# ENDPOINT: POST /api/students/pay
# Description: Record student payment and update dues_balance
# ============================================================================
@students_bp.route("/pay", methods=["POST"])
@jwt_required()
def make_payment():
    """
    Record a student payment. Updates Payment model.
    For ONLINE/MANUAL payments, updates dues_balance immediately.
    For BANK_TRANSFER, sets status to PENDING and does not update balance yet.
    """
    try:
        identity = get_jwt_identity()
        if not identity:
            return jsonify({"error": "Invalid or missing user identity"}), 401
            
        # The identity is the user ID as a string
        student_id = int(identity)  # Convert string ID to integer
        
        # Handle both JSON and FormData
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form
        
        if not data:
            return jsonify({"error": "No payment data provided"}), 400
            
        try:
            amount = float(data.get("amount", 0))
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid amount format"}), 400

        payment_method = data.get("payment_method", "MANUAL")
        reference_number = data.get("reference_number")
        notes = data.get("notes", "")
        
        # Validate amount
        if amount <= 0:
            return jsonify({"error": "Amount must be a number greater than 0"}), 400
        
        # Verify student exists
        student = User.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        # Check if payment exceeds dues (only for immediate payments)
        # For pending payments, we allow it, but finance might reject it later
        if payment_method != 'BANK_TRANSFER' and amount > student.dues_balance:
            error_msg = f"Payment amount (${amount:.2f}) exceeds outstanding dues (${student.dues_balance:.2f})"
            return jsonify({"error": error_msg}), 400
        
        # Handle File Upload
        proof_document = None
        if 'proof_document' in request.files:
            file = request.files['proof_document']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Create unique filename: timestamp_studentID_filename
                timestamp =  datetime.now().strftime("%Y%m%d%H%M%S")
                filename = f"{timestamp}_{student_id}_{filename}"
                
                upload_folder = os.path.join(current_app.root_path, 'uploads', 'payments')
                if not os.path.exists(upload_folder):
                    os.makedirs(upload_folder)
                    
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                
                # Store relative path in DB
                proof_document = os.path.join('uploads', 'payments', filename)
            elif file:
                return jsonify({"error": "Invalid file type. Allowed: pdf, png, jpg, jpeg"}), 400

        # Determine Status
        status = 'RECEIVED'
        if payment_method == 'BANK_TRANSFER':
            status = 'PENDING'

        # Start transaction
        try:
            # Create payment record
            payment = Payment(
                student_id=student_id,
                amount=amount,
                payment_method=payment_method,
                reference_number=reference_number,
                status=status,
                notes=notes,
                proof_document=proof_document
            )
            db.session.add(payment)
            
            # Update student's dues_balance ONLY if status is RECEIVED
            if status == 'RECEIVED':
                student.dues_balance -= amount
                student.updated_at = datetime.utcnow()
                
                notification_msg = f"Payment of ${amount:.2f} received. Remaining dues: ${student.dues_balance:.2f}"
            else:
                notification_msg = f"Payment of ${amount:.2f} via {payment_method} submitted for verification."
            
            # Create notification for student
            notification = Notification(
                student_id=student_id,
                notification_type='PAYMENT_RECEIVED' if status == 'RECEIVED' else 'PAYMENT_SUBMITTED',
                message=notification_msg
            )
            db.session.add(notification)
            
            db.session.commit()
            
            response_data = {
                "msg": "Payment recorded successfully" if status == 'RECEIVED' else "Payment submitted for verification",
                "payment_id": payment.id,
                "amount": amount,
                "status": status,
                "remaining_dues": student.dues_balance,
                "payment_date": payment.payment_date.isoformat()
            }
            
            if proof_document:
                response_data["proof_document"] = proof_document
                
            return jsonify(response_data), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Failed to process payment: {str(e)}"}), 500
    
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# ============================================================================
# ENDPOINT: GET /api/students/status
# Description: Retrieve enrollment and current dues_balance
# ============================================================================
@students_bp.route("/status", methods=["GET"])
@jwt_required()
def get_student_status():
    """
    Retrieve student's enrollment status and current dues_balance.
    
    Returns:
    {
        "user_id": 1,
        "username": "student_username",
        "email": "student@example.com",
        "dues_balance": 4000.0,
        "enrollments": [
            {
                "id": 1,
                "course_id": 1,
                "course_name": "Computer Science",
                "course_fee": 5000.0,
                "enrollment_date": "2025-12-05T10:00:00",
                "status": "ACTIVE"
            }
        ],
        "total_enrolled_courses": 1,
        "total_course_fees": 5000.0
    }
    """
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Invalid or missing user identity"}), 401
        
    try:
        # Convert identity (user ID as string) to integer
        student_id = int(identity)
        
        # Fetch student
        student = User.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        # Fetch enrollments
        enrollments = Enrollment.query.filter_by(student_id=student_id).all()
        enrollment_list = [
            {
                "id": e.id,
                "course_id": e.course_id,
                "course_name": e.course.name,
                "credits": e.course.credits,
                "course_fee": e.course_fee,
                "enrollment_date": e.enrollment_date.isoformat(),
                "status": e.status
            }
            for e in enrollments if hasattr(e, 'course') and e.course is not None
        ]
        
        # Calculate totals
        total_course_fees = sum(e.course_fee for e in enrollments if hasattr(e, 'course_fee'))
        
        return jsonify({
            "user_id": student.id,
            "username": student.username,
            "email": student.email,
            "dues_balance": student.dues_balance,
            "enrollments": enrollment_list,
            "total_enrolled_courses": len(enrollments),
            "total_course_fees": total_course_fees
        }), 200
    
    except ValueError:
        return jsonify({"error": "Invalid user identity format"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve status: {str(e)}"}), 500


# ============================================================================
# ENDPOINT: GET /api/students/payments
# Description: Retrieve payment history for the student
# ============================================================================
@students_bp.route("/payments", methods=["GET"])
@jwt_required()
def get_payment_history():
    """
    Retrieve payment history for the authenticated student.
    
    Returns:
    {
        "user_id": 1,
        "username": "student_username",
        "total_paid": 1000.0,
        "payments": [
            {
                "id": 1,
                "amount": 1000.0,
                "payment_date": "2025-12-05T15:30:00",
                "payment_method": "ONLINE",
                "status": "RECEIVED",
                "reference_number": "TXN123456"
            }
        ]
    }
    """
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Invalid or missing user identity"}), 401
        
    try:
        # Convert identity (user ID as string) to integer
        student_id = int(identity)
        
        # Fetch student
        student = User.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        # Fetch payments
        payments = Payment.query.filter_by(student_id=student_id).order_by(
            Payment.payment_date.desc()
        ).all()
        
        payment_list = [
            {
                "id": p.id,
                "amount": p.amount,
                "payment_date": p.payment_date.isoformat() if p.payment_date else None,
                "payment_method": p.payment_method,
                "status": p.status,
                "reference_number": p.reference_number
            }
            for p in payments
        ]
        
        total_paid = sum(p.amount for p in payments if hasattr(p, 'amount') and p.amount is not None)
        
        return jsonify({
            "user_id": student.id,
            "username": student.username,
            "total_paid": total_paid,
            "payments": payment_list
        }), 200
    
    except ValueError:
        return jsonify({"error": "Invalid user identity format"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve payments: {str(e)}"}), 500
