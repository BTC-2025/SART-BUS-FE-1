import React, { useState } from 'react';
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

  const handleStatusUpdate = (id, newStatus) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
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
                        onClick={() => handleStatusUpdate(b.id, 'Completed')}
                        title="Mark Completed"
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
    </div>
  );
}
