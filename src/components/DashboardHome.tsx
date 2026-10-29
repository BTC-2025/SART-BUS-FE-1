import React, { useState } from 'react';

export default function DashboardHome({ partnerDetails, onNavigate }) {
  const [dateRange, setDateRange] = useState('7D');

  const stats = [
    {
      id: 'rev',
      label: 'Gross Freight & Rental Revenue',
      value: '₹3,48,250',
      change: '+18.4% vs last week',
      isPositive: true,
      icon: 'fa-indian-rupee-sign',
      color: '#10b981',
      sub: '5% RCM & 18% Forward Billed'
    },
    {
      id: 'trips',
      label: 'Active Dispatches & Trips',
      value: '142',
      change: '+12 today',
      isPositive: true,
      icon: 'fa-truck-fast',
      color: '#3b82f6',
      sub: '98 Roadways • 44 Rail Cargo'
    },
    {
      id: 'fleet',
      label: 'Fleet Size in Operation',
      value: '68 Vehicles',
      change: '88% Utilization',
      isPositive: true,
      icon: 'fa-car-side',
      color: '#8b5cf6',
      sub: '24 Trucks • 22 Autos • 22 Bikes'
    },
    {
      id: 'drivers',
      label: 'Verified Drivers On Duty',
      value: '54 / 58',
      change: '100% PCC Verified',
      isPositive: true,
      icon: 'fa-user-check',
      color: '#f59e0b',
      sub: 'Form 1A Medical Tested'
    }
  ];

  const recentBookings = [
    {
      id: 'BK-9912',
      customer: 'TVS Industrial Park, Ambattur',
      vehicle: 'Ashok Leyland Dost Plus (TN 09 BK 4421)',
      category: 'Truck / LCV',
      amount: '₹3,200',
      status: 'In Transit',
      statusColor: '#3b82f6',
      mode: '18% Forward Charge (With ITC)',
      date: 'Today, 11:20 AM'
    },
    {
      id: 'BK-9911',
      customer: 'Sundaram Auto Components, Sriperumbudur',
      vehicle: 'Bajaj RE Compact (TN 07 AQ 8812)',
      category: 'Auto Rickshaw',
      amount: '₹750',
      status: 'Clean e-POD Signed',
      statusColor: '#10b981',
      mode: '5% RCM Transport',
      date: 'Today, 09:45 AM'
    },
    {
      id: 'BK-9910',
      customer: 'Swiggy Instamart Dark Store Hub',
      vehicle: 'Yamaha FZ-S Hybrid (TN 09 BX 3319)',
      category: 'Bike Moto',
      amount: '₹450',
      status: 'Delivered',
      statusColor: '#10b981',
      mode: 'Courier Parcel Service',
      date: 'Yesterday, 06:15 PM'
    },
    {
      id: 'BK-9909',
      customer: 'MedLife Regional Pharma Depot',
      vehicle: 'Indian Railways Express Parcel Wagon',
      category: 'Rail Freight',
      amount: '₹14,500',
      status: 'RR Waybill Issued',
      statusColor: '#8b5cf6',
      mode: 'E-Way Bill #EWB-881920',
      date: 'Yesterday, 02:00 PM'
    }
  ];

  return (
    <div style={{ padding: '28px 36px', maxWidth: '1440px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Welcome & Quick Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>
              Merchant Operations Command Center
            </h1>
            <span style={{
              background: '#ecfdf5',
              color: '#059669',
              fontSize: '12px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '999px',
              border: '1px solid #a7f3d0'
            }}>
              LIVE SYSTEM
            </span>
          </div>
          <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
            Welcome back, <strong>{partnerDetails?.name || 'Enterprise Partner'}</strong> ({partnerDetails?.email || 'admin@bnxmail.com'})
          </p>
        </div>

        {/* Quick Actions & Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '4px', display: 'flex' }}>
            {['24H', '7D', '30D', 'YTD'].map((t) => (
              <button
                key={t}
                onClick={() => setDateRange(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: dateRange === t ? '#0A382C' : 'transparent',
                  color: dateRange === t ? '#ffffff' : '#64748b',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('vehicle_rental')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#0A382C',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(10, 56, 44, 0.2)'
            }}
          >
            <i className="fa-solid fa-plus"></i>
            Upload Vehicle
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {stats.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: item.color
            }}></div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{item.label}</span>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${item.color}15`,
                color: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                {item.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: item.color }}>
                  <i className="fa-solid fa-arrow-trend-up" style={{ marginRight: '4px' }}></i>
                  {item.change}
                </span>
                <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>• {item.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Revenue & Dispatches Analytics + Quick Services */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '28px'
      }}>
        {/* Left Column: Visual Analytics Chart Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '26px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>
                Weekly Fleet Dispatch Velocity & Revenue (₹)
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Aggregated daily volume across Roadways, Rail Parcel Waybills, and Rapid Courier
              </p>
            </div>
            <span style={{
              background: '#f1f5f9',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: '700',
              color: '#334155'
            }}>
              Avg ₹49,750 / day
            </span>
          </div>

          {/* Graphical Bar Visual */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '12px',
            alignItems: 'end',
            height: '180px',
            paddingTop: '20px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            {[
              { day: 'Mon', h: '65%', val: '₹42k' },
              { day: 'Tue', h: '80%', val: '₹53k' },
              { day: 'Wed', h: '72%', val: '₹48k' },
              { day: 'Thu', h: '90%', val: '₹61k' },
              { day: 'Fri', h: '85%', val: '₹58k' },
              { day: 'Sat', h: '95%', val: '₹68k' },
              { day: 'Sun', h: '45%', val: '₹28k' }
            ].map((bar, i) => (
              <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{bar.val}</span>
                <div style={{
                  width: '100%',
                  height: bar.h,
                  background: i === 5 ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' : 'linear-gradient(180deg, #0A382C 0%, #15803d 100%)',
                  borderRadius: '8px 8px 3px 3px',
                  transition: 'height 0.4s ease'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>{bar.day}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
            <span><i className="fa-solid fa-circle" style={{ color: '#0A382C', fontSize: '10px', marginRight: '6px' }}></i>Standard GTA Transit</span>
            <span><i className="fa-solid fa-circle" style={{ color: '#10b981', fontSize: '10px', marginRight: '6px' }}></i>Peak Logistics Day (Sat)</span>
            <span><i className="fa-solid fa-shield-halved" style={{ color: '#2563eb', fontSize: '10px', marginRight: '6px' }}></i>100% Tax Compliant</span>
          </div>
        </div>

        {/* Right Column: Quick Operations Hub Links */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '17px', color: '#0f172a', fontWeight: '800' }}>
              Operational Quick Access
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => onNavigate('carrier')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background 0.2s'
                }}
              >
                <i className="fa-solid fa-truck-moving" style={{ color: '#0A382C', fontSize: '18px' }}></i>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#0f172a' }}>Carrier</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>5% RCM & 18% Forward Bilti</div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('vehicle_rental')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <i className="fa-solid fa-car-burst" style={{ color: '#2563eb', fontSize: '18px' }}></i>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#0f172a' }}>Rental</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>Upload bikes, autos, cars & trucks</div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('hire_drivers')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <i className="fa-solid fa-user-tie" style={{ color: '#d97706', fontSize: '18px' }}></i>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#0f172a' }}>Hire Commercial Drivers</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>Parivahan DL & PCC Verified</div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('parking')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <i className="fa-solid fa-square-parking" style={{ color: '#059669', fontSize: '18px' }}></i>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#0f172a' }}>Yard & Detention Ledger</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>SAC 996743 (18% GST)</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '12.5px',
            color: '#065f46'
          }}>
            <strong>Compliance Status:</strong> All GSTIN returns (GSTR-1 & GSTR-3B) synced with E-Way Bill portal.
          </div>
        </div>
      </div>

      {/* Recent Dispatches & Consignments Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        padding: '26px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>
              Real-Time Dispatches & Cargo Bookings
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Live transit logs with instant e-POD signing and payment settlement
            </p>
          </div>
          <button
            onClick={() => onNavigate('carrier')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#334155',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            View Full Carrier Logbook
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Booking ID</th>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Enterprise Customer</th>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Assigned Fleet Asset</th>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Tax Scheme</th>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Gross Billed</th>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '800', color: '#0A382C' }}>
                    {b.id}
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{b.date}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{b.customer}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '600' }}>{b.vehicle}</div>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>{b.category}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: '#f1f5f9',
                      color: '#334155',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: '600'
                    }}>
                      {b.mode}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '800', color: '#0f172a' }}>
                    {b.amount}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: `${b.statusColor}18`,
                      color: b.statusColor,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {b.status}
                    </span>
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
