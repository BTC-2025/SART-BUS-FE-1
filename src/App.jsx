import React, { useState, useEffect } from 'react';
import './components/rentalVehicles/rentalVehicles.css';
import Navbar from './components/Navbar';
import BusinessSidebar from './components/BusinessSidebar';
import DashboardHome from './components/DashboardHome';
import RentalVehiclesIndex from './components/rentalVehicles/RentalVehiclesIndex';
import Carrier from './components/Carrier';
import HireDrivers from './components/HireDrivers';
import ParkingSlot from './components/ParkingSlot';
import EnableLocationModal from './components/EnableLocationModal';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SideAccountDrawer from './components/auth/SideAccountDrawer';

export default function App() {
  // Gatekeeper: default to active partner session or stored user
  const [partnerDetails, setPartnerDetails] = useState(() => {
    try {
      const stored = localStorage.getItem('sart_captain_session');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return {
      name: 'venkatavasanthakumarp1997',
      email: 'venkatavasanthakumarp1997@bnxmail.com',
      city: 'Chennai',
      role: 'Fleet Partner'
    };
  });

  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  // URL route parsing: 'home' | 'rentals' | 'carriers' | 'drivers' | 'parking'
  // Also supports sub-routes like: /rentals/toyota-alphard
  const parseCurrentLocation = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/rentals/')) {
      const vehicleSlug = path.replace('/rentals/', '').replace(/\/$/, '');
      return { tab: 'rentals', vehicleSlug: decodeURIComponent(vehicleSlug) };
    }
    if (path.includes('rental')) return { tab: 'rentals', vehicleSlug: null };
    if (path.includes('carrier')) return { tab: 'carriers', vehicleSlug: null };
    if (path.includes('driver')) return { tab: 'drivers', vehicleSlug: null };
    if (path.includes('parking')) return { tab: 'parking', vehicleSlug: null };
    return { tab: 'home', vehicleSlug: null };
  };

  const [routeState, setRouteState] = useState(parseCurrentLocation);
  const currentTab = routeState.tab;
  const currentVehicleSlug = routeState.vehicleSlug;
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSideToolOpen, setIsSideToolOpen] = useState(false); // Removed/hidden right side tool strip

  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parseCurrentLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route, vehicleSlug = null) => {
    let targetUrl = '/';
    if (route === 'rentals') {
      targetUrl = vehicleSlug ? `/rentals/${encodeURIComponent(vehicleSlug)}` : '/rentals';
    } else if (route === 'carriers') {
      targetUrl = '/carriers';
    } else if (route === 'drivers') {
      targetUrl = '/drivers';
    } else if (route === 'parking') {
      targetUrl = '/parking';
    } else {
      targetUrl = '/';
    }

    setRouteState({ tab: route, vehicleSlug });
    window.history.pushState({}, '', targetUrl);
  };

  const handleLoginSuccess = (user) => {
    setPartnerDetails(user);
    try {
      localStorage.setItem('sart_captain_session', JSON.stringify(user));
    } catch (e) { }
    navigateTo('home');
  };

  const handleRegisterSuccess = (user) => {
    setPartnerDetails(user);
    try {
      localStorage.setItem('sart_captain_session', JSON.stringify(user));
    } catch (e) { }
    navigateTo('home');
  };

  const handleCitySelect = (city, lat, lng) => {
    const updated = {
      ...(partnerDetails || {}),
      city,
      lat,
      lng
    };
    setPartnerDetails(updated);
    try {
      localStorage.setItem('sart_captain_session', JSON.stringify(updated));
    } catch (e) { }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('sart_captain_session');
    } catch (e) { }
    setPartnerDetails(null);
    setAuthView('login');
  };

  // 1. GATEWAY: If not logged in, show Login or Register Screen
  if (!partnerDetails) {
    if (authView === 'register') {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  // 2. Render dedicated section based on navigation
  const renderCurrentView = () => {
    switch (currentTab) {
      case 'home':
        // Dedicated Unified Dashboard showing all live bookings & schedules across services
        return (
          <DashboardHome
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
          />
        );

      case 'rentals':
        // Dedicated Rental Vehicle fleet hub & dynamic add vehicle modal or full details page
        return (
          <RentalVehiclesIndex
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
            urlVehicleSlug={currentVehicleSlug}
          />
        );

      case 'carriers':
        // Dedicated Carrier Logistics & Freight fleet hub
        return (
          <Carrier
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
          />
        );

      case 'drivers':
        // Dedicated Hire Drivers fleet & chauffeur hub
        return (
          <HireDrivers
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
          />
        );

      case 'parking':
        // Dedicated Safe Parking slots reservation & slot management
        return (
          <ParkingSlot
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
          />
        );

      default:
        return (
          <DashboardHome
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', position: 'relative' }}>
      {/* Top Navbar with showSubNav set to false (subnav removed, relocated to Sidebar) */}
      <Navbar
        partnerDetails={partnerDetails}
        onOpenProfile={() => navigateTo('home')}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        activeTab={currentTab}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        isSideToolOpen={isSideToolOpen}
        onToggleSideTool={() => setIsSideToolOpen(!isSideToolOpen)}
        showSubNav={false}
      />

      {/* Main Layout: Left Cliks Business Sidebar + Main Content Area */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 60px)', width: '100%' }}>
        {/* Sidebar as requested with Dashboard, Add Vehicle, Inventory (Rentals, Carriers, Drivers, Parking), Storage & Plan */}
        <BusinessSidebar
          currentTab={currentTab}
          onNavigate={navigateTo}
          brandTitle="Cliks Business"
        />

        {/* Content Area */}
        <main style={{
          flex: 1,
          padding: '24px 28px',
          width: 'calc(100% - 260px)',
          minWidth: 0,
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }}>
          {renderCurrentView()}
        </main>
      </div>

      {/* Enable Location GPS / Choose Regional Hub Modal */}
      <EnableLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={handleCitySelect}
        currentCity={partnerDetails?.city || 'Chennai'}
      />
    </div>
  );
}
