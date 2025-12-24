"""
Fee Calculator Service
======================
Centralized fee calculation service that matches Finance portal logic.
This ensures consistency between Finance configuration and Student charges.
"""

from models import db, FeeStructure, Course
from datetime import datetime, timezone, timedelta


class FeeCalculator:
    """
    Centralized fee calculation service.
    Calculates fees based on FeeStructure configuration from Finance portal.
    """
    
    @staticmethod
    def calculate_enrollment_fees(student_id, course_ids, include_bus=False):
        """
        Calculate total fees for enrolling in courses.
        
        Args:
            student_id (int): Student ID
            course_ids (list): List of course IDs to enroll in
            include_bus (bool): Whether to include bus fees
            
        Returns:
            dict: {
                'tuition_fees': float,          # Per-credit tuition total
                'registration_fees': float,      # Fixed fees total
                'bus_fees': float,              # Bus fees total
                'total': float,                 # Grand total
                'total_credits': int,           # Total credit hours
                'breakdown': [                  # Detailed breakdown
                    {
                        'category': str,        # 'tuition' or 'bus'
                        'name': str,           # Fee name
                        'amount': float,       # Unit amount
                        'quantity': int,       # Quantity (credits or 1)
                        'is_per_credit': bool, # Whether multiplied by credits
                        'subtotal': float      # Line item total
                    },
                    ...
                ]
            }
        """
        # Get all active fee structures
        tuition_fees = FeeStructure.query.filter_by(
            category='tuition',
            is_active=True
        ).order_by(FeeStructure.display_order).all()
        
        bus_fees = FeeStructure.query.filter_by(
            category='bus',
            is_active=True
        ).order_by(FeeStructure.display_order).all()
        
        # Get courses and calculate total credits
        courses = Course.query.filter(Course.id.in_(course_ids)).all()
        total_credits = sum(course.credits for course in courses)
        
        # Initialize totals
        tuition_total = 0
        registration_total = 0
        breakdown = []
        
        # Calculate tuition fees
        for fee in tuition_fees:
            if fee.is_per_credit:
                # Per-credit fee: multiply by total credits
                subtotal = fee.amount * total_credits
                tuition_total += subtotal
                breakdown.append({
                    'category': 'tuition',
                    'name': fee.name,
                    'amount': fee.amount,
                    'quantity': total_credits,
                    'is_per_credit': True,
                    'subtotal': subtotal
                })
            else:
                # Fixed fee: add as-is
                registration_total += fee.amount
                breakdown.append({
                    'category': 'tuition',
                    'name': fee.name,
                    'amount': fee.amount,
                    'quantity': 1,
                    'is_per_credit': False,
                    'subtotal': fee.amount
                })
        
        # Calculate bus fees (if opted in)
        bus_total = 0
        if include_bus:
            for fee in bus_fees:
                bus_total += fee.amount
                breakdown.append({
                    'category': 'bus',
                    'name': fee.name,
                    'amount': fee.amount,
                    'quantity': 1,
                    'is_per_credit': False,
                    'subtotal': fee.amount
                })
        
        return {
            'tuition_fees': tuition_total,
            'registration_fees': registration_total,
            'bus_fees': bus_total,
            'total': tuition_total + registration_total + bus_total,
            'total_credits': total_credits,
            'breakdown': breakdown,
            'courses': [
                {
                    'id': course.id,
                    'name': course.name,
                    'credits': course.credits
                }
                for course in courses
            ]
        }
    
    @staticmethod
    def calculate_single_course_fee(course_id, include_bus=False):
        """
        Calculate fee for a single course.
        Convenience wrapper around calculate_enrollment_fees.
        
        Args:
            course_id (int): Course ID
            include_bus (bool): Whether to include bus fees
            
        Returns:
            dict: Same as calculate_enrollment_fees
        """
        return FeeCalculator.calculate_enrollment_fees(
            student_id=None,
            course_ids=[course_id],
            include_bus=include_bus
        )
    
    @staticmethod
    def calculate_payment_due_date(enrollment_date=None, days_until_due=30):
        """
        Calculate payment due date.
        
        Args:
            enrollment_date (datetime): Enrollment date (default: now)
            days_until_due (int): Days until payment is due (default: 30)
            
        Returns:
            datetime: Payment due date
        """
        if enrollment_date is None:
            enrollment_date = datetime.now(timezone.utc)
        return enrollment_date + timedelta(days=days_until_due)
    
    @staticmethod
    def format_fee_breakdown_message(fee_calculation):
        """
        Format fee breakdown as a human-readable message.
        
        Args:
            fee_calculation (dict): Result from calculate_enrollment_fees
            
        Returns:
            str: Formatted message
        """
        lines = ["Fee Breakdown:"]
        
        # Group by category
        tuition_items = [item for item in fee_calculation['breakdown'] if item['category'] == 'tuition']
        bus_items = [item for item in fee_calculation['breakdown'] if item['category'] == 'bus']
        
        # Tuition section
        if tuition_items:
            lines.append("\nTuition & Fees:")
            for item in tuition_items:
                if item['is_per_credit']:
                    lines.append(f"  - {item['name']} ({item['quantity']} credits × ${item['amount']:.2f}): ${item['subtotal']:.2f}")
                else:
                    lines.append(f"  - {item['name']}: ${item['subtotal']:.2f}")
        
        # Bus section
        if bus_items:
            lines.append("\nBus Fees:")
            for item in bus_items:
                lines.append(f"  - {item['name']}: ${item['subtotal']:.2f}")
        
        # Totals
        lines.append(f"\nSubtotals:")
        if fee_calculation['tuition_fees'] > 0:
            lines.append(f"  - Tuition: ${fee_calculation['tuition_fees']:.2f}")
        if fee_calculation['registration_fees'] > 0:
            lines.append(f"  - Registration & Other: ${fee_calculation['registration_fees']:.2f}")
        if fee_calculation['bus_fees'] > 0:
            lines.append(f"  - Bus: ${fee_calculation['bus_fees']:.2f}")
        
        lines.append(f"\nTotal: ${fee_calculation['total']:.2f}")
        
        return "\n".join(lines)
