import React, { useState } from 'react';
import './MotorsMarketplace.css';

const DEFAULT_PARKING_YARDS = [
  {
    id: 'YARD-01',
    title: 'Chennai Central Logistics Terminal & Multi-Axle Yard',
    category: 'Heavy Truck Staging',
    yardType: 'Truck',
    zone: 'Southern Regional Hub',
    address: 'Gate 4, Grand Southern Trunk Rd, Chennai',
    pincode: '600003',
    capacity: '120 Bays (18 Available)',
    security: '24/7 CCTV, FastTag Gate & Security Guard',
    clearance: 'High Clearance 5.5m',
    detentionFee: '₹1,500 / day',
    hourlyRate: '₹40 / hr',
    rate: '₹400 / day',
    monthlyRate: '₹8,500 / mo',
    photosCount: 6,
    isSpecial: true,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    insideImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
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
    address: 'SIPCOT Industrial Park, Phase 2, Sriperumbudur',
    pincode: '602105',
    capacity: '80 Bays (32 Available)',
    security: 'Fire Sprinkler & PESO 15m Buffer Clearance',
    clearance: '15m Hazardous Buffer',
    detentionFee: '₹2,500 / day',
    hourlyRate: '₹75 / hr',
    rate: '₹750 / day',
    monthlyRate: '₹15,000 / mo',
    photosCount: 5,
    isSpecial: true,
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    insideImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
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
    address: 'Hosur Main Road, Phase 1, Electronic City, Bengaluru',
    pincode: '560100',
    capacity: '200 Bays (45 Available)',
    security: 'ANPR FastTag, EV Fast Chargers & Barrier',
    clearance: 'EV Fast Charging Onsite',
    detentionFee: '₹800 / day',
    hourlyRate: '₹30 / hr',
    rate: '₹300 / day',
    monthlyRate: '₹6,000 / mo',
    photosCount: 8,
    isSpecial: false,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
    insideImage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
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
    address: 'Exit 12, Outer Ring Road, Gachibowli, Hyderabad',
    pincode: '500032',
    capacity: '150 Bays (22 Available)',
    security: 'Weigh-in-Motion Sensor & ANPR Live Camera',
    clearance: 'Full Container Chassis Bay',
    detentionFee: '₹1,800 / day',
    hourlyRate: '₹50 / hr',
    rate: '₹500 / day',
    monthlyRate: '₹10,500 / mo',
    photosCount: 4,
    isSpecial: true,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    insideImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    status: 'Electronic Gate Active',
    sacCode: 'SAC 996743 (18% GST)',
    bayNo: 'BAY-TX88'
  }
];

export default function ParkingSlot({ partnerDetails }) {
  const [activeTab, setActiveTab] = useState('browse_slots'); // 'browse_slots' | 'upload_slot' | 'active_gate'
  const [viewMode, setViewMode] = useState('grid'); // Default set to 3-column Grid View matching third image!
  const [parkingYards, setParkingYards] = useState(DEFAULT_PARKING_YARDS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [compareItems, setCompareItems] = useState([]);

  // Gate-In form
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newSlotType, setNewSlotType] = useState('TRUCK');

  // Comprehensive Upload Yard slot form with outside & inside images and all pricing tiers
  const [uploadSlotForm, setUploadSlotForm] = useState({
    title: '',
    bayNo: '',
    yardType: 'Truck',
    address: '',
    city: partnerDetails?.city || 'Chennai',
    pincode: '',
    gpsCoordinates: '',
    hourlyRate: '40',
    dailyRate: '450',
    weeklyRate: '2800',
    monthlyRate: '9000',
    detentionFee: '1500',
    capacity: '50 Bays',
    coveredParking: 'Yes',
    cctvSecurity: 'Yes',
    evCharging: 'Yes',
    outsideImageUrl: '',
    outsideImagePreview: '',
    insideImageUrl: '',
    insideImagePreview: ''
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

  // Handle outside image upload
  const handleOutsideImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadSlotForm((prev) => ({
          ...prev,
          outsideImagePreview: reader.result,
          outsideImageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle inside image upload
  const handleInsideImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadSlotForm((prev) => ({
          ...prev,
          insideImagePreview: reader.result,
          insideImageUrl: reader.result
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

    const defaultOutside = 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80';
    const defaultInside = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';

    const newYard = {
      id: `YARD-${Math.floor(10 + Math.random() * 90)}`,
      title: uploadSlotForm.title,
      category: `${uploadSlotForm.yardType} Staging Terminal`,
      yardType: uploadSlotForm.yardType,
      zone: uploadSlotForm.city,
      address: uploadSlotForm.address || `${uploadSlotForm.city} Logistics Gateway`,
      pincode: uploadSlotForm.pincode || '600001',
      capacity: uploadSlotForm.capacity || '50 Bays',
      security: uploadSlotForm.cctvSecurity === 'Yes' ? '24/7 CCTV & Security Barrier' : 'Standard Guarded Terminal',
      clearance: uploadSlotForm.evCharging === 'Yes' ? 'EV Fast Charger Available' : 'Standard Commercial Clearance',
      detentionFee: `₹${uploadSlotForm.detentionFee || 1500} / day`,
      hourlyRate: `₹${uploadSlotForm.hourlyRate || 40} / hr`,
      rate: `₹${uploadSlotForm.dailyRate || 450} / day`,
      monthlyRate: `₹${uploadSlotForm.monthlyRate || 9000} / mo`,
      photosCount: 6,
      isSpecial: true,
      isFavorite: false,
      image: uploadSlotForm.outsideImagePreview || uploadSlotForm.outsideImageUrl || defaultOutside,
      insideImage: uploadSlotForm.insideImagePreview || uploadSlotForm.insideImageUrl || defaultInside,
      status: 'Active Commercial Bay',
      sacCode: 'SAC 996743 (18% GST)',
      bayNo: uploadSlotForm.bayNo.toUpperCase()
    };

    setParkingYards([newYard, ...parkingYards]);
    setActiveTab('browse_slots');
    alert(`Parking Facility "${newYard.title}" with outside & inside images published successfully!`);
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
        y.zone.toLowerCase().includes(q) ||
        (y.address && y.address.toLowerCase().includes(q));
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

          {/* View Toggles (Defaulting to Grid like in third image) */}
          <div className="motors-view-toggle">
            <button
              className={`motors-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View (3-Column)"
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
          { id: 'upload_slot', label: 'Upload Parking Bay / Terminal', icon: 'fa-cloud-arrow-up' },
          { id: 'active_gate', label: 'Gate-In & Detention Roster', icon: 'fa-door-open' }
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
            {/* GRID LAYOUT (MATCHING THIRD IMAGE - 3 COLUMN CLEAN CARDS) */}
            {viewMode === 'grid' && (
              <div className="motors-grid-container">
                {filteredYards.map((y) => (
                  <article key={y.id} className="motors-compact-card">
                    <div className="motors-compact-media">
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
                    <div className="motors-compact-body">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                            {y.title}
                          </h4>
                          <span style={{ background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                            {y.bayNo}
                          </span>
                        </div>

                        <div style={{ margin: '6px 0 10px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <strong style={{ fontSize: '19px', color: '#0f172a', fontWeight: '900' }}>
                            {y.rate}
                          </strong>
                          <span style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: '700' }}>({y.hourlyRate})</span>
                        </div>

                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.7', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                          <div><i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: '#2563eb' }}></i>{y.address}</div>
                          <div><i className="fa-solid fa-shield-halved" style={{ marginRight: '6px', color: '#10b981' }}></i>{y.security}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setActiveTab('active_gate');
                            setNewSlotType(y.yardType === 'Tanker' ? 'TANKER' : 'TRUCK');
                          }}
                          className="motors-action-btn-soft"
                          style={{ flex: 1 }}
                        >
                          <i className="fa-solid fa-qrcode"></i>
                          Live Gate Pass
                        </button>
                        <button
                          onClick={() => alert(`Outside View: ${y.image}\nInside Yard View: ${y.insideImage}\nRates: ${y.hourlyRate} | ${y.rate} | ${y.monthlyRate}`)}
                          className="motors-action-btn-soft"
                          style={{ padding: '8px 12px' }}
                          title="View Outside & Inside Yard Photos"
                        >
                          <i className="fa-solid fa-images"></i>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

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
                          <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: '700' }}>({y.hourlyRate})</span>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>• {y.monthlyRate}</span>
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
                            <i className="fa-solid fa-location-dot"></i>
                            <span>{y.zone}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-shield"></i>
                            <span>{y.security}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-clock"></i>
                            <span>24h Free Window</span>
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
                          onClick={() => alert(`Outside Photo: ${y.image}\nInside Staging Photo: ${y.insideImage}\nHourly: ${y.hourlyRate} | Daily: ${y.rate}`)}
                        >
                          <i className="fa-solid fa-images"></i>
                          View Photos
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: UPLOAD PARKING YARD / BAY (OUTSIDE & INSIDE IMAGES + FULL PRICING)
          ========================================================================= */}
      {activeTab === 'upload_slot' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '28px', borderBottom: '1px solid #e2e8f0', paddingBottom: '18px' }}>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: '800' }}>
              Upload Parking Yard & Commercial Staging Bay
            </h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
              Provide exact facility location address, outside entrance photo, inside parking bay photo, and hourly/daily/monthly pricing tiers.
            </p>
          </div>

          <form onSubmit={handleUploadSlotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Section 1: Facility Information & Bay Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  Yard / Facility Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chennai Central Multimodal Staging Terminal"
                  className="b2auth-input"
                  value={uploadSlotForm.title}
                  onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  Bay Identification Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BAY-A14"
                  className="b2auth-input"
                  value={uploadSlotForm.bayNo}
                  onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, bayNo: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
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
                  <option value="Car / Cab">Car & Taxi Staging Lot</option>
                  <option value="Bike">Two-Wheeler EV Yard</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  Total Bay Capacity
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100 Bays (25 Available)"
                  className="b2auth-input"
                  value={uploadSlotForm.capacity}
                  onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, capacity: e.target.value })}
                />
              </div>
            </div>

            {/* Section 2: Location, Address & City Details */}
            <div style={{ background: '#f8fafc', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                <i className="fa-solid fa-location-dot" style={{ color: '#2563eb', marginRight: '8px' }}></i>
                Parking Location & Geographic Address
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Full Physical Street Address *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gate 4, Outer Ring Expressway Logistics Park"
                    className="b2auth-input"
                    value={uploadSlotForm.address}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, address: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    City / Regional Hub *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai"
                    className="b2auth-input"
                    value={uploadSlotForm.city}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, city: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 600001"
                    className="b2auth-input"
                    value={uploadSlotForm.pincode}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, pincode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Comprehensive Pricing Tiers (Hourly, Daily, Monthly, Detention) */}
            <div style={{ background: '#f0fdf4', padding: '22px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800', color: '#166534' }}>
                <i className="fa-solid fa-indian-rupee-sign" style={{ color: '#16a34a', marginRight: '8px' }}></i>
                Parking Rates & Detention Demurrage Configuration (INR)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#14532d', display: 'block', marginBottom: '4px' }}>
                    Hourly Rate (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 40"
                    className="b2auth-input"
                    value={uploadSlotForm.hourlyRate}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, hourlyRate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#14532d', display: 'block', marginBottom: '4px' }}>
                    Daily Rate (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 450"
                    className="b2auth-input"
                    value={uploadSlotForm.dailyRate}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, dailyRate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#14532d', display: 'block', marginBottom: '4px' }}>
                    Weekly Rate (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2800"
                    className="b2auth-input"
                    value={uploadSlotForm.weeklyRate}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, weeklyRate: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#14532d', display: 'block', marginBottom: '4px' }}>
                    Monthly Lease (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 9000"
                    className="b2auth-input"
                    value={uploadSlotForm.monthlyRate}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, monthlyRate: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#14532d', display: 'block', marginBottom: '4px' }}>
                    Detention Fee (₹/day)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    className="b2auth-input"
                    value={uploadSlotForm.detentionFee}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, detentionFee: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Dual Image Upload – OUTSIDE VIEW & INSIDE YARD VIEW */}
            <div>
              <label style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '14px' }}>
                <i className="fa-solid fa-camera-retro" style={{ color: '#2563eb', marginRight: '8px' }}></i>
                Parking Facility Photos (Outside Entrance + Inside Staging Bays)
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* 1. Outside Image Upload */}
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1.5px dashed #cbd5e1' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b', marginBottom: '6px' }}>
                    1. Outside / Entrance Gate Photo *
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
                    Upload exterior entrance gate photo with signboard and security gate.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleOutsideImageChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      marginBottom: '10px'
                    }}
                  />
                  <input
                    type="url"
                    placeholder="Or paste Outside Photo URL..."
                    className="b2auth-input"
                    value={uploadSlotForm.outsideImageUrl}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, outsideImageUrl: e.target.value, outsideImagePreview: e.target.value })}
                    style={{ marginBottom: '12px' }}
                  />

                  {/* Outside Preview Thumbnail */}
                  <div style={{
                    height: '140px',
                    borderRadius: '10px',
                    background: '#e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {uploadSlotForm.outsideImagePreview || uploadSlotForm.outsideImageUrl ? (
                      <img
                        src={uploadSlotForm.outsideImagePreview || uploadSlotForm.outsideImageUrl}
                        alt="Outside Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '12.5px', textAlign: 'center' }}>
                        <i className="fa-solid fa-door-open" style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }}></i>
                        Outside Gate Preview
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Inside Image Upload */}
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1.5px dashed #cbd5e1' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b', marginBottom: '6px' }}>
                    2. Inside Parking / Bay Photo *
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
                    Upload interior yard photo showing covered parking bays and tarmac markings.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInsideImageChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      marginBottom: '10px'
                    }}
                  />
                  <input
                    type="url"
                    placeholder="Or paste Inside Photo URL..."
                    className="b2auth-input"
                    value={uploadSlotForm.insideImageUrl}
                    onChange={(e) => setUploadSlotForm({ ...uploadSlotForm, insideImageUrl: e.target.value, insideImagePreview: e.target.value })}
                    style={{ marginBottom: '12px' }}
                  />

                  {/* Inside Preview Thumbnail */}
                  <div style={{
                    height: '140px',
                    borderRadius: '10px',
                    background: '#e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {uploadSlotForm.insideImagePreview || uploadSlotForm.insideImageUrl ? (
                      <img
                        src={uploadSlotForm.insideImagePreview || uploadSlotForm.insideImageUrl}
                        alt="Inside Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '12.5px', textAlign: 'center' }}>
                        <i className="fa-solid fa-warehouse" style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }}></i>
                        Inside Staging Bay Preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '10px',
                padding: '16px',
                borderRadius: '12px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: '800',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(37,99,235,0.3)',
                transition: 'all 0.2s'
              }}
            >
              Confirm & Publish Parking Facility to Motors Marketplace
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
