import React, { useState } from 'react';
import './Auth.css';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError('Please enter your company email address');
      return;
    }

    if (!trimmedEmail.endsWith('@bnxmail.com')) {
      setError('Access restricted: Please log in using your company email (@bnxmail.com)');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    // Generate partner user session
    const username = trimmedEmail.split('@')[0];
    const displayName = username.charAt(0).toUpperCase() + username.slice(1);

    const userSession = {
      id: `BNX-${Math.floor(1000 + Math.random() * 9000)}`,
      name: displayName,
      email: trimmedEmail,
      mobile: '+91 98765 43210',
      city: 'Chennai',
      role: 'Business Partner',
      serviceType: 'auto',
      company: 'BNX Business Group'
    };

    onLoginSuccess(userSession);
  };

  return (
    <div className="b2auth-container">
      <div className="b2auth-card">
        {/* SART Business Brand Logo Image */}
        <div className="b2auth-logo-wrap">
          <img
            src="/images/sart_business_logo.jpg"
            alt="SART Business"
            className="b2auth-brand-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="b2auth-brand-fallback-icon" style={{ display: 'none' }}>
            <i className="fa-solid fa-compass-drafting"></i>
          </div>
        </div>

        <h1 className="b2auth-title">SART Business</h1>
        <p className="b2auth-subtitle">Sign in to your Enterprise Mobility Portal</p>

        {error && (
          <div className="b2auth-error-banner">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="b2auth-form">
          <div className="b2auth-field-group">
            <label className="b2auth-label">Email:</label>
            <div className="b2auth-input-wrapper">
              <input
                type="email"
                className="b2auth-input"
                placeholder="Enter email address (e.g. yourname@bnxmail.com)"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
              />
            </div>
            <div className="b2auth-hint">Must end with @bnxmail.com</div>
          </div>

          <div className="b2auth-field-group">
            <label className="b2auth-label">Password:</label>
            <div className="b2auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="b2auth-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
              />
              <button
                type="button"
                className="b2auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="b2auth-forgot-row">
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact IT support admin at admin@bnxmail.com to reset credentials.'); }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="b2auth-primary-btn">
            Login
          </button>
        </form>

        <div className="b2auth-footer-row">
          <div className="b2auth-footer-links">
            <a href="#help" onClick={(e) => e.preventDefault()}>Help</a>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
          </div>
          <button
            type="button"
            className="b2auth-link-btn"
            onClick={onSwitchToRegister}
          >
            Create Account
          </button>
        </div>

        <div className="b2auth-report-link">
          <a href="#report" onClick={(e) => e.preventDefault()}>Report Issue</a>
        </div>
      </div>
    </div>
  );
}
