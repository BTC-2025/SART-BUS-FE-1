import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';

interface NavbarProps {
  partnerDetails?: any;
  onOpenProfile?: () => void;
  onOpenLocationModal?: () => void;
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  onLogout?: () => void;
  isSideToolOpen?: boolean;
  onToggleSideTool?: () => void;
  showSubNav?: boolean;
}

export default function Navbar({
  partnerDetails,
  onOpenProfile,
  onOpenLocationModal,
  activeTab = 'home',
  onNavigate = (_tab?: string) => { },
  onLogout = () => { },
  isSideToolOpen = true,
  onToggleSideTool = () => { },
  showSubNav = false
}: NavbarProps) {
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

        {/* Right Side: Search Icon + Notification Bell + User Profile Capsule + Filter Slider Tool matching User Screenshot 1 */}
        <div className="nav-right-section">
          {/* 1. Search Icon Button */}
          <button type="button" className="nav-circle-action-btn" title="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>

          {/* 2. Notification Bell Icon Button */}
          <button type="button" className="nav-circle-action-btn" title="Notifications">
            <i className="fa-regular fa-bell"></i>
          </button>

          {/* 3. User Account Capsule Button & Dropdown matching Screenshot 1 */}
          <div className="profile-pill-wrapper" ref={profileMenuRef}>
            <button
              type="button"
              className={`nav-account-capsule-btn ${isProfileDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              title="Account Menu"
            >
              <div className="account-avatar-circle">
                <i className="fa-regular fa-user"></i>
              </div>
              <span className="account-user-name">
                {partnerDetails?.name || 'venkatavasa...'}
              </span>
              <i className={`fa-solid fa-chevron-up account-caret ${isProfileDropdownOpen ? '' : 'caret-down'}`}></i>
            </button>

            {/* Profile Dropdown Modal matching Screenshot 1 */}
            {isProfileDropdownOpen && (
              <div className="account-profile-popover-card">
                {/* Big Blue Avatar with Camera Badge */}
                <div className="popover-avatar-wrap">
                  <div className="popover-avatar-circle">
                    <span>{partnerDetails?.name ? partnerDetails.name.charAt(0).toUpperCase() : 'V'}</span>
                    <button type="button" className="avatar-camera-btn" title="Change Avatar">
                      <i className="fa-solid fa-camera"></i>
                    </button>
                  </div>
                </div>

                {/* Name & Email */}
                <div className="popover-user-identity">
                  <h3 className="popover-name">{partnerDetails?.name || 'venkatavasanthakumarp1997'}</h3>
                  <p className="popover-email">{partnerDetails?.email || 'venkatavasanthakumarp1997@bnxm...'}</p>
                </div>

                {/* Make it Primary Pill */}
                <div className="popover-primary-status">
                  <i className="fa-regular fa-circle-check"></i>
                  <span>Make it Primary</span>
                </div>

                {/* Manage Your Account Pill Button */}
                <div className="popover-manage-box">
                  <button type="button" className="popover-manage-pill-btn" onClick={() => onNavigate('home')}>
                    <i className="fa-regular fa-user"></i>
                    <span>Manage your account</span>
                  </button>
                </div>

                <div className="popover-separator"></div>

                {/* Action Items List */}
                <div className="popover-actions-list">
                  <button type="button" className="popover-action-row" onClick={() => onNavigate('home')}>
                    <i className="fa-regular fa-building"></i>
                    <span>Manage Branches</span>
                  </button>

                  <button type="button" className="popover-action-row" onClick={() => onNavigate('home')}>
                    <i className="fa-solid fa-users-viewfinder"></i>
                    <span>Manage SubIDs</span>
                  </button>

                  <button type="button" className="popover-action-row" onClick={() => onNavigate('home')}>
                    <i className="fa-solid fa-user-plus"></i>
                    <span>Add another account</span>
                  </button>

                  <button type="button" className="popover-action-row" onClick={() => onLogout()}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Sign out of all accounts</span>
                  </button>
                </div>

                <div className="popover-separator"></div>

                {/* Red Sign out Button */}
                <button
                  type="button"
                  className="popover-signout-danger-btn"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onLogout();
                  }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Filter / Sliders Icon Button matching Screenshot 1 */}
          <button
            type="button"
            className="nav-slider-control-btn"
            title="Dashboard Settings & Layout Controls"
            onClick={onToggleSideTool}
          >
            <i className="fa-solid fa-sliders"></i>
          </button>
        </div>
      </header>

      {/* 2. SUB NAV BAR: Render only if showSubNav is true */}
      {showSubNav && (
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
      )}
    </div>
  );
}
