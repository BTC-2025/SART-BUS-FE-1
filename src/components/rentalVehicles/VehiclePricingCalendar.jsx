import React, { useState } from 'react';
import './rentalVehicles.css';

export default function VehiclePricingCalendar({ pricing, onPricingChange, calendar, onCalendarChange }) {
  // Pricing state
  const handlePriceInput = (field, value) => {
    onPricingChange({
      ...pricing,
      [field]: value
    });
  };

  // Calendar dates matrix for interactive availability toggle
  const [selectedMonth, setSelectedMonth] = useState('December 2026');

  // Days simulation (1 to 31)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const toggleDayStatus = (day) => {
    const currentStatus = calendar.dates[day] || 'available';
    let nextStatus = 'available';
    if (currentStatus === 'available') nextStatus = 'blocked';
    else if (currentStatus === 'blocked') nextStatus = 'maintenance';
    else if (currentStatus === 'maintenance') nextStatus = 'available';

    onCalendarChange({
      ...calendar,
      dates: {
        ...calendar.dates,
        [day]: nextStatus
      }
    });
  };

  return (
    <div>
      {/* 5A. Pricing Configuration Card */}
      <div className="rental-form-card">
        <div className="rental-section-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3>5. Vehicle Rental Pricing Engine (Zoomcar Model)</h3>
              <p>Configure hourly, daily, weekend rates, security deposits, and extra kilometer rules</p>
            </div>
            <span style={{
              background: '#eff6ff',
              color: '#2563eb',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              Dynamic Surge & Packages
            </span>
          </div>
        </div>

        <div className="rental-input-grid">
          {/* Hourly Rental */}
          <div className="rental-field-group">
            <label className="rental-label">Hourly Rental Rate (₹/hr)</label>
            <input
              type="text"
              className="rental-input"
              placeholder="e.g. ₹250/hour"
              value={pricing.hourlyRate}
              onChange={(e) => handlePriceInput('hourlyRate', e.target.value)}
            />
          </div>

          {/* Daily Rental */}
          <div className="rental-field-group">
            <label className="rental-label">Daily Rental Rate (₹/day)</label>
            <input
              type="text"
              className="rental-input"
              placeholder="e.g. ₹2,000/day"
              value={pricing.dailyRate}
              onChange={(e) => handlePriceInput('dailyRate', e.target.value)}
            />
          </div>

          {/* Weekend Pricing */}
          <div className="rental-field-group">
            <label className="rental-label">Weekend Pricing Rate (₹/day)</label>
            <input
              type="text"
              className="rental-input"
              placeholder="e.g. ₹2,500/day (Fri - Sun)"
              value={pricing.weekendRate}
              onChange={(e) => handlePriceInput('weekendRate', e.target.value)}
            />
          </div>

          {/* Weekly Rental */}
          <div className="rental-field-group">
            <label className="rental-label">Weekly Rental Discount (₹/week)</label>
            <input
              type="text"
              className="rental-input"
              placeholder="e.g. ₹12,000/week"
              value={pricing.weeklyRate}
              onChange={(e) => handlePriceInput('weeklyRate', e.target.value)}
            />
          </div>

          {/* Security Deposit */}
          <div className="rental-field-group">
            <label className="rental-label">Refundable Security Deposit (₹)</label>
            <input
              type="text"
              className="rental-input"
              placeholder="e.g. ₹5,000 (Pre-authorized)"
              value={pricing.securityDeposit}
              onChange={(e) => handlePriceInput('securityDeposit', e.target.value)}
            />
          </div>

          {/* Extra Kilometer Charge */}
          <div className="rental-field-group">
            <label className="rental-label">Extra Kilometer Charge (₹/km)</label>
            <input
              type="text"
              className="rental-input"
              placeholder="e.g. ₹12/km"
              value={pricing.extraKmCharge}
              onChange={(e) => handlePriceInput('extraKmCharge', e.target.value)}
            />
          </div>

          {/* Late Return Charge */}
          <div className="rental-field-group">
            <label className="rental-label">Late Return Penalty (₹/hr)</label>
            <input
              type="text"
              className="rental-input"
              placeholder="e.g. ₹200/hour"
              value={pricing.lateReturnCharge}
              onChange={(e) => handlePriceInput('lateReturnCharge', e.target.value)}
            />
          </div>

          {/* Minimum Booking Duration */}
          <div className="rental-field-group">
            <label className="rental-label">Minimum Rental Duration</label>
            <select
              className="rental-select"
              value={pricing.minDuration}
              onChange={(e) => handlePriceInput('minDuration', e.target.value)}
            >
              <option value="4 Hours">4 Hours</option>
              <option value="8 Hours">8 Hours</option>
              <option value="12 Hours">12 Hours</option>
              <option value="24 Hours (1 Day)">24 Hours (1 Day)</option>
              <option value="3 Days">3 Days</option>
            </select>
          </div>
        </div>

        {/* Timings Configuration */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#0f172a' }}>Daily Operating Timings</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="rental-field-group">
              <label className="rental-label">Earliest Pickup Time</label>
              <input
                type="time"
                className="rental-input"
                value={pricing.pickupTime || '06:00'}
                onChange={(e) => handlePriceInput('pickupTime', e.target.value)}
              />
            </div>
            <div className="rental-field-group">
              <label className="rental-label">Latest Drop-Off Time</label>
              <input
                type="time"
                className="rental-input"
                value={pricing.returnTime || '23:30'}
                onChange={(e) => handlePriceInput('returnTime', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5B. Availability Calendar Card */}
      <div className="rental-form-card">
        <div className="rental-section-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3>Interactive Availability & Booking Calendar</h3>
              <p>Click dates to toggle: Available (Green) → Blocked (Red) → Under Maintenance (Orange)</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }}></span>
                <span>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#ef4444' }}></span>
                <span>Blocked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#f59e0b' }}></span>
                <span>Maintenance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#2563eb' }}></span>
                <span>Confirmed Booking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Month Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          padding: '12px 18px',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <span style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>{selectedMonth}</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Automatic Conflict & Overlap Prevention Active</span>
        </div>

        {/* Days Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          textAlign: 'center'
        }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dw) => (
            <div key={dw} style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', padding: '6px 0' }}>
              {dw}
            </div>
          ))}

          {daysInMonth.map((d) => {
            const status = calendar.dates[d] || (d >= 10 && d <= 12 ? 'booked' : 'available');

            let bg = '#ecfdf5';
            let color = '#059669';
            let border = '1px solid #a7f3d0';
            let label = 'Open';

            if (status === 'blocked') {
              bg = '#fef2f2';
              color = '#dc2626';
              border = '1px solid #fecaca';
              label = 'Blocked';
            } else if (status === 'maintenance') {
              bg = '#fffbeb';
              color = '#d97706';
              border = '1px solid #fde68a';
              label = 'Service';
            } else if (status === 'booked') {
              bg = '#eff6ff';
              color = '#2563eb';
              border = '1px solid #bfdbfe';
              label = 'Booked';
            }

            return (
              <div
                key={d}
                onClick={() => status !== 'booked' && toggleDayStatus(d)}
                style={{
                  height: '62px',
                  borderRadius: '10px',
                  background: bg,
                  border: border,
                  color: color,
                  cursor: status === 'booked' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  userSelect: 'none'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: '800' }}>{d}</span>
                <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Confirmed bookings timeline */}
        <div style={{ marginTop: '20px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a', marginBottom: '8px' }}>
            <i className="fa-solid fa-lock" style={{ color: '#2563eb', marginRight: '6px' }}></i>
            Active Reservations Automatically Locking Dates:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12.5px', color: '#475569' }}>
            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>
              Dec 10 - Dec 12
            </span>
            <span>Self-Drive Booking #RES-9901 (John Smith) • Vehicle automatically marked unavailable to prevent overlap.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
