import React, { useState } from 'react';

export default function EnableLocationModal({
  isOpen,
  onClose,
  onSelectCity,
  currentCity = 'Chennai'
}) {
  const [showManualCities, setShowManualCities] = useState(false);

  if (!isOpen) return null;

  const CITIES = [
    'Chennai',
    'Bengaluru',
    'Hyderabad',
    'Mumbai',
    'Delhi NCR',
    'Coimbatore',
    'Pune',
    'Kolkata'
  ];

  const handleAllowAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // In a real app we'd reverse-geocode
          onSelectCity(currentCity || 'Chennai');
          onClose();
        },
        (err) => {
          // If denied or timed out, open manual selection
          setShowManualCities(true);
        }
      );
    } else {
      setShowManualCities(true);
    }
  };

  return (
    <div className="sart-loc-overlay" onClick={onClose}>
      <div className="sart-loc-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="sart-loc-close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Location Pin Illustration / Icon */}
        <div className="sart-loc-icon-bubble">
          <i className="fa-solid fa-location-dot"></i>
          <span className="sart-loc-radar-ping"></span>
        </div>

        {/* Title */}
        <h3 className="sart-loc-title">Enable Location</h3>

        {/* Description requested by user */}
        <p className="sart-loc-desc">
          Discover medical clinics, fitness coaches, and styling salons nearest to you. We request access to your device's GPS location.
        </p>

        {!showManualCities ? (
          <div className="sart-loc-actions">
            <button
              type="button"
              id="btn-allow-location-access"
              className="sart-btn-allow-access"
              onClick={handleAllowAccess}
            >
              <i className="fa-solid fa-crosshairs"></i>
              <span>Allow Access</span>
            </button>

            <button
              type="button"
              id="btn-choose-location-manually"
              className="sart-btn-choose-manually"
              onClick={() => setShowManualCities(true)}
            >
              <span>Choose Manually</span>
            </button>
          </div>
        ) : (
          <div className="sart-manual-city-picker">
            <div className="sart-manual-header">
              <i className="fa-solid fa-city"></i>
              <span>Select Your City:</span>
            </div>
            <div className="sart-city-grid">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`sart-city-chip ${currentCity === c ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectCity(c);
                    onClose();
                  }}
                >
                  <i className="fa-solid fa-building"></i>
                  <span>{c}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="sart-btn-back-to-gps"
              onClick={() => setShowManualCities(false)}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to GPS Access</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
