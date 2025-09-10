// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const user = await authService.login(formData.email, formData.password);
      
      if (user && onLogin) {
        onLogin(user);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      admin: { email: 'admin@university.edu', password: 'admin123' },
      professor: { email: 'prof@university.edu', password: 'professor123' },
      staff: { email: 'staff@university.edu', password: 'staff123' }
    };

    setFormData(demoAccounts[role]);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <h1>🏫 University</h1>
            <p>Asset Management System</p>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="demo-accounts">
          <h3>Demo Accounts</h3>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn btn-demo btn-admin"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
            >
              👑 Admin
            </button>
            <button
              type="button"
              className="btn btn-demo btn-professor"
              onClick={() => handleDemoLogin('professor')}
              disabled={loading}
            >
              🎓 Professor
            </button>
            <button
              type="button"
              className="btn btn-demo btn-staff"
              onClick={() => handleDemoLogin('staff')}
              disabled={loading}
            >
              💼 Staff
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-background">
        <div className="background-content">
          <h2>University Asset Management</h2>
          <p>Efficiently manage and track all university assets in one place</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">💻</span>
              <span>IT Equipment Tracking</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔧</span>
              <span>Maintenance Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span>Asset Assignments</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Detailed Reporting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;