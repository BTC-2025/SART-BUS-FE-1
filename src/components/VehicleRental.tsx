import React, { useState } from 'react';
import './MotorsMarketplace.css';

const DEFAULT_FLEET = [
  {
    id: 'VH-001',
    title: 'Toyota Alphard',
    category: 'car',
    make: 'Toyota',
    model: 'Alphard Luxury',
    year: '2024',
    transmission: 'Automatic',
    mileage: '210 Km/h',
    fuel: 'Petrol / Hybrid',
    body: 'Minivan',
    condition: 'New',
    originalPrice: '₹3,500/day',
    price: '₹2,800 / day',
    monthlyPrice: '₹38,000 / mo',
    photosCount: 8,
    isSpecial: true,
    isFavorite: true,
    image: '/images/toyota_alphard.png',
    brandLogo: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
    rcStatus: 'Commercial Permit',
    plate: 'MH 01 TA 7007'
  },
  {
    id: 'VH-002',
    title: 'Porsche 911 Carrera',
    category: 'car',
    make: 'Porsche',
    model: '911 Carrera',
    year: '2024',
    transmission: 'Automatic',
    mileage: '410 Km/h',
    fuel: 'Petrol',
    body: 'Sport',
    condition: 'New',
    originalPrice: '₹9,000/day',
    price: '₹7,500 / day',
    monthlyPrice: '₹95,000 / mo',
    photosCount: 10,
    isSpecial: true,
    isFavorite: true,
    image: '/images/porsche_911.png',
    brandLogo: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
    rcStatus: 'Commercial Permit',
    plate: 'MH 01 PC 0911'
  },
  {
    id: 'VH-003',
    title: 'Rolls-Royce Dawn',
    category: 'car',
    make: 'Rolls-Royce',
    model: 'Dawn Convertible',
    year: '2024',
    transmission: 'Automatic',
    mileage: '210 Km/h',
    fuel: 'Petrol',
    body: 'Convertible',
    condition: 'New',
    originalPrice: '₹14,000/day',
    price: '₹11,000 / day',
    monthlyPrice: '₹1,45,000 / mo',
    photosCount: 12,
    isSpecial: true,
    isFavorite: true,
    image: '/images/rolls_royce_dawn.png',
    brandLogo: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
    rcStatus: 'Commercial Permit',
    plate: 'MH 01 RR 0001'
  },
  {
    id: 'VH-101',
    title: 'Yamaha FZ-S FI Hybrid 2024',
    category: 'bike',
    make: 'Yamaha',
    model: 'FZ-S V4',
    year: '2024',
    transmission: 'Manual',
    mileage: '1,200 km',
    fuel: 'Petrol / Hybrid',
    body: 'Bike',
    condition: 'New',
    originalPrice: '₹550/day',
    price: '₹450 / day',
    monthlyPrice: '₹8,500 / mo',
    photosCount: 6,
    isSpecial: true,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    brandLogo: 'https://cdn-icons-png.flaticon.com/128/732/732200.png',
    rcStatus: 'VAHAN Clean',
    plate: 'TN 09 BX 3319'
  },
  {
    id: 'VH-102',
    title: 'Maruti Suzuki Ertiga VXi 2024 (Commercial Fleet)',
    category: 'car',
    make: 'Maruti',
    model: 'Ertiga Commercial',
    year: '2024',
    transmission: 'Automatic',
    mileage: '0 mi',
    fuel: 'CNG / Hybrid',
    body: 'Sedan',
    condition: 'New',
    originalPrice: '₹2,200/day',
    price: '₹1,800 / day',
    monthlyPrice: '₹34,000 / mo',
    photosCount: 5,
    isSpecial: true,
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    brandLogo: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
    rcStatus: 'Commercial Permit',
    plate: 'TN 22 CX 9012'
  },
  {
    id: 'VH-103',
    title: 'Ashok Leyland Dost Plus 1.5T (Cargo Carrier)',
    category: 'truck',
    make: 'Ashok Leyland',
    model: 'Dost Plus',
    year: '2024',
    transmission: 'Manual',
    mileage: '4,500 km',
    fuel: 'Diesel',
    body: 'Pickups',
    condition: 'Certified Used',
    originalPrice: '₹2,600/day',
    price: '₹2,200 / day',
    monthlyPrice: '₹42,000 / mo',
    photosCount: 8,
    isSpecial: true,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    brandLogo: 'https://cdn-icons-png.flaticon.com/128/7543/7543167.png',
    rcStatus: 'Goods Carrier Pass',
    plate: 'TN 09 BK 4421'
  },
  {
    id: 'VH-104',
    title: 'Bajaj RE Compact 4-Stroke (City Auto)',
    category: 'auto',
    make: 'Bajaj',
    model: 'RE Auto',
    year: '2023',
    transmission: 'Manual',
    mileage: '8,200 km',
    fuel: 'CNG / Petrol',
    body: 'Hatchback',
    condition: 'Used',
    originalPrice: '₹950/day',
    price: '₹750 / day',
    monthlyPrice: '₹14,000 / mo',
    photosCount: 4,
    isSpecial: false,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1596707328905-2b4ec9701783?auto=format&fit=crop&w=800&q=80',
    brandLogo: 'https://cdn-icons-png.flaticon.com/128/2972/2972185.png',
    rcStatus: 'Fitness Valid',
    plate: 'TN 07 AQ 8812'
  },
  {
    id: 'VH-105',
    title: 'Tata Ace Gold EV & Diesel Mini Truck',
    category: 'truck',
    make: 'Tata',
    model: 'Ace Gold',
    year: '2024',
    transmission: 'Manual',
    mileage: '120 km',
    fuel: 'Electric (EV)',
    body: 'Minivan',
    condition: 'New',
    originalPrice: '₹1,900/day',
    price: '₹1,500 / day',
    monthlyPrice: '₹29,000 / mo',
    photosCount: 6,
    isSpecial: true,
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    brandLogo: 'https://cdn-icons-png.flaticon.com/128/732/732200.png',
    rcStatus: 'EV Subsidy Approved',
    plate: 'TN 05 DF 1209'
  },
  {
    id: 'VH-106',
    title: 'Honda Activa 6G Premium Fleet Scooter',
    category: 'bike',
    make: 'Honda',
    model: 'Activa 6G',
    year: '2024',
    transmission: 'Automatic',
    mileage: '600 km',
    fuel: 'Petrol',
    body: 'Bike',
    condition: 'New',
    originalPrice: '₹400/day',
    price: '₹320 / day',
    monthlyPrice: '₹6,400 / mo',
    photosCount: 4,
    isSpecial: false,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    brandLogo: 'https://cdn-icons-png.flaticon.com/128/732/732200.png',
    rcStatus: 'Commercial Reg',
    plate: 'TN 10 ER 4481'
  }
];

export default function VehicleRental({ partnerDetails }) {
  const [activeTab, setActiveTab] = useState('browse_rentals'); // 'browse_rentals' | 'upload_vehicle' | 'theft_verification'
  const [viewMode, setViewMode] = useState('row'); // 'row' (Image 1) | 'grid' (Image 2)
  const [fleetVehicles, setFleetVehicles] = useState(DEFAULT_FLEET);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('ALL');
  const [selectedBody, setSelectedBody] = useState('ALL');
  const [selectedCondition, setSelectedCondition] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [compareItems, setCompareItems] = useState([]);

  // Audit inputs
  const [vehicleQuery, setVehicleQuery] = useState('');
  const [chassisInput, setChassisInput] = useState('');
  const [engineInput, setEngineInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  // Upload Form
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'car',
    vehicleBrand: 'Maruti',
    modelName: '',
    manufacturingYear: '2024',
    registrationNumber: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    mileage: '0 mi',
    condition: 'New',
    dailyRentalPrice: '1500',
    monthlyRentalPrice: '28000',
    city: partnerDetails?.city || 'Chennai',
    imageUrl: '',
    imagePreview: ''
  });

  // Handle image upload from file or URL
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadForm((prev) => ({
          ...prev,
          imagePreview: reader.result,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new vehicle
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.registrationNumber || !uploadForm.modelName) {
      alert('Please fill in vehicle model and registration number.');
      return;
    }

    const fallbackImg =
      uploadForm.category === 'bike'
        ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
        : uploadForm.category === 'auto'
          ? 'https://images.unsplash.com/photo-1596707328905-2b4ec9701783?auto=format&fit=crop&w=800&q=80'
          : uploadForm.category === 'truck'
            ? 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

    const newVehicle = {
      id: `VH-${Math.floor(100 + Math.random() * 900)}`,
      title: uploadForm.title || `${uploadForm.vehicleBrand} ${uploadForm.modelName} ${uploadForm.manufacturingYear}`,
      category: uploadForm.category,
      make: uploadForm.vehicleBrand,
      model: uploadForm.modelName,
      year: uploadForm.manufacturingYear,
      transmission: uploadForm.transmission,
      mileage: uploadForm.mileage || '0 mi',
      fuel: uploadForm.fuelType,
      body: uploadForm.bodyType || 'Sedan',
      condition: uploadForm.condition || 'New',
      originalPrice: `₹${Math.round(Number(uploadForm.dailyRentalPrice || 1000) * 1.2)}/day`,
      price: `₹${uploadForm.dailyRentalPrice || '1,000'} / day`,
      monthlyPrice: `₹${uploadForm.monthlyRentalPrice || '20,000'} / mo`,
      photosCount: 5,
      isSpecial: true,
      isFavorite: false,
      image: uploadForm.imagePreview || uploadForm.imageUrl || fallbackImg,
      brandLogo: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
      rcStatus: 'Verified Clear',
      plate: uploadForm.registrationNumber.toUpperCase()
    };

    setFleetVehicles([newVehicle, ...fleetVehicles]);
    setActiveTab('browse_rentals');
    alert(`Vehicle ${newVehicle.plate} (${newVehicle.title}) successfully listed in inventory!`);
  };

  // Run NCRB & VAHAN check
  const handleAuditVehicle = (e) => {
    e.preventDefault();
    if (!vehicleQuery.trim()) {
      alert('Please enter vehicle registration number');
      return;
    }
    const plate = vehicleQuery.trim().toUpperCase();
    const isMockStolen = plate.includes('9999');

    setVerificationResult({
      plate,
      parivahanRcStatus: isMockStolen ? 'BLACKLISTED / UNTRACED' : 'Active (Commercial Goods Carrier)',
      ncrbCriminalDb: isMockStolen ? 'ALERT: Active Stolen Vehicle FIR #441/2025' : 'CLEAN (No Theft Records in NCRB)',
      echallanStatus: isMockStolen ? '2 Unpaid Court Challans Pending' : 'Zero Pending Violations',
      chassisVerification: chassisInput ? 'Factory Stamping Confirmed (No re-welding)' : 'Pending Physical Metal Check',
      engineMatch: engineInput ? 'Engine Number matches VAHAN Master' : 'Pending Crankcase Inspection',
      form35NOC: 'Form 35 Loan Clearance: Verified Clear',
      recommendation: isMockStolen ? 'CRITICAL RISK: DO NOT BUY OR ATTACH' : 'VERIFIED SAFE FOR FLEET LEASE & PURCHASE'
    });
  };

  const toggleFavorite = (id) => {
    setFleetVehicles(
      fleetVehicles.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  const toggleCompare = (id) => {
    if (compareItems.includes(id)) {
      setCompareItems(compareItems.filter((item) => item !== id));
    } else {
      if (compareItems.length >= 4) {
        alert('You can compare maximum 4 vehicles at a time');
        return;
      }
      setCompareItems([...compareItems, id]);
    }
  };

  // Filtering
  const filteredFleet = fleetVehicles.filter((v) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        v.title.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedMake !== 'ALL' && v.make.toLowerCase() !== selectedMake.toLowerCase()) {
      return false;
    }
    if (selectedBody !== 'ALL' && v.body.toLowerCase() !== selectedBody.toLowerCase()) {
      return false;
    }
    if (selectedCondition !== 'ALL' && v.condition.toLowerCase() !== selectedCondition.toLowerCase()) {
      return false;
    }
    return true;
  });

  const makesList = [
    { name: 'BMW', icon: 'fa-car' },
    { name: 'Ferrari', icon: 'fa-gauge-high' },
    { name: 'Toyota', icon: 'fa-car-side' },
    { name: 'Tesla', icon: 'fa-bolt' },
    { name: 'Nissan', icon: 'fa-car' },
    { name: 'Mercedes', icon: 'fa-star' },
    { name: 'Mazda', icon: 'fa-car-rear' },
    { name: 'Yamaha', icon: 'fa-motorcycle' },
    { name: 'Maruti', icon: 'fa-car' },
    { name: 'Tata', icon: 'fa-truck' },
    { name: 'Ashok Leyland', icon: 'fa-truck-moving' },
    { name: 'Bajaj', icon: 'fa-truck-front' }
  ];

  const bodyTypes = [
    { name: 'Sedan', icon: 'fa-car-side' },
    { name: 'Convertible', icon: 'fa-car' },
    { name: 'Coupe', icon: 'fa-car-rear' },
    { name: 'Hatchback', icon: 'fa-car' },
    { name: 'Minivan', icon: 'fa-van-shuttle' },
    { name: 'Pickups', icon: 'fa-truck-pickup' },
    { name: 'Sport Car', icon: 'fa-gauge-simple' },
    { name: 'SUV', icon: 'fa-truck-monster' }
  ];

  return (
    <div className="motors-marketplace-container">
      {/* Breadcrumb Bar */}
      <div className="motors-breadcrumb-bar">
        <span>Home</span>
        <i className="fa-solid fa-chevron-right"></i>
        <span>Fleet & Motors Inventory</span>
        <i className="fa-solid fa-chevron-right"></i>
        <span className="active">Vehicles for Lease & Fleet Operations</span>
      </div>

      {/* Main Title Row */}
      <div className="motors-main-title-row">
        <div>
          <h1 className="motors-title">
            Vehicles for lease & sale
            <span className="motors-results-count">({filteredFleet.length} results)</span>
          </h1>
        </div>

        <div className="motors-toolbar-right">
          {/* Compare Pill */}
          <div className="motors-compare-pill" onClick={() => alert(`Comparing: ${compareItems.join(', ') || 'No vehicles selected yet. Click Compare on any vehicle card.'}`)}>
            <i className="fa-solid fa-code-compare" style={{ color: '#2563eb' }}></i>
            <span>Compare</span>
            <span className="motors-badge-count">{compareItems.length}</span>
          </div>

          {/* Sort Selector */}



          {/* Upload Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'upload_vehicle' ? 'browse_rentals' : 'upload_vehicle')}
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
            <i className={`fa-solid ${activeTab === 'upload_vehicle' ? 'fa-list' : 'fa-plus'}`}></i>
            {activeTab === 'upload_vehicle' ? 'View Inventory' : '+ Add your item'}
          </button>
        </div>
      </div>

      {/* Navigation Subtabs (Browse Fleet, Add Vehicle, NCRB Stolen Check) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        {[
          { id: 'browse_rentals', label: 'Commercial Fleet Inventory', icon: 'fa-car' },
          { id: 'upload_vehicle', label: 'Upload Vehicle (Bikes, Cars, Autos, Trucks)', icon: 'fa-cloud-arrow-up' },
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
          VIEW 1: BROWSE INVENTORY (SPLIT SCREEN FILTER + CARDS)
          ========================================================================= */}
      {activeTab === 'browse_rentals' && (
        <div className="motors-layout-split">
          {/* LEFT FILTER SIDEBAR */}
          <aside className="motors-filter-sidebar">
            <div className="motors-filter-header">
              <h2>Filter</h2>
              {(selectedMake !== 'ALL' || selectedBody !== 'ALL' || selectedCondition !== 'ALL' || searchQuery) && (
                <button
                  className="motors-reset-btn"
                  onClick={() => {
                    setSelectedMake('ALL');
                    setSelectedBody('ALL');
                    setSelectedCondition('ALL');
                    setSearchQuery('');
                  }}
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Keyword Search Input */}
            <div className="motors-search-input-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search vehicle, model, plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Make / Brand Filter Grid */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">
                <span>Make</span>
                {selectedMake !== 'ALL' && (
                  <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }} onClick={() => setSelectedMake('ALL')}>
                    Clear
                  </span>
                )}
              </div>
              <div className="motors-brand-logo-grid">
                {makesList.map((m) => {
                  const isSel = selectedMake.toLowerCase() === m.name.toLowerCase();
                  return (
                    <div
                      key={m.name}
                      className={`motors-brand-tile ${isSel ? 'selected' : ''}`}
                      onClick={() => setSelectedMake(isSel ? 'ALL' : m.name)}
                    >
                      <i className={`fa-solid ${m.icon}`}></i>
                      <span>{m.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Body Type Filter Grid */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">
                <span>Body</span>
                {selectedBody !== 'ALL' && (
                  <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }} onClick={() => setSelectedBody('ALL')}>
                    Clear
                  </span>
                )}
              </div>
              <div className="motors-body-type-grid">
                {bodyTypes.map((b) => {
                  const isSel = selectedBody.toLowerCase() === b.name.toLowerCase();
                  return (
                    <div
                      key={b.name}
                      className={`motors-body-type-tile ${isSel ? 'selected' : ''}`}
                      onClick={() => setSelectedBody(isSel ? 'ALL' : b.name)}
                    >
                      <i className={`fa-solid ${b.icon}`}></i>
                      <span>{b.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Condition Filter */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">
                <span>Condition</span>
                {selectedCondition !== 'ALL' && (
                  <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }} onClick={() => setSelectedCondition('ALL')}>
                    Reset All
                  </span>
                )}
              </div>
              <div className="motors-pill-toggle-group">
                {['ALL', 'New', 'Used', 'Certified Used'].map((c) => (
                  <button
                    key={c}
                    className={`motors-pill-toggle ${selectedCondition === c ? 'selected' : ''}`}
                    onClick={() => setSelectedCondition(c)}
                  >
                    {c === 'ALL' ? 'All Conditions' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">Transmission</div>
              <div className="motors-checkbox-grid">
                {['Automatic', 'Manual'].map((t) => (
                  <label key={t} className="motors-check-label">
                    <input type="checkbox" defaultChecked />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT LISTINGS AREA */}
          <main className="motors-listings-container">
            {/* Active Selected Chips */}
            {(selectedMake !== 'ALL' || selectedBody !== 'ALL' || selectedCondition !== 'ALL') && (
              <div className="motors-active-chips">
                {selectedMake !== 'ALL' && (
                  <span className="motors-filter-chip" onClick={() => setSelectedMake('ALL')}>
                    Make: {selectedMake} <i className="fa-solid fa-xmark"></i>
                  </span>
                )}
                {selectedBody !== 'ALL' && (
                  <span className="motors-filter-chip" onClick={() => setSelectedBody('ALL')}>
                    Body: {selectedBody} <i className="fa-solid fa-xmark"></i>
                  </span>
                )}
                {selectedCondition !== 'ALL' && (
                  <span className="motors-filter-chip" onClick={() => setSelectedCondition('ALL')}>
                    {selectedCondition} <i className="fa-solid fa-xmark"></i>
                  </span>
                )}
                <button
                  className="motors-chip-clear"
                  onClick={() => {
                    setSelectedMake('ALL');
                    setSelectedBody('ALL');
                    setSelectedCondition('ALL');
                  }}
                >
                  Reset all
                </button>
              </div>
            )}

            {/* ROW LAYOUT (MATCHING IMAGE 1) */}
            {viewMode === 'row' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredFleet.map((v) => (
                  <article key={v.id} className="motors-card-row">
                    {/* Media Thumbnail */}
                    <div className="motors-card-media">
                      <img
                        src={v.image}
                        alt={v.title}
                        className="motors-card-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      {v.isSpecial && (
                        <div className="motors-badge-special">
                          <i className="fa-solid fa-fire"></i>
                          SPECIAL
                        </div>
                      )}
                      <button
                        className="motors-badge-fav"
                        onClick={() => toggleFavorite(v.id)}
                        style={{ background: v.isFavorite ? '#ef4444' : '#2563eb' }}
                      >
                        <i className={`fa-solid ${v.isFavorite ? 'fa-heart' : 'fa-heart'}`}></i>
                      </button>
                      <div className="motors-badge-photo-count">
                        <i className="fa-regular fa-image"></i>
                        1/{v.photosCount || 5}
                      </div>
                      <div className="motors-badge-media-type">
                        <i className="fa-solid fa-camera"></i>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="motors-card-content">
                      <div>
                        {/* Title & Brand */}
                        <div className="motors-card-header-line">
                          <div className="motors-brand-logo-title">
                            <i className="fa-solid fa-shield-cat" style={{ color: '#2563eb', fontSize: '18px' }}></i>
                            <h3 className="motors-card-title">{v.title}</h3>
                          </div>
                          <button
                            className="motors-more-menu-btn"
                            onClick={() => {
                              setVehicleQuery(v.plate);
                              setActiveTab('theft_verification');
                            }}
                            title="Run Anti-Theft Audit"
                          >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                          </button>
                        </div>

                        {/* Price & Carfax Trust Badges */}
                        <div className="motors-price-box">
                          {v.originalPrice && <span className="motors-price-original">{v.originalPrice}</span>}
                          <span className="motors-price-current">{v.price}</span>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>({v.monthlyPrice})</span>

                          <div className="motors-trust-badges">
                            <span className="motors-trust-chip">
                              <i className="fa-solid fa-shield-check" style={{ color: '#10b981', marginRight: '4px' }}></i>
                              {v.rcStatus}
                            </span>
                            <span className="motors-trust-chip" style={{ background: '#ecfdf5', color: '#047857' }}>
                              <i className="fa-solid fa-id-card" style={{ marginRight: '4px' }}></i>
                              {v.plate}
                            </span>
                          </div>
                        </div>

                        {/* Specs Row with 5 Badges */}
                        <div className="motors-specs-row">
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-car-side"></i>
                            <span>{v.body || 'Sedan'}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-regular fa-calendar"></i>
                            <span>{v.year}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-gears"></i>
                            <span>{v.transmission || 'Automatic'}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-gauge"></i>
                            <span>{v.mileage || '0 mi'}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-gas-pump"></i>
                            <span>{v.fuel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action CTA Buttons */}
                      <div className="motors-actions-row">
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Scheduling Test Drive inspection for ${v.title} (${v.plate}) at your regional hub.`)}
                        >
                          <i className="fa-solid fa-steering-wheel"></i>
                          Test drive
                        </button>
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Calling SART Fleet Desk for ${v.plate}... Direct Partner Line: +91 98401 22891`)}
                        >
                          <i className="fa-solid fa-phone"></i>
                          Quote by phone
                        </button>
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => {
                            setVehicleQuery(v.plate);
                            setActiveTab('theft_verification');
                          }}
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square"></i>
                          View details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* COMPACT GRID VIEW (MATCHING IMAGE 2) */}
            {viewMode === 'grid' && (
              <div className="motors-grid-container">
                {filteredFleet.map((v) => (
                  <article key={v.id} className="motors-compact-card">
                    {/* Media Thumbnail */}
                    <div className="motors-compact-media">
                      <img
                        src={v.image}
                        alt={v.title}
                        className="motors-card-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      {v.isSpecial && (
                        <div className="motors-badge-special">
                          <i className="fa-solid fa-fire"></i>
                          SPECIAL
                        </div>
                      )}
                      <button
                        className="motors-badge-fav"
                        onClick={() => toggleFavorite(v.id)}
                        style={{ background: v.isFavorite ? '#ef4444' : '#2563eb' }}
                      >
                        <i className={`fa-solid ${v.isFavorite ? 'fa-heart' : 'fa-heart'}`}></i>
                      </button>
                      <div className="motors-badge-photo-count">
                        <i className="fa-regular fa-image"></i>
                        1/{v.photosCount || 5}
                      </div>
                    </div>

                    {/* Compact Card Body */}
                    <div className="motors-compact-body">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                            {v.title}
                          </h4>
                          <button
                            className="motors-more-menu-btn"
                            onClick={() => {
                              setVehicleQuery(v.plate);
                              setActiveTab('theft_verification');
                            }}
                          >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                          </button>
                        </div>

                        <div style={{ margin: '4px 0 12px' }}>
                          {v.originalPrice && (
                            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '13px', marginRight: '8px' }}>
                              {v.originalPrice}
                            </span>
                          )}
                          <strong style={{ fontSize: '18px', color: '#0f172a', fontWeight: '900' }}>
                            {v.price}
                          </strong>
                        </div>

                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.7', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                          {v.body} • {v.year} • {v.transmission} • {v.mileage} • {v.fuel}
                        </div>
                      </div>

                      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => alert(`Booking ${v.title} on lease...`)}
                          style={{
                            flex: 1,
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
                          Book Lease
                        </button>
                        <button
                          onClick={() => toggleCompare(v.id)}
                          style={{
                            padding: '8px 12px',
                            background: compareItems.includes(v.id) ? '#2563eb' : '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            color: compareItems.includes(v.id) ? '#ffffff' : '#475569',
                            fontSize: '12.5px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                          title="Add to compare"
                        >
                          <i className="fa-solid fa-code-compare"></i>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {filteredFleet.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <i className="fa-solid fa-car-side" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '14px' }}></i>
                <h3 style={{ fontSize: '18px', color: '#0f172a', margin: '0 0 6px 0' }}>No vehicles match your active filters</h3>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Try clearing your search query or reset filter options on the left.</p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: UPLOAD VEHICLE (FORM)
          ========================================================================= */}
      {activeTab === 'upload_vehicle' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>
              Upload Vehicle for Rental & Fleet Attachment
            </h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
              Add photos, technical specs, pricing, and registration details. The vehicle will instantly render in the Motors Marketplace layout.
            </p>
          </div>

          <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Category Cards */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                Select Vehicle Category *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                {[
                  { id: 'bike', label: 'Bike / Two-Wheeler', icon: 'fa-motorcycle', desc: 'Bikes, Scooters, EV 2W' },
                  { id: 'auto', label: 'Auto Rickshaw (3W)', icon: 'fa-truck-front', desc: 'Passenger / Cargo 3-Wheeler' },
                  { id: 'car', label: 'Car & Cab', icon: 'fa-car-side', desc: 'Sedan, SUV, Hatchback' },
                  { id: 'truck', label: 'Truck / LCV', icon: 'fa-truck', desc: 'Tempo, Pickup, Heavy Cargo' }
                ].map((item) => {
                  const isCurrent = uploadForm.category === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setUploadForm({ ...uploadForm, category: item.id })}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: '2px solid',
                        borderColor: isCurrent ? '#2563eb' : '#e2e8f0',
                        background: isCurrent ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <i className={`fa-solid ${item.icon}`} style={{ fontSize: '24px', color: isCurrent ? '#2563eb' : '#64748b', marginBottom: '8px', display: 'block' }}></i>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: isCurrent ? '#2563eb' : '#1e293b' }}>{item.label}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Brand, Model, Year, Number */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Make / Brand *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BMW, Ferrari, Toyota, Maruti, Yamaha"
                  className="b2auth-input"
                  value={uploadForm.vehicleBrand}
                  onChange={(e) => setUploadForm({ ...uploadForm, vehicleBrand: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Model Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Urus 2024, M5 F90, Ertiga VXi"
                  className="b2auth-input"
                  value={uploadForm.modelName}
                  onChange={(e) => setUploadForm({ ...uploadForm, modelName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Manufacturing Year *
                </label>
                <input
                  type="number"
                  className="b2auth-input"
                  value={uploadForm.manufacturingYear}
                  onChange={(e) => setUploadForm({ ...uploadForm, manufacturingYear: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Registration Number (Plate) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. TN 09 BK 4421"
                  className="b2auth-input"
                  value={uploadForm.registrationNumber}
                  onChange={(e) => setUploadForm({ ...uploadForm, registrationNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Body, Transmission, Mileage, Fuel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Body Style
                </label>
                <select
                  className="b2auth-input"
                  value={uploadForm.bodyType}
                  onChange={(e) => setUploadForm({ ...uploadForm, bodyType: e.target.value })}
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Minivan">Minivan</option>
                  <option value="Pickups">Pickups</option>
                  <option value="Sport Car">Sport Car</option>
                  <option value="Bike">Bike / 2-Wheeler</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Transmission
                </label>
                <select
                  className="b2auth-input"
                  value={uploadForm.transmission}
                  onChange={(e) => setUploadForm({ ...uploadForm, transmission: e.target.value })}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Fuel Type
                </label>
                <select
                  className="b2auth-input"
                  value={uploadForm.fuelType}
                  onChange={(e) => setUploadForm({ ...uploadForm, fuelType: e.target.value })}
                >
                  <option value="Gasoline">Gasoline / Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric (EV)">Electric (EV)</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Daily Rental (₹)
                </label>
                <input
                  type="number"
                  className="b2auth-input"
                  placeholder="e.g. 1800"
                  value={uploadForm.dailyRentalPrice}
                  onChange={(e) => setUploadForm({ ...uploadForm, dailyRentalPrice: e.target.value })}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                Vehicle Image Photo *
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
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Or enter Image URL:</span>
                  <input
                    type="url"
                    placeholder="https://example.com/car.jpg"
                    className="b2auth-input"
                    value={uploadForm.imageUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value, imagePreview: e.target.value })}
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
                  {uploadForm.imagePreview || uploadForm.imageUrl ? (
                    <img
                      src={uploadForm.imagePreview || uploadForm.imageUrl}
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
              Confirm and Publish to Marketplace Inventory
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: THEFT & VAHAN AUDIT
          ========================================================================= */}
      {activeTab === 'theft_verification' && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
          {/* Audit Query Box */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>
              <i className="fa-solid fa-shield-halved" style={{ color: '#2563eb', marginRight: '8px' }}></i>
              VAHAN & NCRB Theft Screening
            </h3>
            <form onSubmit={handleAuditVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Vehicle Plate Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. TN 09 BK 4421"
                  className="b2auth-input"
                  value={vehicleQuery}
                  onChange={(e) => setVehicleQuery(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Chassis Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MA3EJA01S00129841"
                  className="b2auth-input"
                  value={chassisInput}
                  onChange={(e) => setChassisInput(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Engine Number (Stamped on crankcase)
                </label>
                <input
                  type="text"
                  placeholder="e.g. EG99201481"
                  className="b2auth-input"
                  value={engineInput}
                  onChange={(e) => setEngineInput(e.target.value)}
                />
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
                Run NCRB & VAHAN Background Check
              </button>
            </form>
          </div>

          {/* Audit Results Screen */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>
              Verification Dossier: {verificationResult ? verificationResult.plate : 'Awaiting Plate Number'}
            </h3>

            {verificationResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: verificationResult.recommendation.includes('CRITICAL') ? '#fef2f2' : '#ecfdf5',
                  border: `1.5px solid ${verificationResult.recommendation.includes('CRITICAL') ? '#fecaca' : '#a7f3d0'}`
                }}>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    color: verificationResult.recommendation.includes('CRITICAL') ? '#dc2626' : '#059669'
                  }}>
                    {verificationResult.recommendation}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13.5px' }}>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ color: '#64748b', display: 'block' }}>VAHAN Registration Status</span>
                    <strong style={{ color: '#0f172a' }}>{verificationResult.parivahanRcStatus}</strong>
                  </div>

                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ color: '#64748b', display: 'block' }}>NCRB Stolen Vehicle Database</span>
                    <strong style={{ color: verificationResult.ncrbCriminalDb.includes('CLEAN') ? '#059669' : '#dc2626' }}>
                      {verificationResult.ncrbCriminalDb}
                    </strong>
                  </div>

                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ color: '#64748b', display: 'block' }}>Traffic Police E-Challans</span>
                    <strong style={{ color: '#0f172a' }}>{verificationResult.echallanStatus}</strong>
                  </div>

                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ color: '#64748b', display: 'block' }}>Loan Hypothecation (Bank NOC)</span>
                    <strong style={{ color: '#059669' }}>{verificationResult.form35NOC}</strong>
                  </div>
                </div>

                <div style={{ padding: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '13px', color: '#166534' }}>
                  <i className="fa-solid fa-check-double" style={{ marginRight: '6px' }}></i>
                  Form 29 (Notice of Transfer) and Form 30 (Application for Transfer of Ownership) ready for RTO submission.
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <i className="fa-solid fa-shield-virus" style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}></i>
                <p>Enter vehicle registration plate number on the left to verify stolen records and VAHAN compliance.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
