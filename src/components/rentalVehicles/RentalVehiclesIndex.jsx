import React, { useState } from 'react';
import './rentalVehicles.css';
import OwnerRegistration from './OwnerRegistration';
import OwnerKycVerification from './OwnerKycVerification';
import VehicleUploadForm from './VehicleUploadForm';
import VehiclePricingCalendar from './VehiclePricingCalendar';

// Mock fleet listings for demonstration
const INITIAL_FLEET = [
  {
    id: 'VH-101',
    name: 'Hyundai Creta SX 2025',
    plate: 'AP 09 BK 4421',
    category: 'SUV',
    fuel: 'Petrol',
    transmission: 'Automatic',
    rate: '₹2,000 / day',
    status: 'On Rent',
    statusPill: 'rental-status-pending',
    currentRenter: 'John Smith',
    rentDates: 'Mon - Wed',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
    kycApproved: true,
    inspectionStatus: 'Clean'
  },
  {
    id: 'VH-102',
    name: 'Toyota Camry Hybrid',
    plate: 'TN 22 CX 9012',
    category: 'Sedan',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    rate: '₹2,800 / day',
    status: 'Available',
    statusPill: 'rental-status-approved',
    currentRenter: 'Ready for Pickup',
    rentDates: 'Available Now',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80',
    kycApproved: true,
    inspectionStatus: 'Clean'
  },
  {
    id: 'VH-103',
    name: 'Maruti Suzuki Ertiga Commercial',
    plate: 'TN 07 AQ 8812',
    category: '7-Seater MUV',
    fuel: 'CNG / Petrol',
    transmission: 'Manual',
    rate: '₹1,800 / day',
    status: 'Upcoming Reservation',
    statusPill: 'rental-status-approved',
    currentRenter: 'Sarah Johnson (Airport Transfer)',
    rentDates: 'Thu - Sun',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80',
    kycApproved: true,
    inspectionStatus: 'Clean'
  },
  {
    id: 'VH-104',
    name: 'Mahindra Thar 4x4 Hardtop',
    plate: 'KA 03 MN 7710',
    category: '4x4 Offroad',
    fuel: 'Diesel',
    transmission: 'Manual',
    rate: '₹3,500 / day',
    status: 'Maintenance',
    statusPill: 'rental-status-maintenance',
    currentRenter: 'Routine Brake Inspection',
    rentDates: 'Under Service',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
    kycApproved: true,
    inspectionStatus: 'Inspection Due'
  }
];

export default function RentalVehiclesIndex({ partnerDetails, onNavigate }) {
  // Navigation inside the Rental Module:
  // 'dashboard' | 'fleet_list' | 'owner_register' | 'owner_kyc' | 'add_vehicle' | 'pricing_calendar' | 'listing_approval'
  const [currentView, setCurrentView] = useState('dashboard');

  // Sidebar toggle state (closed by default; opens when clicking hamburger)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Listen for hamburger click from Subnav in Navbar
  React.useEffect(() => {
    const handleToggle = () => {
      setIsSidebarOpen(prev => !prev);
    };
    window.addEventListener('toggle-rental-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-rental-sidebar', handleToggle);
  }, []);

  // Car Availability Quick Checker state (Image 5)
  const [quickCheckNumber, setQuickCheckNumber] = useState('AP 09 BK 4421');
  const [quickCheckDate, setQuickCheckDate] = useState('2026-11-20');
  const [quickCheckTime, setQuickCheckTime] = useState('10:00 AM');
  const [quickCheckResult, setQuickCheckResult] = useState(null);

  // Live Car Status List state (Image 5)
  const [liveCars, setLiveCars] = useState([
    { no: '01', carNo: '6465', plate: 'TN 09 BK 6465', driver: 'Alex Noman', status: 'Completed', statusColor: '#10b981', earning: '$ 35.44' },
    { no: '02', carNo: '5665', plate: 'TN 22 CX 5665', driver: 'Razib Rahman', status: 'Pending', statusColor: '#3b82f6', earning: '$ 0.00' },
    { no: '03', carNo: '1755', plate: 'KA 03 MN 1755', driver: 'Luke Norton', status: 'In route', statusColor: '#f59e0b', earning: '$ 23.50' }
  ]);

  // Attention Needed items (Image 4)
  const [attentionVehicles, setAttentionVehicles] = useState([
    { type: 'Overdue', title: 'Mercedes C-Class', plate: 'VOJJ6 • Cleo Chang Fritz Brooks' },
    { type: 'Overdue', title: 'Nissan Murano', plate: 'CHETF • Danielle Calhoun' },
    { type: 'Overdue', title: 'Ford Focus', plate: 'X3WDX • Stephanie Graham' },
    { type: 'Overdue', title: 'Ford Explorer', plate: 'T194W • Michelle Craig' }
  ]);

  // Owner state & verification
  const [ownerData, setOwnerData] = useState({
    id: 'HOST-4412',
    fullName: partnerDetails?.name || 'Venkata Vasanth Kumar',
    email: partnerDetails?.email || 'venkatavasanthkumarp1997@bnxmail.com',
    mobile: '9840122891',
    ownerType: 'Individual',
    kycStatus: 'Approved', // 'Pending Admin Verification' | 'Approved' | 'Rejected'
    state: 'Tamil Nadu',
    city: 'Chennai',
    pincode: '600002',
    idNumber: 'XXXX-XXXX-4819'
  });

  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleOwnerRegisterComplete = (registeredOwner) => {
    setOwnerData(registeredOwner);
    triggerToast('Host profile saved! Please proceed to KYC documents upload.');
    setCurrentView('owner_kyc');
  };

  const handleKycApproval = (status) => {
    setOwnerData(prev => ({
      ...prev,
      kycStatus: status
    }));
    triggerToast(`Host verification updated to: ${status}`);
  };

  const handleVehicleUploaded = (newVehicle) => {
    const formatted = {
      id: newVehicle.id,
      name: newVehicle.title,
      plate: newVehicle.basicInfo.registrationNumber,
      category: newVehicle.basicInfo.category,
      fuel: newVehicle.basicInfo.fuelType,
      transmission: newVehicle.basicInfo.transmission,
      rate: newVehicle.pricing.dailyRate,
      status: 'Available',
      statusPill: 'rental-status-approved',
      currentRenter: 'Ready for Pickup',
      rentDates: 'Available Now',
      image: newVehicle.images.frontView || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
      kycApproved: true,
      inspectionStatus: 'Clean'
    };

    setFleet([formatted, ...fleet]);
    triggerToast(`Vehicle ${formatted.name} successfully published to rental marketplace!`);
    setCurrentView('fleet_list');
  };

  const handleQuickAvailabilityCheck = () => {
    setQuickCheckResult({
      car: quickCheckNumber,
      available: true,
      message: `${quickCheckNumber} is Available for rent on ${quickCheckDate} at ${quickCheckTime}. Ready for instant dispatch!`
    });
  };

  return (
    <div className="rental-theme rental-container">
      {/* Toast popup */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 99999,
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
          {toastMsg}
        </div>
      )}

      {/* ================= SIDEBAR (Collapsible with Toggle Bite Tool) ================= */}
      <aside className={`rental-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="rental-sidebar-brand" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="rental-brand-icon">
              <i className="fa-solid fa-car-side"></i>
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '15.5px', color: '#0f172a' }}>Rental Console</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Enterprise Fleet Operations</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            style={{
              border: 'none',
              background: '#f1f5f9',
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
            title="Close Sidebar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="rental-sidebar-section-title">Overview</div>
        <button
          type="button"
          className={`rental-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <i className="fa-solid fa-table-columns"></i>
          <span>Dashboard</span>
        </button>





        <div className="rental-sidebar-section-title">Rental Fleet</div>
        <button
          type="button"
          className={`rental-nav-item ${currentView === 'fleet_list' ? 'active' : ''}`}
          onClick={() => setCurrentView('fleet_list')}
        >
          <i className="fa-solid fa-car"></i>
          <span>Vehicles in Fleet</span>
        </button>

        <button
          type="button"
          className={`rental-nav-item ${currentView === 'add_vehicle' ? 'active' : ''}`}
          onClick={() => {
            if (ownerData.kycStatus !== 'Approved') {
              alert('Please complete Host KYC Document Verification first!');
              setCurrentView('owner_kyc');
            } else {
              setCurrentView('add_vehicle');
            }
          }}
        >
          <i className="fa-solid fa-plus-circle"></i>
          <span>+ Add New Vehicle</span>
        </button>

        <button
          type="button"
          className={`rental-nav-item ${currentView === 'pricing_calendar' ? 'active' : ''}`}
          onClick={() => setCurrentView('pricing_calendar')}
        >
          <i className="fa-solid fa-calendar-days"></i>
          <span>Availability & Calendar</span>
        </button>

        {/* Listing Approval added in Sidebar */}
        <button
          type="button"
          className={`rental-nav-item ${currentView === 'listing_approval' ? 'active' : ''}`}
          onClick={() => setCurrentView('listing_approval')}
        >
          <i className="fa-solid fa-clipboard-check"></i>
          <span>Listing Approval</span>
        </button>

        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}>
              {ownerData.fullName.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {ownerData.fullName}
              </div>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
                <i className="fa-solid fa-circle-check"></i> KYC {ownerData.kycStatus}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT PANE ================= */}
      <div className="rental-main-content">
        {/* Floating Toggle Button (Visible when sidebar is closed to easily open it, matching second image hamburger) */}
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            title="Open Rental Console Sidebar"
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '24px',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
              cursor: 'pointer',
              zIndex: 9999
            }}
          >
            <i className="fa-solid fa-bars-staggered"></i>
          </button>
        )}

        {/* Body Views */}
        <div style={{ padding: '24px 32px 40px 32px' }}>
          {/* ================= VIEW: DASHBOARD (Recreated using Images 4 & 5) ================= */}
          {currentView === 'dashboard' && (
            <div>
              {/* Vehicle Status Operational Overview (Image 4) */}

              {/* Vehicle Status Operational Overview (Image 4) */}
              <div className="vehicle-status-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-regular fa-clock" style={{ color: '#2563eb' }}></i>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                        Vehicle Status
                      </h3>
                    </div>
                    <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                      Live operational overview for available, rented, overdue, maintenance and cleaning vehicles.
                    </p>
                  </div>


                </div>

                {/* 6 Status Counters */}
                <div className="vehicle-status-pills-row">
                  <div className="status-summary-item">
                    <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '18px' }}></i>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>34</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Available</div>
                    </div>
                  </div>

                  <div className="status-summary-item">
                    <i className="fa-solid fa-car-side" style={{ color: '#2563eb', fontSize: '18px' }}></i>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>0</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>On Rent</div>
                    </div>
                  </div>

                  <div className="status-summary-item">
                    <i className="fa-solid fa-bell" style={{ color: '#ef4444', fontSize: '18px' }}></i>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>13</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Overdue</div>
                    </div>
                  </div>

                  <div className="status-summary-item">
                    <i className="fa-solid fa-screwdriver-wrench" style={{ color: '#f59e0b', fontSize: '18px' }}></i>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>1</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Maintenance</div>
                    </div>
                  </div>

                  <div className="status-summary-item">
                    <i className="fa-solid fa-soap" style={{ color: '#8b5cf6', fontSize: '18px' }}></i>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>0</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Needs Cleaning</div>
                    </div>
                  </div>

                  <div className="status-summary-item">
                    <i className="fa-solid fa-key" style={{ color: '#06b6d4', fontSize: '18px' }}></i>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>3</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Ready for Pickup</div>
                    </div>
                  </div>
                </div>

                {/* Attention Needed Today Cards (Image 4) */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#334155' }}>Attention Needed Today</span>
                    <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '700', cursor: 'pointer' }}>Open board</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    {attentionVehicles.map((att, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #fecaca',
                          borderRadius: '12px',
                          padding: '14px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        <span style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          {att.type}
                        </span>
                        <div style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a', marginTop: '8px' }}>
                          {att.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px' }}>
                          {att.plate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Alert Chips (Image 4) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '20px' }}>
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: '700', color: '#dc2626' }}>
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      <span>Overdue Service</span>
                    </div>
                    <span style={{ background: '#dc2626', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' }}>
                      0
                    </span>
                  </div>

                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: '700', color: '#d97706' }}>
                      <i className="fa-solid fa-shield-halved"></i>
                      <span>Insurance Expiring</span>
                    </div>
                    <span style={{ background: '#d97706', color: '#ffffff', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: '800' }}>
                      153
                    </span>
                  </div>

                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: '700', color: '#b45309' }}>
                      <i className="fa-solid fa-clipboard-list"></i>
                      <span>Inspection Due</span>
                    </div>
                    <span style={{ background: '#b45309', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' }}>
                      0
                    </span>
                  </div>

                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: '700', color: '#2563eb' }}>
                      <i className="fa-solid fa-wrench"></i>
                      <span>Out of Service</span>
                    </div>
                    <span style={{ background: '#2563eb', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' }}>
                      1
                    </span>
                  </div>
                </div>
              </div>

              {/* Car Availability & Live Car Status (Matching Image 5) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '20px', marginBottom: '24px' }}>
                {/* Left Card: Car Availability Checker */}
                <div className="rental-form-card" style={{ height: 'fit-content' }}>
                  <div className="rental-section-header">
                    <h3>Car Availability</h3>
                    <p>Check vehicle dispatch status by plate & time</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="rental-field-group">
                      <label className="rental-label">Select Car Number</label>
                      <select
                        className="rental-select"
                        value={quickCheckNumber}
                        onChange={(e) => setQuickCheckNumber(e.target.value)}
                      >
                        <option value="AP 09 BK 4421">AP 09 BK 4421 (Hyundai Creta)</option>
                        <option value="TN 22 CX 9012">TN 22 CX 9012 (Toyota Camry)</option>
                        <option value="TN 07 AQ 8812">TN 07 AQ 8812 (Maruti Ertiga)</option>
                        <option value="KA 03 MN 7710">KA 03 MN 7710 (Mahindra Thar)</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="rental-field-group">
                        <label className="rental-label">Date</label>
                        <input
                          type="date"
                          className="rental-input"
                          value={quickCheckDate}
                          onChange={(e) => setQuickCheckDate(e.target.value)}
                        />
                      </div>
                      <div className="rental-field-group">
                        <label className="rental-label">Time</label>
                        <select
                          className="rental-select"
                          value={quickCheckTime}
                          onChange={(e) => setQuickCheckTime(e.target.value)}
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rental-btn-primary"
                      onClick={handleQuickAvailabilityCheck}
                      style={{ justifyContent: 'center', marginTop: '6px' }}
                    >
                      <i className="fa-solid fa-magnifying-glass"></i> Check Availability
                    </button>

                    {quickCheckResult && (
                      <div style={{
                        marginTop: '10px',
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        borderRadius: '10px',
                        padding: '12px',
                        fontSize: '12.5px',
                        color: '#065f46',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <i className="fa-solid fa-circle-check" style={{ color: '#059669', fontSize: '16px' }}></i>
                        <span>{quickCheckResult.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Card: Live Car Status Table (Matching Image 5) */}
                <div className="rental-form-card">
                  <div className="rental-section-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h3>Live Car Status</h3>
                        <p>Real-time transit and rental trip monitoring</p>
                      </div>
                      <button
                        type="button"
                        style={{
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <i className="fa-solid fa-sliders"></i> Filter
                      </button>
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                          <th style={{ padding: '10px 12px' }}>No.</th>
                          <th style={{ padding: '10px 12px' }}>Car no.</th>
                          <th style={{ padding: '10px 12px' }}>Driver / Renter</th>
                          <th style={{ padding: '10px 12px' }}>Status</th>
                          <th style={{ padding: '10px 12px' }}>Earning</th>
                          <th style={{ padding: '10px 12px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveCars.map((car) => (
                          <tr key={car.no} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px', color: '#94a3b8', fontWeight: '600' }}>{car.no}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                background: '#f1f5f9',
                                color: '#1e293b',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontWeight: '700',
                                fontSize: '12px'
                              }}>
                                {car.carNo}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  background: '#e0e7ff',
                                  color: '#4338ca',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {car.driver.charAt(0)}
                                </div>
                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{car.driver}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: car.statusColor }}></span>
                                <span style={{ color: car.statusColor }}>{car.status}</span>
                              </span>
                            </td>
                            <td style={{ padding: '12px', fontWeight: '800', color: '#0f172a' }}>
                              {car.earning}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <button
                                type="button"
                                className="rental-btn-primary"
                                style={{ padding: '5px 12px', fontSize: '12px' }}
                                onClick={() => alert(`Details for Trip ${car.carNo}`)}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>


            </div>
          )}

          {/* VIEW: OWNER REGISTRATION */}
          {currentView === 'owner_register' && (
            <OwnerRegistration
              onRegistrationComplete={handleOwnerRegisterComplete}
              existingOwner={ownerData}
            />
          )}

          {/* VIEW: OWNER KYC VERIFICATION */}
          {currentView === 'owner_kyc' && (
            <OwnerKycVerification
              owner={ownerData}
              onAdminApprove={handleKycApproval}
              onKycSubmitted={(next) => setCurrentView(next)}
            />
          )}

          {/* VIEW: ADD VEHICLE */}
          {currentView === 'add_vehicle' && (
            <VehicleUploadForm
              isOwnerVerified={ownerData.kycStatus === 'Approved'}
              onVehicleUploaded={handleVehicleUploaded}
              onCancel={() => setCurrentView('fleet_list')}
            />
          )}

          {/* VIEW: LISTING APPROVAL (Added to Sidebar & Ribbon) */}
          {currentView === 'listing_approval' && (
            <div style={{ maxWidth: '980px', margin: '0 auto' }}>
              <div className="rental-form-card">
                <div className="rental-section-header">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3>Step 5: Vehicle Listing Approval Console</h3>
                      <p>Final admin review of vehicle eligibility, documents, RC, pricing & insurance before going live</p>
                    </div>
                    <span style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: '1px solid #a7f3d0'
                    }}>
                      Commercial Rental Eligible
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {fleet.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        flexWrap: 'wrap',
                        gap: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '80px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            Plate: <strong>{item.plate}</strong> • Category: {item.category} • Rate: <strong>{item.rate}</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
                              <i className="fa-solid fa-circle-check"></i> RC Approved
                            </span>
                            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
                              <i className="fa-solid fa-shield-check"></i> Insurance Valid
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`rental-status-pill ${item.statusPill}`}>
                          {item.status}
                        </span>
                        <button
                          type="button"
                          className="rental-btn-success"
                          style={{ fontSize: '12.5px', padding: '7px 14px' }}
                          onClick={() => triggerToast(`Listing Approved for ${item.name}! Published live to customer app.`)}
                        >
                          <i className="fa-solid fa-check-double"></i> Approve & Publish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: FLEET LIST */}
          {currentView === 'fleet_list' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
                    Vehicles in Rental Fleet
                  </h2>
                  <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                    Manage listings, inspection logs, and verified commercial rental assets
                  </p>
                </div>

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {fleet.map((v) => (
                  <div key={v.id} className="rental-form-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: '180px' }}>
                      <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: '700'
                      }}>
                        {v.plate}
                      </span>
                      <span className={`rental-status-pill ${v.statusPill}`} style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        {v.status}
                      </span>
                    </div>

                    <div style={{ padding: '20px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase' }}>
                        {v.category} • {v.fuel} • {v.transmission}
                      </div>
                      <h3 style={{ margin: '4px 0 10px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                        {v.name}
                      </h3>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '14px' }}>
                        <span style={{ color: '#64748b' }}>Daily Self-Drive Rate</span>
                        <strong style={{ color: '#0f172a', fontSize: '16px' }}>{v.rate}</strong>
                      </div>

                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700' }}>
                          <i className="fa-solid fa-file-circle-check"></i> RC Verified
                        </span>
                        <button
                          type="button"
                          className="rental-btn-secondary"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                          onClick={() => setCurrentView('pricing_calendar')}
                        >
                          <i className="fa-solid fa-calendar-days"></i> Manage Calendar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: PRICING & CALENDAR */}
          {currentView === 'pricing_calendar' && (
            <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
                    Rental Pricing & Availability Calendar
                  </h2>
                  <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                    Configure hourly, daily, weekend rates and block unavailable or maintenance dates
                  </p>
                </div>
                <button
                  type="button"
                  className="rental-btn-secondary"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
                </button>
              </div>

              <VehiclePricingCalendar
                pricing={{
                  hourlyRate: '₹250/hour',
                  dailyRate: '₹2,000/day',
                  weekendRate: '₹2,500/day',
                  weeklyRate: '₹12,000/week',
                  securityDeposit: '₹5,000',
                  extraKmCharge: '₹12/km',
                  lateReturnCharge: '₹200/hour',
                  minDuration: '4 Hours',
                  pickupTime: '06:00',
                  returnTime: '23:30'
                }}
                onPricingChange={() => triggerToast('Pricing preferences updated!')}
                calendar={{
                  dates: {
                    10: 'booked',
                    11: 'booked',
                    12: 'booked',
                    18: 'maintenance',
                    24: 'blocked'
                  }
                }}
                onCalendarChange={() => triggerToast('Availability calendar updated!')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
