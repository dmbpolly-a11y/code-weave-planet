import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import PlanetLoader from './components/PlanetLoader'
import CodeWeavePlanetLanding from './components/CodeWeavePlanetLanding'
import AboutUs from './pages/AboutUs'
import Profiles from './pages/Profiles'
import Login from './pages/Login'
import Register from './pages/Register'
import AuthCallback from './pages/AuthCallback'
import AdminDashboard from './pages/AdminDashboard'
import TutorDashboard from './pages/TutorDashboard'
import StudentDashboard from './pages/StudentDashboard'

function App() {
  const [showPlanetLoader, setShowPlanetLoader] = useState(true);

  return (
    <ErrorBoundary>
      <AuthProvider>
        {showPlanetLoader && (
          <PlanetLoader onLoaded={() => setShowPlanetLoader(false)} />
        )}
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<CodeWeavePlanetLanding />} />
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
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
