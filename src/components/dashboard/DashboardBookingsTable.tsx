'use client';

import React from 'react';
import { UnifiedBooking, ServiceDomain, BookingStatus } from '../BusinessOperationsDashboard';

interface DashboardBookingsTableProps {
  filteredBookings: UnifiedBooking[];
  loading: boolean;
  selectedVertical: 'All' | ServiceDomain;
  setSelectedVertical: (v: 'All' | ServiceDomain) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  handleStatusChange: (id: string, newStatus: BookingStatus, domain: ServiceDomain) => void;
}

export default function DashboardBookingsTable({
  filteredBookings,
  loading,
  selectedVertical,
  setSelectedVertical,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  handleStatusChange
}: DashboardBookingsTableProps) {
  return (
    <div style={{ background: '#ffffff', borderRadius: '18px', padding: '22px 24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Live Customer Bookings &amp; Schedule Log
          </h3>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#c2410c', background: '#ffedd5', padding: '2px 7px', borderRadius: '5px' }}>
            LIVE DISPATCH
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Vertical Filter Buttons */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px' }}>
            {(['All', 'Rentals', 'Carriers', 'Drivers', 'Parkings'] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setSelectedVertical(v)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: selectedVertical === v ? '#ffffff' : 'transparent',
                  color: selectedVertical === v ? '#0f172a' : '#64748b',
                  boxShadow: selectedVertical === v ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '200px' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '10px', top: '9px', color: '#9ca3af', fontSize: '11px' }} />
            <input
              type="text"
              placeholder="Search Customer, Vehicle..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 28px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '11.5px',
                outline: 'none'
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '11.5px',
              fontWeight: 500,
              color: '#374151',
              background: '#ffffff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Running">Running</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Dynamic Table displaying exact fields per vertical */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', color: '#6b7280', fontSize: '11px' }}>
              <th style={{ padding: '8px 8px', fontWeight: 600 }}>Vertical &amp; Model / Service</th>
              <th style={{ padding: '8px 8px', fontWeight: 600 }}>Person &amp; Contact</th>
              <th style={{ padding: '8px 8px', fontWeight: 600 }}>Specific Booking Details (Start/End/Loc)</th>
              <th style={{ padding: '8px 8px', fontWeight: 600 }}>Duration / Route</th>
              <th style={{ padding: '8px 8px', fontWeight: 600 }}>Total Amount</th>
              <th style={{ padding: '8px 8px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '8px 8px', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px 0', color: '#9ca3af' }}>
                  {loading ? 'Syncing live bookings across all 4 services...' : 'No active customer bookings found matching the selected vertical.'}
                </td>
              </tr>
            ) : (
              filteredBookings.slice(0, 3).map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  {/* Vertical & Vehicle Model */}
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: b.vertical === 'Carriers' ? '#16a34a' : b.vertical === 'Drivers' ? '#9333ea' : b.vertical === 'Parkings' ? '#ea580c' : '#2563eb',
                        color: '#ffffff',
                        fontSize: '10.5px',
                        fontWeight: 700
                      }}>
                        {b.vertical}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, color: '#111827' }}>
                          {b.vehicleModel || (b.vertical === 'Drivers' ? `Chauffeur: ${b.driverName}` : 'Service')}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#6b7280' }}>ID: {b.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Person Name & Mobile */}
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{b.personName}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{b.mobileNumber || '+91 98450 12890'}</div>
                  </td>

                  {/* Specific Booking Details per vertical */}
                  <td style={{ padding: '12px 8px' }}>
                    {b.vertical === 'Rentals' && (
                      <div>
                        <div style={{ color: '#111827', fontWeight: 500 }}>
                          <strong>Start:</strong> {b.startDateTime}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          <strong>End:</strong> {b.endDateTime}
                        </div>
                      </div>
                    )}

                    {b.vertical === 'Carriers' && (
                      <div>
                        <div style={{ color: '#111827', fontWeight: 500 }}>
                          <strong>From:</strong> {b.fromLocation}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          <strong>To:</strong> {b.toLocation}
                        </div>
                      </div>
                    )}

                    {b.vertical === 'Drivers' && (
                      <div>
                        <div style={{ color: '#111827', fontWeight: 500 }}>
                          <strong>Location:</strong> {b.location}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          <strong>Trip Way:</strong> {b.tripWay}
                        </div>
                      </div>
                    )}

                    {b.vertical === 'Parkings' && (
                      <div>
                        <div style={{ color: '#111827', fontWeight: 500 }}>
                          <strong>From:</strong> {b.fromTimeDate}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          <strong>To:</strong> {b.toTimeDate}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Duration / Route */}
                  <td style={{ padding: '12px 8px', color: '#374151', fontWeight: 500 }}>
                    {b.vertical === 'Rentals' && (
                      <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                        {b.duration}
                      </span>
                    )}
                    {b.vertical === 'Carriers' && 'Freight Delivery'}
                    {b.vertical === 'Drivers' && b.tripWay}
                    {b.vertical === 'Parkings' && 'Reserved Slot'}
                  </td>

                  {/* Total Amount Paid */}
                  <td style={{ padding: '12px 8px', fontWeight: 800, color: '#111827', fontSize: '13px' }}>
                    ₹{b.totalAmount.toLocaleString('en-IN')}
                  </td>

                  {/* Status Dropdown / Badge */}
                  <td style={{ padding: '12px 8px' }}>
                    <select
                      value={b.status}
                      onChange={e => handleStatusChange(b.id, e.target.value as BookingStatus, b.vertical)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        outline: 'none',
                        border: b.status === 'Completed' ? '1px solid #a7f3d0' : b.status === 'Scheduled' ? '1px solid #fed7aa' : '1px solid #bfdbfe',
                        background: b.status === 'Completed' ? '#ecfdf5' : b.status === 'Scheduled' ? '#fff7ed' : '#eff6ff',
                        color: b.status === 'Completed' ? '#059669' : b.status === 'Scheduled' ? '#c2410c' : '#2563eb'
                      }}
                    >
                      <option value="Running">Running</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  {/* Action Button */}
                  <td style={{ padding: '12px 8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (b.status === 'Scheduled') {
                          handleStatusChange(b.id, 'Running', b.vertical);
                        } else if (b.status === 'Running') {
                          handleStatusChange(b.id, 'Completed', b.vertical);
                        } else {
                          handleStatusChange(b.id, 'Running', b.vertical);
                        }
                      }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: b.status === 'Scheduled' ? '#ea580c' : b.status === 'Completed' ? '#ecfdf5' : '#ffffff',
                        color: b.status === 'Scheduled' ? '#ffffff' : b.status === 'Completed' ? '#059669' : '#059669',
                        border: b.status === 'Scheduled' ? 'none' : b.status === 'Completed' ? '1px solid #a7f3d0' : '1px solid #bbf7d0',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {b.status === 'Scheduled' ? 'Start Trip' : b.status === 'Completed' ? 'Fulfilled ✓' : 'Complete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
