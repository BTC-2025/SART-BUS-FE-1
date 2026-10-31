import React, { useState } from 'react';
import './OwnerVehicleGrid.css';

const CATEGORIES = [
  { id: 'All', label: 'All Fleet', icon: 'fa-table-cells' },
  { id: 'Minivan', label: 'Minivan', icon: 'fa-van-shuttle' },
  { id: 'Sport', label: 'Sports', icon: 'fa-car-side' },
  { id: 'Convertible', label: 'Convertible', icon: 'fa-car' },
  { id: 'Compact SUV', label: 'Compact SUV', icon: 'fa-truck-pickup' },
  { id: 'Full-size SUV', label: 'Full SUV', icon: 'fa-car-rear' },
  { id: 'Cruiser', label: 'Bikes / Cruisers', icon: 'fa-motorcycle' },
  { id: 'Hatchback', label: 'Hatchback', icon: 'fa-car' }
];

export default function OwnerVehicleGrid({
  vehicles = [],
  onOpenVehicleDetails = () => { },
  onToggleAvailability = () => { },
  onOpenAddVehicle = () => { }
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // 2 rows of 3 vehicles = 6 vehicles per page
  const VEHICLES_PER_PAGE = 6;

  const filtered = activeCategory === 'All'
    ? vehicles
    : vehicles.filter(v => v.category === activeCategory || (activeCategory === 'Cruiser' && v.type === 'bike'));

  const totalPages = Math.ceil(filtered.length / VEHICLES_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * VEHICLES_PER_PAGE;
  const paginatedVehicles = filtered.slice(startIndex, startIndex + VEHICLES_PER_PAGE);

  // Ensure current page is valid when filter changes
  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  return (
    <div className="owner-fleet-grid-container">
      {/* Header Row: Title & Add Vehicle Button */}
      <div className="owner-grid-header">
        <div className="owner-header-left">
          <h3 className="owner-grid-heading">Fleet Vehicles</h3>
          <span className="owner-grid-subheading">Managed by Partner Vehicle Owners</span>
        </div>
        <button
          type="button"
          className="btn-add-fleet-vehicle"
          onClick={onOpenAddVehicle}
        >
          <i className="fa-solid fa-plus"></i> Add Vehicle
        </button>
      </div>

      {/* Category Filter Bar */}
      <div className="owner-categories-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategorySelect(cat.id)}
          >
            <i className={`fa-solid ${cat.icon}`}></i>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid of Vehicles matching the card design: exactly 2 rows (6 cards max per page) */}
      <div className="owner-vehicles-grid">
        {paginatedVehicles.map(vehicle => (
          <div key={vehicle.id} className="owner-vehicle-card">
            {/* Clickable Vehicle Image (Opens details page) */}
            <div
              className="v-card-img-wrapper"
              onClick={() => onOpenVehicleDetails(vehicle)}
              title="Click to view full vehicle details"
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="v-card-img"
                onError={(e) => {
                  e.target.src = vehicle.type === 'car' ? '/images/cab_sedan.png' : '/images/red_bike_3d.png';
                }}
              />
              <span className="v-card-click-hint">
                <i className="fa-solid fa-expand"></i> View Details
              </span>
            </div>

            {/* Card Content */}
            <div className="v-card-content">
              {/* Title & Rating */}
              <div className="v-card-header-row">
                <h4
                  className="v-card-name"
                  onClick={() => onOpenVehicleDetails(vehicle)}
                >
                  {vehicle.name}
                </h4>
                <div className="v-card-rating">
                  <i className="fa-solid fa-star"></i>
                  <span>4.8</span>
                </div>
              </div>

              {/* Specs Subtitle */}
              <div className="v-card-specs-line">
                <span>{vehicle.category}</span> • <span>{vehicle.fuel || 'Petrol / Hybrid'}</span> • <span>{vehicle.transmission}</span> • <span>{vehicle.seats}</span>
              </div>

              {/* Reg No & Location */}
              <div className="v-card-meta-line">
                <span><strong>Reg No:</strong> {vehicle.plate}</span>
                <span><strong>Location:</strong> {vehicle.location || 'Baner, Pune'}</span>
              </div>

              {/* Pricing Line */}
              <div className="v-card-pricing-block">
                <span className="pricing-tag-label">Pricing:</span>
                <span className="pricing-tag-val">{vehicle.pricingText}</span>
              </div>

              {/* Footer: Availability Badge & Toggle Switch */}
              <div className="v-card-status-footer">
                <span className={`status-tag ${vehicle.isAvailable ? 'available' : 'on-trip'}`}>
                  ● {vehicle.isAvailable ? 'Available' : 'On Trip'}
                </span>

                <label className="simple-switch">
                  <input
                    type="checkbox"
                    checked={vehicle.isAvailable}
                    onChange={() => onToggleAvailability(vehicle.id)}
                  />
                  <span className="slider round green"></span>
                </label>
              </div>
            </div>
          </div>
        ))}

        {paginatedVehicles.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <i className="fa-solid fa-car-side" style={{ fontSize: '36px', marginBottom: '10px', color: '#cbd5e1' }}></i>
            <h4>No vehicles found in this category</h4>
          </div>
        )}
      </div>

      {/* Pagination Footer: 2 Rows per page, remaining on page 2 */}
      {totalPages > 1 && (
        <div className="owner-pagination-row">
          <button
            type="button"
            className="page-nav-arrow"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            title="Previous Page"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <button
              key={pageNumber}
              type="button"
              className={`page-number-btn ${currentPage === pageNumber ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            className="page-nav-arrow"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            title="Next Page"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

