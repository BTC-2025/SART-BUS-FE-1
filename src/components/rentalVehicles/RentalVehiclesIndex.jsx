import React, { useState, useEffect } from 'react';
import './rentalVehicles.css';
import AddNewVehiclePage from './AddNewVehiclePage';
import RentalFilterSidebar from './RentalFilterSidebar';
import OwnerVehicleGrid from './OwnerVehicleGrid';
import VehicleDetailsPage from './VehicleDetailsPage';
import EditVehicleModal from './EditVehicleModal';

// Mock ID list to filter out pre-seeded demo vehicles
const MOCK_VEHICLE_IDS = [
  'r-swift', 'r-creta', 'r-thar', 'r-innova', 'r-ertiga', 'r-nexon', 'r-baleno', 'r-fortuner', 'r-scorpio', 'r-xuv700', 'r-city',
  'r-classic350', 'r-hunter350', 'r-himalayan', 'r-activa', 'r-jupiter', 'r-pulsar', 'r-r15',
  'VH-001', 'VH-002', 'VH-003', 'VH-004', 'VH-005', 'VH-006', 'VH-007', 'VH-008', 'VH-009', 'VH-010',
  'VH-101', 'VH-102', 'VH-103', 'VH-0160', 'VH-KAT-001', 'VH-KAT-002', 'VH-KAT-003', 'VH-KAT-004', 'VH-KAT-005'
];

const INITIAL_FALLBACK_FLEET = [];

export default function RentalVehiclesIndex({
  partnerDetails,
  onNavigate = () => { },
  initialAddModalOpen = false,
  urlVehicleSlug = null
}) {
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Cars' | 'Bikes' | 'Available' | 'On Trip'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [allTripToggle, setAllTripToggle] = useState(false);
  const [activeSideFilters, setActiveSideFilters] = useState(null);
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Edit vehicle state
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fleet data with Hyundai Verna (Katpadi), Toyota Alphard, Porsche 911, Rolls-Royce Dawn, etc.
  const [fleetList, setFleetList] = useState(INITIAL_FALLBACK_FLEET);

  // Load vehicles from live API
  const fetchFleetFromApi = async () => {
    setIsLoading(true);
    try {
      let res = await fetch('http://localhost:5000/api/rental/vehicles').catch(() => null);
      if (res && res.ok) {
        const json = await res.json();
        if (json && json.success && Array.isArray(json.data)) {
          const liveFiltered = json.data.filter(
            v => !MOCK_VEHICLE_IDS.includes(v.id) && !MOCK_VEHICLE_IDS.includes(v.plate)
          );
          setFleetList(liveFiltered);
          localStorage.setItem('sart_business_fleet', JSON.stringify(liveFiltered));
          return;
        }
      }
      // If backend is unreachable or empty, show empty list (no stale vehicles)
      setFleetList([]);
      localStorage.removeItem('sart_business_fleet');
    } catch (e) {
      console.warn('Backend API offline');
      setFleetList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetFromApi();

    // Listen for customer booking events and poll API for live bookings
    const handleLiveBookingUpdate = () => {
      fetchFleetFromApi();
    };

    window.addEventListener('rental_vehicle_booked', handleLiveBookingUpdate);
    window.addEventListener('rental_vehicle_updated', handleLiveBookingUpdate);
    window.addEventListener('storage', handleLiveBookingUpdate);
    const interval = setInterval(fetchFleetFromApi, 5000);

    return () => {
      window.removeEventListener('rental_vehicle_booked', handleLiveBookingUpdate);
      window.removeEventListener('rental_vehicle_updated', handleLiveBookingUpdate);
      window.removeEventListener('storage', handleLiveBookingUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleUpdateVehicle = async (updatedVehicle) => {
    // 1. In-memory update matching by id or prior editingVehicle id
    const targetId = updatedVehicle.id || editingVehicle?.id;
    setFleetList(prev => prev.map(v => (v.id === targetId || (editingVehicle?.plate && v.plate === editingVehicle.plate) || v.plate === updatedVehicle.plate) ? { ...v, ...updatedVehicle, id: targetId } : v));
    setEditingVehicle(updatedVehicle);

    // 2. Persist to localStorage 'sart_business_fleet'
    try {
      const deletedIds = JSON.parse(localStorage.getItem('sart_deleted_vehicle_ids') || '[]');
      const storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
      let updatedFleet = storedFleet.map(v => (v.id === targetId || (editingVehicle?.plate && v.plate === editingVehicle.plate) || v.plate === updatedVehicle.plate) ? { ...v, ...updatedVehicle, id: targetId } : v);
      if (!updatedFleet.some(v => v.id === targetId || v.plate === updatedVehicle.plate)) {
        updatedFleet.unshift(updatedVehicle);
      }
      updatedFleet = updatedFleet.filter(v => !deletedIds.includes(v.id) && !deletedIds.includes(v.plate));
      localStorage.setItem('sart_business_fleet', JSON.stringify(updatedFleet));

      // Also ensure ontrip IDs in localStorage reflect availability
      let onTripIds = JSON.parse(localStorage.getItem('sart_ontrip_vehicle_ids') || '[]');
      if (!updatedVehicle.isAvailable) {
        if (!onTripIds.includes(targetId)) onTripIds.push(targetId);
        if (updatedVehicle.plate && !onTripIds.includes(updatedVehicle.plate)) onTripIds.push(updatedVehicle.plate);
      } else {
        onTripIds = onTripIds.filter(x => x !== targetId && x !== updatedVehicle.plate);
      }
      localStorage.setItem('sart_ontrip_vehicle_ids', JSON.stringify(onTripIds));

      window.dispatchEvent(new CustomEvent('rental_vehicle_updated', { detail: updatedVehicle }));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to update localStorage:', e);
    }

    // 3. Persist to backend API (PUT /api/rental/vehicles/:id)
    try {
      const res = await fetch(`http://localhost:5000/api/rental/vehicles/${encodeURIComponent(targetId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedVehicle, originalPlate: editingVehicle?.plate, originalId: editingVehicle?.id })
      });
      if (res && res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setFleetList(prev => prev.map(v => v.id === targetId ? { ...v, ...json.data } : v));
        }
      }
    } catch (err) {
      console.warn('Backend update error:', err);
    }
  };

  const handleAddVehicle = async (newVehicle) => {
    let derivedCity = newVehicle.city;
    const locLower = (newVehicle.location || '').toLowerCase();
    if (locLower.includes('katpadi')) derivedCity = 'Katpadi';
    else if (locLower.includes('vellore')) derivedCity = 'Vellore';
    else if (locLower.includes('chennai')) derivedCity = 'Chennai';
    else if (locLower.includes('bengaluru') || locLower.includes('bangalore')) derivedCity = 'Bengaluru';
    else if (locLower.includes('mumbai')) derivedCity = 'Mumbai';
    else if (locLower.includes('hyderabad')) derivedCity = 'Hyderabad';
    else if (!derivedCity || derivedCity === 'Pune' || /^\d+$/.test(derivedCity.trim())) {
      if (newVehicle.location?.includes(',')) {
        const parts = newVehicle.location.split(',').map(p => p.trim()).filter(p => !/^\d+$/.test(p) && p.toLowerCase() !== 'india');
        derivedCity = parts.length > 1 ? parts[parts.length - 2] : (parts[0] || 'Katpadi');
      } else {
        derivedCity = derivedCity || 'Katpadi';
      }
    }

    const isBike = (newVehicle.type === 'bike') ||
      /bike|scooter|scooty|cruiser|bullet|classic|hunter|himalayan|activa|r15|pulsar|ola|ather|jupiter|tvs|ktm|royal enfield/i.test(
        `${newVehicle.name} ${newVehicle.brand || ''} ${newVehicle.category || ''}`
      );
    const finalType = isBike ? 'bike' : (newVehicle.type || 'car');
    const computedDailyRate = Number(newVehicle.pricePerDay || newVehicle.dailyRate || newVehicle.price || newVehicle.pricing?.daily?.replace(/[^0-9.]/g, '') || 1800);

    const formatted = {
      id: newVehicle.id || `VH-${Date.now().toString().slice(-4)}`,
      name: newVehicle.name.toUpperCase(),
      brand: newVehicle.brand || newVehicle.name.split(' ')[0],
      type: finalType,
      category: newVehicle.category,
      fuel: newVehicle.fuel,
      transmission: newVehicle.transmission,
      seats: newVehicle.seats,
      plate: newVehicle.plate,
      city: derivedCity,
      location: newVehicle.location || 'Katpadi, Vellore',
      pricingText: newVehicle.pricing ? `${newVehicle.pricing.hourly} | ${newVehicle.pricing.daily} | ${newVehicle.pricing.monthly}` : newVehicle.pricingText,
      hourlyRate: Number(newVehicle.pricePerHour || newVehicle.pricing?.hourly?.replace(/[^0-9.]/g, '') || 150),
      dailyRate: computedDailyRate,
      price: computedDailyRate,
      monthlyRate: Number(newVehicle.pricePerMonth || newVehicle.pricing?.monthly?.replace(/[^0-9.]/g, '') || 25000),
      isAvailable: true,
      image: newVehicle.image,
      images: (newVehicle.images && newVehicle.images.length > 0)
        ? (newVehicle.images.length >= 3
          ? newVehicle.images
          : [newVehicle.images[0], newVehicle.images[1] || newVehicle.images[0], newVehicle.images[2] || newVehicle.images[0]])
        : [newVehicle.image, newVehicle.image, newVehicle.image],
      verified: true
    };

    // Optimistic UI update
    setFleetList(prev => [formatted, ...prev.filter(v => v.id !== formatted.id)]);

    // Persist to local storage so images are never lost on reload
    try {
      const storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
      localStorage.setItem('sart_business_fleet', JSON.stringify([formatted, ...storedFleet.filter(v => v.id !== formatted.id)]));

      // Ensure removed from deleted list if re-added
      const deletedIds = JSON.parse(localStorage.getItem('sart_deleted_vehicle_ids') || '[]');
      localStorage.setItem('sart_deleted_vehicle_ids', JSON.stringify(deletedIds.filter(d => d !== formatted.id && d !== formatted.plate)));
      window.dispatchEvent(new CustomEvent('rental_vehicle_added', { detail: formatted }));
    } catch (e) { }

    // Persistent API call
    try {
      let res = await fetch('http://localhost:5000/api/rental/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatted)
      });

      if (res && res.ok) {
        const resData = await res.json();
        if (resData.success && resData.data) {
          setFleetList(prev => [resData.data, ...prev.filter(v => v.id !== resData.data.id && v.id !== formatted.id)]);
          // Store in sart_business_fleet
          const storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
          localStorage.setItem('sart_business_fleet', JSON.stringify([resData.data, ...storedFleet.filter(v => v.id !== resData.data.id && v.id !== formatted.id)]));
          alert('✅ Vehicle successfully added to backend database and synced to user website!');
        }
      } else {
        const errText = await res.text();
        alert('⚠️ Backend responded with error: ' + errText);
      }
    } catch (err) {
      console.error('Failed to post vehicle to backend:', err);
      alert('❌ Failed to connect to Backend Server on port 5000. Please verify backend is running!');
    }
  };

  const toggleAvailability = async (id) => {
    const target = fleetList.find(v => v.id === id);
    if (target && (target.bookingStatus === 'ALREADY_BOOKED' || (!target.isAvailable && target.activeBooking))) {
      alert('This vehicle is currently booked by a customer. Complete the active trip to release the vehicle and make it available again.');
      return;
    }

    const nextAvail = target ? !target.isAvailable : false;

    // Optimistic update
    setFleetList(prev => prev.map(v => v.id === id ? {
      ...v,
      isAvailable: nextAvail,
      status: nextAvail ? 'Available' : 'On Trip',
      bookingStatus: nextAvail ? 'READY_FOR_BOOKING' : 'ON_TRIP'
    } : v));

    // Update localStorage sart_business_fleet & sart_ontrip_vehicle_ids
    try {
      const storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
      const updatedFleet = storedFleet.map(v => (v.id === id || v.plate === target?.plate) ? {
        ...v,
        isAvailable: nextAvail,
        status: nextAvail ? 'Available' : 'On Trip',
        bookingStatus: nextAvail ? 'READY_FOR_BOOKING' : 'ON_TRIP'
      } : v);
      localStorage.setItem('sart_business_fleet', JSON.stringify(updatedFleet));

      let onTripIds = JSON.parse(localStorage.getItem('sart_ontrip_vehicle_ids') || '[]');
      if (!nextAvail) {
        if (!onTripIds.includes(id)) onTripIds.push(id);
        if (target?.plate && !onTripIds.includes(target.plate)) onTripIds.push(target.plate);
        if (target?.name && !onTripIds.includes(target.name)) onTripIds.push(target.name);
      } else {
        onTripIds = onTripIds.filter(x => x !== id && x !== target?.plate && x !== target?.name);
      }
      localStorage.setItem('sart_ontrip_vehicle_ids', JSON.stringify(onTripIds));

      window.dispatchEvent(new CustomEvent('update_vehicle_availability', {
        detail: { id, isAvailable: nextAvail, plate: target?.plate, name: target?.name }
      }));
    } catch (e) { }

    try {
      let res = await fetch(`http://localhost:5000/api/rental/vehicles/${id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: nextAvail })
      }).catch(() => null);

      if (res && res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setFleetList(prev => prev.map(v => v.id === id ? { ...v, isAvailable: json.data.isAvailable } : v));
        }
      }
    } catch (e) { }
  };

  // Complete Trip Flow (Resetting Vehicle to Ready for Booking and releasing for User Catalog)
  const handleCompleteTrip = async (id) => {
    const target = fleetList.find(v => v.id === id || v.activeBookingId === id);

    // Stage 3 -> Stage 1 Reset
    setFleetList(prev => prev.map(v => (v.id === id || v.activeBookingId === id) ? {
      ...v,
      isAvailable: true,
      status: 'Available',
      bookingStatus: 'READY_FOR_BOOKING',
      activeBookingId: null,
      activeBookingData: null,
      activeBooking: null
    } : v));

    // Remove from sart_ontrip_vehicle_ids and sart_booked_vehicle_ids in localStorage
    try {
      let onTripIds = JSON.parse(localStorage.getItem('sart_ontrip_vehicle_ids') || '[]');
      onTripIds = onTripIds.filter(x => x !== id && x !== target?.plate && x !== target?.name && x !== target?.activeBookingId);
      localStorage.setItem('sart_ontrip_vehicle_ids', JSON.stringify(onTripIds));

      let bookedIds = JSON.parse(localStorage.getItem('sart_booked_vehicle_ids') || '[]');
      bookedIds = bookedIds.filter(x => x !== id && x !== target?.plate && x !== target?.name && x !== target?.activeBookingId);
      localStorage.setItem('sart_booked_vehicle_ids', JSON.stringify(bookedIds));

      const storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
      const updatedFleet = storedFleet.map(v => (v.id === id || v.plate === target?.plate) ? {
        ...v,
        isAvailable: true,
        status: 'Available',
        bookingStatus: 'READY_FOR_BOOKING',
        activeBookingId: null,
        activeBookingData: null,
        activeBooking: null
      } : v);
      localStorage.setItem('sart_business_fleet', JSON.stringify(updatedFleet));

      window.dispatchEvent(new CustomEvent('rental_trip_completed', {
        detail: { id, plate: target?.plate, name: target?.name }
      }));
    } catch (e) { }

    try {
      let res = await fetch(`http://localhost:5000/api/rental/vehicles/${id}/complete-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => null);

      if (res && res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setFleetList(prev => prev.map(v => v.id === id ? json.data : v));
        }
      }
    } catch (e) {
      console.error('Failed to complete trip:', e);
    }
  };

  const handleDeleteVehicle = async (id) => {
    // 1. Optimistic update in UI
    const target = fleetList.find(v => v.id === id);
    const targetPlate = target?.plate;
    setFleetList(prev => prev.filter(v => v.id !== id));

    // 2. Remove from local storage and record in deleted IDs list
    try {
      const storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
      localStorage.setItem('sart_business_fleet', JSON.stringify(storedFleet.filter(v => v.id !== id)));

      const deletedIds = JSON.parse(localStorage.getItem('sart_deleted_vehicle_ids') || '[]');
      if (!deletedIds.includes(id)) deletedIds.push(id);
      if (targetPlate && !deletedIds.includes(targetPlate)) deletedIds.push(targetPlate);
      localStorage.setItem('sart_deleted_vehicle_ids', JSON.stringify(deletedIds));

      window.dispatchEvent(new CustomEvent('rental_vehicle_deleted', { detail: { id, plate: targetPlate } }));
    } catch (e) { }

    // 3. API Delete Calls
    try {
      await fetch(`http://localhost:5000/api/rental/vehicles/${id}`, { method: 'DELETE' }).catch(() => null);
    } catch (e) { }
  };

  // Filter logic including All Filters from Left Sidebar
  const filteredVehicles = fleetList.filter(item => {
    if (activeFilter === 'Cars' && item.type !== 'car') return false;
    if (activeFilter === 'Bikes' && item.type !== 'bike') return false;
    if (activeFilter === 'Available' && !item.isAvailable) return false;
    if (activeFilter === 'On Trip' && item.isAvailable) return false;

    if (typeFilter !== 'All') {
      if (typeFilter === 'Cars' && item.type !== 'car') return false;
      if (typeFilter === 'Bikes' && item.type !== 'bike') return false;
    }

    if (statusFilter !== 'All') {
      if (statusFilter === 'Available' && !item.isAvailable) return false;
      if (statusFilter === 'On Trip' && item.isAvailable) return false;
    }

    // Apply Left Sidebar multi-select filters
    if (activeSideFilters) {
      // Type match: car vs bike vs other
      if (activeSideFilters.vehicleType && activeSideFilters.vehicleType !== 'all') {
        if (activeSideFilters.vehicleType === 'bike' && item.type !== 'bike') return false;
        if (activeSideFilters.vehicleType === 'car' && item.type !== 'car') return false;
        if (activeSideFilters.vehicleType === 'other' && item.type !== 'other' && item.type !== 'carrier') return false;
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
            item.name.toLowerCase().includes(m.toLowerCase())
          );
          if (!matchModel) return false;
        }
      }

      // Category filter
      if (activeSideFilters.categories) {
        const selectedCatKeys = Object.keys(activeSideFilters.categories).filter(c => activeSideFilters.categories[c]);
        if (selectedCatKeys.length > 0) {
          const matchCat = selectedCatKeys.some(c =>
            item.category && (
              item.category.toLowerCase().includes(c.toLowerCase()) ||
              (c === 'Cruiser / Bike' && item.type === 'bike')
            )
          );
          if (!matchCat) return false;
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
        if (selectedTransKeys.length > 0) {
          if (selectedTransKeys.includes('Both')) {
            // allows any
          } else {
            const matchTrans = selectedTransKeys.some(t =>
              item.transmission && item.transmission.toLowerCase().includes(t.toLowerCase())
            );
            if (!matchTrans) return false;
          }
        }
      }

      // Seating capacity filter
      const capObj = activeSideFilters.capacities || activeSideFilters.seats;
      if (capObj) {
        const selectedSeatKeys = Object.keys(capObj).filter(s => capObj[s]);
        if (selectedSeatKeys.length > 0) {
          const matchSeats = selectedSeatKeys.some(s =>
            item.seats && item.seats.toLowerCase().includes(s.toLowerCase().replace(' seats', '').replace('-seater', ''))
          );
          if (!matchSeats) return false;
        }
      }

      // Color filter
      if (activeSideFilters.colors) {
        const selectedColorKeys = Object.keys(activeSideFilters.colors).filter(c => activeSideFilters.colors[c]);
        if (selectedColorKeys.length > 0) {
          const matchColor = selectedColorKeys.some(c =>
            (item.color && item.color.toLowerCase() === c.toLowerCase()) ||
            (item.name && item.name.toLowerCase().includes(c.toLowerCase()))
          );
          if (!matchColor) return false;
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
        item.plate.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const carCount = fleetList.filter(v => v.type === 'car').length;
  const bikeCount = fleetList.filter(v => v.type === 'bike').length;
  const availableCount = fleetList.filter(v => v.isAvailable).length;
  const onTripCount = fleetList.filter(v => !v.isAvailable).length;

  // Helper to slugify vehicle names for URL (e.g. "Toyota Alphard" -> "toyota-alphard")
  const toSlug = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Check if current URL or state is pointing to a specific vehicle page
  const selectedVehicleFromUrl = urlVehicleSlug
    ? fleetList.find(
      (v) =>
        toSlug(v.name) === urlVehicleSlug ||
        v.id.toLowerCase() === urlVehicleSlug.toLowerCase() ||
        toSlug(v.name).includes(urlVehicleSlug) ||
        urlVehicleSlug.includes(toSlug(v.name))
    )
    : null;

  // If URL is /rentals/AddNewVehicle, render the Dedicated Add Vehicle Page
  if (urlVehicleSlug === 'AddNewVehicle' || urlVehicleSlug === 'add-new-vehicle') {
    return (
      <AddNewVehiclePage
        onAddVehicle={(newVehicle) => {
          handleAddVehicle(newVehicle);
          onNavigate('rentals');
        }}
        onCancel={() => onNavigate('rentals')}
      />
    );
  }

  // If a vehicle is selected via URL (/rentals/toyota-alphard), render the Full Vehicle Details Page
  if (selectedVehicleFromUrl) {
    return (
      <>
        <VehicleDetailsPage
          vehicle={selectedVehicleFromUrl}
          onBack={() => onNavigate('rentals')}
          onToggleAvailability={(id) => toggleAvailability(id)}
          onCompleteTrip={(id) => handleCompleteTrip(id)}
          onEditVehicle={(veh) => handleEditVehicle(veh)}
        />
        <EditVehicleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          vehicle={editingVehicle}
          onUpdateVehicle={handleUpdateVehicle}
        />
      </>
    );
  }

  return (
    <div className="rental-dashboard-wrapper" style={{ gap: '20px' }}>
      {/* MAIN TWO-COLUMN RENTAL LAYOUT:
          LEFT: What Are You Looking For Filter Sidebar (Image 1)
          RIGHT: Top 3 Showcase Cars + Beside Food List UI (Image 3) + Fleet Listing Cards
      */}
      <div className="rental-main-split-layout">
        {/* Left Side: Filter Sidebar (Image 1) */}
        <RentalFilterSidebar
          onFilterChange={(filters) => {
            setActiveSideFilters(filters);
            if (filters.searchTerm !== undefined) setSearchQuery(filters.searchTerm);
          }}
          onReset={() => {
            setActiveSideFilters(null);
            setSearchQuery('');
            setActiveFilter('All');
            setTypeFilter('All');
            setStatusFilter('All');
          }}
          selectedType={typeFilter === 'Bikes' ? 'bike' : typeFilter === 'Cars' ? 'car' : 'all'}
          onTypeChange={(newType) => {
            setTypeFilter(newType === 'bike' ? 'Bikes' : newType === 'car' ? 'Cars' : 'All');
          }}
        />

        {/* Right Side: Vehicle Showcase + Image 3 Food List + Vehicle Cards */}
        <div className="rental-main-content-col">


          {/* 2.8 OWNER VEHICLES GRID (Replaces food grid with vehicles added by owner) */}
          <OwnerVehicleGrid
            vehicles={filteredVehicles}
            selectedCity={selectedCityFilter}
            onSelectCity={(city) => setSelectedCityFilter(city)}
            onOpenVehicleDetails={(vehicle) => {
              // Navigates directly to /rentals/{vehicle-slug} on a new page!
              const slug = toSlug(vehicle.name);
              onNavigate('rentals', slug);
            }}
            onToggleAvailability={(id) => toggleAvailability(id)}
            onCompleteTrip={(id) => handleCompleteTrip(id)}
            onDeleteVehicle={(id) => handleDeleteVehicle(id)}
            onOpenAddVehicle={() => onNavigate('rentals', 'AddNewVehicle')}
            onOpenBookings={() => onNavigate('bookings')}
            onEditVehicle={(veh) => handleEditVehicle(veh)}
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
