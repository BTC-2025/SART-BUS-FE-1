import React, { useState } from 'react';
import './MotorsMarketplace.css';

const DEFAULT_PARTS = [
  {
    id: 'PRT-1001',
    name: 'Brembo High-Performance Ceramic Brake Pads (Front)',
    category: 'Brake System',
    vehicleCategory: 'Car / SUV',
    brand: 'Brembo',
    partNumber: 'P 06 088N',
    compatible: 'BMW 5 Series, Toyota Camry, Mercedes E-Class',
    condition: 'New',
    price: '₹4,850',
    mrp: '₹5,999',
    stock: 24,
    warranty: '1 Year Warranty',
    seller: 'SART Genuine Spares Hub',
    photosCount: 4,
    isSpecial: true,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1600703136783-bdd5ee76f737?auto=format&fit=crop&w=800&q=80',
    status: 'In Stock'
  },
  {
    id: 'PRT-1002',
    name: 'Exide InvaMaster Heavy Duty Commercial Battery 150Ah',
    category: 'Battery & Electrical',
    vehicleCategory: 'Heavy Truck / LCV',
    brand: 'Exide',
    partNumber: 'EX-150-HD',
    compatible: 'Ashok Leyland Dost, Tata ACE, BharatBenz 1617',
    condition: 'New',
    price: '₹12,400',
    mrp: '₹14,500',
    stock: 15,
    warranty: '36 Months Warranty',
    seller: 'PowerDrive Energy Hub',
    photosCount: 5,
    isSpecial: true,
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1558441719-75ff574889c1?auto=format&fit=crop&w=800&q=80',
    status: 'In Stock'
  },
  {
    id: 'PRT-1003',
    name: 'Bosch Common Rail Diesel Injector Assembly',
    category: 'Engine Parts',
    vehicleCategory: 'Commercial Vehicle',
    brand: 'Bosch',
    partNumber: '0445110368',
    compatible: 'Mahindra Bolero, Tata 407, Force Traveller',
    condition: 'New OEM',
    price: '₹8,200',
    mrp: '₹9,800',
    stock: 18,
    warranty: '6 Months OEM Warranty',
    seller: 'Direct Bosch Authorized',
    photosCount: 3,
    isSpecial: false,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
    status: 'In Stock'
  },
  {
    id: 'PRT-1004',
    name: 'MRF Steel Muscle Commercial All-Weather Radial Tyre',
    category: 'Tyres & Wheels',
    vehicleCategory: 'Heavy Truck / Trailer',
    brand: 'MRF',
    partNumber: 'MRF-295-80R22.5',
    compatible: 'Multi-Axle Cargo Trucks, 16 Ton Trailers',
    condition: 'New',
    price: '₹19,500',
    mrp: '₹22,000',
    stock: 30,
    warranty: '3 Years Warranty',
    seller: 'MRF Commercial Fleet Partner',
    photosCount: 4,
    isSpecial: true,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    status: 'In Stock'
  }
];

export default function SpareParts({ partnerDetails }) {
  const [activeTab, setActiveTab] = useState('browse_parts'); // 'browse_parts' | 'upload_part' | 'orders'
  const [viewMode, setViewMode] = useState('row');
  const [partsList, setPartsList] = useState(DEFAULT_PARTS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedVehicleType, setSelectedVehicleType] = useState('ALL');
  const [compareItems, setCompareItems] = useState([]);

  // Upload Product State
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Brake System',
    vehicleCategory: 'Car / Sedan / SUV',
    brand: 'Bosch',
    partNumber: '',
    compatible: '',
    condition: 'New',
    price: '',
    mrp: '',
    stock: '10',
    warranty: '1 Year Warranty',
    imageUrl: '',
    imagePreview: ''
  });

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadForm((prev) => ({
          ...prev,
          imagePreview: reader.result,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.name || !uploadForm.partNumber) {
      alert('Please fill in product name and part number.');
      return;
    }

    const newProduct = {
      id: `PRT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: uploadForm.name,
      category: uploadForm.category,
      vehicleCategory: uploadForm.vehicleCategory,
      brand: uploadForm.brand,
      partNumber: uploadForm.partNumber,
      compatible: uploadForm.compatible || 'Universal Fitment',
      condition: uploadForm.condition,
      price: `₹${uploadForm.price || '1,500'}`,
      mrp: `₹${uploadForm.mrp || '1,800'}`,
      stock: Number(uploadForm.stock || 10),
      warranty: uploadForm.warranty,
      seller: partnerDetails?.name || 'SART Certified Merchant',
      photosCount: 4,
      isSpecial: true,
      isFavorite: false,
      image: uploadForm.imagePreview || uploadForm.imageUrl || 'https://images.unsplash.com/photo-1600703136783-bdd5ee76f737?auto=format&fit=crop&w=800&q=80',
      status: 'In Stock'
    };

    setPartsList([newProduct, ...partsList]);
    setActiveTab('browse_parts');
    alert(`Spare part "${newProduct.name}" successfully uploaded to SART Store!`);
  };

  const filteredParts = partsList.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.compatible.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCategory !== 'ALL' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  const categories = [
    { name: 'Engine Parts', icon: 'fa-gears' },
    { name: 'Brake System', icon: 'fa-compact-disc' },
    { name: 'Battery & Electrical', icon: 'fa-car-battery' },
    { name: 'Tyres & Wheels', icon: 'fa-circle-dot' },
    { name: 'Suspension', icon: 'fa-wrench' },
    { name: 'Accessories', icon: 'fa-wand-magic-sparkles' }
  ];

  return (
    <div className="motors-marketplace-container">
      {/* Breadcrumb Bar */}
      <div className="motors-breadcrumb-bar">
        <span>Home</span>
        <i className="fa-solid fa-chevron-right"></i>
        <span>SART Store & Catalog</span>
        <i className="fa-solid fa-chevron-right"></i>
        <span className="active">Spare Parts & Vehicle Accessories</span>
      </div>

      {/* Main Title Row */}
      <div className="motors-main-title-row">
        <div>
          <h1 className="motors-title">
            Genuine spare parts & products
            <span className="motors-results-count">({filteredParts.length} verified items)</span>
          </h1>
        </div>

        <div className="motors-toolbar-right">
          {/* Compare Pill */}
          <div className="motors-compare-pill" onClick={() => alert(`Comparing: ${compareItems.join(', ') || 'No spare parts selected.'}`)}>
            <i className="fa-solid fa-code-compare" style={{ color: '#2563eb' }}></i>
            <span>Compare</span>
            <span className="motors-badge-count">{compareItems.length}</span>
          </div>

          {/* View Toggles */}
          <div className="motors-view-toggle">
            <button
              className={`motors-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <i className="fa-solid fa-grip"></i>
            </button>
            <button
              className={`motors-view-btn ${viewMode === 'row' ? 'active' : ''}`}
              onClick={() => setViewMode('row')}
              title="Row View"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'upload_part' ? 'browse_parts' : 'upload_part')}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 18px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37,99,235,0.25)'
            }}
          >
            <i className={`fa-solid ${activeTab === 'upload_part' ? 'fa-list' : 'fa-plus'}`}></i>
            {activeTab === 'upload_part' ? 'View Catalog' : '+ Upload Spare Part'}
          </button>
        </div>
      </div>

      {/* Subtabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        {[
          { id: 'browse_parts', label: 'Browse Spare Parts Store', icon: 'fa-boxes-stacked' },
          { id: 'upload_part', label: 'Upload Spare Part (Admin Form)', icon: 'fa-cloud-arrow-up' },
          { id: 'inventory_orders', label: 'Inventory & Dispatch Orders', icon: 'fa-clipboard-check' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.id ? '#1e293b' : '#f1f5f9',
              color: activeTab === tab.id ? '#ffffff' : '#475569',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          VIEW 1: BROWSE PARTS (SPLIT VIEW)
          ========================================================================= */}
      {activeTab === 'browse_parts' && (
        <div className="motors-layout-split">
          {/* LEFT FILTER SIDEBAR */}
          <aside className="motors-filter-sidebar">
            <div className="motors-filter-header">
              <h2>Filter Products</h2>
              {(selectedCategory !== 'ALL' || searchQuery) && (
                <button
                  className="motors-reset-btn"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="motors-search-input-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search part name, OEM number, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">Part Category</div>
              <div className="motors-body-type-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {categories.map((c) => {
                  const isSel = selectedCategory.toLowerCase() === c.name.toLowerCase();
                  return (
                    <div
                      key={c.name}
                      className={`motors-body-type-tile ${isSel ? 'selected' : ''}`}
                      onClick={() => setSelectedCategory(isSel ? 'ALL' : c.name)}
                    >
                      <i className={`fa-solid ${c.icon}`}></i>
                      <span>{c.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* In-Stock & Assurance Checkboxes */}
            <div className="motors-filter-group">
              <div className="motors-filter-group-title">Trust & Warranty</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>100% Genuine OEM Certified</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Doorstep Fast Shipping</span>
                </label>
                <label className="motors-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>7-Day Replacement Guarantee</span>
                </label>
              </div>
            </div>
          </aside>

          {/* RIGHT LISTINGS AREA */}
          <main className="motors-listings-container">
            {/* ROW LAYOUT */}
            {viewMode === 'row' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredParts.map((p) => (
                  <article key={p.id} className="motors-card-row">
                    <div className="motors-card-media">
                      <img src={p.image} alt={p.name} className="motors-card-img" />
                      {p.isSpecial && (
                        <div className="motors-badge-special">
                          <i className="fa-solid fa-star"></i>
                          TOP RATED
                        </div>
                      )}
                      <div className="motors-badge-photo-count">
                        <i className="fa-regular fa-image"></i>
                        1/{p.photosCount || 4}
                      </div>
                    </div>

                    <div className="motors-card-content">
                      <div>
                        <div className="motors-card-header-line">
                          <div className="motors-brand-logo-title">
                            <i className="fa-solid fa-cube" style={{ color: '#2563eb', fontSize: '18px' }}></i>
                            <h3 className="motors-card-title">{p.name}</h3>
                          </div>
                          <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                            {p.partNumber}
                          </span>
                        </div>

                        <div className="motors-price-box">
                          {p.mrp && <span className="motors-price-original">{p.mrp}</span>}
                          <span className="motors-price-current">{p.price}</span>
                          <span style={{ fontSize: '12.5px', color: '#10b981', fontWeight: '700' }}>In Stock ({p.stock} units)</span>

                          <div className="motors-trust-badges">
                            <span className="motors-trust-chip">
                              <i className="fa-solid fa-shield" style={{ color: '#10b981', marginRight: '4px' }}></i>
                              {p.warranty}
                            </span>
                            <span className="motors-trust-chip" style={{ background: '#ecfdf5', color: '#047857' }}>
                              {p.brand}
                            </span>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="motors-specs-row">
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-car-side"></i>
                            <span>{p.vehicleCategory}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-link"></i>
                            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.compatible}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-shop"></i>
                            <span>{p.seller}</span>
                          </div>
                          <div className="motors-spec-item">
                            <i className="fa-solid fa-check-circle"></i>
                            <span>{p.condition}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="motors-actions-row">
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Added ${p.name} (${p.partNumber}) to cart! Price: ${p.price}.`)}
                        >
                          <i className="fa-solid fa-cart-shopping"></i>
                          Add to Cart
                        </button>
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Direct checkout initiated for ${p.name}. Standard 2-day delivery.`)}
                        >
                          <i className="fa-solid fa-bolt"></i>
                          Buy Now
                        </button>
                        <button
                          className="motors-action-btn-soft"
                          onClick={() => alert(`Compatibility verification: Compatible with ${p.compatible}. Part: ${p.partNumber}.`)}
                        >
                          <i className="fa-solid fa-circle-info"></i>
                          Check Fitment
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* GRID LAYOUT */}
            {viewMode === 'grid' && (
              <div className="motors-grid-container">
                {filteredParts.map((p) => (
                  <article key={p.id} className="motors-compact-card">
                    <div className="motors-compact-media">
                      <img src={p.image} alt={p.name} className="motors-card-img" />
                      <div className="motors-badge-photo-count">
                        <i className="fa-regular fa-image"></i>
                        1/{p.photosCount || 4}
                      </div>
                    </div>
                    <div className="motors-compact-body">
                      <div>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '15.5px', fontWeight: '800', color: '#0f172a' }}>
                          {p.name}
                        </h4>
                        <div style={{ margin: '4px 0' }}>
                          <strong style={{ fontSize: '18px', color: '#0f172a', fontWeight: '900' }}>
                            {p.price}
                          </strong>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.7', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                          {p.brand} • {p.partNumber} • {p.warranty}
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Added ${p.name} to cart.`)}
                        style={{
                          marginTop: '16px',
                          padding: '8px 12px',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          color: '#1d4ed8',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: UPLOAD SPARE PART FORM
          ========================================================================= */}
      {activeTab === 'upload_part' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>
              Upload Spare Part or Accessory to Catalog
            </h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
              Specify OEM part number, compatible models, pricing, inventory count, and multiple product photos.
            </p>
          </div>

          <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ceramic Front Brake Pads"
                  className="b2auth-input"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Brand / Manufacturer *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bosch, Brembo, Exide, MRF"
                  className="b2auth-input"
                  value={uploadForm.brand}
                  onChange={(e) => setUploadForm({ ...uploadForm, brand: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Part / OEM Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. P 06 088N"
                  className="b2auth-input"
                  value={uploadForm.partNumber}
                  onChange={(e) => setUploadForm({ ...uploadForm, partNumber: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Part Category
                </label>
                <select
                  className="b2auth-input"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                >
                  <option value="Brake System">Brake System</option>
                  <option value="Engine Parts">Engine Parts</option>
                  <option value="Battery & Electrical">Battery & Electrical</option>
                  <option value="Tyres & Wheels">Tyres & Wheels</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 4850"
                  className="b2auth-input"
                  value={uploadForm.price}
                  onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  MRP (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5999"
                  className="b2auth-input"
                  value={uploadForm.mrp}
                  onChange={(e) => setUploadForm({ ...uploadForm, mrp: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Stock Quantity
                </label>
                <input
                  type="number"
                  className="b2auth-input"
                  value={uploadForm.stock}
                  onChange={(e) => setUploadForm({ ...uploadForm, stock: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Compatible Models
                </label>
                <input
                  type="text"
                  placeholder="e.g. BMW 5 Series, Toyota Camry"
                  className="b2auth-input"
                  value={uploadForm.compatible}
                  onChange={(e) => setUploadForm({ ...uploadForm, compatible: e.target.value })}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                Product Image *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{
                      padding: '10px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1.5px dashed #cbd5e1',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="url"
                    placeholder="https://example.com/part.jpg"
                    className="b2auth-input"
                    value={uploadForm.imageUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value, imagePreview: e.target.value })}
                  />
                </div>

                <div style={{
                  width: '180px',
                  height: '120px',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {uploadForm.imagePreview || uploadForm.imageUrl ? (
                    <img
                      src={uploadForm.imagePreview || uploadForm.imageUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Preview</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(37,99,235,0.3)'
              }}
            >
              Publish Product to SART Store
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: INVENTORY ORDERS
          ========================================================================= */}
      {activeTab === 'inventory_orders' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>
            Live Dispatch Orders & Store Sales
          </h3>
          <p style={{ color: '#64748b', fontSize: '13.5px' }}>
            Track ordered spare parts, packaging status, warehouse picking, and courier airway bills.
          </p>
        </div>
      )}
    </div>
  );
}
