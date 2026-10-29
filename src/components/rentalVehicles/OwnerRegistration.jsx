import React, { useState } from 'react';
import './rentalVehicles.css';

export default function OwnerRegistration({ onRegistrationComplete, existingOwner }) {
  const [formData, setFormData] = useState({
    ownerType: 'Individual', // 'Individual' | 'Fleet Owner' | 'Rental Company'
    fullName: existingOwner?.name || '',
    mobile: existingOwner?.phone || '',
    email: existingOwner?.email || '',
    state: 'Tamil Nadu',
    city: 'Chennai',
    pincode: '600002',
    idType: 'Aadhaar Card',
    idNumber: '',
    upiId: '',
    upiPayeeName: '',
    upiApp: 'Google Pay',
    companyName: '',
    gstin: '',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    aadhaarFrontDoc: null,
    aadhaarBackDoc: null,
    panDoc: null,
    gstCertificate: null
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSendOtp = () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    alert(`Verification code sent to +91 ${formData.mobile}: 4819`);
  };

  const handleVerifyOtp = () => {
    if (otpCode === '4819' || otpCode.length === 4) {
      setIsMobileVerified(true);
      setOtpSent(false);
    } else {
      alert('Please enter code: 4819');
    }
  };

  const handleVerifyEmail = () => {
    if (!formData.email) {
      alert('Please provide your email address');
      return;
    }
    setIsEmailVerified(true);
    alert(`Email verification token validated for ${formData.email}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert('Please enter Owner Legal Name');
      return;
    }

    const hostData = {
      id: `HOST-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      isMobileVerified: true,
      isEmailVerified: true,
      kycStatus: 'Pending Admin Verification',
      registeredAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setSubmitted(true);
    if (onRegistrationComplete) {
      onRegistrationComplete(hostData);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>

        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>
          Vehicle Owner
        </h1>
        <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#64748b' }}>
          Register your legal identity, banking credentials, and contact details to list self-drive and commercial rental vehicles.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card 1: Owner Type & Legal Identity */}
        <div className="rental-form-card">
          <div className="rental-section-header">
            <h3>Owner Profile & Type</h3>
            <p>Select whether you are registering as a private vehicle owner or an enterprise fleet company</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
            {[
              { id: 'Individual', label: 'Individual Owner', desc: '1 - 3 personal/family cars or bikes', icon: 'fa-user' },
              { id: 'Fleet Owner', label: 'Fleet Owner', desc: '4 - 25 commercial rental assets', icon: 'fa-truck-moving' },
              { id: 'Rental Company', label: 'Rental Company', desc: 'Vehical agency', icon: 'fa-building' }
            ].map((type) => (
              <div
                key={type.id}
                onClick={() => setFormData({ ...formData, ownerType: type.id })}
                style={{
                  border: formData.ownerType === type.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  background: formData.ownerType === type.id ? '#eff6ff' : '#ffffff',
                  padding: '16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  color: formData.ownerType === type.id ? '#2563eb' : '#64748b',
                  fontSize: '20px',
                  marginBottom: '8px'
                }}>
                  <i className={`fa-solid ${type.icon}`}></i>
                </div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{type.label}</div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>{type.desc}</div>
              </div>
            ))}
          </div>

          <div className="rental-input-grid">
            <div className="rental-field-group">
              <label className="rental-label">
                Full Name (Legal Name on ID)<span className="req">*</span>
              </label>
              <input
                type="text"
                className="rental-input"
                placeholder="e.g. Ramesh Sundaram"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="rental-field-group">
              <label className="rental-label">
                Profile Photo (Owner Identification)<span className="req">*</span>
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
                {/* Image preview circular / rounded box */}
                <div style={{
                  position: 'relative',
                  width: '74px',
                  height: '74px',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0',
                  overflow: 'hidden',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  {formData.profilePhoto ? (
                    <img
                      src={formData.profilePhoto}
                      alt="Owner Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <i className="fa-solid fa-user" style={{ fontSize: '28px', color: '#cbd5e1' }}></i>
                  )}
                </div>

                {/* File picker button & upload area */}
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    id="ownerProfileUpload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData(prev => ({ ...prev, profilePhoto: event.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label
                      htmlFor="ownerProfileUpload"
                      style={{
                        padding: '9px 16px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      {formData.profilePhoto ? 'Change Photo' : 'Upload Image'}
                    </label>

                    {formData.profilePhoto && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, profilePhoto: '' }))}
                        style={{
                          padding: '8px 12px',
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i> Remove
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '6px' }}>
                    JPG, PNG, WEBP up to 5MB. Clear face photo required for KYC identity matching.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Contact & OTP Verification */}
        <div className="rental-form-card">
          <div className="rental-section-header">
            <h3>Contact Verification</h3>
            <p>OTP verification is required before vehicle listings can be activated</p>
          </div>

          <div className="rental-input-grid">
            {/* Mobile with OTP */}
            <div className="rental-field-group">
              <label className="rental-label">
                Mobile Number (For OTP Verification)<span className="req">*</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="tel"
                  className="rental-input"
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  disabled={isMobileVerified}
                  required
                />
                {!isMobileVerified ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="rental-btn-secondary"
                    style={{ whiteSpace: 'nowrap', padding: '8px 14px', fontSize: '12.5px' }}
                  >
                    Send OTP
                  </button>
                ) : (
                  <span style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    <i className="fa-solid fa-circle-check"></i> Verified
                  </span>
                )}
              </div>

              {otpSent && !isMobileVerified && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input
                    type="text"
                    className="rental-input"
                    placeholder="Enter 4-digit OTP (4819)"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    style={{ maxWidth: '180px' }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="rental-btn-primary"
                    style={{ fontSize: '12.5px', padding: '8px 14px' }}
                  >
                    Verify OTP
                  </button>
                </div>
              )}
            </div>

            {/* Email with verification */}
            <div className="rental-field-group">
              <label className="rental-label">
                Email Address<span className="req">*</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  className="rental-input"
                  placeholder="e.g. host@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isEmailVerified}
                  required
                />
                {!isEmailVerified ? (
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    className="rental-btn-secondary"
                    style={{ whiteSpace: 'nowrap', padding: '8px 14px', fontSize: '12.5px' }}
                  >
                    Verify
                  </button>
                ) : (
                  <span style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    <i className="fa-solid fa-circle-check"></i> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Address & ID Proof */}
        <div className="rental-form-card">
          <div className="rental-section-header">
            <h3>Address & Government ID</h3>
            <p>Official residential or company address corresponding to official KYC documents</p>
          </div>

          <div className="rental-input-grid" style={{ marginBottom: '16px' }}>
            <div className="rental-field-group">
              <label className="rental-label">State<span className="req">*</span></label>
              <input
                type="text"
                className="rental-input"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>

            <div className="rental-field-group">
              <label className="rental-label">City<span className="req">*</span></label>
              <input
                type="text"
                className="rental-input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="rental-field-group">
              <label className="rental-label">Pincode<span className="req">*</span></label>
              <input
                type="text"
                className="rental-input"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="rental-input-grid">
            <div className="rental-field-group">
              <label className="rental-label">Owner ID Type<span className="req">*</span></label>
              <select
                className="rental-select"
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Passport">Passport</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>

            <div className="rental-field-group">
              <label className="rental-label">
                {formData.idType} Number<span className="req">*</span>
              </label>
              <input
                type="text"
                className="rental-input"
                placeholder={`Enter ${formData.idType} number`}
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Card 4: UPI Instant Payouts for Rental Earnings */}
        <div className="rental-form-card">
          <div className="rental-section-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3>UPI Payout Details (Rental Earnings)</h3>
                <p>All rental revenue, hourly bookings, customer extensions, and earnings will be credited directly using UPI</p>
              </div>
              <span style={{
                background: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '11.5px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <i className="fa-solid fa-bolt"></i> Instant 24/7 UPI Credit
              </span>
            </div>
          </div>

          <div className="rental-input-grid">
            {/* UPI ID Field with Verification Indicator */}
            <div className="rental-field-group">
              <label className="rental-label">
                UPI ID (VPA)<span className="req">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="rental-input"
                  placeholder="e.g. yourname@okaxis / mobile@upi"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value.trim().toLowerCase() })}
                  required
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: formData.upiId && formData.upiId.includes('@') ? '#10b981' : '#94a3b8',
                  fontSize: '14px'
                }}>
                  <i className={`fa-solid ${formData.upiId && formData.upiId.includes('@') ? 'fa-circle-check' : 'fa-at'}`}></i>
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Supports Google Pay, PhonePe, Paytm, BHIM, and all UPI banking apps
              </span>
            </div>

            {/* UPI Registered Payee Name */}
            <div className="rental-field-group">
              <label className="rental-label">
                UPI Registered Payee Name<span className="req">*</span>
              </label>
              <input
                type="text"
                className="rental-input"
                placeholder="Name registered with UPI app"
                value={formData.upiPayeeName || formData.fullName}
                onChange={(e) => setFormData({ ...formData, upiPayeeName: e.target.value })}
                required
              />
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Must match your Government ID name to ensure payout clearance
              </span>
            </div>

            {/* Preferred UPI App */}
            <div className="rental-field-group">
              <label className="rental-label">Preferred UPI App</label>
              <select
                className="rental-select"
                value={formData.upiApp}
                onChange={(e) => setFormData({ ...formData, upiApp: e.target.value })}
              >
                <option value="Google Pay">Google Pay (GPay)</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Paytm">Paytm UPI</option>
                <option value="BHIM UPI">BHIM UPI</option>
                <option value="Amazon Pay">Amazon Pay UPI</option>
                <option value="Direct Bank UPI">Direct Bank UPI (HDFC/ICICI/SBI)</option>
              </select>
            </div>
          </div>

          {/* Quick Notice */}
          <div style={{
            marginTop: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: '#475569'
          }}>
            <i className="fa-solid fa-qrcode" style={{ color: '#2563eb', fontSize: '16px' }}></i>
            <span>
              <strong>Zero Deduction Delay:</strong> Rental amounts and security deposit settlements are credited directly to your UPI ID without manual NEFT/RTGS processing delays.
            </span>
          </div>
        </div>

        {/* Card 5: Business Details (if Fleet Owner or Rental Company) */}
        {formData.ownerType !== 'Individual' && (
          <div className="rental-form-card">
            <div className="rental-section-header">
              <h3>Enterprise & Business Details</h3>
              <p>For Fleet Owners and Rental Agencies managing multiple commercial rental vehicles</p>
            </div>

            <div className="rental-input-grid">
              <div className="rental-field-group">
                <label className="rental-label">Registered Business / Agency Name</label>
                <input
                  type="text"
                  className="rental-input"
                  placeholder="e.g. SRM Auto Fleet Services LLP"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div className="rental-field-group">
                <label className="rental-label">GSTIN (Goods and Services Tax Number)</label>
                <input
                  type="text"
                  className="rental-input"
                  placeholder="33AAAAA0000A1Z5"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginBottom: '40px' }}>
          <button type="submit" className="rental-btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
            <i className="fa-solid fa-arrow-right"></i>
            Save Owner Profile & Proceed to KYC Documents (Step 2)
          </button>
        </div>
      </form>
    </div>
  );
}
