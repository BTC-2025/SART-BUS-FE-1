import React, { useState, useEffect } from 'react';
import './DashboardHome.css';
import './rentalVehicles/rentalVehicles.css';
import HotelOverviewShowcase from './rentalVehicles/HotelOverviewShowcase';

export const INITIAL_DEMO_BOOKINGS = [

];

export default function DashboardHome({ partnerDetails, onNavigate }: { partnerDetails?: any; onNavigate?: (tab: string) => void }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [allBookings, setAllBookings] = useState<any[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      let bookings: any[] = [];

      // 1. Load from localStorage sart_business_bookings
      try {
        const stored = localStorage.getItem('sart_business_bookings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            bookings = parsed.map((b: any) => ({
              id: b.bookingId || b.id || `RN-${Math.floor(1000 + Math.random() * 9000)}`,
              serviceType: b.serviceType || '',
              serviceName: b.vehicleName || b.serviceName || '',
              category: b.vehicleSpecs || b.category || '',
              customerName: b.customerName || '',
              customerPhone: b.customerPhone || '',
              bookedDate: b.pickupDate || b.bookedDate || 'Today',
              bookedTime: b.pickupTime || b.bookedTime || '10:00 AM',
              duration: b.durationPlan || b.duration || '1 Day',
              startDate: b.pickupDate ? `${b.pickupDate}, ${b.pickupTime || '10:00 AM'}` : 'Start Date',
              endDate: b.returnDate ? `${b.returnDate}, ${b.returnTime || '10:00 AM'}` : 'End Date',
              amount: typeof b.totalAmount === 'number' ? `₹${b.totalAmount.toLocaleString()}` : (b.amount || '₹1,800'),
              totalAmount: typeof b.totalAmount === 'number' ? b.totalAmount : Number(String(b.amount || '').replace(/[^0-9]/g, '') || 1800),
              status: b.status || 'Scheduled',
              pickupLocation: b.pickupLocation || b.location || 'Baner Hub, Pune',
              icon: (b.serviceType === 'drivers' ? 'fa-user-tie' : b.serviceType === 'parking' ? 'fa-square-parking' : b.serviceType === 'carriers' ? 'fa-truck-moving' : (b.vehicleName?.toLowerCase().includes('bike') ? 'fa-motorcycle' : 'fa-car-side')),
              badgeColor: (b.serviceType === 'drivers' ? '#059669' : b.serviceType === 'parking' ? '#7c3aed' : b.serviceType === 'carriers' ? '#ea580c' : '#2563eb')
            }));
          }
        }
      } catch (e) { }

      // 2. Load from backend if available
      try {
        const res = await fetch('http://localhost:5000/api/rental/bookings').catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
            const existingIds = new Set(bookings.map(b => b.id));
            json.data.forEach((b: any) => {
              const bId = b.bookingId || b.id;
              if (!existingIds.has(bId)) {
                bookings.push({
                  id: bId,
                  serviceType: 'rentals',
                  serviceName: b.vehicleName || 'Rental Vehicle',
                  category: b.vehicleSpecs || 'Fleet Vehicle',
                  customerName: b.customerName || 'Customer',
                  customerPhone: b.customerPhone || '+91 98450 12890',
                  bookedDate: b.pickupDate || 'Today',
                  bookedTime: b.pickupTime || '10:00 AM',
                  duration: b.durationPlan || `${b.days || 1} Days`,
                  startDate: `${b.pickupDate || 'Today'}, ${b.pickupTime || '10:00 AM'}`,
                  endDate: `${b.returnDate || 'Tomorrow'}, ${b.returnTime || '10:00 AM'}`,
                  amount: `₹${Number(b.totalAmount || 1800).toLocaleString()}`,
                  totalAmount: Number(b.totalAmount || 1800),
                  status: b.status || 'Scheduled',
                  pickupLocation: b.pickupLocation || 'Katpadi',
                  icon: b.vehicleName?.toLowerCase().includes('bike') ? 'fa-motorcycle' : 'fa-car-side',
                  badgeColor: '#2563eb'
                });
                existingIds.add(bId);
              }
            });
          }
        }
      } catch (e) { }

      // 3. Do not auto-populate with demo bookings
      setAllBookings(bookings);
    };

    loadBookings();

    const handleBookingEvents = () => {
      loadBookings();
    };

    window.addEventListener('storage', handleBookingEvents);
    window.addEventListener('rental_vehicle_booked', handleBookingEvents);
    window.addEventListener('new_booking_created', handleBookingEvents);
    window.addEventListener('rental_trip_completed', handleBookingEvents);

    return () => {
      window.removeEventListener('storage', handleBookingEvents);
      window.removeEventListener('rental_vehicle_booked', handleBookingEvents);
      window.removeEventListener('new_booking_created', handleBookingEvents);
      window.removeEventListener('rental_trip_completed', handleBookingEvents);
    };
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setAllBookings(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, status: newStatus };
      }
      return b;
    }));

    try {
      const stored = JSON.parse(localStorage.getItem('sart_business_bookings') || '[]');
      const updated = stored.map((b: any) => {
        if ((b.bookingId || b.id) === id) {
          return { ...b, status: newStatus };
        }
        return b;
      });
      localStorage.setItem('sart_business_bookings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('new_booking_created'));
    } catch (e) { }
  };

  const filteredBookings = allBookings.filter((item) => {
    if (activeCategory !== 'all' && item.serviceType !== activeCategory) return false;
    if (statusFilter !== 'all') {
      const st = String(item.status || '').toLowerCase();
      if (statusFilter === 'running' && !st.includes('run') && !st.includes('progress')) return false;
      if (statusFilter === 'scheduled' && !st.includes('schedul') && !st.includes('confirm')) return false;
      if (statusFilter === 'completed' && !st.includes('complet') && !st.includes('finish')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.serviceName.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.pickupLocation.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="unified-dashboard-container">
      {/* 0. ADVANCED UNIFIED MULTI-MODAL DASHBOARD */}
      <HotelOverviewShowcase {...({ onNavigate: onNavigate || (() => { }) } as any)} />

      {/* 3. DASHBOARD SEARCH & STATUS FILTER TOOLBAR */}
      <div className="dashboard-toolbar-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div className="dashboard-search-row" style={{ marginTop: 0 }}>
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search by Customer Name, Booking ID, Vehicle, Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="status-dropdown">
            <span>Status:</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="running">In Progress (Running)</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. LIVE BOOKINGS TABLE CARD */}
      <div className="dashboard-table-card">
        <div className="table-card-header">
          <div className="table-header-title">
            <i className="fa-solid fa-list-check"></i>
            <h3>Live Customer Bookings & Schedule Log</h3>
            <span className="live-pulse-badge">
              <span className="pulse-dot"></span> LIVE DISPATCH
            </span>
          </div>
          <span className="showing-records-text">
            Showing {filteredBookings.length} active bookings
          </span>
        </div>

        <div className="table-responsive-wrapper">
          <table className="enterprise-bookings-table">
            <thead>
              <tr>
                <th>Booking ID & Service</th>
                <th>Booked Customer</th>
                <th>Booking Time & Date</th>
                <th>Booked Duration </th>
                <th>Schedule (Start & End)</th>
                <th>Pickup Location</th>
                <th>Amount</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => {
                const statusStr = String(b.status || '').toLowerCase();
                const isRunning = statusStr.includes('run') || statusStr.includes('progress');
                const isCompleted = statusStr.includes('complet') || statusStr.includes('finish');
                const isScheduled = !isRunning && !isCompleted;

                let statusBg = '#fef3c7';
                let statusColor = '#b45309';
                let statusLabel = 'Scheduled';

                if (isRunning) {
                  statusBg = '#dcfce7';
                  statusColor = '#15803d';
                  statusLabel = 'In Progress (Running)';
                } else if (isCompleted) {
                  statusBg = '#e0f2fe';
                  statusColor = '#0369a1';
                  statusLabel = 'Completed';
                }

                return (
                  <tr key={b.id} className="booking-table-row">
                    <td>
                      <div className="cell-service-info">
                        <div className="service-icon-box" style={{ background: b.badgeColor }}>
                          <i className={`fa-solid ${b.icon}`}></i>
                        </div>
                        <div>
                          <span className="booking-id-tag">{b.id}</span>
                          <strong className="booking-service-name">{b.serviceName}</strong>
                          <span className="booking-category-sub">{b.category}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="cell-customer-info">
                        <strong className="customer-name">{b.customerName}</strong>
                        <span className="customer-phone">
                          <i className="fa-solid fa-phone"></i> {b.customerPhone}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="cell-timestamp">
                        <span className="time-date-main">
                          <i className="fa-regular fa-calendar-days"></i> {b.bookedDate}
                        </span>
                        <span className="time-sub">
                          <i className="fa-regular fa-clock"></i> {b.bookedTime}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="duration-pill">
                        <i className="fa-solid fa-stopwatch"></i> {b.duration}
                      </span>
                    </td>

                    <td>
                      <div className="schedule-window">
                        <span className="start-time">
                          <strong style={{ color: '#16a34a' }}>Start:</strong> {b.startDate}
                        </span>
                        <span className="end-time">
                          <strong style={{ color: '#dc2626' }}>End:</strong> {b.endDate}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="cell-location">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>{b.pickupLocation}</span>
                      </div>
                    </td>

                    <td>
                      <strong className="booking-price">{b.amount}</strong>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                        <span
                          style={{
                            background: statusBg,
                            color: statusColor,
                            padding: '5px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {isRunning && <span className="status-blink-dot"></span>}
                          {isCompleted && <i className="fa-solid fa-check-circle" style={{ fontSize: '11px' }}></i>}
                          {isScheduled && <i className="fa-regular fa-clock" style={{ fontSize: '11px' }}></i>}
                          {statusLabel}
                        </span>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          {isScheduled && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(b.id, 'Running')}
                              style={{
                                background: '#16a34a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '2px 8px',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Start trip"
                            >
                              Start Trip
                            </button>
                          )}
                          {isRunning && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(b.id, 'Completed')}
                              style={{
                                background: '#0284c7',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '2px 8px',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Mark as completed"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="no-bookings-placeholder" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <i className="fa-solid fa-calendar-xmark placeholder-icon" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '12px' }}></i>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
                No active bookings found
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
