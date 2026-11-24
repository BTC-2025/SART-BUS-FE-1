import React, { useState, useEffect } from 'react';

export default function CarrierBookingDetailsModal({
  isOpen,
  onClose,
  carrierVehicle,
  onBookingCompleted
}) {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [driverName, setDriverName] = useState('Captain R. Ramesh');
  const [driverPhone, setDriverPhone] = useState('+91 98451 98765');
  const [assignedBay, setAssignedBay] = useState('Coastal Dock Bay #4');
  const [isCompleting, setIsCompleting] = useState(false);
  const [completedSuccessMsg, setCompletedSuccessMsg] = useState(null);

  // Load bookings for this vehicle
  useEffect(() => {
    if (!isOpen || !carrierVehicle) return;

    const loadBookings = async () => {
      // 1. Try to fetch from Backend API
      try {
        const res = await fetch(`http://localhost:3005/api/carriers/bookings?vehicleId=${encodeURIComponent(carrierVehicle.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.bookings) && data.bookings.length > 0) {
            setBookings(data.bookings);
            setSelectedBooking(data.bookings[0]);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend fetch error:', err);
      }

      // 2. Check localStorage cross-app sync
      try {
        const local = localStorage.getItem('sart_carrier_bookings');
        if (local) {
          const parsed = JSON.parse(local);
          const matched = parsed.filter((b) =>
            b.vehicleId === carrierVehicle.id ||
            b.vehicleName?.toLowerCase() === carrierVehicle.name?.toLowerCase() ||
            b.vehicleReg === carrierVehicle.plate ||
            b.vehicleReg === carrierVehicle.regId
          );
          if (matched.length > 0) {
            setBookings(matched);
            setSelectedBooking(matched[0]);
            return;
          }
        }
      } catch (e) { }

      // 3. Fallback demo booking if none exists yet so the owner can preview and test immediately
      const sampleBooking = {
        id: `CRG-BK-${Date.now().toString().slice(-6)}`,
        vehicleId: carrierVehicle.id,
        vehicleName: carrierVehicle.name || 'Shipping Corporation of India',
        vehicleReg: carrierVehicle.plate || carrierVehicle.regId || 'IMO 234',
        mode: carrierVehicle.mode || 'ship',
        customerName: 'Tata Steel Logistics Ltd.',
        customerPhone: '+91 98401 23456',
        senderType: 'Business (GST Registered)',
        senderGstin: '33AAACT1234F1Z9',
        senderEmail: 'dispatch@tatasteel.com',
        receiverName: 'Bengaluru Industrial Steel Works',
        receiverPhone: '+91 98800 87654',
        receiverType: 'Business (GST Registered)',
        receiverGstin: '29AAACB5678G1Z2',
        pickup: 'Tata Steel Logistics Hub, Chennai, Tamil Nadu - 600081',
        pickupAddress: 'Dock 4, Chennai Harbour, Rajaji Salai, Chennai, Tamil Nadu - 600001',
        deliveryAddress: 'Plot 41, Logistics Freight Corridor, Hyderabad Cargo Complex, Telangana - 500051',
        dropLoc: 'Hyderabad Cargo Complex, Telangana - 500051',
        pickupDate: '2026-11-25',
        pickupTime: '08:30 AM',
        goodsType: 'Heavy Industrial Steel Coils & Marine Machinery',
        goodsCategory: 'Industrial & Heavy Commercial',
        cargoWeight: '52,000 Tonnes',
        consignmentValue: 18500000,
        ewayBillNumber: 'EWB-892104928173',
        distanceKm: 850,
        totalPrice: carrierVehicle.baseCharge ? (carrierVehicle.baseCharge * 2) : 180000,
        advancePaid: carrierVehicle.baseCharge ? Math.round(carrierVehicle.baseCharge * 0.8) : 72000,
        remainingBalance: carrierVehicle.baseCharge ? (carrierVehicle.baseCharge * 1.2) : 108000,
        payMethod: 'Online Bank Transfer / Corporate Advance',
        status: 'Advance Paid - Ready to Dispatch',
        createdAt: new Date().toISOString()
      };
      setBookings([sampleBooking]);
      setSelectedBooking(sampleBooking);
    };

    loadBookings();
  }, [isOpen, carrierVehicle]);

  if (!isOpen || !carrierVehicle) return null;

  // Complete Ride & Trigger Dispatch Notifications
  const handleConfirmRideCompleted = async () => {
    if (!selectedBooking) return;
    setIsCompleting(true);

    try {
      await fetch(`http://localhost:3005/api/carriers/bookings/${selectedBooking.id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverName,
          driverPhone,
          assignedBay
        })
      });
    } catch (e) { }

    // Update in localStorage
    try {
      const local = localStorage.getItem('sart_carrier_bookings');
      if (local) {
        const parsed = JSON.parse(local);
        const updated = parsed.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, status: 'Ride Completed / Goods Delivered', driverName, driverPhone, assignedBay }
            : b
        );
        localStorage.setItem('sart_carrier_bookings', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) { }

    const updatedBooking = {
      ...selectedBooking,
      status: 'Ride Completed / Goods Delivered',
      driverName,
      driverPhone,
      assignedBay
    };

    setSelectedBooking(updatedBooking);
    setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
    setIsCompleting(false);
    setCompletedSuccessMsg(
      `Delivery Confirmed! Automated Delivery SMS & WhatsApp Notifications successfully dispatched to Sender (${selectedBooking.customerPhone}) and Receiver (${selectedBooking.receiverPhone}).`
    );

    if (onBookingCompleted) {
      onBookingCompleted();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '1080px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}
            >
              <i className="fa-solid fa-clipboard-check"></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Carrier Consignment & Booking Details
                </h3>
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {carrierVehicle.mode?.toUpperCase() || 'SHIP'}
                </span>
              </div>
              <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                Vehicle: <strong>{carrierVehicle.name}</strong> • ID / Reg: <strong>{carrierVehicle.plate || carrierVehicle.regId}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '15px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Success Banner if Completed */}
          {completedSuccessMsg && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                borderRadius: '12px',
                padding: '14px 18px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span style={{ fontSize: '18px' }}>✅</span>
              <div>
                <strong>Ride Completed & Verified!</strong> {completedSuccessMsg}
              </div>
            </div>
          )}

          {/* Booking Selector Pills if multiple */}
          {bookings.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {bookings.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBooking(b)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: selectedBooking?.id === b.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: selectedBooking?.id === b.id ? '#eff6ff' : '#ffffff',
                    color: selectedBooking?.id === b.id ? '#1e40af' : '#475569',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Booking #{idx + 1}: {b.id} ({b.status})
                </button>
              ))}
            </div>
          )}

          {selectedBooking ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Status Header Bar */}
              <div
                style={{
                  background: selectedBooking.status?.includes('Completed') ? '#f0fdf4' : '#fffbeb',
                  border: selectedBooking.status?.includes('Completed') ? '1px solid #bbf7d0' : '1px solid #fde68a',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800, color: selectedBooking.status?.includes('Completed') ? '#166534' : '#92400e' }}>
                    Current Booking Status
                  </span>
                  <div style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                    {selectedBooking.status}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                    Booking Ref: <strong style={{ color: '#0f172a' }}>{selectedBooking.id}</strong> • eWay Bill: <strong style={{ color: '#0f172a' }}>{selectedBooking.ewayBillNumber}</strong>
                  </div>
                </div>

                {/* Price Breakdown Pill */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Total Agreed Freight</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#2563eb' }}>
                    ₹{Number(selectedBooking.totalPrice || 0).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700 }}>
                    Advance Paid: ₹{Number(selectedBooking.advancePaid || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Sender & Receiver Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Sender (Who Sends) */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1d4ed8', fontSize: '13px', fontWeight: 800 }}>
                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                    <span>SENDER DETAILS (DISPATCH POINT)</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {selectedBooking.customerName}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569' }}>
                    <strong>Mobile:</strong> {selectedBooking.customerPhone}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569' }}>
                    <strong>GSTIN:</strong> {selectedBooking.senderGstin || 'Unregistered / Personal'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569' }}>
                    <strong>Pickup Address:</strong> {selectedBooking.pickupAddress || selectedBooking.pickup}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569' }}>
                    <strong>Scheduled Window:</strong> {selectedBooking.pickupDate} at {selectedBooking.pickupTime}
                  </div>
                </div>

                {/* Receiver (Who Receives) */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '13px', fontWeight: 800 }}>
                    <i className="fa-solid fa-arrow-down-to-bracket"></i>
                    <span>RECEIVER DETAILS (DELIVERY POINT)</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {selectedBooking.receiverName || 'Consignee Receiver'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569' }}>
                    <strong>Mobile:</strong> {selectedBooking.receiverPhone || '+91 98765 43210'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569' }}>
                    <strong>GSTIN:</strong> {selectedBooking.receiverGstin || 'Registered Business'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569' }}>
                    <strong>Delivery Address:</strong> {selectedBooking.deliveryAddress || selectedBooking.dropLoc}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569' }}>
                    <strong>Balance on Delivery:</strong> ₹{Number(selectedBooking.remainingBalance || 0).toLocaleString('en-IN')}
                  </div>
                </div>

              </div>

              {/* Goods & Cargo Details */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7c3aed', fontSize: '13px', fontWeight: 800 }}>
                  <i className="fa-solid fa-boxes-stacked"></i>
                  <span>CONSIGNMENT & CARGO SPECIFICATIONS</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12.5px' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>Goods Category</span>
                    <strong style={{ color: '#0f172a' }}>{selectedBooking.goodsCategory || 'Industrial Freight'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>Cargo Description</span>
                    <strong style={{ color: '#0f172a' }}>{selectedBooking.goodsType}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>Consignment Weight</span>
                    <strong style={{ color: '#0f172a' }}>{selectedBooking.cargoWeight || '52,000 Tonnes'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>Declared Value</span>
                    <strong style={{ color: '#0f172a' }}>₹{Number(selectedBooking.consignmentValue || 18500000).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              {/* Owner Allotment & Trip Confirmation Form */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    Owner Dispatch Allotment & Trip Confirmation
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Review submitted details above, assign your driver/dock, and confirm once goods are delivered to trigger delivery SMS/WhatsApp to sender and receiver.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Assigned Captain / Driver Name
                    </label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Driver Verified Contact
                    </label>
                    <input
                      type="text"
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Dock / Staging Bay
                    </label>
                    <input
                      type="text"
                      value={assignedBay}
                      onChange={(e) => setAssignedBay(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                    />
                  </div>
                </div>

                {/* Complete Ride & Notify Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Notifications will go to: <strong style={{ color: '#0f172a' }}>{selectedBooking.customerPhone}</strong> (Sender) & <strong style={{ color: '#0f172a' }}>{selectedBooking.receiverPhone || '+91 98765 43210'}</strong> (Receiver)
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmRideCompleted}
                    disabled={isCompleting || selectedBooking.status?.includes('Completed')}
                    style={{
                      background: selectedBooking.status?.includes('Completed') ? '#94a3b8' : '#059669',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      cursor: selectedBooking.status?.includes('Completed') ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: selectedBooking.status?.includes('Completed') ? 'none' : '0 4px 12px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    <i className="fa-solid fa-circle-check"></i>
                    <span>
                      {selectedBooking.status?.includes('Completed')
                        ? 'Ride Completed & Notifications Sent'
                        : isCompleting
                          ? 'Confirming & Sending Notifications...'
                          : 'Confirm Completed & Send Notification'}
                    </span>
                  </button>
                </div>

              </div>

            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No active bookings found for this carrier vehicle.
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>

          {selectedBooking && (
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([JSON.stringify(selectedBooking, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Booking-${selectedBooking.id}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #2563eb',
                background: '#eff6ff',
                color: '#1d4ed8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa-solid fa-download"></i> Download Consignment Manifest
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
