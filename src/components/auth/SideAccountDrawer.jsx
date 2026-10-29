import React, { useState } from 'react';
import './Auth.css';

export default function SideAccountDrawer({ partnerDetails, onLogout, onSwitchAccount }) {
  const [isOpen, setIsOpen] = useState(false);

  // User values
  const name = partnerDetails?.name || 'venkatavasanthakumarp1997';
  const email = partnerDetails?.email || 'venkatavasanthakumarp1997@bnxmail.com';
  const initial = name.charAt(0).toUpperCase() || 'V';

  return (
    <>
      {/* 1. Vertical Tool Strip on the Right side starting below the blue sub-navbar (top: 112px) */}
      <aside className="side-tool-strip">
        {/* Calendar (Yellow Rounded Square) - Exactly matches User's 1st Screenshot */}
        <button type="button" className="tool-strip-pill-btn calendar" title="Calendar & Schedules">
          <i className="fa-regular fa-calendar-days"></i>
        </button>

        {/* Lightbulb (Idea / Tips) */}
        <button type="button" className="tool-strip-pill-btn idea" title="Tips & Insights">
          <i className="fa-regular fa-lightbulb"></i>
        </button>

        {/* Checkmark Circle (Tasks & Verification) */}
        <button type="button" className="tool-strip-pill-btn tasks" title="Tasks & Approvals">
          <i className="fa-regular fa-circle-check"></i>
        </button>

        {/* User / Contact Icon */}
        <button
          type="button"
          className="tool-strip-pill-btn user-btn"
          title="Account Profile & Details"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="fa-regular fa-user"></i>
        </button>

        {/* Small Horizontal Divider */}
        <div className="tool-strip-divider"></div>

        {/* More / Three Dots */}
        <button type="button" className="tool-strip-pill-btn more-dots" title="More Options">
          <i className="fa-solid fa-ellipsis"></i>
        </button>

        {/* Plus / Add Tool */}
        <button type="button" className="tool-strip-pill-btn add-more" title="Add Tools">
          <i className="fa-solid fa-plus"></i>
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Bottom Tool: Edit Icon */}
        <button type="button" className="tool-strip-pill-btn bottom-tool" title="Quick Notes">
          <i className="fa-regular fa-pen-to-square"></i>
        </button>

        {/* Bottom Tool: Settings / Sliders Icon */}
        <button type="button" className="tool-strip-pill-btn bottom-tool" title="Fleet Settings">
          <i className="fa-solid fa-sliders"></i>
        </button>
      </aside>

      {/* 2. Popout Card Matching User's 1st Screenshot */}
      {isOpen && (
        <div className="google-account-modal-overlay">
          <div className="finpro-account-card">
            {/* Top Avatar Circle with Camera Badge */}
            <div className="finpro-avatar-wrap">
              <div className="finpro-avatar-circle">
                <span>{initial}</span>
              </div>
              <div className="finpro-camera-badge" title="Upload Photo">
                <i className="fa-solid fa-camera"></i>
              </div>
            </div>

            {/* Account Handle & Email */}
            <div className="finpro-account-name">{name}</div>
            <div className="finpro-account-email">{email}</div>

            {/* Make it Primary Badge */}
            <div className="finpro-primary-badge">
              <i className="fa-regular fa-circle-check"></i>
              <span>Make it Primary</span>
            </div>

            {/* Manage your account Button */}
            <button type="button" className="finpro-btn-manage">
              <i className="fa-regular fa-user"></i>
              <span>Manage your account</span>
            </button>

            <div className="finpro-menu-list">
              <button type="button" className="finpro-menu-item">
                <i className="fa-solid fa-building"></i>
                <span>Manage Branches</span>
              </button>

              <button type="button" className="finpro-menu-item">
                <i className="fa-solid fa-users"></i>
                <span>Manage SubIDs</span>
              </button>

              <button
                type="button"
                className="finpro-menu-item"
                onClick={() => {
                  setIsOpen(false);
                  onSwitchAccount && onSwitchAccount();
                }}
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Add another account</span>
              </button>

              <button
                type="button"
                className="finpro-menu-item"
                onClick={() => {
                  setIsOpen(false);
                  onLogout && onLogout();
                }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sign out of all accounts</span>
              </button>
            </div>

            {/* Prominent Red Sign Out */}
            <div className="finpro-signout-wrap">
              <button
                type="button"
                className="finpro-btn-signout"
                onClick={() => {
                  setIsOpen(false);
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
