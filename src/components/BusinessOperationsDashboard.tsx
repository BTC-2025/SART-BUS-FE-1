import React, { useState, useMemo, useEffect } from 'react';

// ============================================================================
// TYPES & EXACT INTERFACES PER VERTICAL
// ============================================================================
export type ServiceDomain = 'Rentals' | 'Carriers' | 'Drivers' | 'Parkings';
export type BookingStatus = 'Running' | 'Scheduled' | 'Completed' | 'Pending';

export interface UnifiedBooking {
  id: string;
  vertical: ServiceDomain;
  status: BookingStatus;
  totalAmount: number;
  createdAt: string;
  rawTimestamp: number;

  // Common customer & vehicle attributes
  personName: string;
  mobileNumber?: string;
  vehicleModel?: string;

  // Rentals specific
  startDateTime?: string;
  endDateTime?: string;
  duration?: string; // e.g. 3 Days / 72 Hrs

  // Carriers specific
  fromLocation?: string;
  toLocation?: string;

  // Drivers specific
  driverName?: string;
  location?: string;
  tripWay?: string; // One-Way, Round Trip, Hourly, Outstation

  // Parkings specific
  fromTimeDate?: string; // Entry / Check-in
  toTimeDate?: string;   // Exit / Check-out
}

interface BusinessOperationsDashboardProps {
  partnerDetails?: any;
  onNavigate?: (tab: string, slug?: string) => void;
}

// Helper: Auto-calculate duration between two dates/times
function calculateDuration(start?: string, end?: string): string {
  if (!start || !end) return '1 Day (24 Hrs)';
  try {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (isNaN(s) || isNaN(e) || e <= s) return '1 Day (24 Hrs)';
    const diffHours = Math.round((e - s) / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours} Hours`;
    const days = Math.round(diffHours / 24);
    return `${days} Day${days > 1 ? 's' : ''} (${diffHours} Hrs)`;
  } catch (err) {
    return '1 Day (24 Hrs)';
  }
}

export default function BusinessOperationsDashboard({
  partnerDetails,
  onNavigate
}: BusinessOperationsDashboardProps) {
  // Step 2: Initialize bookings as an empty array (no hardcoded records)
  const [bookings, setBookings] = useState<UnifiedBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<'All' | ServiceDomain>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');

  const today = new Date();
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(today.getDate());
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState<number>(today.getMonth());
  const [selectedCalendarYear, setSelectedCalendarYear] = useState<number>(today.getFullYear());

  // ==========================================================================
  // STEP 2: FETCH ALL 4 APIS IN PARALLEL USING Promise.allSettled
  // ==========================================================================
  const fetchAllVerticalsConcurrently = async (silent: boolean = false) => {
    if (!silent && bookings.length === 0) setLoading(true);

    try {
      const endpoints = [
        // 1. Rentals
        fetch('http://localhost:5000/api/rental/bookings', { cache: 'no-store' })
          .catch(() => fetch('http://localhost:3005/api/rental/bookings', { cache: 'no-store' })),
        // 2. Carriers
        fetch('http://localhost:5000/api/carriers/bookings', { cache: 'no-store' })
          .catch(() => fetch('http://localhost:3005/api/carriers/bookings', { cache: 'no-store' })),
        // 3. Drivers
        fetch('http://localhost:5000/api/drivers', { cache: 'no-store' })
          .catch(() => fetch('http://localhost:3005/api/drivers', { cache: 'no-store' })),
        // 4. Parkings
        fetch('http://localhost:5000/api/parking/spots', { cache: 'no-store' })
          .catch(() => fetch('http://localhost:3005/api/parking/spots', { cache: 'no-store' }))
      ];

      const results = await Promise.allSettled(endpoints);
      const unifiedList: UnifiedBooking[] = [];
      const dummyIdRegex = /^(RN-8801|RN-8802|RN-8803|DR-4401|DR-4402|PK-3301|PK-3302|CR-7701|CR-7702)$/;

      // ----------------------------------------------------------------------
      // 1. Parse Rentals
      // ----------------------------------------------------------------------
      if (results[0].status === 'fulfilled' && results[0].value?.ok) {
        try {
          const json = await results[0].value.json();
          const items = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
          items.forEach((item: any) => {
            const bId = item.bookingId || item.id;
            if (!bId || dummyIdRegex.test(bId)) return;

            const created = item.createdAt || item.pickupDate || new Date().toISOString();
            const rawTime = new Date(created).getTime();
            const start = item.pickupDate ? `${item.pickupDate} ${item.pickupTime || '10:00 AM'}` : 'Today, 10:00 AM';
            const end = item.returnDate ? `${item.returnDate} ${item.returnTime || '10:00 AM'}` : 'Tomorrow, 10:00 AM';
            const dur = item.durationPlan || calculateDuration(start, end);

            unifiedList.push({
              id: bId,
              vertical: 'Rentals',
              vehicleModel: item.vehicleName || item.vehicleSpecs || 'Tata Nexon XZ+',
              personName: item.customerName || 'Customer',
              mobileNumber: item.customerPhone || item.phone || '+91 98450 12890',
              startDateTime: start,
              endDateTime: end,
              duration: dur,
              totalAmount: Number(item.totalAmount || item.totalPrice || item.price || 1800),
              status: item.status === 'Completed' ? 'Completed' : (item.status === 'Running' || item.status === 'Active' ? 'Running' : 'Scheduled'),
              createdAt: created,
              rawTimestamp: rawTime
            });
          });
        } catch (e) { }
      }

      // ----------------------------------------------------------------------
      // 2. Parse Carriers
      // ----------------------------------------------------------------------
      if (results[1].status === 'fulfilled' && results[1].value?.ok) {
        try {
          const json = await results[1].value.json();
          const items = Array.isArray(json) ? json : (json.data || json.bookings || []);
          items.forEach((item: any) => {
            const bId = item.bookingId || item.id;
            if (!bId || dummyIdRegex.test(bId)) return;

            const created = item.createdAt || new Date().toISOString();
            const rawTime = new Date(created).getTime();

            unifiedList.push({
              id: bId,
              vertical: 'Carriers',
              vehicleModel: item.carrierName || item.vehicleName || 'TVS King Cargo 3-Wheeler',
              personName: item.customerName || 'Sender',
              mobileNumber: item.customerPhone || item.phone || '+91 98234 99120',
              fromLocation: item.pickupLocation || item.pickupHub || 'Katpadi Warehouse Hub',
              toLocation: item.deliveryLocation || item.dropLocation || item.destination || 'Ranipet Delivery Point',
              totalAmount: Number(item.totalPrice || item.totalAmount || item.price || 2500),
              status: item.status === 'Completed' || item.status === 'Delivered' ? 'Completed' : 'Running',
              createdAt: created,
              rawTimestamp: rawTime
            });
          });
        } catch (e) { }
      }

      // ----------------------------------------------------------------------
      // 3. Parse Drivers
      // ----------------------------------------------------------------------
      if (results[2].status === 'fulfilled' && results[2].value?.ok) {
        try {
          const json = await results[2].value.json();
          const drivers = json.data || json.drivers || [];
          drivers.forEach((driver: any) => {
            const b = driver.bookingDetails || driver.activeBooking;
            if (b) {
              const bId = b.bookingId || b.id || `DR-${driver.id}`;
              if (dummyIdRegex.test(bId)) return;

              const created = b.createdAt || new Date().toISOString();
              const rawTime = new Date(created).getTime();

              unifiedList.push({
                id: bId,
                vertical: 'Drivers',
                driverName: driver.name || 'Mahesh Kumar',
                personName: b.customerName || 'Customer',
                mobileNumber: b.customerPhone || b.phone || '+91 99011 88722',
                location: b.pickupLocation || 'Vellore Town Center',
                tripWay: b.serviceType || b.tripType || 'One-Way',
                totalAmount: Number(b.totalFare || b.fare || b.amount || 1200),
                status: 'Running',
                createdAt: created,
                rawTimestamp: rawTime
              });
            }
          });
        } catch (e) { }
      }

      // ----------------------------------------------------------------------
      // 4. Parse Parkings
      // ----------------------------------------------------------------------
      if (results[3].status === 'fulfilled' && results[3].value?.ok) {
        try {
          const json = await results[3].value.json();
          const spots = json.data || json.spots || [];
          spots.forEach((spot: any) => {
            const b = spot.bookingDetails || spot.activeBooking;
            if (b) {
              const bId = b.bookingId || b.id || `PK-${spot.id}`;
              if (dummyIdRegex.test(bId)) return;

              const created = b.createdAt || new Date().toISOString();
              const rawTime = new Date(created).getTime();
              const fromTD = `${b.bookingDate || 'Today'} ${b.startTime || '10:00 AM'}`;
              const toTD = `${b.bookingDate || 'Today'} ${b.endTime || '02:00 PM'}`;

              unifiedList.push({
                id: bId,
                vertical: 'Parkings',
                personName: b.customerName || 'Customer',
                vehicleModel: b.vehicleModel || b.vehicleNumber || 'Honda City',
                mobileNumber: b.customerPhone || b.phone || '+91 98810 77312',
                fromTimeDate: fromTD,
                toTimeDate: toTD,
                totalAmount: Number(b.totalAmount || b.amount || spot.ratePerHour * 4 || 350),
                status: 'Running',
                createdAt: created,
                rawTimestamp: rawTime
              });
            }
          });
        } catch (e) { }
      }

      // Retrieve locally saved status overrides (e.g. when owner marks a booking Completed)
      let statusOverrides: Record<string, BookingStatus> = {};
      try {
        statusOverrides = JSON.parse(localStorage.getItem('sart_booking_status_overrides') || '{}');
      } catch (e) { }

      // ----------------------------------------------------------------------
      // 5. Check Notifications Endpoint (/api/business/notifications)
      //    Guarantees every notification also appears as an active booking on Dashboard
      // ----------------------------------------------------------------------
      try {
        const notifRes = await fetch('http://localhost:5000/api/business/notifications', { cache: 'no-store' })
          .catch(() => fetch('http://localhost:3005/api/business/notifications', { cache: 'no-store' }))
          .catch(() => null);

        if (notifRes && notifRes.ok) {
          const json = await notifRes.json();
          const notifs = json.data || (Array.isArray(json) ? json : []);
          const existingIds = new Set(unifiedList.map(x => x.id));

          notifs.forEach((n: any, idx: number) => {
            const bId = n.bookingId || n.id || `NOTIF-BK-${idx}`;
            if (dummyIdRegex.test(bId) || existingIds.has(bId)) return;

            const created = n.createdAt || new Date().toISOString();
            const rawTime = new Date(created).getTime();
            const vName: ServiceDomain =
              n.type === 'driver_booking' ? 'Drivers' :
              n.type === 'carrier_booking' ? 'Carriers' :
              n.type === 'parking_booking' ? 'Parkings' : 'Rentals';

            const effectiveStatus: BookingStatus = statusOverrides[bId] || (n.status === 'Completed' ? 'Completed' : 'Running');

            unifiedList.push({
              id: bId,
              vertical: vName,
              personName: n.customerName || 'Customer',
              mobileNumber: n.customerPhone || n.phone || '+91 98450 12890',
              vehicleModel: n.vehicleName || n.category || 'Rental Vehicle',
              startDateTime: `${n.date || 'Today'}, ${n.time || '10:00 AM'}`,
              endDateTime: 'Next Day, 10:00 AM',
              duration: '1 Day (24 Hrs)',
              fromLocation: n.fromLocation || 'Katpadi',
              toLocation: n.toLocation || 'Delivery Hub',
              driverName: n.vehicleName || 'Chauffeur Partner',
              location: n.location || 'Katpadi Hub',
              tripWay: 'One-Way',
              fromTimeDate: `${n.date || 'Today'} ${n.time || '10:00 AM'}`,
              toTimeDate: `${n.date || 'Today'} 04:00 PM`,
              totalAmount: Number(n.totalAmount || n.amount || (vName === 'Rentals' ? 1800 : vName === 'Carriers' ? 2500 : vName === 'Drivers' ? 1200 : 350)),
              status: effectiveStatus,
              createdAt: created,
              rawTimestamp: rawTime
            });
            existingIds.add(bId);
          });
        }
      } catch (e) { }

      // Check reactive local bookings store (excluding old dummy seeds)
      try {
        const rawLocal = localStorage.getItem('sart_business_bookings');
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          if (Array.isArray(parsed)) {
            const existingIds = new Set(unifiedList.map(x => x.id));
            parsed.forEach((item: any, idx: number) => {
              const bId = item.id || item.bookingId || `LOC-BK-${idx}`;
              if (!existingIds.has(bId) && !dummyIdRegex.test(bId)) {
                const created = item.createdAt || new Date().toISOString();
                const rawTime = new Date(created).getTime();
                const vName: ServiceDomain =
                  item.serviceType === 'drivers' || item.type === 'driver_booking' ? 'Drivers' :
                  item.serviceType === 'parking' || item.type === 'parking_booking' ? 'Parkings' :
                  item.serviceType === 'carriers' || item.type === 'carrier_booking' ? 'Carriers' : 'Rentals';

                const effectiveStatus: BookingStatus = statusOverrides[bId] || (item.status === 'Completed' ? 'Completed' : 'Running');

                unifiedList.push({
                  id: bId,
                  vertical: vName,
                  personName: item.customerName || 'Customer',
                  mobileNumber: item.customerPhone || item.phone || '+91 98450 12890',
                  vehicleModel: item.vehicleName || item.vehicleSpecs || item.vehicleModel || (item.category ? `${item.category} (${item.vehicleName || ''})` : 'Rental Vehicle'),
                  startDateTime: item.startDate || `${item.pickupDate || 'Today'}, ${item.pickupTime || '10:00 AM'}`,
                  endDateTime: item.endDate || `${item.returnDate || 'Tomorrow'}, ${item.returnTime || '10:00 AM'}`,
                  duration: item.duration || item.durationPlan || '1 Day (24 Hrs)',
                  fromLocation: item.pickupLocation || 'Katpadi',
                  toLocation: item.deliveryLocation || item.dropLocation || 'Delivery Hub',
                  driverName: item.driverName || 'Chauffeur Partner',
                  location: item.pickupLocation || 'City Center',
                  tripWay: item.tripWay || item.serviceType || 'One-Way',
                  fromTimeDate: item.fromTimeDate || 'Today 10:00 AM',
                  toTimeDate: item.toTimeDate || 'Today 04:00 PM',
                  totalAmount: Number(item.totalAmount || item.amount || 1800),
                  status: effectiveStatus,
                  createdAt: created,
                  rawTimestamp: rawTime
                });
                existingIds.add(bId);
              }
            });
          }
        }
      } catch (e) { }

      // Sort merged list by newest booking first
      unifiedList.sort((a, b) => b.rawTimestamp - a.rawTimestamp);
      setBookings(unifiedList);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Silent background refresh every 10 seconds without toggling setLoading(true)
  useEffect(() => {
    fetchAllVerticalsConcurrently(false);

    const interval = setInterval(() => {
      fetchAllVerticalsConcurrently(true);
    }, 10000);

    const handleVerticalFilter = (e: any) => {
      if (e.detail) setSelectedVertical(e.detail);
    };

    const handleStorage = () => fetchAllVerticalsConcurrently(true);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('rental_vehicle_booked', handleStorage);
    window.addEventListener('new_booking_created', handleStorage);
    window.addEventListener('parking_spot_booked', handleStorage);
    window.addEventListener('driver_booked', handleStorage);
    window.addEventListener('carrier_vehicle_booked', handleStorage);
    window.addEventListener('rental_trip_completed', handleStorage);
    window.addEventListener('filter_dashboard_vertical', handleVerticalFilter);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('rental_vehicle_booked', handleStorage);
      window.removeEventListener('new_booking_created', handleStorage);
      window.removeEventListener('parking_spot_booked', handleStorage);
      window.removeEventListener('driver_booked', handleStorage);
      window.removeEventListener('carrier_vehicle_booked', handleStorage);
      window.removeEventListener('rental_trip_completed', handleStorage);
      window.removeEventListener('filter_dashboard_vertical', handleVerticalFilter);
    };
  }, []);

  // ==========================================================================
  // STEP 3: AUTO-CALCULATE TODAY'S LIVE METRICS & VERTICAL TOTALS
  // ==========================================================================
  const totalOperations = bookings.length;
  const inProgressCount = bookings.filter(b => b.status === 'Running').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending' || b.status === 'Scheduled').length;

  const totalIncome = useMemo(() => {
    return bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  }, [bookings]);

  // Today's Date String (YYYY-MM-DD)
  const todayDateStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  // Today's Earnings and Count
  const { todayEarnings, bookedTodayCount } = useMemo(() => {
    let sum = 0;
    let count = 0;
    bookings.forEach(b => {
      const bDateStr = new Date(b.rawTimestamp).toISOString().split('T')[0];
      if (bDateStr === todayDateStr) {
        sum += b.totalAmount;
        count += 1;
      }
    });
    return { todayEarnings: sum, bookedTodayCount: count };
  }, [bookings, todayDateStr]);

  const totalExpenses = Math.round(totalIncome * 0.25);
  const netProfit = totalIncome - totalExpenses;

  // Vertical Totals & Percentages
  const verticalStats = useMemo(() => {
    const domains: ServiceDomain[] = ['Rentals', 'Carriers', 'Drivers', 'Parkings'];
    const stats: Record<ServiceDomain, { count: number; revenue: number; percentage: number }> = {
      Rentals: { count: 0, revenue: 0, percentage: 0 },
      Carriers: { count: 0, revenue: 0, percentage: 0 },
      Drivers: { count: 0, revenue: 0, percentage: 0 },
      Parkings: { count: 0, revenue: 0, percentage: 0 }
    };

    bookings.forEach(b => {
      if (stats[b.vertical]) {
        stats[b.vertical].count += 1;
        stats[b.vertical].revenue += b.totalAmount;
      }
    });

    domains.forEach(d => {
      stats[d].percentage = totalOperations > 0 ? Math.round((stats[d].count / totalOperations) * 100) : 0;
    });

    return stats;
  }, [bookings, totalOperations]);

  // ==========================================================================
  // STEP 4: DYNAMIC REVENUE GRAPH DATA (PER DAY / WEEK / MONTH)
  // ==========================================================================
  const graphData = useMemo(() => {
    if (timeframe === 'day') {
      // Last 7 calendar days
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayKey = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

        const dayTotal = bookings
          .filter(b => new Date(b.rawTimestamp).toISOString().split('T')[0] === dayKey)
          .reduce((sum, b) => sum + b.totalAmount, 0);

        days.push({
          label: dayLabel,
          income: dayTotal,
          profit: Math.round(dayTotal * 0.75)
        });
      }
      return days;
    } else if (timeframe === 'week') {
      // Last 4 seven-day buckets
      const weeks = [];
      for (let w = 3; w >= 0; w--) {
        const endDay = new Date();
        endDay.setDate(endDay.getDate() - (w * 7));
        const startDay = new Date();
        startDay.setDate(startDay.getDate() - ((w + 1) * 7));

        const weekTotal = bookings.filter(b => {
          const t = b.rawTimestamp;
          return t >= startDay.getTime() && t <= endDay.getTime();
        }).reduce((sum, b) => sum + b.totalAmount, 0);

        weeks.push({
          label: `Week ${4 - w}`,
          income: weekTotal,
          profit: Math.round(weekTotal * 0.75)
        });
      }
      return weeks;
    } else {
      // Last 6 months
      const months = [];
      for (let m = 5; m >= 0; m--) {
        const d = new Date();
        d.setMonth(d.getMonth() - m);
        const mIdx = d.getMonth();
        const yVal = d.getFullYear();
        const mLabel = d.toLocaleDateString('en-US', { month: 'short' });

        const mTotal = bookings.filter(b => {
          const bd = new Date(b.rawTimestamp);
          return bd.getMonth() === mIdx && bd.getFullYear() === yVal;
        }).reduce((sum, b) => sum + b.totalAmount, 0);

        months.push({
          label: mLabel,
          income: mTotal,
          profit: Math.round(mTotal * 0.75)
        });
      }
      return months;
    }
  }, [bookings, timeframe]);

  // SVG Line Chart plotting
  const maxVal = Math.max(...graphData.map(g => g.income), 8000);
  const yMax = Math.ceil(maxVal / 2000) * 2000 || 8000;
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const points = graphData.map((d, index) => {
    const x = paddingLeft + (index / (graphData.length - 1 || 1)) * plotWidth;
    const yInc = paddingTop + plotHeight - (d.income / yMax) * plotHeight;
    const yProf = paddingTop + plotHeight - (d.profit / yMax) * plotHeight;
    return { x, yInc, yProf, label: d.label, income: d.income, profit: d.profit };
  });

  const incomePointsStr = points.map(p => `${p.x},${p.yInc}`).join(' ');
  const profitPointsStr = points.map(p => `${p.x},${p.yProf}`).join(' ');

  // ==========================================================================
  // STEP 5: FILTERED BOOKINGS TABLE (SHOWING EXACT 3 RECENT ROWS)
  // ==========================================================================
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchVertical = selectedVertical === 'All' || b.vertical === selectedVertical;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        q === '' ||
        b.personName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (b.vehicleModel && b.vehicleModel.toLowerCase().includes(q)) ||
        (b.mobileNumber && b.mobileNumber.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'All Statuses' || b.status === statusFilter;
      return matchVertical && matchSearch && matchStatus;
    });
  }, [bookings, selectedVertical, searchQuery, statusFilter]);

  // Step 6: Wire Status Actions (Start Trip / Complete or Select)
  const handleStatusChange = async (id: string, nextStatus: BookingStatus, vertical: ServiceDomain) => {
    // 1. Immediately update in-memory state
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: nextStatus } : b))
    );

    // 2. Persist status override so it remains Completed/Running/Scheduled across re-renders & page navigation
    try {
      const overrides = JSON.parse(localStorage.getItem('sart_booking_status_overrides') || '{}');
      overrides[id] = nextStatus;
      localStorage.setItem('sart_booking_status_overrides', JSON.stringify(overrides));
    } catch (e) { }

    // 3. Update in sart_business_bookings
    try {
      const stored = localStorage.getItem('sart_business_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const updated = parsed.map((item: any) => {
            if (item.id === id || item.bookingId === id) {
              return { ...item, status: nextStatus };
            }
            return item;
          });
          localStorage.setItem('sart_business_bookings', JSON.stringify(updated));
        }
      }
    } catch (e) { }

    // 4. Update in backend API endpoints
    if (vertical === 'Rentals') {
      fetch(`http://localhost:5000/api/rental/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      }).catch(() => null);

      if (nextStatus === 'Completed') {
        fetch(`http://localhost:5000/api/rental/vehicles/${id}/complete-trip`, {
          method: 'POST'
        }).catch(() => null);
      }

      window.dispatchEvent(new CustomEvent('rental_trip_completed', { detail: { id, status: nextStatus } }));
    } else if (vertical === 'Carriers') {
      if (nextStatus === 'Completed') {
        fetch(`http://localhost:3005/api/carriers/bookings/${id}/complete`, { method: 'POST' }).catch(() => null);
      }
    } else if (vertical === 'Parkings') {
      fetch(`http://localhost:5000/api/parking/spots/${id}/booking`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: nextStatus === 'Completed', bookingDetails: nextStatus === 'Completed' ? null : undefined })
      }).catch(() => null);
    }
  };

  const handleStatusToggle = (id: string, currentStatus: BookingStatus, vertical: ServiceDomain) => {
    const nextStatus: BookingStatus = currentStatus === 'Running' ? 'Completed' : 'Running';
    handleStatusChange(id, nextStatus, vertical);
  };

  return (
    <div style={{ padding: '24px 32px', background: '#ffffff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* =========================================================================
          SECTION 1: HEADER
         ========================================================================= */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.3px' }}>
            Business Operations Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Live overview of customer bookings, dispatches &amp; revenue
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Real-time Sync pill */}
          <div
            onClick={() => fetchAllVerticalsConcurrently(false)}
            title="Click to refresh live bookings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              padding: '7px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#374151',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              cursor: 'pointer'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span>Real-time Sync ({totalOperations})</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#9ca3af' }} />
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 4 PASTEL KPI CARDS (Step 3: Live counts & exact earnings)
         ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        {/* Total Operations */}
        <div style={{
          background: '#fff7ed',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #ffedd5',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '112px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#4b5563' }}>Total Operations</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ea580c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-file-lines" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{totalOperations}</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a', marginTop: '6px' }}>
              +₹{totalIncome.toLocaleString('en-IN')} earned
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div style={{
          background: '#eff6ff',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #dbeafe',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '112px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#4b5563' }}>In Progress</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-calendar-days" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{inProgressCount}</div>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginTop: '6px' }}>
              {inProgressCount} Active Dispatches
            </div>
          </div>
        </div>

        {/* Completed */}
        <div style={{
          background: '#f0fdf4',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #dcfce7',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '112px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#4b5563' }}>Completed</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-arrow-trend-up" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{completedCount}</div>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginTop: '6px' }}>
              {completedCount} Fulfilled
            </div>
          </div>
        </div>

        {/* Pending / Action */}
        <div style={{
          background: '#faf5ff',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #f3e8ff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '112px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#4b5563' }}>Pending / Action</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#9333ea', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-user-group" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{pendingCount}</div>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginTop: '6px' }}>
              {pendingCount} Awaiting
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: REVENUE OVERVIEW (STEP 4) & RECENT DISPATCHES
         ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Left Card: Revenue Overview */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '22px 24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Revenue Overview</h2>
                
                {/* Step 4: Timeframe Toggle */}
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px' }}>
                  {(['day', 'week', 'month'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTimeframe(tab)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: timeframe === tab ? '#ffffff' : 'transparent',
                        color: timeframe === tab ? '#0f172a' : '#64748b',
                        boxShadow: timeframe === tab ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab === 'day' ? 'Per Day (7D)' : tab === 'week' ? 'Week (4W)' : 'Month (6M)'}
                    </button>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                {timeframe === 'day' ? 'Daily Financial Performance (Last 7 Days)' : timeframe === 'week' ? 'Weekly Financial Performance' : 'Monthly Financial Performance'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }} />
                Income (₹{totalIncome.toLocaleString('en-IN')})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                Net Profit (₹{netProfit.toLocaleString('en-IN')})
              </span>
            </div>
          </div>

          {/* SVG Line Graph */}
          <div style={{ width: '100%', height: '220px' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                const y = paddingTop + plotHeight * (1 - pct);
                const val = Math.round(yMax * pct);
                const label = val >= 1000 ? `${val / 1000}k` : `${val}`;
                return (
                  <g key={i}>
                    <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#9ca3af">
                      {label}
                    </text>
                  </g>
                );
              })}

              {points.map((p, i) => (
                <line
                  key={`vline-${i}`}
                  x1={p.x}
                  y1={paddingTop}
                  x2={p.x}
                  y2={paddingTop + plotHeight}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}

              <line
                x1={paddingLeft}
                y1={paddingTop + plotHeight}
                x2={svgWidth - paddingRight}
                y2={paddingTop + plotHeight}
                stroke="#e5e7eb"
                strokeWidth="1"
              />

              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points={profitPointsStr}
              />

              <polyline
                fill="none"
                stroke="#ea580c"
                strokeWidth="2.5"
                points={incomePointsStr}
              />

              {points.map((p, i) => (
                <circle
                  key={`p-prof-${i}`}
                  cx={p.x}
                  cy={p.yProf}
                  r="4"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}

              {points.map((p, i) => (
                <circle
                  key={`p-inc-${i}`}
                  cx={p.x}
                  cy={p.yInc}
                  r="4.5"
                  fill="#ea580c"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}

              {points.map((p, i) => (
                <text
                  key={`t-${i}`}
                  x={p.x}
                  y={paddingTop + plotHeight + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {p.label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Card: Schedule Calendar */}
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
      </div>

      {/* =========================================================================
          SECTION 4: ALL OPERATIONS, ORDERS ANALYTICS, EARNINGS (VERTICAL SPLITS)
         ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {/* Vertical Totals & Breakdown */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '22px 24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>All Operations</h3>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '9999px' }}>Live</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 20px 0' }}>Fleet &amp; Bookings by Vertical</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                <span>Rentals ({verticalStats.Rentals.count})</span>
                <span style={{ color: '#2563eb', fontWeight: 700 }}>{verticalStats.Rentals.percentage}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${verticalStats.Rentals.percentage}%`, height: '100%', background: '#2563eb', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                <span>Carriers ({verticalStats.Carriers.count})</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>{verticalStats.Carriers.percentage}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${verticalStats.Carriers.percentage}%`, height: '100%', background: '#16a34a', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                <span>Drivers ({verticalStats.Drivers.count})</span>
                <span style={{ color: '#9333ea', fontWeight: 700 }}>{verticalStats.Drivers.percentage}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${verticalStats.Drivers.percentage}%`, height: '100%', background: '#9333ea', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                <span>Parkings ({verticalStats.Parkings.count})</span>
                <span style={{ color: '#ea580c', fontWeight: 700 }}>{verticalStats.Parkings.percentage}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${verticalStats.Parkings.percentage}%`, height: '100%', background: '#ea580c', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Orders Analytics with Today's Live Volume & Count */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '22px 24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 3px 0' }}>Orders Analytics</h3>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 14px 0' }}>Daily Booking Velocity &amp; Channels</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: 500, marginBottom: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4b5563' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ea580c' }} /> Online Bookings
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4b5563' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }} /> Offline Dispatches
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '90px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
              {['Jan', 'Feb', 'Nov', 'Dec'].map((m, i) => (
                <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
                    <div style={{ width: '12px', height: `${20 + i * 10}px`, background: '#3b82f6', borderRadius: '3px' }} />
                    <div style={{ width: '12px', height: `${30 + i * 15}px`, background: '#ea580c', borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#9ca3af' }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Exact Earnings & Count */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff7ed', padding: '8px 12px', borderRadius: '8px', marginTop: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#c2410c' }}>
              Today: ₹{todayEarnings.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '11px', color: '#9a3412', fontWeight: 600 }}>
              {bookedTodayCount} Booked Today
            </span>
          </div>
        </div>

        {/* Earnings Split */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '22px 24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 3px 0' }}>Earnings</h3>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px 0' }}>Total Revenue Across Verticals</p>
          </div>

          <div style={{ position: 'relative', width: '140px', height: '140px' }}>
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f3f4f6" strokeWidth="13" />
              {/* Rentals */}
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#2563eb" strokeWidth="13" strokeDasharray={`${(verticalStats.Rentals.percentage * 238) / 100} 238`} strokeDashoffset="0" />
              {/* Carriers */}
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#16a34a" strokeWidth="13" strokeDasharray={`${(verticalStats.Carriers.percentage * 238) / 100} 238`} strokeDashoffset={`-${(verticalStats.Rentals.percentage * 238) / 100}`} />
              {/* Drivers */}
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#9333ea" strokeWidth="13" strokeDasharray={`${(verticalStats.Drivers.percentage * 238) / 100} 238`} strokeDashoffset={`-${((verticalStats.Rentals.percentage + verticalStats.Carriers.percentage) * 238) / 100}`} />
              {/* Parkings */}
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ea580c" strokeWidth="13" strokeDasharray={`${(verticalStats.Parkings.percentage * 238) / 100} 238`} strokeDashoffset={`-${((verticalStats.Rentals.percentage + verticalStats.Carriers.percentage + verticalStats.Drivers.percentage) * 238) / 100}`} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>₹{totalIncome.toLocaleString('en-IN')}</span>
              <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 500 }}>{totalOperations} Bookings</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10.5px', fontWeight: 600, marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#2563eb' }}>Rentals</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#16a34a' }}>Carriers</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#9333ea' }}>Drivers</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#ea580c' }}>Parkings</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 5: LIVE CUSTOMER BOOKINGS TABLE (STEP 5: EXACT REQUIRED FIELDS)
         ========================================================================= */}
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
            {/* Step 5: Vertical Filter Buttons (All | Rentals | Carriers | Drivers | Parkings) */}
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

                    {/* Step 6: Action Button */}
                    <td style={{ padding: '12px 8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (b.status === 'Scheduled') {
                            handleStatusChange(b.id, 'Running', b.vertical);
                          } else if (b.status === 'Running') {
                            handleStatusChange(b.id, 'Completed', b.vertical);
                          } else {
                            // If completed, click can re-open to Running if needed
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
    </div>
  );
}
