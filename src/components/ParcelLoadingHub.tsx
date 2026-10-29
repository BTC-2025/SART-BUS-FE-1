import React, { useState } from 'react';
import './MotorsMarketplace.css';

// Initial parcel loading & unloading fleet data (buses, trucks, tempos, container trailers)
const INITIAL_PARCEL_FLEET = [
  {
    id: 'FLEET-BUS-01',
    company: 'SRS Multi-Hub Logistics & Express Buses',
    title: 'Ashok Leyland Viking AC Express Bus (Lower Belly Parcel Bay)',
    type: 'Express Bus',
    category: 'bus',
    capacity: '3.5 Tonnes Belly Cargo',
    origin: 'Koyambedu Omni Bus Hub, Chennai',
    destination: 'Salem & Coimbatore Central Hub',
    dailyRate: '₹3,200 / day',
    perParcelRate: '₹350 / box (up to 50kg)',
    driverIncluded: true,
    driverName: 'K. Saravanan (HMV DL-440182)',
    safeParkingSlot: 'Bay B-04 (Chennai Central Staging Yard)',
    status: 'Available for Loading',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    loadingStatus: 'Loading Station Gate 2 Open',
    unloadingPoint: 'Coimbatore Omni Terminal (Reserved Bay 12)'
  },
  {
    id: 'FLEET-TRK-02',
    company: 'National Freightlines Enterprise',
    title: 'Tata Ultra 1918.T Container Truck (Goods & Heavy Parcels)',
    type: 'Heavy Truck',
    category: 'truck',
    capacity: '10 Tonnes Commercial Freight',
    origin: 'Guindy Industrial Estate, Chennai',
    destination: 'Whitefield Industrial Depot, Bengaluru',
    dailyRate: '₹8,500 / day',
    perParcelRate: '₹850 / pallet',
    driverIncluded: true,
    driverName: 'Ramesh Kumar (PCC Verified Driver)',
    safeParkingSlot: 'Electronic City Staging Yard #18',
    status: 'In Loading',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    loadingStatus: 'Loaded 65% - Unloading at BLR',
    unloadingPoint: 'Bengaluru Logistics Safe Depot'
  },
  {
    id: 'FLEET-TMP-03',
    company: 'QuickCity Cargo & Parcel Movers',
    title: 'Mahindra Bolero Maxi Truck Plus (City Loading & Rapid Unloading)',
    type: 'City Tempo',
    category: 'tempo',
    capacity: '1.7 Tonnes Rapid Delivery',
    origin: 'Ambattur Industrial Hub, Chennai',
    destination: 'Sriperumbudur Auto Hub',
    dailyRate: '₹1,800 / day',
    perParcelRate: '₹120 / parcel',
    driverIncluded: false,
    driverName: 'Hire a Driver On-Demand',
    safeParkingSlot: 'Sriperumbudur Industrial Yard Bay A-09',
    status: 'Available for Rent',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    loadingStatus: 'Unloaded & Ready for Next Parcel Cycle',
    unloadingPoint: 'Sriperumbudur Yard & Safe Holding'
  },
  {
    id: 'FLEET-BUS-04',
    company: 'Parveen Travels Commercial Cargo Fleet',
    title: 'BharatBenz Sleeper Coach (Secure Rooftop & Underbelly Parcel Hold)',
    type: 'Express Bus',
    category: 'bus',
    capacity: '4 Tonnes Protected Express Goods',
    origin: 'Madurai Mattuthavani Hub',
    destination: 'Chennai Central Depot',
    dailyRate: '₹4,000 / day',
    perParcelRate: '₹420 / carton',
    driverIncluded: true,
    driverName: 'Anand Sundaram (Hazchem / Heavy DL)',
    safeParkingSlot: 'Madurai Integrated Yard #7',
    status: 'Available for Loading',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    loadingStatus: 'Scheduled Loading at 6:00 PM',
    unloadingPoint: 'Chennai Central Gate 4 Bay'
  }
];

export default function ParcelLoadingHub({ partnerDetails, onNavigate }) {
  const [fleetList, setFleetList] = useState(INITIAL_PARCEL_FLEET);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddFleetModal, setShowAddFleetModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form for Big Companies to Onboard Vehicles & Drivers
  const [newVehicle, setNewVehicle] = useState({
    company: partnerDetails?.businessName || partnerDetails?.name || 'Enterprise Logistics Co.',
    title: '',
    category: 'bus',
    type: 'Express Bus',
    capacity: '',
    origin: 'Chennai Central Loading Hub',
    destination: 'Bengaluru Cargo Hub',
    dailyRate: '₹3,500 / day',
    perParcelRate: '₹350 / box',
    driverIncluded: true,
    driverName: '',
    safeParkingSlot: 'Bay P-01 (Safe Secured Yard)',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  });

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    customerName: partnerDetails?.name || '',
    customerPhone: '+91 ',
    pickupHub: 'Chennai Central Loading Hub',
    dropHub: 'Bengaluru Safe Unloading Depot',
    needDriver: true,
    rentParkingSlot: true,
    parkingLocation: 'Chennai Yard Bay #12 (Safe Security Holding)',
    parcelDetails: 'Electronics & Machine Cartons (15 Boxes)',
    totalWeight: '450 kg'
  });

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleCreateVehicle = (e) => {
    e.preventDefault();
    if (!newVehicle.title.trim() || !newVehicle.capacity.trim()) {
      alert('Please fill out Vehicle Title and Parcel Capacity');
      return;
    }

    const created = {
      id: `FLEET-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newVehicle,
      status: 'Available for Loading',
      loadingStatus: 'Ready for Loading at Assigned Bay',
      unloadingPoint: `${newVehicle.destination} (Safe Yard Slot)`
    };

    setFleetList([created, ...fleetList]);
    setShowAddFleetModal(false);
    showNotification(`Vehicle "${created.title}" successfully onboarded into SART Logistics Network!`);
  };

  const handleBookVehicle = (e) => {
    e.preventDefault();
    setShowBookModal(false);
    showNotification(`Booking confirmed for ${selectedVehicle?.title}! Vehicle, Driver & Safe Unloading Yard Slot reserved.`);
  };

  const filteredFleet = activeCategory === 'all'
    ? fleetList
    : fleetList.filter(item => item.category === activeCategory);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 32px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#065f46',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(6, 95, 70, 0.35)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          <i className="fa-solid fa-circle-check" style={{ color: '#34d399', fontSize: '18px' }}></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero / Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0A382C 0%, #115e59 100%)',
        borderRadius: '24px',
        padding: '36px 40px',
        color: '#ffffff',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(10, 56, 44, 0.2)'
      }}>
        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', marginBottom: '14px' }}>
            <i className="fa-solid fa-shield-check" style={{ color: '#34d399' }}></i>
            Verified Commercial Logistics Ecosystem
          </div>
          <h1 style={{ margin: '0 0 12px 0', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Buses, Trucks & Tempos for Parcel Loading & Unloading
          </h1>
          <p style={{ margin: 0, fontSize: '15px', color: '#ccfbf1', lineHeight: '1.6' }}>
            Rent commercial vehicles for loading parcels, hire certified drivers, and book secure parking slots across multiple locations to safely unload, stage, and store goods.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '24px' }}>
            <button
              onClick={() => setShowAddFleetModal(true)}
              style={{
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '12px 22px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              <i className="fa-solid fa-plus-circle"></i>
              Company Onboarding: Add Vehicle & Driver
            </button>

            <button
              onClick={() => onNavigate && onNavigate('parking')}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-square-parking"></i>
              Explore Safe Parking Slots for Unloading
            </button>

            <button
              onClick={() => onNavigate && onNavigate('hire_drivers')}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-user-tie"></i>
              Hire Commercial Drivers
            </button>
          </div>
        </div>

        {/* Decorative Badge */}
        <div style={{
          position: 'absolute',
          right: '40px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          minWidth: '240px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-bus-simple" style={{ fontSize: '24px', color: '#34d399' }}></i>
            <div>
              <div style={{ fontSize: '11px', color: '#99f6e4', textTransform: 'uppercase', fontWeight: '700' }}>Express Buses</div>
              <div style={{ fontSize: '15px', fontWeight: '800' }}>Intercity Belly Cargo</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-truck" style={{ fontSize: '24px', color: '#38bdf8' }}></i>
            <div>
              <div style={{ fontSize: '11px', color: '#bae6fd', textTransform: 'uppercase', fontWeight: '700' }}>Heavy Trucks</div>
              <div style={{ fontSize: '15px', fontWeight: '800' }}>Full Load & Freight</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-square-parking" style={{ fontSize: '24px', color: '#fbbf24' }}></i>
            <div>
              <div style={{ fontSize: '11px', color: '#fef08a', textTransform: 'uppercase', fontWeight: '700' }}>Safe Yards</div>
              <div style={{ fontSize: '15px', fontWeight: '800' }}>24/7 Monitored Slots</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Interactive Steps Guide */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px',
        marginBottom: '32px'
      }}>
        {[
          {
            step: '01',
            title: 'Rent Bus, Truck or Tempo',
            desc: 'Choose vehicles equipped for express parcel loading and bulk cargo transfer.',
            icon: 'fa-truck-ramp-box',
            color: '#10b981'
          },
          {
            step: '02',
            title: 'Load Parcels At Hub',
            desc: 'Securely load packages, retail cartons, or industrial parts into belly bays or containers.',
            icon: 'fa-boxes-packing',
            color: '#3b82f6'
          },
          {
            step: '03',
            title: 'Hire Verified Driver',
            desc: 'Need a professional? Assign certified HMV and commercial drivers for safe transit.',
            icon: 'fa-id-card',
            color: '#8b5cf6'
          },
          {
            step: '04',
            title: 'Unload in Safe Parking Slot',
            desc: 'Park in designated CCTV-monitored yard bays across cities to safely unload and keep goods safe.',
            icon: 'fa-shield-halved',
            color: '#f59e0b'
          }
        ].map((s) => (
          <div
            key={s.step}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px', fontWeight: '900', color: `${s.color}40` }}>{s.step}</span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: `${s.color}15`,
                color: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                <i className={`fa-solid ${s.icon}`}></i>
              </div>
            </div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{s.title}</h4>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: '1.5' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        background: '#ffffff',
        padding: '14px 20px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Fleet Assets', icon: 'fa-border-all' },
            { id: 'bus', label: 'Express Buses (Belly Cargo)', icon: 'fa-bus-simple' },
            { id: 'truck', label: 'Freight Trucks', icon: 'fa-truck' },
            { id: 'tempo', label: 'City Tempos & Mini-Trucks', icon: 'fa-truck-pickup' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeCategory === tab.id ? '#0A382C' : '#f8fafc',
                color: activeCategory === tab.id ? '#ffffff' : '#475569',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
          Showing <strong>{filteredFleet.length}</strong> available fleet vehicles
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {filteredFleet.map((vehicle) => (
          <div
            key={vehicle.id}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            {/* Image Header */}
            <div style={{ position: 'relative', height: '200px' }}>
              <img
                src={vehicle.image}
                alt={vehicle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(4px)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: '700'
              }}>
                {vehicle.type}
              </div>

              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#10b981',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: '700'
              }}>
                {vehicle.status}
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#0f172a'
              }}>
                <i className="fa-solid fa-weight-hanging" style={{ color: '#0A382C', marginRight: '6px' }}></i>
                {vehicle.capacity}
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {vehicle.company}
                </div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a', lineHeight: '1.4' }}>
                  {vehicle.title}
                </h3>

                {/* Route & Safe Yard Information */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#059669', width: '16px' }}></i>
                    <span><strong>Loading:</strong> {vehicle.origin}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                    <i className="fa-solid fa-flag-checkered" style={{ color: '#2563eb', width: '16px' }}></i>
                    <span><strong>Unloading:</strong> {vehicle.destination}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                    <i className="fa-solid fa-square-parking" style={{ color: '#d97706', width: '16px' }}></i>
                    <span><strong>Safe Slot:</strong> {vehicle.safeParkingSlot}</span>
                  </div>
                </div>

                {/* Driver & Rates */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '14px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Assigned Driver</span>
                    <strong style={{ color: '#0f172a' }}>
                      <i className="fa-solid fa-id-badge" style={{ color: '#10b981', marginRight: '6px' }}></i>
                      {vehicle.driverName}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Daily Hire / Parcel</span>
                    <strong style={{ color: '#0A382C', fontSize: '15px' }}>{vehicle.dailyRate}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setShowBookModal(true);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0A382C',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fa-solid fa-calendar-check"></i>
                  Rent for Loading
                </button>

                <button
                  onClick={() => onNavigate && onNavigate('parking')}
                  title="Reserve safe parking slot for unloading"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fa-solid fa-square-parking" style={{ color: '#059669' }}></i>
                  Yard
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL 1: BIG COMPANIES ADD VEHICLE & DRIVER ================= */}
      {showAddFleetModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>
                  Enterprise Partner Onboarding
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                  Add Vehicles, Express Buses & Certified Drivers
                </h2>
              </div>
              <button
                onClick={() => setShowAddFleetModal(false)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  value={newVehicle.company}
                  onChange={(e) => setNewVehicle({ ...newVehicle, company: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Vehicle Type
                  </label>
                  <select
                    value={newVehicle.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      let typeLabel = 'Express Bus';
                      if (cat === 'truck') typeLabel = 'Heavy Truck';
                      if (cat === 'tempo') typeLabel = 'City Tempo';
                      setNewVehicle({ ...newVehicle, category: cat, type: typeLabel });
                    }}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  >
                    <option value="bus">Express Bus (Lower Belly Parcel Bay)</option>
                    <option value="truck">Container / Freight Truck</option>
                    <option value="tempo">City Mini-Truck / Tempo</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Parcel Load Capacity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3.5 Tonnes or 120 Cartons"
                    value={newVehicle.capacity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Vehicle Make & Model Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ashok Leyland Viking Sleeper / Tata 1109 LCV"
                  value={newVehicle.title}
                  onChange={(e) => setNewVehicle({ ...newVehicle, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Primary Loading Hub (Origin)
                  </label>
                  <input
                    type="text"
                    value={newVehicle.origin}
                    onChange={(e) => setNewVehicle({ ...newVehicle, origin: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Safe Unloading Hub (Destination)
                  </label>
                  <input
                    type="text"
                    value={newVehicle.destination}
                    onChange={(e) => setNewVehicle({ ...newVehicle, destination: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Certified Driver Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. K. Saravanan (DL Verified)"
                    value={newVehicle.driverName}
                    onChange={(e) => setNewVehicle({ ...newVehicle, driverName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Designated Safe Parking Yard
                  </label>
                  <input
                    type="text"
                    value={newVehicle.safeParkingSlot}
                    onChange={(e) => setNewVehicle({ ...newVehicle, safeParkingSlot: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Daily Hire Rate (₹)
                  </label>
                  <input
                    type="text"
                    value={newVehicle.dailyRate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, dailyRate: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Rate Per Parcel Box
                  </label>
                  <input
                    type="text"
                    value={newVehicle.perParcelRate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, perParcelRate: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddFleetModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: '#10b981', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}
                >
                  Onboard Fleet Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: RENT VEHICLE + DRIVER + PARKING SLOT BOOKING ================= */}
      {showBookModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669', textTransform: 'uppercase' }}>
                  Loading & Staging Dispatch
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '19px', fontWeight: '800', color: '#0f172a' }}>
                  Rent {selectedVehicle?.title}
                </h2>
              </div>
              <button
                onClick={() => setShowBookModal(false)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleBookVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Vehicle Rate:</span>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedVehicle?.dailyRate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Belly Capacity:</span>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedVehicle?.capacity}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Designated Safe Slot:</span>
                  <strong style={{ fontSize: '13px', color: '#059669' }}>{selectedVehicle?.safeParkingSlot}</strong>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Parcel & Cargo Description
                </label>
                <input
                  type="text"
                  value={bookingForm.parcelDetails}
                  onChange={(e) => setBookingForm({ ...bookingForm, parcelDetails: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Loading Location
                  </label>
                  <input
                    type="text"
                    value={bookingForm.pickupHub}
                    onChange={(e) => setBookingForm({ ...bookingForm, pickupHub: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Safe Unloading Location
                  </label>
                  <input
                    type="text"
                    value={bookingForm.dropHub}
                    onChange={(e) => setBookingForm({ ...bookingForm, dropHub: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Integrated Services Checkboxes: Hire Driver & Safe Parking Slot */}
              <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '12px', border: '1px solid #a7f3d0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#065f46' }}>
                  <input
                    type="checkbox"
                    checked={bookingForm.needDriver}
                    onChange={(e) => setBookingForm({ ...bookingForm, needDriver: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Assign Verified Commercial Driver ({selectedVehicle?.driverName || 'Licensed Driver'})</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#065f46' }}>
                  <input
                    type="checkbox"
                    checked={bookingForm.rentParkingSlot}
                    onChange={(e) => setBookingForm({ ...bookingForm, rentParkingSlot: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Reserve Safe Monitored Parking Bay at Unloading Point</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: '#0A382C', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}
                >
                  Confirm Rental & Safe Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
