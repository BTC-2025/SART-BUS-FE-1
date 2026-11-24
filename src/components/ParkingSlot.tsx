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
  const [fleetList, setFleetList] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('sart_parking_fleet');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out the pre-seeded demo vehicles
          const cleaned = parsed.filter(v =>
            !MOCK_VEHICLE_NAMES_OR_IDS.includes(v.id) &&
            !MOCK_VEHICLE_NAMES_OR_IDS.includes(v.name) &&
            !MOCK_VEHICLE_NAMES_OR_IDS.includes(v.plate)
          );
          localStorage.setItem('sart_parking_fleet', JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch (e) { }
    return INITIAL_PARKING_FLEET;
  });

  const [activeSideFilters, setActiveSideFilters] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sync to local storage and dispatch storage event
  const syncFleet = (updated: any[]) => {
    setFleetList(updated);
    try {
      localStorage.setItem('sart_parking_fleet', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) { }
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

    const coverPhoto = data.photos?.find((p: any) => p.isCover)?.url ||
      data.photos?.[0]?.url ||
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

  // Delete vehicle
  const handleDeleteVehicle = (id: string) => {
    const updated = fleetList.filter(v => v.id !== id);
    syncFleet(updated);
  };

  // Update vehicle via Edit modal
  const handleUpdateVehicle = (updatedVehicle: any) => {
    const targetId = updatedVehicle.id || editingVehicle?.id;
    const updated = fleetList.map(v => v.id === targetId ? { ...v, ...updatedVehicle } : v);
    syncFleet(updated);
    setIsEditModalOpen(false);
    setEditingVehicle(null);
  };

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
            onCompleteTrip={() => { }}
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
