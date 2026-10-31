import React, { useState, useEffect } from 'react';
import './rentalVehicles/rentalVehicles.css';

// Realistic sample data configurations as requested by user
const LOGISTICS_CATEGORIES = [
  { id: 'road_truck', label: 'Heavy Commercial Road Truck (Trailer/Cargo)', mode: 'Road Cargo' },
  { id: 'rail_cargo', label: 'Rail Cargo Freight Train (High-Density Rake)', mode: 'Rail Cargo' },
  { id: 'air_freight', label: 'Air Freight Cargo (Freighter Aircraft)', mode: 'Air Cargo' },
  { id: 'sea_vessel', label: 'Maritime Cargo Vessel (Container Ship)', mode: 'Sea Cargo' },
  { id: 'delivery_bike', label: 'Express Delivery Bike (Last-Mile Parcel)', mode: '2-Wheeler (Express Bike)' },
  { id: 'cargo_loader', label: '3-Wheeler Cargo Loader (Auto/EV)', mode: '3-Wheeler Cargo (Auto/EV)' },
  { id: 'mini_truck', label: 'Small Mini-Truck (Tata Ace / Super Carry LCV)', mode: 'Mini-Truck / Van (LCV)' },
  { id: 'maxi_truck', label: 'Large Cargo Van / Maxi-Truck (Bolero Maxi / Eeco)', mode: 'Mini-Truck / Van (LCV)' }
];

const PRESETS = {
  road_truck: {
    categoryLabel: 'Road Cargo',
    idNumber: 'TN 11 AB 4892',
    makeModel: 'BharatBenz 2823C (14-Wheeler Heavy Multi-Axle)',
    fuelType: 'Diesel (BS-VI)',
    depot: 'Tata Steel Logistics Hub, Chennai, Tamil Nadu',
    weightUnit: 'Tonnes',
    maxPayload: '28',
    containerLimit: '1 standard 40ft High Cube Container',
    volumeCapacity: '55',
    coldChain: false,
    gpsIot: true,
    hazmat: true,
    speedGovernor: true,
    nationalPermit: true,
    ratePerKm: '45',
    tripRate: '18500',
    monthlyLease: '185000',
    defaultImg: '/images/cargo_truck.jpg'
  },
  rail_cargo: {
    categoryLabel: 'Rail Cargo',
    idNumber: 'WAP-7 21801 (High-Density Rake)',
    makeModel: 'Indian Railways BLC Container Flat Rake (45 Wagons)',
    fuelType: 'Electric (25 kV AC Overhead)',
    depot: 'Chennai Central Freight Yard (Tondiarpet)',
    weightUnit: 'Tonnes',
    maxPayload: '2800',
    containerLimit: '90 TEU (Twenty-Foot Equivalent Units)',
    volumeCapacity: '3200',
    coldChain: false,
    gpsIot: true,
    hazmat: true,
    speedGovernor: false,
    nationalPermit: true,
    ratePerKm: '32',
    tripRate: '8500',
    monthlyLease: '95000',
    defaultImg: '/images/cargo_railways.jpg'
  },
  air_freight: {
    categoryLabel: 'Air Cargo',
    idNumber: 'VT-CGO (ICAO: AIC-F7)',
    makeModel: 'Boeing 737-800BCF (Boeing Converted Freighter)',
    fuelType: 'Aviation Turbine Fuel (Jet A-1)',
    depot: 'Chennai International Cargo Terminal (MAA)',
    weightUnit: 'Tonnes',
    maxPayload: '23.9',
    containerLimit: '11 Pallet Positions (Main Deck) + Lower Hold',
    volumeCapacity: '141.5',
    coldChain: true,
    gpsIot: true,
    hazmat: true,
    speedGovernor: false,
    nationalPermit: true,
    ratePerKm: '120',
    tripRate: '125000',
    monthlyLease: '1800000',
    defaultImg: '/images/cargo_truck.jpg'
  },
  sea_vessel: {
    categoryLabel: 'Sea Cargo',
    idNumber: 'IMO 9385609 (Call Sign: 9V2901)',
    makeModel: 'Feedermax Container Vessel (1,100 TEU Class)',
    fuelType: 'Very Low Sulphur Fuel Oil (VLSFO / Marine Gas Oil)',
    depot: 'Chennai Port Trust (CITPL Berth 2)',
    weightUnit: 'Tonnes',
    maxPayload: '14500',
    containerLimit: '1,100 TEU (Standard Containers)',
    volumeCapacity: '22000',
    coldChain: true,
    gpsIot: true,
    hazmat: true,
    speedGovernor: false,
    nationalPermit: true,
    ratePerKm: '85',
    tripRate: '350000',
    monthlyLease: '3500000',
    defaultImg: '/images/cargo_truck.jpg'
  },
  delivery_bike: {
    categoryLabel: '2-Wheeler (Express Bike)',
    idNumber: 'TN 09 BK 3841',
    makeModel: 'Bajaj Pulsar 150 / Hero Super Splendor Cargo Custom',
    fuelType: 'Petrol (BS-VI)',
    depot: 'T. Nagar Logistics Depot, Chennai',
    weightUnit: 'kg',
    maxPayload: '40',
    containerLimit: '1 Insulated Parcel Box (45 Litres)',
    volumeCapacity: '0.05',
    coldChain: true,
    gpsIot: true,
    hazmat: false,
    speedGovernor: false,
    nationalPermit: false,
    ratePerKm: '15',
    tripRate: '450',
    monthlyLease: '12000',
    defaultImg: '/images/cargo_bike_courier.jpg'
  },
  cargo_loader: {
    categoryLabel: '3-Wheeler Cargo (Auto/EV)',
    idNumber: 'TN 02 EQ 7120',
    makeModel: 'Piaggio Ape E-Xtra FX / Mahindra Treo Zor',
    fuelType: 'Electric (Lithium-ion 48V)',
    depot: 'Koyambedu Wholesale Market Logistics Hub, Chennai',
    weightUnit: 'kg',
    maxPayload: '500',
    containerLimit: '1 Open Tray Bed / 12 Standard Vegetable Crates',
    volumeCapacity: '2.1',
    coldChain: false,
    gpsIot: true,
    hazmat: false,
    speedGovernor: true,
    nationalPermit: false,
    ratePerKm: '22',
    tripRate: '950',
    monthlyLease: '26000',
    defaultImg: '/images/cargo_truck.jpg'
  },
  mini_truck: {
    categoryLabel: 'Mini-Truck / Van (LCV)',
    idNumber: 'TN 14 AC 6140',
    makeModel: 'Tata Ace Gold Diesel Plus ("Chhota Hathi")',
    fuelType: 'Diesel (BS-VI)',
    depot: 'Ambattur Industrial Estate, Chennai',
    weightUnit: 'kg',
    maxPayload: '750',
    containerLimit: '1 Flatbed / 25 Plastic Produce Crates',
    volumeCapacity: '3.5',
    coldChain: false,
    gpsIot: true,
    hazmat: false,
    speedGovernor: true,
    nationalPermit: true,
    ratePerKm: '28',
    tripRate: '1800',
    monthlyLease: '42000',
    defaultImg: '/images/cargo_truck.jpg'
  },
  maxi_truck: {
    categoryLabel: 'Mini-Truck / Van (LCV)',
    idNumber: 'TN 11 DX 8842',
    makeModel: 'Mahindra Bolero Maxi Truck HD',
    fuelType: 'Diesel (m2DiCR)',
    depot: 'Sholinganallur Hub, Chennai',
    weightUnit: 'kg',
    maxPayload: '1200',
    containerLimit: '1 Enclosed Cargo Container Box',
    volumeCapacity: '6.5',
    coldChain: false,
    gpsIot: true,
    hazmat: false,
    speedGovernor: true,
    nationalPermit: true,
    ratePerKm: '35',
    tripRate: '3200',
    monthlyLease: '65000',
    defaultImg: '/images/cargo_truck.jpg'
  }
};

export default function CarrierAddNewVehicle({ onAddCarrierVehicle, onCancel }) {
  // Selected category preset
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('road_truck');

  // Custom Category State
  const [customCategories, setCustomCategories] = useState([]);
  const [isOtherTypeMode, setIsOtherTypeMode] = useState(false);
  const [otherTypeInput, setOtherTypeInput] = useState('');

  // Form Fields State initialized with road_truck preset
  const [logisticsCategory, setLogisticsCategory] = useState(PRESETS.road_truck.categoryLabel);
  const [idNumber, setIdNumber] = useState(PRESETS.road_truck.idNumber);
  const [makeModel, setMakeModel] = useState(PRESETS.road_truck.makeModel);
  const [fuelType, setFuelType] = useState(PRESETS.road_truck.fuelType);
  const [depot, setDepot] = useState(PRESETS.road_truck.depot);

  // Weights & Containers
  const [weightUnit, setWeightUnit] = useState(PRESETS.road_truck.weightUnit);
  const [maxPayload, setMaxPayload] = useState(PRESETS.road_truck.maxPayload);
  const [containerLimit, setContainerLimit] = useState(PRESETS.road_truck.containerLimit);
  const [volumeCapacity, setVolumeCapacity] = useState(PRESETS.road_truck.volumeCapacity);
  const [unitsCount, setUnitsCount] = useState(1);
  const [manufacturingYear, setManufacturingYear] = useState('2024');

  // Features
  const [coldChain, setColdChain] = useState(PRESETS.road_truck.coldChain);
  const [gpsIot, setGpsIot] = useState(PRESETS.road_truck.gpsIot);
  const [hazmat, setHazmat] = useState(PRESETS.road_truck.hazmat);

  // Commercial Tariffs
  const [ratePerKm, setRatePerKm] = useState(PRESETS.road_truck.ratePerKm);
  const [tripRate, setTripRate] = useState(PRESETS.road_truck.tripRate);
  const [monthlyLease, setMonthlyLease] = useState(PRESETS.road_truck.monthlyLease);
  const [refundableDeposit, setRefundableDeposit] = useState('5000');

  // Uploaded media
  const [uploadedImages, setUploadedImages] = useState([]);

  // Apply preset when user selects another category from dropdown
  const handleCategoryChange = (key) => {
    if (key === '__add_other__') {
      setIsOtherTypeMode(true);
      return;
    }

    setIsOtherTypeMode(false);
    setSelectedCategoryKey(key);

    const preset = PRESETS[key];
    if (preset) {
      setLogisticsCategory(preset.categoryLabel);
      setIdNumber(preset.idNumber);
      setMakeModel(preset.makeModel);
      setFuelType(preset.fuelType);
      setDepot(preset.depot);
      setWeightUnit(preset.weightUnit);
      setMaxPayload(preset.maxPayload);
      setContainerLimit(preset.containerLimit);
      setVolumeCapacity(preset.volumeCapacity);
      setColdChain(preset.coldChain);
      setGpsIot(preset.gpsIot);
      setHazmat(preset.hazmat);
      setRatePerKm(preset.ratePerKm);
      setTripRate(preset.tripRate);
      setMonthlyLease(preset.monthlyLease);
    }
  };

  const handleSaveCustomType = () => {
    if (!otherTypeInput.trim()) return;
    const newCat = {
      id: `custom_${Date.now()}`,
      label: otherTypeInput.trim(),
      mode: otherTypeInput.trim()
    };
    setCustomCategories((prev) => [...prev, newCat]);
    setLogisticsCategory(otherTypeInput.trim());
    setSelectedCategoryKey(newCat.id);
    setIsOtherTypeMode(false);
    setOtherTypeInput('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImages((prev) => [...prev, uploadEvent.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const primaryImg = uploadedImages.length > 0
      ? uploadedImages[0]
      : (PRESETS[selectedCategoryKey]?.defaultImg || '/images/cargo_truck.jpg');

    const newCarrier = {
      id: `CRG-${Date.now().toString().slice(-4)}`,
      name: makeModel,
      category: logisticsCategory,
      type: selectedCategoryKey.includes('bike') ? 'bike' : (selectedCategoryKey.includes('rail') ? 'train' : 'truck'),
      fuel: fuelType,
      transmission: 'Heavy Commercial',
      seats: containerLimit,
      plate: idNumber,
      location: depot,
      pricingText: `₹${Number(tripRate).toLocaleString()}/trip | ₹${ratePerKm}/km | ₹${Number(monthlyLease).toLocaleString()}/month`,
      isAvailable: true,
      image: primaryImg,
      images: uploadedImages.length > 0 ? uploadedImages : [primaryImg],
      rating: 4.9,
      verified: true,
      specs: {
        weightUnit,
        maxPayload,
        containerLimit,
        volumeCapacity,
        coldChain,
        gpsIot,
        hazmat,
        ratePerKm,
        tripRate,
        monthlyLease
      }
    };

    if (onAddCarrierVehicle) {
      onAddCarrierVehicle(newCarrier);
    }
  };

  // Label text changes dynamically based on small vehicle / heavy vehicle
  const isSmallVehicle = ['delivery_bike', 'cargo_loader', 'mini_truck', 'maxi_truck'].includes(selectedCategoryKey);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Top Header Breadcrumb Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        padding: '20px 28px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <div>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            <span style={{ cursor: 'pointer', color: '#2563eb' }} onClick={onCancel}>Carriers Logistics</span> / Add New Vehicle
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
            ADD CARRIER & LOGISTICS VEHICLE
          </h1>
        </div>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: '#f1f5f9',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Fleet
        </button>
      </div>

      {/* Main Form Container - Exact Clean Look matching the User's Reference Screenshot */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '32px 36px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <form onSubmit={handleSubmit}>
          {/* SECTION 1: MASTER VEHICLE TYPE & CATEGORY SELECTOR */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
              Select Vehicle Type *
            </label>

            {!isOtherTypeMode ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <select
                    value={selectedCategoryKey}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      padding: '0 16px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: '14.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <optgroup label="Heavy Commercial & Transit Modes">
                      {LOGISTICS_CATEGORIES.slice(0, 4).map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Small Commercial & Express Cargo Vehicles">
                      {LOGISTICS_CATEGORIES.slice(4).map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </optgroup>
                    {customCategories.length > 0 && (
                      <optgroup label="Custom Created Types">
                        {customCategories.map((custom) => (
                          <option key={custom.id} value={custom.id}>{custom.label}</option>
                        ))}
                      </optgroup>
                    )}
                    <option value="__add_other__">+ Add New Type / Category</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOtherTypeMode(true)}
                  style={{
                    height: '48px',
                    padding: '0 18px',
                    borderRadius: '10px',
                    border: '1.5px dashed #3b82f6',
                    background: '#eff6ff',
                    color: '#2563eb',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="fa-solid fa-plus"></i> Add New Type
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Enter logistics vehicle category..."
                  value={otherTypeInput}
                  onChange={(e) => setOtherTypeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveCustomType();
                    }
                  }}
                  autoFocus
                  style={{
                    flex: 1,
                    height: '48px',
                    padding: '0 16px',
                    borderRadius: '10px',
                    border: '2px solid #2563eb',
                    fontSize: '14.5px',
                    outline: 'none',
                    fontWeight: 500
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveCustomType}
                  disabled={!otherTypeInput.trim()}
                  style={{
                    height: '48px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0 20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Save & Select
                </button>
                <button
                  type="button"
                  onClick={() => setIsOtherTypeMode(false)}
                  style={{
                    height: '48px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '0 14px',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                  title="Cancel"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: IDENTITY & REGISTRATION DETAILS */}
          <div className="form-row-grid three-col" style={{ marginBottom: '14px' }}>
            <div className="form-field">
              <label>Logistics Category / Mode</label>
              <input
                type="text"
                value={logisticsCategory}
                onChange={(e) => setLogisticsCategory(e.target.value)}
                placeholder="Road Cargo / Rail Cargo / Air Freight / Sea Vessel"
                required
              />
            </div>

            <div className="form-field">
              <label>Make & Model (Manufacturer & Chassis)</label>
              <input
                type="text"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                placeholder="e.g., BharatBenz 2823C / Tata Ace Gold / Boeing 737"
                required
              />
            </div>

            <div className="form-field">
              <label>Propulsion / Fuel Type</label>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                <option value="Diesel (BS-VI)">Diesel (BS-VI)</option>
                <option value="Electric (25 kV AC Overhead)">Electric (25 kV AC Overhead)</option>
                <option value="Electric (Lithium-ion 48V)">Electric (Lithium-ion 48V)</option>
                <option value="Petrol (BS-VI)">Petrol (BS-VI)</option>
                <option value="Aviation Turbine Fuel (Jet A-1)">Aviation Turbine Fuel (Jet A-1)</option>
                <option value="Very Low Sulphur Fuel Oil (VLSFO / Marine Gas Oil)">Very Low Sulphur Fuel Oil (VLSFO / Marine Gas Oil)</option>
                <option value="LNG / CNG Green Fuel">LNG / CNG Green Fuel</option>
              </select>
            </div>
          </div>

          <div className="form-row-grid four-col" style={{ marginBottom: '24px' }}>
            <div className="form-field">
              <label>Registration / ID Number (RC / Rake / Tail / IMO)</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                placeholder="TN 11 AB 4892 / WAP-7 21801 / IMO 9385609"
                required
              />
            </div>

            <div className="form-field">
              <label>Operational Hub / Base Depot</label>
              <input
                type="text"
                value={depot}
                onChange={(e) => setDepot(e.target.value)}
                placeholder="City hub, station yard, airport, or seaport"
                required
              />
            </div>

            <div className="form-field">
              <label>Manufacturing Year</label>
              <select value={manufacturingYear} onChange={(e) => setManufacturingYear(e.target.value)}>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>

            <div className="form-field counter-field">
              <label>Number of Vehicles / Units</label>
              <div className="number-stepper">
                <button type="button" onClick={() => setUnitsCount(Math.max(1, unitsCount - 1))}>–</button>
                <span className="count-num">{unitsCount}</span>
                <button type="button" onClick={() => setUnitsCount(unitsCount + 1)}>+</button>
              </div>
            </div>
          </div>

          {/* SECTION 3: WEIGHT & CONTAINER LOAD LIMITS */}
          <div className="form-section-title">
            WEIGHT & CONTAINER LOAD LIMITS ({isSmallVehicle ? 'EXPRESS / LCV' : 'HEAVY TRANSIT'})
          </div>

          <div className="form-row-grid four-col" style={{ marginBottom: '24px' }}>
            <div className="form-field">
              <label>Weight Unit</label>
              <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
                <option value="Tonnes">Tonnes (Metric Tons)</option>
                <option value="kg">kg (Kilograms)</option>
              </select>
            </div>

            <div className="form-field">
              <label>Max Payload Capacity ({weightUnit})</label>
              <input
                type="number"
                step="any"
                value={maxPayload}
                onChange={(e) => setMaxPayload(e.target.value)}
                placeholder={isSmallVehicle ? 'e.g., 40 kg or 750 kg' : 'e.g., 28 Tonnes'}
                required
              />
            </div>

            <div className="form-field">
              <label>{isSmallVehicle ? 'Parcels / Crates Limit' : 'Container Capacity / Units'}</label>
              <input
                type="text"
                value={containerLimit}
                onChange={(e) => setContainerLimit(e.target.value)}
                placeholder={isSmallVehicle ? '1 Insulated Box / 25 Produce Crates' : '1 standard 40ft High Cube Container'}
                required
              />
            </div>

            <div className="form-field">
              <label>Cargo Volume (m³)</label>
              <input
                type="number"
                step="any"
                value={volumeCapacity}
                onChange={(e) => setVolumeCapacity(e.target.value)}
                placeholder="55"
                required
              />
            </div>
          </div>

          {/* SECTION 4: SPECIAL FEATURES & TELEMATICS */}
          <div className="form-section-title">SPECIAL FEATURES & TELEMATICS</div>
          <div className="form-row-grid three-col" style={{ marginBottom: '24px' }}>
            <div className="form-field">
              <label>Cold-chain / Refrigerated Temperature</label>
              <select value={coldChain ? 'Yes' : 'No'} onChange={(e) => setColdChain(e.target.value === 'Yes')}>
                <option value="No">No (Standard Ambient Cargo)</option>
                <option value="Yes">Yes (Reefer / Temp Controlled -20°C to +25°C)</option>
              </select>
            </div>

            <div className="form-field">
              <label>GPS / IoT Real-time Tracking</label>
              <select value={gpsIot ? 'Yes' : 'No'} onChange={(e) => setGpsIot(e.target.value === 'Yes')}>
                <option value="Yes">Yes (Active Live Telematics / AIS Satellite)</option>
                <option value="No">No (Manual Status Updates)</option>
              </select>
            </div>

            <div className="form-field">
              <label>Hazardous / Chemical Certified (ADR/HAZMAT)</label>
              <select value={hazmat ? 'Yes' : 'No'} onChange={(e) => setHazmat(e.target.value === 'Yes')}>
                <option value="No">No (General Commercial Cargo)</option>
                <option value="Yes">Yes (Hazardous / HAZMAT Certified)</option>
              </select>
            </div>
          </div>

          {/* SECTION 5: COMMERCIAL TARIFFS & PRICING */}
          <div className="form-section-title">COMMERCIAL TARIFFS & PRICING</div>
          <div className="form-row-grid four-col" style={{ marginBottom: '28px' }}>
            <div className="form-field">
              <label>Rate Per Kilometer (₹/km)</label>
              <input
                type="number"
                value={ratePerKm}
                onChange={(e) => setRatePerKm(e.target.value)}
                placeholder="45"
                required
              />
            </div>

            <div className="form-field">
              <label>Fixed Trip Rate (₹/trip)</label>
              <input
                type="number"
                value={tripRate}
                onChange={(e) => setTripRate(e.target.value)}
                placeholder="18500"
                required
              />
            </div>

            <div className="form-field">
              <label>Dedicated Monthly Lease Rate (₹/month)</label>
              <input
                type="number"
                value={monthlyLease}
                onChange={(e) => setMonthlyLease(e.target.value)}
                placeholder="185000"
                required
              />
            </div>

            <div className="form-field">
              <label>Refundable Deposit / Security (₹)</label>
              <input
                type="number"
                value={refundableDeposit}
                onChange={(e) => setRefundableDeposit(e.target.value)}
                placeholder="5000"
              />
            </div>
          </div>

          {/* SECTION 6: VEHICLE MEDIA & GALLERY PHOTOS */}
          <div className="form-section-title">VEHICLE MEDIA & GALLERY PHOTOS</div>
          <div style={{
            border: '1.5px dashed #cbd5e1',
            borderRadius: '14px',
            padding: '24px',
            background: '#f8fafc',
            marginBottom: '32px'
          }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
              Upload logistics vehicle images. Click the <strong>+</strong> button to add multiple images.
            </p>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Add Image Button */}
              <label style={{
                width: '130px',
                height: '95px',
                border: '1.5px dashed #94a3b8',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: '#ffffff',
                transition: 'all 0.2s ease',
                gap: '6px'
              }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <i className="fa-solid fa-plus" style={{ fontSize: '20px', color: '#2563eb' }}></i>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>Add Image</span>
              </label>

              {/* Uploaded Images Preview Thumbnails */}
              {uploadedImages.map((imgSrc, idx) => (
                <div key={idx} style={{
                  position: 'relative',
                  width: '130px',
                  height: '95px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <img
                    src={imgSrc}
                    alt={`Preview ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                    title="Remove"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <span style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '12px 28px',
                borderRadius: '10px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: '#2563eb',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '10px',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14.5px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
              }}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i> Publish & Add to Carrier Fleet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
