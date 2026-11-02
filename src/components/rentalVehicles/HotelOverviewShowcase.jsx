import React, { useState, useEffect } from 'react';
import './HotelOverviewShowcase.css';

export default function HotelOverviewShowcase({ onNavigate = () => { } }) {
  // Active vertical tab: 'all' | 'rentals' | 'carriers' | 'drivers' | 'parking'
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [revenueFilter, setRevenueFilter] = useState('All'); // 'All' | 'Income' | 'Expenses' | 'Profit'
  const [ordersTimeframe, setOrdersTimeframe] = useState('Monthly');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(2);
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Dynamic vertical-specific data
  const VERTICAL_DATA = {
    all: {
      title: 'Unified Multi-Modal Business',
      tagline: 'Rentals, Carriers, Drivers & Smart Parking Operations',
      kpis: [
        { label: 'Total Operations', value: '6,784', growth: '10% ▲ +₹15,400 today', icon: 'fa-cubes', color: 'purple' },
        { label: 'In Progress', value: '1,920', growth: 'Active Dispatches & Trips', icon: 'fa-truck-fast', color: 'orange' },
        { label: 'Completed', value: '4,412', growth: 'Successfully Fulfilled', icon: 'fa-circle-check', color: 'teal' },
        { label: 'Pending / Action', value: '329', growth: 'Awaiting Confirmation', icon: 'fa-clock-rotate-left', color: 'red' }
      ],
      revenue: {
        income: '₹26,450,000',
        incomeGrowth: '12% ▲',
        expenses: '₹18,200,000',
        expensesChange: '8% ▼',
        profit: '₹8,250,000',
        profitGrowth: '14% ▲'
      },
      distribution: {
        rentals: 38,
        carriers: 35,
        drivers: 17,
        parking: 10
      },
      ordersAnalytics: {
        onlineVal: '₹59,492.10',
        dateLabel: '15 Nov 2026',
        offlineTotal: '₹18,320.00',
        earningsCenter: '₹4,520'
      },
      recentDispatches: [
        { id: 'DP-901', title: 'Toyota Alphard Luxury Fleet', client: 'Cognizant Logistics Hub', category: 'Rentals', progress: 85, dueDate: '02 Nov 2026', status: 'In Progress', statusColor: 'orange' },
        { id: 'DP-902', title: '14-Wheeler Heavy Freight Express', client: 'Tata Steel Container Depo', category: 'Carriers', progress: 100, dueDate: '02 Nov 2026', status: 'Completed', statusColor: 'teal' },
        { id: 'DP-903', title: 'Executive Chauffeur Full-Day', client: 'Apollo Health Delegates', category: 'Drivers', progress: 45, dueDate: '03 Nov 2026', status: 'In Progress', statusColor: 'orange' },
        { id: 'DP-904', title: 'EV Fast-Charge Slot Booking #4', client: 'Private S-Class Fleet', category: 'Parkings', progress: 100, dueDate: '02 Nov 2026', status: 'Completed', statusColor: 'teal' },
        { id: 'DP-905', title: 'Container Freight Rail Rake WAP-7', client: 'Chennai Harbor Terminal', category: 'Carriers', progress: 20, dueDate: '04 Nov 2026', status: 'Pending', statusColor: 'red' }
      ]
    },
    rentals: {
      title: 'Self-Drive & Fleet Rental Operations',
      tagline: 'Cars, SUVs, Luxury Sedans & Touring Motorbikes',
      kpis: [
        { label: 'Total Fleet Hires', value: '2,540', growth: '14% ▲ +₹45,000 today', icon: 'fa-car-side', color: 'purple' },
        { label: 'Vehicles On Rent', value: '840', growth: 'Live on road across cities', icon: 'fa-key', color: 'orange' },
        { label: 'Returned & Cleaned', value: '1,580', growth: 'Ready for instant dispatch', icon: 'fa-circle-check', color: 'teal' },
        { label: 'Maintenance Due', value: '120', growth: 'Service & Inspection', icon: 'fa-wrench', color: 'red' }
      ],
      revenue: {
        income: '₹12,800,000',
        incomeGrowth: '15% ▲',
        expenses: '₹6,400,000',
        expensesChange: '4% ▼',
        profit: '₹6,400,000',
        profitGrowth: '18% ▲'
      },
      distribution: {
        rentals: 65,
        carriers: 15,
        drivers: 12,
        parking: 8
      },
      ordersAnalytics: {
        onlineVal: '₹42,850.00',
        dateLabel: '15 Nov 2026',
        offlineTotal: '₹12,400.00',
        earningsCenter: '₹3,200'
      },
      recentDispatches: [
        { id: 'RN-101', title: 'Porsche 911 Carrera (Weekend Pack)', client: 'Rajesh K. Viman Nagar', category: 'Rentals', progress: 90, dueDate: '02 Nov 2026', status: 'In Progress', statusColor: 'orange' },
        { id: 'RN-102', title: 'Mahindra Thar 4x4 Expedition', client: 'Sahyadri Tours Club', category: 'Rentals', progress: 100, dueDate: '01 Nov 2026', status: 'Completed', statusColor: 'teal' },
        { id: 'RN-103', title: 'Rolls-Royce Dawn Wedding Convoy', client: 'JW Marriott Luxury Suites', category: 'Rentals', progress: 50, dueDate: '03 Nov 2026', status: 'In Progress', statusColor: 'orange' },
        { id: 'RN-104', title: 'Royal Enfield Classic 350 Touring', client: 'Anand Verma', category: 'Rentals', progress: 100, dueDate: '02 Nov 2026', status: 'Completed', statusColor: 'teal' }
      ]
    },
    carriers: {
      title: 'Cargo, Freight & Logistics Operations',
      tagline: 'Multi-Axle Heavy Haulers, Container Rakes & Cold Chain',
      kpis: [
        { label: 'Freight Shipments', value: '3,180', growth: '18% ▲ +₹92,000 today', icon: 'fa-truck-moving', color: 'purple' },
        { label: 'Active In-Transit', value: '890', growth: 'Tracked with live GPS Telematics', icon: 'fa-satellite-dish', color: 'orange' },
        { label: 'Delivered On-Time', value: '2,140', growth: '100% SLA Compliant', icon: 'fa-circle-check', color: 'teal' },
        { label: 'Customs / Dock Halt', value: '150', growth: 'Toll & Waybill clearance', icon: 'fa-triangle-exclamation', color: 'red' }
      ],
      revenue: {
        income: '₹38,500,000',
        incomeGrowth: '22% ▲',
        expenses: '₹24,100,000',
        expensesChange: '6% ▲',
        profit: '₹14,400,000',
        profitGrowth: '28% ▲'
      },
      distribution: {
        rentals: 15,
        carriers: 70,
        drivers: 10,
        parking: 5
      },
      ordersAnalytics: {
        onlineVal: '₹84,200.00',
        dateLabel: '15 Nov 2026',
        offlineTotal: '₹36,100.00',
        earningsCenter: '₹7,800'
      },
      recentDispatches: [
        { id: 'CR-301', title: 'Ashok Leyland 14-Wheeler All India Permit', client: 'Tata Steel Tubes Division', category: 'Carriers', progress: 95, dueDate: '02 Nov 2026', status: 'In Progress', statusColor: 'orange' },
        { id: 'CR-302', title: 'Pharma Cold-Chain Temperature Controlled Van', client: 'Apollo Life Sciences Chennai', category: 'Carriers', progress: 100, dueDate: '02 Nov 2026', status: 'Completed', statusColor: 'teal' },
        { id: 'CR-303', title: 'Rail Container Freight Rake WAP-7', client: 'Container Corp of India', category: 'Carriers', progress: 30, dueDate: '04 Nov 2026', status: 'Pending', statusColor: 'red' },
        { id: 'CR-304', title: 'City Express Delivery Bike Fleet (5 Units)', client: 'QuickGrocery Hub Anna Nagar', category: 'Carriers', progress: 100, dueDate: '02 Nov 2026', status: 'Completed', statusColor: 'teal' }
      ]
    },
    drivers: {
      title: 'Verified Professional Drivers & Chauffeurs',
      tagline: 'Hourly City Drivers, Outstation Captains & Valet Teams',
      kpis: [
        { label: 'Total Driver Duties', value: '1,890', growth: '8% ▲ +₹18,000 today', icon: 'fa-user-tie', color: 'purple' },
        { label: 'Captains On Duty', value: '450', growth: 'Navigating active customer cars', icon: 'fa-id-badge', color: 'orange' },
        { label: 'Completed Shifts', value: '1,320', growth: '5-Star average customer rating', icon: 'fa-star', color: 'teal' },
        { label: 'Cancelled / Rerouted', value: '120', growth: 'Auto reassigned to nearby pilot', icon: 'fa-user-xmark', color: 'red' }
      ],
      revenue: {
        income: '₹5,400,000',
        incomeGrowth: '10% ▲',
        expenses: '₹2,100,000',
        expensesChange: '3% ▼',
        profit: '₹3,300,000',
        profitGrowth: '16% ▲'
      },
      distribution: {
        rentals: 20,
        carriers: 15,
        drivers: 55,
        parking: 10
      },
      ordersAnalytics: {
        onlineVal: '₹28,600.00',
        dateLabel: '15 Nov 2026',
        offlineTotal: '₹8,200.00',
        earningsCenter: '₹1,950'
      },
      recentDispatches: [
        { id: 'DR-501', title: 'Outstation Chauffeur (Chennai ➔ Bangalore)', client: 'Dr. S. K. Narayanan', category: 'Drivers', progress: 70, dueDate: '02 Nov 2026', status: 'In Progress', statusColor: 'orange' },
        { id: 'DR-502', title: 'Corporate Shuttle Pilot Morning Route', client: 'Infosys Mahindra World City', category: 'Drivers', progress: 100, dueDate: '02 Nov 2026', status: 'Completed', statusColor: 'teal' },
        { id: 'DR-503', title: 'Night Shift Valet & Personal Driver', client: 'Taj Coromandel Guests', category: 'Drivers', progress: 100, dueDate: '01 Nov 2026', status: 'Completed', statusColor: 'teal' }
      ]
    },
    parking: {
      title: 'Smart Parking, Valet & EV Fast-Charging',
      tagline: 'Automated Boom Gates, Covered Bays & 24/7 Security',
      kpis: [
        { label: 'Total Slot Bookings', value: '4,120', growth: '24% ▲ +₹32,000 today', icon: 'fa-square-parking', color: 'purple' },
        { label: 'Currently Occupied', value: '1,450', growth: '82% total bay occupancy', icon: 'fa-car-tunnel', color: 'orange' },
        { label: 'Available Vacant Slots', value: '2,490', growth: 'Real-time sensor verified', icon: 'fa-circle-check', color: 'teal' },
        { label: 'Reserved VIP & EV', value: '180', growth: 'Dedicated Charging Bays', icon: 'fa-charging-station', color: 'red' }
      ],
      revenue: {
        income: '₹4,200,000',
        incomeGrowth: '20% ▲',
        expenses: '₹1,100,000',
        expensesChange: '2% ▼',
        profit: '₹3,100,000',
        profitGrowth: '25% ▲'
      },
      distribution: {
        rentals: 10,
        carriers: 10,
        drivers: 15,
        parking: 65
      },
      ordersAnalytics: {
        onlineVal: '₹22,400.00',
        dateLabel: '15 Nov 2026',
        offlineTotal: '₹6,400.00',
        earningsCenter: '₹1,450'
      },
      recentDispatches: [
        { id: 'PK-701', title: 'Fast EV DC Charger Bay #03', client: 'Tesla Model Y Owner', category: 'Parkings', progress: 100, dueDate: '02 Nov 2026', status: 'Completed', statusColor: 'teal' },
        { id: 'PK-702', title: 'Covered Airport Long-Stay Parking (7 Days)', client: 'Capt. Arun Sharma', category: 'Parkings', progress: 80, dueDate: '06 Nov 2026', status: 'In Progress', statusColor: 'orange' },
        { id: 'PK-703', title: 'Basement Secured Multi-Level Slot B2-14', client: 'Express Avenue Visitors', category: 'Parkings', progress: 100, dueDate: '02 Nov 2026', status: 'Completed', statusColor: 'teal' }
      ]
    }
  };

  const currentData = VERTICAL_DATA[selectedVertical] || VERTICAL_DATA.all;

  // Bar chart monthly values for 12 months (Jan - Dec)
  const monthlyBars = [
    { month: 'Jan', purple: 750, orange: 580, cyan: 220 },
    { month: 'Feb', purple: 700, orange: 620, cyan: 150 },
    { month: 'Mar', purple: 440, orange: 710, cyan: 210 },
    { month: 'Apr', purple: 880, orange: 690, cyan: 310 },
    { month: 'May', purple: 1250, orange: 840, cyan: 320 },
    { month: 'Jun', purple: 620, orange: 720, cyan: 120 },
    { month: 'Jul', purple: 940, orange: 640, cyan: 250 },
    { month: 'Aug', purple: 730, orange: 500, cyan: 280 },
    { month: 'Sep', purple: 890, orange: 630, cyan: 330 },
    { month: 'Oct', purple: 1120, orange: 710, cyan: 380 },
    { month: 'Nov', purple: 630, orange: 510, cyan: 220 },
    { month: 'Dec', purple: 740, orange: 570, cyan: 240 }
  ];

  return (
    <div className="sart-advanced-dashboard-root">
      
      {/* 🌟 VERTICAL SWITCHER TAB BAR (Rentals, Carriers, Drivers, Parkings) */}
      <div className="dashboard-verticals-nav-bar">
        <div className="verticals-nav-left">
          <span className="verticals-label">BUSINESS DOMAIN:</span>
          <div className="verticals-pill-group">
            {[
              { id: 'all', label: 'All Operations', icon: 'fa-layer-group' },
              { id: 'rentals', label: 'Rentals', icon: 'fa-car-side' },
              { id: 'carriers', label: 'Carriers & Cargo', icon: 'fa-truck-moving' },
              { id: 'drivers', label: 'Hire Drivers', icon: 'fa-user-tie' },
              { id: 'parking', label: 'Smart Parking', icon: 'fa-square-parking' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`vertical-pill-btn ${selectedVertical === tab.id ? 'active' : ''}`}
                onClick={() => setSelectedVertical(tab.id)}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="verticals-nav-right">
          <span className="live-status-pill">
            <span className="live-dot pulse"></span> Live System Telematics
          </span>
        </div>
      </div>

      {/* 🌟 1. TOP 4 METRIC KPI CARDS (Matching Image 1 exact layout & colors) */}
      <div className="dash-kpi-grid">
        {currentData.kpis.map((kpi, idx) => (
          <div key={idx} className={`dash-kpi-card card-${kpi.color}`}>
            <div className="kpi-card-header">
              <span className="kpi-card-title">{kpi.label}</span>
              <div className={`kpi-card-icon-bubble ${kpi.color}`}>
                <i className={`fa-solid ${kpi.icon}`}></i>
              </div>
            </div>
            <div className="kpi-card-body">
              <div className="kpi-card-val">{kpi.value}</div>
              <div className="kpi-card-footer">
                <span className="kpi-footer-badge">{kpi.growth}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🌟 2. MIDDLE ROW: REVENUE BAR CHART (Left 68%) + ALL OPERATIONS STATUS DONUT (Right 32%) */}
      <div className="dash-analytics-row">
        {/* Left Card: Revenue & Tri-Color Bar Chart (Image 1) */}
        <div className="dash-card revenue-chart-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Revenue</h3>
              <p className="dash-card-sub">Your Financial Revenue Performance (Year 2026)</p>
            </div>
            <div className="chart-filter-pills">
              {['All', 'Income', 'Expenses', 'Profit'].map(f => (
                <button
                  key={f}
                  type="button"
                  className={`chart-pill-btn ${revenueFilter === f ? 'active' : ''}`}
                  onClick={() => setRevenueFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Revenue 3 Key Figures */}
          <div className="revenue-stats-strip">
            <div className="revenue-stat-item">
              <div className="stat-icon-wrap purple"><i className="fa-solid fa-wallet"></i></div>
              <div className="stat-meta">
                <span className="stat-label">Income</span>
                <div className="stat-value-row">
                  <span className="stat-amount">{currentData.revenue.income}</span>
                  <span className="stat-growth-tag green">{currentData.revenue.incomeGrowth}</span>
                </div>
              </div>
            </div>

            <div className="revenue-stat-item">
              <div className="stat-icon-wrap orange"><i className="fa-solid fa-receipt"></i></div>
              <div className="stat-meta">
                <span className="stat-label">Expenses</span>
                <div className="stat-value-row">
                  <span className="stat-amount">{currentData.revenue.expenses}</span>
                  <span className="stat-growth-tag red">{currentData.revenue.expensesChange}</span>
                </div>
              </div>
            </div>

            <div className="revenue-stat-item">
              <div className="stat-icon-wrap cyan"><i className="fa-solid fa-money-bill-trend-up"></i></div>
              <div className="stat-meta">
                <span className="stat-label">Net Profit</span>
                <div className="stat-value-row">
                  <span className="stat-amount">{currentData.revenue.profit}</span>
                  <span className="stat-growth-tag green">{currentData.revenue.profitGrowth}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Bar Chart with Animated Hover Columns */}
          <div className="revenue-bars-canvas-wrap">
            <div className="canvas-y-axis">
              <span>₹1.4M</span>
              <span>₹1.2M</span>
              <span>₹1.0M</span>
              <span>₹800k</span>
              <span>₹600k</span>
              <span>₹400k</span>
              <span>₹200k</span>
              <span>0</span>
            </div>

            <div className="canvas-bars-container">
              {monthlyBars.map((col, idx) => (
                <div
                  key={col.month}
                  className={`bar-group-col ${hoveredMonth === idx ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredMonth(idx)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  {/* Tooltip on hover */}
                  {hoveredMonth === idx && (
                    <div className="bar-hover-tooltip">
                      <div className="tip-row purple">● Income: ₹{col.purple * 1000}</div>
                      <div className="tip-row orange">● Exp: ₹{col.orange * 1000}</div>
                      <div className="tip-row cyan">● Profit: ₹{col.cyan * 1000}</div>
                    </div>
                  )}

                  <div className="bar-bars-pair">
                    {(revenueFilter === 'All' || revenueFilter === 'Income') && (
                      <div
                        className="v-bar bar-purple"
                        style={{ height: `${(col.purple / 1400) * 100}%` }}
                      ></div>
                    )}
                    {(revenueFilter === 'All' || revenueFilter === 'Expenses') && (
                      <div
                        className="v-bar bar-orange"
                        style={{ height: `${(col.orange / 1400) * 100}%` }}
                      ></div>
                    )}
                    {(revenueFilter === 'All' || revenueFilter === 'Profit') && (
                      <div
                        className="v-bar bar-cyan"
                        style={{ height: `${(col.cyan / 1400) * 100}%` }}
                      ></div>
                    )}
                  </div>
                  <span className="col-month-label">{col.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Intersecting Status Circles & Distribution Donut (Image 1 & 2) */}
        <div className="dash-card status-distribution-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">All Operations</h3>
              <p className="dash-card-sub">Fleet & Bookings by Domain Status</p>
            </div>
            <button type="button" className="card-kebab-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button>
          </div>

          {/* Intersecting Venn Bubble Graphic (Matching Image 1) */}
          <div className="intersecting-bubble-wrapper">
            <svg viewBox="0 0 280 180" className="bubble-venn-svg">
              <defs>
                <linearGradient id="bubbleOrange" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff5722" />
                  <stop offset="100%" stopColor="#f4511e" />
                </linearGradient>
                <linearGradient id="bubbleTeal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#26a69a" />
                  <stop offset="100%" stopColor="#00897b" />
                </linearGradient>
                <linearGradient id="bubbleRed" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e53935" />
                  <stop offset="100%" stopColor="#d32f2f" />
                </linearGradient>
              </defs>

              {/* Orange Main Bubble: In Progress */}
              <circle cx="105" cy="85" r="58" fill="url(#bubbleOrange)" className="animated-bubble-circle" />
              <text x="105" y="88" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
                {currentData.distribution.carriers + currentData.distribution.rentals}%
              </text>

              {/* Teal Secondary Bubble: Finished / Completed */}
              <circle cx="185" cy="65" r="42" fill="url(#bubbleTeal)" className="animated-bubble-circle" style={{ animationDelay: '0.4s' }} />
              <text x="185" y="68" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                {currentData.distribution.drivers + 12}%
              </text>

              {/* Red Tertiary Bubble: Unfinished / Action */}
              <circle cx="180" cy="130" r="24" fill="url(#bubbleRed)" className="animated-bubble-circle" style={{ animationDelay: '0.8s' }} />
              <text x="180" y="133" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">
                {currentData.distribution.parking}%
              </text>
            </svg>
          </div>

          {/* Legend Items */}
          <div className="status-legend-list">
            <div className="legend-row">
              <div className="legend-name-col">
                <span className="dot orange"></span>
                <span>Active / In Progress</span>
              </div>
              <span className="legend-count-val">1,400</span>
            </div>

            <div className="legend-row">
              <div className="legend-name-col">
                <span className="dot teal"></span>
                <span>Finished & Fulfilled</span>
              </div>
              <span className="legend-count-val">600</span>
            </div>

            <div className="legend-row">
              <div className="legend-name-col">
                <span className="dot red"></span>
                <span>Pending Clearance</span>
              </div>
              <span className="legend-count-val">200</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 3. ORDERS ANALYTICS SPLIT SECTION (Matching Image 2 exact dual graph & donut) */}
      <div className="dash-analytics-row dual-analytics-strip">
        {/* Orders Analytics Smooth Line Curve (Image 2 Left) */}
        <div className="dash-card orders-analytics-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Orders Analytics</h3>
              <p className="dash-card-sub">Daily Booking Velocity & Dispatch Channels</p>
            </div>
            <div className="orders-header-controls">
              <div className="orders-legend-dots">
                <span><span className="dot navy"></span> Offline Dispatches</span>
                <span><span className="dot amber"></span> Online Bookings</span>
              </div>
              <select
                value={ordersTimeframe}
                onChange={(e) => setOrdersTimeframe(e.target.value)}
                className="orders-period-select"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* SVG Smooth Curve Wave Chart with Animated Tooltip Pointer */}
          <div className="orders-wave-chart-container">
            <svg viewBox="0 0 680 180" className="orders-wave-svg">
              {/* Grid Lines */}
              <line x1="40" y1="30" x2="660" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="660" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="110" x2="660" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="150" x2="660" y2="150" stroke="#f1f5f9" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="15" y="34" fontSize="10" fill="#94a3b8">100</text>
              <text x="15" y="74" fontSize="10" fill="#94a3b8">80</text>
              <text x="15" y="114" fontSize="10" fill="#94a3b8">50</text>
              <text x="15" y="154" fontSize="10" fill="#94a3b8">20</text>

              {/* Highlight Vertical Gradient Column (Image 2) */}
              <rect x="220" y="30" width="28" height="120" rx="8" fill="#e2e8f0" opacity="0.65" />
              
              {/* Navy Wave Path: Offline */}
              <path
                d="M 40 150 C 80 130, 110 145, 150 115 C 190 85, 210 120, 234 88 C 260 60, 290 125, 330 110 C 370 95, 410 135, 450 125 C 490 115, 530 85, 570 95 C 610 105, 640 75, 660 70"
                fill="none"
                stroke="#1e293b"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animated-wave-line"
              />

              {/* Amber Wave Path: Online */}
              <path
                d="M 40 115 C 80 125, 110 95, 150 90 C 190 85, 210 70, 234 68 C 260 65, 290 80, 330 75 C 370 70, 410 88, 450 82 C 490 75, 530 92, 570 78 C 610 65, 640 85, 660 75"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animated-wave-line"
                style={{ animationDelay: '0.25s' }}
              />

              {/* Active Pulsing Dot on Current Selection */}
              <circle cx="234" cy="88" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Hover Floating Stat Bubble matching Image 2 */}
            <div className="wave-active-badge">
              <span className="badge-date">{currentData.ordersAnalytics.dateLabel}</span>
              <span className="badge-val">{currentData.ordersAnalytics.onlineVal}</span>
            </div>

            {/* X-Axis Months */}
            <div className="wave-x-labels">
              <span>Jan</span>
              <span>Feb</span>
              <span className="active-x-month">Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
        </div>

        {/* Earnings Multi-Segment Ring Card (Image 2 Right) */}
        <div className="dash-card earnings-segment-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Earnings</h3>
              <p className="dash-card-sub">Revenue Split By Booking Source</p>
            </div>
            <button type="button" className="card-kebab-btn"><i className="fa-solid fa-ellipsis"></i></button>
          </div>

          <div className="earnings-ring-visual-wrap">
            <svg viewBox="0 0 160 160" className="earnings-svg-ring">
              {/* Outer Ring Segments */}
              {/* Navy Segment */}
              <circle
                cx="80" cy="80" r="54"
                fill="none"
                stroke="#1e293b"
                strokeWidth="18"
                strokeDasharray="160 340"
                strokeDashoffset="0"
                transform="rotate(-90 80 80)"
              />
              {/* Pink Segment */}
              <circle
                cx="80" cy="80" r="54"
                fill="none"
                stroke="#f472b6"
                strokeWidth="18"
                strokeDasharray="60 340"
                strokeDashoffset="-165"
                transform="rotate(-90 80 80)"
              />
              {/* Purple Segment */}
              <circle
                cx="80" cy="80" r="54"
                fill="none"
                stroke="#818cf8"
                strokeWidth="18"
                strokeDasharray="40 340"
                strokeDashoffset="-230"
                transform="rotate(-90 80 80)"
              />
              {/* Orange Segment */}
              <circle
                cx="80" cy="80" r="54"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="18"
                strokeDasharray="50 340"
                strokeDashoffset="-275"
                transform="rotate(-90 80 80)"
              />
              {/* Light Blue Segment */}
              <circle
                cx="80" cy="80" r="54"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="18"
                strokeDasharray="25 340"
                strokeDashoffset="-330"
                transform="rotate(-90 80 80)"
              />
            </svg>

            {/* Center Callout Value */}
            <div className="ring-center-stat">
              <span className="ring-stat-amount">{currentData.ordersAnalytics.earningsCenter}</span>
              <span className="ring-stat-sub">Per Hour Avg</span>
            </div>
          </div>

          {/* Ring Legend Footer */}
          <div className="ring-legend-footer">
            <span className="ring-leg-item"><span className="dot navy"></span> Offline</span>
            <span className="ring-leg-item"><span className="dot amber"></span> Online</span>
            <span className="ring-leg-item"><span className="dot pink"></span> Trade / B2B</span>
          </div>
        </div>
      </div>

      {/* 🌟 4. BOTTOM SECTION: RECENT DISPATCHES TABLE (Left 68%) + INTERACTIVE CALENDAR (Right 32%) (Image 1) */}
      <div className="dash-analytics-row bottom-table-calendar-row">
        {/* Left: Recent Operations Table */}
        <div className="dash-card recent-projects-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Recent Dispatches & Bookings</h3>
              <p className="dash-card-sub">Real-time status tracking across fleets and consignments</p>
            </div>
            <div className="table-header-actions">
              <button type="button" className="action-pill-btn"><i className="fa-regular fa-calendar"></i> Select Due Date</button>
              <button type="button" className="action-pill-btn"><i className="fa-solid fa-sliders"></i> Filters</button>
              <button type="button" className="action-pill-btn primary">See All</button>
            </div>
          </div>

          <div className="recent-table-responsive-wrapper">
            <table className="recent-dispatches-table">
              <thead>
                <tr>
                  <th>Operation / Vehicle</th>
                  <th>Progress</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentData.recentDispatches.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="proj-cell">
                        <div className={`proj-avatar-badge ${row.category.toLowerCase()}`}>
                          {row.category.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="proj-name">{row.title}</div>
                          <div className="proj-client">{row.client}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ width: '28%' }}>
                      <div className="prog-cell">
                        <div className="prog-bar-track">
                          <div
                            className={`prog-bar-fill ${row.statusColor}`}
                            style={{ width: `${row.progress}%` }}
                          ></div>
                        </div>
                        <span className="prog-text">{row.progress}%</span>
                      </div>
                    </td>

                    <td className="date-cell">{row.dueDate}</td>

                    <td>
                      <span className={`status-badge-chip ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Interactive Operations Dispatch Calendar (Matching Image 1 exact calendar) */}
        <div className="dash-card calendar-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Calendar</h3>
              <p className="dash-card-sub">Fleet Schedule & Dispatch Slots</p>
            </div>
            <button type="button" className="card-kebab-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button>
          </div>

          {/* Month & Year Navigation */}
          <div className="cal-nav-bar">
            <button type="button" className="cal-arrow-btn"><i className="fa-solid fa-chevron-left"></i></button>
            <div className="cal-month-year-dropdowns">
              <select defaultValue="Nov">
                <option value="Nov">November</option>
                <option value="Dec">December</option>
              </select>
              <select defaultValue="2026">
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
            <button type="button" className="cal-arrow-btn"><i className="fa-solid fa-chevron-right"></i></button>
          </div>

          {/* Calendar Days Matrix */}
          <div className="cal-matrix-grid">
            <div className="cal-weekday">Su</div>
            <div className="cal-weekday">Mo</div>
            <div className="cal-weekday">Tu</div>
            <div className="cal-weekday">We</div>
            <div className="cal-weekday">Th</div>
            <div className="cal-weekday">Fr</div>
            <div className="cal-weekday">Sa</div>

            {/* Days with dynamic active selection */}
            {[
              { d: 1 }, { d: 2, event: true }, { d: 3 }, { d: 4 }, { d: 5 }, { d: 6 }, { d: 7 },
              { d: 8 }, { d: 9 }, { d: 10 }, { d: 11, event: true }, { d: 12 }, { d: 13 }, { d: 14 },
              { d: 15 }, { d: 16 }, { d: 17 }, { d: 18 }, { d: 19 }, { d: 20 }, { d: 21 },
              { d: 22 }, { d: 23 }, { d: 24 }, { d: 25 }, { d: 26 }, { d: 27 }, { d: 28 },
              { d: 29 }, { d: 30 }
            ].map((day) => (
              <div
                key={day.d}
                className={`cal-day-cell ${selectedCalendarDate === day.d ? 'selected-day' : ''} ${day.event ? 'has-event' : ''}`}
                onClick={() => setSelectedCalendarDate(day.d)}
              >
                <span>{day.d}</span>
                {day.event && <span className="cal-event-dot"></span>}
              </div>
            ))}
          </div>

          {/* Schedule for Selected Date banner */}
          <div className="cal-day-schedule-preview">
            <div className="sched-header">
              <span className="sched-date-label">Schedule for Nov {selectedCalendarDate}, 2026</span>
              <button type="button" className="btn-add-schedule"><i className="fa-solid fa-plus"></i> Add</button>
            </div>
            <div className="sched-item">
              <div className="sched-time-badge">09:30 AM</div>
              <div className="sched-details">
                <span className="sched-title">Dispatch Carrier WAP-7 Cargo Rake</span>
                <span className="sched-sub">Chennai Harbor Pier 4 • Verified Pilot</span>
              </div>
            </div>
            <div className="sched-item">
              <div className="sched-time-badge purple">02:15 PM</div>
              <div className="sched-details">
                <span className="sched-title">Rolls-Royce Wedding Convoy Pick-up</span>
                <span className="sched-sub">JW Marriott Suite • Chauffeur On-Duty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
