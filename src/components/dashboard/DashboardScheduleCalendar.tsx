'use client';

import React from 'react';
import { UnifiedBooking } from '../BusinessOperationsDashboard';

interface DashboardScheduleCalendarProps {
  selectedCalendarYear: number;
  selectedCalendarMonth: number;
  selectedCalendarDay: number;
  setSelectedCalendarDay: (day: number) => void;
  bookings: UnifiedBooking[];
}

export default function DashboardScheduleCalendar({
  selectedCalendarYear,
  selectedCalendarMonth,
  selectedCalendarDay,
  setSelectedCalendarDay,
  bookings
}: DashboardScheduleCalendarProps) {
  return (
    <div style={{ background: '#ffffff', borderRadius: '18px', padding: '22px 24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Schedule Calendar</h2>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#ea580c', background: '#fff7ed', padding: '2px 8px', borderRadius: '6px' }}>
          {new Date(selectedCalendarYear, selectedCalendarMonth).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </div>
      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 14px 0' }}>Daily dispatch &amp; booking schedule</p>

      {/* Calendar Day Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '14px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <span key={d} style={{ fontSize: '10.5px', fontWeight: 500, color: '#9ca3af', padding: '2px 0' }}>{d}</span>
        ))}

        {/* Days 1 to 30 */}
        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
          const isSelected = selectedCalendarDay === day;
          const hasBookings = bookings.some(b => {
            const bDate = new Date(b.rawTimestamp);
            return bDate.getDate() === day && bDate.getMonth() === selectedCalendarMonth;
          });
          return (
            <div
              key={day}
              onClick={() => setSelectedCalendarDay(day)}
              style={{
                padding: '5px 0',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                margin: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: isSelected ? 700 : hasBookings ? 600 : 500,
                cursor: 'pointer',
                background: isSelected ? '#ea580c' : hasBookings ? '#ffedd5' : 'transparent',
                color: isSelected ? '#ffffff' : hasBookings ? '#ea580c' : '#374151',
                transition: 'all 0.15s ease'
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Schedule list for selected day */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
          Schedule for {selectedCalendarDay} {new Date(selectedCalendarYear, selectedCalendarMonth).toLocaleDateString('en-US', { month: 'short' })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {bookings.filter(b => {
            const bDate = new Date(b.rawTimestamp);
            return bDate.getDate() === selectedCalendarDay && bDate.getMonth() === selectedCalendarMonth;
          }).length === 0 ? (
            <div style={{ fontSize: '11.5px', color: '#9ca3af', padding: '16px 0', textAlign: 'center', fontStyle: 'italic', margin: 'auto' }}>
              No customer bookings on this date.
            </div>
          ) : (
            bookings
              .filter(b => {
                const bDate = new Date(b.rawTimestamp);
                return bDate.getDate() === selectedCalendarDay && bDate.getMonth() === selectedCalendarMonth;
              })
              .slice(0, 3)
              .map(b => (
                <div
                  key={b.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10.5px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="fa-regular fa-clock" style={{ fontSize: '10px' }} />
                      <span>{new Date(b.rawTimestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {b.vehicleModel || b.driverName || b.vertical}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#111827', fontWeight: 600, marginTop: '2px' }}>
                      {b.personName} • {b.id}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: b.status === 'Completed' ? '#059669' : '#2563eb',
                    background: b.status === 'Completed' ? '#ecfdf5' : '#eff6ff',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {b.status}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
