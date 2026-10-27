import React, { useState } from 'react';
import './Auth.css';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  // Account Type: 'secondary' (Standard flow) | 'primary' (Verified account)
  const [accountType, setAccountType] = useState('secondary');
  
  // Business Size: 'sole' (Sole Proprietorship) | 'org' (Organization)
  const [businessSize, setBusinessSize] = useState('sole');

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    businessIdNumber: '',
    gstin: '',
    panNumber: ''
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateEmail = () => {
    const email = formData.email.trim().toLowerCase();
    if (!email) {
      setError('Please provide your corporate @bnxmail.com email');
      return false;
    }
    if (!email.endsWith('@bnxmail.com')) {
      setError('Must be a company email registered under @bnxmail.com domain');
      return false;
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (accountType === 'secondary') {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('Please enter your First Name and Last Name');
        return;
      }
      if (!validateEmail()) return;
      if (!formData.businessName.trim()) {
        setError('Please enter your Business Name');
        return;
      }
      // Finished registration for secondary
      finishRegistration();
    } else {
      // Primary account flow
      if (step === 1) {
        // Step 1: user selected size, now go to identity inputs
        setStep(2);
      } else {
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          setError('Please enter your First and Last Name');
          return;
        }
        if (!validateEmail()) return;

        if (businessSize === 'sole' && !formData.gstin.trim()) {
          setError('Please provide valid GSTIN');
          return;
        }
        if (businessSize === 'org' && !formData.panNumber.trim()) {
          setError('Please provide valid PAN Number');
          return;
        }
        finishRegistration();
      }
    }
  };

  const finishRegistration = () => {
    const userSession = {
      id: `BNX-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email.trim().toLowerCase(),
      mobile: '+91 98765 43210',
      city: 'Chennai',
      role: 'Business Partner',
      accountType,
      businessName: formData.businessName || (businessSize === 'sole' ? 'Sole Enterprise' : 'Corporate Organization'),
      gstin: formData.gstin,
      pan: formData.panNumber
    };

    onRegisterSuccess(userSession);
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
        <p className="b2auth-subtitle" style={{ marginBottom: '8px' }}>Create enterprise partner account</p>
        <p className="b2auth-step-indicator">STEP 1 OF 4</p>
        <p className="b2auth-choose-caption">Choose your business account type.</p>

        {/* Top Type Selector Toggle (Secondary / Primary) */}
        <div className="b2auth-type-grid">
          <div
            className={`b2auth-type-card ${accountType === 'secondary' ? 'selected' : ''}`}
            onClick={() => {
              setAccountType('secondary');
              setStep(1);
              setError('');
            }}
          >
            <div className="b2auth-type-title">Secondary</div>
            <div className="b2auth-type-desc">Standard flow</div>
          </div>

          <div
            className={`b2auth-type-card ${accountType === 'primary' ? 'selected' : ''}`}
            onClick={() => {
              setAccountType('primary');
              setError('');
            }}
          >
            <div className="b2auth-type-title">Primary</div>
            <div className="b2auth-type-desc">Verified account</div>
          </div>
        </div>

        {error && (
          <div className="b2auth-error-banner">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleNext} className="b2auth-form">
          {/* ========================================================
              FLOW 1: SECONDARY (Screenshot 2)
              Inputs: First Name, Last Name, Email, Business Name, Business ID Number
             ======================================================== */}
          {accountType === 'secondary' && (
            <>
              <div className="b2auth-row-2col">
                <input
                  type="text"
                  name="firstName"
                  className="b2auth-input"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  className="b2auth-input"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="b2auth-field-group">
                <input
                  type="email"
                  name="email"
                  className="b2auth-input"
                  placeholder="Company Email (@bnxmail.com)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="b2auth-field-group">
                <input
                  type="text"
                  name="businessName"
                  className="b2auth-input"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>

              <div className="b2auth-field-group">
                <input
                  type="text"
                  name="businessIdNumber"
                  className="b2auth-input"
                  placeholder="Business ID Number"
                  value={formData.businessIdNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="b2auth-action-row">
                <button
                  type="button"
                  className="b2auth-back-btn"
                  onClick={onSwitchToLogin}
                >
                  Back
                </button>
                <button type="submit" className="b2auth-next-btn">
                  Next
                </button>
              </div>
            </>
          )}

          {/* ========================================================
              FLOW 2: PRIMARY (Screenshots 3, 4, 5)
             ======================================================== */}
          {accountType === 'primary' && step === 1 && (
            <>
              <p className="b2auth-section-title">
                Choose your business size to continue verification
              </p>

              {/* Sole Proprietorship Card (Screenshot 3) */}
              <div
                className={`b2auth-size-card ${businessSize === 'sole' ? 'active-size' : ''}`}
                onClick={() => setBusinessSize('sole')}
              >
                <div className="b2auth-size-circle">S</div>
                <div className="b2auth-size-text">
                  <div className="b2auth-size-heading">Sole Proprietorship</div>
                  <div className="b2auth-size-sub">Verify instantly using your GSTIN</div>
                </div>
              </div>

              {/* Organization Card (Screenshot 3) */}
              <div
                className={`b2auth-size-card ${businessSize === 'org' ? 'active-size' : ''}`}
                onClick={() => setBusinessSize('org')}
              >
                <div className="b2auth-size-circle">L</div>
                <div className="b2auth-size-text">
                  <div className="b2auth-size-heading">Organization</div>
                  <div className="b2auth-size-sub">Verify via PAN and GSTIN details</div>
                </div>
              </div>

              <div className="b2auth-action-row">
                <button
                  type="button"
                  className="b2auth-back-btn"
                  onClick={onSwitchToLogin}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="b2auth-next-btn"
                  onClick={() => setStep(2)}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* PRIMARY STEP 2: Input fields based on selection */}
          {accountType === 'primary' && step === 2 && (
            <>
              <div className="b2auth-row-2col">
                <input
                  type="text"
                  name="firstName"
                  className="b2auth-input"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  className="b2auth-input"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="b2auth-field-group">
                <input
                  type="email"
                  name="email"
                  className="b2auth-input"
                  placeholder="Company Email (@bnxmail.com)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Sole Proprietorship: GSTIN (Screenshot 4) */}
              {businessSize === 'sole' && (
                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="gstin"
                    className="b2auth-input"
                    placeholder="GSTIN"
                    value={formData.gstin}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Organization: PAN Number + Get GSTINs for PAN (Screenshot 5) */}
              {businessSize === 'org' && (
                <>
                  <div className="b2auth-field-group">
                    <input
                      type="text"
                      name="panNumber"
                      className="b2auth-input"
                      placeholder="PAN Number"
                      value={formData.panNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="b2auth-get-gstins-box">
                    <button
                      type="button"
                      className="b2auth-get-gstins-btn"
                      onClick={() => {
                        if (!formData.panNumber) {
                          setError('Please enter PAN Number first');
                        } else {
                          setFormData(prev => ({ ...prev, gstin: `33${formData.panNumber}1Z5` }));
                          alert(`GSTIN auto-fetched for PAN: 33${formData.panNumber}1Z5`);
                        }
                      }}
                    >
                      Get GSTINs for PAN
                    </button>
                  </div>
                </>
              )}

              <div className="b2auth-action-row">
                <button
                  type="button"
                  className="b2auth-back-btn"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button type="submit" className="b2auth-verify-btn">
                  Verify Identity
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
