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
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown & search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const partnerName = partnerDetails?.name || 'Sai';
  const [currentCity, setCurrentCity] = useState(
    partnerDetails?.city || (typeof window !== 'undefined' ? localStorage.getItem('sart_owner_location') : '') || 'Katpadi'
  );

  useEffect(() => {
    if (partnerDetails?.city) {
      setCurrentCity(partnerDetails.city);
    }
  }, [partnerDetails?.city]);

  useEffect(() => {
    const handleLocationUpdate = (e: any) => {
      if (e.detail?.city) {
        setCurrentCity(e.detail.city);
      } else if (typeof e.detail === 'string') {
        setCurrentCity(e.detail);
      }
    };
    window.addEventListener('updateBusinessLocation', handleLocationUpdate);
    return () => {
      window.removeEventListener('updateBusinessLocation', handleLocationUpdate);
    };
  }, []);

  const partnerEmail = partnerDetails?.email || 'sai@sartbusiness.com';

  const SEARCH_OPTIONS = [
    { title: 'Fleet Rental Management', kw: ['rental', 'cars', 'bikes', 'scooters', 'vehicles'], tab: 'rentals', icon: 'fa-car' },
    { title: 'Logistics Carriers & Freight', kw: ['carrier', 'truck', 'logistics', 'delivery', 'cargo'], tab: 'carriers', icon: 'fa-truck' },
    { title: 'Hire Drivers & Chauffeurs', kw: ['driver', 'chauffeur', 'verified'], tab: 'drivers', icon: 'fa-user-tie' },
    { title: 'Safe Parking Slots Hub', kw: ['parking', 'slot', 'ev slot'], tab: 'parking', icon: 'fa-square-parking' },
    { title: 'Business Analytics & Dashboard', kw: ['home', 'dashboard', 'analytics', 'revenue'], tab: 'home', icon: 'fa-chart-line' }
  ];

  return (
    <div className="sart-enterprise-navbar-wrapper">
      {/* 1. TOP MAIN NAV: Deep Purple (#2a1373) matching User Website Navbar */}
      <header className="web-navbar">
        {/* Left Section: SART Universal Pill + Location Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Brand Logo Pill */}
          <div
            className="nav-brand"
            onClick={() => onNavigate('home')}
            title="SART UNIVERSAL"
          >
            <i className="fa-solid fa-compass-drafting brand-icon"></i>
            <span className="brand-text">SART</span>
            <span className="brand-badge">UNIVERSAL</span>
          </div>

          {/* Location Nav Pill */}
          <div
            className="location-nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLocationModal && onOpenLocationModal();
            }}
            title={currentCity}
          >
            <i className="fa-solid fa-location-dot"></i>
            <span id="nav-location-txt" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentCity}
            </span>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </div>

        {/* Center: Segmented Navigation Capsule ([ Home  Store  Tracks ]) */}
        <nav className="nav-links">
          <div
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <span>Home</span>
          </div>
          <div
            className={`nav-link ${['store', 'rentals'].includes(activeTab) ? 'active' : ''}`}
            onClick={() => onNavigate('rentals')}
          >
            <span>Store</span>
          </div>
          <div
            className={`nav-link ${['tracks', 'carriers', 'booking'].includes(activeTab) ? 'active' : ''}`}
            onClick={() => onNavigate('carriers')}
          >
            <span>Tracks</span>
          </div>
        </nav>

        {/* Right Section: [ 🔍 ] [ 🤍 ] [ 🛍️ (6) ] [ 👤 Sai v ] | [ 🎚️ ] */}
        <div className="nav-controls">
          {/* 1. Search Button & Expanding Search Input */}
          <div ref={searchRef} className={`search-control-slot ${isSearchExpanded ? 'search-open' : ''}`}>
            {!isSearchExpanded ? (
              <button
                type="button"
                className="ctrl-btn search-trigger-btn"
                onClick={() => setIsSearchExpanded(true)}
                title="Search"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            ) : (
              <div className="expanded-search-container in-place">
                <i className="fa-solid fa-magnifying-glass search-icon-left"></i>
                <input
                  type="text"
                  className="expanded-search-input"
                  placeholder="Search fleet, carriers..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsSearchExpanded(false);
                      setSearchQuery('');
                    }
                  }}
                />
              </div>
            )}

            {/* Live Search Dropdown */}
            {searchQuery && isSearchExpanded && (
              <div className="search-dropdown">
                {SEARCH_OPTIONS.filter(opt =>
                  opt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  opt.kw.some(k => k.includes(searchQuery.toLowerCase()))
                ).length > 0 ? (
                  SEARCH_OPTIONS.filter(opt =>
                    opt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    opt.kw.some(k => k.includes(searchQuery.toLowerCase()))
                  ).map(opt => (
                    <div
                      key={opt.title}
                      className="booking-card"
                      onClick={() => {
                        onNavigate(opt.tab);
                        setIsSearchExpanded(false);
                        setSearchQuery('');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                          <i className={`fa-solid ${opt.icon}`}></i>
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '13px', color: '#0f172a' }}>{opt.title}</h4>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>Shortcut</span>
                        </div>
                      </div>
                      <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: '#94a3b8' }}></i>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '12px', fontSize: '12px' }}>
                    No matching modules found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Favorites / Heart Button */}
          <button
            type="button"
            className="ctrl-btn"
            title="Favorites & Fleet Bookmarks"
            onClick={() => onNavigate('rentals')}
          >
            <i className="fa-solid fa-heart"></i>
          </button>

          {/* 3. Shopping Cart / Bag with Badge 6 */}
          <button
            type="button"
            className="ctrl-btn"
            title="Shopping Cart & Fleet Orders"
            onClick={() => onNavigate('rentals')}
          >
            <i className="fa-solid fa-bag-shopping"></i>
            <span className="ctrl-badge">6</span>
          </button>

          {/* 4. User Profile Capsule & Dropdown */}
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="profile-nav-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              title="Account Menu"
            >
              <i className="fa-solid fa-circle-user"></i>
              <span className="profile-name">{partnerName}</span>
              <i className="fa-solid fa-chevron-down"></i>
            </button>

            {/* Profile Dropdown Menu matching User Website */}
            {isProfileDropdownOpen && (
              <div className="profile-dropdown-menu show">
                <div style={{ position: 'relative', width: '74px', height: '74px', margin: '0 auto 10px' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 700, border: '2px solid #bfdbfe' }}>
                    {(partnerName.charAt(0)).toUpperCase()}
                  </div>
                  <label style={{ position: 'absolute', bottom: 0, right: 0, background: '#ffffff', color: '#0f172a', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                    <i className="fa-solid fa-camera"></i>
                  </label>
                </div>

                <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', fontSize: '10.5px', fontWeight: 800, padding: '2px 10px', borderRadius: '12px', marginBottom: '8px', border: '1px solid #bfdbfe', letterSpacing: '0.05em' }}>
                  BUSINESS
                </div>

                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>
                  {partnerName}
                </h3>
                <p style={{ margin: '3px 0 10px', fontSize: '13px', color: '#64748b' }}>
                  {partnerEmail}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    if (onOpenProfile) onOpenProfile();
                    else onNavigate('settings');
                  }}
                  style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '24px', padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}
                >
                  <i className="fa-solid fa-user-gear"></i> Manage your account
                </button>

                <div style={{ borderTop: '1px solid #e2e8f0', margin: '0 -18px 8px', width: 'calc(100% + 36px)' }}></div>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onNavigate('home');
                  }}
                >
                  <i className="fa-solid fa-building" style={{ fontSize: '15px', color: '#64748b' }}></i> Manage Branches
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onNavigate('home');
                  }}
                >
                  <i className="fa-solid fa-user-plus" style={{ fontSize: '15px', color: '#64748b' }}></i> Add another account
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onNavigate('help');
                  }}
                >
                  <i className="fa-solid fa-headset" style={{ fontSize: '15px', color: '#64748b' }}></i> Help & Support
                </button>
                <button
                  type="button"
                  className="dropdown-item signout-btn"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onLogout();
                  }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: '15px' }}></i> Sign out of this account
                </button>
              </div>
            )}
          </div>

          {/* 5. Vertical Divider Pipe */}
          <div className="nav-divider-pipe"></div>

          {/* 6. Bit-tool / Sliders Toggle Button */}
          <button
            type="button"
            className={`nav-bittool-slider-btn ${isSideToolOpen ? 'active' : ''}`}
            title="Toggle Right Side Utilities"
            onClick={onToggleSideTool}
          >
            <img
              src="/images/bnx_slider_icon.png"
              alt="Toggle"
              className="bnx-slider-icon-img"
            />
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
              className={`sub-nav-pill-btn ${activeTab === 'rentals' || activeTab === 'store' ? 'active' : ''}`}
              onClick={() => onNavigate('rentals')}
            >
              <i className="fa-solid fa-car-side"></i>
              <span>Rentals</span>
            </button>

            {/* Tab 2: Carriers Logistics */}
            <button
              type="button"
              className={`sub-nav-pill-btn ${activeTab === 'carriers' || activeTab === 'tracks' ? 'active' : ''}`}
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

            {/* Tab 4: Parking Slots */}
            <button
              type="button"
              className={`sub-nav-pill-btn ${activeTab === 'parking' ? 'active' : ''}`}
              onClick={() => onNavigate('parking')}
            >
              <i className="fa-solid fa-square-parking"></i>
              <span>Parkings</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
