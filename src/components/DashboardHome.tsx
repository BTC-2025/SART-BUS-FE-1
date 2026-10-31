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
      {/* 0. HOTEL OVERVIEW & GUEST MANAGEMENT SHOWCASE (Image 2) */}
      <HotelOverviewShowcase {...({ onNavigate: onNavigate || (() => { }) } as any)} />



      {/* 2. ANALYTICS & CHARTS SECTION (Exact User Uploaded Screenshot) */}
      <div className="rental-charts-grid">
        {/* Chart 1: Booking & Sales Trends */}
        <div className="chart-card trends-chart">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Booking & Sales Trends</h3>
              <span className="chart-subtitle">Line & Bar graph</span>
            </div>
            <div className="chart-header-right">
              <div className="chart-legends">
                <span className="legend-item"><span className="legend-dot blue"></span> Revenue (₹)</span>
                <span className="legend-item"><span className="legend-dot yellow"></span> Bookings Count</span>
              </div>
              <select className="chart-period-select" defaultValue="This Month">
                <option value="This Month">This Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Year 2026">Year 2026</option>
              </select>
            </div>
          </div>
          {/* Custom SVG Line & Bar Chart */}
          <div className="chart-svg-container">
            <svg viewBox="0 0 500 160" className="chart-svg">
              <line x1="40" y1="130" x2="480" y2="130" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="95" x2="480" y2="95" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="25" x2="480" y2="25" stroke="#f1f5f9" strokeWidth="1" />

              <text x="5" y="133" fontSize="9" fill="#94a3b8">₹50,000</text>
              <text x="5" y="98" fontSize="9" fill="#94a3b8">₹100,000</text>
              <text x="5" y="63" fontSize="9" fill="#94a3b8">₹150,000</text>
              <text x="5" y="28" fontSize="9" fill="#94a3b8">₹200,000</text>
              <text x="35" y="152" fontSize="9" fill="#94a3b8">₹</text>

              <rect x="75" y="115" width="12" height="15" fill="#fde68a" rx="2" />
              <rect x="115" y="105" width="12" height="25" fill="#fde68a" rx="2" />
              <rect x="155" y="95" width="12" height="35" fill="#fde68a" rx="2" />
              <rect x="195" y="100" width="12" height="30" fill="#fde68a" rx="2" />
              <rect x="235" y="90" width="12" height="40" fill="#fde68a" rx="2" />
              <rect x="275" y="85" width="12" height="45" fill="#fde68a" rx="2" />
              <rect x="315" y="70" width="12" height="60" fill="#fde68a" rx="2" />
              <rect x="355" y="55" width="12" height="75" fill="#fde68a" rx="2" />
              <rect x="395" y="65" width="12" height="65" fill="#fde68a" rx="2" />
              <rect x="435" y="50" width="12" height="80" fill="#fde68a" rx="2" />

              <polyline
                fill="none"
                stroke="#1e40af"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="80,120 120,105 160,88 200,102 240,94 280,92 320,68 360,52 400,62 440,40"
              />

              <polyline
                fill="none"
                stroke="#d97706"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="80,128 120,118 160,110 200,114 240,105 280,102 320,78 360,65 400,74 440,54"
              />

              <text x="75" y="152" fontSize="9" fill="#94a3b8">Jan</text>
              <text x="115" y="152" fontSize="9" fill="#94a3b8">Feb</text>
              <text x="155" y="152" fontSize="9" fill="#94a3b8">Mar</text>
              <text x="195" y="152" fontSize="9" fill="#94a3b8">Apr</text>
              <text x="235" y="152" fontSize="9" fill="#94a3b8">May</text>
              <text x="275" y="152" fontSize="9" fill="#94a3b8">Jun</text>
              <text x="315" y="152" fontSize="9" fill="#94a3b8">Jul</text>
              <text x="355" y="152" fontSize="9" fill="#94a3b8">Aug</text>
              <text x="395" y="152" fontSize="9" fill="#94a3b8">Sep</text>
              <text x="435" y="152" fontSize="9" fill="#94a3b8">Oct</text>

              <text x="465" y="55" fontSize="9" fill="#94a3b8">400</text>
              <text x="465" y="85" fontSize="9" fill="#94a3b8">30</text>
              <text x="465" y="105" fontSize="9" fill="#94a3b8">20</text>
              <text x="465" y="125" fontSize="9" fill="#94a3b8">10</text>
              <text x="465" y="145" fontSize="9" fill="#94a3b8">0</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Revenue by Vehicle Type (Donut) */}
        <div className="chart-card donut-chart-card">
          <h3 className="chart-title">Revenue by Vehicle Type</h3>
          <div className="donut-wrapper">
            <svg viewBox="0 0 100 100" className="donut-svg">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="16" />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#2563eb"
                strokeWidth="16"
                strokeDasharray="162.3 238.7"
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="16"
                strokeDasharray="76.4 238.7"
                strokeDashoffset="-162.3"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <div className="donut-legends">
            <span className="legend-item"><span className="legend-dot blue"></span> Cars (68%)</span>
            <span className="legend-item"><span className="legend-dot yellow"></span> Bikes (32%)</span>
          </div>
        </div>

        {/* Chart 3: Popular Models Rank */}
        <div className="chart-card rank-chart-card">
          <h3 className="chart-title">Popular Models</h3>
          <span className="chart-subtitle">Quick bar rank</span>

          <div className="rank-bars-list">
            <div className="rank-row">
              <span className="rank-label">Tata Nexon</span>
              <div className="rank-bar-bg">
                <div className="rank-bar-fill blue" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="rank-row">
              <span className="rank-label">RE Classic 350</span>
              <div className="rank-bar-bg">
                <div className="rank-bar-fill yellow" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div className="rank-row">
              <span className="rank-label">Maruti Swift</span>
              <div className="rank-bar-bg">
                <div className="rank-bar-fill blue" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="rank-scale-nums">
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
            </div>
          </div>
        </div>
      </div>

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
