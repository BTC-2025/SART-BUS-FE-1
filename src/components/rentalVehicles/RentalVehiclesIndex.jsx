import React, { useState, useEffect } from 'react';
import './rentalVehicles.css';
import AddNewVehiclePage from './AddNewVehiclePage';
import RentalFilterSidebar from './RentalFilterSidebar';
import OwnerVehicleGrid from './OwnerVehicleGrid';
import VehicleDetailsPage from './VehicleDetailsPage';

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

  // Fleet data with Toyota Alphard, Porsche 911, Rolls-Royce Dawn, Tata Nexon, Royal Enfield, etc.
  const [fleetList, setFleetList] = useState([
    {
      id: 'VH-001',
      name: 'Toyota Alphard',
      type: 'car',
      category: 'Minivan',
      fuel: 'Petrol / Hybrid',
      transmission: 'Automatic',
      seats: '7 Seats',
      speed: '210 Km/h',
      plate: 'MH 01 TA 7007',
      location: 'Baner, Pune',
      pricingText: '₹220/hr | ₹2,800/day | ₹38,000/month',
      isAvailable: true,
      image: '/images/toyota_alphard.png',
      verified: true
    },
    {
      id: 'VH-002',
      name: 'Porsche 911 Carrera',
      type: 'car',
      category: 'Sport',
      fuel: 'Petrol',
      transmission: 'Automatic',
      seats: '2 Seats',
      speed: '410 Km/h',
      plate: 'MH 01 PC 0911',
      location: 'Koregaon Park, Pune',
      pricingText: '₹550/hr | ₹7,500/day | ₹95,000/month',
      isAvailable: true,
      image: '/images/porsche_911.png',
      verified: true
    },
    {
      id: 'VH-003',
      name: 'Rolls-Royce Dawn',
      type: 'car',
      category: 'Convertible',
      fuel: 'Petrol',
      transmission: 'Automatic',
      seats: '7 Seats',
      speed: '210 Km/h',
      plate: 'MH 01 RR 0001',
      location: 'Viman Nagar, Pune',
      pricingText: '₹850/hr | ₹11,000/day | ₹1,45,000/month',
      isAvailable: true,
      image: '/images/rolls_royce_dawn.png',
      verified: true
    },
    {
      id: 'VH-101',
      name: 'TATA NEXON XZ+ (2024)',
      type: 'car',
      category: 'Compact SUV',
      fuel: 'Petrol',
      transmission: 'Manual',
      seats: '5-Seater',
      plate: 'MH 12 AB 1234',
      location: 'Baner, Pune',
      pricingText: '₹150/hr | ₹1,800/day | ₹22,000/month',
      isAvailable: true,
      image: '/images/cab_sedan.png',
      verified: true
    },
    {
      id: 'VH-102',
      name: 'ROYAL ENFIELD CLASSIC 350 (2024)',
      type: 'bike',
      category: 'Cruiser',
      fuel: 'Petrol',
      transmission: 'Manual',
      seats: '2-Seater',
      plate: 'MH 12 CD 5678',
      location: 'Kothrud, Pune',
      pricingText: '₹60/hr | ₹850/day | ₹12,000/month',
      isAvailable: true,
      image: '/images/red_bike_3d.png',
      verified: true
    },
    {
      id: 'VH-103',
      name: 'MARUTI SUZUKI SWIFT ZXI (2024)',
      type: 'car',
      category: 'Hatchback',
      fuel: 'Petrol',
      transmission: 'Automatic',
      seats: '5-Seater',
      plate: 'MH 14 EF 9012',
      location: 'Viman Nagar, Pune',
      pricingText: '₹120/hr | ₹1,500/day | ₹19,000/month',
      isAvailable: false,
      image: '/images/cab_economy.png',
      verified: true
    },
    {
      id: 'VH-104',
      name: 'YAMAHA R15 V4 RACING (2025)',
      type: 'bike',
      category: 'Sports Bike',
      fuel: 'Petrol',
      transmission: 'Manual',
      seats: '2-Seater',
      plate: 'MH 12 GH 3456',
      location: 'Hinjewadi, Pune',
      pricingText: '₹75/hr | ₹1,100/day | ₹16,000/month',
      isAvailable: true,
      image: '/images/blue_bike.png',
      verified: true
    },
    {
      id: 'VH-105',
      name: 'MAHINDRA THAR 4X4 (2024)',
      type: 'car',
      category: 'Full-size SUV',
      fuel: 'Diesel',
      transmission: 'Manual',
      seats: '4-Seater',
      plate: 'MH 12 JK 7890',
      location: 'Wakad, Pune',
      pricingText: '₹250/hr | ₹3,200/day | ₹45,000/month',
      isAvailable: false,
      image: '/images/cab_xl.png',
      verified: true
    },
    {
      id: 'VH-106',
      name: 'OLA S1 PRO ELECTRIC (2024)',
      type: 'bike',
      category: 'Scooter / Moped',
      fuel: 'Electric (EV)',
      transmission: 'Gearless',
      seats: '2-Seater',
      plate: 'MH 12 LM 2345',
      location: 'Koregaon Park, Pune',
      pricingText: '₹40/hr | ₹500/day | ₹7,500/month',
      isAvailable: true,
      image: '/images/red_scooty.png',
      verified: true
    }
  ]);

  const handleAddVehicle = (newVehicle) => {
    const formatted = {
      id: newVehicle.id,
      name: newVehicle.name.toUpperCase(),
      type: newVehicle.type,
      category: newVehicle.category,
      fuel: newVehicle.fuel,
      transmission: newVehicle.transmission,
      seats: newVehicle.seats,
      plate: newVehicle.plate,
      location: newVehicle.location || 'Pune',
      pricingText: `${newVehicle.pricing.hourly} | ${newVehicle.pricing.daily} | ${newVehicle.pricing.monthly}`,
      isAvailable: true,
      image: newVehicle.image,
      verified: true
    };
    setFleetList([formatted, ...fleetList]);
  };

  const toggleAvailability = (id) => {
    setFleetList(fleetList.map(v => v.id === id ? { ...v, isAvailable: !v.isAvailable } : v));
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
      if (activeSideFilters.vehicleType) {
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
      <VehicleDetailsPage
        vehicle={selectedVehicleFromUrl}
        onBack={() => onNavigate('rentals')}
        onToggleAvailability={(id) => toggleAvailability(id)}
      />
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
          selectedType={typeFilter === 'Bikes' ? 'bike' : typeFilter === 'Cars' ? 'car' : 'car'}
          onTypeChange={(newType) => {
            setTypeFilter(newType === 'bike' ? 'Bikes' : newType === 'car' ? 'Cars' : 'All');
          }}
        />

        {/* Right Side: Vehicle Showcase + Image 3 Food List + Vehicle Cards */}
        <div className="rental-main-content-col">


          {/* 2.8 OWNER VEHICLES GRID (Replaces food grid with vehicles added by owner) */}
          <OwnerVehicleGrid
            vehicles={filteredVehicles}
            onOpenVehicleDetails={(vehicle) => {
              // Navigates directly to /rentals/{vehicle-slug} on a new page!
              const slug = toSlug(vehicle.name);
              onNavigate('rentals', slug);
            }}
            onToggleAvailability={(id) => toggleAvailability(id)}
            onOpenAddVehicle={() => onNavigate('rentals', 'AddNewVehicle')}
          />


        </div>
      </div>
    </div>
  );
}
