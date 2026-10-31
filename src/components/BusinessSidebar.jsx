import React, { useState } from 'react';
import './BusinessSidebar.css';

export default function BusinessSidebar({
  currentTab = 'home',
  onNavigate = () => { }
}) {
  const [openPayments, setOpenPayments] = useState(false);

  return (
    <aside className="cliks-business-sidebar">
      <div className="sidebar-nav-scroll">
        {/* 1. Dashboard Active Pill */}
        <button
          type="button"
          className={`sidebar-nav-item dashboard-btn ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          <div className="nav-item-left">
            <i className="fa-solid fa-table-cells-large"></i>
            <span>Dashboard</span>
          </div>
        </button>

        {/* 2. Primary Service Verticals (Rentals, Carriers, Drivers, Parking) */}
        <button
          type="button"
          className={`sidebar-clean-item ${currentTab === 'rentals' ? 'active' : ''}`}
          onClick={() => onNavigate('rentals')}
        >
          <div className="nav-item-left">
            <i className="fa-solid fa-car-side"></i>
            <span>Rental Vehicles</span>
          </div>
        </button>

        <button
          type="button"
          className={`sidebar-clean-item ${currentTab === 'carriers' ? 'active' : ''}`}
          onClick={() => onNavigate('carriers')}
        >
          <div className="nav-item-left">
            <i className="fa-solid fa-truck-moving"></i>
            <span>Carriers Logistics</span>
          </div>
        </button>

        <button
          type="button"
          className={`sidebar-clean-item ${currentTab === 'drivers' ? 'active' : ''}`}
          onClick={() => onNavigate('drivers')}
        >
          <div className="nav-item-left">
            <i className="fa-solid fa-user-tie"></i>
            <span>Hire Drivers</span>
          </div>
        </button>

        <button
          type="button"
          className={`sidebar-clean-item ${currentTab === 'parking' ? 'active' : ''}`}
          onClick={() => onNavigate('parking')}
        >
          <div className="nav-item-left">
            <i className="fa-solid fa-square-parking"></i>
            <span>Parking Slots</span>
          </div>
        </button>

        {/* Divider */}
        <div className="sidebar-divider"></div>

        {/* 3. Payments Accordion */}
        <div className="sidebar-group">
          <button
            type="button"
            className="sidebar-clean-item"
            onClick={() => setOpenPayments(!openPayments)}
          >
            <div className="nav-item-left">
              <i className="fa-regular fa-credit-card"></i>
              <span>Payments</span>
            </div>
            <i className={`fa-solid fa-chevron-down arrow-indicator-sm ${openPayments ? 'open' : ''}`}></i>
          </button>

          {openPayments && (
            <div className="sidebar-submenu-simple">
              <button
                type="button"
                className="submenu-simple-btn"
                onClick={() => onNavigate('home')}
              >
                <i className="fa-solid fa-money-bill-transfer"></i>
                <span>Payouts</span>
              </button>
              <button
                type="button"
                className="submenu-simple-btn"
                onClick={() => onNavigate('home')}
              >
                <i className="fa-solid fa-file-invoice-dollar"></i>
                <span>Tax Statements</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Other Standard Menu Items */}
        <button
          type="button"
          className="sidebar-clean-item"
          onClick={() => onNavigate('home')}
        >
          <div className="nav-item-left">
            <i className="fa-solid fa-arrow-right-arrow-left"></i>
            <span>Transactions</span>
          </div>
        </button>

        {/* <button
          type="button"
          className="sidebar-clean-item"
          onClick={() => onNavigate('home')}
        >
          <div className="nav-item-left">
            <i className="fa-solid fa-receipt"></i>
            <span>Invoices</span>
          </div>
        </button> */}

        <button
          type="button"
          className="sidebar-clean-item"
          onClick={() => onNavigate('home')}
        >
          <div className="nav-item-left">
            <i className="fa-solid fa-wallet"></i>
            <span>Cards</span>
          </div>
        </button>

        <button
          type="button"
          className="sidebar-clean-item"
          onClick={() => onNavigate('home')}
        >
          <div className="nav-item-left">
            <i className="fa-solid fa-coins"></i>
            <span>Saving Plans</span>
          </div>
        </button>

        <button
          type="button"
          className="sidebar-clean-item"
          onClick={() => onNavigate('home')}
        >
          <div className="nav-item-left">
            <i className="fa-brands fa-ethereum"></i>
            <span>Investments</span>
          </div>
        </button>

        <button
          type="button"
          className="sidebar-clean-item"
          onClick={() => onNavigate('home')}
        >
          <div className="nav-item-left">
            <i className="fa-regular fa-envelope"></i>
            <span>Inbox</span>
          </div>
          <span className="inbox-red-badge">99</span>
        </button>

        {/* <button
          type="button"
          className="sidebar-clean-item"
          onClick={() => onNavigate('home')}
        >
          <div className="nav-item-left">
            <i className="fa-solid fa-percent"></i>
            <span>Promos</span>
          </div>
        </button> */}

        {/* <button
          type="button"
          className="sidebar-clean-item"
          onClick={() => onNavigate('home')}
        >
          <div className="nav-item-left">
            <i className="fa-regular fa-newspaper"></i>
            <span>Insights</span>
          </div>
        </button> */}
      </div>
    </aside>
  );
}
export { BusinessSidebar };
