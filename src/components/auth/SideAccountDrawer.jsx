import React, { useState } from 'react';
import './Auth.css';

export default function SideAccountDrawer({
  partnerDetails,
  isOpen = true,
  onNavigate = () => { },
  onLogout = () => { },
  onSwitchAccount = () => { }
}) {
  const [activeModal, setActiveModal] = useState(null); // 'profile' | 'calendar' | 'insights' | 'tasks' | 'notes' | 'settings' | 'add'

  // User values
  const name = partnerDetails?.name || 'venkatavasanthakumarp1997';
  const email = partnerDetails?.email || 'venkatavasanthakumarp1997@bnxmail.com';
  const initial = name.charAt(0).toUpperCase() || 'V';

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Vertical Tool Strip on the Right side starting below the blue sub-navbar (top: 112px) */}
      <aside className="side-tool-strip">
        {/* Calendar (Yellow Rounded Square) - Exactly matches User's Screenshot */}
        <button
          type="button"
          className={`tool-strip-pill-btn calendar ${activeModal === 'calendar' ? 'active-tool' : ''}`}
          title="Booking Calendar & Schedule Slots"
          onClick={() => setActiveModal(activeModal === 'calendar' ? null : 'calendar')}
        >
          <i className="fa-regular fa-calendar-days"></i>
        </button>

        {/* Lightbulb (Idea / Tips) */}
        <button
          type="button"
          className={`tool-strip-pill-btn idea ${activeModal === 'insights' ? 'active-tool' : ''}`}
          title="Smart Fleet Insights & Recommendations"
          onClick={() => setActiveModal(activeModal === 'insights' ? null : 'insights')}
        >
          <i className="fa-regular fa-lightbulb"></i>
        </button>

        {/* Checkmark Circle (Tasks & Verification) */}
        <button
          type="button"
          className={`tool-strip-pill-btn tasks ${activeModal === 'tasks' ? 'active-tool' : ''}`}
          title="Pending Bookings & Partner Approvals"
          onClick={() => setActiveModal(activeModal === 'tasks' ? null : 'tasks')}
        >
          <i className="fa-regular fa-circle-check"></i>
        </button>

        {/* User / Contact Icon - Opens Fin-Pro Account Profile */}
        <button
          type="button"
          className={`tool-strip-pill-btn user-btn ${activeModal === 'profile' ? 'active-tool' : ''}`}
          title="Account Profile & Details"
          onClick={() => setActiveModal(activeModal === 'profile' ? null : 'profile')}
        >
          <i className="fa-regular fa-user"></i>
        </button>

        {/* Small Horizontal Divider */}
        <div className="tool-strip-divider"></div>

        {/* More / Three Dots */}
        <button
          type="button"
          className={`tool-strip-pill-btn more-dots ${activeModal === 'more' ? 'active-tool' : ''}`}
          title="More Fleet Utilities"
          onClick={() => setActiveModal(activeModal === 'more' ? null : 'more')}
        >
          <i className="fa-solid fa-ellipsis"></i>
        </button>

        {/* Plus / Add Tool */}
        <button
          type="button"
          className={`tool-strip-pill-btn add-more ${activeModal === 'add' ? 'active-tool' : ''}`}
          title="Add New Vehicle / Resource"
          onClick={() => setActiveModal(activeModal === 'add' ? null : 'add')}
        >
          <i className="fa-solid fa-plus"></i>
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Bottom Tool: Edit Icon */}
        <button
          type="button"
          className={`tool-strip-pill-btn bottom-tool ${activeModal === 'notes' ? 'active-tool' : ''}`}
          title="Quick Dispatch Notes"
          onClick={() => setActiveModal(activeModal === 'notes' ? null : 'notes')}
        >
          <i className="fa-regular fa-pen-to-square"></i>
        </button>

        {/* Bottom Tool: Settings / Sliders Icon */}
        <button
          type="button"
          className={`tool-strip-pill-btn bottom-tool ${activeModal === 'settings' ? 'active-tool' : ''}`}
          title="Fleet Settings & Theme Preferences"
          onClick={() => setActiveModal(activeModal === 'settings' ? null : 'settings')}
        >
          <i className="fa-solid fa-sliders"></i>
        </button>
      </aside>

      {/* 2. Popout Overlay Modals for each bit-tool icon */}

      {/* MODAL 1: Account Profile Card */}
      {activeModal === 'profile' && (
        <div className="google-account-modal-overlay">
          <div className="finpro-account-card">
            <button className="side-modal-close" onClick={() => setActiveModal(null)} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="finpro-avatar-wrap">
              <div className="finpro-avatar-circle">
                <span>{initial}</span>
              </div>
              <div className="finpro-camera-badge" title="Upload Photo">
                <i className="fa-solid fa-camera"></i>
              </div>
            </div>

            <div className="finpro-account-name">{name}</div>
            <div className="finpro-account-email">{email}</div>

            <div className="finpro-primary-badge">
              <i className="fa-regular fa-circle-check"></i>
              <span>Make it Primary</span>
            </div>

            <button
              type="button"
              className="finpro-btn-manage"
              onClick={() => {
                setActiveModal(null);
                onNavigate('home');
              }}
            >
              <i className="fa-regular fa-user"></i>
              <span>Manage your account</span>
            </button>

            <div className="finpro-menu-list">
              <button
                type="button"
                className="finpro-menu-item"
                onClick={() => {
                  setActiveModal(null);
                  onNavigate('rentals');
                }}
              >
                <i className="fa-solid fa-building"></i>
                <span>Manage Branches & Fleet</span>
              </button>

              <button
                type="button"
                className="finpro-menu-item"
                onClick={() => {
                  setActiveModal(null);
                  onNavigate('drivers');
                }}
              >
                <i className="fa-solid fa-users"></i>
                <span>Manage SubIDs & Drivers</span>
              </button>

              <button
                type="button"
                className="finpro-menu-item"
                onClick={() => {
                  setActiveModal(null);
                  onSwitchAccount && onSwitchAccount();
                }}
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Add another account</span>
              </button>
            </div>

            <div className="finpro-signout-wrap">
              <button
                type="button"
                className="finpro-btn-signout"
                onClick={() => {
                  setActiveModal(null);
                  onLogout && onLogout();
                }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Calendar & Scheduling Tool */}
      {activeModal === 'calendar' && (
        <div className="google-account-modal-overlay">
          <div className="bittool-popup-card">
            <div className="bittool-header">
              <div className="bittool-title-row">
                <div className="bittool-badge-icon calendar">
                  <i className="fa-regular fa-calendar-days"></i>
                </div>
                <div>
                  <h4 className="bittool-title">Fleet Schedule & Bookings</h4>
                  <p className="bittool-desc">View vehicle departure & pickup schedules</p>
                </div>
              </div>
              <button className="side-modal-close" onClick={() => setActiveModal(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="bittool-content-box">
              <div className="bittool-calendar-header">
                <strong>October 2026</strong>
                <span className="live-status-pill">Today</span>
              </div>
              <div className="bittool-schedule-list">
                <div className="schedule-item">
                  <div className="schedule-time">09:30 AM</div>
                  <div className="schedule-info">
                    <strong>Tata Nexon EV (TN-09-BK-4001)</strong>
                    <span>Customer: Rahul Sharma • 2 Days Rental</span>
                  </div>
                  <span className="badge-tag green">Confirmed</span>
                </div>
                <div className="schedule-item">
                  <div className="schedule-time">02:15 PM</div>
                  <div className="schedule-info">
                    <strong>Royal Enfield Hunter (TN-01-XY-8821)</strong>
                    <span>Customer: Vikram Seth • 8 Hours Rental</span>
                  </div>
                  <span className="badge-tag yellow">Pending Dispatch</span>
                </div>
                <div className="schedule-item">
                  <div className="schedule-time">06:00 PM</div>
                  <div className="schedule-info">
                    <strong>Heavy Hauler Cargo (TN-04-TR-9900)</strong>
                    <span>Logistics Route: Chennai ➔ Bangalore</span>
                  </div>
                  <span className="badge-tag blue">Scheduled</span>
                </div>
              </div>

              <button
                type="button"
                className="bittool-action-btn"
                onClick={() => {
                  setActiveModal(null);
                  onNavigate('home');
                }}
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Open Full Calendar Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Insights & Tips Tool */}
      {activeModal === 'insights' && (
        <div className="google-account-modal-overlay">
          <div className="bittool-popup-card">
            <div className="bittool-header">
              <div className="bittool-title-row">
                <div className="bittool-badge-icon idea">
                  <i className="fa-regular fa-lightbulb"></i>
                </div>
                <div>
                  <h4 className="bittool-title">Smart Business Insights</h4>
                  <p className="bittool-desc">AI revenue & fleet optimization tips</p>
                </div>
              </div>
              <button className="side-modal-close" onClick={() => setActiveModal(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="bittool-content-box">
              <div className="insight-card-item">
                <i className="fa-solid fa-arrow-trend-up text-green"></i>
                <div>
                  <strong>High Weekend Demand for SUVs</strong>
                  <p>Increase Mahindra Thar & Scorpio rental tariffs by 15% on Friday–Sunday.</p>
                </div>
              </div>
              <div className="insight-card-item">
                <i className="fa-solid fa-gas-pump text-amber"></i>
                <div>
                  <strong>EV Fleet Savings: ₹14,200 this week</strong>
                  <p>EV utilization reached 84%. Consider adding 2 more Tata Punch EVs.</p>
                </div>
              </div>
              <div className="insight-card-item">
                <i className="fa-solid fa-bell text-blue"></i>
                <div>
                  <strong>Maintenance Alert</strong>
                  <p>Swift VXI (TN-07-CS-1299) is due for 10,000 km oil service in 3 days.</p>
                </div>
              </div>

              <button
                type="button"
                className="bittool-action-btn"
                onClick={() => {
                  setActiveModal(null);
                  onNavigate('rentals');
                }}
              >
                <i className="fa-solid fa-gauge-high"></i>
                <span>View Rental Fleet Analytics</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Tasks & Approvals Tool */}
      {activeModal === 'tasks' && (
        <div className="google-account-modal-overlay">
          <div className="bittool-popup-card">
            <div className="bittool-header">
              <div className="bittool-title-row">
                <div className="bittool-badge-icon tasks">
                  <i className="fa-regular fa-circle-check"></i>
                </div>
                <div>
                  <h4 className="bittool-title">Pending Approvals & Tasks</h4>
                  <p className="bittool-desc">Requires immediate partner review</p>
                </div>
              </div>
              <button className="side-modal-close" onClick={() => setActiveModal(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="bittool-content-box">
              <div className="task-row">
                <input type="checkbox" id="task-1" defaultChecked />
                <label htmlFor="task-1">
                  <strong>Verify Driving License for Booking #SART-901</strong>
                  <span>Customer uploaded DigiLocker KYC</span>
                </label>
              </div>
              <div className="task-row">
                <input type="checkbox" id="task-2" />
                <label htmlFor="task-2">
                  <strong>Approve Carrier Cargo Booking #CAR-440</strong>
                  <span>Route: Sriperumbudur ➔ Ennore Port (25 Ton Truck)</span>
                </label>
              </div>
              <div className="task-row">
                <input type="checkbox" id="task-3" />
                <label htmlFor="task-3">
                  <strong>Assign Chauffeur for Corporate Booking #DRV-102</strong>
                  <span>Mercedes E-Class Airport Drop • 4 Hours</span>
                </label>
              </div>

              <button
                type="button"
                className="bittool-action-btn"
                onClick={() => {
                  setActiveModal(null);
                  onNavigate('drivers');
                }}
              >
                <i className="fa-solid fa-user-check"></i>
                <span>Manage Drivers & Assignments</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Quick Dispatch Notes */}
      {activeModal === 'notes' && (
        <div className="google-account-modal-overlay">
          <div className="bittool-popup-card">
            <div className="bittool-header">
              <div className="bittool-title-row">
                <div className="bittool-badge-icon notes">
                  <i className="fa-regular fa-pen-to-square"></i>
                </div>
                <div>
                  <h4 className="bittool-title">Dispatch Scratchpad & Notes</h4>
                  <p className="bittool-desc">Internal notes for counter staff</p>
                </div>
              </div>
              <button className="side-modal-close" onClick={() => setActiveModal(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="bittool-content-box">
              <textarea
                className="bittool-textarea"
                rows={4}
                defaultValue="Note: Collect ₹5,000 refundable security deposit for Thar Roxx rental #THAR-771. Ensure helmet is provided for Royal Enfield Classic 350 bookings."
                placeholder="Write quick notes here..."
              ></textarea>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  className="bittool-action-btn"
                  style={{ width: 'auto', padding: '8px 18px' }}
                  onClick={() => setActiveModal(null)}
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Save Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Settings & Quick Navigation */}
      {(activeModal === 'settings' || activeModal === 'more' || activeModal === 'add') && (
        <div className="google-account-modal-overlay">
          <div className="bittool-popup-card">
            <div className="bittool-header">
              <div className="bittool-title-row">
                <div className="bittool-badge-icon settings">
                  <i className="fa-solid fa-sliders"></i>
                </div>
                <div>
                  <h4 className="bittool-title">
                    {activeModal === 'add' ? 'Add Fleet or Resources' : 'Fleet Operations & Shortcuts'}
                  </h4>
                  <p className="bittool-desc">Quick jump into dedicated business sections</p>
                </div>
              </div>
              <button className="side-modal-close" onClick={() => setActiveModal(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="bittool-content-box">
              <div className="bittool-shortcuts-grid">
                <button
                  type="button"
                  className="shortcut-tile"
                  onClick={() => {
                    setActiveModal(null);
                    onNavigate('rentals');
                  }}
                >
                  <i className="fa-solid fa-car-side text-blue"></i>
                  <span>Rental Fleet</span>
                </button>
                <button
                  type="button"
                  className="shortcut-tile"
                  onClick={() => {
                    setActiveModal(null);
                    onNavigate('carriers');
                  }}
                >
                  <i className="fa-solid fa-truck-moving text-green"></i>
                  <span>Cargo Carrier</span>
                </button>
                <button
                  type="button"
                  className="shortcut-tile"
                  onClick={() => {
                    setActiveModal(null);
                    onNavigate('drivers');
                  }}
                >
                  <i className="fa-solid fa-user-tie text-purple"></i>
                  <span>Hire Drivers</span>
                </button>
                <button
                  type="button"
                  className="shortcut-tile"
                  onClick={() => {
                    setActiveModal(null);
                    onNavigate('parking');
                  }}
                >
                  <i className="fa-solid fa-square-parking text-amber"></i>
                  <span>Parking Slots</span>
                </button>
              </div>

              <button
                type="button"
                className="bittool-action-btn"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setActiveModal(null);
                  onNavigate('home');
                }}
              >
                <i className="fa-solid fa-chart-line"></i>
                <span>Go to Main Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
