import React, { useState } from 'react';
import './Auth.css';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    // Check user database in localStorage
    let registeredUsers = [];
    try {
      const stored = localStorage.getItem('sart_registered_business_users');
      if (stored) registeredUsers = JSON.parse(stored);
    } catch (e) { }

    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === trimmedEmail);

    if (foundUser) {
      // Validate password if stored, or allow login
      if (foundUser.password && foundUser.password !== password) {
        setError('Incorrect password. Please try again.');
        return;
      }
      onLoginSuccess(foundUser);
    } else {
      // If user hasn't registered yet, create an account session or prompt
      const displayName = trimmedEmail.split('@')[0];
      const newUser = {
        id: `SART-${Math.floor(1000 + Math.random() * 9000)}`,
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: trimmedEmail,
        password: password,
        mobile: '+91 98765 43210',
        city: 'Chennai',
        role: 'Business Partner',
        accountType: 'secondary',
        businessType: 'Small Owners'
      };

      // Store into registered users list
      registeredUsers.push(newUser);
      try {
        localStorage.setItem('sart_registered_business_users', JSON.stringify(registeredUsers));
      } catch (e) { }

      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="b2auth-container">
      <div className="b2auth-card">
        {/* SART Business Brand Logo Image */}
        <div className="b2auth-logo-wrap">
          <img
            src="/images/sart_business_logo.png"
            alt="SART Business"
            className="b2auth-brand-image"
          />
        </div>

        <h1 className="b2auth-title">SART Business</h1>
        <p className="b2auth-subtitle">Sign in to your Enterprise Mobility Portal</p>

        {error && (
          <div className="b2auth-error-banner">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {info && (
          <div className="b2auth-info-banner">
            <i className="fa-solid fa-circle-check"></i>
            <span>{info}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="b2auth-form">
          <div className="b2auth-field-group">
            <label className="b2auth-label">Email:</label>
            <div className="b2auth-input-wrapper">
              <input
                type="email"
                className="b2auth-input"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
              />
            </div>
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
                className="b2auth-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="b2auth-forgot-row">
            <a href="#forgot" className="b2auth-forgot-link" onClick={(e) => { e.preventDefault(); setError('Password recovery link sent to registered email'); }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="b2auth-submit-btn">
            Login
          </button>

          <div className="b2auth-card-footer">
            <div className="b2auth-links-left">
              <a href="#help">Help</a>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
            </div>
            <a
              href="#create"
              className="b2auth-create-link"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToRegister();
              }}
            >
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
