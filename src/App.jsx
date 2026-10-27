import React, { useState, useEffect } from 'react';
import './App.css';
import CaptainHeader from './components/CaptainHeader';
import CaptainLeftDrawer from './components/CaptainLeftDrawer';
import CaptainDutyRightView from './components/CaptainDutyRightView';
import CaptainProfilePage from './components/CaptainProfilePage';
import CaptainRegisterPage from './components/CaptainRegisterPage';
import EnableLocationModal from './components/EnableLocationModal';
import RideCategoryPage from './components/RideCategoryPage';
import Footer from './components/Footer';

export default function App() {
  // Partner session details (defaults to registered business partner directly)
  const [partnerDetails, setPartnerDetails] = useState(() => {
    try {
      const stored = localStorage.getItem('sart_captain_session');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return {
      id: 'CPT-7829',
      name: 'Sai',
      email: 'gmvinoth@bnxmail.com',
      mobile: '+91 98765 43210',
      city: 'Chennai',
      role: 'driver',
      serviceType: 'auto',
      vehicleModel: 'Bajaj RE Compact Auto',
      vehiclePlate: 'TN 09 BK 4421',
      license: 'DL-042022009214',
      avatarUrl: ''
    };
  });

  const [isOnDuty, setIsOnDuty] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('rides');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // URL & page routing: '/', '/profile', 'home/ride', 'home/ride/bike', 'home/ride/auto', 'home/ride/car', 'home/ride/Manageyouraccount'
  const parsePathname = (path) => {
    const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (clean === 'profile' || clean.endsWith('manageyouraccount') || clean === 'home/ride/manageyouraccount') {
      return 'profile';
    }
    if (clean === 'home/ride/bike' || clean === 'ride/bike' || clean === 'bike') {
      return 'ride-bike';
    }
    if (clean === 'home/ride/auto' || clean === 'ride/auto' || clean === 'auto') {
      return 'ride-auto';
    }
    if (clean === 'home/ride/car' || clean === 'ride/car' || clean === 'car') {
      return 'ride-car';
    }
    if (clean === 'home/ride' || clean === 'ride') {
      return 'ride-home';
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(() => parsePathname(window.location.pathname));

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
    if (page === 'profile') targetUrl = '/home/ride/Manageyouraccount';
    else if (page === 'ride-bike') targetUrl = '/home/ride/bike';
    else if (page === 'ride-auto') targetUrl = '/home/ride/auto';
    else if (page === 'ride-car') targetUrl = '/home/ride/car';
    else if (page === 'ride-home') targetUrl = '/home/ride';

    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
  };

  // Called when user logs in or updates profile
  const handleLoginSuccess = (user) => {
    setPartnerDetails(user);
    localStorage.setItem('sart_captain_session', JSON.stringify(user));
    navigateTo('home');
  };

  // Called when user selects city from Enable Location modal
  const handleCitySelect = (newCity) => {
    const updated = { ...partnerDetails, city: newCity };
    setPartnerDetails(updated);
    localStorage.setItem('sart_captain_session', JSON.stringify(updated));
  };

  // Called when user clicks Logout / Reset
  const handleLogout = () => {
    localStorage.removeItem('sart_captain_session');
    navigateTo('home');
  };

  // Render appropriate view based on route
  const renderContent = () => {
    if (currentPage === 'profile') {
      return (
        <CaptainProfilePage
          partnerDetails={partnerDetails}
          onBackToHome={() => navigateTo('home')}
          onLogout={handleLogout}
        />
      );
    }

    if (currentPage === 'ride-bike') {
      return (
        <RideCategoryPage
          category="bike"
          partnerDetails={partnerDetails}
          isOnDuty={isOnDuty}
          setIsOnDuty={setIsOnDuty}
          onOpenProfile={() => navigateTo('profile')}
        />
      );
    }

    if (currentPage === 'ride-auto') {
      return (
        <RideCategoryPage
          category="auto"
          partnerDetails={partnerDetails}
          isOnDuty={isOnDuty}
          setIsOnDuty={setIsOnDuty}
          onOpenProfile={() => navigateTo('profile')}
        />
      );
    }

    if (currentPage === 'ride-car') {
      return (
        <RideCategoryPage
          category="car"
          partnerDetails={partnerDetails}
          isOnDuty={isOnDuty}
          setIsOnDuty={setIsOnDuty}
          onOpenProfile={() => navigateTo('profile')}
        />
      );
    }

    // Default 'home' and 'home/ride'
    return (
      <div className="c-laptop-split-home full-width-home">
        <CaptainDutyRightView
          partnerDetails={partnerDetails}
          isOnDuty={isOnDuty}
          setIsOnDuty={setIsOnDuty}
          onOpenProfile={() => navigateTo('profile')}
        />
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar with SART Business branding, Location, and Google-style Profile */}
      <CaptainHeader
        partnerDetails={partnerDetails}
        isOnDuty={isOnDuty}
        setIsOnDuty={setIsOnDuty}
        onOpenProfile={() => navigateTo('profile')}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        activeSubTab={activeSubTab}
        setActiveSubTab={(tab) => {
          setActiveSubTab(tab);
          if (tab === 'rides') navigateTo('ride-home');
          else if (tab === 'carrier') navigateTo('ride-car');
          else if (tab === 'driver') navigateTo('ride-auto');
        }}
        onNavigate={navigateTo}
      />

      {/* Enable Location GPS / Choose Manually Modal */}
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

