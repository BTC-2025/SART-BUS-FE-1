import React, { useState } from 'react';
import './MotorsMarketplace.css';
import RentalFilterSidebar from './rentalVehicles/RentalFilterSidebar';
import './rentalVehicles/rentalVehicles.css';
import './rentalVehicles/OwnerVehicleGrid.css';

const DEFAULT_CARRIER_FLEETS = [
  {
    id: 'CRG-8801',
    name: 'Ashok Leyland 14-Wheeler All India Permit',
    category: 'Heavy Multi-Axle',
    type: 'truck',
    fuel: 'Diesel',
    transmission: 'Manual',
    seats: '3 Seats / Cabin',
    plate: 'RJ 01 G 0252',
    location: 'Tata Steel Hub, Chennai',
    pricingText: '₹18,500/trip | ₹45/km | ₹1,85,000/mo',
    isAvailable: true,
    image: '/images/cargo_truck.jpg',
    rating: 4.9
  },
  {
    id: 'CRG-8802',
    name: 'Indian Railways WAP-7 High-Density Container Rake',
    category: 'Rail Multimodal',
    type: 'train',
    fuel: 'Electric (25kV AC)',
    transmission: 'Traction Inverter',
    seats: '2 Pilots / Guard Escort',
    plate: 'WAP7-23803',
    location: 'Chennai Central Freight Yard',
    pricingText: '₹8,500/parcel | ₹32/km | ₹95,000/mo',
    isAvailable: true,
    image: '/images/cargo_railways.jpg',
    rating: 4.8
  },
  {
    id: 'CRG-8803',
    name: 'City Express Delivery Bike (Insulated Parcel Cargo)',
    category: 'Last-Mile Express',
    type: 'bike',
    fuel: 'Petrol',
    transmission: 'Manual',
    seats: '1 Delivery Pilot',
    plate: 'TN 09 BK 8841',
    location: 'T. Nagar Logistics Depot, Chennai',
    pricingText: '₹450/trip | ₹15/km | ₹12,000/mo',
    isAvailable: true,
    image: '/images/cargo_bike_courier.jpg',
    rating: 4.9
  },
  {
    id: 'CRG-8804',
    name: 'BharatBenz 2823C Heavy Cargo Container Carrier',
    category: 'Heavy Multi-Axle',
    type: 'truck',
    fuel: 'Diesel',
    transmission: 'Manual',
    seats: '3 Seats / Cabin',
    plate: 'MH 12 BB 2823',
    location: 'Koyambedu Logistics Terminal',
    pricingText: '₹22,000/trip | ₹52/km | ₹2,10,000/mo',
    isAvailable: true,
    image: '',
    rating: 4.8
  },
  {
    id: 'CRG-8805',
    name: 'Tata Ultra Reefer Temperature Controlled Van',
    category: 'Cold Chain Pharma',
    type: 'truck',
    fuel: 'Diesel / Telematics',
    transmission: 'Manual',
    seats: '2 Seats',
    plate: 'TN 07 CC 4409',
    location: 'Apollo Pharma Hub, Chennai',
    pricingText: '₹34,000/trip | ₹65/km | ₹3,40,000/mo',
    isAvailable: false,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'CRG-8806',
    name: 'Mahindra Bolero Maxi Truck HD',
    category: 'Last-Mile Express',
    type: 'truck',
    fuel: 'Diesel',
    transmission: 'Manual',
    seats: '2-Seater',
    plate: 'TN 02 MB 5512',
    location: 'Ambattur Industrial Estate',
    pricingText: '₹2,500/day | ₹18/km | ₹45,000/mo',
    isAvailable: true,
    image: '',
    rating: 4.7
  }
];

const CARRIER_CATEGORIES = [
  { id: 'All', label: 'All Fleet', icon: 'fa-table-cells' },
  { id: 'Heavy Multi-Axle', label: 'Heavy Trucks', icon: 'fa-truck-moving' },
  { id: 'Rail Multimodal', label: 'Rail Cargo', icon: 'fa-train' },
  { id: 'Last-Mile Express', label: 'Express Delivery', icon: 'fa-motorcycle' },
  { id: 'Cold Chain Pharma', label: 'Cold Chain', icon: 'fa-snowflake' }
];

export default function Carrier({ partnerDetails, onNavigate = () => { } }) {
  const [fleets, setFleets] = useState(DEFAULT_CARRIER_FLEETS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSideFilters, setActiveSideFilters] = useState(null);

  const FLEETS_PER_PAGE = 6;

  const toggleAvailability = (id) => {
    setFleets((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isAvailable: !f.isAvailable } : f))
    );
  };

  // Filter logic
  const filtered = fleets.filter((f) => {
    if (activeCategory !== 'All' && f.category !== activeCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        f.name.toLowerCase().includes(q) ||
        f.plate.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / FLEETS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * FLEETS_PER_PAGE;
  const paginatedFleets = filtered.slice(startIndex, startIndex + FLEETS_PER_PAGE);

  return (
    <div className="rental-dashboard-wrapper" style={{ gap: '20px' }}>
      {/* 2-Column Split: Left Filter Sidebar + Right 3x2 Grid Cards (Exact Match to User Image) */}
      <div className="rental-main-split-layout">
        {/* Left Side: Filter Sidebar */}
        <RentalFilterSidebar
          onFilterChange={(filters) => {
            setActiveSideFilters(filters);
            if (filters.searchTerm !== undefined) setSearchQuery(filters.searchTerm);
          }}
          onReset={() => {
            setActiveSideFilters(null);
            setSearchQuery('');
            setActiveCategory('All');
          }}
        />

        {/* Right Side: Grid Showcase exactly like Rentals Image */}
        <div className="rental-main-content-col">
          <div className="owner-fleet-grid-container">
            {/* Header: Title + Add Consignment / Carrier Button */}
            <div className="owner-grid-header">
              <div className="owner-header-left">
                <h3 className="owner-grid-heading">Fleet Vehicles</h3>
                <span className="owner-grid-subheading">Managed by Partner Vehicle Owners</span>
              </div>
              <button
                type="button"
                className="btn-add-fleet-vehicle"
                onClick={() => alert('Opening Add Carrier & Goods Consignment...')}
              >
                <i className="fa-solid fa-plus"></i> Add Vehicle
              </button>
            </div>

            {/* Category Filter Chips Bar */}
            <div className="owner-categories-bar">
              {CARRIER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setCurrentPage(1);
                  }}
                >
                  <i className={`fa-solid ${cat.icon}`}></i>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* 3x2 Grid of Cards (Exactly matching image layout) */}
            <div className="owner-vehicles-grid">
              {paginatedFleets.map((carrier) => (
                <div key={carrier.id} className="owner-vehicle-card">
                  {/* Clickable Image Showcase */}
                  <div className="v-card-img-wrapper" title="Click to view details">
                    <img
                      src={carrier.image}
                      alt={carrier.name}
                      className="v-card-img"
                      onError={(e) => {
                        e.currentTarget.src = '/images/Cargo.jpg';
                      }}
                    />
                    <span className="v-card-click-hint">
                      <i className="fa-solid fa-expand"></i> View Details
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="v-card-content">
                    {/* Header Row: Title & Star Rating */}
                    <div className="v-card-header-row">
                      <h4 className="v-card-name">{carrier.name}</h4>
                      <div className="v-card-rating">
                        <i className="fa-solid fa-star"></i>
                        <span>{carrier.rating || '4.8'}</span>
                      </div>
                    </div>

                    {/* Specs Line */}
                    <div className="v-card-specs-line">
                      <span>{carrier.category}</span> • <span>{carrier.fuel}</span> • <span>{carrier.transmission}</span> • <span>{carrier.seats}</span>
                    </div>

                    {/* Registration & Location */}
                    <div className="v-card-meta-line">
                      <span><strong>Reg No:</strong> {carrier.plate}</span>
                      <span><strong>Location:</strong> {carrier.location}</span>
                    </div>

                    {/* Pricing Block */}
                    <div className="v-card-pricing-block">
                      <span className="pricing-tag-label">Pricing:</span>
                      <span className="pricing-tag-val">{carrier.pricingText}</span>
                    </div>

                    {/* Footer: Status Badge & Availability Toggle */}
                    <div className="v-card-status-footer">
                      <span className={`status-tag ${carrier.isAvailable ? 'available' : 'on-trip'}`}>
                        ● {carrier.isAvailable ? 'Available' : 'On Trip'}
                      </span>

                      <label className="simple-switch">
                        <input
                          type="checkbox"
                          checked={carrier.isAvailable}
                          onChange={() => toggleAvailability(carrier.id)}
                        />
                        <span className="slider round green"></span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              {paginatedFleets.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  <i className="fa-solid fa-truck-moving" style={{ fontSize: '36px', marginBottom: '10px', color: '#cbd5e1' }}></i>
                  <h4>No carrier vehicles found in this category</h4>
                </div>
              )}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="owner-pagination-row">
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    className={`page-num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
