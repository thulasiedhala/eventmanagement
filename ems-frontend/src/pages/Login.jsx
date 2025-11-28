// src/pages/Login.jsx
import React, { useState } from 'react';
import { login } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function Login() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { loginWithToken } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (!data || !data.token) throw new Error('No token returned');
      loginWithToken(data.token, data.role, null, email);
      nav('/');
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-split">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <h1 className="auth-brand-title">Welcome Back</h1>
            <p className="auth-brand-subtitle">
              Sign in to manage your events and connect with attendees
            </p>
            <div className="auth-features">
              <div className="auth-feature-item">
                <span className="auth-feature-icon">✓</span>
                <span>Secure authentication</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">✓</span>
                <span>Real-time event management</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">✓</span>
                <span>Instant notifications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Sign In</h2>
              <p className="auth-form-subtitle">Enter your credentials to continue</p>
            </div>

            <form onSubmit={submit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  className="form-input"
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  type="email" 
                  placeholder="you@example.com"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  className="form-input"
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  type="password" 
                  placeholder="Enter your password"
                  required 
                />
              </div>

              {err && <div className="alert-error">{err}</div>}

              <button type="submit" className="btn btn-primary btn-full glow" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register" className="auth-link">Create one</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
