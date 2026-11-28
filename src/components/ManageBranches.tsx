import React, { useState, useEffect } from 'react';
import './ManageBranches.css';

export interface BranchVehicle {
  id: string;
  branchId: string;
  name: string;
  category: string;
  regNumber: string;
  loadCapacity: string;
  rate: string;
  status: 'Available' | 'On Trip' | 'Maintenance';
  image: string;
}

export interface BranchLocation {
  id: string;
  code: string;
  name: string;
  isPrimary: boolean;
  status: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  image: string;
  fleetSummary: string;
}

interface ManageBranchesProps {
  partnerDetails?: any;
  onNavigate?: (tab: string, vehicleSlug?: string | null) => void;
}

const DEFAULT_BRANCHES: BranchLocation[] = [
  {
    id: 'branch-1',
    code: 'BR-01',
    name: 'Main Branch - Chennai',
    isPrimary: true,
    status: 'Active',
    owner: 'Rajesh Kumar',
    email: 'rajesh@sart.com',
    phone: '+91 98401 55555',
    location: '42, Mount Road, Chennai, Tamil Nadu',
    city: 'Chennai',
    image: '/images/branch_chennai.jpg',
    fleetSummary: '12 Vehicles (Auto, Bike, Cab, Trucks)'
  },
  {
    id: 'branch-2',
    code: 'BR-02',
    name: 'Westside Branch - Bengaluru',
    isPrimary: false,
    status: 'Active',
    owner: 'Rajesh Kumar',
    email: 'bengaluru@sart.com',
    phone: '+91 98801 22334',
    location: '104, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka',
    city: 'Bengaluru',
    image: '/images/branch_bengaluru.jpg',
    fleetSummary: '8 Vehicles (Cab, Bike, Cargo)'
  }
];

const DEFAULT_CHENNAI_VEHICLES: BranchVehicle[] = [
  {
    id: 'bv-101',
    branchId: 'branch-1',
    name: 'Tata Ace Gold',
    category: 'Truck',
    regNumber: 'TN-09-BK-1452',
    loadCapacity: '900 kg / 0.9 T',
    rate: '₹850/trip | ₹22/km',
    status: 'Available',
    image: '/images/carrier_icon_truck.png'
  },
  {
    id: 'bv-102',
    branchId: 'branch-1',
    name: 'TVS King Cargo 3-Wheeler',
    category: '3-Wheeler Auto',
    regNumber: 'TN-01-XX-9999',
    loadCapacity: '550 kg / 0.55 T',
    rate: '₹450/trip | ₹16/km',
    status: 'Available',
    image: '/images/auto_rickshaw_3d.png'
  },
  {
    id: 'bv-103',
    branchId: 'branch-1',
    name: 'Mahindra Blazo X 28',
    category: 'Heavy Freight',
    regNumber: 'TN-04-MH-2828',
    loadCapacity: '28 Tonnes',
    rate: '₹9,500/trip | ₹85/km',
    status: 'Available',
    image: '/images/carrier_icon_truck.png'
  },
  {
    id: 'bv-104',
    branchId: 'branch-1',
    name: 'Royal Enfield Classic 350',
    category: 'Express Bike',
    regNumber: 'TN-07-EX-4411',
    loadCapacity: '35 kg Parcel',
    rate: '₹220/trip | ₹12/km',
    status: 'Available',
    image: '/images/blue_bike.png'
  }
];

const DEFAULT_BENGALURU_VEHICLES: BranchVehicle[] = [
  {
    id: 'bv-201',
    branchId: 'branch-2',
    name: 'Toyota Innova Crysta Cab',
    category: 'Passenger Cab',
    regNumber: 'KA-01-CR-8899',
    loadCapacity: '7 Passengers',
    rate: '₹1,800/day | ₹18/km',
    status: 'Available',
    image: '/images/cab_xl.png'
  },
  {
    id: 'bv-202',
    branchId: 'branch-2',
    name: 'Maruti Suzuki Ertiga Tour M',
    category: 'Passenger Cab',
    regNumber: 'KA-03-TC-5521',
    loadCapacity: '6 Passengers',
    rate: '₹1,400/day | ₹15/km',
    status: 'Available',
    image: '/images/cab_sedan.png'
  },
  {
    id: 'bv-203',
    branchId: 'branch-2',
    name: 'Ashok Leyland Dost+',
    category: 'Light Commercial',
    regNumber: 'KA-04-AL-3141',
    loadCapacity: '1.5 Tonnes',
    rate: '₹1,200/trip | ₹28/km',
    status: 'Available',
    image: '/images/carrier_icon_truck.png'
  }
];

export default function ManageBranches({ partnerDetails, onNavigate }: ManageBranchesProps) {
  // 1. Branches list state
  const [branches, setBranches] = useState<BranchLocation[]>(() => {
    try {
      const stored = localStorage.getItem('sart_branches');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return DEFAULT_BRANCHES;
  });

  // 2. Currently Active Branch ID (default: branch-1)
  const [activeBranchId, setActiveBranchId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('sart_active_branch_id');
      if (stored) return stored;
    } catch (e) { }
    return 'branch-1';
  });

  // 3. Separate Branch Vehicles dictionary / list
  const [branchVehicles, setBranchVehicles] = useState<BranchVehicle[]>(() => {
    try {
      const stored = localStorage.getItem('sart_branch_vehicles');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return [...DEFAULT_CHENNAI_VEHICLES, ...DEFAULT_BENGALURU_VEHICLES];
  });

  // UI state for Add Branch Modal (Image 3)
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchLocation, setNewBranchLocation] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [newBranchEmail, setNewBranchEmail] = useState('');
  const [newBranchManager, setNewBranchManager] = useState('');

  // UI state for Add Vehicle to Branch Modal
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState('Truck');
  const [vehicleReg, setVehicleReg] = useState('');
  const [vehicleLoad, setVehicleLoad] = useState('');
  const [vehicleRate, setVehicleRate] = useState('');

  // Success alert state (Image 4)
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Sync branches to localStorage and backend
  useEffect(() => {
    try {
      localStorage.setItem('sart_branches', JSON.stringify(branches));
    } catch (e) { }
  }, [branches]);

  // Sync active branch to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sart_active_branch_id', activeBranchId);
      const activeObj = branches.find(b => b.id === activeBranchId);
      if (activeObj) {
        localStorage.setItem('sart_active_branch', JSON.stringify(activeObj));
      }
    } catch (e) { }
  }, [activeBranchId, branches]);

  // Sync branch vehicles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sart_branch_vehicles', JSON.stringify(branchVehicles));
    } catch (e) { }
  }, [branchVehicles]);

  // Fetch branches from backend if available
  useEffect(() => {
    const fetchBackendBranches = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/business/branches');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.branches) && data.branches.length > 0) {
            setBranches(data.branches);
            if (data.activeBranchId) setActiveBranchId(data.activeBranchId);
          }
        }
      } catch (err) { }
    };
    fetchBackendBranches();
  }, []);

  // Get currently active branch object
  const currentBranch = branches.find(b => b.id === activeBranchId) || branches[0] || DEFAULT_BRANCHES[0];

  // Vehicles for the currently selected active branch
  const activeFleet = branchVehicles.filter(v => v.branchId === currentBranch.id);

  // 1. Handle Add New Branch Submit (Image 3)
  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      alert('Please enter a branch name');
      return;
    }

    const nextIndex = branches.length + 1;
    const branchCode = `BR-0${nextIndex < 10 ? '0' + nextIndex : nextIndex}`;
    const newId = `branch-${Date.now()}`;

    const newBranch: BranchLocation = {
      id: newId,
      code: branchCode,
      name: newBranchName.trim(),
      isPrimary: false,
      status: 'Active',
      owner: newBranchManager.trim() || partnerDetails?.name || 'Rajesh Kumar',
      email: newBranchEmail.trim() || 'branch@sart.com',
      phone: newBranchPhone.trim() || '+91 98401 00000',
      location: newBranchLocation.trim() || 'Branch Commercial Hub',
      city: newBranchCity.trim() || 'City Depot',
      image: '/images/branch_bengaluru.jpg', // fallback storefront image
      fleetSummary: '0 Vehicles'
    };

    const updatedBranches = [...branches, newBranch];
    setBranches(updatedBranches);

    // Save to backend if available
    try {
      await fetch('http://localhost:5000/api/business/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBranch)
      });
    } catch (err) { }

    // Close modal & reset fields
    setIsAddBranchOpen(false);
    setNewBranchName('');
    setNewBranchLocation('');
    setNewBranchCity('');
    setNewBranchPhone('');
    setNewBranchEmail('');
    setNewBranchManager('');

    // Display green Success Banner (Image 4)
    setSuccessBanner(`Success: ${newBranch.name} added successfully!`);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 6000);
  };

  // 2. Handle Switch Branch
  const handleSwitchBranch = async (branchId: string) => {
    setActiveBranchId(branchId);
    const switched = branches.find(b => b.id === branchId);
    if (switched) {
      setSuccessBanner(`Switched active branch to ${switched.name}`);
      setTimeout(() => setSuccessBanner(null), 4000);
    }

    try {
      await fetch(`http://localhost:5000/api/business/branches/${branchId}/activate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) { }
  };

  // 3. Handle Add Vehicle to Selected Branch
  const handleAddVehicleToBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleName.trim()) {
      alert('Please enter vehicle name / model');
      return;
    }

    let defaultImg = '/images/carrier_icon_truck.png';
    if (vehicleCategory.toLowerCase().includes('cab') || vehicleCategory.toLowerCase().includes('car')) {
      defaultImg = '/images/cab_sedan.png';
    } else if (vehicleCategory.toLowerCase().includes('bike')) {
      defaultImg = '/images/blue_bike.png';
    } else if (vehicleCategory.toLowerCase().includes('auto') || vehicleCategory.toLowerCase().includes('3-wheeler')) {
      defaultImg = '/images/auto_rickshaw_3d.png';
    }

    const newVehicle: BranchVehicle = {
      id: `bv-${Date.now()}`,
      branchId: currentBranch.id,
      name: vehicleName.trim(),
      category: vehicleCategory,
      regNumber: vehicleReg.trim() || `TN-0${Math.floor(Math.random() * 9 + 1)}-AB-${Math.floor(Math.random() * 9000 + 1000)}`,
      loadCapacity: vehicleLoad.trim() || '1.2 Tonnes',
      rate: vehicleRate.trim() || '₹950/trip | ₹24/km',
      status: 'Available',
      image: defaultImg
    };

    const updatedVehicles = [newVehicle, ...branchVehicles];
    setBranchVehicles(updatedVehicles);

    // Update branch vehicle count in summary
    const branchCount = updatedVehicles.filter(v => v.branchId === currentBranch.id).length;
    setBranches(prev => prev.map(b => b.id === currentBranch.id ? {
      ...b,
      fleetSummary: `${branchCount} Vehicles (${b.name.includes('Chennai') ? 'Auto, Bike, Cab, Trucks' : 'Fleet Active'})`
    } : b));

    // Post to backend
    try {
      await fetch(`http://localhost:5000/api/business/branches/${currentBranch.id}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle)
      });
    } catch (err) { }

    // Close modal & reset fields
    setIsAddVehicleOpen(false);
    setVehicleName('');
    setVehicleReg('');
    setVehicleLoad('');
    setVehicleRate('');

    setSuccessBanner(`Vehicle "${newVehicle.name}" successfully added to ${currentBranch.name}!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // 4. Remove vehicle from branch
  const handleRemoveVehicle = (vehicleId: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle from this branch?')) {
      const updated = branchVehicles.filter(v => v.id !== vehicleId);
      setBranchVehicles(updated);
      const branchCount = updated.filter(v => v.branchId === currentBranch.id).length;
      setBranches(prev => prev.map(b => b.id === currentBranch.id ? {
        ...b,
        fleetSummary: `${branchCount} Vehicles`
      } : b));
    }
  };

  return (
    <div className="manage-branches-page">
      {/* 1. TOP HEADER & BREADCRUMB (Image 5 & Image 2) */}
      <div className="branches-header-container">
        <div className="branches-title-group">
          <h1>Manage Branches</h1>
          <p>View, manage, and switch between your business branch locations</p>
        </div>

        <button
          type="button"
          className="btn-add-branch"
          onClick={() => setIsAddBranchOpen(true)}
        >
          <i className="fa-solid fa-plus"></i> Add Branch
        </button>
      </div>

      {/* 2. SUCCESS ALERT BANNER (Image 4) */}
      {successBanner && (
        <div className="branch-success-banner">
          <div className="branch-success-content">
            <span className="check-icon">
              <i className="fa-solid fa-check"></i>
            </span>
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            className="btn-close-alert"
            onClick={() => setSuccessBanner(null)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* 3. SECTION BAR (Image 5) */}
      <div className="branches-section-bar">
        Branches ({branches.length} Locations)
      </div>

      {/* 4. BRANCH CARDS GRID (Image 5 & Image 4) */}
      <div className="branches-grid-wrapper">
        <div className="branches-cards-grid">
          {branches.map((b) => {
            const isActive = b.id === activeBranchId;
            const branchVehicleCount = branchVehicles.filter(v => v.branchId === b.id).length;

            return (
              <div
                key={b.id}
                className={`branch-card ${isActive ? 'active-branch' : ''}`}
              >
                <div className="branch-top-row">
                  {/* Storefront Photo (Image 5) */}
                  <div className="branch-img-container">
                    <img
                      src={b.image || '/images/branch_chennai.jpg'}
                      alt={b.name}
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = '/images/branch_chennai.jpg';
                      }}
                    />
                  </div>

                  {/* Branch Details */}
                  <div className="branch-details-area">
                    <div className="branch-title-line">
                      <span className="branch-name-text">{b.name}</span>
                      <span className="branch-code-pill">{b.code}</span>
                      <span className="badge-active-status">
                        ● {b.status || 'Active'}
                      </span>

                      {/* Primary / Main Badge on top right (Image 5) */}
                      {b.isPrimary && (
                        <span className="badge-primary-main">Primary / Main</span>
                      )}
                    </div>

                    <div className="branch-info-list">
                      <div className="branch-info-row">
                        <i className="fa-regular fa-user"></i>
                        <span><strong>Owner:</strong> {b.owner}</span>
                      </div>
                      <div className="branch-info-row">
                        <i className="fa-regular fa-envelope"></i>
                        <span><strong>Email:</strong> {b.email}</span>
                      </div>
                      <div className="branch-info-row">
                        <i className="fa-solid fa-truck"></i>
                        <span><strong>Fleet:</strong> {branchVehicleCount > 0 ? `${branchVehicleCount} Vehicles` : b.fleetSummary}</span>
                      </div>
                      <div className="branch-info-row">
                        <i className="fa-solid fa-location-dot"></i>
                        <span><strong>Location:</strong> {b.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Button (Image 5) */}
                <div className="branch-card-footer">
                  {isActive ? (
                    <button type="button" className="btn-currently-active" disabled>
                      <i className="fa-solid fa-check"></i> Currently Active
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-switch-branch"
                      onClick={() => handleSwitchBranch(b.id)}
                    >
                      Switch to Branch
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SEPARATE FLEET VEHICLES SECTION FOR SELECTED BRANCH */}
      <div className="branch-fleet-section">
        <div className="branch-fleet-header">
          <div className="branch-fleet-title">
            <i className="fa-solid fa-warehouse" style={{ color: '#2563eb', fontSize: '20px' }}></i>
            <h2>Fleet Vehicles for {currentBranch.name}</h2>
            <span className="branch-tag-pill">{currentBranch.code}</span>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
              ({activeFleet.length} Vehicles)
            </span>
          </div>

          <button
            type="button"
            className="btn-add-vehicle-branch"
            onClick={() => setIsAddVehicleOpen(true)}
          >
            <i className="fa-solid fa-plus"></i> Add Vehicle to this Branch
          </button>
        </div>

        {activeFleet.length > 0 ? (
          <div className="branch-vehicles-grid">
            {activeFleet.map((v) => (
              <div key={v.id} className="branch-vehicle-card">
                <button
                  type="button"
                  className="btn-remove-vehicle"
                  title="Remove from branch"
                  onClick={() => handleRemoveVehicle(v.id)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>

                <div className="branch-vehicle-img">
                  <img
                    src={v.image || '/images/carrier_icon_truck.png'}
                    alt={v.name}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = '/images/carrier_icon_truck.png';
                    }}
                  />
                </div>

                <div className="branch-vehicle-info">
                  <h4 className="branch-vehicle-name">{v.name}</h4>
                  <div className="branch-vehicle-reg">{v.regNumber}</div>
                  <div className="branch-vehicle-meta">
                    <span className="vehicle-cat-tag">{v.category}</span>
                    <span><i className="fa-solid fa-weight-hanging" style={{ fontSize: '11px', color: '#64748b' }}></i> {v.loadCapacity}</span>
                    <span className={`vehicle-status-tag ${v.status === 'Available' ? 'available' : 'ontrip'}`}>
                      {v.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 700, marginTop: '6px' }}>
                    {v.rate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-branch-fleet">
            <i className="fa-solid fa-truck-ramp-box"></i>
            <h3>No Vehicles Assigned to {currentBranch.name}</h3>
            <p>You can add commercial logistics freight, rental cars, or delivery bikes specifically for this branch.</p>
            <button
              type="button"
              className="btn-add-branch"
              onClick={() => setIsAddVehicleOpen(true)}
            >
              <i className="fa-solid fa-plus"></i> Add First Vehicle to {currentBranch.code}
            </button>
          </div>
        )}
      </div>

      {/* 6. MODAL: ADD NEW BRANCH (Image 3) */}
      {isAddBranchOpen && (
        <div className="modal-overlay" onClick={() => setIsAddBranchOpen(false)}>
          <div className="branch-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Branch</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddBranchOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateBranch}>
              <div className="modal-body">
                <div className="form-field-group">
                  <label>Branch Name</label>
                  <input
                    type="text"
                    required
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="Downtown East Branch"
                  />
                </div>

                <div className="form-field-group">
                  <label>Location / Address</label>
                  <input
                    type="text"
                    required
                    value={newBranchLocation}
                    onChange={(e) => setNewBranchLocation(e.target.value)}
                    placeholder="456 Commercial Rd, West District"
                  />
                </div>

                <div className="form-field-group">
                  <label>City / State</label>
                  <input
                    type="text"
                    required
                    value={newBranchCity}
                    onChange={(e) => setNewBranchCity(e.target.value)}
                    placeholder="Metro City, West Province"
                  />
                </div>

                <div className="form-field-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={newBranchPhone}
                    onChange={(e) => setNewBranchPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                  />
                </div>

                <div className="form-field-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newBranchEmail}
                    onChange={(e) => setNewBranchEmail(e.target.value)}
                    placeholder="westside@business.com"
                  />
                </div>

                <div className="form-field-group">
                  <label>Manager</label>
                  <input
                    type="text"
                    value={newBranchManager}
                    onChange={(e) => setNewBranchManager(e.target.value)}
                    placeholder="Alex Rivera"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsAddBranchOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Save & Create Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: ADD VEHICLE TO CURRENT BRANCH */}
      {isAddVehicleOpen && (
        <div className="modal-overlay" onClick={() => setIsAddVehicleOpen(false)}>
          <div className="branch-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Vehicle to {currentBranch.name}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddVehicleOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddVehicleToBranch}>
              <div className="modal-body">
                <div className="form-field-group">
                  <label>Branch Assignment</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={`${currentBranch.code} - ${currentBranch.name}`}
                    style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
                  />
                </div>

                <div className="form-field-group">
                  <label>Vehicle Category</label>
                  <select
                    value={vehicleCategory}
                    onChange={(e) => setVehicleCategory(e.target.value)}
                  >
                    <option value="Truck">Heavy Truck (Commercial Logistics)</option>
                    <option value="Light Commercial">Light Commercial / Pickup (Ace / Dost)</option>
                    <option value="3-Wheeler Auto">3-Wheeler Auto Cargo / Delivery</option>
                    <option value="Express Bike">Express Delivery 2-Wheeler</option>
                    <option value="Passenger Cab">Passenger Car / Chauffeur Cab</option>
                    <option value="Freight Container">Container / Maritime / Rail</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Vehicle Name & Model</label>
                  <input
                    type="text"
                    required
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    placeholder="e.g. Tata Ace Gold / Mahindra Blazo X 28"
                  />
                </div>

                <div className="form-field-group">
                  <label>Registration Number (Plate)</label>
                  <input
                    type="text"
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value)}
                    placeholder="e.g. TN-09-BK-1452"
                  />
                </div>

                <div className="form-field-group">
                  <label>Capacity (Payload / Seats)</label>
                  <input
                    type="text"
                    value={vehicleLoad}
                    onChange={(e) => setVehicleLoad(e.target.value)}
                    placeholder="e.g. 900 kg / 0.9 T or 4 Seats"
                  />
                </div>

                <div className="form-field-group">
                  <label>Rate Card</label>
                  <input
                    type="text"
                    value={vehicleRate}
                    onChange={(e) => setVehicleRate(e.target.value)}
                    placeholder="e.g. ₹850/trip | ₹22/km"
                  />
                </div>

                <div className="form-field-group">
                  <label>Base Depot / Hub Location</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={currentBranch.location}
                    style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsAddVehicleOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Save Vehicle to Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
