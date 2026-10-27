import React, { useState, useRef, useEffect } from 'react';

export default function Navbar({
  partnerDetails,
  onOpenProfile,
  onOpenLocationModal,
  activeSubTab = 'carrier',
  setActiveSubTab = () => { },
  onNavigate = () => { },
  onLogout = () => { }
}) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3 Primary Navigation Tabs: Home, Categories, Bookings
  const navTabs = [
    { id: 'home', label: 'Home', route: 'home' },
    { id: 'categories', label: 'Categories', route: 'store' },
    { id: 'bookings', label: 'Bookings', route: 'all_bookings' }
  ];

  return (
    <div className="sart-business-nav-wrapper">
      {/* 1. Main Navbar */}
      <header className="sart-biz-main-navbar">
        {/* Brand: SART BUSINESS */}
        <div className="sart-biz-brand-area" onClick={() => onNavigate('home')}>
          <div className="sart-biz-logo-box">
            <img
              src="/images/sart_business_logo.jpg"
              alt="SART Business"
              style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="sart-biz-logo-text" style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              SART
            </span>
            <span className="sart-biz-badge" style={{ background: '#10b981', color: '#ffffff', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
              BUSINESS
            </span>
          </div>

          {/* Location indicator */}
          <div
            className="sart-biz-location-pill"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLocationModal && onOpenLocationModal();
            }}
            title="Choose Regional Fleet Hub"
          >
            <i className="fa-solid fa-location-dot" style={{ color: '#10b981' }}></i>
            <span>{partnerDetails?.city || 'Chennai'}</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#94a3b8' }}></i>
          </div>
        </div>

        {/* Center Nav: Home | Categories | Bookings */}
        <div className="sart-biz-nav-center-pills">
          {navTabs.map((tab) => {
            const isActive =
              activeSubTab === tab.id ||
              activeSubTab === tab.route ||
              (tab.id === 'categories' && (activeSubTab === 'store' || activeSubTab === 'vehicle_rental' || activeSubTab === 'spare_parts')) ||
              (tab.id === 'bookings' && (activeSubTab === 'booking' || activeSubTab === 'carrier' || activeSubTab === 'all_bookings' || activeSubTab === 'parking' || activeSubTab === 'hire_drivers'));

            return (
              <button
                key={tab.id}
                type="button"
                className={`sart-biz-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveSubTab(tab.route);
                  onNavigate(tab.route);
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section: GST Status, Alerts & Partner Profile Dropdown */}
        <div className="sart-biz-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>


          {/* Profile Menu */}
          <div className="sart-biz-profile-container" ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="sart-biz-profile-pill"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '6px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                color: '#ffffff'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#10b981',
                color: '#ffffff',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px'
              }}>
                {partnerDetails?.name ? partnerDetails.name.charAt(0).toUpperCase() : 'B'}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{partnerDetails?.name || 'Partner'}</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#94a3b8' }}></i>
            </button>

            {isProfileDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '290px',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                border: '1px solid #e2e8f0',
                padding: '20px',
                zIndex: 1000
              }}>
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#0A382C',
                    color: '#ffffff',
                    fontSize: '24px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px auto'
                  }}>
                    {partnerDetails?.name ? partnerDetails.name.charAt(0).toUpperCase() : 'B'}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>{partnerDetails?.name}</div>
                  <div style={{ fontSize: '12.5px', color: '#64748b' }}>{partnerDetails?.email}</div>
                  <div style={{ fontSize: '11.5px', color: '#10b981', fontWeight: '700', marginTop: '4px' }}>
                    Corporate @bnxmail.com Partner
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenProfile();
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#f8fafc',
                      color: '#334155',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fa-solid fa-address-card"></i>
                    Compliance & KYC Profile
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onLogout();
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#fef2f2',
                      color: '#dc2626',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Subnav Bar Below the Main Nav */}
      <nav className="sart-biz-subnavbar">
        <div className="sart-biz-subnav-items">
          {[
            // { id: 'dashboard', label: 'Dashboard Hub', icon: 'fa-chart-line', route: 'home' },
            { id: 'vehicle_rental', label: 'Vehicles', icon: 'fa-car', route: 'store' },
            { id: 'carrier', label: 'Cargo & Trucks', icon: 'fa-truck-moving', route: 'booking' },
            { id: 'hire_drivers', label: 'Driver Hiring', icon: 'fa-user-tie', route: 'hire_drivers' },
            { id: 'parking', label: 'Parking Slots', icon: 'fa-square-parking', route: 'parking' },
            { id: 'spare_parts', label: 'Spare Parts & Store', icon: 'fa-gears', route: 'spare_parts' },
            // { id: 'all_bookings', label: 'All Bookings', icon: 'fa-calendar-check', route: 'all_bookings' }
          ].map((item) => {
            const isSubActive =
              activeSubTab === item.id ||
              activeSubTab === item.route ||
              (activeSubTab === 'home' && item.id === 'dashboard') ||
              (activeSubTab === 'booking' && item.id === 'carrier') ||
              (activeSubTab === 'store' && item.id === 'vehicle_rental');

            return (
              <button
                key={item.id}
                type="button"
                className={`sart-biz-subnav-tab ${isSubActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveSubTab(item.route);
                  onNavigate(item.route);
                }}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="sart-biz-subnav-meta">

        </div>
      </nav>
    </div>
  );
}
