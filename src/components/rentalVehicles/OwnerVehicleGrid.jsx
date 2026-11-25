import React, { useState } from 'react';
import './OwnerVehicleGrid.css';

const CATEGORIES = [
  { id: 'All', label: 'All Fleet', icon: 'fa-table-cells' },
  { id: 'Minivan', label: 'Minivan', icon: 'fa-van-shuttle' },
  { id: 'Sport', label: 'Sports', icon: 'fa-car-side' },
  { id: 'Convertible', label: 'Convertible', icon: 'fa-car' },
  { id: 'Compact SUV', label: 'Compact SUV', icon: 'fa-truck-pickup' },
  { id: 'Full-size SUV', label: 'Full SUV', icon: 'fa-car-rear' },
  { id: 'Cruiser', label: 'Bikes / Cruisers', icon: 'fa-motorcycle' },
  { id: 'Hatchback', label: 'Hatchback', icon: 'fa-car' }
];

export default function OwnerVehicleGrid({
  vehicles = [],
  selectedCity = 'All',
  onSelectCity = () => { },
  onOpenVehicleDetails = () => { },
  onToggleAvailability = () => { },
  onCompleteTrip = () => { },
  onDeleteVehicle = () => { },
  onOpenAddVehicle = () => { },
  onOpenBookings = () => { },
  onEditVehicle = () => { },
  customCategories = null,
  customLocations = null,
  isParking = false
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Categories list: use customCategories if provided, otherwise default
  const activeCategoriesList = customCategories || CATEGORIES;

  // 2 rows of 3 vehicles = 6 vehicles per page
  const VEHICLES_PER_PAGE = 6;

  const filtered = activeCategory === 'All'
    ? vehicles
    : vehicles.filter(v => {
      if (isParking) {
        const yd = v.yardData || {};
        const vt = yd.vehicleTypes || {};
        if (activeCategory === '2-Wheeler') {
          return vt.twoWheeler?.enabled !== false && Number(vt.twoWheeler?.slots) > 0;
        }
        if (activeCategory === '4-Wheeler') {
          return vt.fourWheeler?.enabled !== false && Number(vt.fourWheeler?.slots) > 0;
        }
        if (activeCategory === 'Trucks') {
          return Boolean(vt.heavyVehicle?.enabled) && Number(vt.heavyVehicle?.slots) > 0;
        }
      }
      if (v.category === activeCategory) return true;
      if (activeCategory === '2-Wheeler' && (v.type === 'bike' || v.category?.includes('2-Wheeler') || v.category === 'Cruiser')) return true;
      if (activeCategory === '4-Wheeler' && (v.type === 'car' || v.category?.includes('4-Wheeler'))) return true;
      if (activeCategory === 'Trucks' && (v.type === 'truck' || v.category?.includes('Truck') || v.category?.includes('Wheeler'))) return true;
      if (activeCategory === 'Cruiser' && v.type === 'bike') return true;
      return false;
    });

  const totalPages = Math.ceil(filtered.length / VEHICLES_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * VEHICLES_PER_PAGE;
  const paginatedVehicles = filtered.slice(startIndex, startIndex + VEHICLES_PER_PAGE);

  // Dynamic location list: extract unique cities/locations from vehicles or customLocations
  const locationList = React.useMemo(() => {
    if (customLocations && Array.isArray(customLocations)) {
      return customLocations;
    }
    const set = new Set();
    vehicles.forEach(v => {
      const loc = v.city || v.locationName || (v.location && v.location.split(',')[0]?.trim());
      if (loc && loc !== 'All' && loc !== 'All Locations') {
        set.add(loc);
      }
    });
    return ['All', ...Array.from(set)];
  }, [vehicles, customLocations]);

  // Ensure current page is valid when filter changes
  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  return (
    <div className="owner-fleet-grid-container">
      {/* Header Row: Title & Add Vehicle Button */}
      <div className="owner-grid-header">
        <div className="owner-header-left">
          <h3 className="owner-grid-heading">Fleet Vehicles</h3>
          <span className="owner-grid-subheading">Managed by Partner Vehicle</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          <button
            type="button"
            className="btn-add-fleet-vehicle"
            onClick={onOpenAddVehicle}
          >
            <i className="fa-solid fa-plus"></i> Add Vehicle
          </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="owner-categories-bar">
        {activeCategoriesList.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategorySelect(cat.id)}
          >
            <i className={`fa-solid ${cat.icon}`}></i>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Location / City Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px 12px 4px', overflowX: 'auto', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <i className="fa-solid fa-location-dot" style={{ color: '#0284c7' }}></i> Location:
        </span>
        {locationList.map(city => (
          <button
            key={city}
            type="button"
            onClick={() => {
              onSelectCity(city);
              setCurrentPage(1);
            }}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              border: selectedCity === city ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
              background: selectedCity === city ? '#e0f2fe' : '#ffffff',
              color: selectedCity === city ? '#0369a1' : '#475569',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {city === 'All' ? 'All Locations' : city}
          </button>
        ))}
      </div>

      {/* Grid of Vehicles matching the card design: exactly 2 columns for parking */}
      <div
        className="owner-vehicles-grid"
        style={isParking ? {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px'
        } : undefined}
      >
        {paginatedVehicles.map(vehicle => {
          const isBooked = vehicle.bookingStatus === 'ALREADY_BOOKED' || (!vehicle.isAvailable && Boolean(vehicle.activeBooking));
          const booking = vehicle.activeBooking;

          // Parse pricing for hourly display
          const hourlyRate = vehicle.pricing?.hourly ? `₹${vehicle.pricing.hourly}/hr` : (vehicle.pricingText?.split('|')?.[0]?.trim() || '₹200/hr');
          const dayRate = vehicle.pricing?.daily ? `₹${vehicle.pricing.daily.toLocaleString()}/day` : (vehicle.pricingText?.split('|')?.[1]?.trim() || '₹2,200/day');
          const monthRate = vehicle.pricing?.monthly ? `₹${vehicle.pricing.monthly.toLocaleString()}/month` : (vehicle.pricingText?.split('|')?.[2]?.trim() || '₹28,000/month');

          // If this is the dedicated Parking Fleet, render the Live Driver View Card (Image 2)
          if (isParking) {
            const yardData = vehicle.yardData || {};
            const spaceType = yardData.spaceType || vehicle.brand || '';
            const bookingMode = yardData.bookingMode || '';
            const totalSlots = (Number(yardData.vehicleTypes?.twoWheeler?.slots) || 0) +
              (Number(yardData.vehicleTypes?.fourWheeler?.slots) || 0) +
              (Number(yardData.vehicleTypes?.heavyVehicle?.slots) || 0) || 45;

            const is24x7 = yardData.is24x7 !== false;
            const hoursDisplay = is24x7 ? '24/7 Open' : `${yardData.openTime || '06:00 AM'} - ${yardData.closeTime || '11:00 PM'}`;
            const landmark = yardData.landmark || 'Opposite Cyber City Metro Gate 2';
            const gateInstructions = yardData.accessInstructions || 'Direct entry from main road. Scan QR code or show booking OTP to guard at gate.';

            const amenities = yardData.amenities && yardData.amenities.length > 0
              ? yardData.amenities
              : ['CCTV Surveillance', '24/7 Security Guard', 'Gated / Boundary Wall', 'Night Floodlights'];

            const twoWheelerSlots = yardData.vehicleTypes?.twoWheeler?.enabled !== false ? (yardData.vehicleTypes?.twoWheeler?.slots || 15) : 0;
            const fourWheelerSlots = yardData.vehicleTypes?.fourWheeler?.enabled !== false ? (yardData.vehicleTypes?.fourWheeler?.slots || 25) : 0;
            const heavySlots = yardData.vehicleTypes?.heavyVehicle?.enabled !== false ? (yardData.vehicleTypes?.heavyVehicle?.slots || 5) : 0;

            return (
              <div
                key={vehicle.id}
                className="owner-vehicle-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                  position: 'relative'
                }}
              >


                {/* Image Frame with Space Type & Instant Booking Pill */}
                <div
                  style={{
                    width: '100%',
                    height: '140px',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: '#f1f5f9'
                  }}
                  onClick={() => onOpenVehicleDetails(vehicle)}
                >
                  <img
                    src={vehicle.image || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'}
                    alt={vehicle.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Space Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    {spaceType}
                  </div>

                  {/* Instant Booking Pill */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(5, 150, 105, 0.95)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}>
                    <i className="fa-solid fa-bolt" style={{ color: '#fde047' }}></i>
                    <span>{bookingMode}</span>
                  </div>

                  {/* Carousel indicator dots */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '2px 7px',
                    borderRadius: '20px'
                  }}>
                    <span style={{ width: '12px', height: '4px', background: '#ffffff', borderRadius: '4px' }}></span>
                    <span style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.6)', borderRadius: '50%' }}></span>
                    <span style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.6)', borderRadius: '50%' }}></span>
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Spot Title & Location */}
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '15px',
                        fontWeight: 800,
                        color: '#0f172a',
                        cursor: 'pointer',
                        lineHeight: 1.2
                      }}
                      onClick={() => onOpenVehicleDetails(vehicle)}
                    >
                      {vehicle.name}
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                      <i className="fa-solid fa-location-dot" style={{ color: '#2a1373', marginTop: '2px', flexShrink: 0 }}></i>
                      <span>{vehicle.location || 'Plot near Ranipet - Chittoor Trunk Road, RV Nagar, Thiruvalam'}</span>
                    </p>
                  </div>

                  {/* Landmark Note */}
                  {landmark && (
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      fontSize: '10.5px',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <i className="fa-solid fa-circle-info" style={{ color: '#6366f1' }}></i>
                      <span>Landmark: {landmark}</span>
                    </div>
                  )}

                  {/* Price & Hours Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f3f0ff',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #c5bddc40'
                  }}>
                    <div>
                      <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block' }}>
                        Starting Tariff
                      </span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 900, color: '#2a1373' }}>
                          ₹{vehicle.hourlyRate || 20}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>/ hr</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block' }}>
                        Hours
                      </span>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                        <i className="fa-regular fa-clock" style={{ color: '#2a1373' }}></i>
                        {hoursDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Slots Available Breakdown */}
                  <div>
                    <span style={{ fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Vehicle Slots Available ({totalSlots} Total)
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {twoWheelerSlots > 0 && (
                        <span style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '2px 7px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i className="fa-solid fa-motorcycle" style={{ color: '#16a34a' }}></i>
                          {twoWheelerSlots} Bike Slots
                        </span>
                      )}
                      {fourWheelerSlots > 0 && (
                        <span style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '2px 7px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i className="fa-solid fa-car" style={{ color: '#2563eb' }}></i>
                          {fourWheelerSlots} Car Slots
                        </span>
                      )}
                      {heavySlots > 0 && (
                        <span style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', padding: '2px 7px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i className="fa-solid fa-truck" style={{ color: '#d97706' }}></i>
                          {heavySlots} Heavy Bays
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Security & Features */}
                  {amenities.length > 0 && (
                    <div>
                      <span style={{ fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Security & Features
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {amenities.slice(0, 4).map((amenity, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '2px 7px',
                              background: '#f3f0ff',
                              color: '#2a1373',
                              fontSize: '9.5px',
                              fontWeight: 700,
                              borderRadius: '4px'
                            }}
                          >
                            ✓ {amenity}
                          </span>
                        ))}
                        {amenities.length > 4 && (
                          <span style={{ padding: '2px 5px', background: '#f1f5f9', color: '#64748b', fontSize: '9.5px', fontWeight: 600, borderRadius: '4px' }}>
                            +{amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Gate Instructions */}
                  {gateInstructions && (
                    <div style={{ paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '10.5px', color: '#64748b' }}>
                      <strong style={{ color: '#334155', display: 'block', marginBottom: '1px' }}>Gate Instructions:</strong>
                      <p style={{ margin: 0, fontStyle: 'italic', lineHeight: 1.3 }}>"{gateInstructions}"</p>
                    </div>
                  )}

                  {/* Action Bar: Edit & Delete */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <span
                      style={{
                        background: vehicle.isAvailable ? '#ecfdf5' : '#fee2e2',
                        color: vehicle.isAvailable ? '#059669' : '#dc2626',
                        borderRadius: '20px',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      ● {vehicle.isAvailable ? 'Available' : 'Full'}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditVehicle(vehicle);
                        }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: '#0f172a',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square" style={{ color: '#0284c7' }}></i>
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete ${vehicle.name}?`)) {
                            onDeleteVehicle(vehicle.id);
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete parking yard"
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={vehicle.id}
              className="owner-vehicle-card"
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: isBooked ? '1.5px solid #fca5a5' : '1px solid #e2e8f0',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                position: 'relative'
              }}
            >
              {/* Image Frame with Star Badge, View Details Pill, Booked Badge */}
              <div
                style={{
                  width: '100%',
                  height: '165px',
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: '#f1f5f9'
                }}
                onClick={() => onOpenVehicleDetails(vehicle)}
                title="Click to view full vehicle details"
              >
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.src = vehicle.type === 'car' ? '/images/cab_sedan.png' : '/images/red_bike_3d.png';
                  }}
                />

                {/* Rating Badge on Top-Left */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '20px',
                  padding: '3px 9px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#1e293b',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                  <i className="fa-solid fa-star" style={{ color: '#f59e0b', fontSize: '11px' }}></i>
                  <span>4.8</span>
                </div>

                {/* View Details Pill on Top-Right */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  <i className="fa-solid fa-expand" style={{ fontSize: '10px' }}></i>
                  <span>View Details</span>
                </div>

                {/* BOOKED Pill if actively booked */}
                {isBooked && (
                  <span style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    background: '#dc2626',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}>
                    <i className="fa-solid fa-user-lock"></i> BOOKED
                  </span>
                )}
              </div>

              {/* Vehicle Body Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Category Pill */}
                <div>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#0284c7',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'inline-block'
                  }}>
                    {vehicle.category || 'Sedan'}
                  </span>
                </div>

                {/* Title & Primary Hourly Rate */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: '16.5px',
                      fontWeight: 800,
                      color: '#0f172a',
                      cursor: 'pointer',
                      letterSpacing: '-0.2px'
                    }}
                    onClick={() => onOpenVehicleDetails(vehicle)}
                  >
                    {vehicle.name}
                  </h4>
                  <span style={{ fontSize: '17px', fontWeight: 800, color: '#2563eb' }}>
                    {hourlyRate}
                  </span>
                </div>

                {/* Reg No & Location (Left) + Multi-Rate (Right) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '11.5px', color: '#64748b' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span>Reg No: {vehicle.plate}</span> • <span>{vehicle.location || 'Katpadi, Vellore'}</span>
                  </div>
                  <div style={{ whiteSpace: 'nowrap', fontWeight: 500, color: '#475569' }}>
                    {dayRate} • {monthRate}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: '#f1f5f9', margin: '2px 0' }} />

                {/* Specs Row with Blue Icons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '2px 0',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155'
                }}>
                  {/* Transmission with H-Shifter SVG */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3v18" />
                      <path d="M18 3v18" />
                      <path d="M6 12h12" />
                      <circle cx="6" cy="3" r="1.5" fill="#2563eb" />
                      <circle cx="18" cy="3" r="1.5" fill="#2563eb" />
                      <circle cx="6" cy="21" r="1.5" fill="#2563eb" />
                      <circle cx="18" cy="21" r="1.5" fill="#2563eb" />
                    </svg>
                    <span>{vehicle.transmission || 'Manual'}</span>
                  </div>

                  {/* Fuel with Gas Pump Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17" />
                      <path d="M15 9h2a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1" />
                      <path d="M6 12h6" />
                    </svg>
                    <span>{vehicle.fuel || 'Petrol'}</span>
                  </div>

                  {/* Seating with User Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>{vehicle.seats || '5 Seats'}</span>
                  </div>
                </div>

                {/* Footer: Available Pill & Trash Icon */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <span
                    style={{
                      background: isBooked ? '#fee2e2' : vehicle.isAvailable ? '#ecfdf5' : '#fee2e2',
                      color: isBooked ? '#dc2626' : vehicle.isAvailable ? '#059669' : '#dc2626',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    ● {isBooked ? 'Not Available' : vehicle.isAvailable ? 'Available' : 'On Trip'}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditVehicle(vehicle);
                      }}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        cursor: 'pointer',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease'
                      }}
                      title={`Edit ${vehicle.name} details`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e0f2fe';
                        e.currentTarget.style.borderColor = '#7dd3fc';
                        e.currentTarget.style.color = '#0284c7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.color = '#0f172a';
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square" style={{ color: '#0284c7' }}></i>
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete ${vehicle.name}?`)) {
                          onDeleteVehicle(vehicle.id);
                        }
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.15s ease'
                      }}
                      title="Delete vehicle from fleet"
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>

                {/* Active Customer Booking Panel Directly Beneath Vehicle Status & Pricing */}
                {isBooked && (
                  <div style={{
                    marginTop: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa-solid fa-user-shield"></i> ALREADY BOOKED
                      </span>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#16a34a' }}>
                        ₹{booking?.totalAmount || 2124} (Paid)
                      </span>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#1e293b' }}>
                      <strong>Booked By:</strong> {booking?.customerName || 'Passenger'}
                    </div>

                    <div style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span><i className="fa-solid fa-phone" style={{ color: '#0284c7' }}></i> {booking?.customerPhone || '+91 98765 43210'}</span>
                      {booking?.customerAge && (
                        <>
                          <span>•</span>
                          <span>Age: {booking.customerAge} yrs</span>
                        </>
                      )}
                    </div>

                    {(booking?.docType || booking?.docNumber) && (
                      <div style={{ fontSize: '11px', color: '#0369a1', background: '#eff6ff', padding: '3px 8px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                        <i className="fa-solid fa-id-card" style={{ marginRight: '4px' }}></i>
                        {booking?.docType?.toUpperCase() || 'ID'}: <strong>{booking?.docNumber || 'Verified'}</strong>
                      </div>
                    )}

                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      <span><i className="fa-solid fa-map-pin" style={{ color: '#e11d48' }}></i> {booking?.pickupLocation || vehicle.location || 'Truro'}</span>
                      <span>•</span>
                      <span><i className="fa-regular fa-calendar-check" style={{ color: '#0284c7' }}></i> {booking?.pickupDate || 'Thu, 19 Nov'} ({booking?.durationPlan || '1 Day'})</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompleteTrip(vehicle.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: '6px',
                          background: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                        }}
                      >
                        <i className="fa-solid fa-flag-checkered"></i> Complete Trip
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVehicleDetails(vehicle);
                        }}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          background: '#ffffff',
                          color: '#0284c7',
                          border: '1px solid #bae6fd',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {paginatedVehicles.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <i className="fa-solid fa-car-side" style={{ fontSize: '36px', marginBottom: '10px', color: '#cbd5e1' }}></i>
            <h4>No vehicles found in this category</h4>
          </div>
        )}
      </div>

      {/* Pagination Footer: 2 Rows per page, remaining on page 2 */}
      {totalPages > 1 && (
        <div className="owner-pagination-row">
          <button
            type="button"
            className="page-nav-arrow"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            title="Previous Page"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <button
              key={pageNumber}
              type="button"
              className={`page-number-btn ${currentPage === pageNumber ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            className="page-nav-arrow"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            title="Next Page"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

