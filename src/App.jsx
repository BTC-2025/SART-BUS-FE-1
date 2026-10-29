import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import DashboardHome from './components/DashboardHome';
import ParcelLoadingHub from './components/ParcelLoadingHub';
import Carrier from './components/Carrier';
import HireDrivers from './components/HireDrivers';
import VehicleRental from './components/VehicleRental';
import RentalVehiclesIndex from './components/rentalVehicles/RentalVehiclesIndex';
import ParkingSlot from './components/ParkingSlot';
import SpareParts from './components/SpareParts';
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

  // Primary sections: 'home' | 'parcel_hub' | 'store' | 'hire_drivers' | 'parking' | 'spare_parts'
  const parsePathname = (path) => {
    const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (clean === 'parcel' || clean === 'parcels' || clean === 'parcel_hub' || clean === 'loading') return 'parcel_hub';
    if (clean === 'booking' || clean === 'bookings' || clean === 'carrier') return 'booking';
    if (clean === 'store' || clean === 'fleet' || clean === 'vehiclerental' || clean === 'rental') return 'store';
    if (clean === 'hiredrivers' || clean === 'drivers') return 'hire_drivers';
    if (clean === 'parking' || clean === 'parkingslot' || clean === 'yard') return 'parking';
    if (clean === 'spare_parts' || clean === 'spares' || clean === 'parts') return 'spare_parts';
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
    else if (page === 'parcel_hub') targetUrl = '/parcel-hub';
    else if (page === 'booking' || page === 'carrier') targetUrl = '/cargo';
    else if (page === 'store' || page === 'vehicle_rental') targetUrl = '/rental';
    else if (page === 'hire_drivers') targetUrl = '/hiredrivers';
    else if (page === 'parking') targetUrl = '/parking';
    else if (page === 'spare_parts') targetUrl = '/spare-parts';
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
    navigateTo('parcel_hub');
  };

  // Called when user registers a new account
  const handleRegisterSuccess = (user) => {
    setPartnerDetails(user);
    localStorage.setItem('sart_captain_session', JSON.stringify(user));
    navigateTo('parcel_hub');
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
    navigateTo('parcel_hub');
  };

  // =========================================================================
  // GATEKEEPER: REQUIRE COMPANY @bnxmail.com REGISTRATION/LOGIN BEFORE ACCESS
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
      case 'parcel_hub':
        return <ParcelLoadingHub partnerDetails={partnerDetails} onNavigate={navigateTo} />;
      case 'booking':
        return <Carrier partnerDetails={partnerDetails} />;
      case 'store':
      case 'vehicle_rental':
      case 'rental':
        return <RentalVehiclesIndex partnerDetails={partnerDetails} onNavigate={navigateTo} />;
      case 'hire_drivers':
        return <HireDrivers partnerDetails={partnerDetails} />;
      case 'parking':
        return <ParkingSlot partnerDetails={partnerDetails} />;
      case 'spare_parts':
        return <SpareParts partnerDetails={partnerDetails} />;
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
