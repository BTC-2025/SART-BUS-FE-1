import React from 'react';
import CaptainDutyRightView from './CaptainDutyRightView';

export default function RideCategoryPage({
  category = 'all',
  partnerDetails,
  isOnDuty,
  setIsOnDuty,
  onOpenProfile
}) {
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
          title: 'All Rides & Operations',
          icon: 'fa-layer-group',
          badgeColor: '#2563eb',
          desc: 'Full unified overview of all active mobility services and drivers'
        };
    }
  };

  const info = getCategoryInfo();

  return (
    <div className="ride-category-view-wrapper">
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
            background: info.badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#ffffff',
            boxShadow: `0 4px 14px ${info.badgeColor}55`
          }}>
            <i className={`fa-solid ${info.icon}`}></i>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>{info.title}</h2>
              <span style={{
                background: `${info.badgeColor}22`,
                color: info.badgeColor,
                border: `1px solid ${info.badgeColor}55`,
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '600',
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
            Company: <strong style={{ color: '#ffffff' }}>{partnerDetails?.email || 'Corporate Partner'}</strong>
          </div>
        </div>
      </div>

      {/* Embedded Live Fleet & Operations map view filtered by category */}
      <div className="c-laptop-split-home full-width-home">
        <CaptainDutyRightView
          partnerDetails={partnerDetails}
          isOnDuty={isOnDuty}
          setIsOnDuty={setIsOnDuty}
          onOpenProfile={onOpenProfile}
          vehicleCategoryFilter={category}
        />
      </div>
    </div>
  );
}
