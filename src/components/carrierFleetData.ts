export interface CarrierVehicleItem {
  id: string;
  name: string;
  mode: string;
  category: string;
  type: string;
  brand: string;
  model: string;
  plate: string;
  regId: string;
  fuel: string;
  hub: string;
  location?: string;
  year?: number;
  units?: number;
  payloadKg?: number;
  maxPayload?: number | string;
  weightUnit?: string;
  containerSpace?: string;
  volumeCapacity?: number;
  isReefer?: boolean;
  hasGps?: boolean;
  isHazmat?: boolean;
  ratePerKm?: number;
  baseCharge?: number;
  advancePercent?: number;
  deposit?: number;
  pricingText?: string;
  isAvailable?: boolean;
  status?: string;
  image?: string;
  images?: string[];
  rating?: number;
  verified?: boolean;
  bookingDetails?: any;
}

export const CARRIER_CATEGORIES = [
  { id: 'All', label: 'All Fleet', icon: 'fa-table-cells' },
  { id: 'truck', label: 'Heavy Trucks (Road)', icon: 'fa-truck' },
  { id: 'flight', label: 'Air Cargo (Freighters)', icon: 'fa-plane' },
  { id: 'ship', label: 'Maritime (Container)', icon: 'fa-ship' },
  { id: 'bike', label: 'Express Delivery (Bikes)', icon: 'fa-motorcycle' }
];

export const MODE_ICON_MAP: Record<string, string> = {
  truck: '/images/carrier_mode_truck.png',
  train: '/images/carrier_mode_train.jpg',
  flight: '/images/carrier_mode_flight.png',
  ship: '/images/carrier_mode_ship.png',
  bike: '/images/carrier_mode_bike.png'
};

export const DEFAULT_OWNER_FLEET: CarrierVehicleItem[] = [
  {
    id: 'CRG-1001',
    name: 'Tata Ace Gold',
    mode: 'truck',
    category: 'Truck (Road Freight)',
    type: 'truck',
    brand: 'Tata Motors',
    model: 'Tata Ace Gold',
    plate: 'MH 14 EB 1102',
    regId: 'MH 14 EB 1102',
    fuel: 'Electric',
    hub: 'Pune Chakan Industrial Hub',
    location: 'Pune Chakan Industrial Hub',
    year: 2024,
    units: 2,
    payloadKg: 900,
    maxPayload: 0.9,
    weightUnit: 'Tonnes',
    containerSpace: '7.5ft Cargo Deck',
    volumeCapacity: 8.5,
    isReefer: false,
    hasGps: true,
    isHazmat: false,
    ratePerKm: 22,
    baseCharge: 500,
    advancePercent: 25,
    deposit: 1000,
    pricingText: '₹500/trip | ₹22/km | Adv: 25%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_truck.png',
    images: ['/images/carrier_mode_truck.png'],
    rating: 4.9,
    verified: true
  },
  {
    id: 'CRG-1002',
    name: 'TVS King Cargo 3-Wheeler',
    mode: 'bike',
    category: 'Bike (Express EV/Bike)',
    type: 'bike',
    brand: 'TVS',
    model: 'TVS King Cargo 3-Wheeler',
    plate: 'MH 14 EV 4012',
    regId: 'MH 14 EV 4012',
    fuel: 'Electric (EV)',
    hub: 'Pune Central Last-Mile Delivery Hub',
    location: 'Pune Central Last-Mile Delivery Hub',
    year: 2024,
    units: 3,
    payloadKg: 150,
    maxPayload: 150,
    weightUnit: 'kg',
    containerSpace: 'Insulated Last-Mile Top Box (65L)',
    volumeCapacity: 0.65,
    isReefer: false,
    hasGps: true,
    isHazmat: false,
    ratePerKm: 14,
    baseCharge: 120,
    advancePercent: 25,
    deposit: 1000,
    pricingText: '₹120/trip | ₹14/km | Adv: 25%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_bike.png',
    images: ['/images/carrier_mode_bike.png'],
    rating: 4.8,
    verified: true
  },
  {
    id: 'CRG-1003',
    name: 'Mahindra Blazo X 28',
    mode: 'truck',
    category: 'Truck (Road Freight)',
    type: 'truck',
    brand: 'Mahindra',
    model: 'Mahindra Blazo X 28',
    plate: 'MH 12 QX 4920',
    regId: 'MH 12 QX 4920',
    fuel: 'Diesel',
    hub: 'Mumbai Nhava Sheva Logistics Park',
    location: 'Mumbai Nhava Sheva Logistics Park',
    year: 2024,
    units: 1,
    payloadKg: 28000,
    maxPayload: 28,
    weightUnit: 'Tonnes',
    containerSpace: '24ft Heavy Open Body Container',
    volumeCapacity: 52,
    isReefer: false,
    hasGps: true,
    isHazmat: false,
    ratePerKm: 48,
    baseCharge: 1800,
    advancePercent: 30,
    deposit: 3000,
    pricingText: '₹1,800/trip | ₹48/km | Adv: 30%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_truck.png',
    images: ['/images/carrier_mode_truck.png'],
    rating: 4.9,
    verified: true
  },
  {
    id: 'CRG-1004',
    name: 'Indian Railways Flat Container Rake (BLC)',
    mode: 'train',
    category: 'Train (Rail Rake)',
    type: 'train',
    brand: 'Indian Railways Freight',
    model: 'Flat Container Rake (BLC)',
    plate: 'IR-RAKE-9921-WR',
    regId: 'IR-RAKE-9921-WR',
    fuel: 'Electric (3-Phase AC)',
    hub: 'Dadri ICD Freight Corridor, Delhi NCR',
    location: 'Dadri ICD Freight Corridor, Delhi NCR',
    year: 2023,
    units: 1,
    payloadKg: 1300000,
    maxPayload: 1300,
    weightUnit: 'Tonnes',
    containerSpace: '45 Wagon BLC Container Rake',
    volumeCapacity: 2400,
    isReefer: false,
    hasGps: true,
    isHazmat: true,
    ratePerKm: 320,
    baseCharge: 25000,
    advancePercent: 40,
    deposit: 50000,
    pricingText: '₹25,000/trip | ₹320/km | Adv: 40%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_train.jpg',
    images: ['/images/carrier_mode_train.jpg'],
    rating: 4.9,
    verified: true
  },
  {
    id: 'CRG-1005',
    name: 'Boeing 757-200F Freighter',
    mode: 'flight',
    category: 'Flight (Air Cargo)',
    type: 'flight',
    brand: 'Blue Dart Aviation',
    model: 'Boeing 757-200F Freighter',
    plate: 'VT-BDA',
    regId: 'VT-BDA',
    fuel: 'Jet A-1 Fuel',
    hub: 'Delhi IGI Air Cargo Terminal 2',
    location: 'Delhi IGI Air Cargo Terminal 2',
    year: 2022,
    units: 1,
    payloadKg: 30000,
    maxPayload: 30,
    weightUnit: 'Tonnes',
    containerSpace: 'Main Deck Cargo Pallets',
    volumeCapacity: 239,
    isReefer: true,
    hasGps: true,
    isHazmat: true,
    ratePerKm: 450,
    baseCharge: 35000,
    advancePercent: 50,
    deposit: 75000,
    pricingText: '₹35,000/trip | ₹450/km | Adv: 50%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_flight.png',
    images: ['/images/carrier_mode_flight.png'],
    rating: 5.0,
    verified: true
  },
  {
    id: 'CRG-1006',
    name: 'Panamax Container Vessel (4500 TEU)',
    mode: 'ship',
    category: 'Ship (Ocean Freight)',
    type: 'ship',
    brand: 'Maersk',
    model: 'Panamax Container Vessel (4500 TEU)',
    plate: 'IMO 9732104',
    regId: 'IMO 9732104',
    fuel: 'Low Sulfur Marine Gas Oil (MGO)',
    hub: 'Jawaharlal Nehru Port Trust (JNPT), Mumbai',
    location: 'Jawaharlal Nehru Port Trust (JNPT), Mumbai',
    year: 2021,
    units: 1,
    payloadKg: 52000000,
    maxPayload: 52000,
    weightUnit: 'Tonnes',
    containerSpace: '4500 TEU ISO Container Vessel',
    volumeCapacity: 85000,
    isReefer: true,
    hasGps: true,
    isHazmat: true,
    ratePerKm: 650,
    baseCharge: 120000,
    advancePercent: 40,
    deposit: 200000,
    pricingText: '₹120,000/trip | ₹650/km | Adv: 40%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_ship.png',
    images: ['/images/carrier_mode_ship.png'],
    rating: 4.9,
    verified: true
  }
];

export const isBookingActive = (booking: any, statusOverrides: Record<string, string> = {}): boolean => {
  if (!booking) return false;
  const bId = booking.id || booking.bookingId;
  if (bId && statusOverrides[bId] === 'Completed') return false;

  const status = String(booking.status || '').toLowerCase().trim();
  if (
    status.includes('completed') ||
    status.includes('delivered') ||
    status.includes('cancelled') ||
    status.includes('released')
  ) {
    return false;
  }
  return true;
};

export const matchVehicleToBooking = (vehicle: any, booking: any): boolean => {
  if (!vehicle || !booking) return false;
  const vId = String(vehicle.id || '').toLowerCase().trim();
  const vPlate = String(vehicle.plate || vehicle.regId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const vName = String(vehicle.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const bVehId = String(booking.vehicleId || '').toLowerCase().trim();
  const bVehReg = String(booking.vehicleReg || booking.plate || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const bVehName = String(booking.vehicleName || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Exact ID match (highest priority)
  if (bVehId && vId && bVehId === vId) return true;

  // 2. Exact Registration / Plate match (ignoring spaces & dashes)
  if (bVehReg && vPlate && bVehReg === vPlate) return true;

  // 3. Name match ONLY if neither vehicleId nor vehicleReg was provided in booking
  if (!bVehId && !bVehReg && bVehName && vName && (bVehName === vName || vName.includes(bVehName) || bVehName.includes(vName))) {
    return true;
  }

  return false;
};

export const findActiveBookingForVehicle = (
  vehicle: any,
  bookingsList: any[],
  statusOverrides: Record<string, string> = {}
): any | null => {
  if (!vehicle || !Array.isArray(bookingsList)) return null;

  return bookingsList.find((b) => {
    if (!isBookingActive(b, statusOverrides)) return false;
    return matchVehicleToBooking(vehicle, b);
  }) || null;
};

export const fetchAllActiveBookings = async (): Promise<{ bookings: any[]; statusOverrides: Record<string, string> }> => {
  let statusOverrides: Record<string, string> = {};
  try {
    statusOverrides = JSON.parse(localStorage.getItem('sart_booking_status_overrides') || '{}');
  } catch (e) { }

  const endpoints = [
    'http://localhost:5000/api/carriers/bookings',
    'http://localhost:3005/api/carriers/bookings'
  ];

  const allBookings: any[] = [];
  const seenIds = new Set<string>();

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data.bookings) ? data.bookings : (Array.isArray(data) ? data : []);
        list.forEach((b: any) => {
          const id = b.id || b.bookingId;
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            allBookings.push(b);
          }
        });
      }
    } catch (e) { }
  }

  // Also read from localStorage for instant local sync across tabs
  const localKeys = ['sart_carrier_bookings', 'sart_business_bookings'];
  for (const key of localKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((b: any) => {
            const id = b.id || b.bookingId;
            if (id && !seenIds.has(id)) {
              seenIds.add(id);
              allBookings.push(b);
            }
          });
        }
      }
    } catch (e) { }
  }

  return { bookings: allBookings, statusOverrides };
};

