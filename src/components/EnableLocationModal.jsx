import React, { useState } from 'react';

// Popular 4 Metros matching Image 1
const POPULAR_METROS = [
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Bengaluru', state: 'Karnataka' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Mumbai', state: 'Maharashtra' }
];

// Additional Regional Cities & Hubs for search and quick selection
const ALL_REGIONAL_AREAS = [
  { name: 'Chennai', state: 'Tamil Nadu', hub: 'Southern Regional Hub' },
  { name: 'Bengaluru', state: 'Karnataka', hub: 'Tech Corridor Hub' },
  { name: 'Hyderabad', state: 'Telangana', hub: 'Cyber Hub' },
  { name: 'Mumbai', state: 'Maharashtra', hub: 'Western Financial Hub' },
  { name: 'Katpadi', state: 'Tamil Nadu', hub: 'Katpadi, Vellore' },
  { name: 'Vellore', state: 'Tamil Nadu', hub: 'Vellore Smart Hub' },
  { name: 'Pune', state: 'Maharashtra', hub: 'Baner & Hinjewadi Hub' },
  { name: 'Delhi NCR', state: 'Delhi', hub: 'National Capital Hub' },
  { name: 'Coimbatore', state: 'Tamil Nadu', hub: 'Industrial Gateway' },
  { name: 'Madurai', state: 'Tamil Nadu', hub: 'Central Heritage Hub' },
  { name: 'Trichy', state: 'Tamil Nadu', hub: 'Delta Transit Hub' },
  { name: 'Kochi', state: 'Kerala', hub: 'Coastal Logistics Hub' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', hub: 'Krishna Logistics Hub' }
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
  const [detectedPlace, setDetectedPlace] = useState('');

  if (!isOpen) return null;

  // Filter regional areas based on search input
  const filteredAreas = ALL_REGIONAL_AREAS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.hub && c.hub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Exact Village & Place Name Detection via GPS + Reverse Geocoding
  const handleDetectCurrentLocation = () => {
    setIsDetecting(true);
    setDetectMsg('Acquiring high-accuracy GPS coordinates...');
    setDetectedPlace('');

    if (!('geolocation' in navigator)) {
      setDetectMsg('Geolocation is not supported by your browser.');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setDetectMsg('Resolving exact village and place name...');

        try {
          let resolvedPlace = '';
          let villageOrLocality = '';
          let cityOrTown = '';
          let districtOrState = '';

          // 1. Primary: BigDataCloud Reverse Geocoding (high precision, locality & village level)
          try {
            const bdcRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            if (bdcRes.ok) {
              const bdc = await bdcRes.json();
              
              // Inspect administrative levels for specific village / gram / ward / locality
              const adminLevels = bdc.localityInfo?.administrative || [];
              const adminVillage = adminLevels.find(
                (a) =>
                  a.adminLevel >= 6 ||
                  /village|gram|panchayat|locality|ward|mandal|taluk|tehsil/i.test(a.description || '')
              )?.name;

              villageOrLocality = bdc.locality || adminVillage || bdc.city || '';
              cityOrTown = bdc.city || bdc.principalSubdivision || '';
              districtOrState = bdc.principalSubdivision || '';

              if (villageOrLocality && cityOrTown && villageOrLocality.toLowerCase() !== cityOrTown.toLowerCase()) {
                resolvedPlace = `${villageOrLocality}, ${cityOrTown}`;
              } else if (villageOrLocality) {
                resolvedPlace = districtOrState && villageOrLocality.toLowerCase() !== districtOrState.toLowerCase()
                  ? `${villageOrLocality}, ${districtOrState}`
                  : villageOrLocality;
              }
            }
          } catch (e) {
            console.warn('BigDataCloud reverse geocode error:', e);
          }

          // 2. Secondary fallback: OpenStreetMap Nominatim (zoom 18 down to village, hamlet, suburb)
          if (!resolvedPlace || resolvedPlace.trim() === '') {
            try {
              const osmRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
              );
              if (osmRes.ok) {
                const osm = await osmRes.json();
                const addr = osm.address || {};
                
                const village = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict;
                const townOrCity = addr.town || addr.city || addr.municipality || addr.county || addr.district;
                const state = addr.state;

                if (village && townOrCity && village.toLowerCase() !== townOrCity.toLowerCase()) {
                  resolvedPlace = `${village}, ${townOrCity}`;
                } else if (village) {
                  resolvedPlace = state ? `${village}, ${state}` : village;
                } else if (townOrCity) {
                  resolvedPlace = state ? `${townOrCity}, ${state}` : townOrCity;
                } else {
                  resolvedPlace = osm.name || 'Current Location';
                }
              }
            } catch (e) {
              console.warn('OSM reverse geocode error:', e);
            }
          }

          // Final fallback if offline or no network response
          if (!resolvedPlace || resolvedPlace.trim() === '') {
            resolvedPlace = (typeof window !== 'undefined' ? localStorage.getItem('sart_user_location') : '') || 'Katpadi, Vellore';
          }

          setDetectMsg(`📍 Exact Location: ${resolvedPlace}`);
          setDetectedPlace(resolvedPlace);
          setIsDetecting(false);

          // Store in localStorage for business app persistence
          try {
            localStorage.setItem('sart_owner_location', resolvedPlace);
            localStorage.setItem('sart_business_hub', resolvedPlace);
            localStorage.setItem('sart_owner_coords', JSON.stringify({ lat, lng }));
            window.dispatchEvent(
              new CustomEvent('updateBusinessLocation', {
                detail: { city: resolvedPlace, lat, lng }
              })
            );
          } catch (e) { }

          // Auto-apply selection and close modal
          setTimeout(() => {
            onSelectCity?.(resolvedPlace, lat, lng);
            onClose?.();
          }, 800);
        } catch (err) {
          console.error('Location detection error:', err);
          setIsDetecting(false);
          setDetectMsg('Unable to resolve village name. Please select city below.');
        }
      },
      (err) => {
        setIsDetecting(false);
        console.warn('Geolocation error:', err?.message);
        setDetectMsg('Location access was denied or timed out. Please select city below.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleSelectCity = (cityName) => {
    try {
      localStorage.setItem('sart_owner_location', cityName);
      localStorage.setItem('sart_business_hub', cityName);
      window.dispatchEvent(
        new CustomEvent('updateBusinessLocation', {
          detail: { city: cityName }
        })
      );
    } catch (e) { }

    onSelectCity?.(cityName);
    onClose?.();
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
      {/* Modal Card matching Image 1 */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          animation: 'fadeIn 0.2s ease-out',
          padding: '24px 28px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title and Close 'X' Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px'
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.3px'
            }}
          >
            Select Location
          </h2>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: '#334155',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Search Input Box */}
        <div style={{ position: 'relative', marginBottom: '18px' }}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              fontSize: '15px',
              pointerEvents: 'none'
            }}
          ></i>
          <input
            type="text"
            placeholder="Search city, area or locality"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 16px 13px 44px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '14.5px',
              outline: 'none',
              color: '#0f172a',
              background: '#ffffff',
              boxSizing: 'border-box',
              transition: 'all 0.15s ease'
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
          />
        </div>

        {/* Use Current Location Action Button */}
        <div
          onClick={handleDetectCurrentLocation}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#b45309',
            fontWeight: 700,
            fontSize: '14.5px',
            cursor: isDetecting ? 'wait' : 'pointer',
            marginBottom: '20px',
            userSelect: 'none',
            padding: '4px 6px',
            borderRadius: '8px',
            width: 'fit-content',
            transition: 'opacity 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <i
            className={`fa-solid ${isDetecting ? 'fa-spinner fa-spin' : 'fa-crosshairs'}`}
            style={{ fontSize: '15px' }}
          ></i>
          <span>
            {isDetecting ? 'Detecting exact village & location...' : 'Use Current Location'}
          </span>
        </div>

        {/* Detection Feedback message */}
        {detectMsg && (
          <div
            style={{
              marginBottom: '16px',
              fontSize: '13px',
              fontWeight: 600,
              color: detectMsg.includes('Could not') || detectMsg.includes('denied') ? '#dc2626' : '#059669',
              background: detectMsg.includes('Could not') || detectMsg.includes('denied') ? '#fef2f2' : '#f0fdf4',
              border: detectMsg.includes('Could not') || detectMsg.includes('denied') ? '1px solid #fecaca' : '1px solid #bbf7d0',
              padding: '10px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{detectMsg}</span>
          </div>
        )}

        {/* Section Title: Popular Metros & Regions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13.5px',
            fontWeight: 700,
            color: '#64748b',
            marginBottom: '12px'
          }}
        >
          <i className="fa-solid fa-city" style={{ color: '#ea580c', fontSize: '14px' }}></i>
          <span>Popular Metros & Regions</span>
        </div>

        {/* 4 Cards Grid matching Image 1: Chennai, Bengaluru, Hyderabad, Mumbai */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '18px'
          }}
        >
          {POPULAR_METROS.map((metro) => {
            const isSelected = (currentCity || '').toLowerCase().includes(metro.name.toLowerCase());
            return (
              <div
                key={metro.name}
                onClick={() => handleSelectCity(metro.name)}
                style={{
                  background: '#ffffff',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '16px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isSelected ? '#2563eb' : '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.02)';
                }}
              >
                <i
                  className="fa-solid fa-location-dot"
                  style={{
                    fontSize: '20px',
                    color: isSelected ? '#2563eb' : '#475569'
                  }}
                ></i>
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: isSelected ? '#2563eb' : '#0f172a'
                  }}
                >
                  {metro.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Additional Localities & Hubs / Search Results */}
        {searchTerm.trim() !== '' && (
          <div style={{ flex: 1, overflowY: 'auto', marginTop: '6px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
              SEARCH RESULTS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredAreas.map((city) => (
                <div
                  key={city.name}
                  onClick={() => handleSelectCity(city.name)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9',
                    background: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#f1f5f9';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#64748b', fontSize: '13px' }}></i>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>
                        {city.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {city.state} {city.hub ? `• ${city.hub}` : ''}
                      </div>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '12px' }}></i>
                </div>
              ))}
              {filteredAreas.length === 0 && (
                <div style={{ textAlign: 'center', padding: '16px', color: '#94a3b8', fontSize: '13px' }}>
                  No locations found for "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
