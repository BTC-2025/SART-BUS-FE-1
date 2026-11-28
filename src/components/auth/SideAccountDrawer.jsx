import React, { useState } from 'react';
import './Auth.css';

export default function SideAccountDrawer({
  partnerDetails,
  isOpen = false,
  onNavigate = () => { },
  onLogout = () => { },
  onSwitchAccount = () => { },
  onActiveToolChange = () => { }
}) {
  const [activeModal, setActiveModal] = useState(null); // 'profile' | 'calendar' | 'calculator' | 'contacts' | 'notes' | 'settings' | 'add'

  const toggleModal = (modalKey) => {
    const next = activeModal === modalKey ? null : modalKey;
    setActiveModal(next);
    onActiveToolChange(next);
  };

  // Calculator states
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcFormula, setCalcFormula] = useState('');
  const [calcRunningTotal, setCalcRunningTotal] = useState('0.00');

  // Notes state
  const [notesList, setNotesList] = useState([]);
  const [noteInput, setNoteInput] = useState('');

  // Contacts state
  const [contactsList, setContactsList] = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // User values
  const name = partnerDetails?.name || 'venkatavasanthakumarp1997';
  const email = partnerDetails?.email || 'venkatavasanthakumarp1997@bnxmail.com';
  const initial = name.charAt(0).toUpperCase() || 'V';

  if (!isOpen) return null;

  // Calculator keypad handler
  const handleCalcClick = (val) => {
    if (val === 'C' || val === 'AC') {
      setCalcDisplay('0');
      setCalcFormula('');
      setCalcRunningTotal('0.00');
    } else if (val === 'backspace') {
      if (calcDisplay.length <= 1) setCalcDisplay('0');
      else setCalcDisplay(calcDisplay.slice(0, -1));
    } else if (val === '=') {
      try {
        // Safe evaluation
        const sanitized = calcDisplay.replace(/x/g, '*').replace(/÷/g, '/');
        // evaluate numbers and simple math operators only
        if (/^[0-9+\-*/. ()]+$/.test(sanitized)) {
          const res = Function(`'use strict'; return (${sanitized})`)();
          setCalcDisplay(String(res));
          setCalcRunningTotal(Number(res).toFixed(2));
        }
      } catch (e) {
        setCalcDisplay('Error');
      }
    } else {
      if (calcDisplay === '0' && !['+', '-', '*', '/', '.', 'x', '÷'].includes(val)) {
        setCalcDisplay(val);
      } else {
        setCalcDisplay(prev => prev + val);
      }
    }
  };

  return (
    <>
      {/* 1. Vertical Tool Strip on the Right side starting below the sub-navbar */}
      <aside className="side-tool-strip">
        {/* 1. SART Business Logo Button (Blue 'B' matching user request) */}
        <button
          type="button"
          className={`tool-strip-pill-btn business-brand ${activeModal === 'profile' ? 'active-tool' : ''}`}
          title="SART Business Partner Profile"
          onClick={() => toggleModal('profile')}
        >
          <span style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: "20px", color: "rgb(0, 86, 179)" }}>B</span>
        </button>

        {/* Divider matching user screenshot */}
        <div className="tool-strip-divider"></div>

        {/* 2. Calendar (Yellow Rounded Square) - Image 1 UI */}
        <button
          type="button"
          className={`tool-strip-pill-btn calendar ${activeModal === 'calendar' ? 'active-tool' : ''}`}
          title="Calendar Schedule"
          onClick={() => toggleModal('calendar')}
        >
          <i className="fa-regular fa-calendar-days"></i>
        </button>

        {/* 3. Calculator / Accounting (Mint Green Square) - Image 2 UI */}
        <button
          type="button"
          className={`tool-strip-pill-btn calculator ${activeModal === 'calculator' ? 'active-tool' : ''}`}
          title="Beta Calculator"
          onClick={() => toggleModal('calculator')}
        >
          <i className="fa-solid fa-calculator"></i>
        </button>

        {/* 4. Global Contacts (Soft Blue Square) - Image 3 UI */}
        <button
          type="button"
          className={`tool-strip-pill-btn contact-id ${activeModal === 'contacts' ? 'active-tool' : ''}`}
          title="Global Contacts"
          onClick={() => toggleModal('contacts')}
        >
          <i className="fa-regular fa-id-badge"></i>
        </button>

        {/* 5. Document / Notes (Soft Pink Square) - Image 4 UI */}
        <button
          type="button"
          className={`tool-strip-pill-btn doc-note ${activeModal === 'notes' ? 'active-tool' : ''}`}
          title="Notes"
          onClick={() => toggleModal('notes')}
        >
          <i className="fa-regular fa-file"></i>
        </button>

        {/* 6. Dashed Add Button */}
        <button
          type="button"
          className={`tool-strip-pill-btn add-more ${activeModal === 'add' ? 'active-tool' : ''}`}
          title="Add New Vehicle / Resource"
          onClick={() => toggleModal('add')}
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
          onClick={() => toggleModal('notes')}
        >
          <i className="fa-regular fa-pen-to-square"></i>
        </button>

        {/* Bottom Tool: Settings / Sliders Icon */}
        <button
          type="button"
          className={`tool-strip-pill-btn bottom-tool ${activeModal === 'settings' ? 'active-tool' : ''}`}
          title="Fleet Settings & Theme Preferences"
          onClick={() => toggleModal('settings')}
        >
          <i className="fa-solid fa-sliders"></i>
        </button>
      </aside>

      {/* 2. Side Panel Cards appearing beside the icons in page body (adjustable, non-overlapping) */}

      {/* PANEL 1: CALENDAR (Exact Match to Image 1) */}
      {activeModal === 'calendar' && (
        <div className="side-bittool-dock-panel calendar-panel">
          <div className="bittool-dock-header">
            <span className="bittool-dock-title">CALENDAR</span>
            <button className="dock-close-icon-btn" onClick={() => toggleModal('calendar')} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="dock-panel-inner">
            {/* Month Header Capsule */}
            <div className="cal-month-nav-row">
              <button type="button" className="cal-nav-arrow-btn">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <h3 className="cal-month-heading">November 2026</h3>
              <button type="button" className="cal-nav-arrow-btn">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="cal-days-grid-card">
              <div className="cal-weekdays-row">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>
              <div className="cal-month-days-matrix">
                <span className="cal-day-cell">1</span>
                <span className="cal-day-cell today-active">2</span>
                <span className="cal-day-cell">3</span>
                <span className="cal-day-cell">4</span>
                <span className="cal-day-cell">5</span>
                <span className="cal-day-cell">6</span>
                <span className="cal-day-cell">7</span>

                <span className="cal-day-cell">8</span>
                <span className="cal-day-cell">9</span>
                <span className="cal-day-cell">10</span>
                <span className="cal-day-cell">11</span>
                <span className="cal-day-cell">12</span>
                <span className="cal-day-cell">13</span>
                <span className="cal-day-cell">14</span>

                <span className="cal-day-cell">15</span>
                <span className="cal-day-cell">16</span>
                <span className="cal-day-cell">17</span>
                <span className="cal-day-cell">18</span>
                <span className="cal-day-cell">19</span>
                <span className="cal-day-cell">20</span>
                <span className="cal-day-cell">21</span>

                <span className="cal-day-cell">22</span>
                <span className="cal-day-cell">23</span>
                <span className="cal-day-cell">24</span>
                <span className="cal-day-cell">25</span>
                <span className="cal-day-cell">26</span>
                <span className="cal-day-cell">27</span>
                <span className="cal-day-cell">28</span>

                <span className="cal-day-cell">29</span>
                <span className="cal-day-cell">30</span>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="cal-schedule-header-row">
              <span className="cal-schedule-label">SCHEDULE FOR NOV 2, 2026</span>
              <button type="button" className="cal-add-schedule-btn">
                <i className="fa-solid fa-plus"></i> Add
              </button>
            </div>
            <div className="cal-schedule-empty-box">
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>No scheduled dispatches for today.</span>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 2: BETA CALC (Exact Match to Image 2) */}
      {activeModal === 'calculator' && (
        <div className="side-bittool-dock-panel calculator-panel">
          <div className="bittool-dock-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-hashtag" style={{ color: '#059669', fontSize: '15px' }}></i>
              <span className="bittool-dock-title">BETA CALC</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="dock-head-action-btn" title="History"><i className="fa-solid fa-clock-rotate-left"></i></button>
              <button className="dock-head-action-btn" title="Share"><i className="fa-solid fa-share-nodes"></i></button>
              <button className="dock-head-action-btn red" title="Clear All" onClick={() => handleCalcClick('AC')}><i className="fa-regular fa-trash-can"></i></button>
              <button className="dock-close-icon-btn" onClick={() => toggleModal('calculator')} title="Close"><i className="fa-solid fa-xmark"></i></button>
            </div>
          </div>

          <div className="dock-panel-inner calc-inner">
            <div className="calc-base-label">Base Value</div>
            <div className="calc-screen-display">{calcDisplay}</div>

            {/* Quick Math Shortcuts Row */}
            <div className="calc-shortcuts-row">
              <button type="button" className="calc-shortcut-pill" onClick={() => {
                const val = parseFloat(calcDisplay) || 0;
                setCalcDisplay(String(val * 1.18));
              }}>% GST</button>
              <button type="button" className="calc-shortcut-pill" onClick={() => {
                const val = parseFloat(calcDisplay) || 0;
                setCalcDisplay(String(val * 0.9));
              }}>
                <i className="fa-solid fa-tag" style={{ marginRight: '4px', color: '#d97706' }}></i>Discount
              </button>
              <button type="button" className="calc-shortcut-pill">
                <i className="fa-solid fa-globe" style={{ marginRight: '4px' }}></i>INR
              </button>
              <button type="button" className="calc-shortcut-pill">
                <i className="fa-solid fa-arrows-up-down" style={{ marginRight: '4px' }}></i>Compare
              </button>
            </div>

            {/* Calculator Grid */}
            <div className="calc-buttons-grid">
              <button type="button" className="calc-btn danger" onClick={() => handleCalcClick('C')}>
                <i className="fa-solid fa-rotate-left"></i>
              </button>
              <button type="button" className="calc-btn soft" onClick={() => handleCalcClick('backspace')}>
                <i className="fa-solid fa-delete-left"></i>
              </button>
              <button type="button" className="calc-btn operator" onClick={() => handleCalcClick('/')}>/</button>
              <button type="button" className="calc-btn operator" onClick={() => handleCalcClick('*')}>x</button>

              <button type="button" className="calc-btn num" onClick={() => handleCalcClick('7')}>7</button>
              <button type="button" className="calc-btn num" onClick={() => handleCalcClick('8')}>8</button>
              <button type="button" className="calc-btn num" onClick={() => handleCalcClick('9')}>9</button>
              <button type="button" className="calc-btn operator" onClick={() => handleCalcClick('-')}>-</button>

              <button type="button" className="calc-btn num" onClick={() => handleCalcClick('4')}>4</button>
              <button type="button" className="calc-btn num" onClick={() => handleCalcClick('5')}>5</button>
              <button type="button" className="calc-btn num" onClick={() => handleCalcClick('6')}>6</button>
              <button type="button" className="calc-btn operator" onClick={() => handleCalcClick('+')}>+</button>

              <button type="button" className="calc-btn num" onClick={() => handleCalcClick('1')}>1</button>
              <button type="button" className="calc-btn num" onClick={() => handleCalcClick('2')}>2</button>
              <button type="button" className="calc-btn num" onClick={() => handleCalcClick('3')}>3</button>

              <button type="button" className="calc-btn equal-tall" onClick={() => handleCalcClick('=')}>=</button>

              <button type="button" className="calc-btn soft" onClick={() => handleCalcClick('00')}>SCI</button>
              <button type="button" className="calc-btn num" onClick={() => handleCalcClick('0')}>0</button>
              <button type="button" className="calc-btn soft" onClick={() => handleCalcClick('.')}>.</button>
            </div>

            {/* Tape Running Total Footer */}
            <div className="calc-tape-total-card">
              <div className="calc-tape-label">TAPE RUNNING TOTAL</div>
              <div className="calc-tape-value">₹{calcRunningTotal}</div>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 3: GLOBAL CONTACTS (Exact Match to Image 3) */}
      {activeModal === 'contacts' && (
        <div className="side-bittool-dock-panel contacts-panel">
          <div className="bittool-dock-header">
            <span className="bittool-dock-title">GLOBAL CONTACTS</span>
            <button className="dock-close-icon-btn" onClick={() => toggleModal('contacts')} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="dock-panel-inner">
            <div className="contacts-action-title-row">
              <h2 className="contacts-main-title">Global Contacts</h2>
              <button
                type="button"
                className="contacts-add-btn"
                onClick={() => setShowAddContact(!showAddContact)}
              >
                <i className="fa-solid fa-plus"></i> Add Contact
              </button>
            </div>

            {showAddContact && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', marginBottom: '14px' }}>
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                />
                <button
                  type="button"
                  style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => {
                    if (newContactName.trim()) {
                      setContactsList(prev => [...prev, { id: Date.now(), name: newContactName, phone: newContactPhone }]);
                      setNewContactName('');
                      setNewContactPhone('');
                      setShowAddContact(false);
                    }
                  }}
                >
                  Save Contact
                </button>
              </div>
            )}

            {/* Search Box */}
            <div className="contacts-search-box">
              <i className="fa-solid fa-magnifying-glass search-ico"></i>
              <input
                type="text"
                placeholder="Search global contacts..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
              />
            </div>

            {/* Empty State */}
            {contactsList.length === 0 ? (
              <div className="contacts-empty-state">
                No contacts found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {contactsList.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{c.phone}</div>
                    </div>
                    <i className="fa-solid fa-phone" style={{ color: '#2563eb' }}></i>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PANEL 4: NOTES (Exact Match to Image 4) */}
      {activeModal === 'notes' && (
        <div className="side-bittool-dock-panel notes-panel">
          <div className="bittool-dock-header">
            <span className="bittool-dock-title">NOTES</span>
            <button className="dock-close-icon-btn" onClick={() => toggleModal('notes')} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="dock-panel-inner">
            <div className="notes-action-title-row">
              <h2 className="notes-main-title">My Notes</h2>
              <button
                type="button"
                className="notes-new-btn"
                onClick={() => {
                  const promptVal = prompt('Enter new note:');
                  if (promptVal && promptVal.trim()) {
                    setNotesList(prev => [...prev, { id: Date.now(), text: promptVal.trim(), date: new Date().toLocaleDateString() }]);
                  }
                }}
              >
                <i className="fa-solid fa-plus"></i> New Note
              </button>
            </div>

            {/* Empty Note Box matching Image 4 */}
            {notesList.length === 0 ? (
              <div className="notes-empty-box">
                No notes yet. Click the button above to create one.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                {notesList.map(n => (
                  <div key={n.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#1e293b' }}>{n.text}</p>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{n.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
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
                  onNavigate('branches');
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


    </>
  );
}
