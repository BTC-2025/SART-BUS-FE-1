import React, { useState } from 'react';
import './rentalVehicles.css';
import VehicleDocuments from './VehicleDocuments';
import VehiclePricingCalendar from './VehiclePricingCalendar';

export default function VehicleUploadForm({ onVehicleUploaded, onCancel, isOwnerVerified = true }) {
  // A. Basic Vehicle Information
  const [basicInfo, setBasicInfo] = useState({
    vehicleName: 'Hyundai Creta',
    vehicleBrand: 'Hyundai',
    model: 'Creta SX',
    year: '2025',
    category: 'SUV',
    vehicleType: 'Self-Drive Rental',
    registrationNumber: 'AP 09 BK 4421',
    color: 'White',
    seatingCapacity: '5 Seats',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    ac: 'Yes',
    mileage: '17 km/l',
    vin: '1HGBH41JXMN109186',
    vehicleClass: 'Compact SUV',
    location: 'Chennai Airport Hub / City Center',
    description: 'Comfortable SUV for city and outstation trips with panoramic sunroof, ventilated seats, and cruise control.'
  });

  // B. Required Vehicle Images (Exterior, Interior, Number Plate, Luggage)
  const [vehicleImages, setVehicleImages] = useState({
    frontView: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rearView: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    leftSide: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80',
    rightSide: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    interiorDash: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    frontSeats: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    rearSeats: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
    bootLuggage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    numberPlate: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80'
  });

  // C. Vehicle Documents State
  const [documents, setDocuments] = useState({
    rc: { uploaded: true, fileName: 'RC_AP09BK4421.pdf', status: 'Approved', expiryDate: '2035-08-12' },
    insurance: { uploaded: true, fileName: 'Comprehensive_SelfDrive_Insurance.pdf', status: 'Approved', expiryDate: '2027-02-14' },
    fitness: { uploaded: true, fileName: 'Commercial_Fitness_Cert.pdf', status: 'Approved', expiryDate: '2026-11-20' },
    permit: { uploaded: true, fileName: 'All_India_Tourist_Permit.pdf', status: 'Approved', expiryDate: '2027-04-10' },
    puc: { uploaded: true, fileName: 'Pollution_Under_Control_Test.pdf', status: 'Approved', expiryDate: '2026-12-05' },
    tax: { uploaded: true, fileName: 'AP_Road_Tax_Receipt.pdf', status: 'Approved', expiryDate: '2027-01-01' },
    commercialReg: { uploaded: true, fileName: 'Yellow_Plate_Endorsement.pdf', status: 'Approved', expiryDate: '2030-05-22' },
    authorization: { uploaded: false, fileName: '', status: 'Pending Verification', expiryDate: '' }
  });

  // D. Pricing State
  const [pricing, setPricing] = useState({
    hourlyRate: '₹250/hour',
    dailyRate: '₹2,000/day',
    weekendRate: '₹2,500/day',
    weeklyRate: '₹12,000/week',
    securityDeposit: '₹5,000',
    extraKmCharge: '₹12/km',
    lateReturnCharge: '₹200/hour',
    minDuration: '4 Hours',
    pickupTime: '06:00',
    returnTime: '23:30'
  });

  // E. Calendar Availability State
  const [calendar, setCalendar] = useState({
    dates: {
      10: 'booked',
      11: 'booked',
      12: 'booked',
      18: 'maintenance',
      24: 'blocked'
    }
  });

  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'images' | 'documents' | 'pricing'

  const handleDocumentChange = (docId, newDocData) => {
    setDocuments(prev => ({
      ...prev,
      [docId]: newDocData
    }));
  };

  const handleAdminDocStatus = (docId, status) => {
    setDocuments(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        status
      }
    }));
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();

    if (!isOwnerVerified) {
      alert('Cannot publish vehicle: Owner identity documents must first be verified by Admin!');
      return;
    }

    const newVehicleListing = {
      id: `VH-${Math.floor(100 + Math.random() * 900)}`,
      title: `${basicInfo.vehicleBrand} ${basicInfo.model} ${basicInfo.year}`,
      basicInfo,
      images: vehicleImages,
      documents,
      pricing,
      calendar,
      status: 'Active Listing',
      approvalStatus: 'Approved & Live',
      createdAt: new Date().toLocaleDateString('en-IN')
    };

    if (onVehicleUploaded) {
      onVehicleUploaded(newVehicleListing);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Breadcrumb & Title like Screenshot 1 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              border: 'none',
              background: '#f1f5f9',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155'
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>
              Add Vehicle
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Add a new vehicle to your rental fleet with complete specs, gallery, and legal paperwork
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: '#ffffff',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginTop: '16px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'basic', label: '1. Basic Information', icon: 'fa-info-circle' },
            { id: 'images', label: '2. Vehicle Photos (Interior & Exterior)', icon: 'fa-camera' },
            { id: 'documents', label: '3. Legal Documents & RC', icon: 'fa-file-shield' },
            { id: 'pricing', label: '4. Pricing & Availability Calendar', icon: 'fa-calendar-days' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#2563eb' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#64748b',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSaveVehicle}>
        {/* ================= SECTION 1: BASIC INFORMATION ================= */}
        {activeTab === 'basic' && (
          <div>
            {/* Card A: VIN & Vehicle Identification */}
            <div className="rental-form-card">
              <div className="rental-section-header">
                <h3>Basic Information</h3>
                <p>Enter the vehicle identification details</p>
              </div>

              <div className="rental-field-group" style={{ marginBottom: '20px' }}>
                <label className="rental-label">VIN (Vehicle Identification Number)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    className="rental-input"
                    value={basicInfo.vin}
                    onChange={(e) => setBasicInfo({ ...basicInfo, vin: e.target.value.toUpperCase() })}
                  />
                  <button
                    type="button"
                    className="rental-btn-secondary"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => alert(`Decoding VIN: ${basicInfo.vin} -> 2025 Hyundai Creta SX Automatic`)}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i> Decode VIN
                  </button>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>17 character vehicle identification number</span>
              </div>

              <div className="rental-input-grid">
                <div className="rental-field-group">
                  <label className="rental-label">Vehicle Brand / Make<span className="req">*</span></label>
                  <input
                    type="text"
                    className="rental-input"
                    value={basicInfo.vehicleBrand}
                    onChange={(e) => setBasicInfo({ ...basicInfo, vehicleBrand: e.target.value })}
                    required
                  />
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">Model<span className="req">*</span></label>
                  <input
                    type="text"
                    className="rental-input"
                    value={basicInfo.model}
                    onChange={(e) => setBasicInfo({ ...basicInfo, model: e.target.value })}
                    required
                  />
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">Manufacturing Year<span className="req">*</span></label>
                  <input
                    type="text"
                    className="rental-input"
                    value={basicInfo.year}
                    onChange={(e) => setBasicInfo({ ...basicInfo, year: e.target.value })}
                    required
                  />
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">Vehicle Name (Display Title)<span className="req">*</span></label>
                  <input
                    type="text"
                    className="rental-input"
                    value={basicInfo.vehicleName}
                    onChange={(e) => setBasicInfo({ ...basicInfo, vehicleName: e.target.value })}
                    required
                  />
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">Vehicle Color</label>
                  <input
                    type="text"
                    className="rental-input"
                    value={basicInfo.color}
                    onChange={(e) => setBasicInfo({ ...basicInfo, color: e.target.value })}
                  />
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">License Plate (Registration No)<span className="req">*</span></label>
                  <input
                    type="text"
                    className="rental-input"
                    value={basicInfo.registrationNumber}
                    onChange={(e) => setBasicInfo({ ...basicInfo, registrationNumber: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card B: Classification & Location */}
            <div className="rental-form-card">
              <div className="rental-section-header">
                <h3>Classification</h3>
                <p>Assign a class and location to this vehicle</p>
              </div>

              <div className="rental-input-grid">
                <div className="rental-field-group">
                  <label className="rental-label">Vehicle Category<span className="req">*</span></label>
                  <select
                    className="rental-select"
                    value={basicInfo.category}
                    onChange={(e) => setBasicInfo({ ...basicInfo, category: e.target.value })}
                  >
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="MUV / 7-Seater">MUV / 7-Seater</option>
                    <option value="Bike / Scooter">Bike / Scooter</option>
                    <option value="Commercial LCV">Commercial LCV</option>
                  </select>
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">Vehicle Rental Type<span className="req">*</span></label>
                  <select
                    className="rental-select"
                    value={basicInfo.vehicleType}
                    onChange={(e) => setBasicInfo({ ...basicInfo, vehicleType: e.target.value })}
                  >
                    <option value="Self-Drive Rental">Self-Drive Rental (Zoomcar Style)</option>
                    <option value="With Driver / Chauffeur">With Driver / Chauffeur</option>
                    <option value="Commercial Goods Lease">Commercial Goods Lease</option>
                  </select>
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">Assigned Location Hub<span className="req">*</span></label>
                  <input
                    type="text"
                    className="rental-input"
                    value={basicInfo.location}
                    onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card C: Technical Specifications */}
            <div className="rental-form-card">
              <div className="rental-section-header">
                <h3>Specifications</h3>
                <p>Vehicle technical specifications and passenger comfort</p>
              </div>

              <div className="rental-input-grid">
                <div className="rental-field-group">
                  <label className="rental-label">Seating Capacity</label>
                  <select
                    className="rental-select"
                    value={basicInfo.seatingCapacity}
                    onChange={(e) => setBasicInfo({ ...basicInfo, seatingCapacity: e.target.value })}
                  >
                    <option value="2 Seats">2 Seats (Bike / Roadster)</option>
                    <option value="4 Seats">4 Seats</option>
                    <option value="5 Seats">5 Seats</option>
                    <option value="7 Seats">7 Seats</option>
                    <option value="8+ Seats">8+ Seats</option>
                  </select>
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">Transmission<span className="req">*</span></label>
                  <select
                    className="rental-select"
                    value={basicInfo.transmission}
                    onChange={(e) => setBasicInfo({ ...basicInfo, transmission: e.target.value })}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="iMT / Clutchless">iMT / Clutchless</option>
                  </select>
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">Fuel Type<span className="req">*</span></label>
                  <select
                    className="rental-select"
                    value={basicInfo.fuelType}
                    onChange={(e) => setBasicInfo({ ...basicInfo, fuelType: e.target.value })}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG + Petrol">CNG + Petrol</option>
                    <option value="Electric (EV)">Electric (EV)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">Air Conditioning (AC)</label>
                  <select
                    className="rental-select"
                    value={basicInfo.ac}
                    onChange={(e) => setBasicInfo({ ...basicInfo, ac: e.target.value })}
                  >
                    <option value="Yes">Yes (Climate Control)</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="rental-field-group">
                  <label className="rental-label">Fuel Mileage</label>
                  <input
                    type="text"
                    className="rental-input"
                    value={basicInfo.mileage}
                    onChange={(e) => setBasicInfo({ ...basicInfo, mileage: e.target.value })}
                  />
                </div>
              </div>

              <div className="rental-field-group" style={{ marginTop: '16px' }}>
                <label className="rental-label">Vehicle Description</label>
                <textarea
                  rows={3}
                  className="rental-textarea"
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className="rental-btn-primary"
              >
                Next: Upload Vehicle Photos <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: REQUIRED VEHICLE IMAGES ================= */}
        {activeTab === 'images' && (
          <div>
            <div className="rental-form-card">
              <div className="rental-section-header">
                <h3>Vehicle Photos (Interior & Exterior)</h3>
                <p>Upload clear, high-resolution photos. Important: Vehicle images are kept separate from official vehicle documents.</p>
              </div>

              {/* Exterior Photos */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a' }}>Exterior</h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>Upload at least 4 exterior views showing vehicle condition and paint</p>

                <div className="rental-photo-grid">
                  {[
                    { key: 'frontView', label: 'Front View' },
                    { key: 'rearView', label: 'Rear View' },
                    { key: 'leftSide', label: 'Left Side' },
                    { key: 'rightSide', label: 'Right Side' },
                    { key: 'numberPlate', label: 'Number Plate (Verification)' }
                  ].map((item) => (
                    <div key={item.key} className="rental-photo-slot has-image">
                      <img src={vehicleImages[item.key]} alt={item.label} />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(15, 23, 42, 0.75)',
                        color: '#ffffff',
                        fontSize: '10.5px',
                        padding: '4px 6px',
                        fontWeight: '700',
                        textAlign: 'center'
                      }}>
                        {item.label}
                      </div>
                    </div>
                  ))}

                  {/* Add more button */}
                  <div className="rental-photo-slot" onClick={() => alert('Add extra exterior photos')}>
                    <i className="fa-solid fa-plus" style={{ fontSize: '24px', color: '#2563eb' }}></i>
                    <span className="slot-title">Add Photo</span>
                  </div>
                </div>
              </div>

              {/* Interior Photos */}
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a' }}>Interior</h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>Dashboard, passenger seating, clean upholstery, and luggage space</p>

                <div className="rental-photo-grid">
                  {[
                    { key: 'interiorDash', label: 'Interior Dashboard' },
                    { key: 'frontSeats', label: 'Front Seats' },
                    { key: 'rearSeats', label: 'Rear Seats' },
                    { key: 'bootLuggage', label: 'Boot / Luggage Space' }
                  ].map((item) => (
                    <div key={item.key} className="rental-photo-slot has-image">
                      <img src={vehicleImages[item.key]} alt={item.label} />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(15, 23, 42, 0.75)',
                        color: '#ffffff',
                        fontSize: '10.5px',
                        padding: '4px 6px',
                        fontWeight: '700',
                        textAlign: 'center'
                      }}>
                        {item.label}
                      </div>
                    </div>
                  ))}

                  <div className="rental-photo-slot" onClick={() => alert('Add extra interior photos')}>
                    <i className="fa-solid fa-plus" style={{ fontSize: '24px', color: '#2563eb' }}></i>
                    <span className="slot-title">Add Photo</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className="rental-btn-secondary"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Basic Info
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className="rental-btn-primary"
              >
                Next: Legal Documents & RC <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION 3: LEGAL DOCUMENTS ================= */}
        {activeTab === 'documents' && (
          <div>
            <VehicleDocuments
              documents={documents}
              onChange={handleDocumentChange}
              onAdminStatusChange={handleAdminDocStatus}
              isAdmin={true}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className="rental-btn-secondary"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Images
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className="rental-btn-primary"
              >
                Next: Pricing & Availability <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION 4: PRICING & CALENDAR ================= */}
        {activeTab === 'pricing' && (
          <div>
            <VehiclePricingCalendar
              pricing={pricing}
              onPricingChange={setPricing}
              calendar={calendar}
              onCalendarChange={setCalendar}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className="rental-btn-secondary"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Documents
              </button>

              <button
                type="submit"
                className="rental-btn-success"
                style={{ padding: '12px 32px', fontSize: '15px' }}
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
                Publish Vehicle Listing (Step 5)
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
