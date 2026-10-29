import React, { useState } from 'react';
import './components/rentalVehicles/rentalVehicles.css';
import RentalVehiclesIndex from './components/rentalVehicles/RentalVehiclesIndex';
import Navbar from './components/Navbar';
import EnableLocationModal from './components/EnableLocationModal';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

export default function App() {
  // Check if partner session is saved in localStorage
  const [partnerDetails, setPartnerDetails] = useState(() => {
    try {
      const stored = localStorage.getItem('sart_captain_session');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    // Default active demo session if empty
    return {
      name: 'Owner Account',
      email: 'owner@sartbusiness.com',
      city: 'Pune',
      role: 'Fleet Owner'
    };
  });

  const [authView, setAuthView] = useState('login');
  // Two clean pages requested: 'home' (Dashboard) | 'categories' (Vehicle Categories)
  const [currentPage, setCurrentPage] = useState('home');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleLoginSuccess = (user) => {
    setPartnerDetails(user);
    localStorage.setItem('sart_captain_session', JSON.stringify(user));
  };

  const handleRegisterSuccess = (user) => {
    setPartnerDetails(user);
    localStorage.setItem('sart_captain_session', JSON.stringify(user));
  };

  const handleCitySelect = (city, lat, lng) => {
    const updated = {
      ...(partnerDetails || {}),
      city,
      lat,
      lng
    };
    setPartnerDetails(updated);
    localStorage.setItem('sart_captain_session', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('sart_captain_session');
    setPartnerDetails(null);
    setAuthView('login');
  };

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Top Main Navbar and Sub Navbar dedicated to Rental Fleet Hub */}
      <Navbar
        partnerDetails={partnerDetails}
        onOpenProfile={() => setCurrentPage('home')}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        activeSubTab={currentPage}
        setActiveSubTab={setCurrentPage}
        onNavigate={(route) => setCurrentPage(route)}
        onLogout={handleLogout}
      />

      {/* Main Body: Rental Vehicle Management Hub */}
      <main style={{ flex: 1, padding: '20px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <RentalVehiclesIndex
          partnerDetails={partnerDetails}
          onNavigate={setCurrentPage}
          viewMode={currentPage}
        />
      </main>

      {/* City Selector Modal */}
      <EnableLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={handleCitySelect}
        currentCity={partnerDetails?.city || 'Pune'}
      />
    </div>
  );
}
