import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrigamiLoader from '../components/OrigamiLoader';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase redirects back here after OAuth
    // The session is automatically handled by the auth context
    const timer = setTimeout(() => {
      navigate('/student');
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <OrigamiLoader text="Completing your sign in..." />;
}
