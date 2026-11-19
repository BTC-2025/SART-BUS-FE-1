import React, { useState } from 'react';
import './AllBookingsManagement.css';
import './MotorsMarketplace.css';

const DEFAULT_BOOKINGS = [
  {
    id: 'BK-9901',
    service: 'Vehicle Rental',
    item: 'Maruti Suzuki Ertiga VXi (TN 22 CX 9012)',
    customer: 'Venkatesh Rao',
    phone: '+91 98401 22891',
    pickup: 'Chennai Airport Terminal 2',
    drop: 'OMR IT Corridor',
    date: 'Today, 10:00 AM',
    duration: '3 Days (Self-Drive)',
    amount: '₹5,400',
    deposit: '₹5,000 (Authorized)',
    assigned: 'Vehicle Handed Over',
    status: 'Ongoing',
    statusColor: '#2563eb'
  },
  {
    id: 'BK-9902',
    service: 'Driver Hiring',
    item: 'Customer Own Vehicle (Toyota Fortuner)',
    customer: 'Priya Sundaram',
    phone: '+91 97890 44211',
    pickup: 'Anna Nagar West, Chennai',
    drop: 'Mahabalipuram Resorts',
    date: 'Today, 02:30 PM',
    duration: '8 Hours (Full Day)',
    amount: '₹1,000',
    deposit: 'N/A',
    assigned: 'Driver: Anand Sundaram (+91 97902 44109)',
    status: 'Driver Assigned',
    statusColor: '#f59e0b'
  },
  {
    id: 'BK-9903',
    service: 'Cargo Dispatch',
    item: 'Tata Steel Tubes 1.5 Tonne',
    customer: 'Apex Infrastructure Ltd',
    phone: '+91 99120 88210',
    pickup: 'Ambattur Industrial Estate',
    drop: 'Whitefield Container Terminal, Bengaluru',
    date: 'Yesterday, 06:00 PM',
    duration: '350 km Transit',
    amount: '₹18,500',
    deposit: 'E-Way Bill EWB-8821948190',
    assigned: 'Driver: Ramesh Kumar (Ashok Leyland Dost)',
    status: 'In Transit',
    statusColor: '#3b82f6'
  },
  {
    id: 'BK-9904',
    service: 'Parking Bay',
    item: 'Heavy Multi-Axle Bay A-12',
    customer: 'National Transport Corp',
    phone: '+91 94441 55219',
    pickup: 'Chennai Central Logistics Terminal',
    drop: 'Bay Entry Point',
    date: 'Today, 08:00 AM',
    duration: '24 Hours Window',
    amount: '₹400',
    deposit: 'Demurrage ₹0',
    assigned: 'Slot P001 Allocated',
    status: 'Vehicle Entered',
    statusColor: '#10b981'
  },
  {
    id: 'BK-9905',
    service: 'Spare Part Order',
    item: 'Brembo Ceramic Front Brake Pads',
    customer: 'Karthik Raja',
    phone: '+91 98200 11982',
    pickup: 'Warehouse Bay 3',
    drop: 'T. Nagar, Chennai',
    date: 'Today, 11:15 AM',
    duration: 'Standard Express Shipping',
    amount: '₹4,850',
    deposit: 'Paid Online',
    assigned: 'AWB BlueDart #99021',
    status: 'Packed & Dispatched',
    statusColor: '#8b5cf6'
  }
];

export default function AllBookingsManagement({ partnerDetails }) {
  const [selectedService, setSelectedService] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState(DEFAULT_BOOKINGS);
  const [selectedBookingForKyc, setSelectedBookingForKyc] = useState(null);

  // Live fetch from backend API
  React.useEffect(() => {
    let isMounted = true;
    const loadLiveBookings = async () => {
      try {
        let res = await fetch('http://localhost:5000/api/rental/bookings').catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            const formattedLive = json.data.map((item: any) => ({
              id: item.bookingId || item.id,
              service: 'Vehicle Rental',
              item: `${item.vehicleName} (${item.vehicleSpecs || '5 Seats • Manual • Petrol'})`,
              customer: item.customerName,
              phone: item.customerPhone,
              pickup: item.pickupLocation,
              drop: item.returnLocation || item.pickupLocation,
              date: `${item.pickupDate} • ${item.pickupTime}`,
              returnDate: `${item.returnDate} • ${item.returnTime}`,
              duration: `${item.durationPlan || `${item.days || 1} Day`}`,
              amount: `₹${item.totalAmount}`,
              baseRate: `₹${item.baseRate || 1800}`,
              taxAmount: `₹${item.taxAmount || 324}`,
              deposit: 'Authorized at Handover',
              assigned: `Distance: ${item.vehicleDistance || '3.13 km from Location'}`,
              distance: item.vehicleDistance || '3.13 km from Location',
              status: item.status || 'Confirmed',
              statusColor: '#10b981',
              customerAge: item.customerAge || '26',
              docType: item.docType || 'Driving License',
              docNumber: item.docNumber || 'DL-MH12-2022-009871',
              uploadedDocName: item.uploadedDocName || 'driving_license_front.jpg',
              vehicleImage: item.vehicleImage,
              vehicleName: item.vehicleName,
              vehicleSpecs: item.vehicleSpecs,
              rawItem: item
            }));

            // Merge with default bookings avoiding duplicate IDs
            setBookings((prev) => {
              const existingIds = new Set(formattedLive.map((f: any) => f.id));
              const nonDuplicates = prev.filter((p: any) => !existingIds.has(p.id));
              return [...formattedLive, ...nonDuplicates];
            });
          }
        }
      } catch (err) {
        console.warn('API offline, keeping default bookings');
      }
    };

    loadLiveBookings();
    const interval = setInterval(loadLiveBookings, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filtered = bookings.filter((b) => {
    if (selectedService !== 'ALL' && b.service !== selectedService) return false;
    if (selectedStatus !== 'ALL' && b.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.item.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusUpdate = async (id, newStatus) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    try {
      await fetch(`http://localhost:5000/api/rental/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      }).catch(() => null);
    } catch (e) { }
    alert(`Booking ${id} status updated to: ${newStatus}!`);
  };

  return (
    <div className="motors-marketplace-container">
      {/* Breadcrumb Bar */}
      <div className="motors-breadcrumb-bar">
        <span>Home</span>
        <i className="fa-solid fa-chevron-right"></i>
        <span>Universal Booking Operations</span>
        <i className="fa-solid fa-chevron-right"></i>
        <span className="active">All Bookings Management</span>
      </div>

      {/* Title */}
      <div className="motors-main-title-row">
        <div>
          <h1 className="motors-title">
            All Bookings
            <span className="motors-results-count">({filtered.length} active bookings)</span>
          </h1>
        </div>

        <div className="motors-toolbar-right">
          <button
            onClick={() => alert('Exporting all bookings to CSV / Excel spreadsheet...')}
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontWeight: '700',
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fa-solid fa-file-excel" style={{ color: '#10b981' }}></i>
            Export Excel
          </button>
        </div>
      </div>

      {/* Filter Tabs by Service Category */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: 'All Bookings', icon: 'fa-table-cells' },
          { id: 'Vehicle Rental', label: 'Vehicle Rentals', icon: 'fa-car' },
          { id: 'Driver Hiring', label: 'Driver Hiring (Own Car)', icon: 'fa-user-tie' },
          { id: 'Cargo Dispatch', label: 'Cargo & Trucks', icon: 'fa-truck-moving' },
          { id: 'Parking Bay', label: 'Parking Slots', icon: 'fa-square-parking' },
          { id: 'Spare Part Order', label: 'Spare Parts Orders', icon: 'fa-boxes-packing' }
        ].map((tab) => {
          const isSel = selectedService === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedService(tab.id)}
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: isSel ? '#2563eb' : '#e2e8f0',
                background: isSel ? '#2563eb' : '#ffffff',
                color: isSel ? '#ffffff' : '#334155',
                fontWeight: isSel ? '700' : '600',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <i className="fa-solid fa-magnifying-glass" style={{ color: '#94a3b8' }}></i>
        <input
          type="text"
          placeholder="Filter by booking ID, customer name, vehicle plate, or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#0f172a' }}
        />
      </div>

      {/* Bookings Table / Roster */}
      <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '14px 16px', color: '#475569' }}>Booking ID & Service</th>
                <th style={{ padding: '14px 16px', color: '#475569' }}>Customer & Contact</th>
                <th style={{ padding: '14px 16px', color: '#475569' }}>Item / Route</th>
                <th style={{ padding: '14px 16px', color: '#475569' }}>Duration & Time</th>
                <th style={{ padding: '14px 16px', color: '#475569' }}>Amount & Deposit</th>
                <th style={{ padding: '14px 16px', color: '#475569' }}>Assignment / Driver</th>
                <th style={{ padding: '14px 16px', color: '#475569' }}>Status</th>
                <th style={{ padding: '14px 16px', color: '#475569' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '800', color: '#2563eb' }}>{b.id}</div>
                    <span style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      marginTop: '4px',
                      display: 'inline-block'
                    }}>
                      {b.service}
                    </span>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{b.customer}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{b.phone}</div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#334155' }}>{b.item}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {b.pickup} ➔ {b.drop}
                    </div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600' }}>{b.duration}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{b.date}</div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px' }}>{b.amount}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{b.deposit}</div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: '600' }}>
                      {b.assigned}
                    </div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      display: 'inline-block'
                    }}>
                      {b.status}
                    </span>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedBookingForKyc(b)}
                        title="View Full Booking & KYC Verification"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: '#e0f2fe',
                          border: '1px solid #7dd3fc',
                          color: '#0369a1',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}
                      >
                        <i className="fa-solid fa-id-card"></i> View KYC
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(b.id, 'Vehicle Handed Over')}
                        title="Mark Vehicle Handed Over"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          color: '#065f46',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>

                      <button
                        onClick={() => alert(`Invoice generated for ${b.id}. Customer: ${b.customer}. Total: ${b.amount}.`)}
                        title="Download Invoice"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          color: '#475569',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <i className="fa-solid fa-file-pdf"></i>
                      </button>

                      <button
                        onClick={() => alert(`Live GPS Tracking for ${b.id}... Ping received from device telematics.`)}
                        title="Track GPS"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: '#2563eb',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <i className="fa-solid fa-location-crosshairs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC & HANDOVER VERIFICATION MODAL FOR VEHICLE OWNER */}
      {selectedBookingForKyc && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Rental Booking KYC & Handover
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                  {selectedBookingForKyc.vehicleName || selectedBookingForKyc.item}
                </h2>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Booking Ref: <strong>{selectedBookingForKyc.id}</strong> • Status: <strong style={{ color: '#16a34a' }}>{selectedBookingForKyc.status}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForKyc(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', fontSize: '16px' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Vehicle & Trip Specs */}
            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block', fontWeight: 700 }}>SPECS</span>
                  <strong style={{ color: '#0f172a' }}>{selectedBookingForKyc.vehicleSpecs || '5 Seats • Manual • Petrol'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block', fontWeight: 700 }}>PICKUP LOCATION</span>
                  <strong style={{ color: '#0f172a' }}>{selectedBookingForKyc.pickup || 'Truro'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block', fontWeight: 700 }}>PICK-UP TIME</span>
                  <strong style={{ color: '#0f172a' }}>{selectedBookingForKyc.date || 'Thu, 19 Nov • 10:00 AM'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block', fontWeight: 700 }}>RETURN TIME</span>
                  <strong style={{ color: '#0f172a' }}>{selectedBookingForKyc.returnDate || 'Fri, 20 Nov • 10:00 AM'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block', fontWeight: 700 }}>VEHICLE DISTANCE</span>
                  <strong style={{ color: '#0284c7' }}>{selectedBookingForKyc.distance || '3.13 km from Location'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block', fontWeight: 700 }}>RENTAL DURATION</span>
                  <strong style={{ color: '#0f172a' }}>{selectedBookingForKyc.duration || '1 Day'}</strong>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#475569' }}>
                  Base Rate: <strong>{selectedBookingForKyc.baseRate || '₹1800'}</strong> + Taxes (18%): <strong>{selectedBookingForKyc.taxAmount || '₹324'}</strong>
                </span>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#059669' }}>
                  Total Payable: {selectedBookingForKyc.amount || '₹2124'}
                </span>
              </div>
            </div>

            {/* Driver & Document Verification Box */}
            <div style={{ border: '1.5px solid #0284c7', background: '#f0f9ff', borderRadius: '14px', padding: '18px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0369a1' }}>
                <i className="fa-solid fa-id-card" style={{ fontSize: '16px' }}></i>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Driver & Document Verification Required for Handover</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700, display: 'block' }}>FULL NAME (AS PER GOVT ID)</span>
                  <strong style={{ color: '#0f172a' }}>{selectedBookingForKyc.customer}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700, display: 'block' }}>AGE (YEARS)</span>
                  <strong style={{ color: '#0f172a' }}>{selectedBookingForKyc.customerAge || '26'} Years</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700, display: 'block' }}>MOBILE PHONE NUMBER</span>
                  <strong style={{ color: '#0f172a' }}>{selectedBookingForKyc.phone}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700, display: 'block' }}>SELECTED DOCUMENT</span>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '11.5px' }}>
                    {selectedBookingForKyc.docType || 'Driving License'}
                  </span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700, display: 'block' }}>DOCUMENT NUMBER</span>
                  <strong style={{ fontSize: '14px', color: '#0f172a', letterSpacing: '0.04em' }}>
                    {selectedBookingForKyc.docNumber || 'DL-MH12-2022-009871'}
                  </strong>
                </div>
              </div>

              {/* Uploaded Document Copy */}
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-file-image" style={{ color: '#0284c7', fontSize: '20px' }}></i>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                      Uploaded: {selectedBookingForKyc.uploadedDocName || 'driving_license_front.jpg'}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>JPG, PNG, PDF up to 10MB • Verified Digital Copy</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Opening preview of uploaded document: ${selectedBookingForKyc.uploadedDocName || 'driving_license_front.jpg'}`)}
                  style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-eye"></i> View File
                </button>
              </div>
            </div>

            {/* Mandatory Original Copy Notice */}
            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ color: '#d97706', fontSize: '18px', marginTop: '2px' }}></i>
              <div style={{ fontSize: '12.5px', color: '#92400e', lineHeight: 1.45 }}>
                <strong>Mandatory Original Copy Notice:</strong> When taking delivery of the vehicle, you must submit and physically verify the <strong>original physical copy</strong> of your Driving License / Aadhaar / PAN card to the vehicle owner or hub representative.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedBookingForKyc(null)}
                style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleStatusUpdate(selectedBookingForKyc.id, 'Vehicle Handed Over');
                  setSelectedBookingForKyc(null);
                }}
                style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: '#16a34a', color: '#ffffff', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <i className="fa-solid fa-key"></i> Verify Original ID & Hand Over Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
