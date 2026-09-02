import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import cwLogo from '../../public/images/Cwlogo.png';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: signInError } = await signInWithEmail(formData.email, formData.password);
    
    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else if (data?.user) {
      // Navigate to student dashboard by default
      navigate('/student');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const { error: googleError } = await signInWithGoogle();
    
    if (googleError) {
      setError(googleError);
      setLoading(false);
    }
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

        {error && (
          <div className="error-message">
            <Icon icon="mdi:alert-circle" width="18" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={loading || authLoading}
          className="btn-google"
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '20px',
            background: '#FFFFFF',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: '#2C1810',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
          }}
        >
          <Icon icon="mdi:google" width="18" />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          margin: '20px 0',
          color: '#5C4B3A'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(212, 175, 55, 0.2)' }}></div>
          <span style={{ fontSize: '14px' }}>or email</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(212, 175, 55, 0.2)' }}></div>
        </div>

        <form onSubmit={handleEmailSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              <Icon icon="mdi:email" width="18" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Icon icon="mdi:lock" width="18" />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading || authLoading}>
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
