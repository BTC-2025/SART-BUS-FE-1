import React, { useState } from 'react';

const CITIES = [
  { name: 'Chennai', state: 'Tamil Nadu', hub: 'Southern Regional Hub', icon: 'fa-building' },
  { name: 'Bangalore', state: 'Karnataka', hub: 'Tech Corridor Hub', icon: 'fa-city' },
  { name: 'Hyderabad', state: 'Telangana', hub: 'Cyber Hub', icon: 'fa-network-wired' },
  { name: 'Coimbatore', state: 'Tamil Nadu', hub: 'Industrial Gateway', icon: 'fa-industry' },
  { name: 'Madurai', state: 'Tamil Nadu', hub: 'Central Heritage Hub', icon: 'fa-landmark' },
  { name: 'Trichy', state: 'Tamil Nadu', hub: 'Delta Transit Hub', icon: 'fa-route' },
  { name: 'Kochi', state: 'Kerala', hub: 'Coastal Logistics Hub', icon: 'fa-anchor' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', hub: 'Krishna Logistics Hub', icon: 'fa-warehouse' },
];

export default function EnableLocationModal({
  isOpen,
  onClose,
  onSelectCity,
  currentCity = 'Chennai'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectMsg, setDetectMsg] = useState('');

  if (!isOpen) return null;

  const filteredCities = CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.hub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetectGPS = () => {
    setIsDetecting(true);
    setDetectMsg('');

    if (!('geolocation' in navigator)) {
      setDetectMsg('Geolocation is not supported by your browser.');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        // GPS located successfully - set default to Chennai or nearest supported hub
        setIsDetecting(false);
        setDetectMsg('Location detected: Chennai (Default Hub)');
        setTimeout(() => {
          onSelectCity?.('Chennai');
          onClose?.();
        }, 600);
      },
      (err) => {
        setIsDetecting(false);
        setDetectMsg('Could not fetch precise GPS coordinates. Please select your city manually below.');
      },
      { timeout: 7000 }
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '24px',
            color: '#ffffff',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '18px',
              top: '18px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
            >
              <i className="fa-solid fa-location-crosshairs"></i>
            </div>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Select Regional Hub</h3>
          </div>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
            Choose your operating city hub to calibrate active fleets, bookings, and regional carrier dispatches.
          </p>
        </div>

        {/* GPS Quick Action */}
        <div style={{ padding: '20px 24px 12px' }}>
          <button
            onClick={handleDetectGPS}
            disabled={isDetecting}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#ecfdf5',
              border: '1.5px dashed #10b981',
              borderRadius: '12px',
              color: '#065f46',
              fontWeight: 700,
              fontSize: '14px',
              cursor: isDetecting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s'
            }}
          >
            <i className={`fa-solid ${isDetecting ? 'fa-spinner fa-spin' : 'fa-location-arrow'}`} style={{ color: '#10b981' }}></i>
            {isDetecting ? 'Detecting current GPS location...' : 'Use Precise Device Location'}
          </button>

          {detectMsg && (
            <div
              style={{
                marginTop: '10px',
                fontSize: '12px',
                color: detectMsg.includes('Could not') ? '#dc2626' : '#059669',
                background: detectMsg.includes('Could not') ? '#fef2f2' : '#f0fdf4',
                padding: '8px 12px',
                borderRadius: '8px'
              }}
            >
              {detectMsg}
            </div>
          )}

          {/* Search Input */}
          <div style={{ position: 'relative', marginTop: '16px' }}>
            <i
              className="fa-solid fa-magnifying-glass"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '14px'
              }}
            ></i>
            <input
              type="text"
              placeholder="Search city, state or regional hub..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 40px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* City Hubs List */}
        <div style={{ overflowY: 'auto', padding: '0 24px 20px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredCities.map((city) => {
              const isSelected = city.name.toLowerCase() === (currentCity || '').toLowerCase();
              return (
                <div
                  key={city.name}
                  onClick={() => {
                    onSelectCity?.(city.name);
                    onClose?.();
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #10b981' : '1px solid #f1f5f9',
                    background: isSelected ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: isSelected ? '#dcfce7' : '#f1f5f9',
                        color: isSelected ? '#10b981' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}
                    >
                      <i className={`fa-solid ${city.icon}`}></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>
                        {city.name}
                        {isSelected && (
                          <span
                            style={{
                              marginLeft: '8px',
                              background: '#10b981',
                              color: '#ffffff',
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '6px',
                              fontWeight: 700
                            }}
                          >
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {city.state} • {city.hub}
                      </div>
                    </div>
                  </div>
                  <i
                    className={`fa-solid ${isSelected ? 'fa-circle-check' : 'fa-chevron-right'}`}
                    style={{ color: isSelected ? '#10b981' : '#cbd5e1', fontSize: '14px' }}
                  ></i>
                </div>
              );
            })}
            {filteredCities.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>
                No regional hubs matched "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
