import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [statusText, setStatusText] = useState('Completing authentication...');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const processAuth = async () => {
      try {
        // 1. Check for error parameters in URL query or hash
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        
        const errorDesc =
          urlParams.get('error_description') ||
          hashParams.get('error_description') ||
          urlParams.get('error') ||
          hashParams.get('error');

        if (errorDesc) {
          throw new Error(decodeURIComponent(errorDesc));
        }

        setStatusText('Verifying credentials...');

        // 2. Obtain session from Supabase
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        let activeUser = session?.user;

        // If session is still propagating, listen for state change
        if (!activeUser) {
          activeUser = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              subscription?.unsubscribe();
              reject(new Error('Sign-in timeout: No session received from provider. Please check Google OAuth settings in Supabase.'));
            }, 7000);

            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
              if (s?.user) {
                clearTimeout(timeout);
                subscription?.unsubscribe();
                resolve(s.user);
              }
            });
          });
        }

        if (isCancelled) return;
        setStatusText('Loading user profile...');

        // 3. Retrieve user profile with retry (allowing trigger to finish)
        let userProfile = null;
        for (let i = 0; i < 6; i++) {
          userProfile = await refreshProfile(activeUser);
          if (userProfile?.role) break;
          await new Promise((r) => setTimeout(r, 500));
        }

        if (isCancelled) return;

        // 4. Role-based redirect
        const role = userProfile?.role || activeUser?.user_metadata?.role || 'student';
        if (role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (role === 'tutor') {
          navigate('/tutor', { replace: true });
        } else {
          navigate('/student', { replace: true });
        }
      } catch (err) {
        console.error('AuthCallback error:', err);
        if (!isCancelled) {
          setErrorMessage(err.message || 'An error occurred during authentication.');
        }
      }
    };

    processAuth();

    return () => {
      isCancelled = true;
    };
  }, [navigate, refreshProfile]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0A0F1E 0%, #0D1A2E 100%)',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#131D33',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        borderRadius: '16px',
        padding: '36px 28px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}>
        {errorMessage ? (
          <div>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              color: '#EF4444',
            }}>
              <Icon icon="mdi:alert-circle-outline" width="32" />
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '10px' }}>
              Sign-In Failed
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              marginBottom: '24px',
            }}>
              {errorMessage}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: '#D4AF37',
                  color: '#0A0F1E',
                  borderRadius: '8px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Icon icon="mdi:arrow-left" width="18" />
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              width: '52px',
              height: '52px',
              border: '3px solid rgba(212, 175, 55, 0.25)',
              borderTopColor: '#D4AF37',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
            }} />
            <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>
              Connecting Account
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              {statusText}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
