import React, { useState } from 'react';
import './Auth.css';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  // Step 1: Role Selection ('secondary' | 'primary')
  const [role, setRole] = useState('secondary'); // 'secondary' (Family / Individual / Small Owners) | 'primary' (Commercial Partner)

  // For Commercial Partner: 'sole' (Sole Proprietorship) | 'org' (Organization / Private Ltd)
  const [commercialOption, setCommercialOption] = useState('sole');

  // Form Fields matching User Specification Table:
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    businessName: '',
    mobileNumber: '',
    email: '',
    password: '',
    panNumber: '',
    gstin: '',
    otp: ''
  });

  const [step, setStep] = useState(1); // 1: Inputs, 2: Mobile OTP Verification
  const [error, setError] = useState('');
  const [sentOtp, setSentOtp] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleTriggerOtp = (e) => {
    e.preventDefault();
    setError('');

    // Field Validations based on chosen path
    if (role === 'secondary') {
      // Secondary -> Small Owners -> Full Name, Mobile Number, Personal PAN Number
      const name = formData.fullName || `${formData.firstName} ${formData.lastName}`.trim();
      if (!name) {
        setError('Please enter your Full Name');
        return;
      }
      if (!formData.mobileNumber || formData.mobileNumber.length < 10) {
        setError('Please enter a valid 10-digit Mobile Number');
        return;
      }
      if (!formData.panNumber || formData.panNumber.length < 10) {
        setError('Please enter a valid 10-digit Personal PAN Number (e.g. ABCDE1234F)');
        return;
      }
    } else {
      // Primary Commercial Partner
      if (commercialOption === 'sole') {
        // Sole Proprietor -> Small Business -> Full Name, Business Name, Mobile Number, PAN Number, GSTIN (Optional)
        const name = formData.fullName || `${formData.firstName} ${formData.lastName}`.trim();
        if (!name) {
          setError('Please enter Full Name');
          return;
        }
        if (!formData.businessName) {
          setError('Please enter Business Name');
          return;
        }
        if (!formData.mobileNumber || formData.mobileNumber.length < 10) {
          setError('Please enter a valid Mobile Number');
          return;
        }
        if (!formData.panNumber) {
          setError('Please enter Business/Personal PAN Number');
          return;
        }
      } else {
        // Organization -> Private Ltd -> Authorized Person Name, Legal Entity Name, Mobile Number, Company PAN, GSTIN (Mandatory)
        const name = formData.fullName || `${formData.firstName} ${formData.lastName}`.trim();
        if (!name) {
          setError('Please enter Authorized Contact Person Name');
          return;
        }
        if (!formData.businessName) {
          setError('Please enter Legal Entity / Company Name');
          return;
        }
        if (!formData.mobileNumber || formData.mobileNumber.length < 10) {
          setError('Please enter Mobile Number');
          return;
        }
        if (!formData.panNumber) {
          setError('Please enter Company PAN Number');
          return;
        }
        if (!formData.gstin) {
          setError('GSTIN is Mandatory for Organization / Private Ltd accounts');
          return;
        }
      }
    }

    if (!formData.email) {
      setError('Please provide email address for account login');
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setError('Please set an account password (min 4 characters)');
      return;
    }

    // Trigger SMS OTP
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(mockOtp);
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length < 4) {
      setError('Please enter the 6-digit OTP sent to your mobile');
      return;
    }

    // Build user session
    const resolvedName = formData.fullName || `${formData.firstName} ${formData.lastName}`.trim();
    const newUser = {
      id: `SART-${Math.floor(1000 + Math.random() * 9000)}`,
      name: resolvedName,
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      mobile: formData.mobileNumber,
      city: 'Chennai',
      role: 'Business Partner',
      accountRole: role === 'secondary' ? 'Secondary (Small Owner)' : `Commercial (${commercialOption === 'sole' ? 'Sole Proprietor' : 'Private Ltd'})`,
      businessName: formData.businessName || `${resolvedName} Mobility`,
      panNumber: formData.panNumber.toUpperCase(),
      gstin: formData.gstin ? formData.gstin.toUpperCase() : 'N/A'
    };

    // Save to registered database
    let registeredUsers = [];
    try {
      const stored = localStorage.getItem('sart_registered_business_users');
      if (stored) registeredUsers = JSON.parse(stored);
    } catch (e) { }

    registeredUsers.push(newUser);
    try {
      localStorage.setItem('sart_registered_business_users', JSON.stringify(registeredUsers));
    } catch (e) { }

    onRegisterSuccess(newUser);
  };

  return (
    <div className="b2auth-container">
      <div className="b2auth-card">
        {/* Brand Logo */}
        <div className="b2auth-logo-wrap">
          <img
            src="/images/sart_business_logo.png"
            alt="SART Business"
            className="b2auth-brand-image"
          />
        </div>

        <h1 className="b2auth-title">Create Partner Account</h1>
        <p className="b2auth-subtitle">Select role and register your fleet business</p>

        {error && (
          <div className="b2auth-error-banner">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleTriggerOtp} className="b2auth-form">
            {/* Master Role Toggle (Matches Screenshot 5: Secondary vs Primary) */}
            <div className="role-selection-grid">
              <button
                type="button"
                className={`role-select-box ${role === 'secondary' ? 'active' : ''}`}
                onClick={() => setRole('secondary')}
              >
                <div className="role-header-title">Secondary</div>
                <div className="role-sub-title">Small Owners / Individual</div>
              </button>

              <button
                type="button"
                className={`role-select-box ${role === 'primary' ? 'active' : ''}`}
                onClick={() => setRole('primary')}
              >
                <div className="role-header-title">Primary</div>
                <div className="role-sub-title">Commercial Partner</div>
              </button>
            </div>

            {/* If Primary Selected: Options for Sole Proprietorship vs Organization */}
            {role === 'primary' && (
              <div className="commercial-subtype-row">
                <label className={`subtype-radio-pill ${commercialOption === 'sole' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="commSubtype"
                    checked={commercialOption === 'sole'}
                    onChange={() => setCommercialOption('sole')}
                  />
                  <span>Sole Proprietorship (Small Biz)</span>
                </label>

                <label className={`subtype-radio-pill ${commercialOption === 'org' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="commSubtype"
                    checked={commercialOption === 'org'}
                    onChange={() => setCommercialOption('org')}
                  />
                  <span>Organization (Private Ltd)</span>
                </label>
              </div>
            )}

            {/* Dynamic Inputs according to Selected Role & Type */}
            {role === 'secondary' ? (
              // Secondary -> Small Owners -> Full Name, Mobile Number, Personal PAN Number
              <>
                <div className="b2auth-row-two">
                  <div className="b2auth-field-group">
                    <input
                      type="text"
                      name="firstName"
                      className="b2auth-input"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="b2auth-field-group">
                    <input
                      type="text"
                      name="lastName"
                      className="b2auth-input"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="mobileNumber"
                    className="b2auth-input"
                    placeholder="Mobile Number (for SMS OTP)"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    maxLength="10"
                  />
                </div>

                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="panNumber"
                    className="b2auth-input"
                    placeholder="Personal PAN Number (10 Characters)"
                    value={formData.panNumber}
                    onChange={handleChange}
                    maxLength="10"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
              </>
            ) : commercialOption === 'sole' ? (
              // Sole Proprietor -> Full Name, Business Name, Mobile Number, PAN Number, GSTIN (Optional)
              <>
                <div className="b2auth-row-two">
                  <div className="b2auth-field-group">
                    <input
                      type="text"
                      name="firstName"
                      className="b2auth-input"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="b2auth-field-group">
                    <input
                      type="text"
                      name="lastName"
                      className="b2auth-input"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
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
                    name="mobileNumber"
                    className="b2auth-input"
                    placeholder="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    maxLength="10"
                  />
                </div>

                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="panNumber"
                    className="b2auth-input"
                    placeholder="PAN Number"
                    value={formData.panNumber}
                    onChange={handleChange}
                    maxLength="10"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>

                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="gstin"
                    className="b2auth-input"
                    placeholder="GSTIN (Optional)"
                    value={formData.gstin}
                    onChange={handleChange}
                    maxLength="15"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
              </>
            ) : (
              // Organization -> Authorized Person Name, Legal Entity Name, Mobile Number, Company PAN, GSTIN (Mandatory)
              <>
                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="fullName"
                    className="b2auth-input"
                    placeholder="Authorized Person Name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="businessName"
                    className="b2auth-input"
                    placeholder="Legal Entity / Company Name"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                </div>

                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="mobileNumber"
                    className="b2auth-input"
                    placeholder="Company Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    maxLength="10"
                  />
                </div>

                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="panNumber"
                    className="b2auth-input"
                    placeholder="Company PAN Number"
                    value={formData.panNumber}
                    onChange={handleChange}
                    maxLength="10"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>

                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="gstin"
                    className="b2auth-input"
                    placeholder="GSTIN (Mandatory)"
                    value={formData.gstin}
                    onChange={handleChange}
                    maxLength="15"
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                </div>
              </>
            )}





            <div className="b2auth-btn-row">
              <button
                type="button"
                className="b2auth-btn-back"
                onClick={onSwitchToLogin}
              >
                Back
              </button>
              <button type="submit" className="b2auth-btn-next">
                Next <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Mobile OTP Verification */
          <form onSubmit={handleVerifyOtp} className="b2auth-form">
            <div className="otp-verification-banner">
              <i className="fa-solid fa-mobile-screen-button otp-icon"></i>
              <div className="otp-title">Verify Mobile Number</div>
              <p className="otp-desc">
                We sent a 6-digit SMS OTP to <strong>+91 {formData.mobileNumber}</strong>
              </p>
              <div className="mock-otp-chip">
                <span>Demo OTP: </span>
                <strong>{sentOtp || '123456'}</strong>
              </div>
            </div>

            <div className="b2auth-field-group">
              <input
                type="text"
                name="otp"
                className="b2auth-input otp-large-input"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                maxLength="6"
                autoFocus
              />
            </div>

            <div className="b2auth-btn-row">
              <button
                type="button"
                className="b2auth-btn-back"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button type="submit" className="b2auth-btn-next">
                Verify & Create Account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
