import React, { useState, useRef, useEffect } from 'react';

export default function CaptainHeader({
  partnerDetails,
  isOnDuty,
  setIsOnDuty,
  onOpenProfile,
  onOpenLocationModal,
  activeSubTab = 'rides',
  setActiveSubTab = () => { }
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

  const mainSubNavItems = [
    { id: 'rides', label: 'Rides', icon: 'fa-layer-group', route: 'ride-home' },
    { id: 'carrier', label: 'Carrier & Cargo', icon: 'fa-truck', route: 'ride-car' },
    { id: 'driver', label: 'Hire Drivers', icon: 'fa-user-tie', route: 'ride-auto' },
    { id: 'parking', label: 'Parking Slots', icon: 'fa-square-p', route: 'ride-home' }
  ];

  const rideCategories = [
    { id: 'rides', label: 'All Rides', icon: 'fa-layer-group', route: 'ride-home' },
    { id: 'bike', label: 'Bike Moto', icon: 'fa-motorcycle', route: 'ride-bike' },
    { id: 'auto', label: 'Auto Rickshaw', icon: 'fa-truck-front', route: 'ride-auto' },
    { id: 'car', label: 'Cab & Car', icon: 'fa-car-side', route: 'ride-car' }
  ];

  // If user is inside Rides section (rides, bike, auto, car), show the 3 vehicle categories:
  const isRideSection = ['rides', 'bike', 'auto', 'car'].includes(activeSubTab);


  return (
    <div className="sart-business-nav-wrapper">
      {/* 1. Main Navbar (Deep emerald green background matching customer portal) */}
      <header className="sart-biz-main-navbar">
        {/* Brand: SART BUSINESS */}
        <div className="sart-biz-brand-area" onClick={() => window.location.href = '/'}>
          <div className="sart-biz-logo-box">
            <i className="fa-solid fa-compass-drafting sart-biz-logo-icon"></i>
            <span className="sart-biz-logo-text">SART</span>
            <span className="sart-biz-badge">BUSINESS</span>
          </div>

          {/* Location indicator with Enable Location Modal trigger */}
          <div
            className="sart-biz-location-pill"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLocationModal && onOpenLocationModal();
            }}
            title="Click to Enable Location / Choose Manually"
          >
            <i className="fa-solid fa-location-dot" style={{ color: '#10b981' }}></i>
            <span>{partnerDetails?.city || 'Chennai'}</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#94a3b8' }}></i>
          </div>
        </div>

        {/* Center Navigation Tabs (Pill Container) */}
        <div className="sart-biz-nav-center-pills">
          <button
            type="button"
            className="sart-biz-pill-btn active"
            onClick={() => window.location.href = '/'}
          >
            Home
          </button>
          <button
            type="button"
            className="sart-biz-pill-btn"
            onClick={() => onOpenProfile()}
          >
            Fleet & Store
          </button>
          <button
            type="button"
            className="sart-biz-pill-btn"
            onClick={() => onOpenProfile()}
          >
            Live Tracks
          </button>
        </div>

        {/* Right Section: Duty Switch, Icons, and Google-style Profile Menu */}
        <div className="sart-biz-nav-right">
          {/* Duty Switch Pill */}
          <div
            className={`sart-biz-duty-pill ${isOnDuty ? 'on' : 'off'}`}
            onClick={() => setIsOnDuty(!isOnDuty)}
            title="Toggle Captain Duty Status"
          >
            <span className="duty-dot"></span>
            <span>{isOnDuty ? 'ON DUTY' : 'OFF DUTY'}</span>
          </div>

          {/* Search Icon */}
          <button type="button" className="sart-biz-icon-btn" title="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>

          {/* Favorites */}
          <button type="button" className="sart-biz-icon-btn" title="Favorites">
            <i className="fa-solid fa-heart"></i>
          </button>

          {/* Notifications */}
          <button type="button" className="sart-biz-icon-btn" title="Orders & Alerts" style={{ position: 'relative' }}>
            <i className="fa-solid fa-bag-shopping"></i>
            <span className="sart-biz-cart-badge">3</span>
          </button>

          {/* Profile Button with Google-style Dropdown Popup */}
          <div className="sart-biz-profile-container" ref={profileMenuRef}>
            <button
              type="button"
              id="sart-biz-profile-trigger"
              className="sart-biz-profile-pill"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <div className="sart-biz-avatar-circle">
                {partnerDetails?.name ? partnerDetails.name.charAt(0).toUpperCase() : 'V'}
              </div>
              <span className="sart-biz-partner-name">{partnerDetails?.name || 'Sai'}</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#94a3b8' }}></i>
            </button>

            {/* Profile Dropdown Popup (Matching Google/Vinothkumar Card in 3rd Screenshot) */}
            {isProfileDropdownOpen && (
              <div className="sart-biz-profile-dropdown-card">
                {/* Big Avatar with Camera edit icon */}
                <div className="sart-biz-dropdown-avatar-wrap">
                  <div className="sart-biz-dropdown-big-avatar">
                    {partnerDetails?.name ? partnerDetails.name.charAt(0).toUpperCase() : 'V'}
                  </div>
                  <div className="sart-biz-dropdown-camera-btn" title="Change Profile Photo">
                    <i className="fa-solid fa-camera"></i>
                  </div>
                </div>

                <div className="sart-biz-dropdown-user-name">
                  {partnerDetails?.name || 'vinothkumar'}
                </div>
                <div className="sart-biz-dropdown-user-email">
                  {partnerDetails?.email || 'gmvinoth@bnxmail.com'}
                </div>

                {/* Manage Your Account pill button */}
                <button
                  type="button"
                  className="sart-biz-manage-account-btn"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onOpenProfile();
                  }}
                >
                  <i className="fa-solid fa-user-gear"></i>
                  <span>Manage your account</span>
                </button>

                <div className="sart-biz-dropdown-divider"></div>

                {/* Menu Action List */}
                <div className="sart-biz-dropdown-actions">
                  <div
                    className="sart-biz-dropdown-item"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenProfile();
                    }}
                  >
                    <i className="fa-solid fa-user-plus"></i>
                    <span>Add another account</span>
                  </div>

                  <div
                    className="sart-biz-dropdown-item"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenProfile();
                    }}
                  >
                    <i className="fa-solid fa-headset"></i>
                    <span>Help & Support</span>
                  </div>

                  <div
                    className="sart-biz-dropdown-item"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenProfile();
                    }}
                  >
                    <i className="fa-solid fa-gear"></i>
                    <span>Settings</span>
                  </div>

                  <div
                    className="sart-biz-dropdown-item danger"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenProfile();
                    }}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Sign out of this account</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Sub-Navbar: Primary Services & Rides Category Explorer */}
      <nav className="sart-biz-subnavbar">
        <div className="sart-biz-subnav-items">
          {mainSubNavItems.map((item) => {
            const isItemActive = item.id === 'rides' ? isRideSection : activeSubTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sart-biz-subnav-tab ${isItemActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveSubTab(item.id);
                  if (item.route) {
                    const targetPath = item.route === 'ride-home' ? '/home/ride' : item.route === 'ride-bike' ? '/home/ride/bike' : item.route === 'ride-auto' ? '/home/ride/auto' : '/home/ride/car';
                    window.history.pushState({}, '', targetPath);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="sart-biz-subnav-meta">
          <div className="sart-biz-subnav-status">
            <span className="sart-biz-pulse-dot"></span>
            <span>Live Business Fleet Radar: <strong>Active</strong></span>
          </div>
        </div>
      </nav>

      {/* 3. Rides Inner Category Strip - Appears ONLY when user clicks / is in the Rides page */}
      {isRideSection && (
        <div className="sart-biz-category-strip">
          <div className="sart-biz-category-strip-inner">
            <div className="sart-biz-cat-title">
              <i className="fa-solid fa-list-check"></i>
              <span>Ride Category Fleet:</span>
            </div>
            <div className="sart-biz-category-pills">
              {rideCategories.map((cat) => {
                const isCatActive = activeSubTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`sart-biz-cat-pill ${isCatActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSubTab(cat.id);
                      if (cat.route) {
                        const targetPath = cat.route === 'ride-home' ? '/home/ride' : cat.route === 'ride-bike' ? '/home/ride/bike' : cat.route === 'ride-auto' ? '/home/ride/auto' : '/home/ride/car';
                        window.history.pushState({}, '', targetPath);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                    }}
                  >
                    <i className={`fa-solid ${cat.icon}`}></i>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

