import React, { useState } from 'react';
import './VehicleDetailsPage.css';

export default function VehicleDetailsPage({
  vehicle,
  onBack = () => { },
  onToggleAvailability = () => { }
}) {
  // Gallery images support (falls back to single image or array)
  const imageGallery = (vehicle?.images && vehicle.images.length > 0)
    ? vehicle.images
    : [vehicle?.image || '/images/cab_sedan.png'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentImage = imageGallery[activeImageIndex] || imageGallery[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : imageGallery.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < imageGallery.length - 1 ? prev + 1 : 0));
  };

  if (!vehicle) {
    return (
      <div className="vdp-not-found">
        <h3>Vehicle Not Found</h3>
        <p>Could not locate the requested vehicle.</p>
        <button
          type="button"
          onClick={onBack}
          className="vdp-back-btn-primary"
        >
          ← Back to Rentals Fleet
        </button>
      </div>
    );
  }

  return (
    <div className="vdp-container">
      {/* Top Breadcrumb & Status Bar */}
      <div className="vdp-top-bar">
        <div className="vdp-breadcrumb">
          <button
            type="button"
            onClick={onBack}
            className="vdp-back-btn"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Fleet
          </button>
          <span className="vdp-sep">/</span>
          <span>Rentals</span>
          <span className="vdp-sep">/</span>
          <span className="vdp-current-name">{vehicle.name}</span>
        </div>

        <div className="vdp-status-action-group">
          <span className={`vdp-status-badge ${vehicle.isAvailable ? 'available' : 'on-trip'}`}>
            ● {vehicle.isAvailable ? 'Available' : 'On Trip'}
          </span>

          <label className="simple-switch">
            <input
              type="checkbox"
              checked={vehicle.isAvailable}
              onChange={() => onToggleAvailability(vehicle.id)}
            />
            <span className="slider round green"></span>
          </label>
        </div>
      </div>

      {/* Main Responsive Grid: 2 columns on desktop/laptop, 1 column on tablet/mobile */}
      <div className="vdp-main-grid">
        {/* Left Column: Image showcase & Spinny-style thumbnail gallery */}
        <div className="vdp-image-card">
          <div className="vdp-img-frame spinny-gallery-frame">
            <img
              src={currentImage}
              alt={vehicle.name}
              className="vdp-showcase-img"
              onError={(e) => {
                e.target.src = vehicle.type === 'car' ? '/images/cab_sedan.png' : '/images/red_bike_3d.png';
              }}
            />

            {/* Prev / Next Chevrons on image */}
            {imageGallery.length > 1 && (
              <>
                <button
                  type="button"
                  className="vdp-carousel-nav-btn prev"
                  onClick={handlePrevImage}
                  title="Previous image"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  className="vdp-carousel-nav-btn next"
                  onClick={handleNextImage}
                  title="Next image"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </>
            )}

            {/* 360 degree indicator badge matching Spinny Image 2 */}
            <div className="vdp-360-badge">
              <i className="fa-solid fa-rotate"></i> Click to view 360°
            </div>
          </div>

          {/* Bottom Thumbnails Strip matching Image 2 */}
          <div className="vdp-thumbnails-strip">
            {imageGallery.map((thumbSrc, idx) => (
              <div
                key={idx}
                className={`vdp-thumb-item ${idx === activeImageIndex ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(idx)}
              >
                <img
                  src={thumbSrc}
                  alt={`View ${idx + 1}`}
                  onError={(e) => {
                    e.target.src = vehicle.type === 'car' ? '/images/cab_sedan.png' : '/images/red_bike_3d.png';
                  }}
                />
                {idx === 0 && (
                  <span className="vdp-thumb-badge-360">360°</span>
                )}
              </div>
            ))}
          </div>

          <div className="vdp-status-control-box">
            <div>
              <div className="vdp-label-muted">Vehicle Status</div>
              <div className={`vdp-status-strong ${vehicle.isAvailable ? 'available' : 'on-trip'}`}>
                {vehicle.isAvailable ? 'Ready for Booking' : 'Active On Customer Trip'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggleAvailability(vehicle.id)}
              className={`vdp-btn-toggle ${vehicle.isAvailable ? 'mark-trip' : 'mark-avail'}`}
            >
              Mark as {vehicle.isAvailable ? 'On Trip' : 'Available'}
            </button>
          </div>


        </div>

        {/* Right Column: Specs, ID, and Pricing */}
        <div className="vdp-info-stack">
          {/* Identity */}
          <div className="vdp-card">
            <span className="vdp-category-tag">{vehicle.category}</span>
            <h1 className="vdp-title-heading">{vehicle.name}</h1>
            <div className="vdp-meta-row">
              <span><i className="fa-solid fa-id-card"></i> <strong>Reg No:</strong> {vehicle.plate}</span>
              <span><i className="fa-solid fa-location-dot"></i> <strong>Location:</strong> {vehicle.location || 'Baner, Pune'}</span>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="vdp-card">
            <h3 className="vdp-section-heading">Technical Specifications</h3>
            <div className="vdp-specs-grid">
              <div className="vdp-spec-box">
                <span className="vdp-spec-key">Vehicle Type</span>
                <span className="vdp-spec-value capitalized">{vehicle.type || 'Car'}</span>
              </div>
              <div className="vdp-spec-box">
                <span className="vdp-spec-key">Fuel System</span>
                <span className="vdp-spec-value">{vehicle.fuel || 'Petrol / Hybrid'}</span>
              </div>
              <div className="vdp-spec-box">
                <span className="vdp-spec-key">Transmission</span>
                <span className="vdp-spec-value">{vehicle.transmission || 'Automatic'}</span>
              </div>
              <div className="vdp-spec-box">
                <span className="vdp-spec-key">Seating Capacity</span>
                <span className="vdp-spec-value">{vehicle.seats || '5 Seats'}</span>
              </div>
              <div className="vdp-spec-box">
                <span className="vdp-spec-key">Top Speed / Performance</span>
                <span className="vdp-spec-value">{vehicle.speed || '210 Km/h'}</span>
              </div>
              <div className="vdp-spec-box">
                <span className="vdp-spec-key">Partner Verification</span>
                <span className="vdp-spec-value verified">Official SART Business</span>
              </div>
            </div>
          </div>

          {/* Pricing Tariffs */}
          <div className="vdp-card">
            <h3 className="vdp-section-heading">Pricing Tariffs</h3>
            <div className="vdp-tariffs-list">
              <div className="vdp-tariff-row">
                <span className="vdp-tariff-label">Hourly Rate</span>
                <span className="vdp-tariff-price">{vehicle.pricingText?.split('|')[0]?.trim() || '₹220/hr'}</span>
              </div>
              <div className="vdp-tariff-row highlight">
                <span className="vdp-tariff-label">Daily Rate (24 Hours)</span>
                <span className="vdp-tariff-price highlight">{vehicle.pricingText?.split('|')[1]?.trim() || '₹2,800/day'}</span>
              </div>
              <div className="vdp-tariff-row">
                <span className="vdp-tariff-label">Monthly Lease</span>
                <span className="vdp-tariff-price">{vehicle.pricingText?.split('|')[2]?.trim() || '₹38,000/month'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
