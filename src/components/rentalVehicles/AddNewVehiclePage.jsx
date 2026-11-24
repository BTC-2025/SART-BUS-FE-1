import React, { useState, useEffect } from 'react';
import './rentalVehicles.css';
import LocationPickerInput from './LocationPickerInput';

// Pre-defined database of Brands and Models based on Step 2
const INITIAL_CAR_BRANDS_MODELS = {
  'Tata': ['Nexon', 'Punch', 'Harrier', 'Safari', 'Tiago', 'Altroz'],
  'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Dzire'],
  'Mahindra': ['Thar', 'Scorpio-N', 'XUV700', 'Bolero'],
  'Hyundai': ['Creta', 'Venue', 'i20', 'Verna', 'Exter'],
  'Toyota': ['Alphard', 'Innova Crysta', 'Fortuner', 'Urban Cruiser Hyryder', 'Glanza'],
  'Porsche': ['911 Carrera', 'Cayenne', 'Panamera', 'Macan'],
  'Rolls-Royce': ['Dawn', 'Phantom', 'Ghost', 'Cullinan'],
  'Honda': ['City', 'Amaze', 'Elevate'],
  'Kia': ['Seltos', 'Sonet', 'Carens'],
  'MG': ['Hector', 'Astor', 'ZS EV'],
  'Skoda': ['Kushaq', 'Slavia'],
  'Volkswagen': ['Taigun', 'Virtus']
};

const INITIAL_BIKE_BRANDS_MODELS = {
  'Royal Enfield': ['Classic 350', 'Hunter 350', 'Himalayan', 'Meteor 350', 'Bullet 350'],
  'Yamaha': ['R15 V4', 'MT-15', 'FZ-S', 'Aerox 155'],
  'TVS': ['Apache RTR 160/200', 'Jupiter', 'Ntorq 125', 'iQube Electric', 'Ronin'],
  'Bajaj': ['Pulsar NS200', 'Pulsar 150', 'Dominar 400', 'Chetak EV'],
  'Honda 2-Wheelers': ['Activa 6G', 'Shine 125', 'Hornet 2.0', 'Hness CB350'],
  'Hero': ['Splendor Plus', 'HF Deluxe', 'Xpulse 200 4V', 'Vida V1 Pro'],
  'KTM': ['Duke 200', 'Duke 390', 'RC 200', 'Adventure 390'],
  'Ather': ['450X', '450S', 'Rizta'],
};

// Generate a unique registration number by default for new vehicles
const generateRandomPlate = () => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const l1 = letters[Math.floor(Math.random() * letters.length)];
  const l2 = letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TN 23 ${l1}${l2} ${num}`;
};

export default function AddNewVehiclePage({ onAddVehicle, onCancel }) {
  // Master Vehicle Type: 'car' | 'bike' | custom types
  const [vehicleType, setVehicleType] = useState('car');
  const [customVehicleTypes, setCustomVehicleTypes] = useState([]);
  const [isOtherTypeMode, setIsOtherTypeMode] = useState(false);
  const [otherTypeInput, setOtherTypeInput] = useState('');
  const [isSavingCustomType, setIsSavingCustomType] = useState(false);

  // Dynamic Brands/Models map
  const [carBrands] = useState(INITIAL_CAR_BRANDS_MODELS);
  const [bikeBrands] = useState(INITIAL_BIKE_BRANDS_MODELS);

  // Form State
  const [brand, setBrand] = useState('Tata');
  const [model, setModel] = useState('Nexon');
  const [variant, setVariant] = useState('XZ+');
  const [regNumber, setRegNumber] = useState(generateRandomPlate);
  const [year, setYear] = useState('2024');
  const [color, setColor] = useState('Blue');
  const [unitsCount, setUnitsCount] = useState(1);

  // Specifications
  const [bodyType, setBodyType] = useState('Compact SUV');
  const [seatingCapacity, setSeatingCapacity] = useState('5-Seater');
  const [engineCapacity, setEngineCapacity] = useState('1197');
  const [transmission, setTransmission] = useState('Manual');
  const [fuelType, setFuelType] = useState('Petrol');

  // Checklist Features (Car)
  const [features, setFeatures] = useState({
    ac: true,
    carPlay: true,
    airbags: true,
    gpsTracker: true,
    sunroof: false,
    powerWindows: true,
    fastag: true,
    reverseCamera: true
  });

  // Rental Pricing & Deposit
  const [pricePerHour, setPricePerHour] = useState('150');
  const [pricePerDay, setPricePerDay] = useState('1,800');
  const [pricePerMonth, setPricePerMonth] = useState('32,000');
  const [securityDeposit, setSecurityDeposit] = useState('3,000');
  const [extraKmRate, setExtraKmRate] = useState('12');
  const [fuelPolicy, setFuelPolicy] = useState('Same to Same');

  // Location & Media
  const [baseCity, setBaseCity] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [rcExpiry, setRcExpiry] = useState('');

  // Multi-image upload state
  const [uploadedImages, setUploadedImages] = useState([]);

  // Fetch backend custom categories on mount
  useEffect(() => {
    const fetchCustomCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/rides/custom-categories');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            setCustomVehicleTypes(json.data);
          }
        }
      } catch (err) {
        try {
          const cached = localStorage.getItem('sart_custom_categories');
          if (cached) setCustomVehicleTypes(JSON.parse(cached));
        } catch (e) { }
      }
    };
    fetchCustomCategories();
  }, []);

  // Sync brand & model when vehicleType changes
  useEffect(() => {
    if (vehicleType === 'car') {
      const b = 'Tata';
      setBrand(b);
      setModel(carBrands[b] ? carBrands[b][0] : '');
      setBodyType('Compact SUV');
      setSeatingCapacity('5-Seater');
    } else if (vehicleType === 'bike') {
      const b = 'Royal Enfield';
      setBrand(b);
      setModel(bikeBrands[b] ? bikeBrands[b][0] : '');
      setBodyType('Cruiser (350cc+)');
      setSeatingCapacity('2-Seater');
    }
  }, [vehicleType]);

  const handleBrandChange = (newBrand) => {
    setBrand(newBrand);
    const models = (vehicleType === 'bike' ? bikeBrands[newBrand] : carBrands[newBrand]) || [];
    setModel(models[0] || '');
  };

  // Save new custom vehicle type to backend database
  const handleSaveOtherType = async (e) => {
    if (e) e.preventDefault();
    if (!otherTypeInput.trim()) return;

    const typeName = otherTypeInput.trim();
    setIsSavingCustomType(true);

    const payload = {
      name: typeName,
      category: 'rental',
      count: '1+ fleet added',
      icon: 'fa-van-shuttle'
    };

    try {
      const res = await fetch('http://localhost:5000/api/rides/custom-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setCustomVehicleTypes(prev => [json.data, ...prev.filter(x => x.name !== json.data.name)]);
        }
      }
    } catch (err) {
      const fallbackItem = {
        id: typeName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        name: typeName,
        category: 'rental',
        count: '1+ fleet added',
        icon: 'fa-van-shuttle'
      };
      setCustomVehicleTypes(prev => [fallbackItem, ...prev]);
    }

    setVehicleType(typeName);
    setIsOtherTypeMode(false);
    setOtherTypeInput('');
    setIsSavingCustomType(false);
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

  const handlePublish = (e) => {
    e.preventDefault();
    const primaryImg = uploadedImages.length > 0
      ? uploadedImages[0]
      : (vehicleType === 'bike' ? '/images/red_bike_3d.png' : '/images/cab_sedan.png');

    const galleryImages = uploadedImages.length > 0
      ? (uploadedImages.length >= 3
        ? uploadedImages
        : [uploadedImages[0], uploadedImages[1] || uploadedImages[0], uploadedImages[2] || uploadedImages[0]])
      : [primaryImg, primaryImg, primaryImg];

    // Detect city accurately from location string or fallback to baseCity
    let derivedCity = baseCity;
    if (pickupLocation) {
      const lower = pickupLocation.toLowerCase();
      if (lower.includes('katpadi')) derivedCity = 'Katpadi';
      else if (lower.includes('chennai')) derivedCity = 'Chennai';
      else if (lower.includes('pune')) derivedCity = 'Pune';
      else if (lower.includes('bengaluru') || lower.includes('bangalore')) derivedCity = 'Bengaluru';
      else if (lower.includes('mumbai')) derivedCity = 'Mumbai';
      else if (lower.includes('hyderabad')) derivedCity = 'Hyderabad';
      else if (pickupLocation.includes(',')) {
        derivedCity = pickupLocation.split(',').pop().trim();
      }
    }

    const isBike = vehicleType === 'bike' || Boolean(INITIAL_BIKE_BRANDS_MODELS[brand]);
    const computedPrice = Number(String(pricePerDay).replace(/[^0-9.]/g, '') || 1800);

    const newVehicle = {
      id: `VH-${Date.now().toString().slice(-4)}`,
      name: `${brand} ${model} ${variant}`.trim(),
      type: isBike ? 'bike' : 'car',
      customType: vehicleType,
      category: bodyType,
      brand,
      model,
      variant,
      plate: regNumber,
      year,
      color,
      engine: `${engineCapacity} CC`,
      fuel: fuelType,
      transmission,
      seats: seatingCapacity,
      storage: isBike ? 'Underseat Storage' : '350 Litres',
      price: computedPrice,
      dailyRate: computedPrice,
      pricing: {
        hourly: `₹${pricePerHour}/hr`,
        daily: `₹${pricePerDay}/day`,
        monthly: `₹${pricePerMonth}/month`
      },
      pricingText: `₹${pricePerHour}/hr | ₹${pricePerDay}/day | ₹${pricePerMonth}/month`,
      deposit: `₹${securityDeposit}`,
      extraKm: `₹${extraKmRate}/km`,
      city: derivedCity,
      location: pickupLocation,
      status: 'Available',
      isAvailable: true,
      image: primaryImg,
      images: galleryImages,
      rcExpiry,
      verified: true
    };

    if (onAddVehicle) onAddVehicle(newVehicle);
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', width: '100%', padding: '16px 0 40px' }}>
      {/* Main Form Card matching Image 1 exactly */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '32px 36px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      }}>
        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* =========================================================================
              SECTION 1: VEHICLE TYPE & IDENTITY
             ========================================================================= */}
          <div className="custom-form-section-title">
            VEHICLE TYPE & IDENTITY
          </div>

          {/* Select Vehicle Type * with + Add New Type button */}
          <div style={{ marginBottom: '16px' }}>
            <label className="custom-form-label">
              Select Vehicle Type *
            </label>

            {!isOtherTypeMode ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <i className="fa-solid fa-car" style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    fontSize: '14px',
                    pointerEvents: 'none'
                  }}></i>
                  <select
                    value={vehicleType}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '__add_other__') {
                        setIsOtherTypeMode(true);
                      } else {
                        setVehicleType(val);
                        setIsOtherTypeMode(false);
                      }
                    }}
                    className="custom-form-input"
                    style={{ paddingLeft: '36px', appearance: 'auto' }}
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike / Scooter</option>

                    {customVehicleTypes.length > 0 &&
                      customVehicleTypes.map((custom) => (
                        <option key={custom.id || custom.name} value={custom.name}>
                          {custom.name}
                        </option>
                      ))}

                    <option value="__add_other__">+ Other</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOtherTypeMode(true)}
                  style={{
                    height: '42px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    border: '1.5px dashed #3b82f6',
                    background: '#eff6ff',
                    color: '#2563eb',
                    fontWeight: 600,
                    fontSize: '13px',
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
                  placeholder="Enter vehicle type..."
                  value={otherTypeInput}
                  onChange={(e) => setOtherTypeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveOtherType();
                    }
                  }}
                  autoFocus
                  className="custom-form-input"
                  style={{ flex: 1, border: '2px solid #2563eb' }}
                />
                <button
                  type="button"
                  onClick={handleSaveOtherType}
                  disabled={isSavingCustomType || !otherTypeInput.trim()}
                  style={{
                    height: '42px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0 18px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isSavingCustomType ? 'Saving...' : 'Save & Select'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOtherTypeMode(false)}
                  style={{
                    height: '42px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0 12px',
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

          {/* Row 2: Brand / Make | Model | Manufacturing Year (3 Columns) */}
          <div className="custom-grid-3">
            <div>
              <label className="custom-form-label">Brand / Make</label>
              <select
                value={brand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="custom-form-input"
              >
                {Object.keys(vehicleType === 'bike' ? bikeBrands : carBrands).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="custom-form-label">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="custom-form-input"
              >
                {((vehicleType === 'bike' ? bikeBrands : carBrands)[brand] || ['Custom Model']).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="custom-form-label">Manufacturing Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="custom-form-input"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>
          </div>

          {/* Row 3: Registration Number (RC) | Exterior Color | Number of Vehicles (3 Columns) */}
          <div className="custom-grid-3" style={{ marginBottom: '8px' }}>
            <div>
              <label className="custom-form-label">Registration Number (RC)</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                placeholder="MH 12 AB 1234"
                required
                className="custom-form-input"
              />
            </div>

            <div>
              <label className="custom-form-label">Exterior Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="custom-form-input"
              >
                <option value="Blue">Blue</option>
                <option value="White">White</option>
                <option value="Silver">Silver</option>
                <option value="Black">Black</option>
                <option value="Red">Red</option>
                <option value="Grey">Grey</option>
              </select>
            </div>

            <div>
              <label className="custom-form-label">Number of Vehicles</label>
              <div className="custom-number-stepper">
                <button
                  type="button"
                  onClick={() => setUnitsCount(Math.max(1, unitsCount - 1))}
                  className="stepper-btn"
                >
                  –
                </button>
                <span className="stepper-val">{unitsCount}</span>
                <button
                  type="button"
                  onClick={() => setUnitsCount(unitsCount + 1)}
                  className="stepper-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 2: SPECIFICATIONS (CAR)
             ========================================================================= */}
          <div className="custom-form-section-title">
            SPECIFICATIONS ({vehicleType === 'bike' ? 'BIKE / SCOOTER' : 'CAR'})
          </div>

          {/* 4 Columns: Body Type | Seating Capacity | Fuel Type | Transmission */}
          <div className="custom-grid-4" style={{ marginBottom: '8px' }}>
            <div>
              <label className="custom-form-label">Body Type</label>
              {vehicleType === 'bike' ? (
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="custom-form-input"
                >
                  <option value="Cruiser (350cc+)">Cruiser (350cc+)</option>
                  <option value="Sports Bike (150–300cc)">Sports Bike (150–300cc)</option>
                  <option value="Commuter (100–125cc)">Commuter (100–125cc)</option>
                  <option value="Scooter / Moped">Scooter / Moped</option>
                </select>
              ) : (
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="custom-form-input"
                >
                  <option value="Compact SUV">Compact SUV</option>
                  <option value="Full-size SUV">Full-size SUV</option>
                  <option value="Minivan">Minivan</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sport">Sport</option>
                  <option value="Convertible">Convertible</option>
                </select>
              )}
            </div>

            <div>
              <label className="custom-form-label">Seating Capacity</label>
              {vehicleType === 'bike' ? (
                <select
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(e.target.value)}
                  className="custom-form-input"
                >
                  <option value="2-Seater">2-Seater</option>
                  <option value="1-Seater">1-Seater</option>
                </select>
              ) : (
                <select
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(e.target.value)}
                  className="custom-form-input"
                >
                  <option value="5-Seater">5-Seater</option>
                  <option value="4-Seater">4-Seater</option>
                  <option value="6-Seater">6-Seater</option>
                  <option value="7-Seater">7-Seater</option>
                  <option value="2 Seats">2 Seats</option>
                </select>
              )}
            </div>

            <div>
              <label className="custom-form-label">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="custom-form-input"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric (EV)">Electric (EV)</option>
                <option value="CNG">CNG</option>
                <option value="Petrol / Hybrid">Petrol / Hybrid</option>
              </select>
            </div>

            <div>
              <label className="custom-form-label">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="custom-form-input"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="Gearless">Gearless</option>
              </select>
            </div>
          </div>

          {/* =========================================================================
              SECTION 3: RENTAL PRICING & DEPOSIT
             ========================================================================= */}
          <div className="custom-form-section-title">
            RENTAL PRICING & DEPOSIT
          </div>

          {/* Row 1: Price Per Hour (₹) | Price Per Day (₹) | Price Per Month (₹) (3 Columns) */}
          <div className="custom-grid-3">
            <div>
              <label className="custom-form-label">Price Per Hour (₹)</label>
              <input
                type="text"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                placeholder="150"
                required
                className="custom-form-input"
              />
            </div>

            <div>
              <label className="custom-form-label">Price Per Day (₹)</label>
              <input
                type="text"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                placeholder="1,800"
                required
                className="custom-form-input"
              />
            </div>

            <div>
              <label className="custom-form-label">Price Per Month (₹)</label>
              <input
                type="text"
                value={pricePerMonth}
                onChange={(e) => setPricePerMonth(e.target.value)}
                placeholder="32,000"
                required
                className="custom-form-input"
              />
            </div>
          </div>

          {/* Row 2: Refundable Deposit (₹) | Fuel Policy (2 Columns) */}
          <div className="custom-grid-2" style={{ marginBottom: '8px' }}>
            <div>
              <label className="custom-form-label">Refundable Deposit (₹)</label>
              <input
                type="text"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="3,000"
                required
                className="custom-form-input"
              />
            </div>

            <div>
              <label className="custom-form-label">Fuel Policy</label>
              <select
                value={fuelPolicy}
                onChange={(e) => setFuelPolicy(e.target.value)}
                className="custom-form-input"
              >
                <option value="Same to Same">Same to Same</option>
                <option value="Full to Full">Full to Full</option>
                <option value="Fair Usage">Fair Usage</option>
                <option value="Included">Included</option>
              </select>
            </div>
          </div>

          {/* =========================================================================
              SECTION 4: LOCATION & BASE HUB
             ========================================================================= */}
          <div className="custom-form-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-location-dot" style={{ color: '#2563eb' }}></i>
            LOCATION & BASE HUB
          </div>

          {/* Unified Location & Base Hub - Address Only */}
          <div style={{ marginBottom: '18px' }}>
            <label className="custom-form-label">Address only *</label>
            <LocationPickerInput
              value={pickupLocation}
              onChange={(newAddr, details) => {
                setPickupLocation(newAddr);
                if (details?.city) setBaseCity(details.city);
              }}
              placeholder="Search city, area, or pickup address..."
            />
          </div>

          {/* =========================================================================
              SECTION 5: VEHICLE MEDIA & GALLERY PHOTOS
             ========================================================================= */}
          <div className="custom-form-section-title">
            VEHICLE MEDIA & GALLERY PHOTOS
          </div>

          <div style={{
            background: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            border: '1.5px dashed #cbd5e1',
            marginBottom: '24px'
          }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
              Upload vehicle images. + button to add more.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {uploadedImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    width: '84px',
                    height: '84px',
                    borderRadius: '10px',
                    border: idx === 0 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    overflow: 'hidden',
                    background: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={`Vehicle ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {idx === 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '2px',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontSize: '8px',
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: '3px'
                      }}
                    >
                      COVER
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '3px',
                      right: '3px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                    title="Remove Image"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Add More Images (+) Button matching Image 1 */}
              <label
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '10px',
                  border: '1.5px dashed #cbd5e1',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#2563eb',
                  transition: 'all 0.15s ease'
                }}
                title="Add vehicle photo"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <i className="fa-solid fa-plus" style={{ fontSize: '18px', marginBottom: '4px' }}></i>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Add Image</span>
              </label>
            </div>
          </div>

          {/* =========================================================================
              BOTTOM ACTION BUTTONS: Cancel | Publish & Add to Fleet
             ========================================================================= */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '8px',
            paddingTop: '8px'
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13.5px',
                color: '#0f172a',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                transition: 'background 0.15s ease'
              }}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i> Publish & Add to Fleet
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
