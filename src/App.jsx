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
import Footer from './components/Footer';
import SettingsView from './components/SettingsView';
import HelpAndSupportView from './components/HelpAndSupportView';

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

  const [activeSideModal, setActiveSideModal] = useState(null);

  // URL route parsing: 'home' | 'rentals' | 'carriers' | 'drivers' | 'parking'
  // Also supports sub-routes like: /rentals/toyota-alphard or /carriers/AddNewVehicle
  const parseCurrentLocation = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/rentals/')) {
      const vehicleSlug = path.replace('/rentals/', '').replace(/\/$/, '');
      return { tab: 'rentals', vehicleSlug: decodeURIComponent(vehicleSlug) };
    }
    if (path.startsWith('/carriers/')) {
      const carrierSub = path.replace('/carriers/', '').replace(/\/$/, '');
      return { tab: 'carriers', vehicleSlug: decodeURIComponent(carrierSub) };
    }
    if (path.startsWith('/parking/')) {
      const parkingSub = path.replace('/parking/', '').replace(/\/$/, '');
      return { tab: 'parking', vehicleSlug: decodeURIComponent(parkingSub) };
    }
    if (path.startsWith('/drivers/')) {
      const driverSub = path.replace('/drivers/', '').replace(/\/$/, '');
      return { tab: 'drivers', vehicleSlug: decodeURIComponent(driverSub) };
    }
    if (path.includes('rental')) return { tab: 'rentals', vehicleSlug: null };
    if (path.includes('carrier')) return { tab: 'carriers', vehicleSlug: null };
    if (path.includes('driver')) return { tab: 'drivers', vehicleSlug: null };
    if (path.includes('parking')) return { tab: 'parking', vehicleSlug: null };
    if (path.includes('helpandsupport') || path.includes('help')) return { tab: 'help', vehicleSlug: null };
    if (path.includes('settings') || path.includes('profile')) return { tab: 'settings', vehicleSlug: null };
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
      targetUrl = vehicleSlug ? `/carriers/${encodeURIComponent(vehicleSlug)}` : '/carriers';
    } else if (route === 'drivers') {
      targetUrl = vehicleSlug ? `/drivers/${encodeURIComponent(vehicleSlug)}` : '/drivers';
    } else if (route === 'parking') {
      targetUrl = vehicleSlug ? `/parking/${encodeURIComponent(vehicleSlug)}` : '/parking';
    } else if (route === 'help') {
      targetUrl = '/HelpAndSupport';
    } else if (route === 'settings' || route === 'profile') {
      targetUrl = '/Settings';
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
        // Dedicated Carrier Logistics & Freight fleet hub or /carriers/AddNewVehicle
        return (
          <Carrier
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
            urlSubPath={currentVehicleSlug}
          />
        );

      case 'drivers':
        // Dedicated Hire Drivers fleet & chauffeur hub
        return (
          <HireDrivers
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
            urlSubPath={currentVehicleSlug}
          />
        );

      case 'parking':
        // Dedicated Safe Parking slots reservation & slot management or /parking/AddVehicle
        return (
          <ParkingSlot
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
            urlSubPath={currentVehicleSlug}
          />
        );

      case 'help':
        // Dedicated Help & Support page (http://localhost:3007/HelpAndSupport)
        return (
          <HelpAndSupportView
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
          />
        );

      case 'settings':
      case 'profile':
        // Dedicated Settings / Profile page (http://localhost:3007/Settings)
        return (
          <SettingsView
            partnerDetails={partnerDetails}
            onNavigate={navigateTo}
            onUpdatePartner={(updated) => {
              setPartnerDetails(prev => ({ ...prev, ...updated }));
              try {
                localStorage.setItem('sart_captain_session', JSON.stringify({ ...partnerDetails, ...updated }));
              } catch (e) { }
            }}
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
      {/* Top Navbar with showSubNav set to true (4 buttons in SubNav) */}
      <Navbar
        partnerDetails={partnerDetails}
        onOpenProfile={() => navigateTo('home')}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        activeTab={currentTab}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        isSideToolOpen={isSideToolOpen}
        onToggleSideTool={() => setIsSideToolOpen(!isSideToolOpen)}
        showSubNav={true}
      />

      {/* Main Layout: Full width content without sidebar */}
      <div
        className={`business-main-layout ${activeSideModal ? 'has-active-bittool-panel' : ''}`}
        style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 92px)', width: '100%', position: 'relative' }}
      >
        {/* Content Area */}
        <main style={{
          flex: 1,
          padding: '4px 4px',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          marginRight: isSideToolOpen ? (activeSideModal ? '498px' : '58px') : '0px',
          transition: 'all 0.22s ease'
        }}>
          {renderCurrentView()}
          <Footer onNavigate={navigateTo} />
        </main>

        {/* Right Side Bit Tool Strip (Image 1 UI) */}
        <SideAccountDrawer
          partnerDetails={partnerDetails}
          isOpen={isSideToolOpen}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onSwitchAccount={() => {
            handleLogout();
            setAuthView('login');
          }}
          onActiveToolChange={(toolKey) => setActiveSideModal(toolKey)}
        />
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
