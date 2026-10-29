import React, { useState } from 'react';
import './rentalVehicles.css';
import AddVehicleModal from './AddVehicleModal';

export default function RentalVehiclesIndex({ partnerDetails, onNavigate }) {
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Cars' | 'Bikes' | 'Available' | 'On Trip'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [allTripToggle, setAllTripToggle] = useState(false);

  // Fleet data with the exact Tata Nexon from user's image, plus Royal Enfield, Swift, etc.
  const [fleetList, setFleetList] = useState([
    {
      id: 'VH-101',
      name: 'TATA NEXON XZ+ (2024)',
      type: 'car',
      category: 'Compact SUV',
      fuel: 'Petrol',
      transmission: 'Manual',
      seats: '5-Seater',
      plate: 'MH 12 AB 1234',
      location: 'Baner, Pune',
      pricingText: '₹150/hr | ₹1,800/day | ₹22,000/month',
      isAvailable: true,
      image: '/images/cab_sedan.png',
      verified: true
    },
    {
      id: 'VH-102',
      name: 'ROYAL ENFIELD CLASSIC 350 (2024)',
      type: 'bike',
      category: 'Cruiser',
      fuel: 'Petrol',
      transmission: 'Manual',
      seats: '2-Seater',
      plate: 'MH 12 CD 5678',
      location: 'Kothrud, Pune',
      pricingText: '₹60/hr | ₹850/day | ₹12,000/month',
      isAvailable: true,
      image: '/images/red_bike_3d.png',
      verified: true
    },
    {
      id: 'VH-103',
      name: 'MARUTI SUZUKI SWIFT ZXI (2024)',
      type: 'car',
      category: 'Hatchback',
      fuel: 'Petrol',
      transmission: 'Automatic',
      seats: '5-Seater',
      plate: 'MH 14 EF 9012',
      location: 'Viman Nagar, Pune',
      pricingText: '₹120/hr | ₹1,500/day | ₹19,000/month',
      isAvailable: false,
      image: '/images/cab_economy.png',
      verified: true
    },
    {
      id: 'VH-104',
      name: 'YAMAHA R15 V4 RACING (2025)',
      type: 'bike',
      category: 'Sports Bike',
      fuel: 'Petrol',
      transmission: 'Manual',
      seats: '2-Seater',
      plate: 'MH 12 GH 3456',
      location: 'Hinjewadi, Pune',
      pricingText: '₹75/hr | ₹1,100/day | ₹16,000/month',
      isAvailable: true,
      image: '/images/blue_bike.png',
      verified: true
    },
    {
      id: 'VH-105',
      name: 'MAHINDRA THAR 4X4 (2024)',
      type: 'car',
      category: 'Full-size SUV',
      fuel: 'Diesel',
      transmission: 'Manual',
      seats: '4-Seater',
      plate: 'MH 12 JK 7890',
      location: 'Wakad, Pune',
      pricingText: '₹250/hr | ₹3,200/day | ₹45,000/month',
      isAvailable: false,
      image: '/images/cab_xl.png',
      verified: true
    },
    {
      id: 'VH-106',
      name: 'OLA S1 PRO ELECTRIC (2024)',
      type: 'bike',
      category: 'Scooter / Moped',
      fuel: 'Electric (EV)',
      transmission: 'Gearless',
      seats: '2-Seater',
      plate: 'MH 12 LM 2345',
      location: 'Koregaon Park, Pune',
      pricingText: '₹40/hr | ₹500/day | ₹7,500/month',
      isAvailable: true,
      image: '/images/red_scooty.png',
      verified: true
    }
  ]);

  const handleAddVehicle = (newVehicle) => {
    const formatted = {
      id: newVehicle.id,
      name: newVehicle.name.toUpperCase(),
      type: newVehicle.type,
      category: newVehicle.category,
      fuel: newVehicle.fuel,
      transmission: newVehicle.transmission,
      seats: newVehicle.seats,
      plate: newVehicle.plate,
      location: newVehicle.location || 'Pune',
      pricingText: `${newVehicle.pricing.hourly} | ${newVehicle.pricing.daily} | ${newVehicle.pricing.monthly}`,
      isAvailable: true,
      image: newVehicle.image,
      verified: true
    };
    setFleetList([formatted, ...fleetList]);
  };

  const toggleAvailability = (id) => {
    setFleetList(fleetList.map(v => v.id === id ? { ...v, isAvailable: !v.isAvailable } : v));
  };

  // Filter logic
  const filteredVehicles = fleetList.filter(item => {
    if (activeFilter === 'Cars' && item.type !== 'car') return false;
    if (activeFilter === 'Bikes' && item.type !== 'bike') return false;
    if (activeFilter === 'Available' && !item.isAvailable) return false;
    if (activeFilter === 'On Trip' && item.isAvailable) return false;

    if (typeFilter !== 'All') {
      if (typeFilter === 'Cars' && item.type !== 'car') return false;
      if (typeFilter === 'Bikes' && item.type !== 'bike') return false;
    }

    if (statusFilter !== 'All') {
      if (statusFilter === 'Available' && !item.isAvailable) return false;
      if (statusFilter === 'On Trip' && item.isAvailable) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = item.name.toLowerCase().includes(q) ||
        item.plate.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const carCount = fleetList.filter(v => v.type === 'car').length;
  const bikeCount = fleetList.filter(v => v.type === 'bike').length;
  const availableCount = fleetList.filter(v => v.isAvailable).length;
  const onTripCount = fleetList.filter(v => !v.isAvailable).length;

  return (
    <div className="rental-dashboard-wrapper">
      {/* 1. TOP METRIC CARDS ROW (Matches User's Dashboard Screenshot) */}
      <div className="rental-metrics-grid">
        {/* Metric 1: Total Revenue */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Revenue</span>
          </div>
          <div className="metric-main-value">₹1,48,500</div>
          <div className="metric-subtext positive">
            <i className="fa-solid fa-arrow-trend-up"></i> Up 12% this month ↗
          </div>
        </div>

        {/* Metric 2: Total Bookings */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Bookings</span>
          </div>
          <div className="metric-main-value">48 Active & Upcoming</div>
          <div className="metric-subtext muted">
            2 Booked today
          </div>
        </div>

        {/* Metric 3: Fleet Utilization */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Fleet Utilization</span>
          </div>
          <div className="metric-main-value">84% Active</div>
          <div className="metric-subtext muted">
            12 of 14 vehicles
          </div>
        </div>

        {/* Metric 4: Trial Status */}
        <div className="metric-card trial-card">
          <div className="metric-header">
            <span className="metric-title">Trial Status</span>
          </div>
          <div className="trial-content-row">
            <div className="trial-text">
              <span className="metric-main-value" style={{ display: 'block', fontSize: '20px' }}>22 Days Left</span>
              <span className="metric-subtext muted">on Free Trial</span>
            </div>
            <button type="button" className="btn-upgrade-pro">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS & CHARTS SECTION */}
      <div className="rental-charts-grid">
        {/* Chart 1: Booking & Sales Trends */}
        <div className="chart-card trends-chart">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Booking & Sales Trends</h3>
              <span className="chart-subtitle">Line & Bar graph</span>
            </div>
            <div className="chart-header-right">
              <div className="chart-legends">
                <span className="legend-item"><span className="legend-dot blue"></span> Revenue (₹)</span>
                <span className="legend-item"><span className="legend-dot yellow"></span> Bookings Count</span>
              </div>
              <select className="chart-period-select" defaultValue="This Month">
                <option value="This Month">This Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Year 2026">Year 2026</option>
              </select>
            </div>
          </div>
          {/* Custom SVG Line Chart */}
          <div className="chart-svg-container">
            <svg viewBox="0 0 500 160" className="chart-svg">
              <line x1="40" y1="130" x2="480" y2="130" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="95" x2="480" y2="95" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="25" x2="480" y2="25" stroke="#f1f5f9" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="5" y="133" fontSize="9" fill="#94a3b8">₹50,000</text>
              <text x="5" y="98" fontSize="9" fill="#94a3b8">₹100,000</text>
              <text x="5" y="63" fontSize="9" fill="#94a3b8">₹150,000</text>
              <text x="5" y="28" fontSize="9" fill="#94a3b8">₹200,000</text>
              <text x="35" y="152" fontSize="9" fill="#94a3b8">₹</text>

              {/* Bar Columns (Yellow/Orange) */}
              <rect x="75" y="115" width="12" height="15" fill="#fde68a" rx="2" />
              <rect x="115" y="105" width="12" height="25" fill="#fde68a" rx="2" />
              <rect x="155" y="95" width="12" height="35" fill="#fde68a" rx="2" />
              <rect x="195" y="100" width="12" height="30" fill="#fde68a" rx="2" />
              <rect x="235" y="90" width="12" height="40" fill="#fde68a" rx="2" />
              <rect x="275" y="85" width="12" height="45" fill="#fde68a" rx="2" />
              <rect x="315" y="70" width="12" height="60" fill="#fde68a" rx="2" />
              <rect x="355" y="55" width="12" height="75" fill="#fde68a" rx="2" />
              <rect x="395" y="65" width="12" height="65" fill="#fde68a" rx="2" />
              <rect x="435" y="50" width="12" height="80" fill="#fde68a" rx="2" />

              {/* Revenue Trend Line (Blue) */}
              <polyline
                fill="none"
                stroke="#1e40af"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="80,120 120,105 160,88 200,102 240,94 280,92 320,68 360,52 400,62 440,40"
              />

              {/* Bookings Trend Line (Gold) */}
              <polyline
                fill="none"
                stroke="#d97706"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="80,128 120,118 160,110 200,114 240,105 280,102 320,78 360,65 400,74 440,54"
              />

              {/* Month X-Labels */}
              <text x="75" y="152" fontSize="9" fill="#94a3b8">Jan</text>
              <text x="115" y="152" fontSize="9" fill="#94a3b8">Feb</text>
              <text x="155" y="152" fontSize="9" fill="#94a3b8">Mar</text>
              <text x="195" y="152" fontSize="9" fill="#94a3b8">Apr</text>
              <text x="235" y="152" fontSize="9" fill="#94a3b8">May</text>
              <text x="275" y="152" fontSize="9" fill="#94a3b8">Jun</text>
              <text x="315" y="152" fontSize="9" fill="#94a3b8">Jul</text>
              <text x="355" y="152" fontSize="9" fill="#94a3b8">Aug</text>
              <text x="395" y="152" fontSize="9" fill="#94a3b8">Sep</text>
              <text x="435" y="152" fontSize="9" fill="#94a3b8">Oct</text>

              {/* Right Y-Axis */}
              <text x="465" y="55" fontSize="9" fill="#94a3b8">400</text>
              <text x="465" y="85" fontSize="9" fill="#94a3b8">30</text>
              <text x="465" y="105" fontSize="9" fill="#94a3b8">20</text>
              <text x="465" y="125" fontSize="9" fill="#94a3b8">10</text>
              <text x="465" y="145" fontSize="9" fill="#94a3b8">0</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Revenue by Vehicle Type (Donut) */}
        <div className="chart-card donut-chart-card">
          <h3 className="chart-title">Revenue by Vehicle Type</h3>
          <div className="donut-wrapper">
            <svg viewBox="0 0 100 100" className="donut-svg">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="16" />
              {/* Cars: 68% -> circumference = 238.7, 68% = 162.3 */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#2563eb"
                strokeWidth="16"
                strokeDasharray="162.3 238.7"
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              {/* Bikes: 32% -> 32% = 76.4 */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="16"
                strokeDasharray="76.4 238.7"
                strokeDashoffset="-162.3"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <div className="donut-legends">
            <span className="legend-item"><span className="legend-dot blue"></span> Cars (68%)</span>
            <span className="legend-item"><span className="legend-dot yellow"></span> Bikes (32%)</span>
          </div>
        </div>

        {/* Chart 3: Popular Models Rank */}
        <div className="chart-card rank-chart-card">
          <h3 className="chart-title">Popular Models</h3>
          <span className="chart-subtitle">Quick bar rank</span>

          <div className="rank-bars-list">
            <div className="rank-row">
              <span className="rank-label">Tata Nexon</span>
              <div className="rank-bar-bg">
                <div className="rank-bar-fill blue" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="rank-row">
              <span className="rank-label">RE Classic 350</span>
              <div className="rank-bar-bg">
                <div className="rank-bar-fill yellow" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div className="rank-row">
              <span className="rank-label">Maruti Swift</span>
              <div className="rank-bar-bg">
                <div className="rank-bar-fill blue" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="rank-scale-nums">
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & CONTROLS TOOLBAR */}
      <div className="rental-controls-bar">
        <div className="controls-left">
          <div className="search-input-wrapper">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search [Q ...]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="dropdown-filter">
            <span>Type: </span>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Cars">Cars</option>
              <option value="Bikes">Bikes</option>
            </select>
          </div>

          <div className="dropdown-filter">
            <span>Status: </span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
            </select>
          </div>
        </div>

        <div className="controls-right">
          <button
            type="button"
            className="btn-add-vehicle-main"
            onClick={() => setIsAddVehicleOpen(true)}
          >
            <i className="fa-solid fa-plus"></i> Add New Vehicle
          </button>
        </div>
      </div>

      {/* 4. PILL TABS ROW & TOGGLES */}
      <div className="rental-filter-pills-row">
        <div className="pills-group">
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All ({fleetList.length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'Cars' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Cars')}
          >
            Cars ({carCount})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'Bikes' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Bikes')}
          >
            Bikes ({bikeCount})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'Available' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Available')}
          >
            Available ({availableCount})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'On Trip' ? 'active' : ''}`}
            onClick={() => setActiveFilter('On Trip')}
          >
            On Trip ({onTripCount})
          </button>
        </div>

        <div className="right-toggle-group">
          <span className="toggle-label">All Trip ({onTripCount})</span>
          <label className="simple-switch">
            <input
              type="checkbox"
              checked={allTripToggle}
              onChange={(e) => {
                setAllTripToggle(e.target.checked);
                if (e.target.checked) setActiveFilter('On Trip');
                else setActiveFilter('All');
              }}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* 5. VEHICLE CARDS LIST (Exactly like Tata Nexon XZ+ in User's Screenshot) */}
      <div className="fleet-cards-container">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="fleet-listing-card">
            {/* Left: Vehicle Image */}
            <div className="fleet-card-img-col">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="fleet-vehicle-thumbnail"
                onError={(e) => {
                  e.target.src = vehicle.type === 'car' ? '/images/cab_sedan.png' : '/images/red_bike_3d.png';
                }}
              />
            </div>

            {/* Middle: Specs & Identity */}
            <div className="fleet-card-info-col">
              <div className="fleet-title-row">
                <i className={`fa-solid ${vehicle.type === 'car' ? 'fa-car-side' : 'fa-motorcycle'} vehicle-type-icon`}></i>
                <h4 className="fleet-vehicle-name">{vehicle.name}</h4>
                {vehicle.verified && (
                  <i className="fa-solid fa-circle-check verified-badge" title="RC & Documents Verified"></i>
                )}
              </div>

              <div className="fleet-specs-line">
                <span>{vehicle.category}</span> • <span>{vehicle.fuel}</span> • <span>{vehicle.transmission}</span> • <span>{vehicle.seats}</span>
              </div>

              <div className="fleet-meta-details">
                <div><strong>Reg No:</strong> {vehicle.plate}</div>
                <div><strong>Location:</strong> {vehicle.location}</div>
              </div>
            </div>

            {/* Right: Pricing, Status Switch & Actions */}
            <div className="fleet-card-actions-col">
              <div className="fleet-pricing-area">
                <span className="pricing-title-label">Pricing:</span>
                <span className="pricing-values-label">{vehicle.pricingText}</span>
              </div>

              <div className="fleet-status-switch-row">
                <span className={`status-text-pill ${vehicle.isAvailable ? 'available' : 'on-trip'}`}>
                  ● {vehicle.isAvailable ? 'Available' : 'On Trip'}
                </span>
                <label className="simple-switch">
                  <input
                    type="checkbox"
                    checked={vehicle.isAvailable}
                    onChange={() => toggleAvailability(vehicle.id)}
                  />
                  <span className="slider round green"></span>
                </label>
              </div>

              <div className="fleet-card-btn-strip">
                <button type="button" className="action-pill-btn">
                  <i className="fa-solid fa-file-lines"></i> Docs: Verified
                </button>
                <button type="button" className="action-pill-btn">
                  <i className="fa-solid fa-calendar-days"></i> Calendar
                </button>
                <button type="button" className="action-pill-btn" onClick={() => setIsAddVehicleOpen(true)}>
                  <i className="fa-solid fa-pen"></i> Edit Specs
                </button>
                <button type="button" className="action-pill-btn">
                  <i className="fa-solid fa-chart-column"></i> View Bookings
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredVehicles.length === 0 && (
          <div className="no-vehicles-empty">
            <i className="fa-solid fa-car-rear empty-icon"></i>
            <h4>No vehicles found matching criteria</h4>
            <button type="button" className="btn-add-vehicle-main" onClick={() => setIsAddVehicleOpen(true)}>
              <i className="fa-solid fa-plus"></i> Add New Vehicle
            </button>
          </div>
        )}
      </div>

      {/* 6. ADD VEHICLE MODAL (Dynamic Car / Bike Step 1, 2, 3) */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onAddVehicle={handleAddVehicle}
      />
    </div>
  );
}
