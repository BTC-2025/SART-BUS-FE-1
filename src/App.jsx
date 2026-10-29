import React, { useState, useEffect } from 'react';
import './components/rentalVehicles/rentalVehicles.css';
import Navbar from './components/Navbar';
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
  // Gatekeeper: only allow entry after user logs in or creates account
  const [partnerDetails, setPartnerDetails] = useState(() => {
    try {
      const stored = localStorage.getItem('sart_captain_session');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return null; // Require login first!
  });

  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  // URL route parsing: 'home' | 'rentals' | 'carriers' | 'drivers' | 'parking'
  const getInitialRoute = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('rental')) return 'rentals';
    if (path.includes('carrier')) return 'carriers';
    if (path.includes('driver')) return 'drivers';
    if (path.includes('parking')) return 'parking';
    return 'home';
  };

  const [currentTab, setCurrentTab] = useState(getInitialRoute);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSideToolOpen, setIsSideToolOpen] = useState(true); // Toggle visibility of side bit-tool strip

  useEffect(() => {
    const handlePopState = () => {
      setCurrentTab(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route) => {
    setCurrentTab(route);
    let targetUrl = '/';
    if (route === 'rentals') targetUrl = '/rentals';
    else if (route === 'carriers') targetUrl = '/carriers';
    else if (route === 'drivers') targetUrl = '/drivers';
    else if (route === 'parking') targetUrl = '/parking';
    else targetUrl = '/';

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
        // Dedicated Rental Vehicle fleet hub & dynamic add vehicle modal
        return (
          <RentalVehiclesIndex
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
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
      {/* 2-Tier Header System:
          1. Top Navbar: Dark Green with Logo, Chennai Badge, Home/Store/Tracks in center, Action Icons & Profile Pill
          2. Sub Navbar: Deep Royal Blue centered with Rentals, Carriers, Drivers, Parking
      */}
      <Navbar
        partnerDetails={partnerDetails}
        onOpenProfile={() => navigateTo('home')}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        activeTab={currentTab}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        isSideToolOpen={isSideToolOpen}
        onToggleSideTool={() => setIsSideToolOpen(!isSideToolOpen)}
      />

      {/* Main Body */}
      <main style={{
        flex: 1,
        padding: '24px 28px',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        marginRight: isSideToolOpen ? '64px' : '0px',
        transition: 'margin-right 0.2s ease'
      }}>
        {renderCurrentView()}
      </main>

      {/* Right Side Bit Tool Strip & Dynamic Modal Tool popouts */}
      <SideAccountDrawer
        partnerDetails={partnerDetails}
        isOpen={isSideToolOpen}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        onSwitchAccount={() => {
          handleLogout();
          setAuthView('login');
        }}
      />

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
