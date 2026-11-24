import React, { useState, useEffect } from 'react';
import './ParkingSlot.css';
import './MotorsMarketplace.css';
import './rentalVehicles/rentalVehicles.css';
import './rentalVehicles/OwnerVehicleGrid.css';
import RentalFilterSidebar from './rentalVehicles/RentalFilterSidebar';
import OwnerVehicleGrid from './rentalVehicles/OwnerVehicleGrid';
import EditVehicleModal from './rentalVehicles/EditVehicleModal';
import ParkingAddNewSpot from './ParkingAddNewSpot';

// Pre-seeded fallback parking yards & vehicle staging fleet matching Image 2
export const INITIAL_PARKING_FLEET = [
  {
    id: 'PRK-VH-001',
    name: 'TOYOTA ALPHARD XZ+',
    type: 'car',
    category: 'Compact SUV',
    brand: 'Toyota',
    model: 'Alphard',
    plate: 'TN 23 BV 9735',
    location: 'Central, Delhi, South East Delhi, Delhi, 110...',
    city: 'Delhi',
    image: '/images/toyota_alphard.png',
    pricing: { hourly: 150, daily: 1800, monthly: 32000 },
    pricingText: '₹150/hr | ₹1,800/day | ₹32,000/month',
    transmission: 'Manual',
    fuel: 'Petrol',
    seats: '5-Seater',
    isAvailable: true,
    status: 'Available',
    bookingStatus: 'READY_FOR_BOOKING',
    rating: 4.8
  },
  {
    id: 'PRK-VH-002',
    name: 'HONDA 2-WHEELERS SHINE 125 XZ+',
    type: 'bike',
    category: 'Cruiser (350cc+)',
    brand: 'Honda 2-Wheelers',
    model: 'Shine 125',
    plate: 'TN 23 ME 1053',
    location: 'Ranipet - Chittoor Trunk Road, Thiruvalam, ...',
    city: 'Katpadi',
    image: '/images/shine_125.png',
    pricing: { hourly: 150, daily: 1800, monthly: 32000 },
    pricingText: '₹150/hr | ₹1,800/day | ₹32,000/month',
    transmission: 'Manual',
    fuel: 'Petrol',
    seats: '2-Seater',
    isAvailable: true,
    status: 'Available',
    bookingStatus: 'READY_FOR_BOOKING',
    rating: 4.8
  },
  {
    id: 'PRK-VH-003',
    name: 'TVS',
    type: 'bike',
    category: 'Cruiser (350cc+)',
    brand: 'TVS',
    model: 'Jupiter',
    plate: 'TN 23 VW 8415',
    location: 'Ranipet - Chittoor Trunk Road, Thiruvalam, ...',
    city: 'Katpadi',
    image: '/images/red_bike_3d.png',
    pricing: { hourly: 150, daily: 1800, monthly: 32000 },
    pricingText: '₹150/hr | ₹1,800/day | ₹32,000/month',
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: '2-Seater',
    isAvailable: true,
    status: 'Available',
    bookingStatus: 'READY_FOR_BOOKING',
    rating: 4.8
  }
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return INITIAL_PARKING_FLEET;
  });

  const [activeSideFilters, setActiveSideFilters] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sync to local storage
  const syncFleet = (updated: any[]) => {
    setFleetList(updated);
    try {
      localStorage.setItem('sart_parking_fleet', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) { }
  };

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
      '/images/toyota_alphard.png';

    const newVehicle = {
      id: 'PRK-' + Date.now(),
      name: data.spotName || 'Commercial Parking Yard',
      type: data.vehicleTypes?.fourWheeler?.enabled ? 'car' : 'bike',
      category: data.spaceType || 'Open Yard',
      brand: data.spaceType || 'Commercial Yard',
      model: data.locality || data.city || 'Gurugram',
      plate: `PLOT ${data.doorNo || '14-B'}`,
      location: `${data.streetName || ''}, ${data.locality || ''}, ${data.city || 'Gurugram'}, ${data.state || ''} - ${data.pincode || ''}`.replace(/^,\s*/, ''),
      city: data.city || 'Gurugram',
      image: coverPhoto,
      pricing: { hourly: minRate, daily: dailyRate, monthly: monthlyRate },
      pricingText: `₹${minRate}/hr | ₹${dailyRate.toLocaleString()}/day | ₹${monthlyRate.toLocaleString()}/month`,
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
      <ParkingAddNewSpot
        onCancel={() => onNavigate('parking')}
        onAddSpot={(data: any) => {
          handleAddNewSpot(data);
          onNavigate('parking');
        }}
      />
    );
  }

  // Filter logic matching Image 2 sidebar
  const filteredVehicles = fleetList.filter(item => {
    if (activeSideFilters) {
      if (activeSideFilters.vehicleType && activeSideFilters.vehicleType !== 'all') {
        if (activeSideFilters.vehicleType === 'bike' && item.type !== 'bike') return false;
        if (activeSideFilters.vehicleType === 'car' && item.type !== 'car') return false;
      }

      if (activeSideFilters.availabilityOnly && !item.isAvailable) return false;

      // Brand filter
      const brandsObj = activeSideFilters.brands || activeSideFilters.brand;
      if (brandsObj) {
        const selectedBrandKeys = Object.keys(brandsObj).filter(b => brandsObj[b]);
        if (selectedBrandKeys.length > 0) {
          const matchBrand = selectedBrandKeys.some(b =>
            item.name.toLowerCase().includes(b.toLowerCase()) ||
            (item.brand && item.brand.toLowerCase() === b.toLowerCase())
          );
          if (!matchBrand) return false;
        }
      }

      // Model filter
      if (activeSideFilters.models) {
        const selectedModelKeys = Object.keys(activeSideFilters.models).filter(m => activeSideFilters.models[m]);
        if (selectedModelKeys.length > 0) {
          const matchModel = selectedModelKeys.some(m =>
            item.name.toLowerCase().includes(m.toLowerCase()) ||
            (item.model && item.model.toLowerCase() === m.toLowerCase())
          );
          if (!matchModel) return false;
        }
      }

      // Fuel filter
      const fuelsObj = activeSideFilters.fuels || activeSideFilters.fuel;
      if (fuelsObj) {
        const selectedFuelKeys = Object.keys(fuelsObj).filter(f => fuelsObj[f]);
        if (selectedFuelKeys.length > 0) {
          const matchFuel = selectedFuelKeys.some(f =>
            item.fuel && item.fuel.toLowerCase().includes(f.toLowerCase())
          );
          if (!matchFuel) return false;
        }
      }

      // Transmission filter
      const transObj = activeSideFilters.transmissions || activeSideFilters.transmission;
      if (transObj) {
        const selectedTransKeys = Object.keys(transObj).filter(t => transObj[t]);
        if (selectedTransKeys.length > 0 && !selectedTransKeys.includes('Both')) {
          const matchTrans = selectedTransKeys.some(t =>
            item.transmission && item.transmission.toLowerCase().includes(t.toLowerCase())
          );
          if (!matchTrans) return false;
        }
      }
    }

    if (selectedCityFilter !== 'All') {
      const matchCity = (item.city && item.city.toLowerCase().includes(selectedCityFilter.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(selectedCityFilter.toLowerCase()));
      if (!matchCity) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = item.name.toLowerCase().includes(q) ||
        (item.plate && item.plate.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="rental-dashboard-wrapper" style={{ gap: '20px' }}>
      {/* MAIN TWO-COLUMN LAYOUT:
          LEFT: Filter Sidebar (Image 2)
          RIGHT: Header with '+ Add Vehicle' button, categories, location pills, and vehicle cards grid
      */}
      <div className="rental-main-split-layout">
        {/* Left Side: Filter Sidebar */}
        <RentalFilterSidebar
          onFilterChange={(filters: any) => {
            setActiveSideFilters(filters);
            if (filters.searchTerm !== undefined) setSearchQuery(filters.searchTerm);
          }}
          onReset={() => {
            setActiveSideFilters(null);
            setSearchQuery('');
            setSelectedCityFilter('All');
          }}
          selectedType="all"
          onTypeChange={() => { }}
        />

        {/* Right Side: Owner Vehicle Fleet Grid (Image 2) */}
        <div className="rental-main-content-col">
          <OwnerVehicleGrid
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
