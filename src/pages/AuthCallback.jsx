import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import OrigamiLoader from '../components/OrigamiLoader';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase redirects back here after OAuth
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;
        const role =
          user?.user_metadata?.role ||
          user?.app_metadata?.role ||
          'student';

        // Store user in localStorage so dashboards can access it
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
          role,
        }));

        // Navigate to appropriate dashboard
        if (role === 'admin') navigate('/admin', { replace: true });
        else if (role === 'tutor') navigate('/tutor', { replace: true });
        else navigate('/student', { replace: true });
      } else {
        // No session — go back to login
        setTimeout(() => navigate('/login', { replace: true }), 1500);
      }
    };

    handleCallback();
  }, [navigate]);

  return <OrigamiLoader text="Completing your sign in..." />;
}

