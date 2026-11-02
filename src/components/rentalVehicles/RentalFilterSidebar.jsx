import React, { useState, useEffect } from 'react';
import './RentalFilterSidebar.css';

// Pre-defined brands and models database per vehicle type
export const CAR_BRANDS_MODELS = {
  'Tata': ['Nexon', 'Punch', 'Harrier', 'Safari', 'Tiago', 'Altroz'],
  'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Dzire'],
  'Mahindra': ['Thar', 'Scorpio-N', 'XUV700', 'Bolero'],
  'Hyundai': ['Creta', 'Venue', 'i20', 'Verna', 'Exter'],
  'Toyota': ['Alphard', 'Innova Crysta', 'Fortuner', 'Urban Cruiser Hyryder', 'Glanza'],
  'Kia': ['Seltos', 'Sonet', 'Carens'],
  'Porsche': ['911 Carrera', 'Cayenne', 'Panamera'],
  'Rolls-Royce': ['Dawn', 'Phantom', 'Ghost'],
  'Tesla': ['Model 3', 'Model Y', 'Model S'],
  'Ford': ['Mustang', 'Endeavour', 'EcoSport'],
  'Mercediz Benz': ['C-Class', 'E-Class', 'GLC'],
  'Audi': ['A4', 'A6', 'Q3', 'Q7'],
};

export const BIKE_BRANDS_MODELS = {
  'Royal Enfield': ['Classic 350', 'Hunter 350', 'Himalayan', 'Meteor 350', 'Bullet 350'],
  'Yamaha': ['R15 V4', 'MT-15', 'FZ-S', 'Aerox 155'],
  'TVS': ['Apache RTR 160/200', 'Jupiter', 'Ntorq 125', 'Ronin'],
  'Bajaj': ['Pulsar NS200', 'Pulsar 150', 'Dominar 400', 'Chetak EV'],
  'Honda 2-Wheelers': ['Activa 6G', 'Shine 125', 'Hornet 2.0', 'Hness CB350'],
  'Hero': ['Splendor Plus', 'HF Deluxe', 'Xpulse 200 4V'],
  'KTM': ['Duke 200', 'Duke 390', 'RC 200'],
  'Ola Electric': ['S1 Pro', 'S1 Air', 'S1 X'],
  'Ather': ['450X', '450S', 'Rizta']
};

export const OTHER_BRANDS_MODELS = {
  'Ashok Leyland': ['14-Wheeler All India Permit', 'Dost', 'Bada Dost', 'Boss'],
  'Tata Commercial': ['Winger', 'Magic', 'Ace Gold', 'Signa Heavy Truck', 'Ultra Reefer Van'],
  'BharatBenz': ['2823C Heavy Cargo Container', '3528CM Tipper', 'Heavy Container Carrier'],
  'Mahindra Commercial': ['Bolero Maxi Truck HD', 'Supro HD', 'Furio 14'],
  'Indian Railways': ['WAP-7 High-Density Container Rake', 'Container Freight Train', 'Parcel Van Rake'],
  'Force Motors': ['Traveller', 'Trax Cruiser', 'Urbania'],
  'Eicher Motors': ['Pro 2049', 'Pro 3015', 'Pro 6028']
};

export default function RentalFilterSidebar({
  onFilterChange,
  onReset,
  selectedType = 'all',
  onTypeChange = () => { }
}) {
  const [vehicleType, setVehicleType] = useState(selectedType); // 'all' | 'car' | 'bike' | 'other'
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  // Accordion state
  const [openSections, setOpenSections] = useState({
    brand: true,
    model: true,
    fuel: false,
    transmission: false,
    capacity: false,
    colors: false,
    rentalPlan: false
  });

  // Selected filters
  const [selectedBrands, setSelectedBrands] = useState({});
  const [selectedModels, setSelectedModels] = useState({});
  const [selectedFuels, setSelectedFuels] = useState({});
  const [selectedTransmissions, setSelectedTransmissions] = useState({});
  const [selectedCapacities, setSelectedCapacities] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedRentalPlans, setSelectedRentalPlans] = useState({});

  // Sync external type
  useEffect(() => {
    if (selectedType && selectedType !== vehicleType) {
      setVehicleType(selectedType);
    }
  }, [selectedType]);

  // When vehicleType changes, reset sub-filters to avoid invalid selections
  useEffect(() => {
    setSelectedBrands({});
    setSelectedModels({});
    setSelectedFuels({});
    setSelectedTransmissions({});
    setSelectedCapacities({});
    setSelectedColors({});
    setSelectedRentalPlans({});
  }, [vehicleType]);

  const toggleSection = (sec) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const getBrandModelMap = () => {
    if (vehicleType === 'bike') return BIKE_BRANDS_MODELS;
    if (vehicleType === 'other') return OTHER_BRANDS_MODELS;
    if (vehicleType === 'car') return CAR_BRANDS_MODELS;
    // 'all' includes combined brands & models
    return {
      ...CAR_BRANDS_MODELS,
      ...BIKE_BRANDS_MODELS,
      ...OTHER_BRANDS_MODELS
    };
  };

  const currentBrandMap = getBrandModelMap();
  const availableBrands = Object.keys(currentBrandMap);

  const activeBrandNames = Object.keys(selectedBrands).filter(b => selectedBrands[b]);
  const availableModels = activeBrandNames.length > 0
    ? Array.from(new Set(activeBrandNames.flatMap(b => currentBrandMap[b] || [])))
    : Array.from(new Set(Object.values(currentBrandMap).flat()));

  // Dynamic Fuel Types
  const availableFuels = vehicleType === 'bike'
    ? ['Petrol', 'Electric (EV)']
    : vehicleType === 'other'
      ? ['Diesel', 'Electric (25kV AC)', 'Electric (EV)', 'CNG']
      : ['Petrol', 'Diesel', 'CNG', 'Electric (EV)', 'Electric (25kV AC)', 'Petrol / Hybrid'];

  // Dynamic Transmissions
  const availableTransmissions = vehicleType === 'bike'
    ? ['Manual', 'Gearless / Automatic']
    : vehicleType === 'other'
      ? ['Manual', 'Automatic', 'Traction Inverter', 'Both']
      : ['Manual', 'Automatic', 'Both'];

  // Dynamic Seating Capacities
  const availableCapacities = vehicleType === 'bike'
    ? ['1 Delivery Pilot', '1-Seater', '2-Seater']
    : vehicleType === 'other'
      ? ['1 Delivery Pilot', '2 Pilots / Guard Escort', '2 Seats', '3 Seats / Cabin', '2-Seater', '7 Seats']
      : ['2 Seats', '4-Seater', '5-Seater', '7 Seats', '8-Seater'];

  // Colors
  const availableColors = ['Blue', 'White', 'Silver', 'Black', 'Red', 'Grey', 'Yellow', 'Green'];

  // Pricing & Rental Plans
  const availableRentalPlans = ['Rent Per Hour (₹/hr)', 'Rent Per Day (₹/day)', 'Rent Per Month (₹/month)', 'Per Trip (₹/trip)', 'Per Km (₹/km)'];

  const notifyChange = (override = {}) => {
    if (onFilterChange) {
      onFilterChange({
        vehicleType: override.vehicleType !== undefined ? override.vehicleType : vehicleType,
        searchTerm: override.searchTerm !== undefined ? override.searchTerm : searchTerm,
        availabilityOnly: override.availabilityOnly !== undefined ? override.availabilityOnly : availabilityOnly,
        brands: override.selectedBrands || selectedBrands,
        models: override.selectedModels || selectedModels,
        fuels: override.selectedFuels || selectedFuels,
        transmissions: override.selectedTransmissions || selectedTransmissions,
        capacities: override.selectedCapacities || selectedCapacities,
        colors: override.selectedColors || selectedColors,
        rentalPlans: override.selectedRentalPlans || selectedRentalPlans
      });
    }
  };

  const toggleItem = (setter, currentObj, key, fieldName) => {
    const updated = { ...currentObj, [key]: !currentObj[key] };
    setter(updated);
    notifyChange({ [fieldName]: updated });
  };

  const handleTypeSelectChange = (newType) => {
    setVehicleType(newType);
    onTypeChange(newType);
    notifyChange({
      vehicleType: newType,
      selectedBrands: {},
      selectedModels: {},
      selectedFuels: {},
      selectedTransmissions: {},
      selectedCapacities: {},
      selectedColors: {},
      selectedRentalPlans: {}
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setAvailabilityOnly(false);
    setSelectedBrands({});
    setSelectedModels({});
    setSelectedFuels({});
    setSelectedTransmissions({});
    setSelectedCapacities({});
    setSelectedColors({});
    setSelectedRentalPlans({});
    if (onReset) onReset();
    notifyChange({
      vehicleType,
      searchTerm: '',
      availabilityOnly: false,
      selectedBrands: {},
      selectedModels: {},
      selectedFuels: {},
      selectedTransmissions: {},
      selectedCapacities: {},
      selectedColors: {},
      selectedRentalPlans: {}
    });
  };

  const typeLabel = vehicleType === 'bike' ? 'Bike' : vehicleType === 'other' ? 'Commercial' : vehicleType === 'car' ? 'Car' : 'Vehicle';

  return (
    <aside className="rental-filter-sidebar">
      {/* 1. Header Search Bar: "What Are You Looking For" */}
      <div className="filter-block-top">
        <h4 className="filter-sidebar-title">What Are You Looking For</h4>
        <div className="filter-search-box">
          <input
            type="text"
            placeholder={`Search ${typeLabel.toLowerCase()} make, model, type...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              notifyChange({ searchTerm: e.target.value });
            }}
          />
          <i className="fa-solid fa-magnifying-glass search-sub-icon"></i>
        </div>
      </div>

      {/* DROPDOWN FOR VEHICLE TYPE SELECTOR (Converted from button pills as requested) */}
      <div className="filter-type-dropdown-container">
        <label className="filter-type-dropdown-label">Select Vehicle Category</label>
        <div className="filter-type-select-wrap">
          <select
            value={vehicleType}
            onChange={(e) => handleTypeSelectChange(e.target.value)}
            className="filter-type-select"
          >
            <option value="all">🌐 All Vehicles & Fleets</option>
            <option value="car">🚗 Cars & Cabs</option>
            <option value="bike">🏍️ Bikes & Two-Wheelers</option>
            <option value="other">🚚 Commercial & Carriers</option>
          </select>
          <i className="fa-solid fa-chevron-down filter-select-arrow"></i>
        </div>
      </div>

      {/* 2. Availability Toggle */}
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

      {/* 3. Dynamic Brand Accordion (Car Brand / Bike Brand / Other Brand) */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('brand')}>
          <span>{typeLabel} Brand</span>
          <i className={`fa-solid fa-chevron-${openSections.brand ? 'up' : 'down'}`}></i>
        </div>
        {openSections.brand && (
          <div className="accordion-body-brands">
            {availableBrands.map((b) => (
              <label key={b} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedBrands[b]}
                  onChange={() => toggleItem(setSelectedBrands, selectedBrands, b, 'selectedBrands')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{b}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 4. Dynamic Model Accordion (Car Model / Bike Model) */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('model')}>
          <span>{typeLabel} Model</span>
          <i className={`fa-solid fa-chevron-${openSections.model ? 'up' : 'down'}`}></i>
        </div>
        {openSections.model && (
          <div className="accordion-body-brands">
            {availableModels.map((m) => (
              <label key={m} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedModels[m]}
                  onChange={() => toggleItem(setSelectedModels, selectedModels, m, 'selectedModels')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{m}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 5. Fuel Type Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('fuel')}>
          <span>Fuel Type</span>
          <i className={`fa-solid fa-chevron-${openSections.fuel ? 'up' : 'down'}`}></i>
        </div>
        {openSections.fuel && (
          <div className="accordion-body-brands">
            {availableFuels.map((f) => (
              <label key={f} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedFuels[f]}
                  onChange={() => toggleItem(setSelectedFuels, selectedFuels, f, 'selectedFuels')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{f}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 6. Transmission Accordion (Manual / Automatic / Both) */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('transmission')}>
          <span>Transmission</span>
          <i className={`fa-solid fa-chevron-${openSections.transmission ? 'up' : 'down'}`}></i>
        </div>
        {openSections.transmission && (
          <div className="accordion-body-brands">
            {availableTransmissions.map((t) => (
              <label key={t} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedTransmissions[t]}
                  onChange={() => toggleItem(setSelectedTransmissions, selectedTransmissions, t, 'selectedTransmissions')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{t}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 7. Seating Capacity Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('capacity')}>
          <span>Seating Capacity</span>
          <i className={`fa-solid fa-chevron-${openSections.capacity ? 'up' : 'down'}`}></i>
        </div>
        {openSections.capacity && (
          <div className="accordion-body-brands">
            {availableCapacities.map((c) => (
              <label key={c} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedCapacities[c]}
                  onChange={() => toggleItem(setSelectedCapacities, selectedCapacities, c, 'selectedCapacities')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{c}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 8. Colors Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('colors')}>
          <span>Colors</span>
          <i className={`fa-solid fa-chevron-${openSections.colors ? 'up' : 'down'}`}></i>
        </div>
        {openSections.colors && (
          <div className="accordion-body-brands">
            {availableColors.map((col) => (
              <label key={col} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedColors[col]}
                  onChange={() => toggleItem(setSelectedColors, selectedColors, col, 'selectedColors')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{col}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 9. Pricing & Rental Plan Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('rentalPlan')}>
          <span>Pricing & Rental Plan</span>
          <i className={`fa-solid fa-chevron-${openSections.rentalPlan ? 'up' : 'down'}`}></i>
        </div>
        {openSections.rentalPlan && (
          <div className="accordion-body-brands">
            {availableRentalPlans.map((plan) => (
              <label key={plan} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedRentalPlans[plan]}
                  onChange={() => toggleItem(setSelectedRentalPlans, selectedRentalPlans, plan, 'selectedRentalPlans')}
                />
                <span className="checkbox-custom-mark"></span>
                <span className="brand-name-text">{plan}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="filter-sidebar-actions">
        <button
          type="button"
          className="btn-filter-results"
          onClick={() => notifyChange()}
        >
          <i className="fa-solid fa-filter"></i> Apply Filters
        </button>

        <button type="button" className="btn-reset-filter" onClick={handleReset}>
          Reset Filter
        </button>
      </div>
    </aside>
  );
}
