import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase redirects back here after OAuth
    // The session is automatically handled by the auth context
    const timer = setTimeout(() => {
      navigate('/student');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F9F8F6 50%, #FFF9E6 100%)',
    }}>
      <div style={{
        textAlign: 'center',
        color: '#2C1810',
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
          animation: 'spin 2s linear infinite',
        }}>⏳</div>
        <p style={{ fontSize: '18px', fontWeight: '500' }}>
          Completing your sign in...
        </p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
