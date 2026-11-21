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

  const handleSearchSubmit = (rawQuery: string) => {
    const q = (rawQuery || '').trim().toLowerCase();
    if (!q) return;

    // 1. Carriers & Freight Logistics (truck, cargo, carrier, tempo, lorry, etc.)
    if (
      q.includes('carrier') ||
      q.includes('truck') ||
      q.includes('cargo') ||
      q.includes('logistics') ||
      q.includes('freight') ||
      q.includes('tempo') ||
      q.includes('lorry') ||
      q.includes('delivery') ||
      q.includes('transport')
    ) {
      onNavigate('carriers');
    }
    // 2. Fleet Vehicle Rentals (rental, rent, car, bike, scooter, fleet)
    else if (
      q.includes('rental') ||
      q.includes('rent') ||
      q.includes('car') ||
      q.includes('bike') ||
      q.includes('scooter') ||
      q.includes('vehicle') ||
      q.includes('fleet')
    ) {
      onNavigate('rentals');
    }
    // 3. Hire Drivers & Chauffeurs
    else if (
      q.includes('driver') ||
      q.includes('chauffeur')
    ) {
      onNavigate('drivers');
    }
    // 4. Safe Parking Slots
    else if (
      q.includes('parking') ||
      q.includes('park') ||
      q.includes('slot') ||
      q.includes('ev slot')
    ) {
      onNavigate('parking');
    }
    // 5. Dashboard / Home / Analytics
    else if (
      q.includes('home') ||
      q.includes('dashboard') ||
      q.includes('analytics') ||
      q.includes('revenue') ||
      q.includes('stat')
    ) {
      onNavigate('home');
    }
    // 6. Help & Support
    else if (
      q.includes('help') ||
      q.includes('support')
    ) {
      onNavigate('help');
    }
    // 7. Settings & Profile
    else if (
      q.includes('setting') ||
      q.includes('profile') ||
      q.includes('account') ||
      q.includes('branch')
    ) {
      onNavigate('settings');
    }
    // 8. Fallback
    else {
      const match = SEARCH_OPTIONS.find(opt =>
        opt.title.toLowerCase().includes(q) ||
        opt.kw.some(k => k.includes(q) || q.includes(k))
      );
      if (match) {
        onNavigate(match.tab);
      } else {
        onNavigate('home');
      }
    }

    setIsSearchExpanded(false);
    setSearchQuery('');
  };

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
                className="nav-squircle-btn search-trigger-btn"
                onClick={() => setIsSearchExpanded(true)}
                title="Search"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            ) : (
              <div className="expanded-search-container in-place">
                <i
                  className="fa-solid fa-magnifying-glass search-icon-left"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  onClick={() => handleSearchSubmit(searchQuery)}
                  title="Search"
                ></i>
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
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchSubmit(searchQuery);
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* 2. Notification Bell Icon Button (matching Image 2) */}
          <button
            type="button"
            className="nav-squircle-btn"
            title="Notifications & Fleet Alerts"
            onClick={() => onNavigate('home')}
          >
            <i className="fa-regular fa-bell"></i>
          </button>

          {/* 3. User Profile Avatar Button & Dropdown (matching Image 2) */}
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="nav-squircle-btn profile-squircle-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              title="Account Menu"
            >
              <div className="profile-circle-avatar">
                <span>{(partnerName ? partnerName.charAt(0).toUpperCase() : 'P')}</span>
              </div>
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

          {/* 4. Vertical Divider Pipe (matching Image 2) */}
          <div className="nav-divider-pipe"></div>

          {/* 5. Bit-tool / Sliders Toggle Button (matching Image 2) */}
          <button
            type="button"
            className={`nav-squircle-btn nav-bittool-slider-btn ${isSideToolOpen ? 'active' : ''}`}
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
            {/* Tab 1: Rides Fleet */}
            <button
              type="button"
              className={`sub-nav-pill-btn ${activeTab === 'rides' ? 'active' : ''}`}
              onClick={() => onNavigate('rides')}
            >
              <i className="fa-solid fa-car"></i>
              <span>Rides</span>
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

            {/* Tab 3: Rental Vehicles */}
            <button
              type="button"
              className={`sub-nav-pill-btn ${activeTab === 'rentals' || activeTab === 'store' ? 'active' : ''}`}
              onClick={() => onNavigate('rentals')}
            >
              <i className="fa-solid fa-car-side"></i>
              <span>Rentals</span>
            </button>

            {/* Tab 4: Hire Drivers */}
            <button
              type="button"
              className={`sub-nav-pill-btn ${activeTab === 'drivers' ? 'active' : ''}`}
              onClick={() => onNavigate('drivers')}
            >
              <i className="fa-solid fa-user-tie"></i>
              <span>Drivers</span>
            </button>

            {/* Tab 5: Parking Slots */}
            <button
              type="button"
              className={`sub-nav-pill-btn ${activeTab === 'parking' ? 'active' : ''}`}
              onClick={() => onNavigate('parking')}
            >
              <i className="fa-solid fa-square-parking"></i>
              <span>Parkings</span>
            </button>

            {/* Tab 6: Communities */}
            <button
              type="button"
              className={`sub-nav-pill-btn ${activeTab === 'community' || activeTab === 'communities' ? 'active' : ''}`}
              onClick={() => onNavigate('community')}
            >
              <i className="fa-solid fa-users"></i>
              <span>Communities</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
