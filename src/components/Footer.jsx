import React, { useState } from 'react';
import './Footer.css';

export default function Footer({ onNavigate = () => { } }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLinkClick = (route) => {
    if (onNavigate) {
      onNavigate(route);
    }
    scrollToTop();
  };

  return (
    <footer className="sart-universal-footer">
      {/* Top Value Propositions Ribbon */}
      <div className="sart-footer-features-ribbon">
        <div className="sart-footer-features-container">
          {/* Logo badge in banner */}
          <div className="sart-feature-brand">
            <div className="sart-logo-wordmark">
              <span>SART</span>
              <span className="sart-biz-badge-footer">BUSINESS</span>
            </div>
            <span className="sart-tagline">PARTNER NETWORK</span>
          </div>

          <div className="sart-feature-item">
            <div className="sart-feature-icon-badge green">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="sart-feature-text">
              <h4>Safe & Insured</h4>
              <p>Every trip and cargo covered</p>
            </div>
          </div>

          <div className="sart-feature-item">
            <div className="sart-feature-icon-badge teal">
              <i className="fa-solid fa-wallet"></i>
            </div>
            <div className="sart-feature-text">
              <h4>Instant Payouts</h4>
              <p>Zero wait time daily earnings</p>
            </div>
          </div>

          <div className="sart-feature-item">
            <div className="sart-feature-icon-badge cyan">
              <i className="fa-solid fa-headset"></i>
            </div>
            <div className="sart-feature-text">
              <h4>24/7 Captain Desk</h4>
              <p>Dedicated partner helpline</p>
            </div>
          </div>

          <div className="sart-feature-item">
            <div className="sart-feature-icon-badge emerald">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div className="sart-feature-text">
              <h4>Maximized Earnings</h4>
              <p>Transparent surge & low commission</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="sart-footer-main">
        <div className="sart-footer-container">
          {/* Column 1: Brand & Partner Bio */}
          <div className="sart-footer-col sart-footer-brand-col">
            <div className="sart-footer-logo-wrap">
              <div className="sart-logo-wordmark large">
                <span>SART</span>
                <span className="sart-biz-badge-footer">BUSINESS</span>
              </div>
            </div>
            <h3 className="sart-brand-tagline">
              Drive, Deliver & Grow With<br />
              India's Premier Mobility Platform
            </h3>
            <p className="sart-brand-description">
              Empowering vehicle owners, fleet captains, logistics operators, and professional drivers with reliable bookings, guaranteed earnings, and digital tools.
            </p>

            <div className="sart-social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="sart-social-btn" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="sart-social-btn" aria-label="X / Twitter">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="sart-social-btn" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="sart-social-btn" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="sart-social-btn" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Partner Quick Links */}
          <div className="sart-footer-col">
            <h4 className="sart-col-heading">Partner Portal</h4>
            <ul className="sart-col-list">
              <li><button type="button" onClick={() => handleLinkClick('home')}>Captain Dashboard</button></li>
              <li><button type="button" onClick={() => handleLinkClick('profile')}>Partner Profile & KYC</button></li>
              <li><button type="button" onClick={() => handleLinkClick('ride-home')}>Trip Requests</button></li>
              <li><button type="button" onClick={() => handleLinkClick('profile')}>Incentives & Rewards</button></li>
              <li><button type="button" onClick={() => handleLinkClick('profile')}>Insurance & Claims</button></li>
              <li><button type="button" onClick={() => handleLinkClick('profile')}>Driver Safety Norms</button></li>
              <li><button type="button" onClick={() => handleLinkClick('profile')}>Fleet Management</button></li>
              <li><button type="button" onClick={() => handleLinkClick('profile')}>Help & Support</button></li>
            </ul>
          </div>

          {/* Column 3: Partner Business Verticals */}
          <div className="sart-footer-col">
            <h4 className="sart-col-heading">Business Verticals</h4>
            <ul className="sart-services-list">
              <li>
                <button type="button" onClick={() => handleLinkClick('ride-bike')}>
                  <span className="sart-service-icon green"><i className="fa-solid fa-motorcycle"></i></span>
                  <span>Bike Captain</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleLinkClick('ride-auto')}>
                  <span className="sart-service-icon orange"><i className="fa-solid fa-truck-front"></i></span>
                  <span>Auto Captain</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleLinkClick('ride-car')}>
                  <span className="sart-service-icon blue"><i className="fa-solid fa-car-side"></i></span>
                  <span>Cab Captain</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleLinkClick('ride-car')}>
                  <span className="sart-service-icon purple"><i className="fa-solid fa-truck"></i></span>
                  <span>Carrier Logistics</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleLinkClick('ride-home')}>
                  <span className="sart-service-icon teal"><i className="fa-solid fa-square-p"></i></span>
                  <span>Parking Slot Partners</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleLinkClick('ride-auto')}>
                  <span className="sart-service-icon amber"><i className="fa-solid fa-user-tie"></i></span>
                  <span>Hire Drivers</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Download Captain App */}
          <div className="sart-footer-col">
            <h4 className="sart-col-heading">Download Captain App</h4>
            <p className="sart-app-desc">Manage rides, track daily payouts and accept trips on the go.</p>

            <div className="sart-store-badges">
              {/* Google Play Store Badge */}
              <a href="#play-store" className="sart-store-button">
                <div className="sart-store-icon">
                  <i className="fa-brands fa-google-play"></i>
                </div>
                <div className="sart-store-text">
                  <span className="sart-store-sub">GET IT ON</span>
                  <span className="sart-store-title">Google Play</span>
                </div>
              </a>

              {/* Apple App Store Badge */}
              <a href="#app-store" className="sart-store-button">
                <div className="sart-store-icon">
                  <i className="fa-brands fa-apple"></i>
                </div>
                <div className="sart-store-text">
                  <span className="sart-store-sub">Download on the</span>
                  <span className="sart-store-title">App Store</span>
                </div>
              </a>
            </div>
          </div>

          {/* Column 5: Captain Bulletins & Updates */}
          <div className="sart-footer-col sart-newsletter-col">
            <h4 className="sart-col-heading">Partner Alerts & Updates</h4>
            <p className="sart-newsletter-desc">Get notifications on peak hours, weekly incentives and bonus schemes.</p>

            <form className="sart-newsletter-form" onSubmit={handleSubscribe}>
              <div className="sart-newsletter-input-box">
                <input
                  type="email"
                  placeholder="Enter captain mobile / email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="sart-newsletter-submit-btn" aria-label="Subscribe">
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </form>
            {subscribed && (
              <span className="sart-newsletter-success">
                <i className="fa-solid fa-circle-check"></i> Subscribed to partner alerts!
              </span>
            )}
          </div>
        </div>

        {/* Bottom copyright & legal bar */}
        <div className="sart-footer-bottom-bar">
          <div className="sart-footer-bottom-container">
            <p className="sart-copyright">
              © 2026 SART Business & Captain Network. All rights reserved.
            </p>

            <div className="sart-legal-links">
              <button type="button" onClick={() => handleLinkClick('profile')}>Terms of Service</button>
              <span className="sart-legal-separator">|</span>
              <button type="button" onClick={() => handleLinkClick('profile')}>Captain Agreement</button>
              <span className="sart-legal-separator">|</span>
              <button type="button" onClick={() => handleLinkClick('profile')}>Privacy Policy</button>
              <span className="sart-legal-separator">|</span>
              <button type="button" onClick={() => handleLinkClick('profile')}>Partner Code of Conduct</button>
            </div>

            <button type="button" className="sart-scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
