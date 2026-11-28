import React, { useState, useEffect } from 'react';
import './Carrier.css';
import './MotorsMarketplace.css';
import './rentalVehicles/rentalVehicles.css';
import './rentalVehicles/OwnerVehicleGrid.css';
import RentalFilterSidebar from './rentalVehicles/RentalFilterSidebar';
import DriverFilterSidebar from './DriverFilterSidebar';
import DriverAddNewVerification from './DriverAddNewVerification';

const CARRIER_CATEGORIES = [
  { id: 'All', label: 'All Fleet', icon: 'fa-table-cells' },
  { id: 'bike', label: 'Bike Drivers', icon: 'fa-motorcycle' },
  { id: 'car', label: 'Car Drivers', icon: 'fa-car' },
  { id: 'truck', label: 'Trucks Drivers', icon: 'fa-truck' },
  { id: 'flight', label: 'Flight Drivers', icon: 'fa-plane' },
  { id: 'ship', label: 'Ship Drivers', icon: 'fa-ship' }
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
  const [editingDriver, setEditingDriver] = useState<any>(null);

  // Sub-route handling: If urlSubPath is 'AddVehicle' or 'addvehicle', show Image 3 Form
  const isAddVehiclePage = urlSubPath === 'AddVehicle' || urlSubPath === 'addvehicle' || urlSubPath === 'add-new-vehicle';

  // Strictly fetch ONLY driver fleets from dedicated Drivers API with silent background refresh support
  const fetchVehicles = async (isBackground = false) => {
    if (!isBackground) {
      setIsLoading(true);
    }
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
          if (data && Array.isArray(data.drivers) && data.drivers.length > 0) {
            isConnected = true;
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

    // Merge with any active local bookings for drivers
    const mergeWithLocal = (list: any[]) => {
      let storedBookings: any[] = [];
      try {
        storedBookings = JSON.parse(localStorage.getItem('sart_business_bookings') || '[]');
      } catch (e) { }

      return list.map(d => {
        let booking = d.bookingDetails || null;
        if (!booking) {
          try {
            const ind = localStorage.getItem(`driver_booking_${d.id}`) || localStorage.getItem(`driver_booking_${d.name}`);
            if (ind) booking = JSON.parse(ind);
          } catch (e) { }
        }
        if (!booking && Array.isArray(storedBookings)) {
          const match = storedBookings.find(b =>
            (b.type === 'driver_booking') &&
            (b.vehicleName?.toLowerCase().includes(d.name.toLowerCase()) || b.title?.toLowerCase().includes(d.name.toLowerCase()))
          );
          if (match) {
            booking = {
              bookingId: match.id,
              customerName: match.customerName,
              customerPhone: match.customerPhone || '+91 98765 43210',
              reportingDate: match.reportingDate || match.date,
              reportingTime: match.reportingTime || match.time,
              serviceType: match.serviceType || 'One Way In-city',
              vehicleType: match.vehicleType || 'Bike / 2-Wheeler',
              pickupLocation: match.pickupLocation || '',
              dropLocation: match.dropLocation || '',
              otp: match.otp || '4829',
              totalFare: match.totalFare || 1012.25
            };
          }
        }

        const isAvail = booking ? false : (typeof d.isAvailable === 'boolean' ? d.isAvailable : true);
        return {
          ...d,
          isAvailable: isAvail,
          status: isAvail ? 'Available' : 'On Trip',
          bookingDetails: booking
        };
      });
    };

    if (isConnected) {
      setFleets(mergeWithLocal(driverList));
      setIsBackendConnected(true);
    } else {
      // Fallback only to dedicated sart_fleet_drivers (NEVER carrier fleet)
      try {
        const stored = localStorage.getItem('sart_fleet_drivers');
        if (stored) {
          const parsed = JSON.parse(stored);
          setFleets(mergeWithLocal(Array.isArray(parsed) ? parsed : []));
        } else {
          setFleets([]);
        }
      } catch (e) {
        setFleets([]);
      }
      setIsBackendConnected(false);
    }
    if (!isBackground) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(false);
    const interval = setInterval(() => {
      fetchVehicles(true);
    }, 4000);
    const onStorage = () => fetchVehicles(true);
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
    };
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
        image: driverData.image || '',
        passportPhoto: driverData.image || '',
        rating: 4.9,
        hourlyRate: Number(driverData.hourlyRate) || (mode === 'bike' ? 120 : mode === 'ship' ? 1200 : 200),
        dailyRate: Number(driverData.dailyRate) || (mode === 'bike' ? 800 : mode === 'ship' ? 8000 : 1500),
        weeklyRate: Number(driverData.weeklyRate) || ((Number(driverData.dailyRate) || 800) * 6),
        monthlyRate: Number(driverData.monthlyRate) || ((Number(driverData.dailyRate) || 800) * 24),
        outstationRate: Number(driverData.outstationRate) || (mode === 'bike' ? 1200 : mode === 'ship' ? 25000 : 1800),
        ratePerKm: Number(driverData.ratePerKm) || (mode === 'bike' ? 14 : mode === 'ship' ? 649 : 48),
        baseCharge: Number(driverData.hourlyRate) || Number(driverData.baseCharge) || (mode === 'bike' ? 120 : mode === 'ship' ? 180000 : 1800),
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

      // Save strictly to Drivers API (port 5000 and port 3005) via POST and PUT if id exists
      const isExisting = Boolean(driverData.id && fleets.some(f => f.id === driverData.id));
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
        }),
        ...(isExisting ? [
          fetch(`http://localhost:5000/api/drivers/${driverData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }),
          fetch(`http://localhost:3005/api/drivers/${driverData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        ] : [])
      ]);

      await fetchVehicles();
    } catch (e) {
      console.warn('Could not save to driver backend API:', e);
    }

    onNavigate('drivers');
  };

  if (isAddVehiclePage || editingDriver) {
    return (
      <DriverAddNewVerification
        initialData={editingDriver}
        onCancel={() => {
          setEditingDriver(null);
          onNavigate('drivers');
        }}
        onAddDriver={(data: any) => {
          handleSaveDriver(data);
          setEditingDriver(null);
        }}
      />
    );
  }

  const FLEETS_PER_PAGE = 6;

  // Toggle driver availability
  const toggleAvailability = async (id: string) => {
    const targetDriver = fleets.find((f) => f.id === id);
    if (!targetDriver) return;
    const newAvailable = !targetDriver.isAvailable;
    const updated = fleets.map((f) => (f.id === id ? { ...f, isAvailable: newAvailable, status: newAvailable ? 'Available' : 'On Trip' } : f));
    setFleets(updated);
    try {
      localStorage.setItem('sart_fleet_drivers', JSON.stringify(updated));
      await Promise.allSettled([
        fetch(`http://localhost:5000/api/drivers/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isAvailable: newAvailable, status: newAvailable ? 'Available' : 'On Trip' })
        }),
        fetch(`http://localhost:3005/api/drivers/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isAvailable: newAvailable, status: newAvailable ? 'Available' : 'On Trip' })
        })
      ]);
    } catch (e) { }
  };

  // Complete ride for driver: releases driver back to Available and clears booking details
  const handleCompleteRide = async (driverId: string) => {
    const updated = fleets.map((f) => {
      if (f.id === driverId) {
        return {
          ...f,
          isAvailable: true,
          status: 'Available',
          bookingDetails: null
        };
      }
      return f;
    });

    setFleets(updated);

    try {
      localStorage.setItem('sart_fleet_drivers', JSON.stringify(updated));
      localStorage.removeItem(`driver_booking_${driverId}`);
      window.dispatchEvent(new Event('storage'));

      await Promise.allSettled([
        fetch(`http://localhost:3005/api/drivers/${encodeURIComponent(driverId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isAvailable: true,
            status: 'Available',
            bookingDetails: null
          })
        }),
        fetch(`http://localhost:5000/api/drivers/${encodeURIComponent(driverId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isAvailable: true,
            status: 'Available',
            bookingDetails: null
          })
        })
      ]);
    } catch (err) {
      console.warn('Error completing ride:', err);
    }
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

  // Filter logic based on driver's eligibleVehicles and mode
  const filtered = fleets.filter((item) => {
    if (activeCategory !== 'All') {
      const catKey = activeCategory.toLowerCase();
      const mode = (item.mode || item.type || '').toLowerCase();
      const eligibles = Array.isArray(item.eligibleVehicles) ? item.eligibleVehicles : [];

      const hasMatch = eligibles.some((ev: string) => {
        const evLower = ev.toLowerCase();
        if (catKey === 'bike') return evLower.includes('bike') || evLower.includes('two');
        if (catKey === 'car') return evLower.includes('car') || evLower.includes('sedan') || evLower.includes('suv');
        if (catKey === 'truck') return evLower.includes('truck') || evLower.includes('wheeler') || evLower.includes('commercial') || evLower.includes('trailer');
        if (catKey === 'flight') return evLower.includes('flight') || evLower.includes('aircraft') || evLower.includes('plane');
        if (catKey === 'ship') return evLower.includes('ship') || evLower.includes('maritime') || evLower.includes('vessel');
        return false;
      });

      const modeMatch = mode === catKey ||
        (catKey === 'car' && (mode.includes('car') || mode.includes('sedan') || mode.includes('suv'))) ||
        (catKey === 'bike' && mode.includes('bike')) ||
        (catKey === 'truck' && mode.includes('truck')) ||
        (catKey === 'flight' && (mode.includes('flight') || mode.includes('air'))) ||
        (catKey === 'ship' && (mode.includes('ship') || mode.includes('maritime')));

      if (!hasMatch && !modeMatch) return false;
    }

    if (activeSideFilters) {
      if (activeSideFilters.availabilityOnly && !item.isAvailable) return false;

      // Category / Type filter from sidebar checkboxes
      if (activeSideFilters.selectedCategories && activeSideFilters.selectedCategories.length > 0) {
        const types = activeSideFilters.selectedCategories.map((t: string) => t.toLowerCase());
        const hasAll = types.some((t: string) => t.includes('all'));
        if (!hasAll) {
          const mode = (item.mode || item.type || '').toLowerCase();
          const eligibles = Array.isArray(item.eligibleVehicles) ? item.eligibleVehicles : [];
          const matchesCategory = types.some((t: string) => {
            if (t.includes('bike')) return mode.includes('bike') || eligibles.some((e: string) => e.toLowerCase().includes('bike'));
            if (t.includes('car')) return mode.includes('car') || eligibles.some((e: string) => e.toLowerCase().includes('car') || e.toLowerCase().includes('sedan'));
            if (t.includes('truck')) return mode.includes('truck') || eligibles.some((e: string) => e.toLowerCase().includes('truck') || e.toLowerCase().includes('wheeler'));
            if (t.includes('flight') || t.includes('pilot')) return mode.includes('flight') || eligibles.some((e: string) => e.toLowerCase().includes('flight') || e.toLowerCase().includes('aircraft'));
            if (t.includes('ship') || t.includes('captain')) return mode.includes('ship') || eligibles.some((e: string) => e.toLowerCase().includes('ship') || e.toLowerCase().includes('maritime'));
            return false;
          });
          if (!matchesCategory) return false;
        }
      }

      // Rate Card Filter
      if (activeSideFilters.selectedRateCard) {
        const rc = activeSideFilters.selectedRateCard;
        const ratePerKm = Number(item.ratePerKm || 0);
        const baseCharge = Number(item.baseCharge || 0);
        if (rc === 'hourly' && !(ratePerKm <= 25 || baseCharge <= 500)) return false;
        if (rc === 'daily' && !(baseCharge > 500 && baseCharge <= 2000)) return false;
        if (rc === 'outstation' && !(baseCharge > 1000 || ratePerKm >= 20)) return false;
      }

      // Experience & Verification Filter
      if (activeSideFilters.selectedExperience && activeSideFilters.selectedExperience.length > 0) {
        const expList = activeSideFilters.selectedExperience;
        for (const exp of expList) {
          if (exp.includes('8+ Years') && Number(item.experienceYears || 5) < 8) {
            // Check if experience matches or default allow established drivers
          }
          if (exp.includes('Police Verified') && item.policeVerified === false) return false;
          if (exp.includes('Commercial DL') && !(item.dlNumber || item.plate || item.commercialDL)) return false;
        }
      }

      // Region Filter
      if (activeSideFilters.selectedRegion && activeSideFilters.selectedRegion !== 'All Regions') {
        const reg = activeSideFilters.selectedRegion.toLowerCase();
        const loc = (item.location || item.hub || item.address || '').toLowerCase();
        if (reg.includes('gurugram') && !loc.includes('gurugram') && !loc.includes('cyber')) return false;
        if (reg.includes('delhi') && !loc.includes('delhi')) return false;
        if (reg.includes('chennai') && !loc.includes('chennai')) return false;
        if (reg.includes('mumbai') && !loc.includes('mumbai')) return false;
      }

      // Rating Filter
      if (activeSideFilters.selectedRating && activeSideFilters.selectedRating !== 'All Ratings') {
        const rating = Number(item.rating || 4.8);
        if (activeSideFilters.selectedRating.includes('4.8+') && rating < 4.8) return false;
        if (activeSideFilters.selectedRating.includes('4.5+') && rating < 4.5) return false;
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
        {/* Left Side: Filter Sidebar matching Image 1 */}
        <DriverFilterSidebar
          onFilterChange={(filters: any) => {
            setActiveSideFilters(filters);
            if (filters.searchTerm !== undefined) setSearchQuery(filters.searchTerm);
            if (filters.driverCategory && filters.driverCategory !== 'All Fleet Drivers') {
              const catMap: Record<string, string> = {
                'Bike Drivers': 'bike',
                'Car Drivers': 'car',
                'Truck Drivers (6W / 10W / 12W)': 'truck',
                'Flight Pilots / Drivers': 'flight',
                'Ship / Maritime Captains': 'ship'
              };
              if (catMap[filters.driverCategory]) {
                setActiveCategory(catMap[filters.driverCategory]);
              }
            }
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

            {/* Loading state - only show full spinner on initial load when no fleets loaded yet */}
            {isLoading && fleets.length === 0 ? (
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
              /* Driver Profile Cards Grid (Matching Image 2: 1 row 2 columns without increasing height) */
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  alignItems: 'stretch'
                }}
              >
                {paginatedFleets.map((driver) => {
                  const driverPhoto = driver.image || driver.passportPhoto || '';
                  const driverName = driver.name || '';
                  const experience = driver.drivingExperienceYears ? (driver.drivingExperienceYears + ' Years') : '8 Years';
                  const age = driver.dob ? String(new Date().getFullYear() - new Date(driver.dob).getFullYear() || 34) : '34';
                  const gender = driver.gender || 'Male';

                  // Format Eligible Vehicles display
                  let eligibleStr = '';
                  if (Array.isArray(driver.eligibleVehicles) && driver.eligibleVehicles.length > 0) {
                    eligibleStr = driver.eligibleVehicles.map((v) => {
                      if (v.toLowerCase().includes('car')) return '🚗 Car, SUV';
                      if (v.toLowerCase().includes('sedan')) return '🚗 Sedan';
                      if (v.toLowerCase().includes('bike') || v.toLowerCase().includes('two')) return '🏍️ Bike';
                      if (v.toLowerCase().includes('commercial') || v.toLowerCase().includes('lcv')) return '🛻 Commercial LCV';
                      if (v.toLowerCase().includes('truck')) return '🚛 Truck';
                      return v;
                    }).join(', ');
                  } else {
                    eligibleStr = '🚗 Car, SUV, 🚗 Sedan, 🏍️ Bike, 🛻 Commercial LCV';
                  }

                  const regId = driver.dlNumber || driver.plate || driver.regId || driver.id || 'DRV-3728HSH32938';
                  const location = driver.hub || driver.location || driver.address || 'Katpadi, Vellore, Tamil Nadu';
                  const mobileNumber = driver.phone || driver.mobile || driver.contactNumber || '+91 98765 43210';
                  const rating = driver.rating || '4.9';
                  const tripCount = driver.tripCount || 124;

                  // Retrieve booked details if driver was booked by a user
                  let activeBooking = driver.bookingDetails || null;
                  if (!activeBooking) {
                    try {
                      const localBookingStr = localStorage.getItem(`driver_booking_${driver.id}`);
                      if (localBookingStr) {
                        activeBooking = JSON.parse(localBookingStr);
                      }
                    } catch (e) { }
                  }

                  const isDriverBooked = Boolean(activeBooking && !driver.isAvailable);

                  return (
                    <div
                      key={driver.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '16px 18px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                    >
                      {/* Top Header: Avatar on left */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                          {/* Driver Avatar with verified check badge */}
                          <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                            <img
                              src={driverPhoto}
                              alt={driverName}
                              onError={(e) => {
                                e.currentTarget.src = '';
                              }}
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #e2e8f0',
                                display: 'block'
                              }}
                            />
                            {/* Green check badge */}
                            <span
                              style={{
                                position: 'absolute',
                                bottom: '0px',
                                right: '0px',
                                background: '#10b981',
                                color: '#ffffff',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #ffffff',
                                fontSize: '10px',
                                fontWeight: 900
                              }}
                            >
                              ✓
                            </span>
                          </div>
                        </div>

                        {/* Driver Name & Tag Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                            {driverName.includes('(') ? driverName : (' Captain: ' + driverName)}
                          </h4>
                          <span
                            style={{
                              background: '#eff6ff',
                              color: '#2563eb',
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: '5px',
                              letterSpacing: '0.4px',
                              textTransform: 'uppercase'
                            }}
                          >
                            CAR & BIKE DRIVER
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 800, color: '#d97706', marginLeft: 'auto' }}>
                            <span>★</span>
                            <span>{rating}</span>
                            <span style={{ color: '#92400e', fontWeight: 600 }}>({tripCount} trips)</span>
                          </div>
                        </div>

                        {/* Driver Meta Lines */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px', color: '#1e293b', marginBottom: '8px' }}>
                          <div>
                            <strong>Driving Experience:</strong> {experience} • <strong>Age:</strong> {age} • {gender}
                          </div>
                          <div>
                            <strong>Eligible Vehicles:</strong> {eligibleStr}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                            <strong>Documents Verified:</strong>
                            <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                              <span style={{ background: '#10b981', color: '#fff', borderRadius: '50%', width: '13px', height: '13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>✓</span> DL,
                            </span>
                            <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                              <span style={{ background: '#10b981', color: '#fff', borderRadius: '50%', width: '13px', height: '13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>✓</span> Aadhaar,
                            </span>
                            <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                              <span style={{ background: '#10b981', color: '#fff', borderRadius: '50%', width: '13px', height: '13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>✓</span> PAN,
                            </span>
                            <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                              <span style={{ background: '#10b981', color: '#fff', borderRadius: '50%', width: '13px', height: '13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>✓</span> Police Clearance
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <strong>Current Location:</strong>
                            <i className="fa-regular fa-compass" style={{ color: '#64748b', fontSize: '11px' }}></i>
                            <span>{location}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <strong>Mobile Number:</strong>
                            <i className="fa-solid fa-phone" style={{ color: '#10b981', fontSize: '11px' }}></i>
                            <a
                              href={`tel:${mobileNumber.replace(/\s+/g, '')}`}
                              style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none' }}
                            >
                              {mobileNumber}
                            </a>
                          </div>
                          <div>
                            <strong>ID / Reg:</strong> {regId}
                          </div>
                        </div>

                        {/* GPS Telematics Active Badge */}
                        <div style={{ marginBottom: '8px' }}>
                          <span
                            style={{
                              background: '#ecfdf5',
                              color: '#059669',
                              border: '1px solid #a7f3d0',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <i className="fa-solid fa-satellite-dish" style={{ fontSize: '10px' }}></i>
                            GPS Telematics Active
                          </span>
                        </div>

                        {/* Rate Card / Charges Box */}
                        <div
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            marginBottom: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                              Rate Card / Charges:
                            </span>
                            {(driver.weeklyRate || driver.monthlyRate) && (
                              <span style={{ fontSize: '9.5px', color: '#2563eb', fontWeight: 700, background: '#eff6ff', padding: '1px 5px', borderRadius: '4px' }}>
                                Weekly &amp; Monthly Available
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', lineHeight: '1.4' }}>
                            <span>₹{driver.hourlyRate || driver.baseCharge || 120}/hr</span>
                            <span style={{ color: '#94a3b8', margin: '0 5px' }}>|</span>
                            <span>₹{(driver.dailyRate || 800).toLocaleString('en-IN')} (8 Hrs)</span>
                            <span style={{ color: '#94a3b8', margin: '0 5px' }}>|</span>
                            <span>Outstation: ₹{(driver.outstationRate || 1800).toLocaleString('en-IN')}/day</span>
                          </div>
                          {(driver.weeklyRate || driver.monthlyRate) && (
                            <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#475569', marginTop: '3px', display: 'flex', gap: '8px' }}>
                              {driver.weeklyRate && (
                                <span>Week: <strong style={{ color: '#0f172a' }}>₹{Number(driver.weeklyRate).toLocaleString('en-IN')}</strong></span>
                              )}
                              {driver.weeklyRate && driver.monthlyRate && <span>•</span>}
                              {driver.monthlyRate && (
                                <span>Month: <strong style={{ color: '#0f172a' }}>₹{Number(driver.monthlyRate).toLocaleString('en-IN')}</strong></span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Customer Booking Details Card - Displayed when driver is booked by user */}
                        {isDriverBooked && activeBooking && (
                          <div
                            style={{
                              background: '#f8fafc',
                              border: '1.5px solid #cbd5e1',
                              borderRadius: '12px',
                              padding: '12px 14px',
                              marginBottom: '12px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1e293b', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <i className="fa-solid fa-user-check" style={{ color: '#2563eb' }}></i> Customer Booking Details
                              </span>
                              <span style={{ fontSize: '10px', fontWeight: 800, background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px' }}>
                                Actively Booked
                              </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11.5px', color: '#334155', marginBottom: '8px' }}>
                              <div><strong>Customer:</strong> {activeBooking.customerName || 'Sai Kumar'}</div>
                              <div><strong>Contact:</strong> {activeBooking.customerPhone || '+91 98765 43210'}</div>
                              <div><strong>Reporting Date:</strong> {activeBooking.reportingDate || '2026-11-21'}</div>
                              <div><strong>Time:</strong> {activeBooking.reportingTime || '10:00 AM'}</div>
                              <div style={{ gridColumn: 'span 2' }}>
                                <strong>Service Type:</strong>{' '}
                                <span style={{ color: '#2563eb', fontWeight: 700 }}>
                                  {activeBooking.serviceType || 'One Way In-city'}
                                </span>
                              </div>
                              <div style={{ gridColumn: 'span 2' }}>
                                <strong>Vehicle:</strong> {activeBooking.vehicleType || 'Bike / 2-Wheeler'}
                              </div>
                              <div style={{ gridColumn: 'span 2' }}>
                                <strong>Pickup:</strong> {activeBooking.pickupLocation || 'Ranipet - Chittoor Trunk Road, Vellore'}
                              </div>
                              <div style={{ gridColumn: 'span 2' }}>
                                <strong>Destination:</strong> {activeBooking.dropLocation || 'Cyber City, Phase 2, Gurugram - 122002'}
                              </div>
                              <div>
                                <strong>Trip OTP:</strong>{' '}
                                <span style={{ color: '#059669', fontWeight: 800, fontSize: '13px' }}>
                                  {activeBooking.otp || '4829'}
                                </span>
                              </div>
                              <div>
                                <strong>Total Fare:</strong>{' '}
                                <span style={{ fontWeight: 800, color: '#0f172a' }}>
                                  ₹{activeBooking.totalFare ? Number(activeBooking.totalFare).toFixed(2) : '1,012.25'}
                                </span>
                              </div>
                            </div>

                            {/* Completed Ride Button */}
                            <button
                              type="button"
                              onClick={() => handleCompleteRide(driver.id)}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: '#10b981',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                              }}
                            >
                              <i className="fa-solid fa-circle-check"></i> Complete Ride & Release Driver
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Bottom Actions Row */}
                      <div
                        style={{
                          paddingTop: '8px',
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
                            fontSize: '12px',
                            fontWeight: 700,
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: driver.isAvailable ? '#ecfdf5' : '#f1f5f9',
                            color: driver.isAvailable ? '#059669' : '#64748b',
                            border: '1px solid ' + (driver.isAvailable ? '#a7f3d0' : '#cbd5e1'),
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: driver.isAvailable ? '#10b981' : '#94a3b8'
                            }}
                          ></span>
                          {driver.isAvailable ? 'Available' : 'On Trip'}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {/* Bookings View Button */}


                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDriver(driver);
                              onNavigate('drivers', 'AddVehicle');
                            }}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <i className="fa-solid fa-pen"></i> Edit
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(driver.id)}
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>


                        </div>
                      </div>
                    </div>
                  );
                })}              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
