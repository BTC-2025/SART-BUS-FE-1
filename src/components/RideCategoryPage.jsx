import React, { useState } from 'react';

export default function RideCategoryPage({
  category = 'all',
  partnerDetails,
  onNavigate
}) {
  const [filterType, setFilterType] = useState('all');

  const getCategoryInfo = () => {
    switch (category) {
      case 'bike':
        return {
          title: 'Bike Moto Fleet Hub',
          icon: 'fa-motorcycle',
          badgeColor: '#3b82f6',
          desc: 'Manage express two-wheeler rides, quick dispatch, and city bike messengers'
        };
      case 'auto':
        return {
          title: 'Auto Rickshaw Fleet Hub',
          icon: 'fa-truck-front',
          badgeColor: '#10b981',
          desc: 'Monitor city three-wheelers, auto meters, and regional route dispatches'
        };
      case 'car':
        return {
          title: 'Cab & Executive Car Fleet Hub',
          icon: 'fa-car-side',
          badgeColor: '#6366f1',
          desc: 'Track prime sedans, SUVs, outstation business rentals, and airport corporate transfers'
        };
      default:
        return {
          title: 'Rides & Mobility Fleet Hub',
          icon: 'fa-car',
          badgeColor: '#2563eb',
          desc: 'Full unified overview of all active mobility services, cabs, autos, and drivers'
        };
    }
  };

  const info = getCategoryInfo();

  const MOCK_RIDES_FLEET = [
    { id: 'RD-101', driver: 'Karthik Raja', vehicle: 'Toyota Innova Crysta (White)', type: 'car', reg: 'TN 09 BX 4421', status: 'On Trip', location: 'Anna Nagar -> Airport', fare: '₹850', rating: '4.9' },
    { id: 'RD-102', driver: 'Suresh Babu', vehicle: 'Bajaj RE Auto Rickshaw', type: 'auto', reg: 'TN 02 CD 1289', status: 'Available', location: 'T. Nagar Stand', fare: '₹140', rating: '4.8' },
    { id: 'RD-103', driver: 'Praveen K.', vehicle: 'Honda Activa 6G (EV/Petrol)', type: 'bike', reg: 'TN 07 EF 9931', status: 'On Trip', location: 'Guindy -> Velachery', fare: '₹95', rating: '4.7' },
    { id: 'RD-104', driver: 'Manoj Kumar', vehicle: 'Maruti Suzuki Dzire', type: 'car', reg: 'TN 22 GH 5501', status: 'Scheduled', location: 'OMR IT Corridor', fare: '₹620', rating: '4.9' }
  ];

  const filteredFleet = MOCK_RIDES_FLEET.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="ride-category-view-wrapper" style={{ minHeight: 'calc(100vh - 100px)', background: '#f8fafc' }}>
      {/* Category Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '24px 32px',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <i className={`fa-solid ${info.icon}`}></i>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                {info.title}
              </h2>
              <span style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {category}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#94a3b8' }}>
              {info.desc}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            color: '#cbd5e1'
          }}>
            Operator: <strong style={{ color: '#ffffff' }}>{partnerDetails?.name || 'Fleet Operator'}</strong>
          </div>
        </div>
      </div>

      {/* Fleet Metrics & Filter Row */}
      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Active Cabs & Vehicles</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>24 <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 700 }}>+3 online</span></h3>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Ongoing Passenger Trips</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: 800, color: '#2563eb' }}>18 Trips</h3>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Available for Dispatch</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: 800, color: '#059669' }}>6 Drivers</h3>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Today's Mobility Revenue</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: 800, color: '#d97706' }}>₹28,450</h3>
          </div>
        </div>

        {/* Live Rides Table Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-car-side" style={{ color: '#2563eb', fontSize: '18px' }}></i>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Live Rides Fleet & Driver Manifest</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'car', 'auto', 'bike'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: filterType === type ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    background: filterType === type ? '#eff6ff' : '#ffffff',
                    color: filterType === type ? '#2563eb' : '#64748b',
                    textTransform: 'capitalize'
                  }}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                  <th style={{ padding: '12px 16px' }}>Trip ID</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Driver</th>
                  <th style={{ padding: '12px 16px' }}>Vehicle & Reg No</th>
                  <th style={{ padding: '12px 16px' }}>Current Location / Route</th>
                  <th style={{ padding: '12px 16px' }}>Fare</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredFleet.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>{row.id}</td>
                    <td style={{ padding: '14px 16px', color: '#1e293b' }}>
                      <div style={{ fontWeight: 600 }}>{row.driver}</div>
                      <span style={{ fontSize: '12px', color: '#eab308' }}><i className="fa-solid fa-star"></i> {row.rating}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.vehicle}</div>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{row.reg}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>
                      <i className="fa-solid fa-location-dot" style={{ color: '#ef4444', marginRight: '6px' }}></i>
                      {row.location}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#15803d' }}>{row.fare}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background: row.status === 'On Trip' ? '#eff6ff' : row.status === 'Available' ? '#ecfdf5' : '#fffbeb',
                        color: row.status === 'On Trip' ? '#2563eb' : row.status === 'Available' ? '#059669' : '#d97706'
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
