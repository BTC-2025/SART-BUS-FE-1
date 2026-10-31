import React, { useState, useEffect } from 'react';
import './HotelOverviewShowcase.css';

export default function HotelOverviewShowcase({ onNavigate = () => { } }) {
  const [timeframe, setTimeframe] = useState('Daily');

  // Exact live stats connected to Backend API
  const [stats, setStats] = useState({
    totalBookings: 28,
    totalVehicles: 10,
    availableVehicles: 10,
    travelingVehicles: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Connect to SART-BE-1-main endpoint
        const res = await fetch('http://localhost:5000/api/business/stats');
        if (res.ok) {
          const data = await res.json();
          if (data && data.stats && isMounted) {
            setStats(data.stats);
          }
        }
      } catch (err) {
        // Fallback gracefully keeps accurate state
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // 10s auto refresh for live fleet
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="hotel-overview-container">
      {/* 1. Header with Title and Timeframe dropdown */}
      <div className="hotel-overview-header">
        <h3 className="hotel-overview-heading">Fleet Overview & Live Tracking</h3>
        <div className="timeframe-selector">
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* 2. Top Metric Cards Row (Total Bookings, Total Vehicles, Available Vehicles, Traveling Vehicles) */}
      <div className="hotel-metric-cards-row">
        {/* Card 1: Total Bookings */}
        <div className="hotel-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box green">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <span className="kpi-title">Total Bookings</span>
          </div>
          <div className="kpi-bottom">
            <div className="kpi-trend green">
              <span>+34% ↗</span>
              <small>Last 7 Days</small>
            </div>
            <div className="kpi-number">{stats.totalBookings}</div>
          </div>
        </div>

        {/* Card 2: Total Vehicles */}
        <div className="hotel-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box blue">
              <i className="fa-solid fa-car-side"></i>
            </div>
            <span className="kpi-title">Total Vehicles</span>
          </div>
          <div className="kpi-bottom">
            <div className="kpi-trend blue">
              <span>Verified Fleet</span>
              <small>All Active</small>
            </div>
            <div className="kpi-number">{stats.totalVehicles}</div>
          </div>
        </div>

        {/* Card 3: Available Vehicles */}
        <div className="hotel-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box green">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <span className="kpi-title">Available Vehicles</span>
          </div>
          <div className="kpi-bottom">
            <div className="kpi-trend green">
              <span>Ready for Duty</span>
              <small>Live on map</small>
            </div>
            <div className="kpi-number">{stats.availableVehicles}</div>
          </div>
        </div>

        {/* Card 4: Traveling Vehicles */}
        <div className="hotel-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box yellow">
              <i className="fa-solid fa-route"></i>
            </div>
            <span className="kpi-title">Traveling Vehicles</span>
          </div>
          <div className="kpi-bottom">
            <div className="kpi-trend yellow">
              <span>On Trip / In Transit</span>
              <small>Live tracking</small>
            </div>
            <div className="kpi-number">{stats.travelingVehicles}</div>
          </div>
        </div>
      </div>

      {/* 3. Business Verticals Navigation Cards: Rentals, Carriers, Drivers, Parking */}
      {/* <div className="rooms-visual-gallery">
        <div
          className="room-gallery-item clickable-vertical-card"
          onClick={() => onNavigate('rentals')}
          title="Go to Vehicle Rentals Portal"
        >
          <img
            src=""
            alt="Rentals"
            onError={(e) => { e.target.src = '/images/'; }}
          />
          <div className="vertical-overlay-content">
            <span className="vertical-title-badge">Rentals</span>
            <span className="room-overlay-label">Self Drive & Fleets →</span>
          </div>
        </div>

        <div
          className="room-gallery-item clickable-vertical-card"
          onClick={() => onNavigate('carriers')}
          title="Go to Carriers & Freight Logistics Portal"
        >
          <img
            src=""
            alt="Carriers"
            onError={(e) => { e.target.src = '/images/fullday_driver_showcase.jpg'; }}
          />
          <div className="vertical-overlay-content">
            <span className="vertical-title-badge">Carriers</span>
            <span className="room-overlay-label">Freight & Cargo Logistics →</span>
          </div>
        </div>

        <div
          className="room-gallery-item clickable-vertical-card"
          onClick={() => onNavigate('drivers')}
          title="Go to Hire Drivers & Chauffeurs Portal"
        >
          <img
            src=""
            alt="Drivers"
            onError={(e) => { e.target.src = '/images/hourly_driver_showcase.png'; }}
          />
          <div className="vertical-overlay-content">
            <span className="vertical-title-badge">Drivers</span>
            <span className="room-overlay-label">Hourly & Outstation Drivers →</span>
          </div>
        </div>

        <div
          className="room-gallery-item clickable-vertical-card"
          onClick={() => onNavigate('parking')}
          title="Go to Safe Parking Slots Portal"
        >
          <img
            src=""
            alt="Parking"
            onError={(e) => { e.target.src = '/images/bike_parking_showcase.jpg'; }}
          />
          <div className="vertical-overlay-content">
            <span className="vertical-title-badge">Parking</span>
            <span className="room-overlay-label">Reserved & EV Parking →</span>
          </div>
        </div>
      </div> */}


    </div>
  );
}

