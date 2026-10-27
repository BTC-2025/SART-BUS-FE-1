import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import DashboardHome from './components/DashboardHome';
import Carrier from './components/Carrier';
import HireDrivers from './components/HireDrivers';
import VehicleRental from './components/VehicleRental';
import ParkingSlot from './components/ParkingSlot';
import SpareParts from './components/SpareParts';
import AllBookingsManagement from './components/AllBookingsManagement';
import EnableLocationModal from './components/EnableLocationModal';
import Footer from './components/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

export default function App() {
  // Check if partner session is saved in localStorage
  const [partnerDetails, setPartnerDetails] = useState(() => {
    try {
      const stored = localStorage.getItem('sart_captain_session');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return null; // Force company @bnxmail.com login if unauthenticated
  });

  // Auth screen state: 'login' | 'register'
  const [authView, setAuthView] = useState('login');

  // Primary sections: 'home' | 'booking' | 'store' | 'spare_parts' | 'all_bookings' (also supports direct links /carrier, /vehiclerental, /hiredrivers, /parking)
  const parsePathname = (path) => {
    const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (clean === 'booking' || clean === 'bookings' || clean === 'carrier') return 'booking';
    if (clean === 'store' || clean === 'fleet' || clean === 'vehiclerental' || clean === 'rental') return 'store';
    if (clean === 'hiredrivers' || clean === 'drivers') return 'hire_drivers';
    if (clean === 'parking' || clean === 'parkingslot') return 'parking';
    if (clean === 'spare_parts' || clean === 'spares' || clean === 'parts') return 'spare_parts';
    if (clean === 'all_bookings' || clean === 'bookings_all' || clean === 'orders') return 'all_bookings';
    if (clean === 'profile') return 'profile';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(() => parsePathname(window.location.pathname));
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Keep browser URL synced with back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(parsePathname(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    let targetUrl = '/';
    if (page === 'home' || page === 'dashboard') targetUrl = '/';
    else if (page === 'booking') targetUrl = '/booking';
    else if (page === 'store' || page === 'vehicle_rental') targetUrl = '/store';
    else if (page === 'hire_drivers') targetUrl = '/hiredrivers';
    else if (page === 'parking') targetUrl = '/parking';
    else if (page === 'carrier') targetUrl = '/booking';
    else if (page === 'spare_parts') targetUrl = '/spare-parts';
    else if (page === 'all_bookings') targetUrl = '/all-bookings';
    else if (page === 'profile') targetUrl = '/profile';
    else targetUrl = `/${page}`;

    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
  };

  // Called when user logs in with @bnxmail.com
  const handleLoginSuccess = (user) => {
    setPartnerDetails(user);
    localStorage.setItem('sart_captain_session', JSON.stringify(user));
    navigateTo('carrier');
  };

  // Called when user registers a new account
  const handleRegisterSuccess = (user) => {
    setPartnerDetails(user);
    localStorage.setItem('sart_captain_session', JSON.stringify(user));
    navigateTo('carrier');
  };

  // Called when user selects city from Enable Location modal
  const handleCitySelect = (newCity) => {
    const updated = { ...partnerDetails, city: newCity };
    setPartnerDetails(updated);
    localStorage.setItem('sart_captain_session', JSON.stringify(updated));
  };

  // Called when user clicks Logout
  const handleLogout = () => {
    localStorage.removeItem('sart_captain_session');
    setPartnerDetails(null);
    setAuthView('login');
    navigateTo('carrier');
  };

  // =========================================================================
  // GATEKEEPER: REQUIRE COMPANY @bnxmail.com LOGIN BEFORE HOME VIEW
  // =========================================================================
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

  // Render appropriate view based on route
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <DashboardHome partnerDetails={partnerDetails} onNavigate={navigateTo} />;
      case 'booking':
        return <Carrier partnerDetails={partnerDetails} />;
      case 'store':
      case 'vehicle_rental':
        return <VehicleRental partnerDetails={partnerDetails} />;
      case 'hire_drivers':
        return <HireDrivers partnerDetails={partnerDetails} />;
      case 'parking':
        return <ParkingSlot partnerDetails={partnerDetails} />;
      case 'spare_parts':
        return <SpareParts partnerDetails={partnerDetails} />;
      case 'all_bookings':
        return <AllBookingsManagement partnerDetails={partnerDetails} />;
      default:
        return <DashboardHome partnerDetails={partnerDetails} onNavigate={navigateTo} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Top Navbar with SART Business branding & Quick Switcher */}
      <Navbar
        partnerDetails={partnerDetails}
        onOpenProfile={() => navigateTo('profile')}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        activeSubTab={currentPage}
        setActiveSubTab={setCurrentPage}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />

      {/* Enable Location GPS / Choose Regional Hub Modal */}
      <EnableLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={handleCitySelect}
        currentCity={partnerDetails?.city || 'Chennai'}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        {renderContent()}
      </div>

      {/* SART Business Universal Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
