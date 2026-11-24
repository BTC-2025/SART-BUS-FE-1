import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Upload, FileText, UserCheck, ShieldCheck } from 'lucide-react';

interface DriverAddNewVerificationProps {
  onCancel: () => void;
  onAddDriver: (driverData: any) => void;
  initialData?: any;
}

export default function DriverAddNewVerification({
  onCancel,
  onAddDriver,
  initialData = null
}: DriverAddNewVerificationProps) {
  // Form State (Default to completely blank without pre-filled data)
  const [fullName, setFullName] = useState(initialData?.name || '');
  const [mobileNumber, setMobileNumber] = useState(initialData?.phone || '');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [dob, setDob] = useState(initialData?.dob || '');
  const [gender, setGender] = useState(initialData?.gender || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [pincode, setPincode] = useState(initialData?.pincode || '');
  const [passportPhoto, setPassportPhoto] = useState<string>(initialData?.image || '');
  const [photoFileName, setPhotoFileName] = useState('');

  // Driving eligibility checkboxes (Default to unchecked/empty, checked when user adds)
  const [canDriveTwoWheeler, setCanDriveTwoWheeler] = useState(false);
  const [canDriveCar, setCanDriveCar] = useState(false);
  const [canDriveCommercial, setCanDriveCommercial] = useState(false);
  const [canDriveEightWheeler, setCanDriveEightWheeler] = useState(false);
  const [canDriveSixWheeler, setCanDriveSixWheeler] = useState(false);
  const [canDriveTenWheeler, setCanDriveTenWheeler] = useState(false);
  const [canDriveTwelveWheeler, setCanDriveTwelveWheeler] = useState(false);
  const [canDriveShip, setCanDriveShip] = useState(false);
  const [canDriveFlight, setCanDriveFlight] = useState(false);

  // Ineligibility tags (display)
  const cannotDriveList = [
    ''
  ];
  const [drivingExperienceYears, setDrivingExperienceYears] = useState('');

  // KYC & Documents (Default blank)
  const [dlNumber, setDlNumber] = useState(initialData?.dlNumber || '');
  const [dlUploadName, setDlUploadName] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState(initialData?.aadhaarNumber || '');
  const [aadhaarUploadName, setAadhaarUploadName] = useState('');
  const [panNumber, setPanNumber] = useState(initialData?.panNumber || '');
  const [panUploadName, setPanUploadName] = useState('');
  const [pccUploadName, setPccUploadName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState(initialData?.emergencyContact || '');

  // Consent
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle local passport photo pick
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFileName(file.name);
      const url = URL.createObjectURL(file);
      setPassportPhoto(url);
    }
  };

  const handleDocumentSelect = (setter: (name: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarationChecked) {
      alert('Please check the declaration box before submitting.');
      return;
    }

    const payload = {
      id: initialData?.id || `DRV-${Date.now()}`,
      name: fullName,
      phone: mobileNumber,
      dob,
      gender,
      address,
      pincode,
      image: passportPhoto,
      photoFileName,
      eligibleVehicles: [
        canDriveTwoWheeler && 'Two-Wheeler / Bike',
        canDriveCar && 'Car / Sedan / SUV',
        canDriveCommercial && 'Commercial / LCV',
        canDriveEightWheeler && '8-Wheeler Trucks',
        canDriveSixWheeler && '6-Wheeler Trucks',
        canDriveTenWheeler && '10-Wheeler Trucks',
        canDriveTwelveWheeler && '12-Wheeler / Multi-Axle Trucks',
        canDriveShip && 'Ship / Maritime Vessel',
        canDriveFlight && 'Flight / Aircraft'
      ].filter(Boolean),
      cannotDriveList,
      drivingExperienceYears,
      dlNumber,
      dlUploadName,
      aadhaarNumber,
      aadhaarUploadName,
      panNumber,
      panUploadName,
      pccUploadName,
      emergencyContact,
      status: 'Verified',
      rating: '4.9',
      submittedAt: new Date().toISOString()
    };

    setIsSubmitted(true);
    setTimeout(() => {
      onAddDriver(payload);
    }, 600);
  };

  const handleReset = () => {
    setFullName('');
    setMobileNumber('');
    setDob('');
    setAddress('');
    setPincode('');
    setPassportPhoto('');
    setPhotoFileName('');
    setDlNumber('');
    setDlUploadName('');
    setAadhaarNumber('');
    setAadhaarUploadName('');
    setPanNumber('');
    setPanUploadName('');
    setPccUploadName('');
    setEmergencyContact('');
    setDeclarationChecked(false);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '10px 16px 40px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px 0',
            marginBottom: '10px'
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back to Drivers List
        </button>

        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
          Driver Verification & Registration Form
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Submit your profile, vehicle experience, government IDs, and documents for background verification.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* CARD 1: Personal & Profile Details */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
            Personal & Profile Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Passport Photo Upload & Preview Box */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                width: '120px',
                height: '130px',
                border: '1.5px dashed #cbd5e1',
                borderRadius: '10px',
                background: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', color: '#64748b' }}>
                  <i className="fa-solid fa-camera" style={{ fontSize: '18px' }}></i>
                </div>
                <label style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#1e40af',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Upload style={{ width: '12px', height: '12px' }} />
                  Upload Photo *
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Photo Preview display */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '95px',
                  height: '110px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {passportPhoto ? (
                    <img
                      src={passportPhoto}
                      alt="Uploaded Driver"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '6px' }}>
                      No Photo Selected
                    </span>
                  )}
                </div>
                {photoFileName && (
                  <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                    {photoFileName}
                  </span>
                )}
              </div>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Full Name (as per Govt ID) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Mobile Number (OTP Verified) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                        setIsMobileVerified(e.target.value.trim().length >= 10);
                      }}
                      placeholder="Enter mobile number"
                      style={{ width: '100%', padding: isMobileVerified ? '8px 75px 8px 12px' : '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}
                      required
                    />
                    {isMobileVerified && (
                      <span style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <CheckCircle2 style={{ width: '13px', height: '13px' }} /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Date of Birth <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
                    required
                  />
                  {dob && (
                    <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Age: {new Date().getFullYear() - new Date(dob).getFullYear()} Yrs
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Gender <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#0f172a', background: '#ffffff' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Address & PIN */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Current Living Location / Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter current residential address"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Pincode <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="6-digit pincode"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Driving Experience & Vehicle Eligibility */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
            Driving Experience & Vehicle Eligibility
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr', gap: '24px' }}>
            {/* Which Vehicles Can You Drive? */}
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                Which Vehicles Can You Drive? <span style={{ color: '#ef4444' }}>*</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {/* Row 1 */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: canDriveTwoWheeler ? '#f0fdf4' : '#f8fafc',
                  border: canDriveTwoWheeler ? '1px solid #86efac' : '1px solid #e2e8f0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={canDriveTwoWheeler}
                    onChange={(e) => setCanDriveTwoWheeler(e.target.checked)}
                  />
                  <span>🏍️ Two-Wheeler / Bike</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: canDriveCar ? '#eff6ff' : '#f8fafc',
                  border: canDriveCar ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={canDriveCar}
                    onChange={(e) => setCanDriveCar(e.target.checked)}
                  />
                  <span>🚗 Car / Sedan / SUV</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: canDriveCommercial ? '#eff6ff' : '#f8fafc',
                  border: canDriveCommercial ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={canDriveCommercial}
                    onChange={(e) => setCanDriveCommercial(e.target.checked)}
                  />
                  <span>🚐 Commercial / LCV</span>
                </label>

                {/* Row 2 */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: canDriveEightWheeler ? '#fefce8' : '#f8fafc',
                  border: canDriveEightWheeler ? '1px solid #fef08a' : '1px solid #e2e8f0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={canDriveEightWheeler}
                    onChange={(e) => setCanDriveEightWheeler(e.target.checked)}
                  />
                  <span>🛻 8-Wheeler Trucks</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: canDriveSixWheeler ? '#fefce8' : '#f8fafc',
                  border: canDriveSixWheeler ? '1px solid #fef08a' : '1px solid #e2e8f0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={canDriveSixWheeler}
                    onChange={(e) => setCanDriveSixWheeler(e.target.checked)}
                  />
                  <span>🚛 6-Wheeler Trucks</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: canDriveTenWheeler ? '#fff7ed' : '#f8fafc',
                  border: canDriveTenWheeler ? '1px solid #fed7aa' : '1px solid #e2e8f0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={canDriveTenWheeler}
                    onChange={(e) => setCanDriveTenWheeler(e.target.checked)}
                  />
                  <span>🚚 10-Wheeler Trucks</span>
                </label>

                {/* Row 3 */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: canDriveTwelveWheeler ? '#fff7ed' : '#f8fafc',
                  border: canDriveTwelveWheeler ? '1px solid #fed7aa' : '1px solid #e2e8f0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={canDriveTwelveWheeler}
                    onChange={(e) => setCanDriveTwelveWheeler(e.target.checked)}
                  />
                  <span>🚛 12-Wheeler / Multi-Axle Trucks</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: canDriveShip ? '#f0fdfa' : '#f8fafc',
                  border: canDriveShip ? '1px solid #99f6e4' : '1px solid #e2e8f0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={canDriveShip}
                    onChange={(e) => setCanDriveShip(e.target.checked)}
                  />
                  <span>🚢 Ship / Maritime Vessel</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: canDriveFlight ? '#faf5ff' : '#f8fafc',
                  border: canDriveFlight ? '1px solid #e9d5ff' : '1px solid #e2e8f0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={canDriveFlight}
                    onChange={(e) => setCanDriveFlight(e.target.checked)}
                  />
                  <span>✈️ Flight / Aircraft</span>
                </label>
              </div>
            </div>

            {/* Ineligible Vehicles & Driving Experience */}
            <div>




              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Driving Experience
                </label>
                <input
                  type="text"
                  value={drivingExperienceYears ? `Driving Experience: ${drivingExperienceYears} Years` : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setDrivingExperienceYears(val);
                  }}
                  placeholder="e.g. 5 Years"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: '#ffffff', color: '#0f172a' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Government ID & Verifications (KYC) */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
            Government ID & Verifications (KYC)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* DL + Aadhaar + PAN */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {/* Driving License */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Driving License (DL) Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={dlNumber}
                    onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
                    placeholder="Enter DL number"
                    style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
                    required
                  />
                  <label style={{
                    padding: '8px 10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: dlUploadName ? '#2563eb' : '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    <FileText style={{ width: '13px', height: '13px', color: dlUploadName ? '#ef4444' : '#94a3b8' }} />
                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dlUploadName || 'Upload DL'}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleDocumentSelect(setDlUploadName)}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {dlNumber && (
                  <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', display: 'block' }}>Valid Till: 2032</span>
                )}
              </div>

              {/* Aadhaar */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Aadhaar Card Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="Enter 12-digit Aadhaar"
                    style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
                    required
                  />
                  <label style={{
                    padding: '8px 10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: aadhaarUploadName ? '#059669' : '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    <CheckCircle2 style={{ width: '13px', height: '13px', color: aadhaarUploadName ? '#10b981' : '#94a3b8' }} />
                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{aadhaarUploadName || 'Upload Aadhaar'}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleDocumentSelect(setAadhaarUploadName)}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* PAN Card */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  PAN Card Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="Enter 10-digit PAN"
                    style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
                    required
                  />
                  <label style={{
                    padding: '8px 10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: panUploadName ? '#059669' : '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    <CheckCircle2 style={{ width: '13px', height: '13px', color: panUploadName ? '#10b981' : '#94a3b8' }} />
                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{panUploadName || 'Upload PAN'}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleDocumentSelect(setPanUploadName)}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* PCC & Emergency Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Police Clearance Certificate / Criminal Record Check
                </label>
                <label style={{
                  padding: '9px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: pccUploadName ? '#334155' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <FileText style={{ width: '15px', height: '15px', color: pccUploadName ? '#ef4444' : '#94a3b8' }} />
                  <span>{pccUploadName || 'Upload PCC Document (.pdf)'}</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleDocumentSelect(setPccUploadName)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Emergency Contact Name & Relation
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Suresh Kumar (Brother) - 98765 43211"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Declaration & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#475569', cursor: 'pointer', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={declarationChecked}
              onChange={(e) => setDeclarationChecked(e.target.checked)}
              required
            />
            <span>I declare that all information, DL, Aadhaar, and PAN provided are genuine and true. I authorize background verification.</span>
          </label>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              Cancel / Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitted}
              style={{
                background: isSubmitted ? '#10b981' : '#2563eb',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
              }}
            >
              <ShieldCheck style={{ width: '16px', height: '16px' }} />
              {isSubmitted ? 'Application Submitted!' : 'Submit Application for Verification'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
