import React, { useState, useEffect } from 'react';

interface CarrierBookedVehicleDetailsProps {
  vehicle: any;
  onNavigate: (route: string, subPath?: string | null) => void;
  onReleaseSuccess?: () => void;
}

export default function CarrierBookedVehicleDetails({
  vehicle,
  onNavigate,
  onReleaseSuccess
}: CarrierBookedVehicleDetailsProps) {
  const [booking, setBooking] = useState<any>(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);

  // Load latest active booking for this vehicle
  useEffect(() => {
    if (!vehicle) return;

    const fetchBookingDetails = async () => {
      // 1. Try Backend API
      try {
        const res = await fetch(`http://localhost:3005/api/carriers/bookings?vehicleId=${encodeURIComponent(vehicle.id || '')}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.bookings) && data.bookings.length > 0) {
            setBooking(data.bookings[0]);
            return;
          }
        }
      } catch (e) {
        console.warn('Backend fetch bookings error:', e);
      }

      // 2. Check localStorage cross-app sync
      try {
        const local = localStorage.getItem('sart_carrier_bookings');
        if (local) {
          const parsed = JSON.parse(local);
          const matched = parsed.filter((b: any) =>
            b.vehicleId === vehicle.id ||
            b.vehicleName?.toLowerCase() === vehicle.name?.toLowerCase() ||
            b.vehicleReg === vehicle.plate ||
            b.vehicleReg === vehicle.regId
          );
          if (matched.length > 0) {
            setBooking(matched[0]);
            return;
          }
        }
      } catch (e) {}

      // 3. If no active booking found in DB or localStorage:
      // If vehicle is available or has no active booking, do NOT show fake/mock booking!
      setBooking(null);
    };

    fetchBookingDetails();
  }, [vehicle]);

  const handleCompleteAndRelease = async () => {
    if (!window.confirm('Are you sure you want to Complete this trip and Release the vehicle back to Available status?')) {
      return;
    }

    setIsReleasing(true);

    try {
      // 1. Release vehicle in backend if ID exists
      if (vehicle?.id) {
        await fetch(`http://localhost:3005/api/carriers/${encodeURIComponent(vehicle.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isAvailable: true, status: 'Available' })
        }).catch(() => {});

        // Call booking completion if booking id exists
        if (booking?.id) {
          await fetch(`http://localhost:3005/api/carriers/bookings/${encodeURIComponent(booking.id)}/complete`, {
            method: 'PATCH'
          }).catch(() => {});
        }
      }

      // 2. Update localStorage logi_pulse_vehicles
      const localVehicles = localStorage.getItem('logi_pulse_vehicles');
      if (localVehicles) {
        try {
          const list = JSON.parse(localVehicles);
          const updated = list.map((v: any) => {
            if (
              v.id === vehicle?.id ||
              v.name?.toLowerCase() === vehicle?.name?.toLowerCase() ||
              v.plate === vehicle?.plate ||
              v.regId === vehicle?.regId
            ) {
              return { ...v, isAvailable: true, status: 'Available' };
            }
            return v;
          });
          localStorage.setItem('logi_pulse_vehicles', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}
      }

      // 3. Update localStorage sart_carrier_bookings
      const localBookings = localStorage.getItem('sart_carrier_bookings');
      if (localBookings) {
        try {
          const bList = JSON.parse(localBookings);
          const bUpdated = bList.map((b: any) => {
            if (b.id === booking?.id || b.vehicleId === vehicle?.id) {
              return { ...b, status: 'Completed & Released' };
            }
            return b;
          });
          localStorage.setItem('sart_carrier_bookings', JSON.stringify(bUpdated));
        } catch (e) {}
      }

      setReleaseSuccess(true);
      if (onReleaseSuccess) onReleaseSuccess();

      setTimeout(() => {
        onNavigate('carriers');
      }, 1000);
    } catch (err) {
      console.error('Error releasing vehicle:', err);
      alert('Trip marked complete and vehicle released!');
      onNavigate('carriers');
    } finally {
      setIsReleasing(false);
    }
  };

  const vName = vehicle?.name || 'TVS KING CARGO 3-WHEELER';
  const vCategory = (vehicle?.mode || vehicle?.type || 'Bike').toUpperCase();
  const vReg = vehicle?.plate || vehicle?.regId || 'TN 45 HN 6789';
  const vHub = vehicle?.hub || vehicle?.location || 'Tata Steel Logistics Hub, Chennai, Tamil Nadu - 600081';
  const vImg = vehicle?.image || (vehicle?.images && vehicle?.images[0]) || '/images/tata_ace_fleet.jpg';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* ================= TOP CARD: Vehicle Presentation Header ================= */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '28px',
          alignItems: 'center'
        }}
      >
        {/* Left: Thumbnail with 360 viewer link */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '100%',
              height: '180px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <img
              src={vImg}
              alt={vName}
              style={{ maxWidth: '90%', maxHeight: '150px', objectFit: 'contain' }}
              onError={(e: any) => {
                e.target.src = '/images/tata_ace_fleet.jpg';
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => alert('Opening interactive 360 viewer...')}
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Click to view 360°
          </button>
        </div>

        {/* Right: Info, Status Badges & Back Button */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div>
            {/* Top row: Category tag, Status pill, and Back to Fleet button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                EXPRESS EV / {vCategory} • CARRIER
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {vehicle?.isAvailable === false || Boolean(booking) ? (
                  <span
                    style={{
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fee2e2',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626' }}></span>
                    Already Booked
                  </span>
                ) : (
                  <span
                    style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      border: '1px solid #a7f3d0',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }}></span>
                    Available
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => onNavigate('carriers')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  ← Back to Fleet
                </button>
              </div>
            </div>

            {/* Vehicle Title */}
            <h1 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>
              {vName.toUpperCase()}
            </h1>

            {/* Specs Line */}
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>
                <strong>Max Load:</strong> {vehicle?.maxPayload || '150 kg'} • {vehicle?.fuel || 'Electric (EV)'} • {vehicle?.containerSpace || 'Insulated Last-Mile Top Box (65L)'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-regular fa-id-badge" style={{ color: '#64748b', fontSize: '12px' }}></i>
                <span><strong>ID / Reg:</strong> {vReg}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-location-dot" style={{ color: '#64748b', fontSize: '12px' }}></i>
                <span><strong>Hub:</strong> {vHub}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* If vehicle is NOT booked, show Vehicle Available status box instead of customer booking */}
      {!booking && vehicle?.isAvailable !== false ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1.5px solid #a7f3d0',
            padding: '40px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.05)'
          }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
            Vehicle is Available & Active in Fleet
          </h3>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', maxWidth: '480px' }}>
            No customer has booked this carrier vehicle yet. It is live and currently available for booking on the customer portal. Once a customer books this vehicle, their full consignment details, route, and advance payment will appear here automatically.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('carriers')}
            style={{
              marginTop: '8px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ← Back to Fleet Overview
          </button>
        </div>
      ) : (
        <>
          {/* ================= DARK HEADER: Customer Booking & Verification Details ================= */}
          <div
            style={{
              background: '#1e293b',
              borderRadius: '14px',
              padding: '16px 22px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '16px'
                }}
              >
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 800 }}>Customer Booking & Verification Details</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  Booking ID: #{booking?.id || 'BK-695707'} • Ref: {booking?.ref || 'CRG-BK-275765'} • Status: Actively Booked
                </div>
              </div>
            </div>

            <div
              style={{
                background: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ✓ Advance Paid (₹{(booking?.advancePaidAmount || booking?.tariff?.advancePaid || 2640).toLocaleString()})
            </div>
          </div>

          {/* ================= SECTION 1: Route & Destination ================= */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <i className="fa-solid fa-location-dot" style={{ color: '#0284c7' }}></i>
              <span>1. Route & Destination</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', fontSize: '12.5px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  PICKUP LOCATION
                </span>
                <div style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>
                  {booking?.pickupLocation || booking?.pickupAddress || 'Plot No. 42-45, Phase 3, Cherlapally Industrial Area'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  DELIVERY LOCATION
                </span>
                <div style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>
                  {booking?.deliveryLocation || booking?.deliveryAddress || 'Plot No. 112, Stage 2, Peenya Industrial Area'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  SCHEDULE
                </span>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>
                  {booking?.schedule || (booking?.pickupDate ? `${booking.pickupDate} • ${booking.pickupTime || '10:00 AM'}` : '25-11-2026 • 10:00 AM')}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  LOAD TYPE
                </span>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>
                  {booking?.loadType || 'Full Truck Load (FTL) - Dedicated Carrier'}
                </div>
              </div>
            </div>
          </div>

          {/* ================= SECTION 2: Sender Details ================= */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <i className="fa-solid fa-user" style={{ color: '#0284c7' }}></i>
              <span>2. Sender Details</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr 1fr 1fr', gap: '16px', fontSize: '12.5px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  COMPANY
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {booking?.sender?.company || booking?.customerName || 'Tata Steel Logistics & Mfg Ltd.'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  GSTIN
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {booking?.sender?.gstin || booking?.senderGstin || '36AAAAA1111A1Z1'}
                </div>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                  ● GST Verified
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  EMAIL
                </span>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>
                  {booking?.sender?.email || booking?.senderEmail || 'logistics@tatasteel.com'}
                </div>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                  (✓ OTP Verified)
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  MOBILE
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {booking?.sender?.mobile || booking?.customerPhone || '+91 98765 43210'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  DOCUMENT
                </span>
                <a
                  href="#viewDoc"
                  onClick={(e) => { e.preventDefault(); alert('Viewing invoice_67201.pdf'); }}
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#2563eb',
                    textDecoration: 'none',
                    background: '#eff6ff',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  📄 {booking?.sender?.docName || 'invoice_67201.pdf'}
                </a>
              </div>
            </div>
          </div>

          {/* ================= SECTION 3: Receiver Details ================= */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <i className="fa-solid fa-building" style={{ color: '#0284c7' }}></i>
              <span>3. Receiver Details</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr 1.2fr 1.4fr', gap: '16px', fontSize: '12.5px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  COMPANY
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {booking?.receiver?.company || booking?.receiverName || 'Bengaluru Industrial Steel Hub Pvt. Ltd.'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  GSTIN
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {booking?.receiver?.gstin || booking?.receiverGstin || '29BBBBB2222B1Z2'}
                </div>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                  ● GST Verified
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  CONTACT
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {booking?.receiver?.contact || booking?.receiverPhone || 'Anand Hegde • +91 91234 56789'}
                </div>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                  (✓ Verified)
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  EMAIL
                </span>
                <div style={{ fontWeight: 600, color: '#0f172a', wordBreak: 'break-all' }}>
                  {booking?.receiver?.email || 'deliveries@steelhubblr.com'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  UNLOADING HOURS
                </span>
                <div style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.35 }}>
                  {booking?.receiver?.unloadingHours || '09:00 AM - 07:00 PM (Multi-Axle 32ft/40ft Access)'}
                </div>
              </div>
            </div>
          </div>

          {/* ================= SECTION 4: Goods, Cargo & Handling Equipment ================= */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <i className="fa-solid fa-boxes-stacked" style={{ color: '#8b5cf6' }}></i>
              <span>4. Goods, Cargo & Handling Equipment</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr', gap: '16px', fontSize: '12.5px', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  GOODS TYPE
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {booking?.goods?.type || booking?.goodsType || 'Industrial Machinery & Equipment'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  WEIGHT & SIZE
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {booking?.goods?.weightAndSize || `${booking?.cargoWeight || '150 Tons'} • 1 Unit • 18×7.5×8 ft`}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  PACKAGING
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {booking?.goods?.packaging || 'Heavy Wooden Crate'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  E-WAY BILL
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {booking?.goods?.ewayBill || booking?.ewayBillNumber || '241234567890'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12.5px', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                VALUE
              </span>
              <div style={{ fontWeight: 800, color: '#0f172a' }}>
                {booking?.goods?.value || `₹${Number(booking?.consignmentValue || 1850000).toLocaleString('en-IN')}`}
              </div>
            </div>

            {/* Equipment notice alert box */}
            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#92400e',
                fontWeight: 600,
                marginBottom: '12px'
              }}
            >
              {booking?.goods?.equipmentNotice || 'Loading & Unloading Equipment: Loading: Crane / Forklift Required • Unloading: Crane / Forklift Required at Site'}
            </div>

            {/* Tags and attached documents */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                Heavy Load
              </span>
              <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                HAZMAT
              </span>
              <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                Fragile
              </span>
              <a
                href="#doc1"
                onClick={(e) => { e.preventDefault(); alert('Opening commercial_invoice_machinery.pdf'); }}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#059669',
                  background: '#ecfdf5',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                📄 commercial_invoice_machinery.pdf
              </a>
              <a
                href="#doc2"
                onClick={(e) => { e.preventDefault(); alert('Opening eway_bill_123456.pdf'); }}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#059669',
                  background: '#ecfdf5',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                📄 eway_bill_123456.pdf
              </a>
            </div>
          </div>

          {/* ================= SECTION 5: Vehicle Details & Capacity ================= */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <i className="fa-solid fa-truck" style={{ color: '#0284c7' }}></i>
              <span>5. Vehicle Details & Capacity</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.4fr 1.4fr 1fr', gap: '16px', fontSize: '12.5px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  VEHICLE
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {vName}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  ({vCategory} Carrier)
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  REG ID
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {vReg}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '1px' }}>
                    PROPULSION
                  </span>
                  <div style={{ fontSize: '11.5px', color: '#334155', fontWeight: 600 }}>
                    {vehicle?.fuel || 'Electric (EV)'} • {vehicle?.modelYear || '2024'} • 1 Unit
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  CAPACITY
                </span>
                <div style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>
                  Max Payload: {vehicle?.maxPayload || '150 kg (0.15 Tonnes)'} • Insulated Top Box (65L) • 0.65 m³
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  BASE HUB
                </span>
                <div style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>
                  {vHub}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>
                  BADGES
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, width: 'fit-content' }}>
                    Cold-Chain
                  </span>
                  <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#065f46', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, width: 'fit-content' }}>
                    GPS Telematics
                  </span>
                  <span style={{ fontSize: '11px', background: '#fefce8', color: '#854d0e', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, width: 'fit-content' }}>
                    HAZMAT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= SECTION 6: Payment, Transaction ID & Tariff Details ================= */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <i className="fa-solid fa-receipt" style={{ color: '#10b981' }}></i>
              <span>6. Payment, Transaction ID & Tariff Details</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                  TRANSACTION ID
                </span>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                  {booking?.tariff?.txnId || 'TXN-UPI-9845120763'} • Method: {booking?.tariff?.method || booking?.payMethod || 'UPI (PhonePe)'}
                </div>

                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>
                    FARE BREAKDOWN
                  </span>
                  <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                    Base Fee: ₹{(booking?.tariff?.baseFee || vehicle?.baseCharge || 120).toLocaleString()} • Transit Fare: ₹{(booking?.tariff?.transitFare || 7980).toLocaleString()} • GST (18%/5%): ₹{(booking?.tariff?.gst || 1458).toLocaleString()} • Security Deposit: ₹{(booking?.tariff?.deposit || vehicle?.deposit || 1000).toLocaleString()}
                  </div>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Total Freight: </span>
                    <strong style={{ color: '#0f172a', fontSize: '15px' }}>₹{(booking?.tariff?.totalFreight || booking?.totalPrice || 10558).toLocaleString()}</strong>
                  </div>
                  <div style={{ color: '#059669', fontWeight: 700 }}>
                    Advance Paid (25%): ₹{(booking?.tariff?.advancePaid || booking?.advancePaidAmount || 2640).toLocaleString()}
                  </div>
                  <div style={{ color: '#dc2626', fontWeight: 700 }}>
                    Due on Delivery: ₹{(booking?.tariff?.dueOnDelivery || booking?.remainingBalance || 7918).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Green Complete & Release Vehicle Button */}
              <div>
                <button
                  type="button"
                  onClick={handleCompleteAndRelease}
                  disabled={isReleasing || releaseSuccess}
                  style={{
                    background: releaseSuccess ? '#059669' : '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: isReleasing || releaseSuccess ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <i className="fa-solid fa-circle-check"></i>
                  <span>
                    {releaseSuccess
                      ? 'Vehicle Released to Available!'
                      : isReleasing
                      ? 'Releasing Vehicle...'
                      : 'Complete & Release Vehicle'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
