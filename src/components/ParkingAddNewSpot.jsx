
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

export default function ParkingAddNewSpot({ onCancel = () => { }, onAddSpot = () => { } }) {
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

  const [isLookingUpPincode, setIsLookingUpPincode] = useState(false);
  const [pincodePlaceName, setPincodePlaceName] = useState('');

  // Lookup pincode to fetch exact place name and city
  const lookupPincode = async (code) => {
    const cleanCode = (code || '').trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      setPincodePlaceName('');
      return;
    }
    setIsLookingUpPincode(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleanCode}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0].PostOffice?.length > 0) {
          const offices = data[0].PostOffice;
          const primary = offices.find(p => p.DeliveryStatus === 'Delivery') || offices[0];
          const place = primary.Name?.trim() || '';
          const district = primary.District?.trim() || '';
          const state = primary.State?.trim() || '';

          setPincodePlaceName(place);
          setFormData(prev => ({
            ...prev,
            pincode: cleanCode,
            city: district || place || prev.city,
            state: state || prev.state,
            locality: prev.locality || place,
            pincodePlace: place
          }));
          showToast(`Found: ${place}, ${district}`);
        }
      }
    } catch (e) {
      console.warn('Pincode fetch error:', e);
    } finally {
      setIsLookingUpPincode(false);
    }
  };

  // Handle Input Changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (field === 'pincode') {
      lookupPincode(value);
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

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Reverse geocode latitude and longitude into address fields using OpenStreetMap / Nominatim
  const reverseGeocodeLatLng = async (lat, lng) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const door = addr.house_number || addr.building || (addr.road ? `Plot near ${addr.road}` : '');
          const street = addr.road || addr.suburb || '';
          const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || addr.quarter || '';
          const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'City';
          const state = addr.state || '';
          const pincode = addr.postcode || '';
          const landmark = addr.amenity || addr.commercial || addr.industrial || addr.tourism || '';
          const placeBesidePin = locality || city || street;

          setFormData(prev => ({
            ...prev,
            latitude: parseFloat(lat.toFixed(4)),
            longitude: parseFloat(lng.toFixed(4)),
            doorNo: door || prev.doorNo,
            streetName: street || prev.streetName,
            locality: locality || prev.locality,
            city: city || prev.city,
            state: state || prev.state,
            pincode: pincode || prev.pincode,
            landmark: landmark ? `Near ${landmark}` : prev.landmark,
            pincodePlace: placeBesidePin
          }));

          if (placeBesidePin) setPincodePlaceName(placeBesidePin);
          showToast(`Location synced: ${locality || street}, ${city}`);
        }
      }
    } catch (e) {
      console.warn('Reverse geocoding error:', e);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Initialize and bind Leaflet Google Maps tile layer in Step 1
  useEffect(() => {
    if (currentStep !== 1) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const initialLat = formData.latitude || 28.4595;
      const initialLng = formData.longitude || 77.0266;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true
      });

      // Google Maps Roads Layer
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
        maxZoom: 20
      }).addTo(map);

      // Custom Google Map Pin SVG Marker
      const customPinIcon = L.divIcon({
        className: 'google-map-pin-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <svg viewBox="0 0 24 24" width="38" height="38" fill="#ea4335" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <div style="width: 14px; height: 5px; background: rgba(0,0,0,0.3); border-radius: 50%; margin-top: -2px;"></div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 36]
      });

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: customPinIcon
      }).addTo(map);

      // Drag event on marker
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(lat.toFixed(4)),
          longitude: parseFloat(lng.toFixed(4))
        }));
        reverseGeocodeLatLng(lat, lng);
      });

      // Click on map to place pin
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(lat.toFixed(4)),
          longitude: parseFloat(lng.toFixed(4))
        }));
        reverseGeocodeLatLng(lat, lng);
      });

      markerRef.current = marker;
      leafletMapRef.current = map;
    }, 150);

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Detect Owner Live GPS Location and auto-fill address
  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      showToast('Detecting owner live GPS location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(4));
          const lng = parseFloat(position.coords.longitude.toFixed(4));

          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng
          }));

          if (leafletMapRef.current && markerRef.current) {
            leafletMapRef.current.setView([lat, lng], 16);
            markerRef.current.setLatLng([lat, lng]);
          }

          reverseGeocodeLatLng(lat, lng);
          showToast('Live GPS location detected & address filled!');
        },
        () => {
          showToast('Geolocation permission denied or timed out.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
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
      } catch (e) { }
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
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 select-none ${isActive
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
                    className={`mx-6 sm:mx-12 flex-1 h-[3px] rounded-full transition-colors duration-300 ${stepNumber < currentStep ? 'bg-[#2a1373]' : 'bg-[#cbd3df]'
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
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2a1373] transition-all ${errors.spotName ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50/50'
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
                          className={`p-3.5 rounded-xl border text-left flex flex-col items-center sm:items-start justify-between gap-2 transition-all ${isSelected
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
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-600">PIN Code</label>
                        {isLookingUpPincode && (
                          <span className="text-[10px] text-[#2a1373] animate-pulse font-medium">Fetching area...</span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="122003"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a1373]"
                      />
                      {(pincodePlaceName || formData.pincodePlace) && (
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>Place: {pincodePlaceName || formData.pincodePlace}</span>
                        </div>
                      )}
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

                {/* Interactive Leaflet Google Maps Canvas */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>Interactive Google Map Pin & Live Geolocation</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Drag the pin or click anywhere on the Google map to automatically detect the address, city, and pincode!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f0ff] text-[#2a1373] hover:bg-[#e6deff] rounded-lg text-xs font-semibold transition-colors shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isReverseGeocoding ? 'Detecting...' : 'Detect My GPS'}</span>
                    </button>
                  </div>

                  {/* Leaflet Real Google Maps Canvas */}
                  <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-slate-300 shadow-md">
                    <div ref={mapContainerRef} className="w-full h-full z-10" />

                    {isReverseGeocoding && (
                      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-20 bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>Syncing address details from map...</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Latitude:</span>
                      <span className="font-mono font-bold text-slate-800">{formData.latitude}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Longitude:</span>
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
                    { key: 'twoWheeler', title: '2-Wheeler (Bikes)', icon: Bike, badgeColor: 'bg-emerald-50 text-emerald-700' },
                    { key: 'fourWheeler', title: '4-Wheeler (Cars)', icon: Car, badgeColor: 'bg-blue-50 text-blue-700' },
                    { key: 'heavyVehicle', title: '8 or 10 Wheeler Trucks or more', icon: Truck, badgeColor: 'bg-amber-50 text-amber-700' }
                  ].map((item) => {
                    const data = formData.vehicleTypes[item.key];
                    const IconComponent = item.icon;

                    return (
                      <div
                        key={item.key}
                        className={`p-4 rounded-2xl border transition-all ${data.enabled
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
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${isChecked
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
                        className={`p-3 rounded-2xl border flex gap-3 relative transition-all ${photo.isCover ? 'border-[#2a1373] bg-[#f3f0ff]/40 ring-1 ring-[#2a1373]' : 'border-slate-200 bg-white'
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
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${currentStep === 1
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
// REAL-TIME FLEET YARD CARD PREVIEW (EXACT DESIGN MATCHING IMAGE 2)
// ====================================================================
function LiveDriverPreviewCard({
  formData,
  minPrice,
  activeCoverPhoto,
  activePhotoIndex
}) {
  // Determine category badge matching image 2
  let categoryBadge = '4-Wheeler';
  if (formData.vehicleTypes?.heavyVehicle?.enabled) {
    categoryBadge = 'Trucks';
  } else if (formData.vehicleTypes?.fourWheeler?.enabled) {
    categoryBadge = '4-Wheeler';
  } else if (formData.vehicleTypes?.twoWheeler?.enabled) {
    categoryBadge = '2-Wheeler';
  }

  const hourlyTariff = isFinite(minPrice) ? minPrice : 20;
  const dailyTariff = Math.min(
    ...Object.values(formData.vehicleTypes || {})
      .filter((v) => v.enabled)
      .map((v) => Number(v.dailyRate) || 150)
  ) || 150;
  const monthlyTariff = Math.min(
    ...Object.values(formData.vehicleTypes || {})
      .filter((v) => v.enabled)
      .map((v) => Number(v.monthlyRate) || 2500)
  ) || 2500;

  const currentPhoto = formData.photos[activePhotoIndex]?.url || activeCoverPhoto;

  return (
    <div
      className="owner-vehicle-card"
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        position: 'relative'
      }}
    >
      {/* Image Frame with Star Badge and View Details Pill */}
      <div
        style={{
          width: '100%',
          height: '165px',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9'
        }}
      >
        <img
          src={currentPhoto}
          alt={formData.spotName || 'Parking Yard'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Rating Badge on Top-Left */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          borderRadius: '20px',
          padding: '3px 9px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11.5px',
          fontWeight: 700,
          color: '#1e293b',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <i className="fa-solid fa-star" style={{ color: '#f59e0b', fontSize: '11px' }}></i>
          <span>4.8</span>
        </div>

        {/* View Details Pill on Top-Right */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: 600,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
        }}>
          <i className="fa-solid fa-expand" style={{ fontSize: '10px' }}></i>
          <span>View Details</span>
        </div>
      </div>

      {/* Vehicle / Yard Body Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Category Pill */}
        <div>
          <span style={{
            background: '#e0f2fe',
            color: '#0284c7',
            borderRadius: '6px',
            padding: '3px 10px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'inline-block'
          }}>
            {categoryBadge}
          </span>
        </div>

        {/* Title & Primary Hourly Rate */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
          <h4
            style={{
              margin: 0,
              fontSize: '16.5px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.2px'
            }}
          >
            {formData.spotName || 'Sector 44 Prime Multi-Vehicle Yard'}
          </h4>
          <span style={{ fontSize: '17px', fontWeight: 800, color: '#2563eb' }}>
            ₹{hourlyTariff}/hr
          </span>
        </div>

        {/* Reg No & Location (Left) + Multi-Rate (Right) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '11.5px', color: '#64748b' }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span>Reg No: PLOT {formData.doorNo || '14-B'}</span> • <span>{formData.locality || formData.city || 'Gurugram'}</span>
          </div>
          <div style={{ whiteSpace: 'nowrap', fontWeight: 500, color: '#475569' }}>
            ₹{dailyTariff.toLocaleString()}/day • ₹{monthlyTariff.toLocaleString()}/month
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#f1f5f9', margin: '2px 0' }} />

        {/* Specs Row with Blue Icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 0',
          fontSize: '12px',
          fontWeight: 600,
          color: '#334155'
        }}>
          {/* Transmission / Gate Width */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3v18" />
              <path d="M18 3v18" />
              <path d="M6 12h12" />
              <circle cx="6" cy="3" r="1.5" fill="#2563eb" />
              <circle cx="18" cy="3" r="1.5" fill="#2563eb" />
              <circle cx="6" cy="21" r="1.5" fill="#2563eb" />
              <circle cx="18" cy="21" r="1.5" fill="#2563eb" />
            </svg>
            <span>Automatic</span>
          </div>

          {/* Fuel / Power */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17" />
              <path d="M15 9h2a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1" />
              <path d="M6 12h6" />
            </svg>
            <span>Petrol / EV</span>
          </div>

          {/* Capacity / Multi-Bay */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Multi-Bay</span>
          </div>
        </div>

        {/* Footer: Available Pill & Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid #f1f5f9'
        }}>
          <span
            style={{
              background: '#ecfdf5',
              color: '#059669',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            ● Available
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <i className="fa-solid fa-pen-to-square" style={{ color: '#0284c7' }}></i>
              <span>Edit</span>
            </button>

            <span
              style={{
                color: '#94a3b8',
                padding: '4px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="fa-regular fa-trash-can"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}