import React, { useState } from 'react';
import './MotorsMarketplace.css';

const DEFAULT_CARGO_CONSIGNMENTS = [
  {
    id: 'CRG-8801',
    title: 'Tata Steel Industrial Tubes Consignment',
    category: 'Heavy Multi-Axle Roadway',
    mode: 'Roadways',
    origin: 'Tata Steel Hub, Chennai',
    destination: 'Apex Infrastructure, Bengaluru',
    distance: '348 km',
    gstMode: '18% Forward Charge (With ITC)',
    sacCode: 'SAC 9967 / 9968',
    eWayBill: 'EWB-8821948190',
    sealNo: 'SEAL-TN09-8812',
    rate: '₹1,85,000',
    freightFee: '₹18,500 / trip',
    photosCount: 6,
    isSpecial: true,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    status: 'In Transit • GPS Monitored',
    insurance: 'Marine Open Cargo (18% Covered)',
    driverName: 'Ramesh Kumar (DL-042018009214)'
  },
  {
    id: 'CRG-8802',
    title: 'Apollo Pharma Temperature Controlled Vaccine Consignment',
    category: 'Cold Chain Pharma Express',
    mode: 'Roadways',
    origin: 'Apollo Logistics & Pharma Hub, Chennai',
    destination: 'MedLife Regional Warehousing, Hyderabad',
    distance: '625 km',
    gstMode: '5% RCM (Reverse Charge Mechanism)',
    sacCode: 'SAC 9965 (GTA)',
    eWayBill: 'EWB-9931827401',
    sealNo: 'SEAL-AP21-4409',
    rate: '₹3,40,000',
    freightFee: '₹34,000 / trip',
    photosCount: 5,
    isSpecial: true,
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    status: 'Clean e-POD Signed',
    insurance: 'Loss Shield & Reefer Telematics',
    driverName: 'Anand Sundaram (Hazchem Certified)'
  },
  {
    id: 'CRG-8803',
    title: 'Indian Railways High-Density Parcel Waybill Consignment',
    category: 'Rail Multimodal Freight',
    mode: 'Railways',
    origin: 'Chennai Central Freight Terminal',
    destination: 'Whitefield Container Terminal, Bengaluru',
    distance: '360 km',
    gstMode: '5% GST Rail Freight',
    sacCode: 'SAC 996511',
    eWayBill: 'RR-BLR-004128',
    sealNo: 'SEAL-RL-9921',
    rate: '₹95,000',
    freightFee: '₹8,500 / parcel',
    photosCount: 4,
    isSpecial: false,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    status: 'Rake Loaded & Rolling',
    insurance: 'Railway Carrier Act Covered',
    driverName: 'Railway Guard Escort #441'
  },
  {
    id: 'CRG-8804',
    title: 'Rapid Express Bus Transit Parcel Route (Hub-to-Hub)',
    category: 'Bus Parcel Express',
    mode: 'Bus Transit',
    origin: 'Koyambedu Omni Bus Terminal, Chennai',
    destination: 'Mattuthavani Integrated Bus Terminal, Madurai',
    distance: '460 km',
    gstMode: '18% Courier GST',
    sacCode: 'SAC 996812',
    eWayBill: 'BUS-MD-1192',
    sealNo: 'BARCODE-99021',
    rate: '₹45,000',
    freightFee: '₹3,200 / carton',
    photosCount: 4,
    isSpecial: false,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    status: 'Depot Awaiting Pickup',
    insurance: 'Transit Parcel Tagged',
    driverName: 'RTC Pilot #091'
  }
];

export default function Carrier({ partnerDetails }) {
  const [activeTab, setActiveTab] = useState('browse_cargo'); // 'browse_cargo' | 'upload_cargo' | 'gta_compliance'
  const [viewMode, setViewMode] = useState('row');
  const [cargoList, setCargoList] = useState(DEFAULT_CARGO_CONSIGNMENTS);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [selectedGstMode, setSelectedGstMode] = useState('ALL');
  const [compareItems, setCompareItems] = useState([]);

  // Upload Cargo Form
  const [uploadCargoForm, setUploadCargoForm] = useState({
    title: '',
    mode: 'Roadways',
    origin: 'Chennai Hub',
    destination: 'Bengaluru Logistics Park',
    distance: '350 km',
    declaredValue: '150000',
    freightRate: '15000',
    gstMode: '18% Forward Charge (With ITC)',
    eWayBill: '',
    sealNo: '',
    imageUrl: '',
    imagePreview: ''
  });

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadCargoForm((prev) => ({
          ...prev,
          imagePreview: reader.result,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadCargoSubmit = (e) => {
    e.preventDefault();
    if (!uploadCargoForm.title || !uploadCargoForm.destination) {
      alert('Please enter consignment title and destination.');
      return;
    }

    const newCargo = {
      id: `CRG-${Math.floor(1000 + Math.random() * 9000)}`,
      title: uploadCargoForm.title,
      category: `${uploadCargoForm.mode} Cargo Dispatch`,
      mode: uploadCargoForm.mode,
      origin: uploadCargoForm.origin,
      destination: uploadCargoForm.destination,
      distance: uploadCargoForm.distance || '300 km',
      gstMode: uploadCargoForm.gstMode,
      sacCode: uploadCargoForm.gstMode.includes('18%') ? 'SAC 9967 (Forward)' : 'SAC 9965 (GTA RCM)',
      eWayBill: uploadCargoForm.eWayBill || `EWB-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      sealNo: uploadCargoForm.sealNo || `SEAL-${Math.floor(1000 + Math.random() * 9000)}`,
      rate: `₹${uploadCargoForm.declaredValue}`,
      freightFee: `₹${uploadCargoForm.freightRate} / trip`,
      photosCount: 5,
      isSpecial: true,
      isFavorite: false,
      image: uploadCargoForm.imagePreview || uploadCargoForm.imageUrl || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      status: 'Dispatch Scheduled • E-Way Bill Active',
      insurance: 'Marine Open Cargo Insured',
      driverName: partnerDetails?.name || 'Verified Captain Assigned'
    };

    setCargoList([newCargo, ...cargoList]);
    setActiveTab('browse_cargo');
    alert(`Cargo Consignment "${newCargo.title}" successfully dispatched to Marketplace!`);
  };

  const filteredCargo = cargoList.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.origin.toLowerCase().includes(q) ||
        c.destination.toLowerCase().includes(q) ||
        c.eWayBill.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedMode !== 'ALL' && c.mode.toLowerCase() !== selectedMode.toLowerCase()) {
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
        <span>GTA & Cargo Operations</span>
        <i className="fa-solid fa-chevron-right"></i>
        <span className="active">Freight & Parcel Dispatches</span>
      </div>

      {/* Main Title Row */}
      <div className="motors-main-title-row">
        <div>
          <h1 className="motors-title">
            Cargo & freight dispatches
            <span className="motors-results-count">({filteredCargo.length} active consignments)</span>
          </h1>
        </div>

        <div className="motors-toolbar-right">
          {/* Compare Pill */}
          <div className="motors-compare-pill" onClick={() => alert(`Comparing: ${compareItems.join(', ') || 'No cargo consignments selected.'}`)}>
            <i className="fa-solid fa-code-compare" style={{ color: '#2563eb' }}></i>
            <span>Compare</span>
            <span className="motors-badge-count">{compareItems.length}</span>
          </div>

          {/* View Toggles */}


          <button
            onClick={() => setActiveTab(activeTab === 'upload_cargo' ? 'browse_cargo' : 'upload_cargo')}
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
            <i className={`fa-solid ${activeTab === 'upload_cargo' ? 'fa-list' : 'fa-plus'}`}></i>
            {activeTab === 'upload_cargo' ? 'View Dispatches' : '+ Upload consignment'}
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        {[
          { id: 'browse_cargo', label: 'Freight & Cargo Marketplace', icon: 'fa-truck-moving' },
          { id: 'upload_cargo', label: 'Upload New Consignment & E-Way Bill', icon: 'fa-cloud-arrow-up' },
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
          VIEW 1: BROWSE CARGO MARKETPLACE (SPLIT VIEW)
          ========================================================================= */}
      {activeTab === 'browse_cargo' && (
        <div className="motors-layout-split">
          {/* LEFT FILTER SIDEBAR */}
          <aside className="motors-filter-sidebar">
            <div className="motors-filter-header">
              <h2>Filter Cargo</h2>
              {(selectedMode !== 'ALL' || searchQuery) && (
                <button
                  className="motors-reset-btn"
                  onClick={() => {
                    setSelectedMode('ALL');
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
                placeholder="Search cargo, origin, E-Way Bill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Transport Modes */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">Transport Mode</div>
              <div className="motors-body-type-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                  { name: 'Roadways', label: 'Road Freight', icon: 'fa-truck' },
                  { name: 'Railways', label: 'Rail Parcel', icon: 'fa-train' },
                  { name: 'Bus Transit', label: 'Bus Transit', icon: 'fa-bus' }
                ].map((m) => {
                  const isSel = selectedMode.toLowerCase() === m.name.toLowerCase();
                  return (
                    <div
                      key={m.name}
                      className={`motors-body-type-tile ${isSel ? 'selected' : ''}`}
                      onClick={() => setSelectedMode(isSel ? 'ALL' : m.name)}
                    >
                      <i className={`fa-solid ${m.icon}`}></i>
                      <span>{m.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Statutory Features */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">GTA Statutory Compliance</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Carriage by Road Act 2007</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Marine Open Cargo Insurance</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Numbered Tamper Bolt Seals</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Digital e-POD Signature Ready</span>
                </label>
              </div>
            </div>
          </aside>

          {/* RIGHT LISTINGS AREA */}
          <main className="motors-listings-container">
            {/* ROW LAYOUT */}
            {viewMode === 'row' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredCargo.map((c) => (
                  <article key={c.id} className="motors-card-row">
                    <div className="motors-card-media">
                      <img src={c.image} alt={c.title} className="motors-card-img" />
                      {c.isSpecial && (
                        <div className="motors-badge-special">
                          <i className="fa-solid fa-truck-fast"></i>
                          PRIORITY CARGO
                        </div>
                      )}
                      <div className="motors-badge-photo-count">
                        <i className="fa-regular fa-image"></i>
                        1/{c.photosCount || 5}
                      </div>
                    </div>

                    <div className="motors-card-content">
                      <div>
                        <div className="motors-card-header-line">
                          <div className="motors-brand-logo-title">
                            <i className="fa-solid fa-boxes-packing" style={{ color: '#2563eb', fontSize: '20px' }}></i>
                            <h3 className="motors-card-title">{c.title}</h3>
                          </div>
                          <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                            {c.eWayBill}
                          </span>
                        </div>

                        <div className="motors-price-box">
                          <span className="motors-price-current">{c.freightFee}</span>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>(Val: {c.rate})</span>
                          <div className="motors-trust-badges">
                            <span className="motors-trust-chip">
                              <i className="fa-solid fa-lock" style={{ color: '#10b981', marginRight: '4px' }}></i>
                              {c.sealNo}
                            </span>
                            <span className="motors-trust-chip" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                              {c.gstMode}
                            </span>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="motors-specs-row">
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-location-dot"></i>
                            <span>{c.origin}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-flag-checkered"></i>
                            <span>{c.destination}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-route"></i>
                            <span>{c.distance}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-shield-heart"></i>
                            <span>{c.insurance}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="motors-actions-row">
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Tracking GPS telematics for ${c.eWayBill}... Status: ${c.status}`)}
                        >
                          <i className="fa-solid fa-satellite-dish"></i>
                          Live GPS Track
                        </button>
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Bilti / Lorry Receipt for ${c.id}: Generated under Section 10 of Carriage by Road Act 2007.`)}
                        >
                          <i className="fa-solid fa-file-invoice"></i>
                          Lorry Receipt (LR)
                        </button>
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Assigned Driver: ${c.driverName}. Contact: +91 98401 22891.`)}
                        >
                          <i className="fa-solid fa-phone"></i>
                          Contact Driver
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
                {filteredCargo.map((c) => (
                  <article key={c.id} className="motors-compact-card">
                    <div className="motors-compact-media">
                      <img src={c.image} alt={c.title} className="motors-card-img" />
                      <div className="motors-badge-photo-count">
                        <i className="fa-regular fa-image"></i>
                        1/{c.photosCount || 5}
                      </div>
                    </div>
                    <div className="motors-compact-body">
                      <div>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                          {c.title}
                        </h4>
                        <strong style={{ fontSize: '18px', color: '#0f172a', fontWeight: '900' }}>
                          {c.freightFee}
                        </strong>
                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.7', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '10px' }}>
                          {c.mode} • {c.distance} • {c.gstMode}
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Tracking consignment ${c.eWayBill}...`)}
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
                        Live GPS Track
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
          VIEW 2: UPLOAD CARGO CONSIGNMENT FORM
          ========================================================================= */}
      {activeTab === 'upload_cargo' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>
              Upload New Cargo Consignment & E-Way Bill
            </h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
              Create an official goods transport consignment with freight charges, seal numbers, and statutory GST scheme.
            </p>
          </div>

          <form onSubmit={handleUploadCargoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Consignment Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Industrial Steel Tubes Consignment"
                  className="b2auth-input"
                  value={uploadCargoForm.title}
                  onChange={(e) => setUploadCargoForm({ ...uploadCargoForm, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Transport Mode *
                </label>
                <select
                  className="b2auth-input"
                  value={uploadCargoForm.mode}
                  onChange={(e) => setUploadCargoForm({ ...uploadCargoForm, mode: e.target.value })}
                >
                  <option value="Roadways">Roadways (Heavy Multi-Axle / LCV)</option>
                  <option value="Railways">Indian Railways Freight Parcel</option>
                  <option value="Bus Transit">Bus Transit Parcel Route</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Origin City / Hub *
                </label>
                <input
                  type="text"
                  className="b2auth-input"
                  value={uploadCargoForm.origin}
                  onChange={(e) => setUploadCargoForm({ ...uploadCargoForm, origin: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Destination Hub *
                </label>
                <input
                  type="text"
                  className="b2auth-input"
                  value={uploadCargoForm.destination}
                  onChange={(e) => setUploadCargoForm({ ...uploadCargoForm, destination: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Declared Goods Value (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 185000"
                  className="b2auth-input"
                  value={uploadCargoForm.declaredValue}
                  onChange={(e) => setUploadCargoForm({ ...uploadCargoForm, declaredValue: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Freight Rate (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 18000"
                  className="b2auth-input"
                  value={uploadCargoForm.freightRate}
                  onChange={(e) => setUploadCargoForm({ ...uploadCargoForm, freightRate: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  GST Scheme
                </label>
                <select
                  className="b2auth-input"
                  value={uploadCargoForm.gstMode}
                  onChange={(e) => setUploadCargoForm({ ...uploadCargoForm, gstMode: e.target.value })}
                >
                  <option value="18% Forward Charge (With ITC)">18% Forward Charge (With ITC)</option>
                  <option value="5% RCM (Reverse Charge Mechanism)">5% RCM (Reverse Charge Mechanism)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Tamper Seal Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. SEAL-TN09-8812"
                  className="b2auth-input"
                  value={uploadCargoForm.sealNo}
                  onChange={(e) => setUploadCargoForm({ ...uploadCargoForm, sealNo: e.target.value })}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                Consignment / Truck Cargo Photo *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{
                      padding: '10px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1.5px dashed #cbd5e1',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="url"
                    placeholder="https://example.com/cargo.jpg"
                    className="b2auth-input"
                    value={uploadCargoForm.imageUrl}
                    onChange={(e) => setUploadCargoForm({ ...uploadCargoForm, imageUrl: e.target.value, imagePreview: e.target.value })}
                  />
                </div>

                <div style={{
                  width: '180px',
                  height: '120px',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {uploadCargoForm.imagePreview || uploadCargoForm.imageUrl ? (
                    <img
                      src={uploadCargoForm.imagePreview || uploadCargoForm.imageUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Preview</span>
                  )}
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
              Issue Consignment & Publish to Cargo Marketplace
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: STATUTORY GTA & TAXATION COMPLIANCE
          ========================================================================= */}
      {activeTab === 'gta_compliance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ background: '#ecfdf5', color: '#059669', padding: '6px 12px', borderRadius: '8px', fontWeight: '800', fontSize: '15px' }}>
                5% GST (No ITC)
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>SAC CODE: 9965</span>
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>Reverse Charge Mechanism (RCM)</h3>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
              Corporate consignee pays 5% tax directly under RCM. Transporter does not claim input tax credits on vehicle repairs or fuel.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '6px 12px', borderRadius: '8px', fontWeight: '800', fontSize: '15px' }}>
                18% GST (With ITC)
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>SAC CODE: 9967 / 9968</span>
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>Forward Charge & Courier Parcels</h3>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
              Transport agency collects 18% GST directly and claims 100% Input Tax Credit on vehicle purchases, garage servicing, and tech infrastructure.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
