import React from 'react';

export default function HelpAndSupportView({ onNavigate }) {
  return (
    <div className="settings-page-container">
      <div className="profile-avatar-header" style={{ marginBottom: '24px' }}>
        <div className="profile-avatar-circle-large" style={{ background: '#e0f2fe', color: '#0284c7' }}>
          <i className="fa-solid fa-headset" style={{ fontSize: '36px' }}></i>
        </div>
        <h1 className="profile-welcome-heading">Help & Partner Support</h1>
        <p className="profile-welcome-sub">24/7 dedicated support desk for fleet owners, drivers, and partners.</p>
      </div>

      <div className="settings-info-card">
        <div className="settings-card-header">
          <h2 className="settings-card-title">Instant Contact Channels</h2>
          <p className="settings-card-desc">Reach our operations management and technical assistance team directly.</p>
        </div>

        <div className="settings-rows-list">
          <div className="settings-row-item">
            <div className="settings-row-left">
              <div className="settings-row-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">TOLL-FREE HELPLINE</span>
                <span className="settings-row-val">1800-419-7278 (24x7 Priority Support)</span>
              </div>
            </div>
          </div>

          <div className="settings-row-item">
            <div className="settings-row-left">
              <div className="settings-row-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">EMAIL DESK</span>
                <span className="settings-row-val">partner-support@sart.com</span>
              </div>
            </div>
          </div>

          <div className="settings-row-item">
            <div className="settings-row-left">
              <div className="settings-row-icon" style={{ background: '#fdf4ff', color: '#c026d3' }}>
                <i className="fa-solid fa-comments"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">LIVE CHAT</span>
                <span className="settings-row-val">Chat with Fleet Relationship Manager</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-info-card">
        <div className="settings-card-header">
          <h2 className="settings-card-title">Frequently Asked Questions</h2>
          <p className="settings-card-desc">Quick answers about fleet dispatches, payouts, and driver allocations.</p>
        </div>

        <div className="settings-rows-list">
          <div className="settings-row-item">
            <div className="settings-row-left">
              <div className="settings-row-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                <i className="fa-solid fa-circle-question"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">PAYMENTS & SETTLEMENTS</span>
                <span className="settings-row-val">When are daily payouts credited to my bank account?</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-row-chevron"></i>
          </div>

          <div className="settings-row-item">
            <div className="settings-row-left">
              <div className="settings-row-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                <i className="fa-solid fa-circle-question"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">FLEET VERIFICATION</span>
                <span className="settings-row-val">How long does vehicle RC & insurance approval take?</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-row-chevron"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

