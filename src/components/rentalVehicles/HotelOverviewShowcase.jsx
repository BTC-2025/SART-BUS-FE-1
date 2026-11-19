import React, { useState, useEffect } from 'react';
import './HotelOverviewShowcase.css';

export default function HotelOverviewShowcase({ onNavigate = () => { } }) {
  const [revenueFilter, setRevenueFilter] = useState('All'); // 'All' | 'Income' | 'Expenses' | 'Profit'
  const [ordersTimeframe, setOrdersTimeframe] = useState('Monthly');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(2);
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Live Bookings State synced with localStorage & server
  const [liveBookings, setLiveBookings] = useState([]);

  useEffect(() => {
    const loadLiveBookings = async () => {
      let bookings = [];

      // 1. Load from localStorage
      try {
        const stored = localStorage.getItem('sart_business_bookings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) bookings = parsed;
        }
      } catch (e) { }

      // 2. Fetch from backend API
      try {
        const res = await fetch('http://localhost:5000/api/rental/bookings').catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
            // Merge with local bookings avoiding duplicates
            const ids = new Set(bookings.map(b => b.id || b.bookingId));
            json.data.forEach(item => {
              const bId = item.id || item.bookingId;
              if (!ids.has(bId)) {
                bookings.push(item);
                ids.add(bId);
              }
            });
          }
        }
      } catch (e) { }

      // 3. Fallback to default demo bookings if empty
      if (bookings.length === 0) {
        try {
          const { INITIAL_DEMO_BOOKINGS } = await import('../DashboardHome');
          if (INITIAL_DEMO_BOOKINGS && INITIAL_DEMO_BOOKINGS.length > 0) {
            bookings = [...INITIAL_DEMO_BOOKINGS];
          }
        } catch (e) { }
      }

      setLiveBookings(bookings);
    };

    loadLiveBookings();

    const handleNewBooking = (e) => {
      if (e && e.detail) {
        setLiveBookings(prev => [e.detail, ...prev.filter(b => b.id !== e.detail.id)]);
      } else {
        loadLiveBookings();
      }
    };

    window.addEventListener('storage', loadLiveBookings);
    window.addEventListener('rental_vehicle_booked', handleNewBooking);
    window.addEventListener('new_booking_created', handleNewBooking);
    window.addEventListener('rental_trip_completed', loadLiveBookings);

    return () => {
      window.removeEventListener('storage', loadLiveBookings);
      window.removeEventListener('rental_vehicle_booked', handleNewBooking);
      window.removeEventListener('new_booking_created', handleNewBooking);
      window.removeEventListener('rental_trip_completed', loadLiveBookings);
    };
  }, []);

  // Compute Live Metrics from actual bookings
  const totalCount = liveBookings.length;
  const inProgressCount = liveBookings.filter(b => b.status === 'Running' || b.status === 'Confirmed' || b.status === 'Ongoing' || !b.status).length;
  const completedCount = liveBookings.filter(b => b.status === 'Completed' || b.status === 'Finished').length;
  const pendingCount = liveBookings.filter(b => b.status === 'Pending' || b.status === 'Awaiting Confirmation').length;

  // Calculate live revenue from bookings
  const totalRevenueNumber = liveBookings.reduce((sum, b) => {
    const amt = Number(b.totalAmount || b.amount?.toString().replace(/[^0-9]/g, '') || b.baseRate || 0);
    return sum + amt;
  }, 0);

  const expensesNumber = totalRevenueNumber > 0 ? Math.round(totalRevenueNumber * 0.25) : 0;
  const profitNumber = Math.max(0, totalRevenueNumber - expensesNumber);

  // Dynamic KPI items
  const kpis = [
    {
      label: 'Total Operations',
      value: totalCount.toLocaleString(),
      growth: totalCount > 0 ? `+₹${totalRevenueNumber.toLocaleString()} earned` : '0 Active Bookings',
      icon: 'fa-cubes',
      color: 'purple'
    },
    {
      label: 'In Progress',
      value: inProgressCount.toLocaleString(),
      growth: inProgressCount > 0 ? `${inProgressCount} Active Dispatches & Trips` : '0 Active Trips',
      icon: 'fa-truck-fast',
      color: 'orange'
    },
    {
      label: 'Completed',
      value: completedCount.toLocaleString(),
      growth: completedCount > 0 ? `${completedCount} Successfully Fulfilled` : '0 Fulfilled',
      icon: 'fa-circle-check',
      color: 'teal'
    },
    {
      label: 'Pending / Action',
      value: pendingCount.toLocaleString(),
      growth: pendingCount > 0 ? `${pendingCount} Awaiting Confirmation` : '0 Awaiting',
      icon: 'fa-clock-rotate-left',
      color: 'red'
    }
  ];

  // Month bucket grouping for bar chart
  const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth(); // 10 for November

  const monthlyBars = monthsArr.map((m, idx) => {
    if (totalCount === 0) {
      return { month: m, purple: 0, orange: 0, cyan: 0 };
    }

    // Compute month bookings
    const monthBookings = liveBookings.filter(b => {
      const dt = b.createdAt ? new Date(b.createdAt) : null;
      if (dt && !isNaN(dt.getTime())) {
        return dt.getMonth() === idx;
      }
      return idx === currentMonthIdx; // fallback to current month if no date
    });

    const mIncome = monthBookings.reduce((sum, b) => {
      const amt = Number(b.totalAmount || b.amount?.toString().replace(/[^0-9]/g, '') || b.baseRate || 0);
      return sum + amt;
    }, 0);

    const mExp = Math.round(mIncome * 0.25);
    const mProfit = Math.max(0, mIncome - mExp);

    return {
      month: m,
      purple: mIncome,
      orange: mExp,
      cyan: mProfit
    };
  });

  // Calculate highest bar value to scale height nicely
  const maxBarValue = Math.max(
    ...monthlyBars.map(b => Math.max(b.purple, b.orange, b.cyan)),
    totalRevenueNumber,
    1000
  );

  // Distribution percentages
  const distributionActivePct = totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0;
  const distributionDonePct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const distributionPendingPct = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0;

  // Recent Dispatches table data from real live bookings
  const recentDispatches = liveBookings.slice(0, 6).map((b, idx) => {
    const rawAmt = Number(b.totalAmount || b.baseRate || 1800);
    return {
      id: b.id || b.bookingId || `DP-${900 + idx}`,
      title: b.vehicleName || b.serviceName || 'Self-Drive Vehicle',
      client: b.customerName || 'Customer',
      category: b.serviceType || 'Rentals',
      progress: b.status === 'Completed' ? 100 : b.status === 'Pending' ? 20 : 80,
      dueDate: b.pickupDate || b.startDate || 'Today',
      status: b.status || 'In Progress',
      statusColor: b.status === 'Completed' ? 'teal' : b.status === 'Pending' ? 'red' : 'orange',
      amount: rawAmt
    };
  });

  return (
    <div className="sart-advanced-dashboard-root">
      {/* 🌟 OWNER BUSINESS DASHBOARD HEADLINE & OVERVIEW BANNER */}
      <div className="owner-dashboard-headline-card">
        <div className="headline-text-content">
          <h1 className="headline-main-title">Business Operations Dashboard</h1>
          <p className="headline-sub-title">
            Live overview of all customer bookings, dispatches, driver shifts, and revenue metrics.
          </p>
        </div>
        <div className="headline-right-stats">
          <div className="headline-quick-badge">
            <span className="live-dot pulse"></span>
            <span>Real-time Sync Active ({totalCount} Bookings)</span>
          </div>
        </div>
      </div>

      {/* 🌟 1. TOP 4 METRIC KPI CARDS */}
      <div className="dash-kpi-grid">
        {kpis.map((kpi, idx) => (
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
        {/* Left Card: Revenue & Tri-Color Bar Chart */}
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
                  <span className="stat-amount">₹{totalRevenueNumber.toLocaleString()}</span>
                  <span className="stat-growth-tag green">{totalRevenueNumber > 0 ? '▲ Active' : '0%'}</span>
                </div>
              </div>
            </div>

            <div className="revenue-stat-item">
              <div className="stat-icon-wrap orange"><i className="fa-solid fa-receipt"></i></div>
              <div className="stat-meta">
                <span className="stat-label">Expenses</span>
                <div className="stat-value-row">
                  <span className="stat-amount">₹{expensesNumber.toLocaleString()}</span>
                  <span className="stat-growth-tag red">{expensesNumber > 0 ? '▼ 25%' : '0%'}</span>
                </div>
              </div>
            </div>

            <div className="revenue-stat-item">
              <div className="stat-icon-wrap cyan"><i className="fa-solid fa-money-bill-trend-up"></i></div>
              <div className="stat-meta">
                <span className="stat-label">Net Profit</span>
                <div className="stat-value-row">
                  <span className="stat-amount">₹{profitNumber.toLocaleString()}</span>
                  <span className="stat-growth-tag green">{profitNumber > 0 ? '▲ Active' : '0%'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Bar Chart with Animated Hover Columns */}
          <div className="revenue-bars-canvas-wrap">
            <div className="canvas-y-axis">
              <span>₹{Math.round(maxBarValue).toLocaleString()}</span>
              <span>₹{Math.round(maxBarValue * 0.75).toLocaleString()}</span>
              <span>₹{Math.round(maxBarValue * 0.5).toLocaleString()}</span>
              <span>₹{Math.round(maxBarValue * 0.25).toLocaleString()}</span>
              <span>0</span>
            </div>

            <div className="canvas-bars-container">
              {monthlyBars.map((col, idx) => {
                const pHeight = maxBarValue > 0 ? (col.purple / maxBarValue) * 100 : 0;
                const oHeight = maxBarValue > 0 ? (col.orange / maxBarValue) * 100 : 0;
                const cHeight = maxBarValue > 0 ? (col.cyan / maxBarValue) * 100 : 0;

                return (
                  <div
                    key={col.month}
                    className={`bar-group-col ${hoveredMonth === idx ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredMonth(idx)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    {hoveredMonth === idx && (
                      <div className="bar-hover-tooltip">
                        <div className="tip-row purple">● Income: ₹{col.purple.toLocaleString()}</div>
                        <div className="tip-row orange">● Exp: ₹{col.orange.toLocaleString()}</div>
                        <div className="tip-row cyan">● Profit: ₹{col.cyan.toLocaleString()}</div>
                      </div>
                    )}

                    <div className="bar-bars-pair">
                      {(revenueFilter === 'All' || revenueFilter === 'Income') && (
                        <div
                          className="v-bar bar-purple"
                          style={{ height: `${Math.min(100, Math.max(pHeight > 0 ? 6 : 0, pHeight))}%` }}
                        ></div>
                      )}
                      {(revenueFilter === 'All' || revenueFilter === 'Expenses') && (
                        <div
                          className="v-bar bar-orange"
                          style={{ height: `${Math.min(100, Math.max(oHeight > 0 ? 6 : 0, oHeight))}%` }}
                        ></div>
                      )}
                      {(revenueFilter === 'All' || revenueFilter === 'Profit') && (
                        <div
                          className="v-bar bar-cyan"
                          style={{ height: `${Math.min(100, Math.max(cHeight > 0 ? 6 : 0, cHeight))}%` }}
                        ></div>
                      )}
                    </div>
                    <span className="col-month-label">{col.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card: Intersecting Status Circles & Distribution Donut */}
        <div className="dash-card status-distribution-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">All Operations</h3>
              <p className="dash-card-sub">Fleet & Bookings by Domain Status</p>
            </div>
            <button type="button" className="card-kebab-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button>
          </div>

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

              <circle cx="105" cy="85" r="58" fill="url(#bubbleOrange)" className="animated-bubble-circle" opacity={totalCount > 0 ? 1 : 0.4} />
              <text x="105" y="88" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
                {distributionActivePct}%
              </text>

              <circle cx="185" cy="65" r="42" fill="url(#bubbleTeal)" className="animated-bubble-circle" opacity={totalCount > 0 ? 1 : 0.4} style={{ animationDelay: '0.4s' }} />
              <text x="185" y="68" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                {distributionDonePct}%
              </text>

              <circle cx="180" cy="130" r="24" fill="url(#bubbleRed)" className="animated-bubble-circle" opacity={totalCount > 0 ? 1 : 0.4} style={{ animationDelay: '0.8s' }} />
              <text x="180" y="133" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">
                {distributionPendingPct}%
              </text>
            </svg>
          </div>

          <div className="status-legend-list">
            <div className="legend-row">
              <div className="legend-name-col">
                <span className="dot orange"></span>
                <span>Active / In Progress</span>
              </div>
              <span className="legend-count-val">{inProgressCount}</span>
            </div>

            <div className="legend-row">
              <div className="legend-name-col">
                <span className="dot teal"></span>
                <span>Finished & Fulfilled</span>
              </div>
              <span className="legend-count-val">{completedCount}</span>
            </div>

            <div className="legend-row">
              <div className="legend-name-col">
                <span className="dot red"></span>
                <span>Pending Clearance</span>
              </div>
              <span className="legend-count-val">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 3. ORDERS ANALYTICS SPLIT SECTION */}
      <div className="dash-analytics-row dual-analytics-strip">
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

          <div className="orders-wave-chart-container">
            <svg viewBox="0 0 680 180" className="orders-wave-svg">
              <line x1="40" y1="30" x2="660" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="660" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="110" x2="660" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="150" x2="660" y2="150" stroke="#f1f5f9" strokeWidth="1" />

              <text x="15" y="34" fontSize="10" fill="#94a3b8">100</text>
              <text x="15" y="74" fontSize="10" fill="#94a3b8">80</text>
              <text x="15" y="114" fontSize="10" fill="#94a3b8">50</text>
              <text x="15" y="154" fontSize="10" fill="#94a3b8">20</text>

              <rect x="220" y="30" width="28" height="120" rx="8" fill="#e2e8f0" opacity="0.65" />

              {/* Dynamic wave paths based on booking volume */}
              <path
                d={totalCount > 0
                  ? "M 40 150 C 80 130, 110 145, 150 115 C 190 85, 210 120, 234 88 C 260 60, 290 125, 330 110 C 370 95, 410 135, 450 125 C 490 115, 530 85, 570 95 C 610 105, 640 75, 660 70"
                  : "M 40 150 L 660 150"
                }
                fill="none"
                stroke="#1e293b"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animated-wave-line"
              />

              <path
                d={totalCount > 0
                  ? "M 40 115 C 80 125, 110 95, 150 90 C 190 85, 210 70, 234 68 C 260 65, 290 80, 330 75 C 370 70, 410 88, 450 82 C 490 75, 530 92, 570 78 C 610 65, 640 85, 660 75"
                  : "M 40 150 L 660 150"
                }
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animated-wave-line"
                style={{ animationDelay: '0.25s' }}
              />

              {totalCount > 0 && <circle cx="234" cy="88" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />}
            </svg>

            <div className="wave-active-badge">
              <span className="badge-date">Today</span>
              <span className="badge-val">₹{totalRevenueNumber.toLocaleString()}</span>
            </div>

            <div className="wave-x-labels">
              <span>Jan</span>
              <span>Feb</span>
              <span className="active-x-month">Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Earnings Multi-Segment Ring Card */}
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
              <circle
                cx="80" cy="80" r="54"
                fill="none"
                stroke={totalCount > 0 ? "#1e293b" : "#e2e8f0"}
                strokeWidth="18"
                strokeDasharray="160 340"
                strokeDashoffset="0"
                transform="rotate(-90 80 80)"
              />
              {totalCount > 0 && (
                <>
                  <circle
                    cx="80" cy="80" r="54"
                    fill="none"
                    stroke="#f472b6"
                    strokeWidth="18"
                    strokeDasharray="60 340"
                    strokeDashoffset="-165"
                    transform="rotate(-90 80 80)"
                  />
                  <circle
                    cx="80" cy="80" r="54"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="18"
                    strokeDasharray="40 340"
                    strokeDashoffset="-230"
                    transform="rotate(-90 80 80)"
                  />
                  <circle
                    cx="80" cy="80" r="54"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="18"
                    strokeDasharray="50 340"
                    strokeDashoffset="-275"
                    transform="rotate(-90 80 80)"
                  />
                </>
              )}
            </svg>

            <div className="ring-center-stat">
              <span className="ring-stat-amount">₹{totalRevenueNumber.toLocaleString()}</span>
              <span className="ring-stat-sub">{totalCount} Bookings</span>
            </div>
          </div>

          <div className="ring-legend-footer">
            <span className="ring-leg-item"><span className="dot navy"></span> Offline</span>
            <span className="ring-leg-item"><span className="dot amber"></span> Online</span>
            <span className="ring-leg-item"><span className="dot pink"></span> Trade / B2B</span>
          </div>
        </div>
      </div>

      {/* 🌟 4. BOTTOM SECTION: RECENT DISPATCHES TABLE + INTERACTIVE CALENDAR */}
      <div className="dash-analytics-row bottom-table-calendar-row">
        <div className="dash-card recent-projects-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Recent Dispatches & Bookings</h3>
              <p className="dash-card-sub">Real-time status tracking across fleets and customer bookings</p>
            </div>
            <div className="table-header-actions">
              <button type="button" className="action-pill-btn"><i className="fa-regular fa-calendar"></i> Select Due Date</button>
              <button type="button" className="action-pill-btn"><i className="fa-solid fa-sliders"></i> Filters</button>
              <button type="button" className="action-pill-btn primary">See All ({totalCount})</button>
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
                {recentDispatches.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      <i className="fa-solid fa-inbox" style={{ fontSize: '28px', marginBottom: '8px', display: 'block' }}></i>
                      No user bookings yet. Values start at 0 and update dynamically as users book vehicles.
                    </td>
                  </tr>
                ) : (
                  recentDispatches.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="proj-cell">
                          <div className={`proj-avatar-badge ${row.category.toLowerCase()}`}>
                            {row.category.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="proj-name">{row.title}</div>
                            <div className="proj-client">{row.client} • ₹{row.amount?.toLocaleString()}</div>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Calendar Card */}
        <div className="dash-card calendar-schedule-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Schedule Calendar</h3>
              <p className="dash-card-sub">Fleet & Dispatch Availability</p>
            </div>
            <button type="button" className="card-kebab-btn"><i className="fa-solid fa-ellipsis"></i></button>
          </div>

          <div className="cal-header-strip">
            <button type="button" className="cal-arrow-btn"><i className="fa-solid fa-chevron-left"></i></button>
            <div className="cal-month-year-wrap">
              <span className="cal-active-month">November</span>
              <select defaultValue="2026">
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
            <button type="button" className="cal-arrow-btn"><i className="fa-solid fa-chevron-right"></i></button>
          </div>

          <div className="cal-matrix-grid">
            <div className="cal-weekday">Su</div>
            <div className="cal-weekday">Mo</div>
            <div className="cal-weekday">Tu</div>
            <div className="cal-weekday">We</div>
            <div className="cal-weekday">Th</div>
            <div className="cal-weekday">Fr</div>
            <div className="cal-weekday">Sa</div>

            {[
              { d: 1 }, { d: 2, event: totalCount > 0 }, { d: 3 }, { d: 4 }, { d: 5 }, { d: 6 }, { d: 7 },
              { d: 8 }, { d: 9 }, { d: 10 }, { d: 11 }, { d: 12 }, { d: 13 }, { d: 14 },
              { d: 15 }, { d: 16 }, { d: 17 }, { d: 18 }, { d: 19, event: totalCount > 0 }, { d: 20 }, { d: 21 },
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

          <div className="cal-day-schedule-preview">
            <div className="sched-header">
              <span className="sched-date-label">Schedule for Nov {selectedCalendarDate}, 2026</span>
              <button type="button" className="btn-add-schedule"><i className="fa-solid fa-plus"></i> Add</button>
            </div>
            {recentDispatches.length > 0 ? (
              recentDispatches.slice(0, 2).map((item, idx) => (
                <div key={idx} className="sched-item">
                  <div className={`sched-time-badge ${idx === 1 ? 'purple' : ''}`}>10:00 AM</div>
                  <div className="sched-details">
                    <span className="sched-title">{item.title}</span>
                    <span className="sched-sub">{item.client} • Status: {item.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                No scheduled operations for this day.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
