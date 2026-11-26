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

  // Notification dropdown states & API sync (matching user image)
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Fetch real-time notifications from Backend API (Port 5000 and Port 3005)
  const fetchNotifications = async () => {
    let fetchedData: any[] | null = null;
    let unread: number | null = null;

    const endpoints = [
      'http://localhost:5000/api/business/notifications',
      'http://localhost:3005/api/business/notifications'
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' }, cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            fetchedData = json.data;
            unread = json.unreadCount ?? json.data.filter((n: any) => !n.read).length;
            break;
          }
        }
      } catch (e) { }
    }

    if (fetchedData !== null) {
      setNotifications(fetchedData);
      setUnreadCount(unread ?? 0);
      return;
    }

    // Fallback to local storage bookings if backend offline
    try {
      const storedBookings = JSON.parse(localStorage.getItem('sart_business_bookings') || '[]');
      if (Array.isArray(storedBookings) && storedBookings.length > 0) {
        const mapped = storedBookings.map((b: any, idx: number) => {
          const isDriver = b.type === 'driver_booking' || b.bookingId?.includes('DRV') || b.id?.includes('DRV');
          const isCarrier = b.type === 'carrier_booking' || b.bookingId?.includes('CRG');
          const isParking = b.type === 'parking_booking' || b.bookingId?.includes('PRK');

          let badge = 'New Rental Booking';
          if (isDriver) badge = 'New Driver Booking';
          else if (isCarrier) badge = 'New Logistics Booking';
          else if (isParking) badge = 'New Parking Reservation';

          let category = b.category || 'Rental Vehicle';
          if (isDriver) category = 'Chauffeur / Driver';
          else if (isCarrier) category = 'Commercial Freight';
          else if (isParking) category = 'Parking Slot';

          const title = b.title || (isDriver
            ? `${b.customerName || 'Customer'} booked Captain: ${b.vehicleName || b.driverName || 'Driver'}`
            : isParking
            ? `${b.customerName || 'Customer'} reserved parking at ${b.vehicleName || 'Yard'}`
            : `${b.customerName || 'Customer'} booked a ${category} (${b.vehicleName || 'Vehicle'})`);

          return {
            id: b.id || `notif-${idx}`,
            type: b.type || (isDriver ? 'driver_booking' : isParking ? 'parking_booking' : 'rental_booking'),
            badge,
            title,
            customerName: b.customerName || 'Customer',
            category,
            vehicleName: b.vehicleName || b.driverName || 'Vehicle',
            vehiclePlate: b.plate || b.vehiclePlate || b.vehicleNumber || '',
            date: b.pickupDate || b.reportingDate || b.date || 'Today',
            time: b.pickupTime ? `${b.pickupTime}${b.returnTime ? ` - ${b.returnTime}` : ''}` : (b.reportingTime || b.time || '10:00 AM'),
            read: Boolean(b.read)
          };
        });
        setNotifications(mapped);
        setUnreadCount(mapped.filter((n: any) => !n.read).length);
      }
    } catch (e) { }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.allSettled([
        fetch('http://localhost:5000/api/business/notifications/mark-all-read', { method: 'PATCH' }),
        fetch('http://localhost:3005/api/business/notifications', { method: 'PATCH' })
      ]);
    } catch (e) { }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Close profile dropdown, notifications & search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setIsNotifDropdownOpen(false);
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

          {/* 2. Notification Bell Icon Button with Badge & Dropdown (matching Image 1 & 2) */}
          <div ref={notifMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="nav-squircle-btn"
              title="Notifications & Fleet Alerts"
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              style={{ position: 'relative' }}
            >
              <i className="fa-regular fa-bell"></i>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)',
                    border: '2px solid #ffffff'
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu strictly matching Image 2 */}
            {isNotifDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '390px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 12px 36px rgba(15, 23, 42, 0.16)',
                  border: '1px solid #e2e8f0',
                  zIndex: 1050,
                  overflow: 'hidden',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                      Notifications
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      {unreadCount} unread
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0284c7',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '36px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <i className="fa-regular fa-bell-slash" style={{ fontSize: '28px', marginBottom: '8px', display: 'block' }}></i>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>No notifications yet</span>
                      <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#cbd5e1' }}>
                        User bookings will appear here instantly.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif, idx) => {
                      const initials = (notif.customerName || 'JD')
                        .split(' ')
                        .map((s: string) => s[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      return (
                        <div
                          key={notif.id || idx}
                          style={{
                            padding: '16px 20px',
                            borderBottom: idx !== notifications.length - 1 ? '1px solid #f8fafc' : 'none',
                            display: 'flex',
                            gap: '14px',
                            backgroundColor: notif.read ? '#ffffff' : '#f8fafc',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          {/* Avatar Circle with Tag Icon & Initials */}
                          <div style={{ position: 'relative', flexShrink: 0, width: '38px', height: '38px' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: idx === 0 ? '#dbeafe' : '#e2e8f0',
                                color: idx === 0 ? '#1d4ed8' : '#475569',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px'
                              }}
                            >
                              <i className="fa-solid fa-tag"></i>
                            </div>
                            <span
                              style={{
                                position: 'absolute',
                                bottom: '-3px',
                                right: '-3px',
                                backgroundColor: '#f1f5f9',
                                color: '#0f172a',
                                fontSize: '9px',
                                fontWeight: 800,
                                borderRadius: '6px',
                                padding: '1px 3px',
                                border: '1px solid #cbd5e1'
                              }}
                            >
                              {initials}
                            </span>
                          </div>

                          {/* Notification Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Blue Badge for New Rental Booking */}
                            <span
                              style={{
                                display: 'inline-block',
                                backgroundColor: '#eff6ff',
                                color: '#2563eb',
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '12px',
                                marginBottom: '6px'
                              }}
                            >
                              {notif.badge || 'New Rental Booking'}
                            </span>

                            {/* Main Title */}
                            <h4
                              style={{
                                margin: '0 0 4px',
                                fontSize: '13.5px',
                                fontWeight: 700,
                                color: '#0f172a',
                                lineHeight: '1.3'
                              }}
                            >
                              {notif.type === 'parking_booking' ? (
                                <>
                                  <strong style={{ fontWeight: 800 }}>{notif.customerName}</strong> reserved{' '}
                                  <strong style={{ fontWeight: 800 }}>{notif.vehiclePlate || notif.bayCode || 'Parking Bay'}</strong> at {notif.vehicleName}
                                </>
                              ) : notif.type === 'driver_booking' ? (
                                <>
                                  <strong style={{ fontWeight: 800 }}>{notif.customerName}</strong> booked{' '}
                                  <strong style={{ fontWeight: 800 }}>{notif.vehicleName}</strong>
                                </>
                              ) : (
                                <>
                                  <strong style={{ fontWeight: 800 }}>{notif.customerName}</strong> booked a{' '}
                                  <strong style={{ fontWeight: 800 }}>{notif.category}</strong> ({notif.vehicleName})
                                </>
                              )}
                            </h4>

                            {/* Details: Category & Vehicle */}
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '2px' }}>
                              <span>Category: {notif.category}</span> • <span>{notif.type === 'parking_booking' ? `Yard: ${notif.vehicleName}` : `Vehicle: ${notif.vehicleName}`}</span>
                            </div>

                            {/* Date & Time */}
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '8px' }}>
                              <span>Date: {notif.date}</span> • <span>Time: {notif.time}</span>
                            </div>

                            {/* Bottom Link */}
                            <button
                              type="button"
                              onClick={() => {
                                setIsNotifDropdownOpen(false);
                                onNavigate('home');
                                if (notif.type === 'driver_booking') {
                                  window.dispatchEvent(new CustomEvent('filter_dashboard_vertical', { detail: 'Drivers' }));
                                } else if (notif.type === 'carrier_booking') {
                                  window.dispatchEvent(new CustomEvent('filter_dashboard_vertical', { detail: 'Carriers' }));
                                } else if (notif.type === 'parking_booking') {
                                  window.dispatchEvent(new CustomEvent('filter_dashboard_vertical', { detail: 'Parkings' }));
                                } else {
                                  window.dispatchEvent(new CustomEvent('filter_dashboard_vertical', { detail: 'Rentals' }));
                                }
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#0284c7',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                padding: 0,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>{notif.type === 'driver_booking' ? 'Driver Booking' : (notif.type === 'carrier_booking' ? 'Carrier Booking' : (notif.type === 'parking_booking' ? 'Parking Reservation' : 'Rental Booking'))}</span> • <span>View Details &rarr;</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer: See all bookings */}
                <div style={{ padding: '12px 20px', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotifDropdownOpen(false);
                      onNavigate('rentals');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    See all bookings
                  </button>
                </div>
              </div>
            )}
          </div>

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
