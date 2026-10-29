import React, { useState } from 'react';
import './MotorsMarketplace.css';

const DEFAULT_DRIVERS = [
  {
    id: 'DRV-101',
    name: 'Ramesh Kumar',
    phone: '+91 98401 22891',
    email: 'ramesh.k@sartpartner.com',
    license: 'DL-042018009214',
    licenseDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    aadharNumber: 'XXXX-XXXX-4912',
    aadharDoc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    vehicleNumber: 'TN 09 BX 4410',
    exactLocation: 'T. Nagar, Chennai (12.9915° N, 80.2337° E)',
    badge: 'TRANS / HMV',
    experience: '9 Years Heavy Commercial & Cabs',
    pccStatus: 'Verified (Clear Record)',
    medicalFitness: 'Rule 5 / Form 1A Valid',
    rating: '4.9',
    trips: 420,
    languages: 'Tamil, Telugu, English',
    serviceArea: 'Chennai & Tamil Nadu Outstation',
    pricing: {
      fourHours: '₹600',
      eightHours: '₹1,000',
      twelveHours: '₹1,500',
      outstation: '₹1,800 / day',
      nightAllowance: '₹300'
    },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    photosCount: 3,
    isSpecial: true,
    isFavorite: false
  },
  {
    id: 'DRV-102',
    name: 'Anand Sundaram',
    phone: '+91 97902 44109',
    email: 'anand.s@sartpartner.com',
    license: 'DL-072021004128',
    licenseDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    aadharNumber: 'XXXX-XXXX-8823',
    aadharDoc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    vehicleNumber: 'TN 07 CA 9081',
    exactLocation: 'Guindy Industrial Estate, Chennai (13.0067° N, 80.2025° E)',
    badge: 'Hazchem & Premium Luxury Car Pilot',
    experience: '7 Years Luxury Sedan & Petroleum Tanker',
    pccStatus: 'Police Certified (No FIR)',
    medicalFitness: 'Vision & Reflexes Tested',
    rating: '4.8',
    trips: 310,
    languages: 'Tamil, Hindi, English',
    serviceArea: 'Chennai, Bengaluru, Hyderabad',
    pricing: {
      fourHours: '₹700',
      eightHours: '₹1,200',
      twelveHours: '₹1,800',
      outstation: '₹2,200 / day',
      nightAllowance: '₹350'
    },
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    photosCount: 4,
    isSpecial: true,
    isFavorite: true
  },
  {
    id: 'DRV-103',
    name: 'Karthik Raja',
    phone: '+91 94441 55219',
    email: 'karthik.r@sartpartner.com',
    license: 'DL-032022008711',
    licenseDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    aadharNumber: 'XXXX-XXXX-3341',
    aadharDoc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    vehicleNumber: 'TN 22 EZ 5529',
    exactLocation: 'Velachery Bypass Road, Chennai (12.9815° N, 80.2180° E)',
    badge: 'LMV-TR (City Cabs & SUVs)',
    experience: '4 Years City Dispatch & Automatic Transmission',
    pccStatus: 'Verified Clean',
    medicalFitness: 'Certified Fit',
    rating: '4.7',
    trips: 580,
    languages: 'Tamil, Telugu',
    serviceArea: 'Chennai Metropolitan',
    pricing: {
      fourHours: '₹550',
      eightHours: '₹950',
      twelveHours: '₹1,400',
      outstation: '₹1,600 / day',
      nightAllowance: '₹250'
    },
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    status: 'On Active Route',
    photosCount: 2,
    isSpecial: false,
    isFavorite: false
  }
];

export default function HireDrivers({ partnerDetails }) {
  const [activeTab, setActiveTab] = useState('customer_booking_form'); // default to booking form matching user screenshot
  const [viewMode, setViewMode] = useState('row');
  const [driversList, setDriversList] = useState(DEFAULT_DRIVERS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('ALL');
  const [compareItems, setCompareItems] = useState([]);

  // Customer Booking Form for Own Car
  const [customerBooking, setCustomerBooking] = useState({
    vehicleCategory: 'Car / Sedan',
    serviceType: '8 Hours',
    pickupLocation: 'Chennai Central',
    destination: 'OMR Sholinganallur',
    bookingDate: new Date().toISOString().split('T')[0],
    pickupTime: '10:00 AM',
    customerName: partnerDetails?.name || '',
    customerMobile: partnerDetails?.mobile || '+91 98765 43210'
  });

  // Confirmed booking state - driver details and assignment ONLY show after user confirms
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Admin Upload Driver Form (Only driver details, DL, Aadhaar, vehicle number, exact location, photos)
  const [uploadDriverForm, setUploadDriverForm] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    licenseDocPreview: '',
    aadharNumber: '',
    aadharDocPreview: '',
    vehicleNumber: '',
    exactLocation: '',
    badge: 'LMV-TR',
    experience: '5 Years',
    languages: 'Tamil, English',
    serviceArea: 'Chennai Metropolitan',
    fourHoursRate: '600',
    eightHoursRate: '1000',
    twelveHoursRate: '1500',
    outstationRate: '1800',
    driverImagePreview: ''
  });

  const handleDriverPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadDriverForm((prev) => ({ ...prev, driverImagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLicenseDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadDriverForm((prev) => ({ ...prev, licenseDocPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadharDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadDriverForm((prev) => ({ ...prev, aadharDocPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdminDriverUpload = (e) => {
    e.preventDefault();
    if (!uploadDriverForm.name || !uploadDriverForm.licenseNumber || !uploadDriverForm.vehicleNumber || !uploadDriverForm.exactLocation) {
      alert('Please fill Driver Name, DL Number, Vehicle Number, and Exact Location.');
      return;
    }

    const newDriver = {
      id: `DRV-${Math.floor(100 + Math.random() * 900)}`,
      name: uploadDriverForm.name,
      phone: uploadDriverForm.phone || '+91 98000 00000',
      email: uploadDriverForm.email || 'driver@sartpartner.com',
      license: uploadDriverForm.licenseNumber,
      licenseDoc: uploadDriverForm.licenseDocPreview || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      aadharNumber: uploadDriverForm.aadharNumber || 'XXXX-XXXX-1234',
      aadharDoc: uploadDriverForm.aadharDocPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      vehicleNumber: uploadDriverForm.vehicleNumber,
      exactLocation: uploadDriverForm.exactLocation,
      badge: uploadDriverForm.badge,
      experience: uploadDriverForm.experience,
      pccStatus: 'Verified (Clear Record)',
      medicalFitness: 'Rule 5 Valid',
      rating: '5.0',
      trips: 0,
      languages: uploadDriverForm.languages,
      serviceArea: uploadDriverForm.serviceArea,
      pricing: {
        fourHours: `₹${uploadDriverForm.fourHoursRate}`,
        eightHours: `₹${uploadDriverForm.eightHoursRate}`,
        twelveHours: `₹${uploadDriverForm.twelveHoursRate}`,
        outstation: `₹${uploadDriverForm.outstationRate} / day`,
        nightAllowance: '₹300'
      },
      image: uploadDriverForm.driverImagePreview || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      status: 'Available',
      photosCount: 3,
      isSpecial: true,
      isFavorite: false
    };

    setDriversList([newDriver, ...driversList]);
    setActiveTab('browse_drivers');
    alert(`Driver ${newDriver.name} with Vehicle ${newDriver.vehicleNumber} and Verified Documents uploaded successfully!`);
  };

  const handleCustomerBookingSubmit = (e) => {
    e.preventDefault();
    if (!customerBooking.pickupLocation) {
      alert('Please enter pickup location');
      return;
    }

    // Select the best available verified driver nearby
    const matchedDriver = driversList.find((d) => d.status === 'Available') || driversList[0];
    const generatedOtp = Math.floor(1000 + Math.random() * 9000);

    setConfirmedBooking({
      driver: matchedDriver,
      bookingDetails: { ...customerBooking },
      otp: generatedOtp,
      bookingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmed & En Route'
    });
  };

  const filteredDrivers = driversList.filter((d) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        d.name.toLowerCase().includes(q) ||
        d.license.toLowerCase().includes(q) ||
        d.badge.toLowerCase().includes(q) ||
        d.serviceArea.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedBadge !== 'ALL' && !d.badge.toLowerCase().includes(selectedBadge.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="motors-marketplace-container">
      {/* Breadcrumb Bar */}
      <div className="motors-breadcrumb-bar">
        <span>Home</span>
        <i className="fa-solid fa-chevron-right"></i>
        <span>Driver Hiring Operations</span>
        <i className="fa-solid fa-chevron-right"></i>
        <span className="active">Hire a Driver for Your Own Vehicle</span>
      </div>

      {/* Main Title Row */}
      <div className="motors-main-title-row">
        <div>
          <h1 className="motors-title">
            Verified Captains & Drivers
            <span className="motors-results-count">({filteredDrivers.length} verified drivers)</span>
          </h1>
        </div>

        <div className="motors-toolbar-right">
          {/* Compare Pill */}
          <div className="motors-compare-pill" onClick={() => alert(`Selected drivers: ${compareItems.join(', ') || 'None selected'}`)}>
            <i className="fa-solid fa-code-compare" style={{ color: '#2563eb' }}></i>
            <span>Compare</span>
            <span className="motors-badge-count">{compareItems.length}</span>
          </div>

          {/* View Toggles */}
          <div className="motors-view-toggle">
            <button
              className={`motors-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <i className="fa-solid fa-grip"></i>
            </button>
            <button
              className={`motors-view-btn ${viewMode === 'row' ? 'active' : ''}`}
              onClick={() => setViewMode('row')}
              title="Row View"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'customer_booking_form' ? 'browse_drivers' : 'customer_booking_form')}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 18px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37,99,235,0.25)'
            }}
          >
            <i className="fa-solid fa-calendar-plus"></i>
            Book Driver for Own Vehicle
          </button>
        </div>
      </div>

      {/* Subtabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        {[
          { id: 'browse_drivers', label: 'Verified Drivers', icon: 'fa-user-tie' },
          { id: 'admin_upload_driver', label: 'Add New Driver', icon: 'fa-cloud-arrow-up' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.id ? '#1e293b' : '#f1f5f9',
              color: activeTab === tab.id ? '#ffffff' : '#475569',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          VIEW 1: BROWSE DRIVERS (SPLIT SCREEN)
          ========================================================================= */}
      {activeTab === 'browse_drivers' && (
        <div className="motors-layout-split">
          {/* LEFT FILTER SIDEBAR */}
          <aside className="motors-filter-sidebar">
            <div className="motors-filter-header">
              <h2>Filter Drivers</h2>
              {(selectedBadge !== 'ALL' || searchQuery) && (
                <button
                  className="motors-reset-btn"
                  onClick={() => {
                    setSelectedBadge('ALL');
                    setSearchQuery('');
                  }}
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="motors-search-input-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search driver name, license, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Badges / Licence types */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">Driver Licence Type</div>
              <div className="motors-body-type-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {[
                  { name: 'LMV', label: 'LMV (Cabs/Cars)', icon: 'fa-car' },
                  { name: 'HMV', label: 'HMV (Trucks/Bus)', icon: 'fa-truck' },
                  { name: 'Hazchem', label: 'Hazchem Tanker', icon: 'fa-radiation' },
                  { name: 'TRANS', label: 'Commercial Badge', icon: 'fa-id-badge' }
                ].map((b) => {
                  const isSel = selectedBadge.toLowerCase() === b.name.toLowerCase();
                  return (
                    <div
                      key={b.name}
                      className={`motors-body-type-tile ${isSel ? 'selected' : ''}`}
                      onClick={() => setSelectedBadge(isSel ? 'ALL' : b.name)}
                    >
                      <i className={`fa-solid ${b.icon}`}></i>
                      <span>{b.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verification Features */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">SART Verification Standards</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>100% Police Clearance (PCC)</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Rule 5 / Form 1A Medical Tested</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Trip OTP Verification</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Live GPS Tracking</span>
                </label>
              </div>
            </div>
          </aside>

          {/* RIGHT LISTINGS AREA */}
          <main className="motors-listings-container">
            {/* ROW LAYOUT */}
            {viewMode === 'row' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredDrivers.map((d) => (
                  <article key={d.id} className="motors-card-row">
                    <div className="motors-card-media">
                      <img src={d.image} alt={d.name} className="motors-card-img" />
                      {d.isSpecial && (
                        <div className="motors-badge-special">
                          <i className="fa-solid fa-shield-halved"></i>
                          TOP CAPTAIN
                        </div>
                      )}
                      <div className="motors-badge-photo-count">
                        <i className="fa-solid fa-star" style={{ color: '#f59e0b', marginRight: '4px' }}></i>
                        {d.rating} ({d.trips} trips)
                      </div>
                    </div>

                    <div className="motors-card-content">
                      <div>
                        <div className="motors-card-header-line">
                          <div className="motors-brand-logo-title">
                            <i className="fa-solid fa-user-check" style={{ color: '#2563eb', fontSize: '18px' }}></i>
                            <h3 className="motors-card-title">{d.name}</h3>
                          </div>
                          <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                            {d.license}
                          </span>
                        </div>

                        <div className="motors-price-box">
                          <span className="motors-price-current">{d.pricing.eightHours}</span>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>(8 hrs) • {d.pricing.outstation}</span>
                          <div className="motors-trust-badges">
                            <span className="motors-trust-chip">
                              <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginRight: '4px' }}></i>
                              {d.pccStatus}
                            </span>
                            <span className="motors-trust-chip" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                              {d.badge}
                            </span>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="motors-specs-row">
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-business-time"></i>
                            <span>{d.experience}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-language"></i>
                            <span>{d.languages}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-location-dot"></i>
                            <span>{d.serviceArea}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-heart-pulse"></i>
                            <span>{d.medicalFitness}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="motors-actions-row">
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => {
                            setActiveTab('customer_booking_form');
                            setCustomerBooking({ ...customerBooking, customerName: d.name });
                          }}
                        >
                          <i className="fa-solid fa-calendar-check"></i>
                          Hire for My Own Car
                        </button>
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Direct Line for Captain ${d.name}: ${d.phone}. SART Partner Desk.`)}
                        >
                          <i className="fa-solid fa-phone"></i>
                          Call Captain
                        </button>
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Police Record Dossier: ${d.pccStatus}. Rule 5 Medical Fitness Confirmed.`)}
                        >
                          <i className="fa-solid fa-id-card"></i>
                          PCC Dossier
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* GRID LAYOUT */}
            {viewMode === 'grid' && (
              <div className="motors-grid-container">
                {filteredDrivers.map((d) => (
                  <article key={d.id} className="motors-compact-card">
                    <div className="motors-compact-media">
                      <img src={d.image} alt={d.name} className="motors-card-img" />
                      <div className="motors-badge-photo-count">
                        ★ {d.rating} ({d.trips} trips)
                      </div>
                    </div>
                    <div className="motors-compact-body">
                      <div>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                          {d.name}
                        </h4>
                        <strong style={{ fontSize: '18px', color: '#0f172a', fontWeight: '900' }}>
                          {d.pricing.eightHours} (8 hrs)
                        </strong>
                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.7', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '10px' }}>
                          {d.badge} • {d.experience} • {d.pccStatus}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('customer_booking_form');
                        }}
                        style={{
                          marginTop: '16px',
                          padding: '8px 12px',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          color: '#1d4ed8',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Hire for Own Car
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: CUSTOMER BOOKING FORM – HIRE DRIVER FOR OWN VEHICLE
          ========================================================================= */}
      {activeTab === 'customer_booking_form' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>
              Hire a Driver for Your Own Vehicle
            </h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
              Already own a car, bike, or truck? Book a verified driver by hour, full day, or outstation. Driver arrives at your doorstep with OTP verification.
            </p>
          </div>

          <form onSubmit={handleCustomerBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Vehicle Selection */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                Select Your Vehicle Type *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {[
                  { id: 'Bike', label: 'Two-Wheeler / Bike', icon: 'fa-motorcycle' },
                  { id: 'Car / Sedan', label: 'Car / Sedan', icon: 'fa-car' },
                  { id: 'SUV / MUV', label: 'SUV / MUV', icon: 'fa-truck-monster' },
                  { id: 'Commercial Vehicle', label: 'Commercial / LCV', icon: 'fa-truck' }
                ].map((item) => {
                  const isSel = customerBooking.vehicleCategory === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCustomerBooking({ ...customerBooking, vehicleCategory: item.id })}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: '2px solid',
                        borderColor: isSel ? '#2563eb' : '#e2e8f0',
                        background: isSel ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <i className={`fa-solid ${item.icon}`} style={{ fontSize: '20px', color: isSel ? '#2563eb' : '#64748b', marginBottom: '6px', display: 'block' }}></i>
                      <strong style={{ fontSize: '13.5px', color: isSel ? '#2563eb' : '#1e293b' }}>{item.label}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                Driver Service Duration *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                {[
                  { id: '4 Hours', label: '4 Hours (₹600)' },
                  { id: '8 Hours', label: '8 Hours (₹1,000)' },
                  { id: '12 Hours', label: '12 Hours (₹1,500)' },
                  { id: 'Full Day Outstation', label: 'Outstation (₹1,800/day)' },
                  { id: 'Emergency Driver', label: 'Instant Emergency' }
                ].map((d) => {
                  const isSel = customerBooking.serviceType === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setCustomerBooking({ ...customerBooking, serviceType: d.id })}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1.5px solid',
                        borderColor: isSel ? '#2563eb' : '#e2e8f0',
                        background: isSel ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: isSel ? '#2563eb' : '#334155'
                      }}
                    >
                      {d.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pickup, Drop, Date, Time */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Pickup Address / Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anna Nagar, Chennai"
                  className="b2auth-input"
                  value={customerBooking.pickupLocation}
                  onChange={(e) => setCustomerBooking({ ...customerBooking, pickupLocation: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Destination (Optional if local hourly)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mahabalipuram or Local City"
                  className="b2auth-input"
                  value={customerBooking.destination}
                  onChange={(e) => setCustomerBooking({ ...customerBooking, destination: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Booking Date *
                </label>
                <input
                  type="date"
                  className="b2auth-input"
                  value={customerBooking.bookingDate}
                  onChange={(e) => setCustomerBooking({ ...customerBooking, bookingDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Pickup Time *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  className="b2auth-input"
                  value={customerBooking.pickupTime}
                  onChange={(e) => setCustomerBooking({ ...customerBooking, pickupTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(37,99,235,0.3)'
              }}
            >
              Confirm Driver Booking (OTP Protected)
            </button>
          </form>

          {/* CONFIRMED BOOKING / ASSIGNED DRIVER CARD - ONLY APPEARS AFTER USER CONFIRMS */}
          {confirmedBooking && (
            <div
              style={{
                marginTop: '30px',
                border: '2px solid #22c55e',
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
                padding: '24px',
                boxShadow: '0 10px 25px rgba(34,197,94,0.12)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      background: '#22c55e',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '16px'
                    }}
                  >
                    ✓
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#14532d', fontWeight: '800' }}>
                      Driver Booking Confirmed & Assigned!
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#166534' }}>
                      Driver is dispatched for your vehicle. Present the Start Trip OTP upon driver arrival.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    background: '#dcfce7',
                    border: '1.5px dashed #16a34a',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#166534', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>
                    Start Trip OTP
                  </span>
                  <strong style={{ fontSize: '20px', color: '#14532d', letterSpacing: '3px' }}>
                    {confirmedBooking.otp}
                  </strong>
                </div>
              </div>

              {/* Matched Driver & Trip Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '18px',
                  border: '1px solid #bbf7d0'
                }}
              >
                {/* Driver Info Column */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img
                    src={confirmedBooking.driver.image}
                    alt={confirmedBooking.driver.name}
                    style={{ width: '84px', height: '84px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #22c55e' }}
                  />
                  <div>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '800' }}>
                      ★ {confirmedBooking.driver.rating} VERIFIED CAPTAIN
                    </span>
                    <h4 style={{ margin: '4px 0 2px 0', fontSize: '17px', color: '#0f172a', fontWeight: '800' }}>
                      {confirmedBooking.driver.name}
                    </h4>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                      <i className="fa-solid fa-phone" style={{ color: '#2563eb', marginRight: '5px' }}></i>
                      {confirmedBooking.driver.phone}
                    </div>
                    <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '700' }}>
                      <i className="fa-solid fa-car-side" style={{ marginRight: '5px' }}></i>
                      Assigned Vehicle / Reg: <strong>{confirmedBooking.driver.vehicleNumber}</strong>
                    </div>
                  </div>
                </div>

                {/* Live Location & License */}
                <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>
                    <i className="fa-solid fa-location-crosshairs" style={{ color: '#ef4444', marginRight: '6px' }}></i>
                    Driver Exact Location:
                  </div>
                  <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                    {confirmedBooking.driver.exactLocation}
                  </strong>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    Driving Licence: <strong>{confirmedBooking.driver.license}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    Aadhaar Status: <span style={{ color: '#16a34a', fontWeight: '700' }}>✓ Biometrically Verified</span>
                  </div>
                </div>

                {/* Trip Route Details */}
                <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '16px', background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Trip Route & Schedule
                  </div>
                  <div style={{ fontSize: '13px', color: '#1e293b', marginBottom: '4px' }}>
                    <strong>Pickup:</strong> {confirmedBooking.bookingDetails.pickupLocation}
                  </div>
                  <div style={{ fontSize: '13px', color: '#1e293b', marginBottom: '4px' }}>
                    <strong>Destination:</strong> {confirmedBooking.bookingDetails.destination || 'Local Hourly Dispatch'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: '700' }}>
                    <i className="fa-regular fa-clock" style={{ marginRight: '5px' }}></i>
                    {confirmedBooking.bookingDetails.bookingDate} at {confirmedBooking.bookingDetails.pickupTime} ({confirmedBooking.bookingDetails.serviceType})
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => alert(`Tracking Captain ${confirmedBooking.driver.name} on Live Map: Driver is 6 mins away from ${confirmedBooking.bookingDetails.pickupLocation}.`)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fa-solid fa-map-location-dot" style={{ marginRight: '6px' }}></i>
                  Track Driver Exact Location
                </button>
                <button
                  onClick={() => setConfirmedBooking(null)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Close Summary
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 3: ADMIN UPLOAD DRIVER FORM (ONLY DRIVER DETAILS, DL, AADHAAR, VEHICLE NO, EXACT LOCATION)
          ========================================================================= */}
      {activeTab === 'admin_upload_driver' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>
              Register New Driver
            </h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
              Provide driver details, driving licence document, Aadhaar card document, driver photo, vehicle number, and current exact location.
            </p>
          </div>

          <form onSubmit={handleAdminDriverUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Primary Driver Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Driver Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  className="b2auth-input"
                  value={uploadDriverForm.name}
                  onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Mobile Number (OTP Contact) *
                </label>
                <input
                  type="text"
                  placeholder="+91 98401 22891"
                  className="b2auth-input"
                  value={uploadDriverForm.phone}
                  onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="driver@sartpartner.com"
                  className="b2auth-input"
                  value={uploadDriverForm.email}
                  onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Vehicle Registration Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. TN 09 BX 4410"
                  className="b2auth-input"
                  value={uploadDriverForm.vehicleNumber}
                  onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, vehicleNumber: e.target.value.toUpperCase() })}
                  required
                />
              </div>
            </div>

            {/* Exact Location & Driver Service Area */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Driver Exact Current Location (GPS / Pinpoint Landmark) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. T. Nagar, Panagal Park, Chennai (12.9915° N, 80.2337° E)"
                  className="b2auth-input"
                  value={uploadDriverForm.exactLocation}
                  onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, exactLocation: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Operating City / Service Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chennai Metropolitan Area"
                  className="b2auth-input"
                  value={uploadDriverForm.serviceArea}
                  onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, serviceArea: e.target.value })}
                />
              </div>
            </div>

            {/* Document Uploads Grid: DL, Aadhaar, Profile Photo */}
            <div style={{ background: '#f8fafc', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a', fontWeight: '800' }}>
                Required Verification Documents & Photos *
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                {/* 1. Driver Profile Photo */}
                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                    1. Driver Profile Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDriverPhotoUpload}
                    style={{ marginBottom: '10px', fontSize: '12px' }}
                  />
                  <div style={{ width: '100%', height: '110px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {uploadDriverForm.driverImagePreview ? (
                      <img src={uploadDriverForm.driverImagePreview} alt="Driver" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Driver Photo Preview</span>
                    )}
                  </div>
                </div>

                {/* 2. Driving Licence Document */}
                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                    2. Driving Licence (DL) Image *
                  </label>
                  <input
                    type="text"
                    placeholder="DL Number (e.g. DL-042018009214)"
                    className="b2auth-input"
                    style={{ marginBottom: '8px' }}
                    value={uploadDriverForm.licenseNumber}
                    onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, licenseNumber: e.target.value })}
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLicenseDocUpload}
                    style={{ marginBottom: '10px', fontSize: '12px' }}
                  />
                  <div style={{ width: '100%', height: '110px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {uploadDriverForm.licenseDocPreview ? (
                      <img src={uploadDriverForm.licenseDocPreview} alt="Licence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Licence Document Preview</span>
                    )}
                  </div>
                </div>

                {/* 3. Aadhaar Card Document */}
                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                    3. Aadhaar Card Image *
                  </label>
                  <input
                    type="text"
                    placeholder="Aadhaar No (e.g. 1234-5678-9012)"
                    className="b2auth-input"
                    style={{ marginBottom: '8px' }}
                    value={uploadDriverForm.aadharNumber}
                    onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, aadharNumber: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAadharDocUpload}
                    style={{ marginBottom: '10px', fontSize: '12px' }}
                  />
                  <div style={{ width: '100%', height: '110px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {uploadDriverForm.aadharDocPreview ? (
                      <img src={uploadDriverForm.aadharDocPreview} alt="Aadhaar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Aadhaar Card Preview</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Rates */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', color: '#0f172a' }}>
                Driver Service Rates (₹)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    4 Hours Rate (₹)
                  </label>
                  <input
                    type="number"
                    className="b2auth-input"
                    value={uploadDriverForm.fourHoursRate}
                    onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, fourHoursRate: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    8 Hours Rate (₹)
                  </label>
                  <input
                    type="number"
                    className="b2auth-input"
                    value={uploadDriverForm.eightHoursRate}
                    onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, eightHoursRate: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    12 Hours Rate (₹)
                  </label>
                  <input
                    type="number"
                    className="b2auth-input"
                    value={uploadDriverForm.twelveHoursRate}
                    onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, twelveHoursRate: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Outstation Rate / Day (₹)
                  </label>
                  <input
                    type="number"
                    className="b2auth-input"
                    value={uploadDriverForm.outstationRate}
                    onChange={(e) => setUploadDriverForm({ ...uploadDriverForm, outstationRate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(37,99,235,0.3)'
              }}
            >
              Verify & Add Driver to Pool
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
