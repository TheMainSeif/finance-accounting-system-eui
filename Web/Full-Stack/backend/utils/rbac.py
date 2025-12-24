"""
================================================================================
ROLE-BASED ACCESS CONTROL (RBAC) UTILITIES
================================================================================
Provides decorators and utilities for enforcing strict role-based access control.
Prevents privilege escalation and unauthorized cross-portal access.
"""

from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from models import User


def require_role(required_role):
    """
    Decorator factory that creates role-specific access control decorators.
    
    Args:
        required_role (str): Either 'student' or 'finance'
        
    Returns:
        Decorator function that enforces the specified role requirement
        
    Usage:
        @require_role('student')
        def student_only_endpoint():
            pass
            
        @require_role('finance')
        def finance_only_endpoint():
            pass
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Get user identity from JWT
            identity = get_jwt_identity()
            if not identity:
                return jsonify({
                    "error": "Authentication required",
                    "code": "AUTH_REQUIRED"
                }), 401
            
            try:
                user_id = int(identity)
            except (ValueError, TypeError):
                return jsonify({
                    "error": "Invalid authentication token",
                    "code": "INVALID_TOKEN"
                }), 401
            
            # Fetch user from database to verify role
            user = User.query.get(user_id)
            if not user:
                return jsonify({
                    "error": "User not found",
                    "code": "USER_NOT_FOUND"
                }), 404
            
            # Enforce role-based access control
            if required_role == 'finance':
                # Finance portal - requires admin role
                if not user.is_admin:
                    return jsonify({
                        "error": "Access denied. Finance portal access requires admin privileges.",
                        "code": "INSUFFICIENT_PRIVILEGES",
                        "required_role": "finance",
                        "user_role": "student"
                    }), 403
                    
            elif required_role == 'student':
                # Student portal - requires non-admin role
                if user.is_admin:
                    return jsonify({
                        "error": "Access denied. Student portal is not accessible with finance credentials.",
                        "code": "ROLE_MISMATCH",
                        "required_role": "student",
                        "user_role": "finance"
                    }), 403
            else:
                # Invalid role specified in decorator
                return jsonify({
                    "error": "Internal server error - invalid role configuration",
                    "code": "INVALID_ROLE_CONFIG"
                }), 500
            
            # Role validated - proceed with request
            return fn(*args, **kwargs)
            
        return wrapper
    return decorator


# Convenience decorators for common use cases
def require_student(fn):
    """
    Decorator that enforces student-only access.
    Rejects finance/admin users.
    
    Usage:
        @require_student
        def student_endpoint():
            pass
    """
    return require_role('student')(fn)


def require_finance(fn):
    """
    Decorator that enforces finance-only access.
    Rejects student users.
    
    This replaces the old @require_admin decorator with clearer semantics.
    
    Usage:
        @require_finance
        def finance_endpoint():
            pass
    """
    return require_role('finance')(fn)


# Legacy compatibility - maps old decorator to new one
require_admin = require_finance
