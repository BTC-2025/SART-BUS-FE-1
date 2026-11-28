import React, { useState, useEffect } from 'react';
import './VehicleDetailsPage.css';

export default function VehicleDetailsPage({
  vehicle,
  onBack = () => { },
  onToggleAvailability = () => { },
  onCompleteTrip = () => { },
  onEditVehicle = () => { }
}) {
  // Check booked state from vehicle props or local storage
  const [activeBooking, setActiveBooking] = useState(vehicle?.activeBooking || null);
  const [isBooked, setIsBooked] = useState(
    vehicle?.bookingStatus === 'ALREADY_BOOKED' || (!vehicle?.isAvailable && Boolean(vehicle?.activeBooking))
  );

  useEffect(() => {
    // Look up in sart_business_bookings for any booking linked to this vehicle
    try {
      const storedBookings = JSON.parse(localStorage.getItem('sart_business_bookings') || '[]');
      const found = storedBookings.find(
        (b) =>
          b.vehicleId === vehicle?.id ||
          b.vehicleName?.toLowerCase() === vehicle?.name?.toLowerCase() ||
          b.plate === vehicle?.plate
      );
      if (found) {
        setActiveBooking(found);
        setIsBooked(true);
      } else if (vehicle?.activeBooking) {
        setActiveBooking(vehicle.activeBooking);
        setIsBooked(true);
      }
    } catch (e) { }
  }, [vehicle]);

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

  // Tariffs format
  const hourlyRateText = vehicle.pricing?.hourly ? `₹${vehicle.pricing.hourly}/hr` : (vehicle.pricingText?.split('|')?.[0]?.trim() || '₹150/hr');
  const dailyRateText = vehicle.pricing?.daily ? `₹${vehicle.pricing.daily.toLocaleString()}/day` : (vehicle.pricingText?.split('|')?.[1]?.trim() || '₹1,800/day');
  const monthlyRateText = vehicle.pricing?.monthly ? `₹${vehicle.pricing.monthly.toLocaleString()}/month` : (vehicle.pricingText?.split('|')?.[2]?.trim() || '₹32,000/month');

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px 20px 60px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      boxSizing: 'border-box'
    }}>

      {/* Main 2-Column Grid Matching User Image */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 1.35fr',
        gap: '24px',
        alignItems: 'start'
      }}>

        {/* ================= LEFT COLUMN: BIG IMAGE SHOWCASE + THUMBNAILS ================= */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Main Large Image Card */}
          <div style={{
            width: '100%',
            height: '380px',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            background: '#f8fafc',
            border: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={currentImage}
              alt={vehicle.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = vehicle.type === 'car' ? '/images/cab_sedan.png' : '/images/red_bike_3d.png';
              }}
            />

            {/* Left Chevron */}
            <button
              type="button"
              onClick={handlePrevImage}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.5)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {/* Right Chevron */}
            <button
              type="button"
              onClick={handleNextImage}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.5)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            {/* Click to view 360° pill at bottom center of image */}
            <div style={{
              position: 'absolute',
              bottom: '14px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'none'
            }}>
              <i className="fa-solid fa-rotate"></i> Click to view 360°
            </div>
          </div>

          {/* Bottom Thumbnails Strip with 360°, Side, Rear badges and + Add Photo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {galleryImages.map((thumbSrc, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                style={{
                  width: '92px',
                  height: '66px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  border: idx === activeImageIndex ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                  boxShadow: idx === activeImageIndex ? '0 0 0 1px #7c3aed' : 'none'
                }}
              >
                <img
                  src={thumbSrc}
                  alt={`View ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = vehicle.type === 'car' ? '/images/cab_sedan.png' : '/images/red_bike_3d.png';
                  }}
                />
                {idx === 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: '#f59e0b',
                    color: '#000000',
                    fontSize: '8px',
                    fontWeight: 800,
                    padding: '2px 4px',
                    borderRadius: '4px',
                    lineHeight: 1
                  }}>
                    360°
                  </span>
                )}
                {idx > 0 && (
                  <span style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '3px'
                  }}>
                    {idx === 1 ? 'Side' : idx === 2 ? 'Rear' : `Photo ${idx + 1}`}
                  </span>
                )}
              </div>
            ))}

            {/* + Add Photo Button (Matching User Image) */}
            <label
              title="Add more photos"
              style={{
                width: '92px',
                height: '66px',
                borderRadius: '10px',
                border: '1.5px dashed #93c5fd',
                background: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                gap: '4px',
                color: '#2563eb'
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddPhoto}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: '18px', fontWeight: 600, lineHeight: 1 }}>+</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af' }}>Add Photo</span>
            </label>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: STACKED CARDS ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* CARD 1: Identity & Location */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px 24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#2563eb',
              letterSpacing: '0.6px',
              textTransform: 'uppercase'
            }}>
              {vehicle.category || 'CRUISER (350CC+)'}
            </div>

            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
              {vehicle.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', marginTop: '2px' }}>
              <i className="fa-solid fa-id-card" style={{ fontSize: '12px' }}></i>
              <span><strong>Reg No:</strong> {vehicle.plate}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#475569', lineHeight: 1.45 }}>
              <i className="fa-solid fa-location-dot" style={{ fontSize: '12px', marginTop: '3px' }}></i>
              <span><strong>Location:</strong> {vehicle.location || 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India'}</span>
            </div>
          </div>

          {/* CARD 2: Technical Specifications 2x2 Grid + Verification */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px 24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 800, color: '#0f172a' }}>
              Technical Specifications
            </h3>

            {/* 2x2 Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 14px'
              }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Vehicle Type</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {vehicle.type === 'bike' ? 'Bike' : (vehicle.category || 'Car')}
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 14px'
              }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Fuel System</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {vehicle.fuel || 'Petrol'}
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 14px'
              }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Transmission</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {vehicle.transmission || 'Automatic'}
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 14px'
              }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Seating Capacity</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {vehicle.seats || '2-Seater'}
                </div>
              </div>
            </div>

            {/* Partner Verification Box */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px 14px'
            }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Partner Verification</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>
                Official SART Business
              </div>
            </div>
          </div>

          {/* CARD 3: Pricing Tariffs */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px 24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 800, color: '#0f172a' }}>
              Pricing Tariffs
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px' }}>
              <span style={{ color: '#475569' }}>Hourly Rate</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{hourlyRateText}</span>
            </div>

            {/* Highlighted Daily Rate Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13.5px',
              background: '#eff6ff',
              padding: '8px 12px',
              borderRadius: '6px'
            }}>
              <span style={{ color: '#1d4ed8', fontWeight: 600 }}>Daily Rate (24 Hours)</span>
              <span style={{ fontWeight: 800, color: '#1d4ed8' }}>{dailyRateText}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px' }}>
              <span style={{ color: '#475569' }}>Monthly Lease</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{monthlyRateText}</span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= BOTTOM BAR: STATUS + COMPLETE TRIP (MATCHING USER IMAGE) ================= */}
      <div style={{
        marginTop: '24px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Vehicle Status</div>
          <div style={{
            fontSize: '14px',
            fontWeight: 800,
            color: isBooked ? '#dc2626' : '#16a34a',
            marginTop: '2px'
          }}>
            {isBooked ? 'Already Booked' : 'Available for Booking'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ← Back to Fleet
          </button>

          {isBooked && (
            <button
              type="button"
              onClick={() => onCompleteTrip(vehicle.id)}
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
              }}
            >
              <i className="fa-solid fa-flag-checkered"></i> Complete Trip
            </button>
          )}
        </div>
      </div>

      {/* ================= ACTIVE BOOKED PERSON DETAILS CARD (BELOW THE STATUS BAR) ================= */}
      {isBooked && (
        <div style={{
          marginTop: '20px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
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
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                <i className="fa-solid fa-user-lock"></i>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                  Customer Booking & Verification Details
                </h3>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Booking ID: #{activeBooking?.bookingId || activeBooking?.id || 'BK-482484'} • Status: <strong style={{ color: '#f87171' }}>Actively Booked</strong>
                </span>
              </div>
            </div>

            <span style={{
              background: '#059669',
              color: '#ffffff',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fa-solid fa-circle-check"></i> Payment Confirmed
            </span>
          </div>

          {/* 4 Structured Information Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '18px',
            padding: '24px',
            backgroundColor: '#f8fafc'
          }}>
            {/* 1. Booked Customer Profile */}
            <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#0369a1', fontWeight: 800, fontSize: '13.5px' }}>
                <i className="fa-solid fa-id-badge" style={{ fontSize: '15px' }}></i>
                <span>Customer Information</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</span>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                    {activeBooking?.customerName || 'sai'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Age</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {activeBooking?.customerAge ? `${activeBooking.customerAge} Years` : '26 Years'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Phone / WhatsApp</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-phone" style={{ fontSize: '11px', color: '#2563eb' }}></i>
                    <span>{activeBooking?.customerPhone || '+91 89******88'}</span>
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>
                    <i className="fa-regular fa-envelope" style={{ fontSize: '11px', color: '#2563eb', marginRight: '5px' }}></i>
                    <span>{activeBooking?.customerEmail || 'sa******@gmail.com'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Handover & Verification Notice */}
            <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#0284c7', fontWeight: 800, fontSize: '13.5px' }}>
                <i className="fa-solid fa-shield-check" style={{ fontSize: '15px' }}></i>
                <span>ID & Verification Status</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Govt Verification</span>
                  <div style={{ marginTop: '2px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: '#ecfdf5',
                      color: '#065f46',
                      border: '1px solid #a7f3d0'
                    }}>
                      <i className="fa-solid fa-circle-check"></i> {activeBooking?.docType?.toUpperCase() || 'DRIVING LICENSE'} SUBMITTED
                    </span>
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Document Number</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {activeBooking?.docNumber || 'DL-04-2023-0091823'}
                  </div>
                </div>
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '11.5px',
                  color: '#92400e',
                  lineHeight: 1.45,
                  marginTop: '4px'
                }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ color: '#d97706', marginRight: '5px' }}></i>
                  <strong>Mandatory Check:</strong> Physically verify original physical DL/Govt ID card before handing over keys.
                </div>
              </div>
            </div>

            {/* 3. Schedule & Locations */}
            <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#7c3aed', fontWeight: 800, fontSize: '13.5px' }}>
                <i className="fa-solid fa-location-dot" style={{ fontSize: '15px' }}></i>
                <span>Trip Schedule & Location</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Pickup Location</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {activeBooking?.pickupLocation || activeBooking?.pickup || vehicle.location || 'Katpadi, Vellore'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Pickup Time</span>
                  <div style={{ fontWeight: 700, color: '#047857' }}>
                    <i className="fa-regular fa-clock" style={{ marginRight: '5px' }}></i>
                    {activeBooking?.pickupDate || 'Thu, 19 Nov'} • {activeBooking?.pickupTime || '10:00 AM'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Return Time</span>
                  <div style={{ fontWeight: 700, color: '#b91c1c' }}>
                    <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '5px' }}></i>
                    {activeBooking?.returnDate || 'Fri, 20 Nov'} • {activeBooking?.returnTime || '10:00 AM'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Pickup Mode</span>
                  <div style={{ fontWeight: 700, color: '#2563eb' }}>
                    {activeBooking?.pickupMode === 'delivery' ? 'Doorstep Delivery (+₹1,000)' : "Self-Pickup at Owner's Hub (FREE)"}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Payment & Fare Collected */}
            <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#059669', fontWeight: 800, fontSize: '13.5px' }}>
                <i className="fa-solid fa-receipt" style={{ fontSize: '15px' }}></i>
                <span>Payment & Bill Summary</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Base Fare:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{activeBooking?.baseRate || 1800}.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Taxes (18%):</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{activeBooking?.taxAmount || 324}.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Security Deposit:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{activeBooking?.securityDeposit || 5000}.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Delivery Charges:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{activeBooking?.deliveryCharge || (activeBooking?.pickupMode === 'delivery' ? 1000 : 0)}.00</span>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', margin: '4px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px' }}>Total Paid:</span>
                  <span style={{ fontWeight: 900, color: '#059669', fontSize: '17px' }}>
                    ₹{(activeBooking?.totalAmount || 8124).toLocaleString()}.00
                  </span>
                </div>
                <div style={{ marginTop: '12px' }}>
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
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                    }}
                  >
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
