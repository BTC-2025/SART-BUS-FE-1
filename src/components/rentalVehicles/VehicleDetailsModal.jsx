import React from 'react';
import './VehicleDetailsModal.css';

export default function VehicleDetailsModal({ vehicle, isOpen, onClose, onToggleAvailability }) {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="v-details-modal-overlay" onClick={onClose}>
      <div className="v-details-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="v-details-header">
          <div className="v-details-title-row">
            <span className="v-category-badge">{vehicle.category}</span>
            <h2 className="v-details-name">{vehicle.name}</h2>
          </div>
          <button type="button" className="v-details-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body Split */}
        <div className="v-details-body-grid">
          {/* Left: Big Vehicle Showcase Image */}
          <div className="v-details-img-panel">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="v-details-large-img"
              onError={(e) => { e.target.src = '/images/cab_sedan.png'; }}
            />
            <div className="v-status-toggle-bar">
              <div className="v-status-indicator">
                <span className={`status-pill ${vehicle.isAvailable ? 'available' : 'on-trip'}`}>
                  ● {vehicle.isAvailable ? 'Available' : 'On Trip'}
                </span>
                <span className="v-status-hint">
                  {vehicle.isAvailable ? 'Ready for customer booking' : 'Currently active on customer trip'}
                </span>
              </div>
              <label className="simple-switch">
                <input
                  type="checkbox"
                  checked={vehicle.isAvailable}
                  onChange={() => onToggleAvailability && onToggleAvailability(vehicle.id)}
                />
                <span className="slider round green"></span>
              </label>
            </div>
          </div>

          {/* Right: Technical Specs & Owner Pricing */}
          <div className="v-details-info-panel">
            <h3 className="section-label">Vehicle Specifications</h3>
            <div className="specs-metrics-grid">
              <div className="spec-item">
                <span className="spec-label"><i className="fa-solid fa-gas-pump"></i> Fuel Type</span>
                <span className="spec-val">{vehicle.fuel || 'Petrol / Hybrid'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label"><i className="fa-solid fa-gear"></i> Transmission</span>
                <span className="spec-val">{vehicle.transmission || 'Automatic'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label"><i className="fa-solid fa-users"></i> Seating</span>
                <span className="spec-val">{vehicle.seats || '5 Seats'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label"><i className="fa-solid fa-gauge-high"></i> Top Speed</span>
                <span className="spec-val">{vehicle.speed || '210 Km/h'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label"><i className="fa-solid fa-id-card"></i> Reg Plate Number</span>
                <span className="spec-val font-mono">{vehicle.plate}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label"><i className="fa-solid fa-location-dot"></i> Fleet Location</span>
                <span className="spec-val">{vehicle.location || 'Baner, Pune'}</span>
              </div>
            </div>

            <h3 className="section-label" style={{ marginTop: '18px' }}>Rental Pricing Tariffs</h3>
            <div className="pricing-tariff-box">
              <div className="tariff-row">
                <span className="tariff-type">Hourly Rental</span>
                <span className="tariff-amt">{vehicle.pricingText?.split('|')[0]?.trim() || '₹220/hr'}</span>
              </div>
              <div className="tariff-row highlight">
                <span className="tariff-type">Daily Rental (24h)</span>
                <span className="tariff-amt">{vehicle.pricingText?.split('|')[1]?.trim() || '₹2,800/day'}</span>
              </div>
              <div className="tariff-row">
                <span className="tariff-type">Monthly Fleet Lease</span>
                <span className="tariff-amt">{vehicle.pricingText?.split('|')[2]?.trim() || '₹38,000/month'}</span>
              </div>
            </div>

            <div className="verification-status-banner">
              <i className="fa-solid fa-circle-check"></i>
              <div>
                <strong>Government & RTO RC Verified</strong>
                <p>Commercial permit and insurance are up-to-date.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="v-details-footer">
          <button type="button" className="btn-close-secondary" onClick={onClose}>
            Back to Vehicles
          </button>
          <button
            type="button"
            className="btn-status-toggle-primary"
            onClick={() => onToggleAvailability && onToggleAvailability(vehicle.id)}
          >
            Switch to {vehicle.isAvailable ? 'On Trip' : 'Available'}
          </button>
        </div>
      </div>
    </div>
  );
}

