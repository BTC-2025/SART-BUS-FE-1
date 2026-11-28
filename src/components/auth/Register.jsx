import React, { useState } from 'react';
import './Auth.css';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  // Role Selection ('secondary' | 'primary')
  const [role, setRole] = useState('secondary'); // 'secondary' (Small Owners / Individual) | 'primary' (Commercial Partner)

  // For Commercial Partner: 'sole' (Sole Proprietorship) | 'org' (Organization / Private Ltd)
  const [commercialOption, setCommercialOption] = useState('sole');

  // Form Fields matching User Images 1, 2, 3:
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    businessName: '',
    mobileNumber: '',
    emailUsername: '',
    panNumber: '',
    gstin: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleNextSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Field Validations based on chosen role / subtype
    if (role === 'secondary') {
      // Image 1: First Name, Last Name, Mobile Number, Email Username, PAN Number
      if (!formData.firstName.trim() && !formData.lastName.trim()) {
        setError('Please enter First Name and Last Name');
        return;
      }
      if (!formData.mobileNumber.trim() || formData.mobileNumber.trim().length < 10) {
        setError('Please enter a valid 10-digit Mobile Number');
        return;
      }
      if (!formData.emailUsername.trim()) {
        setError('Please enter Email Username (e.g. saikumar)');
        return;
      }
      if (!formData.panNumber.trim() || formData.panNumber.trim().length < 10) {
        setError('Please enter a valid 10-character PAN Number (e.g. BGPJ7683H4)');
        return;
      }
    } else if (commercialOption === 'sole') {
      // Image 2: First Name, Last Name, Business Name, Mobile Number, Email Username, PAN Number, GSTIN (Optional)
      if (!formData.firstName.trim() && !formData.lastName.trim()) {
        setError('Please enter First Name and Last Name');
        return;
      }
      if (!formData.businessName.trim()) {
        setError('Please enter Business Name');
        return;
      }
      if (!formData.mobileNumber.trim() || formData.mobileNumber.trim().length < 10) {
        setError('Please enter a valid Mobile Number');
        return;
      }
      if (!formData.emailUsername.trim()) {
        setError('Please enter Email Username');
        return;
      }
      if (!formData.panNumber.trim() || formData.panNumber.trim().length < 10) {
        setError('Please enter PAN Number');
        return;
      }
    } else {
      // Image 3: Authorized Person Name, Legal Entity / Company Name, Company Mobile Number, Company Email Username, COMPANY PAN NUMBER, GSTIN (MANDATORY)
      if (!formData.fullName.trim() && !formData.firstName.trim()) {
        setError('Please enter Authorized Person Name');
        return;
      }
      if (!formData.businessName.trim()) {
        setError('Please enter Legal Entity / Company Name');
        return;
      }
      if (!formData.mobileNumber.trim() || formData.mobileNumber.trim().length < 10) {
        setError('Please enter Company Mobile Number');
        return;
      }
      if (!formData.emailUsername.trim()) {
        setError('Please enter Company Email Username');
        return;
      }
      if (!formData.panNumber.trim() || formData.panNumber.trim().length < 10) {
        setError('Please enter Company PAN Number');
        return;
      }
      if (!formData.gstin.trim() || formData.gstin.trim().length < 15) {
        setError('GSTIN is Mandatory for Organization / Private Ltd (15 characters)');
        return;
      }
    }

    // Build the resolved display name
    let resolvedName = '';
    if (role === 'secondary') {
      resolvedName = `${formData.firstName} ${formData.lastName}`.trim() || 'Partner Owner';
    } else if (commercialOption === 'sole') {
      resolvedName = `${formData.firstName} ${formData.lastName}`.trim() || formData.businessName.trim() || 'Commercial Partner';
    } else {
      resolvedName = formData.fullName.trim() || `${formData.firstName} ${formData.lastName}`.trim() || formData.businessName.trim() || 'Authorized Representative';
    }

    const cleanUsername = formData.emailUsername.trim().toLowerCase().replace(/@.*$/, '');
    const fullEmail = `${cleanUsername}@bnxmail.com`;

    // Construct the authenticated partner object
    const newUser = {
      id: `SART-${Math.floor(1000 + Math.random() * 9000)}`,
      name: resolvedName,
      email: fullEmail,
      mobile: formData.mobileNumber.trim(),
      city: 'Chennai',
      role: role === 'secondary' ? 'Secondary Partner' : 'Commercial Partner',
      accountRole: role === 'secondary'
        ? 'Small Owners / Individual'
        : (commercialOption === 'sole' ? 'Sole Proprietorship (Small Biz)' : 'Organization (Private Ltd)'),
      businessName: formData.businessName.trim() || `${resolvedName} Logistics`,
      panNumber: formData.panNumber.trim().toUpperCase(),
      gstin: formData.gstin.trim() ? formData.gstin.trim().toUpperCase() : 'N/A'
    };

    // Save to registered database and active session
    let registeredUsers = [];
    try {
      const stored = localStorage.getItem('sart_registered_business_users');
      if (stored) registeredUsers = JSON.parse(stored);
    } catch (e) { }

    registeredUsers = registeredUsers.filter(u => u.email !== fullEmail);
    registeredUsers.push(newUser);

    try {
      localStorage.setItem('sart_registered_business_users', JSON.stringify(registeredUsers));
      localStorage.setItem('sart_captain_session', JSON.stringify(newUser));
    } catch (e) { }

    // Transition directly into Business Home page
    onRegisterSuccess(newUser);
  };

  return (
    <div className="b2auth-container">
      <div className="b2auth-card">
        {/* Brand Logo Badge (Exact match to User Image 1, 2, 3) */}
        <div className="b2auth-logo-wrap">
          <img
            src="/images/sart_business_logo_badge.png"
            alt="SART BUSINESS"
            className="b2auth-brand-badge"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/sart_business_logo.png';
            }}
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

        <form onSubmit={handleNextSubmit} className="b2auth-form">
          {/* Master Role Toggle: Secondary vs Primary (Images 1, 2, 3) */}
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

          {/* Subtype Radio Selection when Primary is selected (Images 2, 3) */}
          {role === 'primary' && (
            <div className="commercial-subtype-row">
              <label className="subtype-radio-pill">
                <input
                  type="radio"
                  name="commSubtype"
                  checked={commercialOption === 'sole'}
                  onChange={() => setCommercialOption('sole')}
                />
                <span>Sole Proprietorship (Small Biz)</span>
              </label>

              <label className="subtype-radio-pill">
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

          {/* Form Fields: Dynamically rendered based on selected tab */}
          {role === 'secondary' ? (
            /* =========================================================
               VIEW 1: Secondary - Small Owners / Individual (Image 1)
               ========================================================= */
            <>
              {/* Row 1: First Name | Last Name */}
              <div className="b2auth-row-two">
                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="firstName"
                    className="b2auth-input"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
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
                    required
                  />
                </div>
              </div>

              {/* Row 2: Mobile Number */}
              <div className="b2auth-field-group">
                <input
                  type="tel"
                  name="mobileNumber"
                  className="b2auth-input"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  maxLength="10"
                  required
                />
              </div>

              {/* Row 3: Email Username + @bnxmail.com suffix addon */}
              <div className="b2auth-field-group">
                <div className="b2auth-email-addon-group">
                  <input
                    type="text"
                    name="emailUsername"
                    className="b2auth-email-input"
                    placeholder="Email Username"
                    value={formData.emailUsername}
                    onChange={handleChange}
                    required
                  />
                  <span className="b2auth-email-addon">@bnxmail.com</span>
                </div>
              </div>

              {/* Row 4: PAN NUMBER */}
              <div className="b2auth-field-group">
                <input
                  type="text"
                  name="panNumber"
                  className="b2auth-input"
                  placeholder="PAN NUMBER"
                  value={formData.panNumber}
                  onChange={handleChange}
                  maxLength="10"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>
            </>
          ) : commercialOption === 'sole' ? (
            /* =========================================================
               VIEW 2: Primary - Sole Proprietorship (Image 2)
               ========================================================= */
            <>
              {/* Row 1: First Name | Last Name */}
              <div className="b2auth-row-two">
                <div className="b2auth-field-group">
                  <input
                    type="text"
                    name="firstName"
                    className="b2auth-input"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
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
                    required
                  />
                </div>
              </div>

              {/* Row 2: Business Name */}
              <div className="b2auth-field-group">
                <input
                  type="text"
                  name="businessName"
                  className="b2auth-input"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 3: Mobile Number */}
              <div className="b2auth-field-group">
                <input
                  type="tel"
                  name="mobileNumber"
                  className="b2auth-input"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  maxLength="10"
                  required
                />
              </div>

              {/* Row 4: Email Username + @bnxmail.com addon */}
              <div className="b2auth-field-group">
                <div className="b2auth-email-addon-group">
                  <input
                    type="text"
                    name="emailUsername"
                    className="b2auth-email-input"
                    placeholder="Email Username"
                    value={formData.emailUsername}
                    onChange={handleChange}
                    required
                  />
                  <span className="b2auth-email-addon">@bnxmail.com</span>
                </div>
              </div>

              {/* Row 5: PAN NUMBER */}
              <div className="b2auth-field-group">
                <input
                  type="text"
                  name="panNumber"
                  className="b2auth-input"
                  placeholder="PAN NUMBER"
                  value={formData.panNumber}
                  onChange={handleChange}
                  maxLength="10"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>

              {/* Row 6: GSTIN (OPTIONAL) */}
              <div className="b2auth-field-group">
                <input
                  type="text"
                  name="gstin"
                  className="b2auth-input"
                  placeholder="GSTIN (OPTIONAL)"
                  value={formData.gstin}
                  onChange={handleChange}
                  maxLength="15"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </>
          ) : (
            /* =========================================================
               VIEW 3: Primary - Organization (Private Ltd) (Image 3)
               ========================================================= */
            <>
              {/* Row 1: Authorized Person Name */}
              <div className="b2auth-field-group">
                <input
                  type="text"
                  name="fullName"
                  className="b2auth-input"
                  placeholder="Authorized Person Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 2: Legal Entity / Company Name */}
              <div className="b2auth-field-group">
                <input
                  type="text"
                  name="businessName"
                  className="b2auth-input"
                  placeholder="Legal Entity / Company Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 3: Company Mobile Number */}
              <div className="b2auth-field-group">
                <input
                  type="tel"
                  name="mobileNumber"
                  className="b2auth-input"
                  placeholder="Company Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  maxLength="10"
                  required
                />
              </div>

              {/* Row 4: Company Email Username + @bnxmail.com addon */}
              <div className="b2auth-field-group">
                <div className="b2auth-email-addon-group">
                  <input
                    type="text"
                    name="emailUsername"
                    className="b2auth-email-input"
                    placeholder="Company Email Username"
                    value={formData.emailUsername}
                    onChange={handleChange}
                    required
                  />
                  <span className="b2auth-email-addon">@bnxmail.com</span>
                </div>
              </div>

              {/* Row 5: COMPANY PAN NUMBER */}
              <div className="b2auth-field-group">
                <input
                  type="text"
                  name="panNumber"
                  className="b2auth-input"
                  placeholder="COMPANY PAN NUMBER"
                  value={formData.panNumber}
                  onChange={handleChange}
                  maxLength="10"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>

              {/* Row 6: GSTIN (MANDATORY) */}
              <div className="b2auth-field-group">
                <input
                  type="text"
                  name="gstin"
                  className="b2auth-input"
                  placeholder="GSTIN (MANDATORY)"
                  value={formData.gstin}
                  onChange={handleChange}
                  maxLength="15"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>
            </>
          )}

          {/* Action Row: Back & Next → Buttons (Images 1, 2, 3) */}
          <div className="b2auth-btn-row">
            <button
              type="button"
              className="b2auth-btn-back"
              onClick={onSwitchToLogin}
            >
              Back
            </button>
            <button type="submit" className="b2auth-btn-next">
              Next &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
