import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Common Pages
import Login from './pages/Login';
import Landing from './pages/Landing';
import CoursesList from './pages/CoursesList';

// Student Pages
import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';
import Profile from './pages/Profile';
import Certificate from './pages/Certificate';
import Library from './pages/Library';
import PracticalClips from './pages/PracticalClips';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import LabManagement from './pages/admin/LabManagement';
import QuizManagement from './pages/admin/QuizManagement';
import CertificateManagement from './pages/admin/CertificateManagement';
import AdminClipsManagement from './pages/admin/AdminClipsManagement';
import Settings from './pages/admin/Settings';

const StudentProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen bg-dark-900 flex items-center justify-center text-white">Yuklanmoqda...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen bg-dark-900 flex items-center justify-center text-white text-2xl font-black">Admin Verifying...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Student & Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<StudentProtectedRoute><Dashboard /></StudentProtectedRoute>} />
        <Route path="/library" element={<StudentProtectedRoute><Library /></StudentProtectedRoute>} />
        <Route path="/practical-clips" element={<StudentProtectedRoute><PracticalClips /></StudentProtectedRoute>} />
        <Route path="/dashboard/lesson/:id" element={<StudentProtectedRoute><Lesson /></StudentProtectedRoute>} />
        <Route path="/dashboard/profile" element={<StudentProtectedRoute><Profile /></StudentProtectedRoute>} />
        <Route path="/dashboard/certificate" element={<StudentProtectedRoute><Certificate /></StudentProtectedRoute>} />
      </Route>

      {/* Modern Admin Panel Routes */}
      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="labs" element={<LabManagement />} />
        <Route path="quizzes" element={<QuizManagement />} />
        <Route path="certificates" element={<CertificateManagement />} />
        <Route path="clips" element={<AdminClipsManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Router future={{ v7_relativeSplatPath: true }}>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
