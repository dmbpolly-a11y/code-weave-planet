import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { profile, loading, refreshProfile, user } = useAuth();

  useEffect(() => {
    if (loading) return;

    const redirect = async () => {
      let p = profile;

      // For OAuth flows profile might not be loaded yet — try refreshing
      if (!p && user) {
        p = await refreshProfile();
      }

      if (!p) {
        // Give the trigger another moment then go to student as fallback
        setTimeout(() => navigate('/student', { replace: true }), 1500);
        return;
      }

      switch (p.role) {
        case 'admin':  navigate('/admin',   { replace: true }); break;
        case 'tutor':  navigate('/tutor',   { replace: true }); break;
        default:       navigate('/student', { replace: true }); break;
      }
    };

    redirect();
  }, [loading, profile, user, navigate, refreshProfile]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0A0F1E 0%, #0D1A2E 100%)',
    }}>
      <div style={{ textAlign: 'center', color: '#D4AF37' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(212, 175, 55, 0.3)',
          borderTopColor: '#D4AF37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ fontSize: '18px', fontWeight: '500', color: '#fff' }}>
          Signing you in...
        </p>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
