import React, { useState, useEffect } from 'react';
import './Carrier.css';
import './MotorsMarketplace.css';
import RentalFilterSidebar from './rentalVehicles/RentalFilterSidebar';
import './rentalVehicles/rentalVehicles.css';
import './rentalVehicles/OwnerVehicleGrid.css';
// @ts-ignore
import CarrierAddNewVehicle from './CarrierAddNewVehicle';

const CARRIER_CATEGORIES = [
  { id: 'All', label: 'All Fleet', icon: 'fa-table-cells' },
  { id: 'truck', label: 'Heavy Trucks (Road)', icon: 'fa-truck' },
  { id: 'train', label: 'Rail Cargo (Rakes)', icon: 'fa-train' },
  { id: 'flight', label: 'Air Cargo (Freighters)', icon: 'fa-plane' },
  { id: 'ship', label: 'Maritime (Container)', icon: 'fa-ship' },
  { id: 'bike', label: 'Express Delivery (Bikes)', icon: 'fa-motorcycle' }
];

const MODE_ICON_MAP: Record<string, string> = {
  truck: '/images/carrier_mode_truck.png',
  train: '/images/carrier_mode_train.jpg',
  flight: '/images/carrier_mode_flight.png',
  ship: '/images/carrier_mode_ship.png',
  bike: '/images/carrier_mode_bike.png'
};

export const DEFAULT_OWNER_FLEET: any[] = [];

export default function Carrier({ partnerDetails, onNavigate = () => { }, urlSubPath = null }: any) {
  const [fleets, setFleets] = useState<any[]>(DEFAULT_OWNER_FLEET);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSideFilters, setActiveSideFilters] = useState<any>(null);

  // Edit vehicle state (when active, renders CarrierAddNewVehicle in edit mode)
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);

  const handleStartEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
  };

  // Load carrier vehicles from Backend API (port 3005) with localStorage sync/fallback
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:3005/api/carriers');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.vehicles)) {
            setFleets(data.vehicles);
            try {
              localStorage.setItem('logi_pulse_vehicles', JSON.stringify(data.vehicles));
            } catch (e) { }
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend API offline, falling back to local storage:', err);
      }

      // Fallback to localStorage or empty fleet
      try {
        const local = localStorage.getItem('logi_pulse_vehicles');
        if (local) {
          const parsed = JSON.parse(local);
          setFleets(Array.isArray(parsed) ? parsed : []);
        } else {
          setFleets([]);
        }
      } catch (e) {
        setFleets([]);
      }
      setIsLoading(false);
    };

    fetchVehicles();
  }, []);

  // If editing a vehicle, render CarrierAddNewVehicle in Edit Mode (matching Image 2)
  if (editingVehicle) {
    return (
      <CarrierAddNewVehicle
        isEditMode={true}
        initialVehicle={editingVehicle}
        onSaveEditVehicle={(updatedVehicle: any) => {
          const updated = fleets.map((f) => (f.id === updatedVehicle.id ? updatedVehicle : f));
          setFleets(updated);
          try {
            localStorage.setItem('logi_pulse_vehicles', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
          } catch (e) { }
          setEditingVehicle(null);
        }}
        onAddCarrierVehicle={() => { }}
        onCancel={() => setEditingVehicle(null)}
      />
    );
  }

  // If URL is /carriers/AddNewVehicle, render the Carrier Add New Vehicle Page
  if (urlSubPath === 'AddNewVehicle' || urlSubPath === 'add-new-vehicle') {
    return (
      <CarrierAddNewVehicle
        onAddCarrierVehicle={(newVehicle: any) => {
          const updated = [newVehicle, ...fleets];
          setFleets(updated);
          try {
            localStorage.setItem('logi_pulse_vehicles', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
          } catch (e) { }
          onNavigate('carriers');
        }}
        onSaveEditVehicle={() => { }}
        onCancel={() => onNavigate('carriers')}
      />
    );
  }

  const FLEETS_PER_PAGE = 6;

  // Toggle vehicle availability
  const toggleAvailability = async (id: string) => {
    const updated = fleets.map((f) => (f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
    setFleets(updated);
    try {
      localStorage.setItem('logi_pulse_vehicles', JSON.stringify(updated));
      await fetch(`http://localhost:3005/api/carriers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.warn('Could not sync availability to backend:', e);
    }
  };

  // Delete vehicle from fleet
  const deleteVehicle = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your carrier fleet?')) return;
    const updated = fleets.filter((f) => f.id !== id);
    setFleets(updated);
    try {
      localStorage.setItem('logi_pulse_vehicles', JSON.stringify(updated));
      await fetch(`http://localhost:3005/api/carriers/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Could not delete vehicle from backend:', e);
    }
  };

  // Filter logic
  const filtered = fleets.filter((f) => {
    const fMode = (f.mode || f.type || 'truck').toLowerCase();

    // Mode / Category filter
    if (activeCategory !== 'All') {
      if (fMode !== activeCategory.toLowerCase()) {
        return false;
      }
    }

    // Apply Left Sidebar multi-select filters
    if (activeSideFilters) {
      if (activeSideFilters.vehicleType && activeSideFilters.vehicleType !== 'all') {
        const vType = activeSideFilters.vehicleType.toLowerCase();
        if (vType === 'bike' && fMode !== 'bike') return false;
        if (vType === 'car' && fMode !== 'truck') return false;
      }

      if (activeSideFilters.availabilityOnly && !f.isAvailable) return false;

      // Brand filter
      const brandsObj = activeSideFilters.brands || activeSideFilters.brand;
      if (brandsObj) {
        const selectedBrandKeys = Object.keys(brandsObj).filter((b) => brandsObj[b]);
        if (selectedBrandKeys.length > 0) {
          const matchBrand = selectedBrandKeys.some((b) =>
            (f.name || '').toLowerCase().includes(b.toLowerCase()) ||
            (f.brand || '').toLowerCase().includes(b.toLowerCase())
          );
          if (!matchBrand) return false;
        }
      }

      // Model filter
      if (activeSideFilters.models) {
        const selectedModelKeys = Object.keys(activeSideFilters.models).filter((m) => activeSideFilters.models[m]);
        if (selectedModelKeys.length > 0) {
          const matchModel = selectedModelKeys.some((m) =>
            (f.name || '').toLowerCase().includes(m.toLowerCase()) ||
            (f.model || '').toLowerCase().includes(m.toLowerCase())
          );
          if (!matchModel) return false;
        }
      }

      // Fuel filter
      const fuelsObj = activeSideFilters.fuels || activeSideFilters.fuel;
      if (fuelsObj) {
        const selectedFuelKeys = Object.keys(fuelsObj).filter((fl) => fuelsObj[fl]);
        if (selectedFuelKeys.length > 0) {
          const matchFuel = selectedFuelKeys.some((fl) =>
            f.fuel && f.fuel.toLowerCase().includes(fl.toLowerCase())
          );
          if (!matchFuel) return false;
        }
      }
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        (f.name || '').toLowerCase().includes(q) ||
        (f.brand || '').toLowerCase().includes(q) ||
        (f.model || '').toLowerCase().includes(q) ||
        (f.plate || f.regId || '').toLowerCase().includes(q) ||
        (f.hub || f.location || '').toLowerCase().includes(q) ||
        (f.category || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / FLEETS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * FLEETS_PER_PAGE;
  const paginatedFleets = filtered.slice(startIndex, startIndex + FLEETS_PER_PAGE);

  return (
    <div className="rental-dashboard-wrapper" style={{ gap: '20px' }}>
      {/* 2-Column Split: Left Filter Sidebar + Right 3x2 Grid Cards */}
      <div className="rental-main-split-layout">
        {/* Left Side: Filter Sidebar */}
        <RentalFilterSidebar
          selectedType="all"
          onFilterChange={(filters: any) => {
            setActiveSideFilters(filters);
            if (filters.searchTerm !== undefined) setSearchQuery(filters.searchTerm);
          }}
          onReset={() => {
            setActiveSideFilters(null);
            setSearchQuery('');
            setActiveCategory('All');
          }}
        />

        {/* Right Side: Grid Showcase */}
        <div className="rental-main-content-col">
          <div className="owner-fleet-grid-container">
            {/* Header: Title + Add Vehicle Button */}
            <div className="owner-grid-header">
              <div className="owner-header-left">
                <h3 className="owner-grid-heading">Fleet Vehicles ({filtered.length})</h3>
                <span className="owner-grid-subheading">Active Commercial Logistics Carriers & Transport Modes</span>
              </div>
              <button
                type="button"
                className="btn-add-fleet-vehicle"
                onClick={() => onNavigate('carriers', 'AddNewVehicle')}
              >
                <i className="fa-solid fa-plus"></i> Add Vehicle
              </button>
            </div>

            {/* Category Filter Chips Bar */}
            <div className="owner-categories-bar">
              {CARRIER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setCurrentPage(1);
                  }}
                >
                  <i className={`fa-solid ${cat.icon}`}></i>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* 1 Row 2 Columns Grid: increased width, reduced height and 10px gap */}
            <div
              className="owner-vehicles-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                width: '100%'
              }}
            >
              {paginatedFleets.map((carrier) => {
                const modeKey = (carrier.mode || carrier.type || 'truck').toLowerCase();
                const iconImg = MODE_ICON_MAP[modeKey] || '/images/carrier_mode_truck.png';
                const payloadDisplay = carrier.payloadKg
                  ? (carrier.payloadKg >= 1000
                    ? `${(carrier.payloadKg / 1000).toLocaleString()} Tonnes`
                    : `${carrier.payloadKg.toLocaleString()} kg`)
                  : (carrier.maxPayload ? `${carrier.maxPayload} ${carrier.weightUnit || 'Tonnes'}` : 'Standard Capacity');

                return (
                  <div
                    key={carrier.id}
                    className="owner-vehicle-card"
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    {/* Top Image Showcase - compact height */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '140px',
                        overflow: 'hidden',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <img
                        src={carrier.image || (carrier.images && carrier.images[0]) || iconImg}
                        alt={carrier.name}
                        onError={(e) => {
                          e.currentTarget.src = iconImg;
                        }}
                        style={{
                          maxWidth: '92%',
                          maxHeight: '125px',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                    </div>

                    {/* Card Body - reduced padding */}
                    <div
                      style={{
                        padding: '12px 14px 14px 14px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: '#ffffff'
                      }}
                    >
                      <div>
                        {/* Header Row: Title on Left, Mode & Star on Right */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#0f172a',
                                margin: 0,
                                lineHeight: 1.25,
                                fontFamily: "Georgia, 'Times New Roman', serif"
                              }}
                            >
                              {carrier.name}
                            </h4>
                            <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                              {carrier.brand || carrier.category || 'Tata Motors'}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginTop: '2px' }}>
                            <span
                              style={{
                                fontSize: '10.5px',
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                            >
                              {carrier.mode || carrier.type}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12.5px', fontWeight: 700 }}>
                              <span>⭐</span>
                              <span style={{ color: '#d97706' }}>{carrier.rating || '4.9'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Specs Line */}
                        <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#334155', lineHeight: 1.4 }}>
                          <strong style={{ color: '#0f172a', fontWeight: 700 }}>Max Load:</strong>{' '}
                          {payloadDisplay} • {carrier.fuel || 'Diesel'} • {carrier.containerSpace || '20ft Closed Container / Flatbed'}
                        </div>

                        {/* Registration ID */}
                        <div style={{ marginTop: '3px', fontSize: '11.5px', color: '#334155' }}>
                          <strong style={{ color: '#0f172a', fontWeight: 700 }}>ID / Reg:</strong>{' '}
                          {carrier.plate || carrier.regId || 'MH 12 MH 6789'}
                        </div>

                        {/* Hub */}
                        <div style={{ marginTop: '3px', fontSize: '11.5px', color: '#334155' }}>
                          <strong style={{ color: '#0f172a', fontWeight: 700 }}>Hub:</strong>{' '}
                          {carrier.hub || carrier.location || 'Mumbai Port Logistics Hub'}
                        </div>

                        {/* Feature Badges */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {carrier.hasGps !== false && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                background: '#ecfdf5',
                                color: '#047857',
                                border: '1px solid #a7f3d0',
                                padding: '2px 7px',
                                borderRadius: '5px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              📡 GPS Telematics
                            </span>
                          )}
                          {carrier.isReefer && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                                padding: '2px 7px',
                                borderRadius: '5px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              ❄️ Cold Chain
                            </span>
                          )}
                          {carrier.isHazmat && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                background: '#fffbeb',
                                color: '#b45309',
                                border: '1px solid #fde68a',
                                padding: '2px 7px',
                                borderRadius: '5px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              ⚠️ HAZMAT
                            </span>
                          )}
                        </div>

                        {/* Rate Card Dashed Box */}
                        <div
                          style={{
                            marginTop: '10px',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            border: '1.5px dashed #cbd5e1'
                          }}
                        >
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                            Rate Card:
                          </span>
                          <span
                            style={{
                              fontSize: '13.5px',
                              fontWeight: 800,
                              color: '#0f172a',
                              fontFamily: "'Times New Roman'"
                            }}
                          >
                            {carrier.pricingText ||
                              `₹${(carrier.baseCharge || 1800).toLocaleString()}/trip | ₹${carrier.ratePerKm || 48}/km | Adv: ${carrier.advancePercent || 30}%`}
                          </span>
                        </div>
                      </div>

                      {/* Footer: Available on Left, Action buttons on Right */}
                      <div
                        style={{
                          marginTop: '12px',
                          paddingTop: '8px',
                          borderTop: '1px solid #f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: carrier.isAvailable ? '#ecfdf5' : '#fee2e2',
                            color: carrier.isAvailable ? '#059669' : '#b91c1c',
                            border: carrier.isAvailable ? '1px solid #a7f3d0' : '1px solid #fecaca'
                          }}
                        >
                          ● {carrier.isAvailable ? 'Available' : 'On Trip'}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(carrier)}
                            style={{
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: '#2563eb',
                              borderRadius: '8px',
                              padding: '5px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                            title="Edit Vehicle"
                          >
                            <i className="fa-solid fa-pen" style={{ fontSize: '11px' }}></i> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteVehicle(carrier.id)}
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#ef4444',
                              borderRadius: '8px',
                              width: '32px',
                              height: '32px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              padding: 0
                            }}
                            title="Delete vehicle from fleet"
                          >
                            <i className="fa-regular fa-trash-can" style={{ fontSize: '13px' }}></i>
                          </button>

                          <label className="simple-switch" style={{ margin: 0 }}>
                            <input
                              type="checkbox"
                              checked={carrier.isAvailable}
                              onChange={() => toggleAvailability(carrier.id)}
                            />
                            <span className="slider round green"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!isLoading && paginatedFleets.length === 0 && (
                <div style={{
                  gridColumn: '1 / -1',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '2px dashed #cbd5e1',
                  padding: '50px 20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚛</div>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                    No Carrier Vehicles Available
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '420px', margin: '0 auto 18px auto' }}>
                    There are no vehicles in this category. Click "+ Add Vehicle" to add a new truck, train rake, cargo flight, vessel, or bike to your carrier fleet.
                  </p>
                  <button
                    type="button"
                    className="btn-add-fleet-vehicle"
                    onClick={() => onNavigate('carriers', 'AddNewVehicle')}
                    style={{ margin: '0 auto' }}
                  >
                    <i className="fa-solid fa-plus"></i> Add Vehicle Now
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="owner-pagination-row">
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <span className="page-indicator">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
