import React, { useState, useRef, useEffect } from 'react';

export default function Navbar({
  partnerDetails,
  onOpenProfile,
  onOpenLocationModal,
  activeSubTab = 'home',
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

  return (
    <div className="sart-rental-nav-wrapper">
      {/* 1. Main Navbar (Blue theme matching User's Image 1 & 2: Rental Partner | Rentals | Carriers | Drivers | Parking) */}
      <header className="rental-main-navbar">
        {/* Brand: Rental Partner */}
        <div className="rental-brand-area" onClick={() => onNavigate('home')}>
          <div className="rental-logo-box">
            <i className="fa-solid fa-car-tunnel rental-brand-icon"></i>
            <span className="rental-brand-text">Rental Partner</span>
          </div>

          {/* Location indicator */}
          <div
            className="rental-location-pill"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLocationModal && onOpenLocationModal();
            }}
            title="Choose Fleet Hub Location"
          >
            <i className="fa-solid fa-location-dot"></i>
            <span>{partnerDetails?.city || 'Pune'}</span>
            <i className="fa-solid fa-chevron-down caret-icon"></i>
          </div>
        </div>

        {/* Center Nav: Rentals (Active), Carriers, Drivers, Parking (from Image 2 header) */}
        <div className="rental-nav-center-links">
          <button
            type="button"
            className={`rental-nav-link ${activeSubTab === 'home' || activeSubTab === 'rentals' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <i className="fa-solid fa-car-rear"></i>
            <span>Rentals</span>
          </button>
          <button
            type="button"
            className={`rental-nav-link ${activeSubTab === 'categories' ? 'active' : ''}`}
            onClick={() => onNavigate('categories')}
          >
            <i className="fa-solid fa-layer-group"></i>
            <span>Categories</span>
          </button>
          <button
            type="button"
            className="rental-nav-link disabled-tab"
            title="Carrier Fleet Hub"
          >
            <i className="fa-solid fa-truck-moving"></i>
            <span>Carriers</span>
          </button>
          <button
            type="button"
            className="rental-nav-link disabled-tab"
            title="Chauffeur & Drivers"
          >
            <i className="fa-solid fa-user-tie"></i>
            <span>Drivers</span>
          </button>
          <button
            type="button"
            className="rental-nav-link disabled-tab"
            title="Safe Parking Slots"
          >
            <i className="fa-solid fa-square-parking"></i>
            <span>Parking</span>
          </button>
        </div>

        {/* Right Section: Owner Account Dropdown */}
        <div className="rental-nav-right-area">
          <div className="rental-profile-wrapper" ref={profileMenuRef}>
            <button
              type="button"
              className="rental-profile-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <div className="avatar-circle">
                <i className="fa-solid fa-user"></i>
              </div>
              <span className="owner-title">{partnerDetails?.name || 'Owner Account'}</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '11px', color: '#cbd5e1' }}></i>
            </button>

            {isProfileDropdownOpen && (
              <div className="rental-profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="avatar-circle lg">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="profile-name">{partnerDetails?.name || 'Fleet Owner'}</div>
                  <div className="profile-email">{partnerDetails?.email || 'owner@sartbusiness.com'}</div>
                  <span className="badge-verified">Verified Partner</span>
                </div>
                <div className="profile-dropdown-actions">
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenProfile();
                    }}
                  >
                    <i className="fa-solid fa-gauge-high"></i> Dashboard
                  </button>
                  <button
                    type="button"
                    className="dropdown-item danger"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
