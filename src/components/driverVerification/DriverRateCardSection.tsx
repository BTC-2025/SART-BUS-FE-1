'use client';

import React from 'react';

interface DriverRateCardSectionProps {
  hourlyPrice: string;
  setHourlyPrice: (val: string) => void;
  dailyPrice: string;
  setDailyPrice: (val: string) => void;
  weeklyPrice: string;
  setWeeklyPrice: (val: string) => void;
  monthlyPrice: string;
  setMonthlyPrice: (val: string) => void;
  outstationPrice: string;
  setOutstationPrice: (val: string) => void;
}

export default function DriverRateCardSection({
  hourlyPrice,
  setHourlyPrice,
  dailyPrice,
  setDailyPrice,
  weeklyPrice,
  setWeeklyPrice,
  monthlyPrice,
  setMonthlyPrice,
  outstationPrice,
  setOutstationPrice
}: DriverRateCardSectionProps) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
            Rate Card &amp; Pricing Charges
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            Set hourly, daily, weekly, monthly, and outstation charges for this driver.
          </p>
        </div>
        {/* Live Rate Card Preview Pill */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '6px 14px',
          fontSize: '12.5px',
          fontWeight: 800,
          color: '#0f172a'
        }}>
          ₹{Number(hourlyPrice) || 0}/hr | ₹{Number(dailyPrice) || 0} (8 Hrs) | Outstation: ₹{Number(outstationPrice) || 0}/day
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        {/* Hourly Price */}
        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
            Per Hour Price (₹) <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b', fontSize: '13px' }}>₹</span>
            <input
              type="number"
              value={hourlyPrice}
              onChange={(e) => setHourlyPrice(e.target.value)}
              placeholder="120"
              style={{ width: '100%', padding: '8px 10px 8px 24px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}
              required
            />
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', marginTop: '3px', display: 'block' }}>e.g., ₹120/hr</span>
        </div>

        {/* Daily Price */}
        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
            Per Day Price (8 Hrs) (₹) <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b', fontSize: '13px' }}>₹</span>
            <input
              type="number"
              value={dailyPrice}
              onChange={(e) => setDailyPrice(e.target.value)}
              placeholder="800"
              style={{ width: '100%', padding: '8px 10px 8px 24px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}
              required
            />
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', marginTop: '3px', display: 'block' }}>e.g., ₹800/day</span>
        </div>

        {/* Weekly Price */}
        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
            Per Week Price (₹)
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b', fontSize: '13px' }}>₹</span>
            <input
              type="number"
              value={weeklyPrice}
              onChange={(e) => setWeeklyPrice(e.target.value)}
              placeholder="4800"
              style={{ width: '100%', padding: '8px 10px 8px 24px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}
            />
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', marginTop: '3px', display: 'block' }}>e.g., ₹4,800/week</span>
        </div>

        {/* Monthly Price */}
        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
            Per Month Price (₹)
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b', fontSize: '13px' }}>₹</span>
            <input
              type="number"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
              placeholder="18000"
              style={{ width: '100%', padding: '8px 10px 8px 24px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}
            />
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', marginTop: '3px', display: 'block' }}>e.g., ₹18,000/month</span>
        </div>

        {/* Outstation Price */}
        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
            Outstation / Day (₹)
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b', fontSize: '13px' }}>₹</span>
            <input
              type="number"
              value={outstationPrice}
              onChange={(e) => setOutstationPrice(e.target.value)}
              placeholder="1800"
              style={{ width: '100%', padding: '8px 10px 8px 24px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}
            />
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', marginTop: '3px', display: 'block' }}>e.g., ₹1,800/day</span>
        </div>
      </div>
    </div>
  );
}
