import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import PageTransition from '../components/PageTransition';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import cwLogo from '../../public/images/Cwlogo.png';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: err } = await signInWithEmail(formData.email, formData.password);
    setLoading(false);

    if (err) { setError(err); return; }

    if (data?.user) {
      const targetRole = data.profile?.role || data.user?.user_metadata?.role || 'student';
      if (targetRole === 'admin') navigate('/admin');
      else if (targetRole === 'tutor') navigate('/tutor');
      else navigate('/student');
    }
  };

  const handleQuickDemoLogin = async (email, password) => {
    setFormData({ email, password });
    setLoading(true);
    setError('');
    const { data, error: err } = await signInWithEmail(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    if (data?.user) {
      const targetRole = data.profile?.role || data.user?.user_metadata?.role || 'student';
      if (targetRole === 'admin') navigate('/admin');
      else if (targetRole === 'tutor') navigate('/tutor');
      else navigate('/student');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { data, error: err } = await signInWithGoogle();
    setLoading(false);
    if (err) { setError(err); return; }
    if (data?.user) {
      navigate('/student');
    }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
        {/* Global Unified Header with Hamburger Menu */}
        <GlobalHeader />

        <div className="auth-container page-container" style={{ flex: 1, padding: '40px 20px' }}>
          <div className="auth-card auth-card-animated">
          <div className="auth-header">
            <img src={cwLogo} alt="Code Weave Planet" className="auth-logo" />
            <h1>Code Weave Planet</h1>
            <p>Sign in to your account</p>
          </div>

          {error && (
            <div className="error-message">
              <Icon icon="mdi:alert-circle" width="18" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Logins Box */}
          <div style={{
            background: 'rgba(34, 211, 238, 0.08)',
            border: '1px solid rgba(34, 211, 238, 0.25)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
              ⚡ Quick Demo Access
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@codeweave.com', 'admin123')}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  padding: '6px 4px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('tutor@codeweave.com', 'tutor123')}
                style={{
                  background: 'rgba(34, 211, 238, 0.15)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  color: '#22D3EE',
                  padding: '6px 4px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Tutor
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student@codeweave.com', 'student123')}
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#D4AF37',
                  padding: '6px 4px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Student
              </button>
            </div>
          </div>

          <button onClick={handleGoogleSignIn} disabled={loading}
            style={{
              width: '100%', padding: '12px 16px', marginBottom: '16px',
              background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.3)',
              color: '#2C1810', borderRadius: '8px', fontWeight: 600,
              fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.3s',
            }}>
            <Icon icon="mdi:google" width="18" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0', color: '#5C4B3A' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.2)' }} />
            <span style={{ fontSize: '13px' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.2)' }} />
          </div>

          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                <Icon icon="mdi:email" width="16" /> Email Address
              </label>
              <input type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Icon icon="mdi:lock" width="16" /> Password
              </label>
              <input type="password" id="password" name="password"
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              <Icon icon="mdi:login" width="18" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            <Link to="/" className="back-home">← Back to home</Link>
          </div>
        </div>
      </div>

      {/* Interactive Steering Wheel Circle and Modular Animated Footer in Blocks */}
      <GlobalFooter showSteering={true} />
    </div>
  </PageTransition>
);
}
