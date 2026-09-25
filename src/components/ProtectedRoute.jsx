import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrigamiLoader from './OrigamiLoader';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <OrigamiLoader text="Loading Code Weave Planet..." />;
  }

  // Not authenticated at all — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role-checking is needed, get role from localStorage (dashboards use this)
  // or from user.user_metadata.role (set via Supabase)
  if (allowedRoles.length > 0) {
    const localUser = (() => {
      try {
        return JSON.parse(localStorage.getItem('user') || '{}');
      } catch {
        return {};
      }
    })();

    const userRole =
      localUser?.role ||
      user?.user_metadata?.role ||
      user?.app_metadata?.role ||
      'student'; // default role

    if (!allowedRoles.includes(userRole)) {
      switch (userRole) {
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'tutor':
          return <Navigate to="/tutor" replace />;
        case 'student':
          return <Navigate to="/student" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  return children;
}
