import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import cwLogo from '../../public/images/Cwlogo.png';

export default function Register() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    const { data, error: signUpError } = await signUp(formData.email, formData.password);
    
    if (signUpError) {
      setError(signUpError);
      setLoading(false);
    } else if (data?.user) {
      setSuccess('Account created! Check your email to confirm your account.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setSuccess('');
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
          <h1>Join Code Weave Planet</h1>
          <p>Create your account to get started</p>
        </div>

        {error && (
          <div className="error-message">
            <Icon icon="mdi:alert-circle" width="18" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(76, 175, 80, 0.1)',
            color: '#4CAF50',
            padding: '12px 16px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <Icon icon="mdi:check-circle" width="18" />
            <span>{success}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button 
          onClick={handleGoogleSignUp}
          disabled={loading || authLoading}
          type="button"
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
          {loading ? 'Creating account...' : 'Sign up with Google'}
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
            <label htmlFor="name">
              <Icon icon="mdi:account" width="18" />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

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
            <label htmlFor="phone">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0750937506"
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
              placeholder="At least 6 characters"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <Icon icon="mdi:check-circle" width="18" />
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading || authLoading}>
            <Icon icon="mdi:account-plus" width="18" />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
          <Link to="/" className="back-home">← Back to home</Link>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
