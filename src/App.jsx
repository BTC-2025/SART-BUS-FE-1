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
import RideCategoryPage from './components/RideCategoryPage';

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
    if (path.includes('rental')) return { tab: 'rentals', vehicleSlug: null };
    if (path.includes('carrier')) return { tab: 'carriers', vehicleSlug: null };
    if (path.includes('ride')) return { tab: 'rides', vehicleSlug: null };
    if (path.includes('driver')) return { tab: 'drivers', vehicleSlug: null };
    if (path.includes('parking')) return { tab: 'parking', vehicleSlug: null };
    if (path.includes('communit')) return { tab: 'community', vehicleSlug: null };
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
    } else if (route === 'rides') {
      targetUrl = '/rides';
    } else if (route === 'drivers') {
      targetUrl = '/drivers';
    } else if (route === 'parking') {
      targetUrl = '/parking';
    } else if (route === 'community' || route === 'communities') {
      targetUrl = '/community';
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
          />
        );

      case 'rides':
        // Dedicated Rides & Mobility Fleet Hub
        return (
          <RideCategoryPage
            category="all"
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

      case 'community':
      case 'communities':
        // Dedicated SART Community Hub & Union Directory
        return (
          <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                  <i className="fa-solid fa-users"></i>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>SART Transit & Partner Community</h2>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>Connect with fellow fleet captains, transport union members, and logistic operators</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '24px' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '16px', fontWeight: 700 }}><i className="fa-solid fa-users-gear" style={{ color: '#2563eb', marginRight: '8px' }}></i> Fleet Operator Union</h4>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Join regional carrier, cab and fleet associations for regulatory alerts and group welfare.</p>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '16px', fontWeight: 700 }}><i className="fa-solid fa-comments" style={{ color: '#059669', marginRight: '8px' }}></i> Partner Bulletins & Chat</h4>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Live discussions on high-demand zones, fleet incentives, and real-time transit tips.</p>
                </div>
              </div>
            </div>
          </div>
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
              } catch (e) {}
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
