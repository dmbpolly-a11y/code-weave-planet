import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import cwLogo from '../../public/images/Cwlogo.png';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Store user info
      const newUser = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        phone: formData.phone
      };

      localStorage.setItem('user', JSON.stringify(newUser));

      // Navigate based on role
      switch (formData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'tutor':
          navigate('/tutor');
          break;
        default:
          navigate('/student');
      }
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-animated">
        <div className="auth-header">
          <img src={cwLogo} alt="Code Weave Planet" className="auth-logo" />
          <h1>Join Code Weave Planet</h1>
          <p>Create your account to get started</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">
              <User size={18} />
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
              <Lock size={18} />
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
              <CheckCircle size={18} />
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

          <div className="form-group">
            <label htmlFor="role">I want to register as</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="student">Student - Learn new skills</option>
              <option value="tutor">Tutor - Teach courses</option>
            </select>
            <p className="form-hint">
              {formData.role === 'tutor' 
                ? 'Tutor accounts require admin approval'
                : 'Start learning immediately after registration'}
            </p>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            <UserPlus size={18} />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
          <Link to="/" className="back-home">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
