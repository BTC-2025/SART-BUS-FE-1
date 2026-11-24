import React, { useState } from 'react';
import './rentalVehicles/RentalFilterSidebar.css';

// Space Types
export const PARKING_SPACE_TYPES = [
  'Open Yard',
  'Covered Shed',
  'Basement',
  'Driveway',
  'Multi-Level Yard'
];

// Vehicle Compatibility Types
export const PARKING_VEHICLE_TYPES = [
  { id: '2-Wheeler', label: '2-Wheeler (Bikes / Scooters)' },
  { id: '4-Wheeler', label: '4-Wheeler (Cars / Sedans / SUVs)' },
  { id: 'Trucks', label: '8 or 10 Wheeler Trucks or more' },
  { id: 'Bus', label: 'Bus / Commercial Passenger' }
];

// Security & Amenities
export const PARKING_SECURITY_AMENITIES = [
  'CCTV Surveillance',
  '24/7 Security Guard',
  'Gated / Boundary Wall',
  'Night Floodlights',
  'Boom Barrier',
  'Fast Exit / Entry',
  'EV Charging Bay',
  'Covered Roof / Shade'
];

// Pricing & Tariff Plans
export const PARKING_TARIFF_PLANS = [
  'Hourly Tariff (Under ₹30/hr)',
  'Hourly Tariff (₹30 - ₹60/hr)',
  'Daily Pass (Under ₹200/day)',
  'Monthly Pass Available'
];

interface ParkingFilterSidebarProps {
  onFilterChange?: (filters: any) => void;
  onReset?: () => void;
}

export default function ParkingFilterSidebar({
  onFilterChange = (_filters: any) => { },
  onReset = () => { }
}: ParkingFilterSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  // Accordion Sections
  const [openSections, setOpenSections] = useState({
    spaceType: true,
    vehicleType: true,
    security: true,
    tariff: false
  });

  // Selected filters
  const [selectedSpaceTypes, setSelectedSpaceTypes] = useState<Record<string, boolean>>({});
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<Record<string, boolean>>({});
  const [selectedSecurity, setSelectedSecurity] = useState<Record<string, boolean>>({});
  const [selectedTariff, setSelectedTariff] = useState<Record<string, boolean>>({});

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const notifyChange = (updated: {
    searchTerm?: string;
    availabilityOnly?: boolean;
    spaceTypes?: Record<string, boolean>;
    vehicleTypes?: Record<string, boolean>;
    securityFeatures?: Record<string, boolean>;
    tariffPlans?: Record<string, boolean>;
  }) => {
    onFilterChange({
      searchTerm: updated.searchTerm !== undefined ? updated.searchTerm : searchTerm,
      availabilityOnly: updated.availabilityOnly !== undefined ? updated.availabilityOnly : availabilityOnly,
      spaceTypes: updated.spaceTypes !== undefined ? updated.spaceTypes : selectedSpaceTypes,
      vehicleTypes: updated.vehicleTypes !== undefined ? updated.vehicleTypes : selectedVehicleTypes,
      securityFeatures: updated.securityFeatures !== undefined ? updated.securityFeatures : selectedSecurity,
      tariffPlans: updated.tariffPlans !== undefined ? updated.tariffPlans : selectedTariff
    });
  };

  const handleCheckboxToggle = (
    setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    key: string,
    filterName: 'spaceTypes' | 'vehicleTypes' | 'securityFeatures' | 'tariffPlans'
  ) => {
    setter(prev => {
      const next = { ...prev, [key]: !prev[key] };
      notifyChange({ [filterName]: next });
      return next;
    });
  };

  const handleApply = () => {
    notifyChange({});
  };

  const handleReset = () => {
    setSearchTerm('');
    setAvailabilityOnly(false);
    setSelectedSpaceTypes({});
    setSelectedVehicleTypes({});
    setSelectedSecurity({});
    setSelectedTariff({});
    onFilterChange({
      searchTerm: '',
      availabilityOnly: false,
      spaceTypes: {},
      vehicleTypes: {},
      securityFeatures: {},
      tariffPlans: {}
    });
    onReset();
  };

  return (
    <div className="rental-filter-sidebar">
      {/* 1. Search Box */}
      <div className="filter-block-top">
        <h4 className="filter-sidebar-title">What Are You Looking For</h4>
        <div className="filter-search-box">
          <input
            type="text"
            placeholder="Search yard name, landmark, locality..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              notifyChange({ searchTerm: e.target.value });
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
          />
          <span className="search-sub-icon">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>
      </div>

      {/* 2. Available Slots Only Toggle */}
      <div className="filter-row-toggle">
        <span className="toggle-heading">Available Slots Only</span>
        <label className="filter-switch-green">
          <input
            type="checkbox"
            checked={availabilityOnly}
            onChange={(e) => {
              const val = e.target.checked;
              setAvailabilityOnly(val);
              notifyChange({ availabilityOnly: val });
            }}
          />
          <span className="toggle-pill-round"></span>
        </label>
      </div>

      <div className="filter-divider"></div>

      {/* 3. Parking Space Type Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('spaceType')}>
          <span>Parking Space Type</span>
          <i className={`fa-solid fa-chevron-${openSections.spaceType ? 'up' : 'down'}`}></i>
        </div>
        {openSections.spaceType && (
          <div className="accordion-body-brands">
            {PARKING_SPACE_TYPES.map((type) => (
              <label key={type} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedSpaceTypes[type]}
                  onChange={() => handleCheckboxToggle(setSelectedSpaceTypes, type, 'spaceTypes')}
                />
                <span className="brand-name-text">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 4. Vehicle Compatibility Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('vehicleType')}>
          <span>Vehicle Compatibility</span>
          <i className={`fa-solid fa-chevron-${openSections.vehicleType ? 'up' : 'down'}`}></i>
        </div>
        {openSections.vehicleType && (
          <div className="accordion-body-brands">
            {PARKING_VEHICLE_TYPES.map((v) => (
              <label key={v.id} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedVehicleTypes[v.id]}
                  onChange={() => handleCheckboxToggle(setSelectedVehicleTypes, v.id, 'vehicleTypes')}
                />
                <span className="brand-name-text">{v.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 5. Security & Amenities Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('security')}>
          <span>Security & Amenities</span>
          <i className={`fa-solid fa-chevron-${openSections.security ? 'up' : 'down'}`}></i>
        </div>
        {openSections.security && (
          <div className="accordion-body-brands">
            {PARKING_SECURITY_AMENITIES.map((feat) => (
              <label key={feat} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedSecurity[feat]}
                  onChange={() => handleCheckboxToggle(setSelectedSecurity, feat, 'securityFeatures')}
                />
                <span className="brand-name-text">{feat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 6. Tariff & Billing Plans Accordion */}
      <div className="filter-accordion-item">
        <div className="accordion-header" onClick={() => toggleSection('tariff')}>
          <span>Tariff & Billing Plans</span>
          <i className={`fa-solid fa-chevron-${openSections.tariff ? 'up' : 'down'}`}></i>
        </div>
        {openSections.tariff && (
          <div className="accordion-body-brands">
            {PARKING_TARIFF_PLANS.map((plan) => (
              <label key={plan} className="checkbox-brand-label">
                <input
                  type="checkbox"
                  checked={!!selectedTariff[plan]}
                  onChange={() => handleCheckboxToggle(setSelectedTariff, plan, 'tariffPlans')}
                />
                <span className="brand-name-text">{plan}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 7. Action Buttons */}
      <div className="filter-sidebar-actions">
        <button type="button" className="btn-filter-results" onClick={handleApply}>
          <i className="fa-solid fa-filter"></i> Apply Filters
        </button>
        <button type="button" className="btn-reset-filter" onClick={handleReset}>
          Reset Filter
        </button>
      </div>
    </div>
  );
}
