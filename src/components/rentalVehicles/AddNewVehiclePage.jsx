import React, { useState, useEffect } from 'react';
import './rentalVehicles.css';

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
  'Ola Electric': ['S1 Pro', 'S1 Air', 'S1 X']
};

export default function AddNewVehiclePage({ onAddVehicle, onCancel }) {
  // Master Vehicle Type: 'car' | 'bike' | 'other' (or custom types)
  const [vehicleType, setVehicleType] = useState('car');
  const [customVehicleTypes, setCustomVehicleTypes] = useState([]);
  const [isOtherTypeMode, setIsOtherTypeMode] = useState(false);
  const [otherTypeInput, setOtherTypeInput] = useState('');
  const [isSavingCustomType, setIsSavingCustomType] = useState(false);

  // Dynamic Brands/Models map
  const [carBrands, setCarBrands] = useState(INITIAL_CAR_BRANDS_MODELS);
  const [bikeBrands, setBikeBrands] = useState(INITIAL_BIKE_BRANDS_MODELS);

  // Form State
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [regNumber, setRegNumber] = useState('MH 12 AB 1234');
  const [year, setYear] = useState('2024');
  const [color, setColor] = useState('Blue');
  const [unitsCount, setUnitsCount] = useState(1);

  // Specifications
  const [bodyType, setBodyType] = useState('Compact SUV');
  const [seatingCapacity, setSeatingCapacity] = useState('5-Seater');
  const [bootSpace, setBootSpace] = useState('e.g., 2 Large Bags');
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

  // Bike Checklist / Accessories
  const [bikeAccessories, setBikeAccessories] = useState({
    mobileMount: true,
    usbCharger: true,
    crashGuard: true,
    rainCover: false,
    absBraking: 'Dual-Channel ABS',
    sideStandCutoff: true,
    tractionControl: false,
    helmetInclusion: '2 Helmets Included'
  });

  // Rental Pricing & Deposit
  const [pricingTypes, setPricingTypes] = useState({
    hourly: true,
    daily: true,
    monthly: true
  });
  const [pricePerHour, setPricePerHour] = useState('150');
  const [pricePerDay, setPricePerDay] = useState('1,800');
  const [pricePerMonth, setPricePerMonth] = useState('32,000');
  const [securityDeposit, setSecurityDeposit] = useState('3,000');
  const [extraKmRate, setExtraKmRate] = useState('12');
  const [fuelPolicy, setFuelPolicy] = useState('Same to Same');

  // Location & Media
  const [baseCity, setBaseCity] = useState('Pune');
  const [pickupLocation, setPickupLocation] = useState('Baner, Pune');
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [rcExpiry, setRcExpiry] = useState('15/08/2039');

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
    const models = (vehicleType === 'car' ? carBrands[newBrand] : bikeBrands[newBrand]) || [];
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

    const newVehicle = {
      id: `VH-${Date.now().toString().slice(-4)}`,
      name: `${brand} ${model} ${variant}`.trim(),
      type: vehicleType === 'bike' ? 'bike' : 'car',
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
      storage: bootSpace,
      pricing: {
        hourly: `₹${pricePerHour}/hr`,
        daily: `₹${pricePerDay}/day`,
        monthly: `₹${pricePerMonth}/month`
      },
      pricingText: `₹${pricePerHour}/hr | ₹${pricePerDay}/day | ₹${pricePerMonth}/month`,
      deposit: `₹${securityDeposit}`,
      extraKm: `₹${extraKmRate}/km`,
      city: baseCity,
      location: pickupLocation,
      status: 'Available',
      isAvailable: true,
      image: primaryImg,
      images: uploadedImages.length > 0 ? uploadedImages : [primaryImg],
      rcExpiry,
      verified: true
    };

    if (onAddVehicle) onAddVehicle(newVehicle);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '20px 28px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            <span style={{ cursor: 'pointer', color: '#2563eb' }} onClick={onCancel}>Rentals</span> / Add New Vehicle
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
            ADD NEW VEHICLE
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
          <i className="fa-solid fa-arrow-left"></i> Cancel & Return
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <form onSubmit={handlePublish} className="add-vehicle-form">
          {/* SECTION 1: MASTER SELECTOR & BASIC IDENTITY */}
          <div className="form-section-title">VEHICLE TYPE & IDENTITY</div>

          {/* Master Vehicle Type Dropdown with "Other (Add Type)" option */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Select Vehicle Type *
            </label>

            {!isOtherTypeMode ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
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
              /* When selecting "Other": inline input appears, type name, press Enter to save to database */
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
                  onClick={handleSaveOtherType}
                  disabled={isSavingCustomType || !otherTypeInput.trim()}
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
                  {isSavingCustomType ? 'Saving...' : 'Save & Select'}
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

          {/* Form Rows */}
          <div className="form-row-grid three-col">
            <div className="form-field">
              <label>Brand/Make</label>
              <select value={brand} onChange={(e) => handleBrandChange(e.target.value)}>
                {Object.keys(vehicleType === 'bike' ? bikeBrands : carBrands).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Model</label>
              <select value={model} onChange={(e) => setModel(e.target.value)}>
                {((vehicleType === 'bike' ? bikeBrands : carBrands)[brand] || ['Custom Model']).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Variant/Trim</label>
              <input
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="e.g., XZ+, VXi"
              />
            </div>
          </div>

          <div className="form-row-grid four-col">
            <div className="form-field">
              <label>Registration Number (RC)</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                placeholder="MH 12 AB 1234"
                required
              />
            </div>

            <div className="form-field">
              <label>Manufacturing Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>

            <div className="form-field">
              <label>Exterior Color</label>
              <select value={color} onChange={(e) => setColor(e.target.value)}>
                <option value="Blue">Blue</option>
                <option value="White">White</option>
                <option value="Silver">Silver</option>
                <option value="Black">Black</option>
                <option value="Red">Red</option>
                <option value="Grey">Grey</option>
              </select>
            </div>

            <div className="form-field counter-field">
              <label>Number of Vehicles</label>
              <div className="number-stepper">
                <button type="button" onClick={() => setUnitsCount(Math.max(1, unitsCount - 1))}>–</button>
                <span className="count-num">{unitsCount}</span>
                <button type="button" onClick={() => setUnitsCount(unitsCount + 1)}>+</button>
              </div>
            </div>
          </div>

          {/* SECTION 2: SPECIFICATIONS */}
          <div className="form-section-title">
            SPECIFICATIONS ({vehicleType === 'bike' ? 'BIKE / SCOOTER' : 'CAR'})
          </div>

          <div className="form-row-grid five-col">
            <div className="form-field">
              <label>Body Type</label>
              {vehicleType === 'bike' ? (
                <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
                  <option value="Cruiser (350cc+)">Cruiser (350cc+)</option>
                  <option value="Sports Bike (150–300cc)">Sports Bike (150–300cc)</option>
                  <option value="Commuter (100–125cc)">Commuter (100–125cc)</option>
                  <option value="Scooter / Moped">Scooter / Moped</option>
                </select>
              ) : (
                <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
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

            <div className="form-field">
              <label>Seating Capacity</label>
              {vehicleType === 'bike' ? (
                <select value={seatingCapacity} onChange={(e) => setSeatingCapacity(e.target.value)}>
                  <option value="2-Seater">2-Seater</option>
                  <option value="1-Seater">1-Seater</option>
                </select>
              ) : (
                <select value={seatingCapacity} onChange={(e) => setSeatingCapacity(e.target.value)}>
                  <option value="2 Seats">2 Seats</option>
                  <option value="4-Seater">4-Seater</option>
                  <option value="5-Seater">5-Seater</option>
                  <option value="7 Seats">7 Seats</option>
                </select>
              )}
            </div>

            <div className="form-field">
              <label>Boot/Luggage Space</label>
              <select value={bootSpace} onChange={(e) => setBootSpace(e.target.value)}>
                <option value="e.g., 2 Large Bags">e.g., 2 Large Bags</option>
                <option value="3 Large Bags + 2 Small">3 Large Bags + 2 Small</option>
                <option value="Compact (1 Bag)">Compact (1 Bag)</option>
                <option value="Helmets Storage Only">Helmets Storage Only</option>
              </select>
            </div>

            <div className="form-field">
              <label>Fuel Type</label>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric (EV)">Electric (EV)</option>
                <option value="CNG">CNG</option>
                <option value="Petrol / Hybrid">Petrol / Hybrid</option>
              </select>
            </div>

            <div className="form-field">
              <label>Transmission</label>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="Gearless">Gearless</option>
              </select>
            </div>
          </div>

          {/* SECTION 3: RENTAL PRICING & DEPOSIT */}
          <div className="form-section-title">RENTAL PRICING & DEPOSIT</div>

          <div className="form-row-grid five-col">
            <div className="form-field">
              <label>Price Per Hour (₹)</label>
              <input
                type="number"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                placeholder="150"
                required
              />
            </div>

            <div className="form-field">
              <label>Price Per Day (₹)</label>
              <input
                type="number"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                placeholder="1800"
                required
              />
            </div>

            <div className="form-field">
              <label>Price Per Month (₹)</label>
              <input
                type="number"
                value={pricePerMonth}
                onChange={(e) => setPricePerMonth(e.target.value)}
                placeholder="32000"
                required
              />
            </div>

            <div className="form-field">
              <label>Refundable Deposit (₹)</label>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="3000"
                required
              />
            </div>

            <div className="form-field">
              <label>Fuel Policy</label>
              <input
                type="text"
                value={fuelPolicy}
                onChange={(e) => setFuelPolicy(e.target.value)}
                placeholder="Same to Same"
              />
            </div>
          </div>

          {/* SECTION 4: VEHICLE MEDIA & GALLERY (Upload Multiple Images) */}
          <div className="form-section-title" style={{ marginTop: '28px' }}>
            VEHICLE MEDIA & GALLERY PHOTOS
          </div>
          <div style={{ maxWidth: '480px', background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#64748b' }}>
              Upload vehicle images. <strong>+</strong> button to add more.
            </p>

            {/* Gallery Strip with Upload Thumbnails & Plus Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {uploadedImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
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

              {/* Add More Images (+) Button matching user instruction */}
              <label
                style={{
                  width: '90px',
                  height: '80px',
                  borderRadius: '10px',
                  border: '2px dashed #94a3b8',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#2563eb',
                  transition: 'all 0.2s ease'
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
                <i className="fa-solid fa-plus" style={{ fontSize: '20px', marginBottom: '3px' }}></i>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Add Image</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
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
                padding: '12px 28px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
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

