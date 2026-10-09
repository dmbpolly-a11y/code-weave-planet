import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import PageTransition from '../components/PageTransition';
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
      // Profile/role is fetched in AuthContext; redirect via AuthCallback-style logic
      // We need to wait for profile then navigate
      navigate('/auth/callback');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error: err } = await signInWithGoogle();
    if (err) { setError(err); setLoading(false); }
  };

  return (
    <PageTransition>
      <div className="auth-container page-container">
        <div className="auth-card auth-card-animated">
          <div className="auth-header">
            <img src={cwLogo} alt="Code Weave Planet" className="auth-logo" />
            <h1>Code Weave Planet</h1>
            <p>Sign in to your account</p>
          </div>

          {!isSupabaseConfigured && (
            <div style={{
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              color: '#92400e',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              lineHeight: 1.4
            }}>
              <Icon icon="mdi:alert-circle" width="22" style={{ flexShrink: 0, color: '#d97706' }} />
              <span>
                <strong>Supabase Config Required:</strong> Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code> (or Vercel dashboard) to connect your database.
              </span>
            </div>
          )}

          {error && (
            <div className="error-message">
              <Icon icon="mdi:alert-circle" width="18" />
              <span>{error}</span>
            </div>
          )}

          <button onClick={handleGoogleSignIn} disabled={loading}
            style={{
              width: '100%', padding: '12px 16px', marginBottom: '20px',
              background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.3)',
              color: '#2C1810', borderRadius: '8px', fontWeight: 600,
              fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.3s',
            }}>
            <Icon icon="mdi:google" width="18" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0', color: '#5C4B3A' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.2)' }} />
            <span style={{ fontSize: '14px' }}>or email</span>
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
    </PageTransition>
  );
}
