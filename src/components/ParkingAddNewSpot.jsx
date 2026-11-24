import React, { useState, useRef } from 'react';
import {
  MapPin,
  ShieldCheck,
  Clock,
  Car,
  Bike,
  Truck,
  Plus,
  Minus,
  Trash2,
  Upload,
  Check,
  Copy,
  Download,
  Sparkles,
  Eye,
  Camera,
  Navigation,
  Zap,
  Lock,
  Sun,
  Droplets,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronLeft,
  Building,
  Home,
  Warehouse,
  Shield,
  FileText,
  User,
  Phone,
  Info,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

export default function ParkingAddNewSpot({ onCancel = () => {}, onAddSpot = () => {} }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Details & Location
    spotName: 'Sector 44 Prime Multi-Vehicle Yard',
    spaceType: 'Open Yard', // Open Yard, Covered Shed, Basement, Private Driveway
    doorNo: 'Plot No. 14-B',
    streetName: 'Main Commercial Belt Road',
    locality: 'Sector 44',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122003',
    landmark: 'Opposite Cyber City Metro Gate 2',
    gateWidthFt: '16',
    gateHeightFt: '14',
    accessInstructions: 'Direct entry from main road. Scan QR code or show booking OTP to guard at gate.',
    latitude: 28.4595,
    longitude: 77.0266,

    // Step 2: Capacity, Pricing & Features
    vehicleTypes: {
      twoWheeler: { enabled: true, slots: 15, prefix: 'B', hourlyRate: 20, dailyRate: 150, monthlyRate: 2500 },
      fourWheeler: { enabled: true, slots: 25, prefix: 'C', hourlyRate: 50, dailyRate: 350, monthlyRate: 5000 },
      heavyVehicle: { enabled: false, slots: 5, prefix: 'H', hourlyRate: 100, dailyRate: 750, monthlyRate: 10000 },
    },
    is24x7: true,
    openTime: '06:00',
    closeTime: '23:00',
    gracePeriodMins: '15',
    overstayRateHr: '60',
    amenities: [
      'CCTV Surveillance',
      '24/7 Security Guard',
      'Gated / Boundary Wall',
      'Night Floodlights',
      '24/7 Access',
      'Paved / Concrete Surface'
    ],

    // Step 3: Photos, Owner Rules & Verification
    photos: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
        category: 'Wide Yard Overview',
        isCover: true
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
        category: 'Main Entrance / Gate',
        isCover: false
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
        category: 'Parking Slots',
        isCover: false
      }
    ],
    ownerName: 'Rajesh Sharma',
    primaryMobile: '+91 98765 43210',
    altMobile: '+91 98123 45678',
    bookingMode: 'Instant Booking', // 'Instant Booking' or 'Owner Approval'
    cancellationPolicy: 'Free up to 1 hr before',
    keyHandover: 'Self-Park (Keep Keys)',
    customRules: 'Strictly no engine idling inside the yard. Commercial unloading permitted only in designated bays.',
    idProofNumber: 'ABCD1234E',
    propertyProofType: 'Electricity Bill',
    propertyProofUploaded: true
  });

  // Validation State
  const [errors, setErrors] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Input Changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Handle Vehicle Capacity Changes
  const updateVehicleType = (type, key, value) => {
    setFormData((prev) => ({
      ...prev,
      vehicleTypes: {
        ...prev.vehicleTypes,
        [type]: {
          ...prev.vehicleTypes[type],
          [key]: value
        }
      }
    }));
  };

  // Toggle Amenity Checkbox
  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const current = prev.amenities;
      const updated = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: updated };
    });
  };

  // Map Click Handler for Interactive GPS Pin Drop
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Map canvas coordinates to lat/lng offsets around base Gurugram
    const latOffset = ((rect.height / 2 - y) / rect.height) * 0.04;
    const lngOffset = ((x - rect.width / 2) / rect.width) * 0.04;

    const newLat = parseFloat((28.4595 + latOffset).toFixed(4));
    const newLng = parseFloat((77.0266 + lngOffset).toFixed(4));

    setFormData((prev) => ({
      ...prev,
      latitude: newLat,
      longitude: newLng
    }));
    showToast(`GPS Pin updated: ${newLat}, ${newLng}`);
  };

  // Detect GPS Location
  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(position.coords.latitude.toFixed(4)),
            longitude: parseFloat(position.coords.longitude.toFixed(4))
          }));
          showToast('GPS location detected successfully!');
        },
        () => {
          // Fallback location
          setFormData((prev) => ({ ...prev, latitude: 28.4595, longitude: 77.0266 }));
          showToast('Using high-accuracy yard GPS pin fallback.');
        }
      );
    } else {
      showToast('Geolocation not supported by browser.');
    }
  };

  // Sample Photos Loader
  const handleLoadSamplePhotos = () => {
    const samplePhotos = [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
        category: 'Wide Yard Overview',
        isCover: true
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
        category: 'Main Entrance / Gate',
        isCover: false
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
        category: 'Parking Slots',
        isCover: false
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        category: 'CCTV / Security Proof',
        isCover: false
      }
    ];
    setFormData((prev) => ({ ...prev, photos: samplePhotos }));
    setActivePhotoIndex(0);
    showToast('Loaded sample yard photos!');
  };

  // Add Custom Photo via file upload simulation
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotos = files.map((file, idx) => ({
      id: Date.now() + idx + '',
      url: URL.createObjectURL(file),
      category: 'Parking Slots',
      isCover: formData.photos.length === 0 && idx === 0
    }));

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
    showToast(`Added ${files.length} photo(s)`);
  };

  // Delete Photo
  const handleDeletePhoto = (id) => {
    setFormData((prev) => {
      const filtered = prev.photos.filter((p) => p.id !== id);
      // If deleted was cover, set first as cover
      if (filtered.length > 0 && !filtered.some((p) => p.isCover)) {
        filtered[0].isCover = true;
      }
      return { ...prev, photos: filtered };
    });
    if (activePhotoIndex >= formData.photos.length - 1) {
      setActivePhotoIndex(Math.max(0, formData.photos.length - 2));
    }
  };

  // Set Cover Photo
  const handleSetCoverPhoto = (id) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.map((p) => ({
        ...p,
        isCover: p.id === id
      }))
    }));
    showToast('Updated main listing cover photo.');
  };

  // Step Validation
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.spotName.trim()) newErrors.spotName = 'Parking spot name is required';
      if (!formData.doorNo.trim()) newErrors.doorNo = 'Door/Plot number is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
    } else if (step === 2) {
      const anyEnabled = Object.values(formData.vehicleTypes).some((v) => v.enabled);
      if (!anyEnabled) newErrors.vehicleTypes = 'Select at least one vehicle type';
    } else if (step === 3) {
      if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
      if (!formData.primaryMobile.trim()) newErrors.primaryMobile = 'Mobile number is required';
      if (formData.photos.length === 0) newErrors.photos = 'Upload at least 1 yard photo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Please complete required fields highlighted in red.');
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublish = () => {
    if (validateStep(3)) {
      setShowJsonModal(true);
      try {
        onAddSpot(formData);
      } catch (e) {}
    } else {
      showToast('Please complete required details before publishing.');
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `parking-spot-${formData.spotName.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Calculated Preview Metrics
  const minPrice = Math.min(
    ...Object.values(formData.vehicleTypes)
      .filter((v) => v.enabled)
      .map((v) => v.hourlyRate || 0)
  );

  const totalSlots = Object.values(formData.vehicleTypes)
    .filter((v) => v.enabled)
    .reduce((acc, curr) => acc + (parseInt(curr.slots) || 0), 0);

  const activeCoverPhoto =
    formData.photos.find((p) => p.isCover)?.url ||
    formData.photos[0]?.url ||
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-6 px-4 md:px-8 font-sans text-slate-800">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#2a1373] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar with Cancel / Back to Parking */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Parking Fleet</span>
            </button>
            <h1 className="text-lg font-bold text-slate-800">Add Parking Spot / Commercial Yard</h1>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
        </div>

        {/* ========================================================= */}
        {/* CRITICAL STEPPER COMPONENT (EXACT DESIGN MATCH)           */}
        {/* ========================================================= */}
        <div className="max-w-3xl mx-auto py-4 px-2 flex items-center justify-between">
          {[1, 2, 3].map((stepNumber, index) => {
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <React.Fragment key={stepNumber}>
                {/* Step Circle */}
                <button
                  type="button"
                  onClick={() => isCompleted && setCurrentStep(stepNumber)}
                  disabled={isUpcoming}
                  aria-label={`Step ${stepNumber}`}
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 select-none ${
                    isActive
                      ? 'bg-[#2a1373] text-white ring-[6px] ring-[#c5bddc] shadow-md scale-105'
                      : isCompleted
                      ? 'bg-[#2a1373] text-white cursor-pointer hover:opacity-90'
                      : 'bg-[#cbd3df] text-white cursor-not-allowed'
                  }`}
                >
                  {stepNumber}
                </button>

                {/* Detached Connector Line between steps */}
                {index < 2 && (
                  <div
                    className={`mx-6 sm:mx-12 flex-1 h-[3px] rounded-full transition-colors duration-300 ${
                      stepNumber < currentStep ? 'bg-[#2a1373]' : 'bg-[#cbd3df]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Live Preview Button Floating bar (Small screens) */}
        <div className="lg:hidden flex justify-end">
          <button
            onClick={() => setShowMobilePreview(true)}
            className="flex items-center gap-2 bg-[#2a1373] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg hover:bg-[#1f0d57] transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Driver Listing</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* MAIN 12-COLUMN GRID LAYOUT                                */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT 8 COLUMNS: FORM STEPS */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 md:p-8">

            {/* STEP 1: BASIC DETAILS & LOCATION */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2a1373] bg-[#f3f0ff] px-2.5 py-1 rounded-md">
                    Step 1 of 3
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-2">
                    Basic Details & GPS Location
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Enter your parking space title, street address, and drop the pin for drivers.
                  </p>
                </div>

                {/* Spot Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Parking Spot Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.spotName}
                    onChange={(e) => handleInputChange('spotName', e.target.value)}
                    placeholder="e.g. Sector 44 Secured Open Car & Bike Yard"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2a1373] transition-all ${
                      errors.spotName ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  />
                  {errors.spotName && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.spotName}
                    </p>
                  )}
                </div>

                {/* Space Type Selector Cards */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    Select Space Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'Open Yard', label: 'Open Yard', icon: Warehouse },
                      { id: 'Covered Shed', label: 'Covered Shed', icon: Building },
                      { id: 'Basement', label: 'Basement', icon: Layers },
                      { id: 'Private Driveway', label: 'Driveway', icon: Home }
                    ].map((item) => {
                      const IconComp = item.icon;
                      const isSelected = formData.spaceType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleInputChange('spaceType', item.id)}
                          className={`p-3.5 rounded-xl border text-left flex flex-col items-center sm:items-start justify-between gap-2 transition-all ${
                            isSelected
                              ? 'border-[#2a1373] bg-[#f3f0ff] text-[#2a1373] ring-1 ring-[#2a1373] shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <IconComp className={`w-5 h-5 ${isSelected ? 'text-[#2a1373]' : 'text-slate-400'}`} />
                          <span className="text-xs font-semibold">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Full Address Fields */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2a1373]" /> Full Address & Location
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Door / Plot / House No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.doorNo}
                        onChange={(e) => handleInputChange('doorNo', e.target.value)}
                        placeholder="Plot No. 14-B"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                      />
                      {errors.doorNo && (
                        <p className="text-xs text-red-500 mt-1">{errors.doorNo}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Street / Road Name</label>
                      <input
                        type="text"
                        value={formData.streetName}
                        onChange={(e) => handleInputChange('streetName', e.target.value)}
                        placeholder="Main Commercial Belt Road"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Area / Locality</label>
                      <input
                        type="text"
                        value={formData.locality}
                        onChange={(e) => handleInputChange('locality', e.target.value)}
                        placeholder="Sector 44"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Gurugram"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="122003"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Nearby Landmark</label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                      placeholder="Opposite Cyber City Metro Gate 2"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                    />
                  </div>
                </div>

                {/* Interactive Vector Map Canvas */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Interactive GPS Location Pin
                      </h4>
                      <p className="text-xs text-slate-500">Click anywhere on the map grid to adjust latitude/longitude.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f0ff] text-[#2a1373] hover:bg-[#e6deff] rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Detect My GPS</span>
                    </button>
                  </div>

                  <div
                    onClick={handleMapClick}
                    className="relative w-full h-56 bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 cursor-crosshair group shadow-inner"
                  >
                    {/* SVG Vector Map Graphics */}
                    <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                      {/* Grid background */}
                      <defs>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      {/* Main Road overlay */}
                      <path d="M -20 100 L 500 220" stroke="#fbbf24" strokeWidth="24" strokeLinecap="round" />
                      <path d="M 180 -10 L 220 300" stroke="#64748b" strokeWidth="18" strokeLinecap="round" />
                      <path d="M -20 100 L 500 220" stroke="#ffffff" strokeWidth="2" strokeDasharray="8,8" />
                      {/* Building Rects */}
                      <rect x="40" y="30" width="70" height="50" rx="4" fill="#334155" />
                      <rect x="260" y="40" width="90" height="60" rx="4" fill="#334155" />
                      <rect x="70" y="150" width="80" height="50" rx="4" fill="#334155" />
                      <rect x="300" y="160" width="100" height="60" rx="4" fill="#334155" />
                    </svg>

                    {/* Animated Pulsing Location Marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-purple-400 opacity-75"></span>
                        <div className="relative bg-[#2a1373] text-white p-2 rounded-full shadow-2xl border-2 border-white">
                          <MapPin className="w-5 h-5 text-amber-300" />
                        </div>
                      </div>
                      <div className="mt-1 bg-slate-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-sm border border-slate-700 shadow-md">
                        {formData.latitude}, {formData.longitude}
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 pointer-events-none">
                      📍 Click anywhere to move location pin
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-medium">Latitude:</span>{' '}
                      <span className="font-mono font-bold text-slate-800">{formData.latitude}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-medium">Longitude:</span>{' '}
                      <span className="font-mono font-bold text-slate-800">{formData.longitude}</span>
                    </div>
                  </div>
                </div>

                {/* Gate Clearance & Instructions */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Gate Clearance & Instructions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Gate Width (ft)</label>
                      <input
                        type="number"
                        value={formData.gateWidthFt}
                        onChange={(e) => handleInputChange('gateWidthFt', e.target.value)}
                        placeholder="16"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Max Height Clearance (ft)</label>
                      <input
                        type="number"
                        value={formData.gateHeightFt}
                        onChange={(e) => handleInputChange('gateHeightFt', e.target.value)}
                        placeholder="14"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Access / Gate Note for Driver</label>
                    <textarea
                      rows={2}
                      value={formData.accessInstructions}
                      onChange={(e) => handleInputChange('accessInstructions', e.target.value)}
                      placeholder="e.g. Direct entry from main road. Scan QR code or call owner."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CAPACITY, PRICING & FEATURES */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2a1373] bg-[#f3f0ff] px-2.5 py-1 rounded-md">
                    Step 2 of 3
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-2">
                    Vehicle Capacity & Pricing Rules
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Configure slot counts, hourly/daily tariffs, operating hours, and security amenities.
                  </p>
                </div>

                {errors.vehicleTypes && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {errors.vehicleTypes}
                  </div>
                )}

                {/* Vehicle Matrix Cards */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Vehicle Types & Slots Breakdown
                  </h3>

                  {[
                    { key: 'twoWheeler', title: '2-Wheeler (Bikes / Scooters)', icon: Bike, badgeColor: 'bg-emerald-50 text-emerald-700' },
                    { key: 'fourWheeler', title: '4-Wheeler (Cars / SUVs)', icon: Car, badgeColor: 'bg-blue-50 text-blue-700' },
                    { key: 'heavyVehicle', title: 'Heavy / Commercial (Autos / Trucks)', icon: Truck, badgeColor: 'bg-amber-50 text-amber-700' }
                  ].map((item) => {
                    const data = formData.vehicleTypes[item.key];
                    const IconComponent = item.icon;

                    return (
                      <div
                        key={item.key}
                        className={`p-4 rounded-2xl border transition-all ${
                          data.enabled
                            ? 'border-[#2a1373]/30 bg-white shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${item.badgeColor}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                              <span className="text-[11px] text-slate-400">Prefix: {data.prefix}</span>
                            </div>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={data.enabled}
                              onChange={(e) => updateVehicleType(item.key, 'enabled', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2a1373]"></div>
                          </label>
                        </div>

                        {data.enabled && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                            <div>
                              <label className="block text-[11px] font-medium text-slate-500 mb-1">Total Slots</label>
                              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => updateVehicleType(item.key, 'slots', Math.max(1, data.slots - 1))}
                                  className="px-2 py-1.5 text-slate-600 hover:bg-slate-200"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="flex-1 text-center font-bold text-sm text-slate-800">{data.slots}</span>
                                <button
                                  type="button"
                                  onClick={() => updateVehicleType(item.key, 'slots', data.slots + 1)}
                                  className="px-2 py-1.5 text-slate-600 hover:bg-slate-200"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-500 mb-1">Hourly Rate (₹)</label>
                              <input
                                type="number"
                                value={data.hourlyRate}
                                onChange={(e) => updateVehicleType(item.key, 'hourlyRate', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-500 mb-1">24-Hr Rate (₹)</label>
                              <input
                                type="number"
                                value={data.dailyRate}
                                onChange={(e) => updateVehicleType(item.key, 'dailyRate', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-500 mb-1">Monthly Pass (₹)</label>
                              <input
                                type="number"
                                value={data.monthlyRate}
                                onChange={(e) => updateVehicleType(item.key, 'monthlyRate', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm text-slate-800"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Operating Hours & Overstay Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#2a1373]" />
                        <span className="text-xs font-bold text-slate-800">Operating Hours</span>
                      </div>
                      <span className="text-xs font-semibold text-[#2a1373]">
                        {formData.is24x7 ? '24/7 Open' : 'Custom Hours'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-600">Open 24 Hours Daily</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is24x7}
                          onChange={(e) => handleInputChange('is24x7', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2a1373]"></div>
                      </label>
                    </div>

                    {!formData.is24x7 && (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div>
                          <label className="block text-[10px] text-slate-500">Open Time</label>
                          <input
                            type="time"
                            value={formData.openTime}
                            onChange={(e) => handleInputChange('openTime', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Close Time</label>
                          <input
                            type="time"
                            value={formData.closeTime}
                            onChange={(e) => handleInputChange('closeTime', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#2a1373]" />
                      <span className="text-xs font-bold text-slate-800">Grace Period & Overstay</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Grace Period</label>
                        <select
                          value={formData.gracePeriodMins}
                          onChange={(e) => handleInputChange('gracePeriodMins', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                        >
                          <option value="0">0 Minutes</option>
                          <option value="10">10 Minutes</option>
                          <option value="15">15 Minutes</option>
                          <option value="30">30 Minutes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Overstay Fee (₹/hr)</label>
                        <input
                          type="number"
                          value={formData.overstayRateHr}
                          onChange={(e) => handleInputChange('overstayRateHr', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features & Amenities */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Features & Security Amenities
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { name: 'CCTV Surveillance', icon: Eye },
                      { name: '24/7 Security Guard', icon: Shield },
                      { name: 'Gated / Boundary Wall', icon: Lock },
                      { name: 'Night Floodlights', icon: Sun },
                      { name: '24/7 Access', icon: Clock },
                      { name: 'EV Charging Point', icon: Zap },
                      { name: 'Paved / Concrete Surface', icon: Layers },
                      { name: 'Washroom / Waiting Area', icon: Building },
                      { name: 'Car/Bike Wash', icon: Droplets }
                    ].map((item) => {
                      const IconComp = item.icon;
                      const isChecked = formData.amenities.includes(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => toggleAmenity(item.name)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                            isChecked
                              ? 'border-[#2a1373] bg-[#f3f0ff] text-[#2a1373] font-semibold shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <IconComp className={`w-4 h-4 ${isChecked ? 'text-[#2a1373]' : 'text-slate-400'}`} />
                          <span className="text-xs">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PHOTOS, OWNER RULES & VERIFICATION */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2a1373] bg-[#f3f0ff] px-2.5 py-1 rounded-md">
                    Step 3 of 3
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-2">
                    Photos, Owner Rules & Verification
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Upload clear yard photos, set owner rules, and provide owner verification proof.
                  </p>
                </div>

                {/* Photo Upload Area */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Yard Photos ({formData.photos.length})
                      </h3>
                      <p className="text-xs text-slate-500">Upload gate, parking bays & security setup photos.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLoadSamplePhotos}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold border border-amber-200 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Load Sample Yard Photos</span>
                    </button>
                  </div>

                  {errors.photos && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.photos}
                    </p>
                  )}

                  {/* Drag and Drop Zone */}
                  <label className="border-2 border-dashed border-slate-300 hover:border-[#2a1373] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-[#f3f0ff]/30 transition-all">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Camera className="w-8 h-8 text-[#2a1373] mb-2" />
                    <span className="text-xs font-bold text-slate-700">Click to upload or drag & drop photos</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG up to 10MB each</span>
                  </label>

                  {/* Uploaded Image Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {formData.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className={`p-3 rounded-2xl border flex gap-3 relative transition-all ${
                          photo.isCover ? 'border-[#2a1373] bg-[#f3f0ff]/40 ring-1 ring-[#2a1373]' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt="Yard preview"
                          className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              {photo.isCover ? (
                                <span className="bg-[#2a1373] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Award className="w-3 h-3" /> Cover Photo
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverPhoto(photo.id)}
                                  className="text-[10px] text-slate-500 hover:text-[#2a1373] font-medium"
                                >
                                  Set as Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="text-slate-400 hover:text-red-500 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <select
                              value={photo.category}
                              onChange={(e) => {
                                const newCat = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  photos: prev.photos.map((p) =>
                                    p.id === photo.id ? { ...p, category: newCat } : p
                                  )
                                }));
                              }}
                              className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg py-1 px-2 font-medium"
                            >
                              <option value="Wide Yard Overview">Wide Yard Overview</option>
                              <option value="Main Entrance / Gate">Main Entrance / Gate</option>
                              <option value="Parking Slots">Parking Slots</option>
                              <option value="CCTV / Security Proof">CCTV / Security Proof</option>
                              <option value="Night View">Night View</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Owner Contact */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Owner & Yard Manager Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Owner Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={formData.ownerName}
                          onChange={(e) => handleInputChange('ownerName', e.target.value)}
                          placeholder="Rajesh Sharma"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                        />
                      </div>
                      {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Primary Mobile <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={formData.primaryMobile}
                          onChange={(e) => handleInputChange('primaryMobile', e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                        />
                      </div>
                      {errors.primaryMobile && <p className="text-xs text-red-500 mt-1">{errors.primaryMobile}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Alternate / Guard Phone</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={formData.altMobile}
                          onChange={(e) => handleInputChange('altMobile', e.target.value)}
                          placeholder="+91 98123 45678"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking & Yard Rules */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Booking & Yard Rules
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Booking Approval Mode</label>
                      <select
                        value={formData.bookingMode}
                        onChange={(e) => handleInputChange('bookingMode', e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        <option value="Instant Booking">Instant Booking (Auto-Confirm)</option>
                        <option value="Owner Approval">Manual Owner Approval Required</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Cancellation Policy</label>
                      <select
                        value={formData.cancellationPolicy}
                        onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        <option value="Free up to 1 hr before">Free up to 1 hr before</option>
                        <option value="Free up to 3 hrs before">Free up to 3 hrs before</option>
                        <option value="Non-refundable">Non-refundable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Key Handover Rule</label>
                      <select
                        value={formData.keyHandover}
                        onChange={(e) => handleInputChange('keyHandover', e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        <option value="Self-Park (Keep Keys)">Self-Park (Keep Keys)</option>
                        <option value="Leave Keys with Guard">Leave Keys with Guard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Custom Yard Rules</label>
                    <textarea
                      rows={2}
                      value={formData.customRules}
                      onChange={(e) => handleInputChange('customRules', e.target.value)}
                      placeholder="e.g. No engine idling inside yard. Commercial trucks allowed only between 8am to 8pm."
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                    />
                  </div>
                </div>

                {/* Private Owner Verification */}
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-3">
                  <div className="flex items-center gap-2 text-[#2a1373]">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Private Owner Verification</span>
                    <span className="text-[10px] bg-purple-200 text-[#2a1373] px-2 py-0.5 rounded-full font-bold ml-auto">
                      Encrypted & Private
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Owner Aadhaar / PAN No.</label>
                      <input
                        type="text"
                        value={formData.idProofNumber}
                        onChange={(e) => handleInputChange('idProofNumber', e.target.value)}
                        placeholder="ABCD1234E"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Property Ownership Document</label>
                      <div className="flex items-center gap-2">
                        <select
                          value={formData.propertyProofType}
                          onChange={(e) => handleInputChange('propertyProofType', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                        >
                          <option value="Electricity Bill">Electricity Bill</option>
                          <option value="Property Tax Receipt">Property Tax Receipt</option>
                          <option value="Rental / Lease Agreement">Rental / Lease Agreement</option>
                        </select>
                        <div className="bg-emerald-100 text-emerald-800 p-2 rounded-xl flex items-center gap-1 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Attached
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FORM FOOTER CONTROLS */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  currentStep === 1
                    ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2a1373] text-white hover:bg-[#200e5c] rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#2a1373] text-white hover:bg-[#1b0a52] rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" /> Publish Parking Spot
                </button>
              )}
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: STICKY LIVE DRIVER PREVIEW CARD */}
          <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-6 space-y-4">
            <LiveDriverPreviewCard
              formData={formData}
              minPrice={minPrice}
              totalSlots={totalSlots}
              activeCoverPhoto={activeCoverPhoto}
              activePhotoIndex={activePhotoIndex}
              setActivePhotoIndex={setActivePhotoIndex}
            />
          </div>

        </div>

      </div>

      {/* MOBILE LIVE PREVIEW MODAL / DRAWER */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-4 space-y-4 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Driver Listing Live Preview</h3>
              <button
                onClick={() => setShowMobilePreview(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <LiveDriverPreviewCard
              formData={formData}
              minPrice={minPrice}
              totalSlots={totalSlots}
              activeCoverPhoto={activeCoverPhoto}
              activePhotoIndex={activePhotoIndex}
              setActivePhotoIndex={setActivePhotoIndex}
            />
          </div>
        </div>
      )}

      {/* SUCCESS & JSON MODAL */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Spot Published!</span>
                  <h3 className="text-xl font-bold text-slate-900">{formData.spotName}</h3>
                </div>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Summary Strip */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Location</span>
                <span className="text-xs font-bold text-slate-800">{formData.city}, {formData.locality}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Total Capacity</span>
                <span className="text-xs font-bold text-[#2a1373]">{totalSlots} Slots</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Base Tariff</span>
                <span className="text-xs font-bold text-emerald-600">₹{minPrice}/hr</span>
              </div>
            </div>

            {/* JSON Data Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Node.js / MongoDB Payload JSON
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyJson}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={downloadJson}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2a1373] text-white hover:bg-[#1e0c57] rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>

              <pre className="bg-slate-900 text-purple-300 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-60 border border-slate-800">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// ====================================================================
// REUSABLE LIVE DRIVER PREVIEW CARD COMPONENT
// ====================================================================
function LiveDriverPreviewCard({
  formData,
  minPrice,
  totalSlots,
  activeCoverPhoto,
  activePhotoIndex,
  setActivePhotoIndex
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden space-y-0">
      
      {/* Live Badge Banner Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Live Driver View
          </span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-semibold border border-slate-700">
          Mobile Ready
        </span>
      </div>

      {/* Image Gallery Container */}
      <div className="relative h-48 bg-slate-900 group">
        <img
          src={
            formData.photos[activePhotoIndex]?.url ||
            activeCoverPhoto
          }
          alt="Driver view"
          className="w-full h-full object-cover"
        />

        {/* Space Type Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
          {formData.spaceType}
        </div>

        {/* Instant Booking Pill */}
        <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
          <Zap className="w-3 h-3 text-amber-300" /> {formData.bookingMode}
        </div>

        {/* Carousel indicator dots */}
        {formData.photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-full">
            {formData.photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  activePhotoIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Listing Content Details */}
      <div className="p-5 space-y-4">

        {/* Spot Title & City */}
        <div>
          <h3 className="font-bold text-base text-slate-900 line-clamp-1">
            {formData.spotName || 'Untitled Parking Yard'}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#2a1373] flex-shrink-0" />
            <span>
              {formData.doorNo ? `${formData.doorNo}, ` : ''}
              {formData.locality ? `${formData.locality}, ` : ''}
              {formData.city || 'City'}
            </span>
          </p>
        </div>

        {/* Landmark Note */}
        {formData.landmark && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-[11px] text-slate-600 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">Landmark: {formData.landmark}</span>
          </div>
        )}

        {/* Price & Hours Bar */}
        <div className="flex items-center justify-between bg-[#f3f0ff] p-3 rounded-xl border border-[#c5bddc]/40">
          <div>
            <span className="text-[10px] font-semibold uppercase text-slate-500 block">Starting Tariff</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#2a1373]">₹{isFinite(minPrice) ? minPrice : 0}</span>
              <span className="text-xs text-slate-500 font-medium">/ hr</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold uppercase text-slate-500 block">Hours</span>
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-[#2a1373]" />
              {formData.is24x7 ? '24/7 Open' : `${formData.openTime} - ${formData.closeTime}`}
            </span>
          </div>
        </div>

        {/* Capacity Breakdown */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Vehicle Slots Available ({totalSlots} Total)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {formData.vehicleTypes.twoWheeler.enabled && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                <Bike className="w-3.5 h-3.5 text-emerald-600" />
                {formData.vehicleTypes.twoWheeler.slots} Bike Slots
              </span>
            )}
            {formData.vehicleTypes.fourWheeler.enabled && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                <Car className="w-3.5 h-3.5 text-blue-600" />
                {formData.vehicleTypes.fourWheeler.slots} Car Slots
              </span>
            )}
            {formData.vehicleTypes.heavyVehicle.enabled && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                {formData.vehicleTypes.heavyVehicle.slots} Heavy Bays
              </span>
            )}
          </div>
        </div>

        {/* Key Selected Amenities */}
        {formData.amenities.length > 0 && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Security & Features
            </span>
            <div className="flex flex-wrap gap-1">
              {formData.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="px-2 py-0.5 bg-[#f3f0ff] text-[#2a1373] text-[10px] font-semibold rounded-md"
                >
                  ✓ {amenity}
                </span>
              ))}
              {formData.amenities.length > 4 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-md">
                  +{formData.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Gate Clearance & Instructions Note */}
        {formData.accessInstructions && (
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 block mb-0.5">Gate Instructions:</span>
            <p className="italic line-clamp-2">"{formData.accessInstructions}"</p>
          </div>
        )}

      </div>
    </div>
  );
}