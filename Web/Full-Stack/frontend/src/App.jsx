import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseRegistration from './pages/student/CourseRegistration';
import CalculatedFees from './pages/student/CalculatedFees';
import MakePayment from './pages/student/MakePayment';
import PaymentReceipt from './pages/student/PaymentReceipt';
import PaymentHistory from './pages/student/PaymentHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute role="student" />}>
             <Route path="/student/dashboard" element={<StudentDashboard />} />
             <Route path="/student/courses" element={<CourseRegistration />} />
             <Route path="/student/fees" element={<CalculatedFees />} />
             <Route path="/student/payment" element={<MakePayment />} />
             <Route path="/student/receipt" element={<PaymentReceipt />} />
             <Route path="/student/history" element={<PaymentHistory />} />
             {/* Add more student routes here later */}
          </Route>

          {/* Protected Finance Routes (Placeholder) */}
          <Route element={<ProtectedRoute role="finance" />}>
             <Route path="/finance" element={<div>Finance Dashboard Coming Soon</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
