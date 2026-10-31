import React, { useState, useEffect } from 'react';
import './RentalFilterSidebar.css';

export default function RentalFilterSidebar({ onFilterChange, onReset }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  // Accordion collapsed state for sections
  const [openSections, setOpenSections] = useState({
    brand: true,
    category: true,
    year: false,
    fuel: false,
    mileage: false,
    rentalType: false,
    specifications: false,
    colors: false,
    capacity: false,
    price: false,
    transmission: false,
    rating: false,
    recommendation: false,
  });

  // Selected brands
  const [selectedBrands, setSelectedBrands] = useState({
    Tesla: false,
    Ford: false,
    'Mercediz Benz': false,
    Audi: false,
    Kia: false,
    Toyota: false,
    Porsche: false,
    'Rolls-Royce': false,
    Tata: false,
    Mahindra: false,
    'Maruti Suzuki': false,
    Hyundai: false,
  });

  // Selected categories
  const [selectedCategories, setSelectedCategories] = useState({
    Minivan: false,
    Sport: false,
    Convertible: false,
    'Compact SUV': false,
    'Full-size SUV': false,
    Hatchback: false,
    Sedan: false,
    'Cruiser / Bike': false,
  });

  // Selected fuel types
  const [selectedFuels, setSelectedFuels] = useState({
    Petrol: false,
    Diesel: false,
    Electric: false,
    'Petrol / Hybrid': false,
    CNG: false,
  });

  // Selected transmission
  const [selectedTransmissions, setSelectedTransmissions] = useState({
    Automatic: false,
    Manual: false,
    Gearless: false,
  });

  // Selected seating capacity
  const [selectedSeats, setSelectedSeats] = useState({
    '2 Seats': false,
    '4-Seater': false,
    '5-Seater': false,
    '7 Seats': false,
  });

  const toggleSection = (sec) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const notifyChange = (updatedParams = {}) => {
    if (onFilterChange) {
      onFilterChange({
        brand: updatedParams.brand || selectedBrands,
        categories: updatedParams.categories || selectedCategories,
        fuel: updatedParams.fuel || selectedFuels,
        transmission: updatedParams.transmission || selectedTransmissions,
        seats: updatedParams.seats || selectedSeats,
        availabilityOnly: updatedParams.availabilityOnly !== undefined ? updatedParams.availabilityOnly : availabilityOnly,
        searchTerm: updatedParams.searchTerm !== undefined ? updatedParams.searchTerm : searchTerm,
      });
    }
  };

  const toggleItem = (stateSetter, stateObj, key, filterKey) => {
    const updated = { ...stateObj, [key]: !stateObj[key] };
    stateSetter(updated);
    notifyChange({ [filterKey]: updated });
  };

  const handleReset = () => {
    const resetObj = (obj) => Object.keys(obj).reduce((acc, k) => ({ ...acc, [k]: false }), {});
    const rBrands = resetObj(selectedBrands);
    const rCats = resetObj(selectedCategories);
    const rFuels = resetObj(selectedFuels);
    const rTrans = resetObj(selectedTransmissions);
    const rSeats = resetObj(selectedSeats);

    setSelectedBrands(rBrands);
    setSelectedCategories(rCats);
    setSelectedFuels(rFuels);
    setSelectedTransmissions(rTrans);
    setSelectedSeats(rSeats);
    setAvailabilityOnly(false);
    setSearchTerm('');
    if (onReset) onReset();
  };

  return (
    <aside className="rental-filter-sidebar">
      {/* Header Search */}
      <div className="filter-block-top">
        <h4 className="filter-sidebar-title">What Are You Looking For</h4>
        <div className="filter-search-box">
          <input
            type="text"
            placeholder="Search make, model, type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              notifyChange({ searchTerm: e.target.value });
            }}
          />
          <i className="fa-solid fa-magnifying-glass search-sub-icon"></i>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="filter-row-toggle">
        <span className="toggle-heading">Availability</span>
        <label className="filter-switch-green">
          <input
            type="checkbox"
            checked={availabilityOnly}
            onChange={(e) => {
              setAvailabilityOnly(e.target.checked);
              notifyChange({ availabilityOnly: e.target.checked });
            }}
          />
          <span className="toggle-pill-round"></span>
        </label>
      </div>

      <div className="filter-divider"></div>

      {/* 1. Car Brand Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('brand')}>
          <span>Car Brand</span>
          <i className={`fa-solid fa-chevron-${openSections.brand ? 'up' : 'down'}`}></i>
        </div>
        {openSections.brand && (
          <div className="accordion-body-brands">
            {Object.keys(selectedBrands).map((b) => (
              <label key={b} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedBrands[b]}
                  onChange={() => toggleItem(setSelectedBrands, selectedBrands, b, 'brand')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{b}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 2. Car Category Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('category')}>
          <span>Car Category</span>
          <i className={`fa-solid fa-chevron-${openSections.category ? 'up' : 'down'}`}></i>
        </div>
        {openSections.category && (
          <div className="accordion-body-brands">
            {Object.keys(selectedCategories).map((c) => (
              <label key={c} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedCategories[c]}
                  onChange={() => toggleItem(setSelectedCategories, selectedCategories, c, 'categories')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{c}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 3. Fuel Type Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('fuel')}>
          <span>Fuel Type</span>
          <i className={`fa-solid fa-chevron-${openSections.fuel ? 'up' : 'down'}`}></i>
        </div>
        {openSections.fuel && (
          <div className="accordion-body-brands">
            {Object.keys(selectedFuels).map((f) => (
              <label key={f} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedFuels[f]}
                  onChange={() => toggleItem(setSelectedFuels, selectedFuels, f, 'fuel')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{f}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 4. Transmission Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('transmission')}>
          <span>Transmission</span>
          <i className={`fa-solid fa-chevron-${openSections.transmission ? 'up' : 'down'}`}></i>
        </div>
        {openSections.transmission && (
          <div className="accordion-body-brands">
            {Object.keys(selectedTransmissions).map((t) => (
              <label key={t} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedTransmissions[t]}
                  onChange={() => toggleItem(setSelectedTransmissions, selectedTransmissions, t, 'transmission')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{t}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 5. Seating Capacity Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('capacity')}>
          <span>Capacity</span>
          <i className={`fa-solid fa-chevron-${openSections.capacity ? 'up' : 'down'}`}></i>
        </div>
        {openSections.capacity && (
          <div className="accordion-body-brands">
            {Object.keys(selectedSeats).map((s) => (
              <label key={s} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedSeats[s]}
                  onChange={() => toggleItem(setSelectedSeats, selectedSeats, s, 'seats')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{s}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Other Accordions */}
      {[
        { id: 'year', label: 'Year' },
        { id: 'mileage', label: 'Mileage' },
        { id: 'rentalType', label: 'Rental Type' },
        { id: 'specifications', label: 'Car Specifications' },
        { id: 'colors', label: 'Colors' },
        { id: 'price', label: 'Price' },
        { id: 'rating', label: 'Rating' },
        { id: 'recommendation', label: 'Customer Recommendation' }
      ].map((sec) => (
        <div key={sec.id} className="filter-accordion-item">
          <div className="accordion-header" onClick={() => toggleSection(sec.id)}>
            <span>{sec.label}</span>
            <i className={`fa-solid fa-chevron-${openSections[sec.id] ? 'up' : 'down'}`}></i>
          </div>
          {openSections[sec.id] && (
            <div className="accordion-body-collapsed-msg">
              <span>All {sec.label} options active</span>
            </div>
          )}
        </div>
      ))}

      {/* Action Buttons */}
      <div className="filter-sidebar-actions">
        <button
          type="button"
          className="btn-filter-results"
          onClick={() => notifyChange()}
        >
          <i className="fa-solid fa-filter"></i> Filter results
        </button>

        <button type="button" className="btn-reset-filter" onClick={handleReset}>
          Reset Filter
        </button>
      </div>
    </aside>
  );
}
