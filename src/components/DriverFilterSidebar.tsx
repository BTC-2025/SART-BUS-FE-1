import React, { useState, useEffect } from 'react';
import './rentalVehicles/RentalFilterSidebar.css';

export interface DriverFilterState {
  searchTerm?: string;
  driverCategory?: string;
  availabilityOnly?: boolean;
  selectedCategories?: string[];
  selectedRateCard?: string;
  selectedExperience?: string[];
  selectedSpecialization?: string[];
  selectedShifts?: string[];
  selectedRegion?: string;
  selectedRating?: string;
}

interface DriverFilterSidebarProps {
  onFilterChange: (filters: DriverFilterState) => void;
  onReset: () => void;
}

export default function DriverFilterSidebar({
  onFilterChange,
  onReset
}: DriverFilterSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [driverCategory, setDriverCategory] = useState('All Fleet Drivers');
  const [availabilityOnly, setAvailabilityOnly] = useState(true);

  // Accordion toggles
  const [openSections, setOpenSections] = useState({
    fleetDrivers: true,
    rateCard: true,
    experience: true,
    specialization: false,
    dutyShift: false,
    serviceRegion: false,
    driverRating: false
  });

  const toggleSection = (sec: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Checkbox selections for Fleet Drivers category
  const [selectedDriverTypes, setSelectedDriverTypes] = useState<Record<string, boolean>>({
    'All Fleet Drivers': false,
    'Bike Drivers': false,
    'Car Drivers': false,
    'Truck Drivers (6W / 10W / 12W)': false,
    'Flight Pilots / Drivers': false,
    'Ship / Maritime Captains': false
  });

  // Radio selection for Rate Card / Charges
  const [selectedRateCard, setSelectedRateCard] = useState<string>('');

  // Experience & Verified Status
  const [selectedExperience, setSelectedExperience] = useState<Record<string, boolean>>({
    '8+ Years Experience': false,
    'Police Verified': false,
    'Commercial DL': false
  });

  // Specialization
  const [selectedSpecialization, setSelectedSpecialization] = useState<Record<string, boolean>>({
    'Luxury / VIP Chauffeur': false,
    'Heavy Cargo & Multi-Axle': false,
    'Night Long-Haul Expert': false,
    'Emergency & Ambulance Certified': false
  });

  // Duty Shift & Hours
  const [selectedShifts, setSelectedShifts] = useState<Record<string, boolean>>({
    'Day Shift (8 AM - 5 PM)': false,
    'Night Shift (8 PM - 5 AM)': false,
    '24/7 On-Call Fleet Driver': false
  });

  // Region
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const handleApply = () => {
    const activeTypes = Object.entries(selectedDriverTypes)
      .filter(([_, checked]) => checked)
      .map(([k]) => k);

    const activeExp = Object.entries(selectedExperience)
      .filter(([_, checked]) => checked)
      .map(([k]) => k);

    const activeSpec = Object.entries(selectedSpecialization)
      .filter(([_, checked]) => checked)
      .map(([k]) => k);

    const activeShifts = Object.entries(selectedShifts)
      .filter(([_, checked]) => checked)
      .map(([k]) => k);

    onFilterChange({
      searchTerm,
      driverCategory,
      availabilityOnly,
      selectedCategories: activeTypes,
      selectedRateCard,
      selectedExperience: activeExp,
      selectedSpecialization: activeSpec,
      selectedShifts: activeShifts,
      selectedRegion,
      selectedRating
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setDriverCategory('All Fleet Drivers');
    setAvailabilityOnly(true);
    setSelectedDriverTypes({
      'All Fleet Drivers': false,
      'Bike Drivers': false,
      'Car Drivers': false,
      'Truck Drivers (6W / 10W / 12W)': false,
      'Flight Pilots / Drivers': false,
      'Ship / Maritime Captains': false
    });
    setSelectedRateCard('');
    setSelectedExperience({
      '8+ Years Experience': false,
      'Police Verified': false,
      'Commercial DL': false
    });
    setSelectedSpecialization({
      'Luxury / VIP Chauffeur': false,
      'Heavy Cargo & Multi-Axle': false,
      'Night Long-Haul Expert': false,
      'Emergency & Ambulance Certified': false
    });
    setSelectedShifts({
      'Day Shift (8 AM - 5 PM)': false,
      'Night Shift (8 PM - 5 AM)': false,
      '24/7 On-Call Fleet Driver': false
    });
    setSelectedRegion('');
    setSelectedRating('');
    onReset();
  };

  return (
    <aside className="rental-filter-sidebar">
      {/* 1. What Are You Looking For Search Box */}
      <div className="filter-block-top">
        <label
          style={{
            fontSize: '13px',
            fontWeight: 800,
            color: '#1e293b',
            display: 'block',
            marginBottom: '6px'
          }}
        >
          What Are You Looking For
        </label>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="Search driver name, location, DL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0 34px 0 12px',
              fontSize: '12.5px',
              color: '#334155',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <i
            className="fa-solid fa-magnifying-glass"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              fontSize: '13px',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>

      {/* 2. SELECT FLEET DRIVER CATEGORY Dropdown */}
      <div className="filter-group-top">
        <label
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'block',
            marginBottom: '6px'
          }}
        >
          SELECT FLEET DRIVER CATEGORY
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={driverCategory}
            onChange={(e) => {
              setDriverCategory(e.target.value);
            }}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              color: '#0f172a',
              appearance: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All Fleet Drivers">All Fleet Drivers</option>
            <option value="Bike Drivers">Bike Drivers</option>
            <option value="Car Drivers">Car Drivers</option>
            <option value="Truck Drivers">Truck Drivers (6W / 10W / 12W)</option>
            <option value="Flight Pilots">Flight Pilots / Drivers</option>
            <option value="Ship Captains">Ship / Maritime Captains</option>
          </select>
          <i
            className="fa-solid fa-chevron-down"
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              fontSize: '12px',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>

      {/* 3. Availability Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0 14px 0',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Availability</span>
        <label
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '42px',
            height: '24px',
            cursor: 'pointer'
          }}
        >
          <input
            type="checkbox"
            checked={availabilityOnly}
            onChange={(e) => setAvailabilityOnly(e.target.checked)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: availabilityOnly ? '#0284c7' : '#cbd5e1',
              borderRadius: '24px',
              transition: '0.2s',
              boxShadow: availabilityOnly ? '0 2px 6px rgba(2, 132, 199, 0.4)' : 'none'
            }}
          >
            <span
              style={{
                position: 'absolute',
                content: '""',
                height: '18px',
                width: '18px',
                left: availabilityOnly ? '20px' : '3px',
                bottom: '3px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                transition: '0.2s'
              }}
            />
          </span>
        </label>
      </div>

      {/* 3. Fleet Drivers (Accordion) */}
      <div className="filter-accordion-item">
        <div className="filter-accordion-header" onClick={() => toggleSection('fleetDrivers')}>
          <span className="filter-accordion-title">Fleet Drivers</span>
          <i className={`fa-solid fa-chevron-${openSections.fleetDrivers ? 'up' : 'down'}`} />
        </div>
        {openSections.fleetDrivers && (
          <div className="filter-accordion-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            {[
              'All Fleet Drivers',
              'Bike Drivers',
              'Car Drivers',
              'Truck Drivers (6W / 10W / 12W)',
              'Flight Pilots / Drivers',
              'Ship / Maritime Captains'
            ].map((name) => (
              <label key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(selectedDriverTypes[name])}
                  onChange={(e) => {
                    setSelectedDriverTypes(prev => ({
                      ...prev,
                      [name]: e.target.checked
                    }));
                  }}
                  style={{ accentColor: '#0f172a', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span>{name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 4. Rate Card / Charges (Accordion with Radio Buttons) */}
      <div className="filter-accordion-item">
        <div className="filter-accordion-header" onClick={() => toggleSection('rateCard')}>
          <span className="filter-accordion-title">Rate Card / Charges</span>
          <i className={`fa-solid fa-chevron-${openSections.rateCard ? 'up' : 'down'}`} />
        </div>
        {openSections.rateCard && (
          <div className="filter-accordion-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            {[
              { id: 'hourly', label: 'Hourly: ₹120/hr' },
              { id: 'daily', label: 'Daily (8 Hrs): ₹800' },
              { id: 'outstation', label: 'Outstation: ₹1,800/day' },
              { id: 'custom', label: 'Custom Rate / Long Trip' }
            ].map((rc) => (
              <label
                key={rc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  color: '#334155',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="rateCardRadio"
                  checked={selectedRateCard === rc.id}
                  onChange={() => setSelectedRateCard(rc.id)}
                  style={{ accentColor: '#0284c7', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span>{rc.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 5. Experience & Verified Status (Accordion) */}
      <div className="filter-accordion-item">
        <div className="filter-accordion-header" onClick={() => toggleSection('experience')}>
          <span className="filter-accordion-title">Experience &amp; Verified Status</span>
          <i className={`fa-solid fa-chevron-${openSections.experience ? 'up' : 'down'}`} />
        </div>
        {openSections.experience && (
          <div className="filter-accordion-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            {[
              '8+ Years Experience',
              'Police Verified',
              'Commercial DL'
            ].map((exp) => (
              <label key={exp} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(selectedExperience[exp])}
                  onChange={(e) => {
                    setSelectedExperience(prev => ({
                      ...prev,
                      [exp]: e.target.checked
                    }));
                  }}
                  style={{ accentColor: '#0f172a', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span>{exp}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 6. Driver Specialization (Accordion) */}
      <div className="filter-accordion-item">
        <div className="filter-accordion-header" onClick={() => toggleSection('specialization')}>
          <span className="filter-accordion-title">Driver Specialization</span>
          <i className={`fa-solid fa-chevron-${openSections.specialization ? 'up' : 'down'}`} />
        </div>
        {openSections.specialization && (
          <div className="filter-accordion-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            {[
              'Luxury / VIP Chauffeur',
              'Heavy Cargo & Multi-Axle',
              'Night Long-Haul Expert',
              'Emergency & Ambulance Certified'
            ].map((spec) => (
              <label key={spec} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(selectedSpecialization[spec])}
                  onChange={(e) => {
                    setSelectedSpecialization(prev => ({
                      ...prev,
                      [spec]: e.target.checked
                    }));
                  }}
                  style={{ accentColor: '#0f172a', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span>{spec}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 7. Duty Shift & Hours (Accordion) */}
      <div className="filter-accordion-item">
        <div className="filter-accordion-header" onClick={() => toggleSection('dutyShift')}>
          <span className="filter-accordion-title">Duty Shift &amp; Hours</span>
          <i className={`fa-solid fa-chevron-${openSections.dutyShift ? 'up' : 'down'}`} />
        </div>
        {openSections.dutyShift && (
          <div className="filter-accordion-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            {[
              'Day Shift (8 AM - 5 PM)',
              'Night Shift (8 PM - 5 AM)',
              '24/7 On-Call Fleet Driver'
            ].map((shift) => (
              <label key={shift} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(selectedShifts[shift])}
                  onChange={(e) => {
                    setSelectedShifts(prev => ({
                      ...prev,
                      [shift]: e.target.checked
                    }));
                  }}
                  style={{ accentColor: '#0f172a', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span>{shift}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 8. Service Region / Pincode (Accordion) */}
      <div className="filter-accordion-item">
        <div className="filter-accordion-header" onClick={() => toggleSection('serviceRegion')}>
          <span className="filter-accordion-title">Service Region / Pincode</span>
          <i className={`fa-solid fa-chevron-${openSections.serviceRegion ? 'up' : 'down'}`} />
        </div>
        {openSections.serviceRegion && (
          <div className="filter-accordion-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            {['All Regions', 'Gurugram / Cyber City', 'Delhi NCR', 'Chennai', 'Mumbai'].map((reg) => (
              <label
                key={reg}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="regionRadio"
                  checked={selectedRegion === reg}
                  onChange={() => setSelectedRegion(reg)}
                  style={{ accentColor: '#0284c7', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span>{reg}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 9. Driver Rating (Accordion) */}
      <div className="filter-accordion-item">
        <div className="filter-accordion-header" onClick={() => toggleSection('driverRating')}>
          <span className="filter-accordion-title">Driver Rating</span>
          <i className={`fa-solid fa-chevron-${openSections.driverRating ? 'up' : 'down'}`} />
        </div>
        {openSections.driverRating && (
          <div className="filter-accordion-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            {['4.8+ Stars (Top Rated)', '4.5+ Stars', 'All Ratings'].map((rt) => (
              <label
                key={rt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="ratingRadio"
                  checked={selectedRating === rt}
                  onChange={() => setSelectedRating(rt)}
                  style={{ accentColor: '#0284c7', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span>{rt}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 10. Filter Actions (Apply & Reset matching Image 1) */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          type="button"
          onClick={handleApply}
          style={{
            width: '100%',
            backgroundColor: '#0e7490',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(14, 116, 144, 0.25)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#155e75')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0e7490')}
        >
          <i className="fa-solid fa-filter" />
          <span>Apply Filters</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px',
            textAlign: 'center'
          }}
        >
          Reset Filter
        </button>
      </div>
    </aside>
  );
}
