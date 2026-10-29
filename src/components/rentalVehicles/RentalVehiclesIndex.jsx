import React, { useState } from 'react';
import './rentalVehicles.css';
import AddVehicleModal from './AddVehicleModal';

export default function RentalVehiclesIndex({ partnerDetails, onNavigate, initialAddModalOpen = false }) {
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(initialAddModalOpen);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Cars' | 'Bikes' | 'Available' | 'On Trip'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [allTripToggle, setAllTripToggle] = useState(false);

  // Fleet data with Tata Nexon, Royal Enfield, Swift, etc.
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
    <div className="rental-dashboard-wrapper" style={{ gap: '16px' }}>
      {/* 1. SEARCH & CONTROLS TOOLBAR */}
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

      {/* 2. PILL TABS ROW & TOGGLES */}
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

      {/* 3. VEHICLE CARDS LIST (Tata Nexon, Royal Enfield, Swift) */}
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

      {/* 4. DYNAMIC ADD VEHICLE MODAL (Car / Bike Step 1, 2, 3) */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onAddVehicle={handleAddVehicle}
      />
    </div>
  );
}
