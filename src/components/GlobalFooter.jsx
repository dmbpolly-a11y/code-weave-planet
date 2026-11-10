import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import cwLogo from '../../public/images/Cwlogo.png';

import PaymentModal from './PaymentModal';

const WHATSAPP_NUMBER = "0750937506";

export default function GlobalFooter() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: 'Africa/Kampala',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      timeZone: 'Africa/Kampala',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Modular Animated Footer in Blocks */}
      <footer className="cwp-modular-footer" role="contentinfo">
        <style>{`
          .cwp-modular-footer {
            background: #0A1128;
            color: #E2E8F0;
            padding: 60px 24px 30px 24px;
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
            position: relative;
            overflow: hidden;
            border-top: 3px solid #C99726;
          }

          /* Ambient Shimmer Light on Top Border */
          .cwp-footer-shimmer {
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 3px;
            background: linear-gradient(90deg, transparent, #FFFFFF, transparent);
            animation: cwpShimmerLine 4s infinite linear;
          }

          @keyframes cwpShimmerLine {
            0% { left: -50%; }
            100% { left: 150%; }
          }

          .cwp-footer-grid {
            max-width: 1240px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1.4fr 1fr 1.2fr 1fr;
            gap: 24px;
          }

          /* Individual Footer Blocks */
          .cwp-footer-block {
            background: #111A3A;
            border: 1.5px solid #1E2958;
            border-radius: 8px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          }

          /* Block Hover Animation */
          .cwp-footer-block:hover {
            transform: translateY(-4px);
            border-color: #C99726;
            box-shadow: 0 12px 28px rgba(201, 151, 38, 0.18), 0 2px 8px rgba(0, 0, 0, 0.4);
            background: #142048;
          }

          .cwp-footer-block-header {
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 12px;
            margin-bottom: 4px;
          }

          .cwp-footer-block-title {
            font-size: 15px;
            font-weight: 700;
            color: #FFFFFF;
            letter-spacing: 0.03em;
            margin: 0;
            text-transform: uppercase;
          }

          /* Brand Block Specifics */
          .cwp-footer-brand-row {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .cwp-footer-logo-img {
            height: 52px;
            width: auto;
            object-fit: contain;
            background: #FFFFFF;
            padding: 4px;
            border-radius: 6px;
            border: 1.5px solid #C99726;
          }

          .cwp-footer-brand-title {
            font-size: 19px;
            font-weight: 800;
            color: #FFFFFF;
            margin: 0;
            line-height: 1.2;
          }

          .cwp-footer-tagline {
            font-size: 12.5px;
            color: #C99726;
            font-weight: 600;
            margin: 2px 0 0 0;
          }

          .cwp-footer-desc {
            font-size: 13.5px;
            color: #94A3B8;
            line-height: 1.6;
            margin: 0;
          }

          /* Buttons in rectangular block shape with hover pointing */
          .cwp-block-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 14px;
            background: #0A1128;
            border: 1.5px solid #233166;
            border-radius: 6px;
            color: #F1F5F9;
            font-size: 13.5px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .cwp-block-btn:hover {
            background: #C99726;
            border-color: #C99726;
            color: #0A1128;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(201, 151, 38, 0.3);
          }

          .cwp-block-btn:active {
            transform: translateY(0);
          }

          .cwp-links-block-grid {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          /* Clock & Campus Block */
          .cwp-clock-card {
            background: #0A1128;
            border: 1.5px solid rgba(201, 151, 38, 0.4);
            border-radius: 6px;
            padding: 14px 18px;
            text-align: center;
            box-shadow: inset 0 0 16px rgba(201, 151, 38, 0.08);
          }

          .cwp-clock-time {
            font-size: 26px;
            font-weight: 800;
            color: #C99726;
            font-family: 'Space Grotesk', monospace;
            letter-spacing: 0.05em;
            text-shadow: 0 0 14px rgba(201, 151, 38, 0.35);
          }

          .cwp-clock-date {
            font-size: 12px;
            color: #94A3B8;
            margin-top: 4px;
          }

          .cwp-campus-status {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            color: #E2E8F0;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 6px;
            padding: 8px 12px;
          }

          .cwp-pulse-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10B981;
            box-shadow: 0 0 8px #10B981;
            animation: cwpDotBlink 1.5s infinite;
          }

          @keyframes cwpDotBlink {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.85); }
          }

          /* Social Rectangular Block Tiles */
          .cwp-social-tiles-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }

          .cwp-social-tile {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 42px;
            background: #0A1128;
            border: 1.5px solid #233166;
            border-radius: 6px;
            color: #CBD5E1;
            text-decoration: none;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
          }

          .cwp-social-tile:hover {
            background: #C99726;
            border-color: #C99726;
            color: #0A1128;
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 14px rgba(201, 151, 38, 0.35);
          }

          /* Payments Info Strip */
          .cwp-payment-badges-row {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
          }

          .cwp-pay-chip {
            background: #0A1128;
            border: 1px solid #233166;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 700;
            color: #CBD5E1;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          /* Bottom Copyright Bar */
          .cwp-footer-bottom-bar {
            max-width: 1240px;
            margin: 36px auto 0 auto;
            padding-top: 24px;
            border-top: 1px solid #1E2958;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            font-size: 13px;
            color: #94A3B8;
          }

          .cwp-footer-copy-text {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .cwp-footer-gold-link {
            color: #C99726;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s;
          }

          .cwp-footer-gold-link:hover {
            color: #FFFFFF;
            text-decoration: underline;
          }

          /* Responsive Layout */
          @media (max-width: 1040px) {
            .cwp-footer-grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 680px) {
            .cwp-footer-grid {
              grid-template-columns: 1fr;
            }
            .cwp-footer-bottom-bar {
              flex-direction: column;
              text-align: center;
            }
          }
        `}</style>

        {/* Ambient Shimmer */}
        <div className="cwp-footer-shimmer" />

        <div className="cwp-footer-grid">
          {/* BLOCK 1: Brand & Hub Info */}
          <div className="cwp-footer-block">
            <div className="cwp-footer-brand-row">
              <img src={cwLogo} alt="Code Weave Planet Logo" className="cwp-footer-logo-img" />
              <div>
                <h4 className="cwp-footer-brand-title">Code Weave Planet</h4>
                <p className="cwp-footer-tagline">Weaving Skills into Careers</p>
              </div>
            </div>

            <p className="cwp-footer-desc">
              Western Uganda’s premier hands-on tech accelerator. We bridge practical computing,
              AI systems, modern web, mobile development, and professional careers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              <div className="cwp-pay-chip" style={{ width: 'fit-content' }}>
                <Icon icon="mdi:map-marker" width="14" color="#C99726" />
                Mbarara High Street, Western Uganda
              </div>
              <div className="cwp-pay-chip" style={{ width: 'fit-content' }}>
                <Icon icon="mdi:shield-check" width="14" color="#10B981" />
                Verified Tech Education Hub
              </div>
            </div>
          </div>

          {/* BLOCK 2: Quick Links (Rectangular Blocks with Hover Pointing) */}
          <div className="cwp-footer-block">
            <div className="cwp-footer-block-header">
              <Icon icon="mdi:navigation-variant-outline" width="18" color="#C99726" />
              <h5 className="cwp-footer-block-title">Pages & Pathways</h5>
            </div>

            <div className="cwp-links-block-grid">
              <Link to="/" className="cwp-block-btn">
                <span>Home Planet</span>
                <Icon icon="mdi:chevron-right" width="16" />
              </Link>
              <Link to="/about" className="cwp-block-btn">
                <span>About Us</span>
                <Icon icon="mdi:chevron-right" width="16" />
              </Link>
              <Link to="/profiles" className="cwp-block-btn">
                <span>Community Profiles</span>
                <Icon icon="mdi:chevron-right" width="16" />
              </Link>
              <Link to="/login" className="cwp-block-btn">
                <span>Student / Tutor Portal</span>
                <Icon icon="mdi:login" width="16" />
              </Link>
              <Link to="/register" className="cwp-block-btn">
                <span>Create Free Account</span>
                <Icon icon="mdi:account-plus" width="16" />
              </Link>
            </div>
          </div>

          {/* BLOCK 3: Uganda Live Time & Campus Status */}
          <div className="cwp-footer-block">
            <div className="cwp-footer-block-header">
              <Icon icon="mdi:clock-digital" width="18" color="#C99726" />
              <h5 className="cwp-footer-block-title">Campus Real-Time</h5>
            </div>

            <div className="cwp-clock-card">
              <div className="cwp-clock-time">{formatTime(currentTime)}</div>
              <div className="cwp-clock-date">{formatDate(currentTime)} • EAT (UTC+3)</div>
            </div>

            <div className="cwp-campus-status">
              <span className="cwp-pulse-dot" />
              <span>Campus Online & Admissions Open</span>
            </div>

            <a
              href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cwp-block-btn"
              style={{ background: '#22C55E', borderColor: '#22C55E', color: '#FFFFFF' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon icon="mdi:whatsapp" width="18" />
                Direct Hotline: {WHATSAPP_NUMBER}
              </span>
              <Icon icon="mdi:arrow-top-right" width="16" />
            </a>
          </div>

          {/* BLOCK 4: Connect & Secure Payments */}
          <div className="cwp-footer-block">
            <div className="cwp-footer-block-header">
              <Icon icon="mdi:share-variant" width="18" color="#C99726" />
              <h5 className="cwp-footer-block-title">Connect & Pay</h5>
            </div>

            {/* Social Media Rectangular Tiles */}
            <div className="cwp-social-tiles-grid">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="cwp-social-tile" title="Facebook">
                <Icon icon="mdi:facebook" width="20" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="cwp-social-tile" title="X / Twitter">
                <Icon icon="mdi:twitter" width="20" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="cwp-social-tile" title="Instagram">
                <Icon icon="mdi:instagram" width="20" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="cwp-social-tile" title="LinkedIn">
                <Icon icon="mdi:linkedin" width="20" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="cwp-social-tile" title="YouTube">
                <Icon icon="mdi:youtube" width="20" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="cwp-social-tile" title="TikTok">
                <Icon icon="ic:baseline-tiktok" width="20" />
              </a>
              <a href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`} target="_blank" rel="noopener noreferrer" className="cwp-social-tile" title="WhatsApp">
                <Icon icon="mdi:whatsapp" width="20" />
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="cwp-social-tile" title="Telegram">
                <Icon icon="mdi:telegram" width="20" />
              </a>
            </div>

            {/* Instant Tuition Payment Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="cwp-block-btn"
              style={{
                background: '#FFFDF0',
                borderColor: '#C99726',
                color: '#92400E',
                marginTop: 6
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon icon="mdi:cash-fast" width="18" color="#C99726" />
                Pay Tuition / Mobile Money
              </span>
              <Icon icon="mdi:credit-card-outline" width="16" />
            </button>

            <div className="cwp-payment-badges-row">
              <span className="cwp-pay-chip">MTN MoMo *165#</span>
              <span className="cwp-pay-chip">Airtel *185#</span>
              <span className="cwp-pay-chip">Stanbic Bank</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="cwp-footer-bottom-bar">
          <div className="cwp-footer-copy-text">
            <span>© {new Date().getFullYear()} Code Weave Planet. All rights reserved.</span>
            <span>•</span>
            <Link to="/about" className="cwp-footer-gold-link">About Mission</Link>
            <span>•</span>
            <Link to="/profiles" className="cwp-footer-gold-link">Talent Network</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>Powered by</span>
            <strong style={{ color: '#C99726' }}>Code Weave Engine</strong>
          </div>
        </div>
      </footer>

      {/* Embedded Tuition Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </>
  );
}
