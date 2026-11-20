import React, { useState, useEffect } from 'react';
import './EditVehicleModal.css';
import LocationPickerInput from './LocationPickerInput';

const CATEGORIES = [
  'Sedan',
  'Compact SUV',
  'Full-size SUV',
  'Hatchback',
  'Cruiser',
  'Sport',
  'Minivan',
  'Convertible',
  'Scooter / Moped',
  'Electric'
];

const CITIES = [
  'Katpadi',
  'Pune',
  'Chennai',
  'Bengaluru',
  'Mumbai',
  'Hyderabad',
  'Delhi',
  'Kolkata'
];

export default function EditVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onUpdateVehicle
}) {
  if (!isOpen || !vehicle) return null;

  // Extract initial rates
  const initialHourly = vehicle.hourlyRate ||
    (vehicle.pricing?.hourly ? Number(String(vehicle.pricing.hourly).replace(/[^0-9.]/g, '')) : 200);
  const initialDaily = vehicle.dailyRate ||
    (vehicle.pricing?.daily ? Number(String(vehicle.pricing.daily).replace(/[^0-9.]/g, '')) : 2200);
  const initialMonthly = vehicle.monthlyRate ||
    (vehicle.pricing?.monthly ? Number(String(vehicle.pricing.monthly).replace(/[^0-9.]/g, '')) : 28000);

  // Form State
  const [name, setName] = useState(vehicle.name || '');
  const [brand, setBrand] = useState(vehicle.brand || (vehicle.name ? vehicle.name.split(' ')[0] : 'Hyundai'));
  const [model, setModel] = useState(vehicle.model || (vehicle.name ? vehicle.name.split(' ').slice(1).join(' ') : 'Verna'));
  const [type, setType] = useState(vehicle.type || 'car');
  const [category, setCategory] = useState(vehicle.category || 'Sedan');
  const [plate, setPlate] = useState(vehicle.plate || '');
  const [city, setCity] = useState(vehicle.city || 'Katpadi');
  const [location, setLocation] = useState(vehicle.location || 'Katpadi, Vellore');
  const [hourlyRate, setHourlyRate] = useState(initialHourly || 200);
  const [dailyRate, setDailyRate] = useState(initialDaily || 2200);
  const [monthlyRate, setMonthlyRate] = useState(initialMonthly || 28000);
  const [transmission, setTransmission] = useState(vehicle.transmission || 'Manual');
  const [fuel, setFuel] = useState(vehicle.fuel || 'Petrol');
  const [seats, setSeats] = useState(vehicle.seats || '5 Seats');
  const [imageUrl, setImageUrl] = useState(vehicle.image || '');
  const [isAvailable, setIsAvailable] = useState(vehicle.isAvailable !== false);
  const [status, setStatus] = useState(vehicle.status || (vehicle.isAvailable ? 'Available' : 'On Trip'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sync state when vehicle changes
  useEffect(() => {
    if (vehicle) {
      setName(vehicle.name || '');
      setBrand(vehicle.brand || (vehicle.name ? vehicle.name.split(' ')[0] : ''));
      setModel(vehicle.model || (vehicle.name ? vehicle.name.split(' ').slice(1).join(' ') : ''));
      setType(vehicle.type || 'car');
      setCategory(vehicle.category || 'Sedan');
      setPlate(vehicle.plate || '');
      setCity(vehicle.city || 'Katpadi');
      setLocation(vehicle.location || 'Katpadi, Vellore');
      setHourlyRate(vehicle.hourlyRate || (vehicle.pricing?.hourly ? Number(String(vehicle.pricing.hourly).replace(/[^0-9.]/g, '')) : 200));
      setDailyRate(vehicle.dailyRate || (vehicle.pricing?.daily ? Number(String(vehicle.pricing.daily).replace(/[^0-9.]/g, '')) : 2200));
      setMonthlyRate(vehicle.monthlyRate || (vehicle.pricing?.monthly ? Number(String(vehicle.pricing.monthly).replace(/[^0-9.]/g, '')) : 28000));
      setTransmission(vehicle.transmission || 'Manual');
      setFuel(vehicle.fuel || 'Petrol');
      setSeats(vehicle.seats || '5 Seats');
      setImageUrl(vehicle.image || '');
      setIsAvailable(vehicle.isAvailable !== false);
      setStatus(vehicle.status || (vehicle.isAvailable ? 'Available' : 'On Trip'));
      setSuccessMessage('');
    }
  }, [vehicle]);

  // Handle local file upload
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImageUrl(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedPricingText = `₹${hourlyRate}/hr | ₹${Number(dailyRate).toLocaleString()}/day | ₹${Number(monthlyRate).toLocaleString()}/month`;

    // Derive city from location string if needed
    let finalCity = city;
    if (location && location.includes(',')) {
      const parts = location.split(',').map(p => p.trim());
      if (parts.length >= 3) {
        finalCity = parts[parts.length - 2];
      } else if (parts.length >= 2) {
        finalCity = parts[1];
      }
    }

    const updatedVehicle = {
      ...vehicle,
      name: name.trim() || `${brand} ${model}`.trim(),
      brand: brand.trim(),
      model: model.trim(),
      type: type.toLowerCase(),
      category: category.trim(),
      plate: plate.trim(),
      city: (finalCity || city || 'Katpadi').trim(),
      location: location.trim(),
      hourlyRate: Number(hourlyRate),
      dailyRate: Number(dailyRate),
      monthlyRate: Number(monthlyRate),
      pricingText: formattedPricingText,
      pricing: {
        hourly: `₹${hourlyRate}/hr`,
        daily: `₹${Number(dailyRate).toLocaleString()}/day`,
        monthly: `₹${Number(monthlyRate).toLocaleString()}/month`
      },
      transmission: transmission.trim(),
      fuel: fuel.trim(),
      seats: seats.trim(),
      image: imageUrl.trim() || vehicle.image,
      images: (vehicle.images && vehicle.images.length > 0)
        ? [imageUrl.trim() || vehicle.image, ...vehicle.images.slice(1)]
        : [imageUrl.trim() || vehicle.image],
      isAvailable: Boolean(isAvailable),
      status: isAvailable ? 'Available' : (status === 'On Trip' ? 'On Trip' : 'Not Available'),
      updatedAt: new Date().toISOString()
    };

    setSuccessMessage('Vehicle details updated successfully!');

    setTimeout(() => {
      setIsSubmitting(false);
      onUpdateVehicle(updatedVehicle);
      onClose();
    }, 450);
  };

  return (
    <div className="edit-modal-backdrop" onClick={onClose}>
      <div className="edit-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="edit-modal-header">
          <div className="edit-modal-header-left">
            <div className="edit-header-badge">
              <i className="fa-solid fa-pen-to-square"></i>
            </div>
            <div>
              <h3 className="edit-modal-title">Edit Vehicle Details</h3>
              <p className="edit-modal-subtitle">
                Update specifications, pricing, registration plate and media
              </p>
            </div>
          </div>
          <button type="button" className="edit-modal-close-btn" onClick={onClose} title="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="edit-modal-success-banner">
            <i className="fa-solid fa-circle-check"></i>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="edit-modal-form">
          {/* SECTION 1: Identity & Categorization */}
          <div className="edit-form-section">
            <div className="edit-section-title">
              <i className="fa-solid fa-id-card"></i> Vehicle Identity
            </div>
            <div className="edit-grid-2">
              <div className="edit-field-group">
                <label className="edit-field-label">Vehicle Name *</label>
                <input
                  type="text"
                  className="edit-field-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hyundai Verna"
                  required
                />
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Registration Number (Plate) *</label>
                <input
                  type="text"
                  className="edit-field-input plate-input"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="e.g. TN 23 BK 4567"
                  required
                />
              </div>
            </div>

            <div className="edit-grid-3">
              <div className="edit-field-group">
                <label className="edit-field-label">Brand / Make</label>
                <input
                  type="text"
                  className="edit-field-input"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Hyundai"
                />
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Model</label>
                <input
                  type="text"
                  className="edit-field-input"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Verna SX"
                />
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Vehicle Type</label>
                <select
                  className="edit-field-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="car">Car (4-Wheeler)</option>
                  <option value="bike">Bike / Motorcycle</option>
                </select>
              </div>
            </div>

            <div className="edit-grid-2">
              <div className="edit-field-group">
                <label className="edit-field-label">Body Category</label>
                <select
                  className="edit-field-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Availability Status</label>
                <select
                  className="edit-field-select"
                  value={isAvailable ? 'available' : 'not-available'}
                  onChange={(e) => {
                    const avail = e.target.value === 'available';
                    setIsAvailable(avail);
                    setStatus(avail ? 'Available' : 'On Trip');
                  }}
                >
                  <option value="available">● Available (Ready for Customer Bookings)</option>
                  <option value="not-available">● Not Available / On Trip</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Pricing Structure */}
          <div className="edit-form-section">
            <div className="edit-section-title">
              <i className="fa-solid fa-indian-rupee-sign"></i> Rental Pricing
            </div>
            <div className="edit-grid-3">
              <div className="edit-field-group">
                <label className="edit-field-label">Hourly Rate (₹/hr) *</label>
                <div className="edit-input-with-icon">
                  <span className="edit-input-prefix">₹</span>
                  <input
                    type="number"
                    className="edit-field-input with-prefix"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    min="10"
                    placeholder="200"
                    required
                  />
                  <span className="edit-input-suffix">/hr</span>
                </div>
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Daily Rate (₹/day) *</label>
                <div className="edit-input-with-icon">
                  <span className="edit-input-prefix">₹</span>
                  <input
                    type="number"
                    className="edit-field-input with-prefix"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    min="100"
                    placeholder="2200"
                    required
                  />
                  <span className="edit-input-suffix">/day</span>
                </div>
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Monthly Rate (₹/mo) *</label>
                <div className="edit-input-with-icon">
                  <span className="edit-input-prefix">₹</span>
                  <input
                    type="number"
                    className="edit-field-input with-prefix"
                    value={monthlyRate}
                    onChange={(e) => setMonthlyRate(e.target.value)}
                    min="1000"
                    placeholder="28000"
                    required
                  />
                  <span className="edit-input-suffix">/mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Technical Specifications */}
          <div className="edit-form-section">
            <div className="edit-section-title">
              <i className="fa-solid fa-gears"></i> Technical Specs & Capacity
            </div>
            <div className="edit-grid-3">
              <div className="edit-field-group">
                <label className="edit-field-label">Transmission</label>
                <select
                  className="edit-field-select"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Fuel Type</label>
                <select
                  className="edit-field-select"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Seating Capacity</label>
                <input
                  type="text"
                  className="edit-field-input"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  placeholder="e.g. 5 Seats"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Location & Base Hub */}
          <div className="edit-form-section">
            <div className="edit-section-title">
              <i className="fa-solid fa-location-dot"></i> Location & Base Hub
            </div>
            <div className="edit-field-group">
              <label className="edit-field-label">Location & Pickup Address *</label>
              <LocationPickerInput
                value={location}
                onChange={(newAddr, details) => {
                  setLocation(newAddr);
                  if (details?.city) setCity(details.city);
                }}
                placeholder="Search city, area, or pickup address..."
              />
            </div>
          </div>

          {/* SECTION 5: Vehicle Image */}
          <div className="edit-form-section">
            <div className="edit-section-title">
              <i className="fa-solid fa-image"></i> Vehicle Image & Media
            </div>
            <div className="edit-image-row">
              <div className="edit-image-preview-box">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="edit-preview-img"
                    onError={(e) => {
                      e.target.src = type === 'bike' ? '/images/red_bike_3d.png' : '/images/cab_sedan.png';
                    }}
                  />
                ) : (
                  <div className="edit-no-image-placeholder">
                    <i className="fa-solid fa-car-side"></i>
                    <span>No Image</span>
                  </div>
                )}
              </div>

              <div className="edit-image-inputs-col">
                <div className="edit-field-group">
                  <label className="edit-field-label">Image URL</label>
                  <input
                    type="text"
                    className="edit-field-input"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or /images/car.png"
                  />
                </div>

                <div className="edit-field-group">
                  <label className="edit-field-label">Or Upload New Image From Device</label>
                  <label className="edit-upload-btn-label">
                    <i className="fa-solid fa-cloud-arrow-up"></i> Choose Local Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="edit-modal-footer">
            <button
              type="button"
              className="edit-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edit-btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Saving Changes...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i> Save & Submit Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
