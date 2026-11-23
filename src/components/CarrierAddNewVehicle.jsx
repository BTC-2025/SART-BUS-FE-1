import React, { useState, useEffect } from 'react';
import './rentalVehicles/rentalVehicles.css';
import CarrierLocationModal from './CarrierLocationModal';

// BRAND & MODEL MASTER DATA CASCADE BY TRANSPORT MODE
const MASTER_DATA = {
  truck: {
    name: 'Truck',
    sub: 'Road Freight',
    icon: '🚛',
    iconImg: '/images/carrier_icon_truck.png',
    idLabel: 'Registration / RC Number',
    idPlaceholder: 'e.g. MH 12 PQ 8821',
    defaultDepot: 'Mumbai Nhava Sheva Logistics Park',
    defaultPayload: 28,
    defaultUnit: 'tonnes',
    defaultContainer: '24ft Heavy Open Body Container',
    defaultVolume: 52,
    defaultRateKm: 48,
    defaultBaseFee: 1800,
    defaultAdvance: 30,
    defaultDeposit: 3000,
    fuels: ['Diesel', 'Electric', 'CNG', 'LNG', 'Petrol'],
    brands: {
      'Tata Motors': ['Tata Ace Gold', 'Tata Intra V30', 'Tata 407 Gold', 'Tata Prima 5530.S', 'Tata Signa 4825.TK'],
      'Mahindra': ['Mahindra Bolero Pik-Up', 'Mahindra Blazo X 28', 'Mahindra Furio 12', 'Mahindra Supro Profit Truck', 'Mahindra Jeeto'],
      'Ashok Leyland': ['Dost + Cargo', 'Bada Dost i4', 'Ecomet Star 1415', 'AVTR 2820 Haulage'],
      'BharatBenz': ['BharatBenz 1217C', 'BharatBenz 1923R', 'BharatBenz 2823R', 'BharatBenz 3528CM'],
      'Eicher': ['Eicher Pro 2049', 'Eicher Pro 3015', 'Eicher Pro 6028'],
      'Volvo': ['Volvo FMX 440 Tipper', 'Volvo FM 420 Tractor']
    }
  },
  train: {
    name: 'Train',
    sub: 'Rail Rake',
    icon: '🚆',
    iconImg: '/images/carrier_icon_train.jpg',
    idLabel: 'Rake ID / Wagon Registration',
    idPlaceholder: 'e.g. IR-RAKE-8842-WR',
    defaultDepot: 'Dadri ICD Freight Corridor, Delhi NCR',
    defaultPayload: 1300,
    defaultUnit: 'tonnes',
    defaultContainer: '45 Wagon BLC Container Rake',
    defaultVolume: 2400,
    defaultRateKm: 320,
    defaultBaseFee: 25000,
    defaultAdvance: 40,
    defaultDeposit: 50000,
    fuels: ['Electric (3-Phase AC)', 'Diesel-Electric Locomotive', 'Hydrogen Hybrid'],
    brands: {
      'Indian Railways Freight': ['Boxn Open Wagon', 'Flat Container Rake (BLC)', 'Parcel Van (VPU)', 'Tank Wagon (BTPN)', 'Hopper Wagon (BOBYN)'],
      'CONCOR': ['High-Speed Container Flat Rake', 'Double Stack Container Rake'],
      'Private Freight Operators': ['Custom Industrial Cargo Rake', 'Bulk Chemical Tanker Rake']
    }
  },
  flight: {
    name: 'Flight',
    sub: 'Air Cargo',
    icon: '✈️',
    iconImg: '/images/carrier_icon_flight.png',
    idLabel: 'Tail Number / Aircraft Reg',
    idPlaceholder: 'e.g. VT-BDC / N782FD',
    defaultDepot: 'Delhi IGI Air Cargo Terminal 2',
    defaultPayload: 30,
    defaultUnit: 'tonnes',
    defaultContainer: 'Main Deck Cargo Pallets (LD3/LD8 Containers)',
    defaultVolume: 239,
    defaultRateKm: 450,
    defaultBaseFee: 35000,
    defaultAdvance: 50,
    defaultDeposit: 75000,
    fuels: ['Jet A-1 Fuel', 'Sustainable Aviation Fuel (SAF)', 'Hybrid Electric'],
    brands: {
      'Blue Dart Aviation': ['Boeing 757-200F Freighter'],
      'IndiGo CarGo': ['Airbus A321P2F Freighter'],
      'Air India Cargo': ['Boeing 777F Heavy Cargo'],
      'SpiceXpress': ['Boeing 737-800BCF Freighter'],
      'FedEx': ['ATR 72-600F Feeder Freighter']
    }
  },
  ship: {
    name: 'Ship',
    sub: 'Ocean Freight',
    icon: '🚢',
    iconImg: '/images/carrier_icon_ship.png',
    idLabel: 'IMO Number / Vessel Reg',
    idPlaceholder: 'e.g. IMO 9823412 / SCI-889',
    defaultDepot: 'Jawaharlal Nehru Port Trust (JNPT), Mumbai',
    defaultPayload: 52000,
    defaultUnit: 'tonnes',
    defaultContainer: '4500 TEU ISO Marine Container Hold',
    defaultVolume: 85000,
    defaultRateKm: 650,
    defaultBaseFee: 120000,
    defaultAdvance: 40,
    defaultDeposit: 200000,
    fuels: ['Heavy Fuel Oil (HFO)', 'Low Sulfur Marine Gas Oil (MGO)', 'LNG Marine', 'Dual-Fuel'],
    brands: {
      'Shipping Corporation of India': ['Coastal Cargo Feeder', 'Bulk Carrier Ocean Express'],
      'Maersk': ['Panamax Container Vessel (4500 TEU)', 'Triple-E Megamax Vessel'],
      'MSC': ['Post-Panamax Freight Vessel', 'Regional Feeder Container'],
      'CMA CGM': ['LNG Cargo Transport Vessel', 'Ro-Ro Car Carrier']
    }
  },
  bike: {
    name: 'Bike',
    sub: 'Express EV/Bike',
    icon: '🏍️',
    iconImg: '/images/carrier_icon_bike.png',
    idLabel: 'Registration / Frame ID',
    idPlaceholder: 'e.g. MH 14 EV 4012',
    defaultDepot: 'Pune Central Last-Mile Delivery Hub',
    defaultPayload: 150,
    defaultUnit: 'kg',
    defaultContainer: 'Insulated Last-Mile Top Box (65L)',
    defaultVolume: 0.65,
    defaultRateKm: 14,
    defaultBaseFee: 120,
    defaultAdvance: 25,
    defaultDeposit: 1000,
    fuels: ['Electric (EV)', 'Petrol', 'CNG'],
    brands: {
      'TVS': ['TVS King Cargo 3-Wheeler', 'Heavy-Duty XL Cargo'],
      'Bajaj': ['Bajaj Maxima C Cargo Auto', 'Super Delivery 150'],
      'Hero': ['Hero Electric Cargo Scooter', 'Destini Cargo Special'],
      'Ola Electric': ['Ola S1 Pro Commercial Cargo Edition'],
      'Ather': ['Ather Commercial Cargo EV'],
      'Yulu': ['Yulu Wynn Cargo Heavy Delivery']
    }
  }
};

export default function CarrierAddNewVehicle({
  onAddCarrierVehicle = (newVehicle) => { },
  onSaveEditVehicle = (updatedVehicle) => { },
  onCancel = () => { },
  initialVehicle = null,
  isEditMode = false
}) {
  // Transport Mode State
  const [masterData, setMasterData] = useState(MASTER_DATA);
  const [selectedMode, setSelectedMode] = useState(initialVehicle?.mode || 'truck');

  // Brand & Model State
  const [selectedBrand, setSelectedBrand] = useState(initialVehicle?.brand || 'Tata Motors');
  const [selectedModel, setSelectedModel] = useState(initialVehicle?.model || 'Tata Ace Gold');

  // Identification & Specs
  const [regId, setRegId] = useState(initialVehicle?.plate || initialVehicle?.regId || '');
  const [fuelType, setFuelType] = useState(initialVehicle?.fuel || 'Diesel');
  const [hubDepot, setHubDepot] = useState(initialVehicle?.hub || initialVehicle?.location || 'Tata Steel Logistics Hub, Chennai, Tamil Nadu - 600081');
  const [hubAddress, setHubAddress] = useState(initialVehicle?.hub || initialVehicle?.location || 'Tata Steel Logistics Hub, Chennai, Tamil Nadu - 600081');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manufacturingYear, setManufacturingYear] = useState(String(initialVehicle?.year || '2024'));
  const [unitsCount, setUnitsCount] = useState(initialVehicle?.units || 1);

  // Payload & Weights
  const [weightUnit, setWeightUnit] = useState(
    initialVehicle?.weightUnit?.toLowerCase()?.includes('kg') ? 'kg' : 'tonnes'
  );
  const [payloadValue, setPayloadValue] = useState(
    initialVehicle?.maxPayload !== undefined ? initialVehicle.maxPayload : 28
  );
  const [containerSpace, setContainerSpace] = useState(initialVehicle?.containerSpace || '20ft Closed Container / Flatbed');
  const [volumeCapacity, setVolumeCapacity] = useState(initialVehicle?.volumeCapacity !== undefined ? initialVehicle.volumeCapacity : 38.5);

  // Special Features
  const [isReefer, setIsReefer] = useState(!!initialVehicle?.isReefer);
  const [hasGps, setHasGps] = useState(initialVehicle ? initialVehicle.hasGps !== false : true);
  const [isHazmat, setIsHazmat] = useState(!!initialVehicle?.isHazmat);

  // Commercial Tariffs
  const [ratePerKm, setRatePerKm] = useState(initialVehicle?.ratePerKm !== undefined ? initialVehicle.ratePerKm : 48);
  const [baseCharge, setBaseCharge] = useState(initialVehicle?.baseCharge !== undefined ? initialVehicle.baseCharge : 1800);
  const [advancePercent, setAdvancePercent] = useState(initialVehicle?.advancePercent !== undefined ? initialVehicle.advancePercent : 30);
  const [deposit, setDeposit] = useState(initialVehicle?.deposit !== undefined ? initialVehicle.deposit : 3000);

  // Media
  const [uploadedImages, setUploadedImages] = useState(
    initialVehicle?.images?.length ? initialVehicle.images : (initialVehicle?.image ? [initialVehicle.image] : [])
  );

  // Sync initialVehicle when editing
  useEffect(() => {
    if (initialVehicle) {
      const vMode = initialVehicle.mode || 'truck';
      const vBrand = initialVehicle.brand || 'Tata Motors';
      const vModel = initialVehicle.model || initialVehicle.name || 'Tata Ace Gold';

      setMasterData((prev) => {
        const copy = { ...prev };
        if (copy[vMode]) {
          const modeObj = { ...copy[vMode] };
          const brandsObj = { ...modeObj.brands };
          if (!brandsObj[vBrand]) {
            brandsObj[vBrand] = [vModel];
          } else if (!brandsObj[vBrand].includes(vModel)) {
            brandsObj[vBrand] = [vModel, ...brandsObj[vBrand]];
          }
          modeObj.brands = brandsObj;
          copy[vMode] = modeObj;
        }
        return copy;
      });

      setSelectedMode(vMode);
      setSelectedBrand(vBrand);
      setSelectedModel(vModel);
      if (initialVehicle.plate || initialVehicle.regId) setRegId(initialVehicle.plate || initialVehicle.regId);
      if (initialVehicle.fuel) setFuelType(initialVehicle.fuel);
      if (initialVehicle.hub || initialVehicle.location) {
        setHubDepot(initialVehicle.hub || initialVehicle.location);
        setHubAddress(initialVehicle.hub || initialVehicle.location);
      }
      if (initialVehicle.year) setManufacturingYear(String(initialVehicle.year));
      if (initialVehicle.units) setUnitsCount(initialVehicle.units);
      if (initialVehicle.weightUnit) {
        setWeightUnit(initialVehicle.weightUnit.toLowerCase().includes('kg') ? 'kg' : 'tonnes');
      }
      if (initialVehicle.maxPayload !== undefined) setPayloadValue(initialVehicle.maxPayload);
      if (initialVehicle.containerSpace) setContainerSpace(initialVehicle.containerSpace);
      if (initialVehicle.volumeCapacity !== undefined) setVolumeCapacity(initialVehicle.volumeCapacity);
      if (initialVehicle.isReefer !== undefined) setIsReefer(!!initialVehicle.isReefer);
      if (initialVehicle.hasGps !== undefined) setHasGps(initialVehicle.hasGps !== false);
      if (initialVehicle.isHazmat !== undefined) setIsHazmat(!!initialVehicle.isHazmat);
      if (initialVehicle.ratePerKm !== undefined) setRatePerKm(initialVehicle.ratePerKm);
      if (initialVehicle.baseCharge !== undefined) setBaseCharge(initialVehicle.baseCharge);
      if (initialVehicle.advancePercent !== undefined) setAdvancePercent(initialVehicle.advancePercent);
      if (initialVehicle.deposit !== undefined) setDeposit(initialVehicle.deposit);
      if (initialVehicle.images?.length) {
        setUploadedImages(initialVehicle.images);
      } else if (initialVehicle.image) {
        setUploadedImages([initialVehicle.image]);
      }
    }
  }, [initialVehicle]);

  // Custom Brand/Model Modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customBrandInput, setCustomBrandInput] = useState('');
  const [customModelInput, setCustomModelInput] = useState('');

  // Toast Notification
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Change Transport Mode
  const handleSelectMode = (modeKey) => {
    setSelectedMode(modeKey);
    const modeConfig = masterData[modeKey];
    if (!modeConfig) return;

    // Pick first available brand & model
    const brandKeys = Object.keys(modeConfig.brands);
    const firstBrand = brandKeys[0] || '';
    const firstModel = (modeConfig.brands[firstBrand] && modeConfig.brands[firstBrand][0]) || '';

    setSelectedBrand(firstBrand);
    setSelectedModel(firstModel);
    setFuelType(modeConfig.fuels[0] || 'Diesel');
    setHubDepot(modeConfig.defaultDepot || '');
    setWeightUnit(modeConfig.defaultUnit || 'tonnes');
    setPayloadValue(modeConfig.defaultPayload || 1000);
    setContainerSpace(modeConfig.defaultContainer || '');
    setVolumeCapacity(modeConfig.defaultVolume || 20);
    setRatePerKm(modeConfig.defaultRateKm || 40);
    setBaseCharge(modeConfig.defaultBaseFee || 1500);
    setAdvancePercent(modeConfig.defaultAdvance || 30);
    setDeposit(modeConfig.defaultDeposit || 3000);
  };

  // When selected brand changes, update model options
  const handleBrandChange = (brandName) => {
    setSelectedBrand(brandName);
    const models = masterData[selectedMode]?.brands[brandName] || [];
    setSelectedModel(models[0] || '');
  };

  // Handle Weight Unit Toggle & Auto Conversion
  const handleToggleWeightUnit = (newUnit) => {
    if (newUnit === weightUnit) return;
    const currentVal = parseFloat(payloadValue) || 0;
    if (newUnit === 'tonnes' && weightUnit === 'kg') {
      setPayloadValue(parseFloat((currentVal / 1000).toFixed(2)));
    } else if (newUnit === 'kg' && weightUnit === 'tonnes') {
      setPayloadValue(Math.round(currentVal * 1000));
    }
    setWeightUnit(newUnit);
  };

  // Live Equivalent String
  const getEquivalentText = () => {
    const val = parseFloat(payloadValue) || 0;
    if (weightUnit === 'kg') {
      const tonnes = (val / 1000).toFixed(2);
      return `Equivalent: ${tonnes} Tonnes (${val.toLocaleString()} kg)`;
    } else {
      const kg = Math.round(val * 1000);
      return `Equivalent: ${val.toLocaleString()} Tonnes (${kg.toLocaleString()} kg)`;
    }
  };

  // Save Custom Brand/Model
  const handleSaveCustomType = (e) => {
    e.preventDefault();
    const b = customBrandInput.trim();
    const m = customModelInput.trim();
    if (!b || !m) {
      showToast('Please enter both Brand / Operator and Model name', 'warning');
      return;
    }

    setMasterData((prev) => {
      const updated = { ...prev };
      const modeObj = { ...updated[selectedMode] };
      const brandsObj = { ...modeObj.brands };
      if (!brandsObj[b]) {
        brandsObj[b] = [];
      }
      if (!brandsObj[b].includes(m)) {
        brandsObj[b] = [m, ...brandsObj[b]];
      }
      modeObj.brands = brandsObj;
      updated[selectedMode] = modeObj;
      return updated;
    });

    setSelectedBrand(b);
    setSelectedModel(m);
    setCustomBrandInput('');
    setCustomModelInput('');
    setShowCustomModal(false);
    showToast(`Added custom model "${m}" under ${b}`, 'success');
  };

  // Image Upload Handlers
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

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!regId.trim()) {
      showToast('Please enter a Registration / ID Number', 'warning');
      return;
    }

    const currentModeConfig = masterData[selectedMode];
    const rawVal = parseFloat(payloadValue) || 0;
    const finalPayloadKg = weightUnit === 'tonnes' ? Math.round(rawVal * 1000) : rawVal;

    const defaultImgMap = {
      truck: '/images/carrier_mode_truck.png',
      train: '/images/carrier_mode_train.jpg',
      flight: '/images/carrier_mode_flight.png',
      ship: '/images/carrier_mode_ship.png',
      bike: '/images/carrier_mode_bike.png'
    };

    const primaryImg = uploadedImages.length > 0 ? uploadedImages[0] : (defaultImgMap[selectedMode] || '/images/carrier_freight_fleet.png');

    if (isEditMode && initialVehicle) {
      const updatedVehicle = {
        ...initialVehicle,
        mode: selectedMode,
        name: `${selectedBrand} ${selectedModel}`,
        category: `${currentModeConfig.name} (${currentModeConfig.sub})`,
        type: selectedMode,
        brand: selectedBrand,
        model: selectedModel,
        plate: regId.toUpperCase(),
        regId: regId.toUpperCase(),
        fuel: fuelType,
        hub: hubAddress || hubDepot,
        location: hubAddress || hubDepot,
        year: parseInt(manufacturingYear) || 2024,
        units: parseInt(unitsCount) || 1,
        payloadKg: finalPayloadKg,
        maxPayload: payloadValue,
        weightUnit: weightUnit === 'tonnes' ? 'Tonnes' : 'kg',
        containerSpace: containerSpace || 'Standard Cargo Container',
        volumeCapacity: volumeCapacity,
        isReefer,
        hasGps,
        isHazmat,
        ratePerKm: parseFloat(ratePerKm) || 40,
        baseCharge: parseFloat(baseCharge) || 1500,
        advancePercent: parseFloat(advancePercent) || 30,
        deposit: parseFloat(deposit) || 3000,
        pricingText: `₹${Number(baseCharge).toLocaleString()}/trip | ₹${ratePerKm}/km | Adv: ${advancePercent}%`,
        image: primaryImg,
        images: uploadedImages.length > 0 ? uploadedImages : [primaryImg]
      };

      // Save to localStorage
      try {
        const saved = localStorage.getItem('logi_pulse_vehicles');
        const list = saved ? JSON.parse(saved) : [];
        const updatedList = list.map((item) => (item.id === initialVehicle.id ? updatedVehicle : item));
        if (!updatedList.some((item) => item.id === initialVehicle.id)) {
          updatedList.unshift(updatedVehicle);
        }
        localStorage.setItem('logi_pulse_vehicles', JSON.stringify(updatedList));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }

      // Persist to Backend API if available
      try {
        await fetch(`http://localhost:3005/api/carriers/${initialVehicle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedVehicle)
        });
      } catch (e) {
        console.warn('API sync warning:', e);
      }

      showToast('Fleet vehicle updated successfully!', 'success');

      if (onSaveEditVehicle) {
        setTimeout(() => {
          onSaveEditVehicle(updatedVehicle);
        }, 400);
      }
      return;
    }

    const newVehicle = {
      id: `CRG-${Date.now().toString().slice(-5)}`,
      mode: selectedMode,
      name: `${selectedBrand} ${selectedModel}`,
      category: `${currentModeConfig.name} (${currentModeConfig.sub})`,
      type: selectedMode,
      brand: selectedBrand,
      model: selectedModel,
      plate: regId.toUpperCase(),
      regId: regId.toUpperCase(),
      fuel: fuelType,
      hub: hubAddress || hubDepot,
      location: hubAddress || hubDepot,
      year: parseInt(manufacturingYear) || 2024,
      units: parseInt(unitsCount) || 1,
      payloadKg: finalPayloadKg,
      maxPayload: payloadValue,
      weightUnit: weightUnit === 'tonnes' ? 'Tonnes' : 'kg',
      containerSpace: containerSpace || 'Standard Cargo Container',
      volumeCapacity: volumeCapacity,
      isReefer,
      hasGps,
      isHazmat,
      ratePerKm: parseFloat(ratePerKm) || 40,
      baseCharge: parseFloat(baseCharge) || 1500,
      advancePercent: parseFloat(advancePercent) || 30,
      deposit: parseFloat(deposit) || 3000,
      pricingText: `₹${Number(baseCharge).toLocaleString()}/trip | ₹${ratePerKm}/km | Adv: ${advancePercent}%`,
      isAvailable: true,
      image: primaryImg,
      images: uploadedImages.length > 0 ? uploadedImages : [primaryImg],
      rating: 4.9,
      verified: true
    };

    // Save to localStorage for demo persistence
    try {
      const saved = localStorage.getItem('logi_pulse_vehicles');
      const list = saved ? JSON.parse(saved) : [];
      localStorage.setItem('logi_pulse_vehicles', JSON.stringify([newVehicle, ...list]));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn('Could not save to localStorage:', err);
    }

    // Persist to Backend API
    try {
      await fetch('http://localhost:3005/api/carriers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle)
      });
    } catch (apiErr) {
      console.warn('Backend API offline, vehicle saved in localStorage:', apiErr);
    }

    showToast('Vehicle added to carrier fleet successfully!', 'success');

    if (onAddCarrierVehicle) {
      setTimeout(() => {
        onAddCarrierVehicle(newVehicle);
      }, 400);
    }
  };

  const modeConfig = masterData[selectedMode] || masterData.truck;
  const brandOptions = Object.keys(modeConfig.brands || {});
  const modelOptions = modeConfig.brands[selectedBrand] || [];

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', width: '100%', padding: '16px 20px', fontFamily: '"Inter", "Segoe UI", Arial, sans-serif' }}>
      {/* TOP HEADER BREADCRUMB BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        padding: '20px 28px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            <span style={{ cursor: 'pointer', color: '#2563eb' }} onClick={onCancel}>Carriers</span> / {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', letterSpacing: '-0.3px' }}>
            {isEditMode ? 'EDIT CARRIER & LOGISTICS VEHICLE' : 'ADD CARRIER & LOGISTICS VEHICLE'}
          </h1>
        </div>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '10px 18px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 700,
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13.5px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
        >
          ← Back to Fleet
        </button>
      </div>

      {/* MAIN CARD CONTAINER */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        padding: '32px 36px',
        boxShadow: '0 4px 25px rgba(0,0,0,0.03)'
      }}>
        <form onSubmit={handleSubmit}>

          {/* ========================================================================= */}
          {/* SECTION 1: TRANSPORT MODE & LOGISTICS CATEGORY */}
          {/* ========================================================================= */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingBottom: '10px',
              borderBottom: '1.5px solid #f1f5f9'
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Transport Mode & Logistics Category
              </h2>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Select Freight Medium</span>
            </div>

            {/* 5 TRANSPORT MODE SELECTOR CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '12px',
              marginBottom: '24px'
            }}>
              {Object.entries(masterData).map(([key, data]) => {
                const isActive = selectedMode === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectMode(key)}
                    style={{
                      background: isActive ? '#eff6ff' : '#ffffff',
                      border: isActive ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '16px 14px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(37,99,235,0.12)' : 'none',
                      position: 'relative'
                    }}
                  >
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900
                      }}>✓</span>
                    )}
                    <div style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                      {data.iconImg ? (
                        <img
                          src={data.iconImg}
                          alt={data.name}
                          style={{
                            maxHeight: '34px',
                            maxWidth: '52px',
                            objectFit: 'contain',
                            filter: isActive ? 'drop-shadow(0 2px 4px rgba(37,99,235,0.25))' : 'none'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '28px' }}>{data.icon}</span>
                      )}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: isActive ? '#1e40af' : '#0f172a' }}>{data.name}</div>
                    <div style={{ fontSize: '11.5px', color: isActive ? '#2563eb' : '#64748b', fontWeight: 600, marginTop: '2px' }}>{data.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* BRAND & MODEL CASCADING DROPDOWNS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              {/* Brand / Logistics Operator */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Brand / Logistics Operator <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {brandOptions.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Vehicle Model / Fleet Type with Add Button */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                    Vehicle Model / Fleet Type <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    + Add New Type
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    style={{
                      flex: 1,
                      height: '46px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0f172a',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {modelOptions.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(true)}
                    style={{
                      height: '46px',
                      padding: '0 16px',
                      borderRadius: '10px',
                      border: '1.5px dashed #3b82f6',
                      background: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    + New
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: IDENTIFICATION & FLEET SPECIFICATIONS */}
          {/* ========================================================================= */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '10px',
              borderBottom: '1.5px solid #f1f5f9'
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                2. Identification & Fleet Specifications
              </h2>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Registry & Depot</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {/* Dynamic Registration ID */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  {modeConfig.idLabel} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={regId}
                  onChange={(e) => setRegId(e.target.value.toUpperCase())}
                  placeholder={modeConfig.idPlaceholder}
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Dynamic Fuel Type */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Propulsion / Fuel Type <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  {modeConfig.fuels.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Operational Hub */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Operational Base / Hub Depot <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={hubDepot}
                  onChange={(e) => setHubDepot(e.target.value)}
                  placeholder="e.g. Mumbai Port Logistics Hub"
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Manufacturing Year */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Manufacturing Year
                </label>
                <select
                  value={manufacturingYear}
                  onChange={(e) => setManufacturingYear(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
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

              {/* Fleet Units Count Stepper */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Fleet Units Count
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '46px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  overflow: 'hidden'
                }}>
                  <button
                    type="button"
                    onClick={() => setUnitsCount(Math.max(1, unitsCount - 1))}
                    style={{
                      width: '46px',
                      height: '100%',
                      background: '#f8fafc',
                      border: 'none',
                      borderRight: '1.5px solid #cbd5e1',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    –
                  </button>
                  <span style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#0f172a'
                  }}>
                    {unitsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setUnitsCount(unitsCount + 1)}
                    style={{
                      width: '46px',
                      height: '100%',
                      background: '#f8fafc',
                      border: 'none',
                      borderLeft: '1.5px solid #cbd5e1',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: PAYLOAD CAPACITY & WEIGHT SPECIFICATIONS */}
          {/* ========================================================================= */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '10px',
              borderBottom: '1.5px solid #f1f5f9'
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                3. Payload Capacity & Weight Specifications
              </h2>

              {/* KILOGRAMS / TONNES TOGGLE PILLS */}
              <div style={{
                display: 'inline-flex',
                background: '#f1f5f9',
                borderRadius: '8px',
                padding: '3px',
                border: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => handleToggleWeightUnit('kg')}
                  style={{
                    background: weightUnit === 'kg' ? '#ffffff' : 'transparent',
                    color: weightUnit === 'kg' ? '#2563eb' : '#64748b',
                    fontWeight: 700,
                    fontSize: '12px',
                    padding: '5px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: weightUnit === 'kg' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Kilograms (kg)
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleWeightUnit('tonnes')}
                  style={{
                    background: weightUnit === 'tonnes' ? '#ffffff' : 'transparent',
                    color: weightUnit === 'tonnes' ? '#2563eb' : '#64748b',
                    fontWeight: 700,
                    fontSize: '12px',
                    padding: '5px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: weightUnit === 'tonnes' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Tonnes (Metric Tons)
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Max Payload Capacity Input */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Max Payload Capacity ({weightUnit === 'tonnes' ? 'Tonnes' : 'kg'}) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={payloadValue}
                  onChange={(e) => setPayloadValue(e.target.value)}
                  placeholder={weightUnit === 'tonnes' ? 'e.g. 15' : 'e.g. 15000'}
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ display: 'block', fontSize: '11.5px', color: '#2563eb', fontWeight: 700, marginTop: '5px' }}>
                  {getEquivalentText()}
                </span>
              </div>

              {/* Cargo Space / Container Type */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Cargo Space / Container Type
                </label>
                <input
                  type="text"
                  value={containerSpace}
                  onChange={(e) => setContainerSpace(e.target.value)}
                  placeholder="e.g. 20ft Closed Container / Flatbed"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Volumetric Capacity */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Volumetric Capacity (m³)
                </label>
                <input
                  type="number"
                  step="any"
                  value={volumeCapacity}
                  onChange={(e) => setVolumeCapacity(e.target.value)}
                  placeholder="e.g. 38.5"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* SPECIAL FEATURES & COMPLIANCE CARDS */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
                Special Features & Compliance
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '12px'
              }}>
                {/* Cold Chain */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: isReefer ? '1.5px solid #0284c7' : '1.5px solid #e2e8f0',
                  background: isReefer ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                  <input
                    type="checkbox"
                    checked={isReefer}
                    onChange={(e) => setIsReefer(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0284c7' }}
                  />
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>❄️ Cold-Chain / Refrigerated</span>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Temp controlled -20°C to +25°C</span>
                  </div>
                </label>

                {/* Real-time GPS */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: hasGps ? '1.5px solid #059669' : '1.5px solid #e2e8f0',
                  background: hasGps ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                  <input
                    type="checkbox"
                    checked={hasGps}
                    onChange={(e) => setHasGps(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#059669' }}
                  />
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>📡 Real-Time GPS / IoT Telematics</span>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Live AIS Satellite / OBD tracking</span>
                  </div>
                </label>

                {/* HAZMAT */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: isHazmat ? '1.5px solid #d97706' : '1.5px solid #e2e8f0',
                  background: isHazmat ? '#fffbeb' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                  <input
                    type="checkbox"
                    checked={isHazmat}
                    onChange={(e) => setIsHazmat(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#d97706' }}
                  />
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>⚠️ HAZMAT / Dangerous Goods</span>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>ADR / Hazardous chemical certified</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 4: COMMERCIAL TARIFFS & ADVANCE PAYMENT RATE CARD */}
          {/* ========================================================================= */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              paddingBottom: '10px',
              borderBottom: '1.5px solid #f1f5f9'
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                4. Commercial Tariffs & Advance Payment Rate Card
              </h2>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Commercial Terms</span>
            </div>
            <p style={{ margin: '0 0 18px 0', fontSize: '12.5px', color: '#64748b', fontWeight: 500 }}>
              Set your standard commercial rates. Distance calculation takes place dynamically when customers book.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '16px'
            }}>
              {/* Rate per Km */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Rate Per Kilometer (₹/km) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  value={ratePerKm}
                  onChange={(e) => setRatePerKm(e.target.value)}
                  placeholder="e.g. 48"
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#2563eb',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Base Handling Charge */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Base Handling Charge (₹) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  value={baseCharge}
                  onChange={(e) => setBaseCharge(e.target.value)}
                  placeholder="e.g. 1800"
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Advance Payment % with quick selector */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                    Advance Required (%) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[25, 30, 40].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setAdvancePercent(pct)}
                        style={{
                          background: advancePercent === pct ? '#2563eb' : '#f1f5f9',
                          color: advancePercent === pct ? '#ffffff' : '#475569',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 5px',
                          cursor: 'pointer'
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  value={advancePercent}
                  onChange={(e) => setAdvancePercent(e.target.value)}
                  placeholder="e.g. 30"
                  required
                  min="0"
                  max="100"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#059669',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Refundable Deposit */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Refundable Deposit / Security (₹)
                </label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="e.g. 3000"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LOCATION & BASE HUB (Exact Match to User Image 6) */}
          {/* ========================================================================= */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '2.5px solid #2563eb',
              paddingBottom: '6px',
              marginBottom: '4px'
            }}>
              <i className="fa-solid fa-location-dot" style={{ color: '#2563eb', fontSize: '15px' }}></i>
              <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                LOCATION & BASE HUB
              </span>
            </div>
            <div style={{ borderBottom: '1.5px solid #f1f5f9', width: '100%', marginBottom: '18px', marginTop: '-1px' }}></div>

            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Address only <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0 8px 0 16px',
                  background: '#ffffff',
                  height: '48px',
                  position: 'relative',
                  gap: '12px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className="fa-solid fa-location-dot" style={{ color: '#2563eb', fontSize: '16px', flexShrink: 0 }}></i>
                <input
                  type="text"
                  value={hubAddress}
                  onChange={(e) => {
                    setHubAddress(e.target.value);
                    setHubDepot(e.target.value);
                  }}
                  placeholder="Search city, area, or pickup address..."
                  required
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a',
                    background: 'transparent'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '7px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                >
                  <i className="fa-solid fa-location-dot" style={{ color: '#ef4444', fontSize: '14px' }}></i>
                  <span>Select on Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 5: VEHICLE MEDIA & GALLERY PHOTOS */}
          {/* ========================================================================= */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingBottom: '10px',
              borderBottom: '1.5px solid #f1f5f9'
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Vehicle Media & Gallery Photos
              </h2>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Images</span>
            </div>

            <div style={{
              border: '1.5px dashed #cbd5e1',
              borderRadius: '14px',
              padding: '24px',
              background: '#f8fafc'
            }}>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
                Upload logistics fleet photos. Click the <strong>+ Add Image</strong> box to attach photos.
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
                  <span style={{ fontSize: '22px', color: '#2563eb' }}>+</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>Add Image</span>
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
                        fontSize: '11px',
                        fontWeight: 900
                      }}
                      title="Remove"
                    >
                      ✕
                    </button>
                    <span style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: '#ffffff',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700
                    }}>
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FORM ACTIONS FOOTER */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '14px',
            paddingTop: '20px',
            borderTop: '1.5px solid #f1f5f9'
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '12px 28px',
                borderRadius: '10px',
                fontWeight: 700,
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
                fontWeight: 800,
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14.5px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
            >
              {isEditMode ? '💾 Save Changes' : '🚀 Publish & Add to Carrier Fleet'}
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD CUSTOM BRAND & MODEL TYPE */}
      {/* ========================================================================= */}
      {showCustomModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                + Add Custom Fleet Type
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
              Adding under transport mode: <strong>{modeConfig.icon} {modeConfig.name} ({modeConfig.sub})</strong>
            </p>

            <form onSubmit={handleSaveCustomType}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Brand / Logistics Operator Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tata Motors / Volvo / Custom Logistics"
                  value={customBrandInput}
                  onChange={(e) => setCustomBrandInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Vehicle Model / Fleet Type Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tata Ultra T.7 / Heavy Cargo Rake"
                  value={customModelInput}
                  onChange={(e) => setCustomModelInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  style={{
                    padding: '10px 18px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    background: '#2563eb',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(37,99,235,0.3)'
                  }}
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GLOBAL TOAST NOTIFICATION CONTAINER */}
      {/* ========================================================================= */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              background: toast.type === 'success' ? '#059669' : (toast.type === 'warning' ? '#d97706' : '#0f172a'),
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'auto',
              animation: 'fadeIn 0.2s ease-in'
            }}
          >
            <span>{toast.type === 'success' ? '✓' : (toast.type === 'warning' ? '⚠️' : 'ℹ️')}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Location Picker Map Modal */}
      <CarrierLocationModal
        isOpen={showLocationModal}
        currentValue={hubAddress}
        onClose={() => setShowLocationModal(false)}
        onSelect={(loc) => {
          setHubAddress(loc.address);
          setHubDepot(loc.address);
        }}
      />
    </div>
  );
}
