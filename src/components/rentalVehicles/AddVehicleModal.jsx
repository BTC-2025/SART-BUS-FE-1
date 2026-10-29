import React, { useState, useEffect } from 'react';
import './rentalVehicles.css';

// Pre-defined database of Brands and Models based on Step 2
const CAR_BRANDS_MODELS = {
  'Tata': ['Nexon', 'Punch', 'Harrier', 'Safari', 'Tiago', 'Altroz'],
  'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Dzire'],
  'Mahindra': ['Thar', 'Scorpio-N', 'XUV700', 'Bolero'],
  'Hyundai': ['Creta', 'Venue', 'i20', 'Verna', 'Exter'],
  'Toyota': ['Innova Crysta', 'Fortuner', 'Urban Cruiser Hyryder', 'Glanza'],
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

  // Synchronize Brand and Model options when vehicleType changes
  useEffect(() => {
    if (vehicleType === 'car') {
      const defaultBrand = 'Tata';
      setBrand(defaultBrand);
      setModel(CAR_BRANDS_MODELS[defaultBrand][0] || 'Nexon');
      setBodyType('Compact SUV');
      setSeatingCapacity('5-Seater');
      setBootSpace('e.g., 2 Large Bags');
      setEngineCapacity('1197');
      setTransmission('Manual');
      setFuelType('Petrol');
      setPricePerHour('150');
      setPricePerDay('1,800');
      setPricePerMonth('32,000');
      setSecurityDeposit('3,000');
      setExtraKmRate('12');
    } else {
      const defaultBrand = 'Royal Enfield';
      setBrand(defaultBrand);
      setModel(BIKE_BRANDS_MODELS[defaultBrand][0] || 'Classic 350');
      setBodyType('Cruiser (350cc+)');
      setSeatingCapacity('2-Seater (Rider + Pillion)');
      setBootSpace('Saddle Stays');
      setEngineCapacity('349');
      setTransmission('Manual (Clutch/Gears)');
      setFuelType('Petrol');
      setPricePerHour('60');
      setPricePerDay('850');
      setPricePerMonth('12,000');
      setSecurityDeposit('1,500');
      setExtraKmRate('4');
    }
  }, [vehicleType]);

  // When brand changes, set the first model
  const handleBrandChange = (newBrand) => {
    setBrand(newBrand);
    const list = vehicleType === 'car' ? CAR_BRANDS_MODELS[newBrand] : BIKE_BRANDS_MODELS[newBrand];
    if (list && list.length > 0) {
      setModel(list[0]);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const newVehicle = {
      id: `VH-${Date.now().toString().slice(-4)}`,
      name: `${brand} ${model} ${variant} (${year})`,
      brand,
      model,
      variant,
      type: vehicleType,
      category: bodyType,
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
      deposit: `₹${securityDeposit}`,
      extraKm: `₹${extraKmRate}/km`,
      city: baseCity,
      location: pickupLocation,
      status: 'Available',
      image: vehicleType === 'car' ? '/images/cab_sedan.png' : '/images/red_bike_3d.png',
      rcExpiry,
      features: vehicleType === 'car' ? features : bikeAccessories
    };

    onAddVehicle(newVehicle);
    onClose();
  };

  return (
    <div className="add-vehicle-modal-overlay">
      <div className="add-vehicle-modal-box">
        {/* Modal Top Header */}
        <div className="add-vehicle-modal-header">
          <h2>ADD NEW VEHICLE</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handlePublish} className="add-vehicle-form">
          {/* SECTION 1: MASTER SELECTOR & BASIC IDENTITY */}
          <div className="form-section-title">VEHICLE TYPE & IDENTITY</div>
          
          <div className="master-toggle-container">
            <button
              type="button"
              className={`master-toggle-btn ${vehicleType === 'car' ? 'active-car' : ''}`}
              onClick={() => setVehicleType('car')}
            >
              <i className="fa-solid fa-car-side"></i>
              <span>Car</span>
            </button>
            <button
              type="button"
              className={`master-toggle-btn ${vehicleType === 'bike' ? 'active-bike' : ''}`}
              onClick={() => setVehicleType('bike')}
            >
              <i className="fa-solid fa-motorcycle"></i>
              <span>Bike / Scooter</span>
            </button>
          </div>

          <div className="form-row-grid three-col">
            <div className="form-field">
              <label>Brand/Make</label>
              <select value={brand} onChange={(e) => handleBrandChange(e.target.value)}>
                {Object.keys(vehicleType === 'car' ? CAR_BRANDS_MODELS : BIKE_BRANDS_MODELS).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Model</label>
              <select value={model} onChange={(e) => setModel(e.target.value)}>
                {(vehicleType === 'car' ? CAR_BRANDS_MODELS[brand] : BIKE_BRANDS_MODELS[brand])?.map((m) => (
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
                placeholder="e.g., Variant variant (XZ+, VXi)"
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
              <select value={color} onChange={(e) => setColor(e.target.value)} style={{ background: '#3b82f6', color: '#fff' }}>
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

          {/* SECTION 2: SPECIFICATIONS (DYNAMIC CAR OR BIKE) */}
          <div className="form-section-title">
            SPECIFICATIONS ({vehicleType === 'car' ? 'DYNAMIC CAR' : 'DYNAMIC BIKE / SCOOTER'})
          </div>

          <div className="form-row-grid five-col">
            {/* Body Type */}
            <div className="form-field">
              <label>Body Type</label>
              {vehicleType === 'car' ? (
                <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Compact SUV">Compact SUV</option>
                  <option value="Full-size SUV">Full-size SUV</option>
                  <option value="MUV / 7-Seater">MUV / 7-Seater</option>
                  <option value="Luxury">Luxury</option>
                </select>
              ) : (
                <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
                  <option value="Commuter (100–125cc)">Commuter (100–125cc)</option>
                  <option value="Sports Bike (150–300cc)">Sports Bike (150–300cc)</option>
                  <option value="Cruiser (350cc+)">Cruiser (350cc+)</option>
                  <option value="Adventure Tourer">Adventure Tourer</option>
                  <option value="Scooter / Moped">Scooter / Moped</option>
                </select>
              )}
            </div>

            {/* Seating Capacity */}
            <div className="form-field">
              <label>Seating Capacity</label>
              {vehicleType === 'car' ? (
                <select value={seatingCapacity} onChange={(e) => setSeatingCapacity(e.target.value)}>
                  <option value="4-Seater">4-Seater</option>
                  <option value="5-Seater">5-Seater</option>
                  <option value="6-Seater">6-Seater</option>
                  <option value="7-Seater">7-Seater</option>
                  <option value="8-Seater">8-Seater</option>
                </select>
              ) : (
                <select value={seatingCapacity} onChange={(e) => setSeatingCapacity(e.target.value)}>
                  <option value="2-Seater (Rider + Pillion)">2-Seater (Rider + Pillion)</option>
                  <option value="1-Seater (Solo)">1-Seater (Solo)</option>
                </select>
              )}
            </div>

            {/* Boot/Luggage Space */}
            <div className="form-field">
              <label>Boot/Luggage Space</label>
              {vehicleType === 'car' ? (
                <select value={bootSpace} onChange={(e) => setBootSpace(e.target.value)} style={{ background: '#bfdbfe' }}>
                  <option value="e.g., 2 Large Bags">e.g., 2 Large Bags</option>
                  <option value="1 Small Bag">1 Small Bag</option>
                  <option value="3+ Bags (Full Boot)">3+ Bags (Full Boot)</option>
                </select>
              ) : (
                <select value={bootSpace} onChange={(e) => setBootSpace(e.target.value)} style={{ background: '#bfdbfe' }}>
                  <option value="Under-seat storage (Scooter)">Under-seat storage (Scooter)</option>
                  <option value="Luggage Carrier / Top Box">Luggage Carrier / Top Box</option>
                  <option value="Saddle Stays">Saddle Stays</option>
                  <option value="No Storage">No Storage</option>
                </select>
              )}
            </div>

            {/* Fuel Type */}
            <div className="form-field">
              <label>Fuel Type</label>
              {vehicleType === 'car' ? (
                <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric (EV)">Electric (EV)</option>
                </select>
              ) : (
                <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric (EV)">Electric (EV)</option>
                </select>
              )}
            </div>

            {/* Transmission */}
            <div className="form-field">
              <label>Transmission</label>
              {vehicleType === 'car' ? (
                <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                  <option value="Manual">Manual</option>
                  <option value="Automatic (AMT/CVT/DCT)">Automatic (AMT/CVT/DCT)</option>
                </select>
              ) : (
                <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                  <option value="Manual (Clutch/Gears)">Manual (Clutch/Gears)</option>
                  <option value="Gearless / Automatic (CVT)">Gearless / Automatic (CVT)</option>
                </select>
              )}
            </div>
          </div>

          <div className="form-row-grid two-col" style={{ marginTop: '10px' }}>
            <div className="form-field" style={{ maxWidth: '180px' }}>
              <label>Engine Capacity</label>
              <div className="input-with-addon">
                <input
                  type="number"
                  value={engineCapacity}
                  onChange={(e) => setEngineCapacity(e.target.value)}
                  placeholder={vehicleType === 'car' ? '1197' : '350'}
                />
                <span className="input-addon">CC</span>
              </div>
            </div>

            {/* Checklist items based on Car vs Bike */}
            <div className="form-field">
              <label>Checklist & Accessories</label>
              <div className="checkbox-items-row">
                {vehicleType === 'car' ? (
                  <>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={features.ac}
                        onChange={(e) => setFeatures({ ...features, ac: e.target.checked })}
                      />
                      <span>Air Conditioning</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={features.carPlay}
                        onChange={(e) => setFeatures({ ...features, carPlay: e.target.checked })}
                      />
                      <span>Android Auto/CarPlay</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={features.airbags}
                        onChange={(e) => setFeatures({ ...features, airbags: e.target.checked })}
                      />
                      <span>Airbags</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={features.gpsTracker}
                        onChange={(e) => setFeatures({ ...features, gpsTracker: e.target.checked })}
                      />
                      <span>GPS Tracker</span>
                    </label>
                  </>
                ) : (
                  <>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={bikeAccessories.mobileMount}
                        onChange={(e) => setBikeAccessories({ ...bikeAccessories, mobileMount: e.target.checked })}
                      />
                      <span>Mobile Mount</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={bikeAccessories.usbCharger}
                        onChange={(e) => setBikeAccessories({ ...bikeAccessories, usbCharger: e.target.checked })}
                      />
                      <span>USB Handlebar Charger</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={bikeAccessories.crashGuard}
                        onChange={(e) => setBikeAccessories({ ...bikeAccessories, crashGuard: e.target.checked })}
                      />
                      <span>Crash / Leg Guard</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={bikeAccessories.sideStandCutoff}
                        onChange={(e) => setBikeAccessories({ ...bikeAccessories, sideStandCutoff: e.target.checked })}
                      />
                      <span>Side-stand Cut-off</span>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: RENTAL PRICING & DEPOSIT */}
          <div className="form-section-title" style={{ marginTop: '16px' }}>
            <span>RENTAL PRICING & DEPOSIT</span>
            <div className="pricing-checkboxes">
              <label className="inline-check">
                <input
                  type="checkbox"
                  checked={pricingTypes.hourly}
                  onChange={(e) => setPricingTypes({ ...pricingTypes, hourly: e.target.checked })}
                />
                <span>Hourly Rental</span>
              </label>
              <label className="inline-check">
                <input
                  type="checkbox"
                  checked={pricingTypes.daily}
                  onChange={(e) => setPricingTypes({ ...pricingTypes, daily: e.target.checked })}
                />
                <span>Daily Rental (24h)</span>
              </label>
              <label className="inline-check">
                <input
                  type="checkbox"
                  checked={pricingTypes.monthly}
                  onChange={(e) => setPricingTypes({ ...pricingTypes, monthly: e.target.checked })}
                />
                <span>Monthly Subscription</span>
              </label>
            </div>
          </div>

          <div className="form-row-grid five-col">
            <div className="form-field">
              <label>Price Per Hour (₹)</label>
              <input
                type="text"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                placeholder="150 / hr"
              />
            </div>

            <div className="form-field">
              <label>Price Per Day (₹)</label>
              <input
                type="text"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                placeholder="1,800 / day"
              />
            </div>

            <div className="form-field">
              <label>Price Per Month (₹)</label>
              <input
                type="text"
                value={pricePerMonth}
                onChange={(e) => setPricePerMonth(e.target.value)}
                placeholder="32,000 / month"
              />
            </div>

            <div className="form-field">
              <label>Refundable Security Deposit (₹)</label>
              <input
                type="text"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="3,000"
              />
            </div>

            <div className="form-field">
              <label>Fuel Policy</label>
              <select value={fuelPolicy} onChange={(e) => setFuelPolicy(e.target.value)}>
                <option value="Same to Same">Same to Same</option>
                <option value="Full to Full">Full to Full</option>
                <option value="Free Fuel with Cap">Free Fuel with Cap</option>
              </select>
            </div>
          </div>

          {/* SECTION 4: LOCATION, MEDIA & DOCUMENTS */}
          <div className="form-section-title" style={{ marginTop: '16px' }}>
            LOCATION, MEDIA & DOCUMENTS
          </div>

          <div className="form-row-grid three-col">
            <div className="form-field">
              <label>Base City</label>
              <select value={baseCity} onChange={(e) => setBaseCity(e.target.value)}>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>

            <div className="form-field" style={{ gridColumn: 'span 1' }}>
              <label>Pickup Location / Garage Area (250 km/day)</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter address..."
              />
            </div>

            <div className="form-field toggle-field">
              <label>Home Delivery</label>
              <div className="switch-toggle">
                <input
                  type="checkbox"
                  id="homeDeliverySwitch"
                  checked={homeDelivery}
                  onChange={(e) => setHomeDelivery(e.target.checked)}
                />
                <label htmlFor="homeDeliverySwitch" className="switch-slider"></label>
                <span className="switch-text">{homeDelivery ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="media-doc-upload-strip">
            <div className="upload-pill-group">
              <span className="upload-label">Photos ({vehicleType === 'car' ? 'Front, Rear, Inside' : 'Front, Rear, Handlebar'}):</span>
              <label className="upload-btn-chip">
                <i className="fa-solid fa-arrow-up-from-bracket"></i> Upload Images
                <input type="file" multiple style={{ display: 'none' }} />
              </label>
            </div>

            <div className="upload-pill-group">
              <span className="upload-label">RC Document (PDF/JPG):</span>
              <label className="upload-btn-chip">
                <i className="fa-solid fa-arrow-up-from-bracket"></i> Upload RC File
                <input type="file" style={{ display: 'none' }} />
              </label>
            </div>

            <div className="upload-pill-group expiry-group">
              <span className="upload-label">Insurance Expiry:</span>
              <input
                type="text"
                value={rcExpiry}
                onChange={(e) => setRcExpiry(e.target.value)}
                placeholder="DD / MM / YYYY"
                className="expiry-input"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="add-vehicle-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn-draft" onClick={onClose}>
              Save as Draft
            </button>
            <button type="submit" className="btn-publish">
              Publish Vehicle Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

