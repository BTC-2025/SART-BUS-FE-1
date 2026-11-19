import React, { useState } from 'react';
import './VehicleDetailsPage.css';

export default function VehicleDetailsPage({
  vehicle,
  onBack = () => { },
  onToggleAvailability = () => { },
  onCompleteTrip = () => { }
}) {
  const isBooked = vehicle?.bookingStatus === 'ALREADY_BOOKED' || (!vehicle?.isAvailable && Boolean(vehicle?.activeBooking));
  const activeBooking = vehicle?.activeBooking;

  // Gallery images: ensures at least 3 images are always shown in the thumbnail gallery
  const [galleryImages, setGalleryImages] = useState(() => {
    if (vehicle?.images && vehicle.images.length >= 3) {
      return vehicle.images;
    }
    if (vehicle?.images && vehicle.images.length > 0) {
      const primary = vehicle.images[0];
      return [
        vehicle.images[0],
        vehicle.images[1] || primary,
        vehicle.images[2] || primary
      ];
    }
    const fallback = vehicle?.image || (vehicle?.type === 'bike' ? '/images/red_bike_3d.png' : '/images/cab_sedan.png');
    return [fallback, fallback, fallback];
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentImage = galleryImages[activeImageIndex] || galleryImages[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const newImg = uploadEvent.target.result;
        setGalleryImages((prev) => {
          const updated = [...prev, newImg];
          if (vehicle) {
            vehicle.images = updated;
            try {
              const stored = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
              const found = stored.find(v => v.id === vehicle.id);
              if (found) {
                found.images = updated;
                localStorage.setItem('sart_business_fleet', JSON.stringify(stored));
              }
            } catch (err) { }
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
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
          <span
            className={`vdp-status-badge ${isBooked ? 'on-trip booked' : vehicle.isAvailable ? 'available' : 'on-trip'}`}
            style={isBooked ? { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5', fontWeight: 800 } : {}}
          >
            ● {isBooked ? 'Not Available' : vehicle.isAvailable ? 'Available' : 'On Trip'}
          </span>

          <label className="simple-switch" title={isBooked ? "Vehicle is actively booked by customer (manual toggle locked)" : "Toggle availability"}>
            <input
              type="checkbox"
              checked={isBooked ? false : vehicle.isAvailable}
              disabled={isBooked}
              onChange={() => !isBooked && onToggleAvailability(vehicle.id)}
            />
            <span className="slider round green" style={isBooked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}></span>
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
            {galleryImages.length > 1 && (
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

          {/* Bottom Thumbnails Strip (Showing 3+ views and + Add Photo button) */}
          <div className="vdp-thumbnails-strip">
            {galleryImages.map((thumbSrc, idx) => (
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
                {idx > 0 && (
                  <span style={{
                    position: 'absolute',
                    bottom: '3px',
                    left: '3px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '4px'
                  }}>
                    {idx === 1 ? 'Side' : idx === 2 ? 'Rear' : `Photo ${idx + 1}`}
                  </span>
                )}
              </div>
            ))}

            {/* In-page Add Photo button */}
            <label
              className="vdp-add-photo-chip"
              title="Add more photos to this vehicle"
              style={{
                width: '84px',
                minWidth: '84px',
                height: '64px',
                borderRadius: '8px',
                border: '1.5px dashed #3b82f6',
                background: '#eff6ff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#2563eb',
                gap: '2px',
                transition: 'all 0.15s ease'
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddPhoto}
                style={{ display: 'none' }}
              />
              <i className="fa-solid fa-plus" style={{ fontSize: '14px' }}></i>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1d4ed8' }}>Add Photo</span>
            </label>
          </div>

          <div className="vdp-status-control-box">
            <div>
              <div className="vdp-label-muted">Vehicle Status</div>
              <div
                className={`vdp-status-strong ${isBooked ? 'on-trip booked' : vehicle.isAvailable ? 'available' : 'on-trip'}`}
                style={isBooked ? { color: '#dc2626', fontWeight: 800 } : {}}
              >
                {isBooked ? 'Already Booked' : vehicle.isAvailable ? 'Ready for Booking' : 'Active On Customer Trip'}
              </div>
            </div>
            {isBooked ? (
              <button
                type="button"
                onClick={() => onCompleteTrip(vehicle.id)}
                className="vdp-btn-toggle complete-trip"
                style={{
                  background: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                }}
              >
                <i className="fa-solid fa-flag-checkered"></i> Complete Trip
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onToggleAvailability(vehicle.id)}
                className={`vdp-btn-toggle ${vehicle.isAvailable ? 'mark-trip' : 'mark-avail'}`}
              >
                Mark as {vehicle.isAvailable ? 'On Trip' : 'Available'}
              </button>
            )}
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

      {/* ACTIVE BOOKING DETAILS PANEL (Visible only when vehicle is booked) */}
      {isBooked && (
        <div className="vdp-active-booking-card" style={{
          marginTop: '8px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* Header Bar */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                <i className="fa-solid fa-key"></i>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#ffffff' }}>
                  Active Customer Booking & Handover Details
                </h3>
                <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                  Booking ID: #{activeBooking?.bookingId || activeBooking?.id || vehicle?.activeBookingId || 'BK-' + vehicle.id} • Status: <strong style={{ color: '#f87171' }}>Already Booked / On Trip</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onCompleteTrip(vehicle.id)}
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#15803d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#16a34a'; }}
            >
              <i className="fa-solid fa-flag-checkered"></i> Complete Trip
            </button>
          </div>

          {/* 4 Structured Information Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            padding: '24px',
            backgroundColor: '#f8fafc'
          }}>
            {/* 1. Booked By */}
            <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0369a1', fontWeight: 700, fontSize: '14px' }}>
                <i className="fa-solid fa-user-shield"></i>
                <span>Booked By</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Full Name:</span>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>
                    {activeBooking?.customerName || 'Passenger (As per Govt ID)'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Phone Number:</span>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>
                    <i className="fa-solid fa-phone" style={{ fontSize: '11px', color: '#64748b', marginRight: '5px' }}></i>
                    {activeBooking?.customerPhone || '+91 98765 43210'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Email:</span>
                  <div style={{ fontWeight: 600, color: '#0f172a', wordBreak: 'break-all' }}>
                    <i className="fa-regular fa-envelope" style={{ fontSize: '11px', color: '#64748b', marginRight: '5px' }}></i>
                    {activeBooking?.customerEmail || 'passenger@gmail.com'}
                  </div>
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: '#ecfdf5',
                    color: '#065f46',
                    border: '1px solid #a7f3d0'
                  }}>
                    <i className="fa-solid fa-circle-check"></i>
                    {activeBooking?.docType || 'Driving License'} Verified
                  </span>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Doc No: <strong>{activeBooking?.docNumber || 'DL-MH12-2022-998811'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. When Booked */}
            <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0284c7', fontWeight: 700, fontSize: '14px' }}>
                <i className="fa-regular fa-calendar-check"></i>
                <span>When Booked & Schedule</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Booking Date/Time:</span>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>
                    {activeBooking?.createdAt ? new Date(activeBooking.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Today, Live Booking'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Pick-up Time:</span>
                  <div style={{ fontWeight: 700, color: '#047857' }}>
                    <i className="fa-solid fa-clock" style={{ fontSize: '11px', marginRight: '5px' }}></i>
                    {activeBooking?.pickupDate || 'Thu, 19 Nov'} • {activeBooking?.pickupTime || '10:00 AM'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Return Time:</span>
                  <div style={{ fontWeight: 700, color: '#b91c1c' }}>
                    <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '11px', marginRight: '5px' }}></i>
                    {activeBooking?.returnDate || 'Fri, 20 Nov'} • {activeBooking?.returnTime || '10:00 AM'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Duration:</span>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>
                    <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                      {activeBooking?.durationPlan || `${activeBooking?.days || 1} Day`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Where Booked */}
            <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#7c3aed', fontWeight: 700, fontSize: '14px' }}>
                <i className="fa-solid fa-location-crosshairs"></i>
                <span>Where Booked</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Pickup Location:</span>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>
                    <i className="fa-solid fa-map-pin" style={{ color: '#e11d48', marginRight: '6px' }}></i>
                    {activeBooking?.pickupLocation || vehicle.location || 'Truro'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Return Location:</span>
                  <div style={{ fontWeight: 600, color: '#334155' }}>
                    {activeBooking?.returnLocation || activeBooking?.pickupLocation || vehicle.location || 'Truro'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Vehicle Distance:</span>
                  <div style={{ fontWeight: 600, color: '#0369a1' }}>
                    <i className="fa-solid fa-route" style={{ marginRight: '5px' }}></i>
                    {activeBooking?.vehicleDistance || '3.13 km from Location'}
                  </div>
                </div>
                <div style={{ marginTop: '4px', fontSize: '11.5px', color: '#475569', background: '#fffbeb', padding: '8px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                  <i className="fa-solid fa-id-card" style={{ color: '#d97706', marginRight: '5px' }}></i>
                  Handover Note: Verify physical original ID copy at vehicle delivery.
                </div>
              </div>
            </div>

            {/* 4. Payment Summary & Complete Trip Action */}
            <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#059669', fontWeight: 700, fontSize: '14px' }}>
                <i className="fa-solid fa-receipt"></i>
                <span>Payment Summary</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Base Rate:</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{activeBooking?.baseRate || 1800}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Taxes & Insurance (18%):</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{activeBooking?.taxAmount || 324}</span>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', margin: '4px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>Total Payable:</span>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: '18px' }}>
                    ₹{activeBooking?.totalAmount || 2124}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Payment Status:</span>
                  <span style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '11px'
                  }}>
                    <i className="fa-solid fa-check-circle" style={{ marginRight: '4px' }}></i> PAID ONLINE
                  </span>
                </div>
                <div style={{ marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => onCompleteTrip(vehicle.id)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#15803d'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#16a34a'; }}
                  >
                    <i className="fa-solid fa-flag-checkered"></i> Complete Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
