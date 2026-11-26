import React, { useState, useEffect, useMemo } from 'react';
import './ParkingSlot.css';
import './MotorsMarketplace.css';
import './rentalVehicles/rentalVehicles.css';
import './rentalVehicles/OwnerVehicleGrid.css';
import RentalFilterSidebar from './rentalVehicles/RentalFilterSidebar';
import ParkingFilterSidebar from './ParkingFilterSidebar';
import OwnerVehicleGrid from './rentalVehicles/OwnerVehicleGrid';
import EditVehicleModal from './rentalVehicles/EditVehicleModal';
import ParkingAddNewSpot from './ParkingAddNewSpot';

const ParkingAddNewSpotComponent: any = ParkingAddNewSpot;
const OwnerVehicleGridComponent: any = OwnerVehicleGrid;

// Starting parking fleet is empty so ONLY vehicles/yards added by the owner appear
export const INITIAL_PARKING_FLEET: any[] = [];

// Specific Parking Categories requested by the user:
// 1. All Fleet
// 2. 8 or 10 Wheeler Trucks or more
// 3. 2-Wheeler (Bikes)
// 4. 4-Wheeler (Cars)
export const PARKING_CATEGORIES = [
  { id: 'All', label: 'All Fleet', icon: 'fa-table-cells' },
  { id: 'Trucks', label: '8 or 10 Wheeler Trucks or more', icon: 'fa-truck' },
  { id: '2-Wheeler', label: '2-Wheeler (Bikes)', icon: 'fa-motorcycle' },
  { id: '4-Wheeler', label: '4-Wheeler (Cars)', icon: 'fa-car' }
];

// List of mock vehicle names & IDs to clean up from any previous sessions
const MOCK_VEHICLE_NAMES_OR_IDS = [
  'TOYOTA ALPHARD XZ+',
  'HONDA 2-WHEELERS SHINE 125 XZ+',
  'TVS',
  'PRK-VH-001',
  'PRK-VH-002',
  'PRK-VH-003',
  'TN 23 BV 9735',
  'TN 23 ME 1053',
  'TN 23 VW 8415'
];

export default function ParkingSlot({
  partnerDetails,
  onNavigate = () => { },
  urlSubPath = null
}: any) {
  const [fleetList, setFleetList] = useState<any[]>([]);

  // Fetch parking fleet strictly from backend API on mount
  useEffect(() => {
    const fetchFromBackend = async () => {
      try {
        let storedBookings: any[] = [];
        try {
          const raw = localStorage.getItem('sart_business_bookings');
          if (raw) storedBookings = JSON.parse(raw);
        } catch (e) { }

        const res = await fetch('http://localhost:5000/api/parking/spots');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const mapped = json.data.map((item: any) => {
              let activeBooking = item.bookingDetails || item.activeBooking || null;
              if (typeof activeBooking === 'string') {
                try {
                  activeBooking = JSON.parse(activeBooking);
                } catch (e) { }
              }
              if (!activeBooking) {
                try {
                  const localBookingStr = localStorage.getItem(`parking_booking_${item.id}`);
                  if (localBookingStr) {
                    activeBooking = JSON.parse(localBookingStr);
                  }
                } catch (e) { }
              }
              if (!activeBooking && Array.isArray(storedBookings)) {
                const match = storedBookings.find(b =>
                  b.type === 'parking_booking' &&
                  (b.spotId === item.id || b.vehicleName?.toLowerCase().includes((item.spotName || item.name || '').toLowerCase()))
                );
                if (match) {
                  activeBooking = {
                    bookingId: match.id,
                    customerName: match.customerName,
                    customerPhone: match.customerPhone,
                    vehicleNumber: match.vehicleNumber,
                    vehicleModel: match.vehicleModel,
                    startTime: match.startTime,
                    endTime: match.endTime,
                    bookingDate: match.date,
                    totalAmount: match.totalAmount,
                    otp: match.otp || '748921'
                  };
                }
              }

              const isSpotBooked = Boolean(activeBooking);

              return {
                id: item.id,
                name: item.spotName || item.name || '',
                type: item.vehicleTypes?.twoWheeler?.enabled ? 'bike' : item.vehicleTypes?.heavyVehicle?.enabled ? 'truck' : 'car',
                category: item.vehicleTypes?.heavyVehicle?.enabled ? 'Trucks' : item.vehicleTypes?.twoWheeler?.enabled ? '2-Wheeler' : '4-Wheeler',
                brand: item.spaceType || item.category || 'Open Yard',
                model: item.pincodePlace || item.locality || item.city || 'Gurugram',
                plate: `PLOT ${item.doorNo || '14-B'}`,
                location: item.address || `${item.doorNo ? item.doorNo + ', ' : ''}${item.streetName ? item.streetName + ', ' : ''}${item.locality ? item.locality + ', ' : ''}${item.city}, ${item.state} - ${item.pincode || ''}`.replace(/^,\s*/, ''),
                city: item.city || 'Gurugram',
                locality: item.locality || '',
                pincodePlace: item.pincodePlace || item.locality || item.city,
                locationName: item.pincodePlace || item.locality || item.city,
                image: item.coverPhoto || item.image || (Array.isArray(item.photos) && item.photos[0]?.url) || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
                pricing: { hourly: item.minHourlyRate || item.hourlyRate || 20, daily: item.dailyRate || 150, monthly: item.monthlyRate || 2500 },
                pricingText: item.pricingText || `₹${item.minHourlyRate || item.hourlyRate || 20}/hr`,
                hourlyRate: item.minHourlyRate || item.hourlyRate || 20,
                dailyRate: item.dailyRate || 150,
                monthlyRate: item.monthlyRate || 2500,
                isAvailable: !isSpotBooked && item.isAvailable !== 0,
                bookingStatus: isSpotBooked ? 'ALREADY_BOOKED' : 'AVAILABLE',
                bookingDetails: activeBooking,
                activeBooking: activeBooking,
                yardData: {
                  ...item,
                  spotName: item.spotName || item.name,
                  spaceType: item.spaceType || item.category,
                  vehicleTypes: item.vehicleTypes
                }
              };
            });
            setFleetList(mapped);
            return;
          }
        }
        setFleetList([]);
      } catch (err) {
        // Backend stopped -> show empty list
        setFleetList([]);
      }
    };

    fetchFromBackend();
    const interval = setInterval(fetchFromBackend, 4000);
    const onStorage = () => fetchFromBackend();
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const [activeSideFilters, setActiveSideFilters] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sync to local state and backend
  const syncFleet = (updated: any[]) => {
    setFleetList(updated);
  };

  // Extract unique locations from added parking spots/vehicles
  // Only shows 'All Locations' plus the specific place/locality/city names of added spots
  // If multiple spots have the same name, deduplicate so it appears only once.
  const dynamicLocationPills = useMemo(() => {
    const locSet = new Set<string>();
    fleetList.forEach(item => {
      const name = item.pincodePlace || item.locality || item.city || item.locationName;
      if (name && name.trim() && name !== 'All' && name !== 'All Locations') {
        locSet.add(name.trim());
      }
    });
    return ['All', ...Array.from(locSet)];
  }, [fleetList]);

  // Add new vehicle / yard from ParkingAddNewSpot wizard
  const handleAddNewSpot = (data: any) => {
    const minRate = Math.min(
      ...Object.values(data.vehicleTypes || {})
        .filter((v: any) => v.enabled)
        .map((v: any) => Number(v.hourlyRate) || 150)
    ) || 150;

    const dailyRate = Math.min(
      ...Object.values(data.vehicleTypes || {})
        .filter((v: any) => v.enabled)
        .map((v: any) => Number(v.dailyRate) || 1500)
    ) || 1500;

    const monthlyRate = Math.min(
      ...Object.values(data.vehicleTypes || {})
        .filter((v: any) => v.enabled)
        .map((v: any) => Number(v.monthlyRate) || 25000)
    ) || 25000;

    const coverPhoto = data.photos?.find((p: any) => p.isCover && p.url)?.url ||
      data.photos?.find((p: any) => Boolean(p.url))?.url ||
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';

    // Determine category based on vehicle types enabled
    let determinedCategory = '4-Wheeler';
    let determinedType = 'car';
    if (data.vehicleTypes?.heavyVehicle?.enabled) {
      determinedCategory = 'Trucks';
      determinedType = 'truck';
    } else if (data.vehicleTypes?.fourWheeler?.enabled) {
      determinedCategory = '4-Wheeler';
      determinedType = 'car';
    } else if (data.vehicleTypes?.twoWheeler?.enabled) {
      determinedCategory = '2-Wheeler';
      determinedType = 'bike';
    }

    // Place name beside pincode / locality
    const placeBesidePincode = data.pincodePlace || data.locality || data.city || 'Gurugram';

    const newVehicle = {
      id: 'PRK-' + Date.now(),
      name: data.spotName || 'Commercial Parking Yard',
      type: determinedType,
      category: determinedCategory,
      brand: data.spaceType || 'Commercial Yard',
      model: placeBesidePincode,
      plate: `PLOT ${data.doorNo || '14-B'}`,
      location: `${data.streetName || ''}, ${data.locality || ''}, ${data.city || 'Gurugram'}, ${data.state || ''} - ${data.pincode || ''}`.replace(/^,\s*/, ''),
      city: data.city || 'Gurugram',
      locality: data.locality || '',
      pincodePlace: placeBesidePincode,
      locationName: placeBesidePincode,
      image: coverPhoto,
      pricing: { hourly: minRate, daily: dailyRate, monthly: monthlyRate },
      pricingText: `₹${minRate}/hr | ₹${dailyRate.toLocaleString()}/day | ₹${monthlyRate.toLocaleString()}/month`,
      hourlyRate: minRate,
      dailyRate: dailyRate,
      monthlyRate: monthlyRate,
      transmission: 'Automatic',
      fuel: 'Petrol / EV',
      seats: 'Multi-Bay',
      isAvailable: true,
      status: 'Available',
      bookingStatus: 'READY_FOR_BOOKING',
      rating: 4.9,
      yardData: data
    };

    const updated = [newVehicle, ...fleetList];
    syncFleet(updated);

    // Also persist directly to both backend APIs (port 5000 Express & port 3005 Next.js)
    try {
      const spotPayload = {
        id: newVehicle.id,
        spotName: newVehicle.name,
        name: newVehicle.name,
        partnerId: partnerDetails?.id || 'partner_1',
        ownerName: partnerDetails?.name || data.ownerName || 'SART Parking Partner',
        primaryMobile: data.primaryMobile || '',
        altMobile: data.altMobile || '',
        spaceType: data.spaceType || 'Open Yard',
        doorNo: data.doorNo || '',
        streetName: data.streetName || '',
        locality: data.locality || '',
        city: newVehicle.city,
        state: data.state || 'Haryana',
        pincode: data.pincode || '',
        pincodePlace: placeBesidePincode,
        landmark: data.landmark || '',
        lat: data.coordinates?.lat || 28.4595,
        lng: data.coordinates?.lng || 77.0266,
        minHourlyRate: minRate,
        hourlyRate: minRate,
        dailyRate: dailyRate,
        monthlyRate: monthlyRate,
        pricingText: newVehicle.pricingText,
        photos: data.photos || [],
        coverPhoto: coverPhoto,
        image: coverPhoto,
        vehicleTypes: data.vehicleTypes || {},
        securityFeatures: data.securityFeatures || data.features || [],
        operatingHours: data.operatingHours || '24/7 Open',
        gateInstructions: data.gateInstructions || 'Direct entry from main road.',
        bookingMode: data.bookingMode || 'Instant Booking',
        cancellationPolicy: data.cancellationPolicy || 'Free up to 1 hr before'
      };

      Promise.allSettled([
        fetch('http://localhost:5000/api/parking/spots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(spotPayload)
        }),
        fetch('http://localhost:3005/api/parking/spots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(spotPayload)
        })
      ]).catch(err => console.warn('Backend parking spot sync error:', err));
    } catch (e) { }
  };

  // Availability toggle
  const toggleAvailability = (id: string) => {
    const updated = fleetList.map(v => v.id === id ? { ...v, isAvailable: !v.isAvailable, status: !v.isAvailable ? 'Available' : 'On Trip' } : v);
    syncFleet(updated);
  };

  // Delete vehicle / parking yard
  const handleDeleteVehicle = async (id: string) => {
    const updated = fleetList.filter(v => v.id !== id);
    syncFleet(updated);

    try {
      await fetch(`http://localhost:5000/api/parking/spots/${id}`, {
        method: 'DELETE'
      });
      // Also notify port 3005 if running
      fetch(`http://localhost:3005/api/parking/spots/${id}`, {
        method: 'DELETE'
      }).catch(() => {});
    } catch (err) {
      console.warn('Failed to delete parking spot on backend:', err);
    }
  };

  // Update vehicle via Edit modal or full wizard
  const handleUpdateVehicle = (updatedData: any) => {
    const targetId = editingVehicle?.id;
    if (!targetId) return;

    // Check if this came from the full ParkingAddNewSpot form
    if (updatedData.spotName || updatedData.vehicleTypes) {
      const minRate = Math.min(
        ...Object.values(updatedData.vehicleTypes || {})
          .filter((v: any) => v.enabled)
          .map((v: any) => Number(v.hourlyRate) || 20)
      ) || 20;

      const dailyRate = Math.min(
        ...Object.values(updatedData.vehicleTypes || {})
          .filter((v: any) => v.enabled)
          .map((v: any) => Number(v.dailyRate) || 150)
      ) || 150;

      const monthlyRate = Math.min(
        ...Object.values(updatedData.vehicleTypes || {})
          .filter((v: any) => v.enabled)
          .map((v: any) => Number(v.monthlyRate) || 2500)
      ) || 2500;

      const coverPhoto = updatedData.photos?.find((p: any) => p.isCover && p.url)?.url ||
        updatedData.photos?.find((p: any) => Boolean(p.url))?.url ||
        editingVehicle.image ||
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';

      let determinedCategory = '4-Wheeler';
      let determinedType = 'car';
      if (updatedData.vehicleTypes?.heavyVehicle?.enabled) {
        determinedCategory = 'Trucks';
        determinedType = 'truck';
      } else if (updatedData.vehicleTypes?.fourWheeler?.enabled) {
        determinedCategory = '4-Wheeler';
        determinedType = 'car';
      } else if (updatedData.vehicleTypes?.twoWheeler?.enabled) {
        determinedCategory = '2-Wheeler';
        determinedType = 'bike';
      }

      const placeBesidePincode = updatedData.pincodePlace || updatedData.locality || updatedData.city || editingVehicle.pincodePlace || 'Gurugram';

      const updated = fleetList.map(v => {
        if (v.id === targetId) {
          return {
            ...v,
            name: updatedData.spotName || v.name,
            type: determinedType,
            category: determinedCategory,
            brand: updatedData.spaceType || v.brand,
            model: placeBesidePincode,
            plate: `PLOT ${updatedData.doorNo || '14-B'}`,
            location: `${updatedData.streetName || ''}, ${updatedData.locality || ''}, ${updatedData.city || 'Gurugram'}, ${updatedData.state || ''} - ${updatedData.pincode || ''}`.replace(/^,\s*/, ''),
            city: updatedData.city || v.city,
            locality: updatedData.locality || v.locality,
            pincodePlace: placeBesidePincode,
            locationName: placeBesidePincode,
            image: coverPhoto,
            pricing: { hourly: minRate, daily: dailyRate, monthly: monthlyRate },
            pricingText: `₹${minRate}/hr | ₹${dailyRate.toLocaleString()}/day | ₹${monthlyRate.toLocaleString()}/month`,
            hourlyRate: minRate,
            dailyRate: dailyRate,
            monthlyRate: monthlyRate,
            yardData: {
              ...(v.yardData || {}),
              ...updatedData
            }
          };
        }
        return v;
      });

      syncFleet(updated);

      // Sync backend
      try {
        const spotPayload = {
          id: targetId,
          spotName: updatedData.spotName,
          name: updatedData.spotName,
          partnerId: partnerDetails?.id || 'partner_1',
          ownerName: partnerDetails?.name || updatedData.ownerName || 'SART Parking Partner',
          spaceType: updatedData.spaceType || 'Open Yard',
          doorNo: updatedData.doorNo || '',
          streetName: updatedData.streetName || '',
          locality: updatedData.locality || '',
          city: updatedData.city || 'Gurugram',
          state: updatedData.state || 'Haryana',
          pincode: updatedData.pincode || '',
          pincodePlace: placeBesidePincode,
          landmark: updatedData.landmark || '',
          lat: updatedData.latitude || 28.4595,
          lng: updatedData.longitude || 77.0266,
          minHourlyRate: minRate,
          hourlyRate: minRate,
          dailyRate: dailyRate,
          monthlyRate: monthlyRate,
          pricingText: `₹${minRate}/hr | ₹${dailyRate.toLocaleString()}/day | ₹${monthlyRate.toLocaleString()}/month`,
          photos: updatedData.photos || [],
          coverPhoto: coverPhoto,
          image: coverPhoto,
          vehicleTypes: updatedData.vehicleTypes || {},
          securityFeatures: updatedData.amenities || [],
          operatingHours: updatedData.is24x7 ? '24/7 Open' : `${updatedData.openTime} - ${updatedData.closeTime}`,
          gateInstructions: updatedData.accessInstructions || 'Direct entry from main road.',
          bookingMode: updatedData.bookingMode || 'Instant Booking'
        };

        fetch(`http://localhost:5000/api/parking/spots/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(spotPayload)
        }).catch(() => { });
        fetch(`http://localhost:3005/api/parking/spots/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(spotPayload)
        }).catch(() => { });
      } catch (e) { }

      setIsEditModalOpen(false);
      setEditingVehicle(null);
      return;
    }

    const updated = fleetList.map(v => v.id === targetId ? { ...v, ...updatedData } : v);
    syncFleet(updated);
    setIsEditModalOpen(false);
    setEditingVehicle(null);
  };

  // Route condition: If editing a parking spot, render ParkingAddNewSpot with prefilled data
  if (isEditModalOpen && editingVehicle) {
    return (
      <ParkingAddNewSpotComponent
        initialSpotData={editingVehicle}
        isEditMode={true}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingVehicle(null);
        }}
        onAddSpot={(data: any) => {
          handleUpdateVehicle(data);
        }}
      />
    );
  }

  // Route condition: If urlSubPath is 'AddVehicle' or 'add-new-vehicle', render ParkingAddNewSpot
  if (urlSubPath === 'AddVehicle' || urlSubPath === 'add-new-vehicle' || urlSubPath === 'addvehicle') {
    return (
      <ParkingAddNewSpotComponent
        onCancel={() => onNavigate('parking')}
        onAddSpot={(data: any) => {
          handleAddNewSpot(data);
          onNavigate('parking');
        }}
      />
    );
  }

  // Filter logic matching Image 2 sidebar & location pills
  const filteredVehicles = fleetList.filter(item => {
    if (activeSideFilters) {
      if (activeSideFilters.availabilityOnly && !item.isAvailable) return false;

      // Space Type filter
      if (activeSideFilters.spaceTypes) {
        const selectedSpaceKeys = Object.keys(activeSideFilters.spaceTypes).filter(k => activeSideFilters.spaceTypes[k]);
        if (selectedSpaceKeys.length > 0) {
          const itemSpace = item.yardData?.spaceType || item.brand || item.category || '';
          const matchSpace = selectedSpaceKeys.some(k => itemSpace.toLowerCase().includes(k.toLowerCase()));
          if (!matchSpace) return false;
        }
      }

      // Vehicle Compatibility filter
      if (activeSideFilters.vehicleTypes) {
        const selectedVehKeys = Object.keys(activeSideFilters.vehicleTypes).filter(k => activeSideFilters.vehicleTypes[k]);
        if (selectedVehKeys.length > 0) {
          const matchVeh = selectedVehKeys.some(k => {
            if (k === '2-Wheeler') return item.yardData?.vehicleTypes?.twoWheeler?.enabled !== false || item.category === '2-Wheeler';
            if (k === '4-Wheeler') return item.yardData?.vehicleTypes?.fourWheeler?.enabled !== false || item.category === '4-Wheeler';
            if (k === 'Trucks' || k === 'Bus') return item.yardData?.vehicleTypes?.heavyVehicle?.enabled !== false || item.category === 'Trucks';
            return true;
          });
          if (!matchVeh) return false;
        }
      }

      // Security Amenities filter
      if (activeSideFilters.securityFeatures) {
        const selectedSecKeys = Object.keys(activeSideFilters.securityFeatures).filter(k => activeSideFilters.securityFeatures[k]);
        if (selectedSecKeys.length > 0) {
          const itemFeatures: string[] = item.yardData?.securityFeatures || item.yardData?.features || ['CCTV Surveillance', '24/7 Security Guard'];
          const matchSec = selectedSecKeys.some(secKey =>
            itemFeatures.some((f: string) => f.toLowerCase().includes(secKey.toLowerCase()))
          );
          if (!matchSec) return false;
        }
      }

      // Tariff Plans filter
      if (activeSideFilters.tariffPlans) {
        const selectedTariffKeys = Object.keys(activeSideFilters.tariffPlans).filter(k => activeSideFilters.tariffPlans[k]);
        if (selectedTariffKeys.length > 0) {
          const matchTariff = selectedTariffKeys.some(t => {
            const rate = Number(item.hourlyRate || item.pricing?.hourly || 20);
            const daily = Number(item.dailyRate || item.pricing?.daily || 150);
            if (t.includes('Under ₹30/hr')) return rate <= 30;
            if (t.includes('₹30 - ₹60/hr')) return rate >= 30 && rate <= 60;
            if (t.includes('Under ₹200/day')) return daily <= 200;
            if (t.includes('Monthly Pass')) return Boolean(item.monthlyRate || item.pricing?.monthly);
            return true;
          });
          if (!matchTariff) return false;
        }
      }
    }

    // Dynamic Location Pill Filter
    if (selectedCityFilter !== 'All') {
      const filterLower = selectedCityFilter.toLowerCase();
      const matchCity =
        (item.pincodePlace && item.pincodePlace.toLowerCase().includes(filterLower)) ||
        (item.locality && item.locality.toLowerCase().includes(filterLower)) ||
        (item.city && item.city.toLowerCase().includes(filterLower)) ||
        (item.location && item.location.toLowerCase().includes(filterLower));
      if (!matchCity) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = (item.name && item.name.toLowerCase().includes(q)) ||
        (item.plate && item.plate.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  // Release/complete parking booking
  const handleCompleteParking = async (spotId: string) => {
    try {
      localStorage.removeItem(`parking_booking_${spotId}`);
      try {
        const stored = localStorage.getItem('sart_business_bookings');
        if (stored) {
          const parsed = JSON.parse(stored);
          const filtered = parsed.filter((b: any) => !(b.type === 'parking_booking' && b.spotId === spotId));
          localStorage.setItem('sart_business_bookings', JSON.stringify(filtered));
        }
      } catch (e) { }

      window.dispatchEvent(new Event('storage'));

      // Call Backend API to clear booking
      await Promise.allSettled([
        fetch(`http://localhost:5000/api/parking/spots/${encodeURIComponent(spotId)}/booking`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isAvailable: true, bookingDetails: null })
        }),
        fetch(`http://localhost:3005/api/parking/spots`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: spotId, isAvailable: true, bookingDetails: null })
        })
      ]);

      setFleetList(prev => prev.map(s => s.id === spotId ? { ...s, isAvailable: true, bookingStatus: 'AVAILABLE', bookingDetails: null, activeBooking: null } : s));
    } catch (err) {
      console.error('Error releasing parking spot:', err);
    }
  };

  return (
    <div className="rental-dashboard-wrapper" style={{ gap: '20px' }}>
      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="rental-main-split-layout">
        {/* Left Side: Dedicated Parking Filter Sidebar */}
        <ParkingFilterSidebar
          onFilterChange={(filters: any) => {
            setActiveSideFilters(filters);
            if (filters.searchTerm !== undefined) setSearchQuery(filters.searchTerm);
          }}
          onReset={() => {
            setActiveSideFilters(null);
            setSearchQuery('');
            setSelectedCityFilter('All');
          }}
        />

        {/* Right Side: Owner Vehicle Fleet Grid */}
        <div className="rental-main-content-col">
          <OwnerVehicleGridComponent
            vehicles={filteredVehicles}
            selectedCity={selectedCityFilter}
            onSelectCity={(city: string) => setSelectedCityFilter(city)}
            onOpenVehicleDetails={() => { }}
            onToggleAvailability={(id: string) => toggleAvailability(id)}
            onCompleteTrip={(id: string) => handleCompleteParking(id)}
            onDeleteVehicle={(id: string) => handleDeleteVehicle(id)}
            onOpenAddVehicle={() => onNavigate('parking', 'AddVehicle')}
            onOpenBookings={() => onNavigate('parking')}
            onEditVehicle={(veh: any) => {
              setEditingVehicle(veh);
              setIsEditModalOpen(true);
            }}
            customCategories={PARKING_CATEGORIES}
            customLocations={dynamicLocationPills}
            isParking={true}
          />

          <EditVehicleModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            vehicle={editingVehicle}
            onUpdateVehicle={handleUpdateVehicle}
          />
        </div>
      </div>
    </div>
  );
}
