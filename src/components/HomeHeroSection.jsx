import React, { useState, useEffect } from 'react';
import './HomeHeroSection.css';

export default function HomeHeroSection({ onNavigate = () => { } }) {
  // Service category selection in top card: 'rides' | 'carrier' | 'rental' | 'drivers' | 'parking'
  const [selectedCategory, setSelectedCategory] = useState('carrier');
  const [selectedVehicle, setSelectedVehicle] = useState('train');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  // "Other" Option mode: when true, changes the vehicle selector into an input
  const [isOtherInputMode, setIsOtherInputMode] = useState(false);
  const [customVehicleInput, setCustomVehicleInput] = useState('');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [backendCustomVehicles, setBackendCustomVehicles] = useState([]);
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  // Search input state
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState(() => {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
  });

  // Base list of vehicles matching exact screenshots
  const CATEGORY_VEHICLES = {
    rides: [
      { id: 'bike', name: 'Bike', icon: 'fa-motorcycle', count: '30+ bikes nearby' },
      { id: 'car', name: 'Car / Cab', icon: 'fa-car', count: '40+ cars nearby' },
      { id: 'auto', name: 'Auto', icon: 'fa-taxi', count: '25+ autos nearby' },
      { id: 'bus', name: 'Bus', icon: 'fa-bus', count: '35+ buses' },
      { id: 'train', name: 'Train', icon: 'fa-train', count: '18+ trains' },
      { id: 'helicopter', name: 'Helicopter', icon: 'fa-helicopter', count: '6+ helipads' }
    ],
    carrier: [
      { id: 'train', name: 'Train Cargo', icon: 'fa-train', count: '15+ rakes available' },
      { id: 'flight', name: 'Flight Cargo', icon: 'fa-plane', count: '10+ cargo flights' },
      { id: 'car', name: 'Car / Van Cargo', icon: 'fa-car', count: '30+ nearby' },
      { id: 'truck', name: 'Truck Cargo', icon: 'fa-truck', count: '20+ nearby' },
      { id: 'bike', name: 'Bike Parcel', icon: 'fa-motorcycle', count: '45+ nearby' },
      { id: 'ship', name: 'Ship Cargo', icon: 'fa-ship', count: '8+ vessels' }
    ],
    rental: [
      { id: 'rental_car', name: 'Self Drive Cars', icon: 'fa-car', count: '35+ Cars' },
      { id: 'rental_bike', name: 'Rent a Bike', icon: 'fa-motorcycle', count: '40+ Bikes' },
      { id: 'commercial', name: 'Commercial Fleets', icon: 'fa-van-shuttle', count: '14+ Vans' }
    ],
    drivers: [
      { id: 'hourly', name: 'Hourly Chauffeur', icon: 'fa-user-clock', count: '28+ Drivers' },
      { id: 'outstation', name: 'Outstation Driver', icon: 'fa-road', count: '20+ Drivers' },
      { id: 'commercial_driver', name: 'Heavy Vehicle Driver', icon: 'fa-id-card', count: '15+ Drivers' }
    ],
    parking: [
      { id: 'car_parking', name: 'Car Parking Slot', icon: 'fa-square-parking', count: '120+ Slots' },
      { id: 'bike_parking', name: 'Bike Parking Space', icon: 'fa-motorcycle', count: '200+ Slots' },
      { id: 'ev_charge', name: 'EV Charging Station', icon: 'fa-charging-station', count: '18+ Stations' }
    ]
  };

  // 1. Fetch custom vehicles from backend
  const fetchCustomVehicles = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/rides/custom-categories`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setBackendCustomVehicles(json.data);
          try {
            localStorage.setItem('sart_custom_categories', JSON.stringify(json.data));
          } catch (e) { }
        }
      }
    } catch (err) {
      // Fallback to local storage if backend is offline
      try {
        const cached = localStorage.getItem('sart_custom_categories');
        if (cached) setBackendCustomVehicles(JSON.parse(cached));
      } catch (e) { }
    }
  };

  useEffect(() => {
    fetchCustomVehicles();
  }, []);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    const firstVeh = CATEGORY_VEHICLES[cat][0]?.id || '';
    setSelectedVehicle(firstVeh);
    setIsOtherInputMode(false);
  };

  // Submit new custom category / vehicle to backend
  const handleSaveCustomCategory = async (e) => {
    if (e) e.preventDefault();
    if (!customVehicleInput.trim()) return;

    setIsSubmittingCustom(true);
    const payload = {
      name: customVehicleInput.trim(),
      category: customCategoryInput.trim() || selectedCategory,
      count: '1+ requested nearby',
      icon: 'fa-truck-ramp-box'
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
          setBackendCustomVehicles(prev => [json.data, ...prev.filter(x => x.id !== json.data.id)]);
        }
      }
    } catch (err) {
      console.warn('Backend offline, caching locally:', err);
      const fallbackItem = {
        id: payload.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        name: payload.name,
        category: payload.category,
        count: '1+ requested nearby',
        icon: 'fa-truck-ramp-box'
      };
      setBackendCustomVehicles(prev => [fallbackItem, ...prev]);
    }

    // Set as currently active selection
    setSelectedVehicle(payload.name);
    setIsOtherInputMode(false);
    setIsSubmittingCustom(false);
    setShowVehicleDropdown(false);
  };

  const handleExecuteSearch = () => {
    if (selectedCategory === 'rental') {
      onNavigate('rentals');
    } else if (selectedCategory === 'carrier') {
      onNavigate('carriers');
    } else if (selectedCategory === 'drivers') {
      onNavigate('drivers');
    } else if (selectedCategory === 'parking') {
      onNavigate('parking');
    } else {
      onNavigate('rentals');
    }
  };

  // All combined vehicles for current category + any backend custom vehicles
  const currentCategoryCustomVehicles = backendCustomVehicles.filter(
    v => (v.category || '').toLowerCase() === selectedCategory.toLowerCase()
  );

  // Suggestions for live typing in the Other input
  const otherMatches = customVehicleInput.trim()
    ? backendCustomVehicles.filter(v =>
      v.name.toLowerCase().includes(customVehicleInput.trim().toLowerCase())
    )
    : [];

  // Active vehicle display name
  const activeVehicleObj = CATEGORY_VEHICLES[selectedCategory]?.find(v => v.id === selectedVehicle) ||
    backendCustomVehicles.find(v => v.id === selectedVehicle || v.name === selectedVehicle);
  const activeVehicleDisplayName = activeVehicleObj ? activeVehicleObj.name : selectedVehicle || 'Select';
  const activeVehicleIcon = activeVehicleObj ? activeVehicleObj.icon : 'fa-car';

  return (
    <div className="sart-home-hero-wrapper">


      {/* 2. BOOK A SERVICE ROW WITH 6 3D VISUAL CARDS */}
      <section className="book-service-section" style={{ marginTop: '30px', marginBottom: '25px' }}>
        <div className="book-service-header">
          <h2>Book a Service</h2>
          <p>Select tailored multi-modal transport and logistics crafted for instant urban mobility.</p>
        </div>

        <div className="book-service-inner-card">
          <div className="book-service-grid">
            {/* 1. Rides */}
            <div className="book-card" onClick={() => onNavigate('rentals')}>
              <div className="book-img-wrapper">
                <img
                  src="/images/Ride.jpg"
                  alt="Rides Fleet"
                  className="book-card-img"
                  onError={(e) => { e.currentTarget.src = '/images/rides_fleet_showcase.png'; }}
                />
              </div>
              <h3 className="book-title" style={{ textAlign: 'center' }}>Rides</h3>
              <div className="book-footer"></div>
            </div>

            {/* 2. Carrier */}
            <div className="book-card" onClick={() => onNavigate('carriers')}>
              <div className="book-img-wrapper">
                <img
                  src="/images/parcel_service.png"
                  alt="Carrier Logistics"
                  className="book-card-img"
                  onError={(e) => { e.currentTarget.src = '/images/carrier_freight_fleet.png'; }}
                />
              </div>
              <h3 className="book-title" style={{ textAlign: 'center' }}>Carrier</h3>
              <div className="book-footer"></div>
            </div>

            {/* 3. Vehicle Rental */}
            <div className="book-card" onClick={() => onNavigate('rentals')}>
              <div className="book-img-wrapper">
                <img
                  src="/images/Cargo.jpg"
                  alt="Vehicle Rental"
                  className="book-card-img"
                  onError={(e) => { e.currentTarget.src = '/images/rental_service.png'; }}
                />
              </div>
              <h3 className="book-title" style={{ textAlign: 'center' }}>Vehicle Rental</h3>
              <div className="book-footer"></div>
            </div>

            {/* 4. Drivers Hire */}
            <div className="book-card" onClick={() => onNavigate('drivers')}>
              <div className="book-img-wrapper">
                <img
                  src="/images/Driver.jpg"
                  alt="Drivers Hire"
                  className="book-card-img"
                  onError={(e) => { e.currentTarget.src = '/images/drivers_service.png'; }}
                />
              </div>
              <h3 className="book-title" style={{ textAlign: 'center' }}>Drivers Hire</h3>
              <div className="book-footer"></div>
            </div>

            {/* 5. Parking Slots */}
            <div className="book-card" onClick={() => onNavigate('parking')}>
              <div className="book-img-wrapper">
                <img
                  src="/images/Parking.jpg"
                  alt="Parking Slots"
                  className="book-card-img"
                  onError={(e) => { e.currentTarget.src = '/images/parking_slots_showcase.png'; }}
                />
              </div>
              <h3 className="book-title" style={{ textAlign: 'center' }}>Parking Slots</h3>
              <div className="book-footer"></div>
            </div>

            {/* 6. Communities */}
            <div className="book-card" onClick={() => onNavigate('rentals')}>
              <div className="book-img-wrapper">
                <img
                  src="/images/community.jpg"
                  alt="Communities"
                  className="book-card-img"
                  onError={(e) => { e.currentTarget.src = '/images/community_service.jpg'; }}
                />
              </div>
              <h3 className="book-title" style={{ textAlign: 'center' }}>Communities</h3>
              <div className="book-footer"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
