import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import cwLogo from '../../public/images/Cwlogo.png';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' // admin, tutor, student
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Demo credentials for testing
      const users = {
        'admin@codeweave.com': { password: 'admin123', role: 'admin' },
        'tutor@codeweave.com': { password: 'tutor123', role: 'tutor' },
        'student@codeweave.com': { password: 'student123', role: 'student' }
      };

      const user = users[formData.email];
      
      if (user && user.password === formData.password) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          role: user.role,
          name: user.role.charAt(0).toUpperCase() + user.role.slice(1)
        }));

        // Navigate based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'tutor':
            navigate('/tutor');
            break;
          default:
            navigate('/student');
        }
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-animated">
        <div className="auth-header">
          <img src={cwLogo} alt="Code Weave Planet" className="auth-logo" />
          <h1>Code Weave Planet</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
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
              <Lock size={18} />
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

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          <Link to="/" className="back-home">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
