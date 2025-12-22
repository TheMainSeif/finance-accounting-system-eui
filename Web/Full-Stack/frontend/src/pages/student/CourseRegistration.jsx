import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import studentService from '../../services/studentService';
import './CourseRegistration.css';

const CourseRegistration = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dropLoading, setDropLoading] = useState(null); // ID of course being dropped

  const [hasPayments, setHasPayments] = useState(false); // Track if student has made any payments

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [coursesData, statusData, paymentData] = await Promise.all([
        studentService.getCourses(),
        studentService.getDashboardStatus(),
        studentService.getPaymentHistory()

      ]);

      const allCourses = coursesData.courses || [];
      setCourses(allCourses);

      const enrolledIds = statusData.enrollments.map(e => e.course_id);
      setEnrolledCourseIds(enrolledIds);


      // Clear selections that are now enrolled (in case of re-fetch after submit)
      setSelectedCourses(prev => prev.filter(c => !enrolledIds.includes(c.id)));

    } catch (err) {
      setError('Failed to load courses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseToggle = (course) => {
    setSelectedCourses(prev => {
      const isSelected = prev.find(c => c.id === course.id);
      if (isSelected) {
        return prev.filter(c => c.id !== course.id);
      } else {
        return [...prev, course];
      }
    });
  };

  const handleDropCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to drop this course?')) return;

    setDropLoading(courseId);
    try {
      await studentService.dropCourse(courseId);
      // Remove from enrolled list locally
      setEnrolledCourseIds(prev => prev.filter(id => id !== courseId));
      setSuccess('Course dropped successfully.');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to drop course.');
    } finally {
      setDropLoading(null);
    }
  };

  const calculateTotalCredits = () => {
    return selectedCourses.reduce((sum, course) => sum + course.credits, 0);
  };

  const calculateTotalFees = () => {
    return selectedCourses.reduce((sum, course) => sum + course.total_fee, 0);
  };

  const handleSubmitRegistration = async () => {
    if (selectedCourses.length === 0) {
      setError('Please select at least one course to register.');
      return;
    }

    if (calculateTotalCredits() > 18) {
      setError('Maximum 18 credits per semester allowed.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Enroll in each selected course
      for (const course of selectedCourses) {
        await studentService.enrollCourse(course.id);
      }
      setSuccess('Registration successful!');
      setSelectedCourses([]);

      // Refresh Data to sync state
      await fetchData();

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register courses. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isCourseSelected = (courseId) => {
    return selectedCourses.some(c => c.id === courseId);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="course-registration-container">
        {/* Main Content */}
        <div className="course-list-section">
          <div className="page-header">
            <h1 className="page-title">Course Registration</h1>
            <p className="page-subtitle">Select courses for the upcoming semester</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              ✓ {success}
            </div>
          )}

          <div className="courses-grid">
            {courses.map((course) => {
              const isSelected = isCourseSelected(course.id);
              const isEnrolled = enrolledCourseIds.includes(course.id);

              return (
                <div
                  key={course.id}
                  className={`course-card ${isSelected ? 'selected' : ''} ${isEnrolled ? 'enrolled' : ''}`}
                  onClick={() => !isEnrolled && handleCourseToggle(course)}
                >
                  <div className="course-checkbox">
                    {isEnrolled ? (
                      // No checkbox for enrolled courses, maybe an indicator
                      <div className="enrolled-badge">
                        <svg className="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => { }}
                          className="checkbox-input"
                        />
                        {isSelected && (
                          <svg className="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </>
                    )}
                  </div>

                  <div className="course-info">
                    <div className="course-header">
                      <span className={`course-code ${isEnrolled ? 'enrolled-code' : ''}`}>{course.course_id}</span>
                      <h3 className="course-name">
                        {course.name}
                        {isEnrolled && <span className="enrolled-text"> (Enrolled)</span>}
                      </h3>
                    </div>

                    <div className="course-details">
                      <div className="detail-item">
                        <svg className="detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.credits} Credits</span>
                      </div>

                      <div className="detail-item">
                        <svg className="detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>${course.total_fee.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {isEnrolled && (
                    <button

                      className="btn-drop"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropCourse(course.id);
                      }}
                      disabled={dropLoading === course.id}

                    >
                      {dropLoading === course.id ? 'Dropping...' : 'Drop'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Registration Summary Sidebar */}
        <div className="summary-sidebar">
          <div className="summary-card">
            <div className="summary-header">
              <svg className="summary-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2>Registration Summary</h2>
            </div>

            <div className="summary-content">
              <div className="summary-row">
                <span className="summary-label">Selected Courses</span>
                <span className="summary-value">{selectedCourses.length}</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Total Credits</span>
                <span className="summary-value">{calculateTotalCredits()}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span className="summary-label">Estimated Fees</span>
                <span className="summary-value">${calculateTotalFees().toLocaleString()}</span>
              </div>

              <button
                className="submit-btn"
                onClick={handleSubmitRegistration}
                disabled={submitting || selectedCourses.length === 0}
              >
                {submitting ? 'Submitting...' : 'Submit Registration'}
              </button>

              <p className="summary-note">Maximum 18 credits per semester</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseRegistration;
