import React, { useState, useEffect } from 'react';
import './Carrier.css';
import './MotorsMarketplace.css';
import './rentalVehicles/rentalVehicles.css';
import './rentalVehicles/OwnerVehicleGrid.css';
import RentalFilterSidebar from './rentalVehicles/RentalFilterSidebar';
import DriverAddNewVerification from './DriverAddNewVerification';

const CARRIER_CATEGORIES = [
  { id: 'All', label: 'All Fleet', icon: 'fa-table-cells' },
  { id: 'truck', label: 'Heavy Trucks (Road)', icon: 'fa-truck' },
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

export default function HireDrivers({
  partnerDetails,
  onNavigate = () => { },
  urlSubPath = null
}: any) {
  const [fleets, setFleets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSideFilters, setActiveSideFilters] = useState<any>(null);

  // Sub-route handling: If urlSubPath is 'AddVehicle' or 'addvehicle', show Image 3 Form
  const isAddVehiclePage = urlSubPath === 'AddVehicle' || urlSubPath === 'addvehicle' || urlSubPath === 'add-new-vehicle';

  // Strictly fetch ONLY driver fleets from dedicated Drivers API
  const fetchVehicles = async () => {
    setIsLoading(true);
    let driverList: any[] = [];
    let isConnected = false;

    // Dedicated Drivers API endpoints (port 5000 and port 3005)
    const apiEndpoints = [
      'http://localhost:5000/api/drivers',
      'http://localhost:3005/api/drivers'
    ];

    for (const url of apiEndpoints) {
      try {
        const res = await fetch(url, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          isConnected = true;
          if (data && Array.isArray(data.drivers)) {
            driverList = data.drivers;
            try {
              localStorage.setItem('sart_fleet_drivers', JSON.stringify(driverList));
            } catch (e) { }
            break;
          }
        }
      } catch (err) {
        // Continue to next endpoint
      }
    }

    if (isConnected) {
      setFleets(driverList);
      setIsBackendConnected(true);
    } else {
      // Fallback only to dedicated sart_fleet_drivers (NEVER carrier fleet)
      try {
        const stored = localStorage.getItem('sart_fleet_drivers');
        if (stored) {
          const parsed = JSON.parse(stored);
          setFleets(Array.isArray(parsed) ? parsed : []);
        } else {
          setFleets([]);
        }
      } catch (e) {
        setFleets([]);
      }
      setIsBackendConnected(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Handle saving new driver registration to ONLY the Drivers Backend API
  const handleSaveDriver = async (driverData: any) => {
    try {
      // Determine primary vehicle mode from eligible vehicles
      const eligibles = driverData.eligibleVehicles || [];
      let mode = 'truck';
      if (eligibles.some((v: string) => v.toLowerCase().includes('bike') || v.toLowerCase().includes('two-wheeler'))) mode = 'bike';
      else if (eligibles.some((v: string) => v.toLowerCase().includes('car') || v.toLowerCase().includes('sedan'))) mode = 'truck';
      else if (eligibles.some((v: string) => v.toLowerCase().includes('ship') || v.toLowerCase().includes('maritime'))) mode = 'ship';
      else if (eligibles.some((v: string) => v.toLowerCase().includes('flight') || v.toLowerCase().includes('aircraft'))) mode = 'flight';

      const payload = {
        id: driverData.id || `DRV-${Date.now()}`,
        name: driverData.name || 'Verified Driver Fleet',
        mode: mode,
        type: mode,
        brand: driverData.name || 'Captain Fleet',
        model: eligibles[0] || 'Standard Vehicle',
        plate: driverData.dlNumber || `DL-${Date.now().toString().slice(-6)}`,
        regId: driverData.dlNumber || `DL-${Date.now().toString().slice(-6)}`,
        hub: driverData.address || 'Chennai / Vellore Hub',
        location: driverData.address || 'Chennai / Vellore Hub',
        fuel: 'Diesel',
        isAvailable: true,
        image: driverData.image || (mode === 'bike' ? '/images/hero_cargo_bike.png' : mode === 'ship' ? '/images/carrier_mode_ship.png' : '/images/carrier_mode_truck.png'),
        rating: 4.9,
        ratePerKm: mode === 'bike' ? 14 : mode === 'ship' ? 649 : 48,
        baseCharge: mode === 'bike' ? 120 : mode === 'ship' ? 180000 : 1800,
        advancePercent: mode === 'bike' ? 25 : mode === 'ship' ? 35 : 30,
        eligibleVehicles: eligibles,
        cannotDriveList: driverData.cannotDriveList || [],
        phone: driverData.phone || '',
        dob: driverData.dob || '',
        gender: driverData.gender || '',
        address: driverData.address || '',
        pincode: driverData.pincode || '',
        dlNumber: driverData.dlNumber || '',
        aadhaarNumber: driverData.aadhaarNumber || '',
        panNumber: driverData.panNumber || '',
        emergencyContact: driverData.emergencyContact || ''
      };

      // Save strictly to Drivers API (port 5000 and port 3005)
      await Promise.allSettled([
        fetch('http://localhost:5000/api/drivers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }),
        fetch('http://localhost:3005/api/drivers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      ]);

      await fetchVehicles();
    } catch (e) {
      console.warn('Could not save to driver backend API:', e);
    }

    onNavigate('drivers');
  };

  if (isAddVehiclePage) {
    return (
      <DriverAddNewVerification
        onCancel={() => onNavigate('drivers')}
        onAddDriver={handleSaveDriver}
      />
    );
  }

  const FLEETS_PER_PAGE = 6;

  // Toggle driver availability
  const toggleAvailability = async (id: string) => {
    const updated = fleets.map((f) => (f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
    setFleets(updated);
    try {
      localStorage.setItem('sart_fleet_drivers', JSON.stringify(updated));
      await Promise.allSettled([
        fetch(`http://localhost:5000/api/drivers/${id}/availability`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch(`http://localhost:3005/api/drivers/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        })
      ]);
    } catch (e) { }
  };

  // Delete driver
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this driver from your fleet?')) return;
    const updated = fleets.filter((f) => f.id !== id);
    setFleets(updated);
    try {
      localStorage.setItem('sart_fleet_drivers', JSON.stringify(updated));
      await Promise.allSettled([
        fetch(`http://localhost:5000/api/drivers/${id}`, { method: 'DELETE' }),
        fetch(`http://localhost:3005/api/drivers/${id}`, { method: 'DELETE' })
      ]);
    } catch (e) { }
  };

  // Filter logic
  const filtered = fleets.filter((item) => {
    if (activeCategory !== 'All') {
      const mode = (item.mode || item.type || '').toLowerCase();
      if (mode !== activeCategory.toLowerCase()) return false;
    }

    if (activeSideFilters) {
      if (activeSideFilters.vehicleType && activeSideFilters.vehicleType !== 'all') {
        const itemMode = (item.mode || item.type || '').toLowerCase();
        if (activeSideFilters.vehicleType === 'bike' && itemMode !== 'bike') return false;
        if (activeSideFilters.vehicleType === 'car' && itemMode !== 'truck') return false;
      }

      if (activeSideFilters.availabilityOnly && !item.isAvailable) return false;

      // Brand filter
      const brandsObj = activeSideFilters.brands || activeSideFilters.brand;
      if (brandsObj) {
        const selectedBrandKeys = Object.keys(brandsObj).filter((b) => brandsObj[b]);
        if (selectedBrandKeys.length > 0) {
          const matchBrand = selectedBrandKeys.some(
            (b) =>
              (item.brand && item.brand.toLowerCase().includes(b.toLowerCase())) ||
              (item.name && item.name.toLowerCase().includes(b.toLowerCase()))
          );
          if (!matchBrand) return false;
        }
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.model && item.model.toLowerCase().includes(q)) ||
        (item.plate && item.plate.toLowerCase().includes(q)) ||
        (item.regId && item.regId.toLowerCase().includes(q)) ||
        (item.hub && item.hub.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filtered.length / FLEETS_PER_PAGE) || 1;
  const paginatedFleets = filtered.slice((currentPage - 1) * FLEETS_PER_PAGE, currentPage * FLEETS_PER_PAGE);

  return (
    <div className="rental-dashboard-wrapper" style={{ gap: '20px' }}>
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

        {/* Right Side: Grid Showcase Matching Image 2 */}
        <div className="rental-main-content-col">
          <div className="owner-fleet-grid-container">
            {/* Header: Title + Add Vehicle Button */}
            <div className="owner-grid-header">
              <div className="owner-header-left">
                <h3 className="owner-grid-heading">Fleet Drivers ({filtered.length})</h3>
                <span className="owner-grid-subheading">Active Commercial Logistics Carriers & Transport Modes</span>
              </div>
              <button
                type="button"
                className="btn-add-fleet-vehicle"
                onClick={() => onNavigate('drivers', 'AddVehicle')}
              >
                <i className="fa-solid fa-plus"></i> Add Drivers
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

            {/* If Backend API is not reachable, display offline banner */}
            {!isBackendConnected && !isLoading && (
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#92400e'
              }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '20px', color: '#f59e0b' }}></i>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Backend API is Not Running</div>
                  <div style={{ fontSize: '12px', color: '#b45309' }}>
                    Connect backend at <code>http://localhost:3005</code> or <code>http://localhost:5000</code> to view and manage live fleet vehicles.
                  </div>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '28px', color: '#2563eb' }}></i>
                <div style={{ marginTop: '12px', fontWeight: 600 }}>Loading live fleet vehicles...</div>
              </div>
            ) : filtered.length === 0 ? (
              /* Empty State */
              <div className="owner-fleet-empty-state">
                <div className="empty-state-icon">
                  <i className="fa-solid fa-truck" style={{ fontSize: '48px', color: '#cbd5e1' }}></i>
                </div>
                <h4 className="empty-state-title">No Fleet Vehicles Found</h4>
                <p className="empty-state-desc">Click below to add your first commercial logistics vehicle.</p>
                <button
                  type="button"
                  className="btn-add-fleet-vehicle"
                  style={{ margin: '0 auto' }}
                  onClick={() => onNavigate('drivers', 'AddVehicle')}
                >
                  <i className="fa-solid fa-plus"></i> Add Drivers
                </button>
              </div>
            ) : (
              /* Vehicle Cards Grid */
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
                  gap: '18px',
                  alignItems: 'stretch'
                }}
              >
                {paginatedFleets.map((carrier) => {
                  const iconImg = MODE_ICON_MAP[carrier.mode || carrier.type] || '/images/carrier_mode_truck.png';
                  const isKg = carrier.weightUnit?.toLowerCase()?.includes('kg');
                  let payloadDisplay = '';
                  if (typeof carrier.maxPayload === 'number') {
                    payloadDisplay = `${carrier.maxPayload.toLocaleString('en-IN')} ${carrier.weightUnit || (carrier.mode === 'bike' ? 'kg' : 'Tonnes')}`;
                  } else if (carrier.maxPayload) {
                    payloadDisplay = String(carrier.maxPayload);
                  } else if (carrier.payloadKg) {
                    payloadDisplay = `${Number(carrier.payloadKg).toLocaleString('en-IN')} ${carrier.weightUnit || 'kg'}`;
                  } else {
                    payloadDisplay = carrier.mode === 'bike' ? '150 kg' : carrier.mode === 'ship' ? '52,000 Tonnes' : '28 Tonnes';
                  }

                  return (
                    <div
                      key={carrier.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                    >
                      {/* Top Photo Header */}
                      <div
                        style={{
                          width: '100%',
                          height: '140px',
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
                            display: 'block',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </div>

                      {/* Card Body */}
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

                              <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                                {carrier.model || (carrier.brand && carrier.name && carrier.name.toLowerCase().startsWith(carrier.brand.toLowerCase()) ? carrier.name.slice(carrier.brand.length).trim() : (carrier.name || carrier.category || 'Standard Fleet'))}
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
                            {carrier.hub || carrier.location || 'Tata Steel Logistics Hub, Chennai, Tamil Nadu - 600081'}
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

                          {/* Rate Card Box */}
                          <div
                            style={{
                              marginTop: '10px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '8px 12px'
                            }}
                          >
                            <span style={{ fontSize: '10.5px', color: '#64748b', display: 'block', fontWeight: 600 }}>Rate Card:</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                              ₹{(carrier.baseCharge || 1800).toLocaleString('en-IN')}/trip | ₹{carrier.ratePerKm || 48}/km | Adv: {carrier.advancePercent || 30}%
                            </span>
                          </div>
                        </div>

                        {/* Bottom Actions Row */}
                        <div
                          style={{
                            marginTop: '12px',
                            paddingTop: '10px',
                            borderTop: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px'
                          }}
                        >
                          {/* Availability Pill */}
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 9px',
                              borderRadius: '20px',
                              background: carrier.isAvailable ? '#ecfdf5' : '#f1f5f9',
                              color: carrier.isAvailable ? '#059669' : '#64748b',
                              border: `1px solid ${carrier.isAvailable ? '#a7f3d0' : '#cbd5e1'}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: carrier.isAvailable ? '#10b981' : '#94a3b8'
                              }}
                            ></span>
                            {carrier.isAvailable ? 'Available' : 'On Trip'}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {/* Bookings View Button */}
                            <button
                              type="button"
                              onClick={() => onNavigate('bookings')}
                              style={{
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                color: '#1d4ed8',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <i className="fa-solid fa-receipt"></i> Bookings
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => onNavigate('drivers', 'AddVehicle')}
                              style={{
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                color: '#334155',
                                padding: '5px 9px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <i className="fa-solid fa-pen"></i> Edit
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDelete(carrier.id)}
                              style={{
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                cursor: 'pointer'
                              }}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>

                            {/* Status Toggle Switch */}
                            <label
                              style={{
                                position: 'relative',
                                display: 'inline-block',
                                width: '36px',
                                height: '20px',
                                margin: 0,
                                cursor: 'pointer'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={carrier.isAvailable}
                                onChange={() => toggleAvailability(carrier.id)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                              />
                              <span
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: carrier.isAvailable ? '#10b981' : '#cbd5e1',
                                  borderRadius: '20px',
                                  transition: '0.2s'
                                }}
                              >
                                <span
                                  style={{
                                    position: 'absolute',
                                    content: "''",
                                    height: '14px',
                                    width: '14px',
                                    left: carrier.isAvailable ? '19px' : '3px',
                                    bottom: '3px',
                                    background: '#ffffff',
                                    borderRadius: '50%',
                                    transition: '0.2s',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                  }}
                                ></span>
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
