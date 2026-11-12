import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import PlanetLoader from './components/PlanetLoader'
import PageTransition from './components/PageTransition'
import CodeWeavePlanetLanding from './components/CodeWeavePlanetLanding'
import AboutUs from './pages/AboutUs'
import Profiles from './pages/Profiles'
import Login from './pages/Login'
import Register from './pages/Register'
import AuthCallback from './pages/AuthCallback'
import AdminDashboard from './pages/AdminDashboard'
import TutorDashboard from './pages/TutorDashboard'
import StudentDashboard from './pages/StudentDashboard'
import ScrollProgressRing from './components/ScrollProgressRing'
import Testimonials from './pages/Testimonials'
import Portal from './pages/Portal'

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        {/* Public Routes */}
        <Route path="/" element={<CodeWeavePlanetLanding />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor"
          element={
            <ProtectedRoute allowedRoles={['tutor']}>
              <TutorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  const [showPlanetLoader, setShowPlanetLoader] = useState(true);

  return (
    <ErrorBoundary>
      <AuthProvider>
        {showPlanetLoader && (
          <PlanetLoader duration={8000} onLoaded={() => setShowPlanetLoader(false)} />
        )}
        <Router>
          <AnimatedRoutes />
          <ScrollProgressRing />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
