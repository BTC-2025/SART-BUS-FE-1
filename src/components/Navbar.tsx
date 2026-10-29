import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({
  partnerDetails,
  onOpenProfile,
  onOpenLocationModal,
  activeTab = 'home',
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
    <div className="sart-enterprise-navbar-wrapper">
      {/* 1. TOP MAIN NAV: Dark Green (#062c20) matching User's 2nd Screenshot */}
      <header className="top-main-navbar">
        {/* Left Side: Brand Logo + Location Badge */}
        <div className="nav-left-section">
          {/* SART Business Brand */}
          <div className="brand-logo-container" onClick={() => onNavigate('home')} title="SART Business">
            <img
              src="/images/sart_business_logo.png"
              alt="SART Business"
              className="navbar-brand-img"
            />
          </div>

          {/* Location Badge (White Pill style matching 2nd screenshot) */}
          <div
            className="navbar-location-pill"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLocationModal && onOpenLocationModal();
            }}
            title="Select City Location"
          >
            <i className="fa-solid fa-location-dot"></i>
            <span>{partnerDetails?.city || 'Chennai'}</span>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </div>

        {/* Center: Segmented Navigation Capsule exactly like Screenshot */}
        <div className="nav-center-section">
          <div className="home-segmented-container">
            <button
              type="button"
              className={`segmented-pill-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              <span>Home</span>
            </button>
            <button
              type="button"
              className={`segmented-pill-item ${activeTab === 'store' || activeTab === 'rentals' ? 'active' : ''}`}
              onClick={() => onNavigate('rentals')}
            >
              <span>Store</span>
            </button>
            <button
              type="button"
              className={`segmented-pill-item ${activeTab === 'tracks' || activeTab === 'carriers' ? 'active' : ''}`}
              onClick={() => onNavigate('carriers')}
            >
              <span>Tracks</span>
            </button>
          </div>
        </div>

        {/* Right Side: FIN-PRO Pill Badge + Profile Pill (Sai / venkatavasantha...) + Settings / Bit-Tool Slider */}
        <div className="nav-right-section">
          {/* FIN-PRO Badge matching User Screenshot */}
          <button type="button" className="nav-finpro-badge" title="FIN-PRO Business Suite">
            <i className="fa-solid fa-briefcase"></i>
            <span>FIN-PRO</span>
          </button>

          {/* User / Partner Profile Pill */}
          <div className="profile-pill-wrapper" ref={profileMenuRef}>
            <button
              type="button"
              className="profile-pill-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <div className="profile-avatar-icon">
                <i className="fa-regular fa-circle-user"></i>
              </div>
              <span className="profile-user-name">
                {partnerDetails?.name ? partnerDetails.name.slice(0, 14) + (partnerDetails.name.length > 14 ? '...' : '') : 'Sai'}
              </span>
              <i className="fa-solid fa-chevron-down profile-caret"></i>
            </button>

            {isProfileDropdownOpen && (
              <div className="navbar-profile-dropdown-card">
                <div className="dropdown-user-header">
                  <div className="dropdown-avatar">
                    <i className="fa-solid fa-user-shield"></i>
                  </div>
                  <div className="dropdown-user-info">
                    <div className="dropdown-name">{partnerDetails?.name || 'Sai'}</div>
                    <div className="dropdown-email">{partnerDetails?.email || 'sai@bnxmail.com'}</div>
                    <span className="dropdown-verified-badge">
                      <i className="fa-solid fa-shield-check"></i> Verified Partner
                    </span>
                  </div>
                </div>

                <div className="dropdown-menu-list">
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('home');
                    }}
                  >
                    <i className="fa-solid fa-chart-pie"></i> Unified Dashboard
                  </button>
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('rentals');
                    }}
                  >
                    <i className="fa-solid fa-car-side"></i> Rental Fleet
                  </button>
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('carriers');
                    }}
                  >
                    <i className="fa-solid fa-truck-moving"></i> Carrier Cargo
                  </button>
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('drivers');
                    }}
                  >
                    <i className="fa-solid fa-user-tie"></i> Hire Drivers
                  </button>
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('parking');
                    }}
                  >
                    <i className="fa-solid fa-square-parking"></i> Parking Slots
                  </button>
                  <div className="dropdown-divider"></div>
                  <button
                    type="button"
                    className="dropdown-menu-item signout"
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

          {/* End Settings / Bit-Tool Slider Button */}
          <button
            type="button"
            className="nav-header-tool-btn"
            title="Business Tools & Customization"
            onClick={() => onNavigate('home')}
          >
            <i className="fa-solid fa-sliders"></i>
          </button>
        </div>
      </header>

      {/* 2. SUB NAV BAR: Deep Royal Blue (#002878) matching User's 1st Screenshot */}
      <nav className="sub-category-navbar">
        <div className="sub-nav-tabs-wrapper">
          {/* Tab 1: Rental Vehicles */}
          <button
            type="button"
            className={`sub-nav-pill-btn ${activeTab === 'rentals' ? 'active' : ''}`}
            onClick={() => onNavigate('rentals')}
          >
            <i className="fa-solid fa-car"></i>
            <span>Rentals</span>
          </button>

          {/* Tab 2: Carrier (Cargo & Trucks) */}
          <button
            type="button"
            className={`sub-nav-pill-btn ${activeTab === 'carriers' ? 'active' : ''}`}
            onClick={() => onNavigate('carriers')}
          >
            <i className="fa-solid fa-truck-moving"></i>
            <span>Carriers</span>
          </button>

          {/* Tab 3: Hire Drivers */}
          <button
            type="button"
            className={`sub-nav-pill-btn ${activeTab === 'drivers' ? 'active' : ''}`}
            onClick={() => onNavigate('drivers')}
          >
            <i className="fa-solid fa-user-tie"></i>
            <span>Drivers</span>
          </button>

          {/* Tab 4: Safe Parking */}
          <button
            type="button"
            className={`sub-nav-pill-btn ${activeTab === 'parking' ? 'active' : ''}`}
            onClick={() => onNavigate('parking')}
          >
            <i className="fa-solid fa-square-parking"></i>
            <span>Parking</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
