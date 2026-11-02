import React, { useState } from 'react';
import './DashboardHome.css';
import './rentalVehicles/rentalVehicles.css';
import HomeHeroSection from './HomeHeroSection';
import HotelOverviewShowcase from './rentalVehicles/HotelOverviewShowcase';

export default function DashboardHome({ partnerDetails, onNavigate }: { partnerDetails?: any; onNavigate?: (tab: string) => void }) {
  // Service category filter: 'all' | 'rentals' | 'drivers' | 'parking' | 'carriers'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Unified Multi-Modal Live Bookings Data across All 4 Verticals
  const [allBookings] = useState([
    // 1. Rental Vehicle Bookings
    {
      id: 'RN-8801',
      serviceType: 'rentals',
      serviceName: 'Tata Nexon XZ+ (2024)',
      category: 'Compact SUV (MH 12 AB 1234)',
      customerName: 'Rahul Verma',
      customerPhone: '+91 98450 12890',
      bookedDate: '29 Oct 2026',
      bookedTime: '10:30 AM',
      duration: '3 Days (72 Hrs)',
      startDate: '29 Oct 2026, 11:00 AM',
      endDate: '01 Nov 2026, 11:00 AM',
      amount: '₹5,400',
      status: 'Running',
      pickupLocation: 'Baner Hub, Pune',
      icon: 'fa-car-side',
      badgeColor: '#2563eb'
    },
    {
      id: 'RN-8802',
      serviceType: 'rentals',
      serviceName: 'Royal Enfield Classic 350',
      category: 'Cruiser Bike (MH 12 CD 5678)',
      customerName: 'Karthik Raja',
      customerPhone: '+91 94440 55120',
      bookedDate: '29 Oct 2026',
      bookedTime: '08:15 AM',
      duration: '8 Hours',
      startDate: '29 Oct 2026, 09:00 AM',
      endDate: '29 Oct 2026, 05:00 PM',
      amount: '₹480',
      status: 'Running',
      pickupLocation: 'Kothrud Hub, Pune',
      icon: 'fa-motorcycle',
      badgeColor: '#2563eb'
    },
    {
      id: 'RN-8803',
      serviceType: 'rentals',
      serviceName: 'Maruti Suzuki Ertiga 7-Seater',
      category: 'MUV (MH 14 EF 9012)',
      customerName: 'Sanjay Deshmukh',
      customerPhone: '+91 98221 44300',
      bookedDate: '28 Oct 2026',
      bookedTime: '06:00 PM',
      duration: '5 Days (120 Hrs)',
      startDate: '30 Oct 2026, 06:00 AM',
      endDate: '04 Nov 2026, 09:00 PM',
      amount: '₹12,500',
      status: 'Confirmed',
      pickupLocation: 'Airport Delivery Point',
      icon: 'fa-car-side',
      badgeColor: '#2563eb'
    },

    // 2. Hire Drivers Bookings
    {
      id: 'DR-4401',
      serviceType: 'drivers',
      serviceName: 'Chauffeur Mahesh Kumar (Heavy/SUV)',
      category: 'Full-Day Outstation Chauffeur',
      customerName: 'Pooja Hegde (Corporate)',
      customerPhone: '+91 99011 88722',
      bookedDate: '29 Oct 2026',
      bookedTime: '07:45 AM',
      duration: '12 Hours Duty',
      startDate: '29 Oct 2026, 08:30 AM',
      endDate: '29 Oct 2026, 08:30 PM',
      amount: '₹1,600',
      status: 'Running',
      pickupLocation: 'Magarpatta City, Pune',
      icon: 'fa-user-tie',
      badgeColor: '#059669'
    },
    {
      id: 'DR-4402',
      serviceType: 'drivers',
      serviceName: 'Driver Vignesh R. (Manual/Automatic)',
      category: 'Hourly City Chauffeur',
      customerName: 'Amit Patel',
      customerPhone: '+91 97230 11984',
      bookedDate: '29 Oct 2026',
      bookedTime: '11:00 AM',
      duration: '4 Hours Duty',
      startDate: '29 Oct 2026, 01:00 PM',
      endDate: '29 Oct 2026, 05:00 PM',
      amount: '₹750',
      status: 'Confirmed',
      pickupLocation: 'Shivajinagar, Pune',
      icon: 'fa-user-tie',
      badgeColor: '#059669'
    },

    // 3. Safe Parking Slots Bookings
    {
      id: 'PK-3301',
      serviceType: 'parking',
      serviceName: 'Slot A-14 (Covered Basement)',
      category: 'Sedan / SUV Reserved Slot',
      customerName: 'Anand Kulkarni (Honda City)',
      customerPhone: '+91 98810 77312',
      bookedDate: '29 Oct 2026',
      bookedTime: '09:00 AM',
      duration: '24 Hours (1 Day)',
      startDate: '29 Oct 2026, 09:30 AM',
      endDate: '30 Oct 2026, 09:30 AM',
      amount: '₹350',
      status: 'Running',
      pickupLocation: 'SART Tech Park Yard, Pune',
      icon: 'fa-square-parking',
      badgeColor: '#7c3aed'
    },
    {
      id: 'PK-3302',
      serviceType: 'parking',
      serviceName: 'Slot T-02 (Heavy Commercial Yard)',
      category: 'Heavy Truck Parking Slot',
      customerName: 'Om Logistics (Tata 407)',
      customerPhone: '+91 93240 66100',
      bookedDate: '28 Oct 2026',
      bookedTime: '11:30 PM',
      duration: '7 Days (Weekly)',
      startDate: '29 Oct 2026, 12:00 AM',
      endDate: '05 Nov 2026, 11:59 PM',
      amount: '₹2,800',
      status: 'Running',
      pickupLocation: 'Chakan Logistics Hub',
      icon: 'fa-square-parking',
      badgeColor: '#7c3aed'
    },

    // 4. Carrier Logistics & Cargo Bookings
    {
      id: 'CR-7701',
      serviceType: 'carriers',
      serviceName: 'Ashok Leyland Bada Dost (1.8 Ton)',
      category: 'Intra-City Freight Transport',
      customerName: 'Mahalaxmi Hardware Mart',
      customerPhone: '+91 98234 99120',
      bookedDate: '29 Oct 2026',
      bookedTime: '06:30 AM',
      duration: 'Full Day Dedicated Dispatch',
      startDate: '29 Oct 2026, 07:00 AM',
      endDate: '29 Oct 2026, 07:00 PM',
      amount: '₹4,200',
      status: 'Running',
      pickupLocation: 'Pimpri MIDC to Hadapsar',
      icon: 'fa-truck-moving',
      badgeColor: '#ea580c'
    },
    {
      id: 'CR-7702',
      serviceType: 'carriers',
      serviceName: 'Tata Ace Gold EV (Mini Truck)',
      category: 'Express Goods Courier Route',
      customerName: 'QuickKart E-Commerce Hub',
      customerPhone: '+91 91760 33451',
      bookedDate: '29 Oct 2026',
      bookedTime: '09:45 AM',
      duration: '6 Hours Dispatch',
      startDate: '29 Oct 2026, 10:30 AM',
      endDate: '29 Oct 2026, 04:30 PM',
      amount: '₹1,850',
      status: 'Running',
      pickupLocation: 'Wakad Warehouse',
      icon: 'fa-truck-moving',
      badgeColor: '#ea580c'
    }
  ]);

  // Filtering based on active category, search and status
  const filteredBookings = allBookings.filter((item) => {
    if (activeCategory !== 'all' && item.serviceType !== activeCategory) return false;
    if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
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
      {/* 0. ADVANCED UNIFIED MULTI-MODAL DASHBOARD (Image 1 & Image 2) */}
      <HotelOverviewShowcase {...({ onNavigate: onNavigate || (() => { }) } as any)} />

      {/* 3. DASHBOARD SEARCH & STATUS FILTER TOOLBAR */}
      <div className="dashboard-toolbar-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        {/* Search & Status Row */}
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
              <option value="running">Running / On-Going</option>
              <option value="confirmed">Confirmed / Upcoming</option>
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
              {filteredBookings.map((b) => (
                <tr key={b.id} className="booking-table-row">
                  {/* Service & ID */}
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

                  {/* Customer */}
                  <td>
                    <div className="cell-customer-info">
                      <strong className="customer-name">{b.customerName}</strong>
                      <span className="customer-phone">
                        <i className="fa-solid fa-phone"></i> {b.customerPhone}
                      </span>
                    </div>
                  </td>

                  {/* Booking Date & Time */}
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

                  {/* Duration */}
                  <td>
                    <span className="duration-pill">
                      <i className="fa-solid fa-stopwatch"></i> {b.duration}
                    </span>
                  </td>

                  {/* Start & End Schedule */}
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

                  {/* Location */}
                  <td>
                    <div className="cell-location">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>{b.pickupLocation}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td>
                    <strong className="booking-price">{b.amount}</strong>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`status-badge-pill ${b.status.toLowerCase()}`}>
                      {b.status === 'Running' ? (
                        <>
                          <span className="status-blink-dot"></span> In Progress (Running)
                        </>
                      ) : (
                        <>
                          <i className="fa-regular fa-clock"></i> Scheduled
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="no-bookings-placeholder">
              <i className="fa-solid fa-calendar-xmark placeholder-icon"></i>
              <h4>No bookings found for the selected filter</h4>
              <p>Try switching categories or clearing search keywords.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
