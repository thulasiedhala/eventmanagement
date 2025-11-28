// src/pages/Register.jsx
import React, { useState } from 'react';
import { register } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

const ROLE_OPTIONS = [
  { label: 'Attendee', value: 'ROLE_ATTENDEE', icon: '🎫', desc: 'Browse and register for events' },
  { label: 'Organizer', value: 'ROLE_ORGANIZER', icon: '📋', desc: 'Create and manage events' },
  { label: 'Admin', value: 'ROLE_ADMIN', icon: '⚙️', desc: 'Full platform access (dev only)' }
];

export default function Register() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_ATTENDEE');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const payload = { email, password, fullName };
      const res = await register(payload, role);
      alert('Registered successfully! Please login.');
      nav('/login');
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || 'Registration failed');
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
            <h1 className="auth-brand-title">Join Our Platform</h1>
            <p className="auth-brand-subtitle">
              Create an account to start organizing or attending amazing events
            </p>
            <div className="auth-features">
              <div className="auth-feature-item">
                <span className="auth-feature-icon">✓</span>
                <span>Free registration</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">✓</span>
                <span>Instant access</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">✓</span>
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Create Account</h2>
              <p className="auth-form-subtitle">Get started in just a few steps</p>
            </div>

            <form onSubmit={onSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  className="form-input"
                  value={fullName} 
                  onChange={e=>setFullName(e.target.value)} 
                  placeholder="John Doe"
                  required 
                />
              </div>

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
                  placeholder="Create a strong password"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Your Role</label>
                <div className="role-selector">
                  {ROLE_OPTIONS.map(option => (
                    <div 
                      key={option.value}
                      className={`role-card ${role === option.value ? 'role-card-active' : ''}`}
                      onClick={() => setRole(option.value)}
                    >
                      <div className="role-card-icon">{option.icon}</div>
                      <div className="role-card-label">{option.label}</div>
                      <div className="role-card-desc">{option.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {err && <div className="alert-error">{err}</div>}

              <button type="submit" className="btn btn-primary btn-full glow" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
