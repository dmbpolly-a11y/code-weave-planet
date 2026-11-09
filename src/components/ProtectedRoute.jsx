import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Profile not yet loaded — wait briefly
  if (!profile) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const role = profile.role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to the correct dashboard
    switch (role) {
      case 'admin': return <Navigate to="/admin" replace />;
      case 'tutor': return <Navigate to="/tutor" replace />;
      case 'student': return <Navigate to="/student" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  return children;
}
