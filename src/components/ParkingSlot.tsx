import React, { useState } from 'react';
import './MotorsMarketplace.css';

const DEFAULT_PARKING_YARDS = [
  {
    id: 'YARD-01',
    title: 'Chennai Central Logistics Hub - Bay 04',
    category: 'Heavy Truck Staging',
    yardType: 'Truck',
    zone: 'Southern Regional Hub',
    capacity: '120 Bays (18 Available)',
    security: '24/7 CCTV & Armed Guard',
    clearance: 'High Clearance 5.5m',
    detentionFee: '₹1,500 / day',
    rate: '₹400 / day',
    monthlyRate: '₹8,500 / mo',
    photosCount: 6,
    isSpecial: true,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    status: 'Ready for Gate-In',
    sacCode: 'SAC 996743 (18% GST)',
    bayNo: 'BAY-A12'
  },
  {
    id: 'YARD-02',
    title: 'Sriperumbudur Auto-Corridor Industrial Terminal',
    category: 'Hazchem & Tanker Bay',
    yardType: 'Tanker',
    zone: 'Industrial Gateway',
    capacity: '80 Bays (32 Available)',
    security: 'Fire Sprinkler & Flame Detectors',
    clearance: '15m Hazardous Buffer',
    detentionFee: '₹2,500 / day',
    rate: '₹750 / day',
    monthlyRate: '₹15,000 / mo',
    photosCount: 5,
    isSpecial: true,
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    status: 'PESO Safety Approved',
    sacCode: 'SAC 996743 (18% GST)',
    bayNo: 'BAY-H09'
  },
  {
    id: 'YARD-03',
    title: 'Bengaluru Electronic City E-Commerce Staging Yard',
    category: 'Delivery Tempos & LCV',
    yardType: 'Tempo',
    zone: 'Tech Corridor Hub',
    capacity: '200 Bays (45 Available)',
    security: 'ANPR FastTag & Barrier Gates',
    clearance: 'EV Fast Charging Onsite',
    detentionFee: '₹800 / day',
    rate: '₹300 / day',
    monthlyRate: '₹6,000 / mo',
    photosCount: 8,
    isSpecial: false,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
    status: 'Instant FastTag Gate-In',
    sacCode: 'SAC 996743 (18% GST)',
    bayNo: 'BAY-LCV4'
  },
  {
    id: 'YARD-04',
    title: 'Hyderabad Outer Ring Multimodal Transit Terminal',
    category: 'Heavy Multi-Axle Yard',
    yardType: 'Truck',
    zone: 'Cyber Logistics Hub',
    capacity: '150 Bays (22 Available)',
    security: 'Weigh-in-Motion Sensor Integrated',
    clearance: 'Full Container Chassis Bay',
    detentionFee: '₹1,800 / day',
    rate: '₹500 / day',
    monthlyRate: '₹10,500 / mo',
    photosCount: 4,
    isSpecial: true,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1596707328905-2b4ec9701783?auto=format&fit=crop&w=800&q=80',
    status: 'Electronic Gate Active',
    sacCode: 'SAC 996743 (18% GST)',
    bayNo: 'BAY-TX88'
  }
];

export default function ParkingSlot({ partnerDetails }) {
  const [activeTab, setActiveTab] = useState('browse_slots'); // 'browse_slots' | 'upload_slot' | 'active_gate'
  const [viewMode, setViewMode] = useState('row');
  const [parkingYards, setParkingYards] = useState(DEFAULT_PARKING_YARDS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [compareItems, setCompareItems] = useState([]);

  // Gate-In form
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newSlotType, setNewSlotType] = useState('TRUCK');

  // Upload Yard slot form
  const [uploadSlotForm, setUploadSlotForm] = useState({
    title: '',
    yardType: 'Truck',
    zone: partnerDetails?.city || 'Chennai',
    bayNo: '',
    rate: '450',
    monthlyRate: '9000',
    capacity: '50 Bays',
    security: '24/7 CCTV & FastTag Barrier',
    imageUrl: '',
    imagePreview: ''
  });

  // Active Live parked vehicles
  const [activeRoster, setActiveRoster] = useState([
    {
      id: 'SLOT-A01',
      zone: 'Heavy Fleet Staging',
      slotType: 'TRUCK',
      vehicleNo: 'TN 09 BK 8821',
      driverPhone: '+91 98401 22891',
      entryTime: '09:30 AM',
      freeWindowHours: 24,
      detentionStatus: 'Within Free Window',
      demurrageAccrued: '₹0'
    },
    {
      id: 'SLOT-A02',
      zone: 'Heavy Fleet Staging',
      slotType: 'TRUCK',
      vehicleNo: 'KA 01 MJ 3390',
      driverPhone: '+91 99120 44810',
      entryTime: 'Yesterday, 07:00 AM',
      freeWindowHours: 24,
      detentionStatus: 'Detention Active (+8 hrs)',
      demurrageAccrued: '₹1,500'
    },
    {
      id: 'SLOT-B01',
      zone: 'Hazardous Cargo Segregation',
      slotType: 'TANKER',
      vehicleNo: 'MH 12 QW 5501',
      driverPhone: '+91 98200 11982',
      entryTime: '11:15 AM',
      freeWindowHours: 12,
      detentionStatus: 'Within Free Window',
      demurrageAccrued: '₹0'
    }
  ]);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadSlotForm((prev) => ({
          ...prev,
          imagePreview: reader.result,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSlotSubmit = (e) => {
    e.preventDefault();
    if (!uploadSlotForm.title || !uploadSlotForm.bayNo) {
      alert('Please fill title and bay identification number.');
      return;
    }

    const newYard = {
      id: `YARD-${Math.floor(10 + Math.random() * 90)}`,
      title: uploadSlotForm.title,
      category: `${uploadSlotForm.yardType} Staging Terminal`,
      yardType: uploadSlotForm.yardType,
      zone: uploadSlotForm.zone,
      capacity: uploadSlotForm.capacity || '40 Bays',
      security: uploadSlotForm.security || '24/7 Monitored Bay',
      clearance: 'Standard Commercial Clearance',
      detentionFee: '₹1,500 / day',
      rate: `₹${uploadSlotForm.rate} / day`,
      monthlyRate: `₹${uploadSlotForm.monthlyRate} / mo`,
      photosCount: 5,
      isSpecial: true,
      isFavorite: false,
      image: uploadSlotForm.imagePreview || uploadSlotForm.imageUrl || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      status: 'Active Commercial Bay',
      sacCode: 'SAC 996743 (18% GST)',
      bayNo: uploadSlotForm.bayNo
    };

    setParkingYards([newYard, ...parkingYards]);
    setActiveTab('browse_slots');
    alert(`Parking Yard / Bay "${newYard.title}" successfully published to Marketplace!`);
  };

  const handleGateIn = (e) => {
    e.preventDefault();
    if (!newVehiclePlate) {
      alert('Please enter vehicle registration number');
      return;
    }

    const newEntry = {
      id: `SLOT-${String.fromCharCode(65 + Math.floor(Math.random() * 3))}${Math.floor(10 + Math.random() * 80)}`,
      zone: newSlotType === 'TANKER' ? 'Hazardous Cargo Segregation' : newSlotType === 'TRUCK' ? 'Heavy Fleet Staging' : 'Rapid Transit Tempos & LCV',
      slotType: newSlotType,
      vehicleNo: newVehiclePlate.toUpperCase(),
      driverPhone: newDriverPhone || '+91 98000 00000',
      entryTime: 'Just Now',
      freeWindowHours: newSlotType === 'TRUCK' ? 24 : 12,
      detentionStatus: 'Within Free Window',
      demurrageAccrued: '₹0'
    };

    setActiveRoster([newEntry, ...activeRoster]);
    setNewVehiclePlate('');
    setNewDriverPhone('');
    alert(`Gate Pass & Barcode generated for ${newVehiclePlate.toUpperCase()} under SAC 996743 (18% GST)!`);
  };

  const filteredYards = parkingYards.filter((y) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        y.title.toLowerCase().includes(q) ||
        y.bayNo.toLowerCase().includes(q) ||
        y.zone.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedType !== 'ALL' && y.yardType.toLowerCase() !== selectedType.toLowerCase()) {
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
        <span>Yard Infrastructure</span>
        <i className="fa-solid fa-chevron-right"></i>
        <span className="active">Parking & Transit Terminals</span>
      </div>

      {/* Main Title Row */}
      <div className="motors-main-title-row">
        <div>
          <h1 className="motors-title">
            Parking yards & staging bays
            <span className="motors-results-count">({filteredYards.length} terminals)</span>
          </h1>
        </div>

        <div className="motors-toolbar-right">
          {/* Compare Pill */}
          <div className="motors-compare-pill" onClick={() => alert(`Comparing: ${compareItems.join(', ') || 'No bays selected yet.'}`)}>
            <i className="fa-solid fa-code-compare" style={{ color: '#2563eb' }}></i>
            <span>Compare</span>
            <span className="motors-badge-count">{compareItems.length}</span>
          </div>

          {/* View Toggles */}


          <button
            onClick={() => setActiveTab(activeTab === 'upload_slot' ? 'browse_slots' : 'upload_slot')}
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
            <i className={`fa-solid ${activeTab === 'upload_slot' ? 'fa-list' : 'fa-plus'}`}></i>
            {activeTab === 'upload_slot' ? 'View Terminals' : '+ Upload parking bay'}
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        {[
          { id: 'browse_slots', label: 'Commercial Yards & Bays', icon: 'fa-square-parking' },
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
          VIEW 1: BROWSE PARKING TERMINALS (SPLIT VIEW)
          ========================================================================= */}
      {activeTab === 'browse_slots' && (
        <div className="motors-layout-split">
          {/* LEFT FILTER SIDEBAR */}
          <aside className="motors-filter-sidebar">
            <div className="motors-filter-header">
              <h2>Filter Bays</h2>
              {(selectedType !== 'ALL' || searchQuery) && (
                <button
                  className="motors-reset-btn"
                  onClick={() => {
                    setSelectedType('ALL');
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
                placeholder="Search terminal, bay, zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Terminal Types */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">Staging Category</div>
              <div className="motors-body-type-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                  { name: 'Truck', label: 'Heavy Truck', icon: 'fa-truck' },
                  { name: 'Tanker', label: 'Tanker (Hazard)', icon: 'fa-radiation' },
                  { name: 'Tempo', label: 'Tempo / LCV', icon: 'fa-truck-pickup' }
                ].map((t) => {
                  const isSel = selectedType.toLowerCase() === t.name.toLowerCase();
                  return (
                    <div
                      key={t.name}
                      className={`motors-body-type-tile ${isSel ? 'selected' : ''}`}
                      onClick={() => setSelectedType(isSel ? 'ALL' : t.name)}
                    >
                      <i className={`fa-solid ${t.icon}`}></i>
                      <span>{t.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compliance Features */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">Security & Infrastructure</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>24/7 CCTV & Security Barrier</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Weighbridge Slip Automation</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>SAC 996743 (18% GST Compliant)</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Free 24hr Loading Detention</span>
                </label>
              </div>
            </div>
          </aside>

          {/* RIGHT LISTINGS AREA */}
          <main className="motors-listings-container">
            {/* ROW LAYOUT */}
            {viewMode === 'row' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredYards.map((y) => (
                  <article key={y.id} className="motors-card-row">
                    <div className="motors-card-media">
                      <img src={y.image} alt={y.title} className="motors-card-img" />
                      {y.isSpecial && (
                        <div className="motors-badge-special">
                          <i className="fa-solid fa-shield-halved"></i>
                          SECURED YARD
                        </div>
                      )}
                      <div className="motors-badge-photo-count">
                        <i className="fa-regular fa-image"></i>
                        1/{y.photosCount || 5}
                      </div>
                    </div>

                    <div className="motors-card-content">
                      <div>
                        <div className="motors-card-header-line">
                          <div className="motors-brand-logo-title">
                            <i className="fa-solid fa-square-parking" style={{ color: '#2563eb', fontSize: '20px' }}></i>
                            <h3 className="motors-card-title">{y.title}</h3>
                          </div>
                          <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                            {y.bayNo}
                          </span>
                        </div>

                        <div className="motors-price-box">
                          <span className="motors-price-current">{y.rate}</span>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>({y.monthlyRate})</span>
                          <div className="motors-trust-badges">
                            <span className="motors-trust-chip">
                              <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginRight: '4px' }}></i>
                              {y.status}
                            </span>
                            <span className="motors-trust-chip" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                              {y.sacCode}
                            </span>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="motors-specs-row">
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-warehouse"></i>
                            <span>{y.category}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-shield"></i>
                            <span>{y.security}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-truck-ramp-box"></i>
                            <span>{y.capacity}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-clock"></i>
                            <span>24h Free Detention</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="motors-actions-row">
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => {
                            setActiveTab('active_gate');
                            setNewSlotType(y.yardType === 'Tanker' ? 'TANKER' : 'TRUCK');
                          }}
                        >
                          <i className="fa-solid fa-qrcode"></i>
                          Issue Gate Pass
                        </button>
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Yard Management Desk for ${y.title}: +91 98401 22891. Staging ready.`)}
                        >
                          <i className="fa-solid fa-phone"></i>
                          Yard Control Contact
                        </button>
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Detention SLA: 24h free window for loading/unloading. Demurrage rate: ${y.detentionFee}.`)}
                        >
                          <i className="fa-solid fa-file-contract"></i>
                          Detention SLA
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
                {filteredYards.map((y) => (
                  <article key={y.id} className="motors-compact-card">
                    <div className="motors-compact-media">
                      <img src={y.image} alt={y.title} className="motors-card-img" />
                      <div className="motors-badge-photo-count">
                        <i className="fa-regular fa-image"></i>
                        1/{y.photosCount || 5}
                      </div>
                    </div>
                    <div className="motors-compact-body">
                      <div>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                          {y.title}
                        </h4>
                        <strong style={{ fontSize: '18px', color: '#0f172a', fontWeight: '900' }}>
                          {y.rate}
                        </strong>
                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.7', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '10px' }}>
                          {y.category} • {y.capacity} • {y.status}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('active_gate');
                          setNewSlotType(y.yardType === 'Tanker' ? 'TANKER' : 'TRUCK');
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
                        Issue Gate Pass
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
          VIEW 2: UPLOAD PARKING YARD / BAY
          ========================================================================= */}
      {activeTab === 'upload_slot' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>
              Upload Parking Yard & Commercial Staging Bay
            </h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
              List your transport yard, depot, or warehouse bay with camera surveillance, FastTag barrier gate, and detention rules.
            </p>
          </div>

          <form onSubmit={handleUploadSlotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Yard / Facility Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chennai Transit Hub Bay 5"
                  className="b2auth-input"
                  value={uploadSlotForm.title}
                  onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Bay Number / Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BAY-C14"
                  className="b2auth-input"
                  value={uploadSlotForm.bayNo}
                  onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, bayNo: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Staging Category *
                </label>
                <select
                  className="b2auth-input"
                  value={uploadSlotForm.yardType}
                  onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, yardType: e.target.value })}
                >
                  <option value="Truck">Heavy Multi-Axle Truck (24h Free)</option>
                  <option value="Tanker">Chemical & Fuel Tanker (PESO Buffer)</option>
                  <option value="Tempo">Delivery Tempo & LCV (12h Free)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Daily Fee (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 450"
                  className="b2auth-input"
                  value={uploadSlotForm.rate}
                  onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, rate: e.target.value })}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                Yard Facility Photo *
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
                    placeholder="https://example.com/yard.jpg"
                    className="b2auth-input"
                    value={uploadSlotForm.imageUrl}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, imageUrl: e.target.value, imagePreview: e.target.value })}
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
                  {uploadSlotForm.imagePreview || uploadSlotForm.imageUrl ? (
                    <img
                      src={uploadSlotForm.imagePreview || uploadSlotForm.imageUrl}
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
              Publish Yard to Motors Marketplace
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: GATE-IN & DETENTION ROSTER
          ========================================================================= */}
      {activeTab === 'active_gate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', alignItems: 'start' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>
              <i className="fa-solid fa-door-open" style={{ color: '#2563eb', marginRight: '8px' }}></i>
              Issue Digital Gate Slip
            </h3>
            <form onSubmit={handleGateIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Vehicle Plate Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. TN 09 BK 4421"
                  className="b2auth-input"
                  value={newVehiclePlate}
                  onChange={(e) => setNewVehiclePlate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Driver Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  className="b2auth-input"
                  value={newDriverPhone}
                  onChange={(e) => setNewDriverPhone(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Staging Bay Category
                </label>
                <select
                  className="b2auth-input"
                  value={newSlotType}
                  onChange={(e) => setNewSlotType(e.target.value)}
                >
                  <option value="TRUCK">Heavy Commercial Truck (24h Free)</option>
                  <option value="TANKER">Fuel / Chemical Tanker (Hazard Zone)</option>
                  <option value="TEMPO">Delivery Tempo / LCV (12h Free)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Issue Digital Gate Pass (18% GST)
              </button>
            </form>
          </div>

          {/* Active Roster */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Active Yard Staging & Detention Roster</h3>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{activeRoster.length} Slots Occupied</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', color: '#475569' }}>Bay</th>
                    <th style={{ padding: '12px 14px', color: '#475569' }}>Vehicle</th>
                    <th style={{ padding: '12px 14px', color: '#475569' }}>Entry</th>
                    <th style={{ padding: '12px 14px', color: '#475569' }}>Status</th>
                    <th style={{ padding: '12px 14px', color: '#475569' }}>Fee</th>
                    <th style={{ padding: '12px 14px', color: '#475569' }}>Gate Out</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRoster.map((slot) => (
                    <tr key={slot.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px', fontWeight: '700', color: '#2563eb' }}>{slot.id}</td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{slot.vehicleNo}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{slot.driverPhone}</div>
                      </td>
                      <td style={{ padding: '14px', color: '#334155' }}>{slot.entryTime}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          background: slot.detentionStatus.includes('Active') ? '#fef2f2' : '#ecfdf5',
                          color: slot.detentionStatus.includes('Active') ? '#dc2626' : '#059669',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          {slot.detentionStatus}
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontWeight: '700', color: slot.demurrageAccrued !== '₹0' ? '#dc2626' : '#059669' }}>
                        {slot.demurrageAccrued}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <button
                          onClick={() => {
                            setActiveRoster(activeRoster.filter((s) => s.id !== slot.id));
                            alert(`Gate Out cleared for ${slot.vehicleNo}! Total Billed: ${slot.demurrageAccrued} + Base SAC 996743.`);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#f1f5f9',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Clear Bay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
