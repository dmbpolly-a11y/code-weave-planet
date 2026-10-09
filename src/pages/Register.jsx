import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import PageTransition from '../components/PageTransition';
import cwLogo from '../../public/images/Cwlogo.png';

export default function Register() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!formData.full_name.trim()) { setError('Please enter your full name'); return false; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return false; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');

    const { data, error: err } = await signUp(formData.email, formData.password, {
      full_name: formData.full_name,
      phone: formData.phone,
      role: formData.role,
    });

    setLoading(false);
    if (err) { setError(err); return; }

    if (data?.user) {
      setSuccess('Account created! Please check your email to confirm, then sign in.');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const { error: err } = await signInWithGoogle(formData.role);
    if (err) { setError(err); setLoading(false); }
  };

  const roles = [
    { value: 'student', label: 'Student / Trainee', icon: 'mdi:school', desc: 'Browse and enroll in courses' },
    { value: 'tutor',   label: 'Tutor / Trainer',   icon: 'mdi:teach',  desc: 'Create and manage courses' },
  ];

  return (
    <PageTransition>
      <div className="auth-container page-container">
        <div className="auth-card auth-card-animated" style={{ maxWidth: '480px' }}>
          <div className="auth-header">
            <img src={cwLogo} alt="Code Weave Planet" className="auth-logo" />
            <h1>Join Code Weave Planet</h1>
            <p>Create your account to get started</p>
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
                <strong>Supabase Config Required:</strong> Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code> (or Vercel dashboard) to enable user registration.
              </span>
            </div>
          )}

          {error && (
            <div className="error-message">
              <Icon icon="mdi:alert-circle" width="18" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(34,197,94,0.12)', color: '#22C55E',
              padding: '12px 16px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '16px', fontSize: '14px', fontWeight: 500,
              border: '1px solid rgba(34,197,94,0.25)'
            }}>
              <Icon icon="mdi:check-circle" width="18" />
              <span>{success}</span>
            </div>
          )}

          {/* Role Selector */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: '#8B7355', marginBottom: '10px', fontWeight: 600 }}>
              I AM REGISTERING AS:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r.value })}
                  style={{
                    padding: '14px 10px',
                    border: formData.role === r.value
                      ? '2px solid #D4AF37'
                      : '2px solid rgba(212,175,55,0.2)',
                    borderRadius: '10px',
                    background: formData.role === r.value
                      ? 'rgba(212,175,55,0.12)'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                >
                  <Icon icon={r.icon} width="24"
                    style={{ color: formData.role === r.value ? '#D4AF37' : '#8B7355', marginBottom: '4px' }} />
                  <div style={{
                    fontSize: '13px', fontWeight: 700,
                    color: formData.role === r.value ? '#D4AF37' : '#5C4B3A'
                  }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8B7355', marginTop: '2px' }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Google Sign Up */}
          <button onClick={handleGoogleSignUp} disabled={loading} type="button"
            style={{
              width: '100%', padding: '12px 16px', marginBottom: '16px',
              background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.3)',
              color: '#2C1810', borderRadius: '8px', fontWeight: 600,
              fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.3s',
            }}>
            <Icon icon="mdi:google" width="18" />
            {loading ? 'Please wait...' : 'Sign up with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0', color: '#5C4B3A' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.2)' }} />
            <span style={{ fontSize: '13px' }}>or register with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.2)' }} />
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="full_name">
                <Icon icon="mdi:account" width="16" /> Full Name
              </label>
              <input type="text" id="full_name" name="full_name"
                value={formData.full_name} onChange={handleChange}
                placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Icon icon="mdi:email" width="16" /> Email Address
              </label>
              <input type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number <span style={{ opacity: 0.6 }}>(optional)</span></label>
              <input type="tel" id="phone" name="phone"
                value={formData.phone} onChange={handleChange}
                placeholder="0750937506" />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Icon icon="mdi:lock" width="16" /> Password
              </label>
              <input type="password" id="password" name="password"
                value={formData.password} onChange={handleChange}
                placeholder="At least 6 characters" required />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Icon icon="mdi:lock-check" width="16" /> Confirm Password
              </label>
              <input type="password" id="confirmPassword" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="Re-enter password" required />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              <Icon icon="mdi:account-plus" width="18" />
              {loading ? 'Creating account...' : `Create ${formData.role === 'tutor' ? 'Tutor' : 'Student'} Account`}
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
