import React, { useState, useEffect } from 'react';
import './rentalVehicles.css';

// Pre-defined database of Brands and Models based on Step 2
const CAR_BRANDS_MODELS = {
  'Tata': ['Nexon', 'Punch', 'Harrier', 'Safari', 'Tiago', 'Altroz'],
  'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Dzire'],
  'Mahindra': ['Thar', 'Scorpio-N', 'XUV700', 'Bolero'],
  'Hyundai': ['Creta', 'Venue', 'i20', 'Verna', 'Exter'],
  'Toyota': ['Alphard', 'Innova Crysta', 'Fortuner', 'Urban Cruiser Hyryder', 'Glanza'],
  'Honda': ['City', 'Amaze', 'Elevate'],
  'Kia': ['Seltos', 'Sonet', 'Carens'],
  'MG': ['Hector', 'Astor', 'ZS EV'],
  'Skoda': ['Kushaq', 'Slavia'],
  'Volkswagen': ['Taigun', 'Virtus']
};

const BIKE_BRANDS_MODELS = {
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

export default function AddVehicleModal({ isOpen, onClose, onAddVehicle, editVehicle = null }) {
  if (!isOpen) return null;

  // Step 1: Master Vehicle Type (Car vs Bike/Scooter)
  const [vehicleType, setVehicleType] = useState('car'); // 'car' | 'bike'

  // Step 2 & 3: Form State
  const [brand, setBrand] = useState('Tata');
  const [model, setModel] = useState('Nexon');
  const [variant, setVariant] = useState('XZ+');
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

  // Rental Pricing & Deposit
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
  const [uploadedImages, setUploadedImages] = useState([]);

  // Synchronize Brand and Model options when vehicleType changes
  useEffect(() => {
    if (vehicleType === 'car') {
      const defaultBrand = 'Tata';
      setBrand(defaultBrand);
      setModel(CAR_BRANDS_MODELS[defaultBrand][0]);
      setBodyType('Compact SUV');
      setSeatingCapacity('5-Seater');
      setEngineCapacity('1197');
    } else {
      const defaultBrand = 'Royal Enfield';
      setBrand(defaultBrand);
      setModel(BIKE_BRANDS_MODELS[defaultBrand][0]);
      setBodyType('Cruiser (350cc+)');
      setSeatingCapacity('2-Seater (Rider + Pillion)');
      setEngineCapacity('350');
    }
  }, [vehicleType]);

  // Synchronize edit vehicle if provided
  useEffect(() => {
    if (editVehicle) {
      setVehicleType(editVehicle.type || 'car');
      setBrand(editVehicle.brand || 'Tata');
      setModel(editVehicle.model || 'Nexon');
      setVariant(editVehicle.variant || '');
      setRegNumber(editVehicle.plate || 'MH 12 AB 1234');
      setYear(editVehicle.year || '2024');
      setColor(editVehicle.color || 'Blue');
      setBodyType(editVehicle.category || 'Compact SUV');
      setSeatingCapacity(editVehicle.seats || '5-Seater');
      setTransmission(editVehicle.transmission || 'Manual');
      setFuelType(editVehicle.fuel || 'Petrol');
      if (editVehicle.location) setPickupLocation(editVehicle.location);
      if (editVehicle.city) setBaseCity(editVehicle.city);
    }
  }, [editVehicle]);

  const handleBrandChange = (newBrand) => {
    setBrand(newBrand);
    const models = (vehicleType === 'car' ? CAR_BRANDS_MODELS[newBrand] : BIKE_BRANDS_MODELS[newBrand]) || [];
    setModel(models[0] || '');
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

    const newVehicle = {
      id: editVehicle ? editVehicle.id : `VH-${Date.now().toString().slice(-4)}`,
      name: `${brand} ${model} ${variant}`.trim(),
      type: vehicleType,
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
      images: galleryImages,
      rcExpiry,
      verified: true
    };

    if (onAddVehicle) onAddVehicle(newVehicle);
    onClose();
  };

  return (
    <div className="add-vehicle-modal-overlay">
      <div className="add-vehicle-modal-container" style={{ maxWidth: '880px', borderRadius: '16px', overflow: 'hidden' }}>
        {/* Modal Top Header */}
        <div className="add-vehicle-modal-header" style={{ padding: '20px 28px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0f172a' }}>ADD NEW VEHICLE</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handlePublish} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '0', maxHeight: '82vh', overflowY: 'auto' }}>
          {/* SECTION 1: VEHICLE TYPE & IDENTITY */}
          <div className="custom-form-section-title">
            VEHICLE TYPE & IDENTITY
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="custom-form-label">
              Select Vehicle Type *
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <i className={`fa-solid ${vehicleType === 'bike' ? 'fa-motorcycle' : 'fa-car'}`} style={{
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
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="custom-form-input"
                  style={{ paddingLeft: '36px', appearance: 'auto' }}
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike / Scooter</option>
                </select>
              </div>

              <button
                type="button"
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
                {Object.keys(vehicleType === 'car' ? CAR_BRANDS_MODELS : BIKE_BRANDS_MODELS).map((b) => (
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
                {(vehicleType === 'car' ? CAR_BRANDS_MODELS[brand] : BIKE_BRANDS_MODELS[brand])?.map((m) => (
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

          {/* SECTION 2: SPECIFICATIONS */}
          <div className="custom-form-section-title">
            SPECIFICATIONS ({vehicleType === 'bike' ? 'BIKE / SCOOTER' : 'CAR'})
          </div>

          <div className="custom-grid-4" style={{ marginBottom: '8px' }}>
            <div>
              <label className="custom-form-label">Body Type</label>
              {vehicleType === 'car' ? (
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
                  <option value="Luxury">Luxury</option>
                </select>
              ) : (
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
              )}
            </div>

            <div>
              <label className="custom-form-label">Seating Capacity</label>
              {vehicleType === 'car' ? (
                <select
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(e.target.value)}
                  className="custom-form-input"
                >
                  <option value="5-Seater">5-Seater</option>
                  <option value="4-Seater">4-Seater</option>
                  <option value="6-Seater">6-Seater</option>
                  <option value="7-Seater">7-Seater</option>
                </select>
              ) : (
                <select
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(e.target.value)}
                  className="custom-form-input"
                >
                  <option value="2-Seater (Rider + Pillion)">2-Seater</option>
                  <option value="1-Seater (Solo)">1-Seater</option>
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
                <option value="CNG">CNG</option>
                <option value="Electric (EV)">Electric (EV)</option>
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
              </select>
            </div>
          </div>

          {/* SECTION 3: RENTAL PRICING & DEPOSIT */}
          <div className="custom-form-section-title">
            RENTAL PRICING & DEPOSIT
          </div>

          <div className="custom-grid-3">
            <div>
              <label className="custom-form-label">Price Per Hour (₹)</label>
              <input
                type="text"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                placeholder="150"
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
                className="custom-form-input"
              />
            </div>
          </div>

          <div className="custom-grid-2" style={{ marginBottom: '8px' }}>
            <div>
              <label className="custom-form-label">Refundable Deposit (₹)</label>
              <input
                type="text"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="3,000"
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
              </select>
            </div>
          </div>

          {/* SECTION 4: PICKUP LOCATION & HUB */}
          <div className="custom-form-section-title">
            PICKUP LOCATION & HUB
          </div>

          <div className="custom-grid-2" style={{ marginBottom: '8px' }}>
            <div>
              <label className="custom-form-label">Base City Hub *</label>
              <select
                value={baseCity}
                onChange={(e) => setBaseCity(e.target.value)}
                className="custom-form-input"
              >
                <option value="Pune">Pune</option>
                <option value="Katpadi">Katpadi</option>
                <option value="Chennai">Chennai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>

            <div>
              <label className="custom-form-label">Specific Pickup Location / Area *</label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-location-dot" style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  fontSize: '13px'
                }}></i>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder=""
                  className="custom-form-input"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: VEHICLE MEDIA & GALLERY PHOTOS */}
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
                </div>
              ))}

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

          {/* Bottom Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '8px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13.5px',
                color: '#0f172a',
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
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'inline-flex',
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
