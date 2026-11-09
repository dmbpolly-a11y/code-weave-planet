import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';
import cwLogo from '../../public/images/Cwlogo.png';
import PaymentModal from './PaymentModal';

const WHATSAPP_NUMBER = "0750937506";

export default function GlobalHeader({ onOpenPayment = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  const handleOpenPayment = () => {
    if (onOpenPayment) {
      onOpenPayment();
    } else {
      setIsPaymentModalOpen(true);
    }
    setMobileMenuOpen(false);
  };

  const handleNavClick = (hash) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/${hash}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="cwp-global-header">
        <style>{`
          .cwp-global-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: #FFFFFF;
            border-bottom: 1.5px solid #EFECE6;
            box-shadow: 0 4px 20px rgba(10, 17, 40, 0.05);
            font-family: 'Inter', -apple-system, sans-serif;
            width: 100%;
          }

          .cwp-header-container {
            max-width: 1240px;
            margin: 0 auto;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          /* Logo */
          .cwp-header-logo-link {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            flex-shrink: 0;
          }

          .cwp-header-logo-img {
            height: 48px;
            width: auto;
            object-fit: contain;
          }

          /* Desktop Nav */
          .cwp-desktop-nav {
            display: flex;
            align-items: center;
            gap: 26px;
          }

          .cwp-nav-link {
            font-size: 14.5px;
            font-weight: 500;
            color: #0A1128;
            text-decoration: none;
            transition: color 0.2s ease;
            position: relative;
            cursor: pointer;
            background: transparent;
            border: none;
            padding: 4px 0;
          }

          .cwp-nav-link:hover {
            color: #C99726;
          }

          .cwp-nav-link.active {
            color: #C99726;
            font-weight: 600;
          }

          .cwp-nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            right: 0;
            height: 2.5px;
            background: #C99726;
            border-radius: 2px;
          }

          /* Header Actions */
          .cwp-header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .cwp-pay-btn {
            background: #FFFDF0;
            border: 1.5px solid #C99726;
            color: #92400E;
            padding: 8px 16px;
            border-radius: 24px;
            font-size: 13.5px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
          }

          .cwp-pay-btn:hover {
            background: #C99726;
            color: #FFFFFF;
            box-shadow: 0 4px 14px rgba(201, 151, 38, 0.35);
            transform: translateY(-1px);
          }

          .cwp-login-btn {
            color: #0A1128;
            border: 1px solid #D4D4D8;
            background: #FFFFFF;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13.5px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
          }

          .cwp-login-btn:hover {
            border-color: #0A1128;
            background: #F4F4F5;
          }

          .cwp-register-btn {
            background: #C99726;
            color: #FFFFFF;
            border: 1px solid #C99726;
            padding: 8px 18px;
            border-radius: 8px;
            font-size: 13.5px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(201, 151, 38, 0.25);
          }

          .cwp-register-btn:hover {
            background: #B3831D;
            box-shadow: 0 4px 14px rgba(201, 151, 38, 0.4);
          }

          .cwp-user-menu {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .cwp-user-badge {
            background: #F4F4F5;
            color: #0A1128;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .cwp-logout-btn {
            background: transparent;
            border: 1px solid #E4E4E7;
            color: #71717A;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12.5px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .cwp-logout-btn:hover {
            color: #DC2626;
            border-color: #FCA5A5;
            background: #FEF2F2;
          }

          /* Mobile Hamburger Button */
          .cwp-mobile-hamburger-btn {
            display: none;
            background: #FAF8F5;
            border: 1.5px solid #E4E4E7;
            color: #0A1128;
            width: 44px;
            height: 44px;
            border-radius: 10px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
          }

          .cwp-mobile-hamburger-btn:hover {
            border-color: #C99726;
            background: #FFFDF0;
          }

          /* Mobile Slide-down Drawer */
          .cwp-mobile-drawer {
            display: none;
            background: #FFFFFF;
            border-top: 1px solid #EFECE6;
            box-shadow: 0 16px 30px rgba(10, 17, 40, 0.12);
            padding: 16px 20px 24px 20px;
            animation: mobileDrawerSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes mobileDrawerSlide {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .cwp-mobile-nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            color: #0A1128;
            font-size: 15px;
            font-weight: 500;
            text-decoration: none;
            border-radius: 8px;
            transition: background 0.15s;
            background: transparent;
            border: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
          }

          .cwp-mobile-nav-link:hover, .cwp-mobile-nav-link.active {
            background: #FFFDF0;
            color: #C99726;
            font-weight: 600;
          }

          .cwp-mobile-drawer-actions {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #EFECE6;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .cwp-mobile-drawer-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            border-radius: 10px;
            font-size: 14.5px;
            font-weight: 600;
            text-decoration: none;
            text-align: center;
          }

          .cwp-mobile-drawer-btn.pay {
            background: #FFFDF0;
            border: 2px solid #C99726;
            color: #92400E;
          }

          .cwp-mobile-drawer-btn.login {
            background: #0A1128;
            color: #FFFFFF;
          }

          .cwp-mobile-drawer-btn.register {
            background: #C99726;
            color: #FFFFFF;
          }

          .cwp-mobile-drawer-btn.whatsapp {
            background: #22C55E;
            color: #FFFFFF;
          }

          /* Responsive Breakpoint */
          @media (max-width: 860px) {
            .cwp-desktop-nav, .cwp-header-actions {
              display: none !important;
            }
            .cwp-mobile-hamburger-btn {
              display: flex !important;
            }
            .cwp-mobile-drawer {
              display: block;
            }
            .cwp-header-container {
              padding: 10px 16px;
            }
            .cwp-header-logo-img {
              height: 40px;
            }
          }
        `}</style>

        <div className="cwp-header-container">
          {/* Logo on Pure White */}
          <Link to="/" className="cwp-header-logo-link" onClick={() => setMobileMenuOpen(false)}>
            <img src={cwLogo} alt="Code Weave Planet" className="cwp-header-logo-img" />
          </Link>

          {/* Desktop Navigation Menus */}
          <nav className="cwp-desktop-nav">
            <Link to="/" className={`cwp-nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <button
              type="button"
              onClick={() => handleNavClick('#courses')}
              className="cwp-nav-link"
            >
              Courses
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#how')}
              className="cwp-nav-link"
            >
              How It Works
            </button>
            <Link to="/about" className={`cwp-nav-link ${isActive('/about') ? 'active' : ''}`}>
              About Us
            </Link>
            <Link to="/profiles" className={`cwp-nav-link ${isActive('/profiles') ? 'active' : ''}`}>
              Community Profiles
            </Link>
          </nav>

          {/* Desktop Actions & Pay Button */}
          <div className="cwp-header-actions">
            {/* Pay Tuition / Fees button */}
            <button
              type="button"
              onClick={handleOpenPayment}
              className="cwp-pay-btn"
              title="Pay tuition via MTN MoMo, Airtel Money, or Bank"
            >
              <Icon icon="mdi:cash-fast" width="18" />
              Pay Tuition / Fees
            </button>

            {user ? (
              <div className="cwp-user-menu">
                <Link
                  to={
                    profile?.role === 'admin'
                      ? '/admin'
                      : profile?.role === 'tutor'
                      ? '/tutor'
                      : '/student'
                  }
                  className="cwp-user-badge"
                >
                  <Icon icon="mdi:account-circle" width="18" color="#C99726" />
                  <span>{profile?.full_name?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button type="button" onClick={logout} className="cwp-logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="cwp-login-btn">
                  Login
                </Link>
                <Link to="/register" className="cwp-register-btn">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="cwp-mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <Icon icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"} width="26" />
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="cwp-mobile-drawer">
            <Link
              to="/"
              className={`cwp-mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon icon="mdi:home" width="20" color="#C99726" /> Home
            </Link>
            <button
              type="button"
              className="cwp-mobile-nav-link"
              onClick={() => handleNavClick('#courses')}
            >
              <Icon icon="mdi:book-open-variant" width="20" color="#C99726" /> Courses
            </button>
            <button
              type="button"
              className="cwp-mobile-nav-link"
              onClick={() => handleNavClick('#how')}
            >
              <Icon icon="mdi:help-circle-outline" width="20" color="#C99726" /> How It Works
            </button>
            <Link
              to="/about"
              className={`cwp-mobile-nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon icon="mdi:information-outline" width="20" color="#C99726" /> About Us
            </Link>
            <Link
              to="/profiles"
              className={`cwp-mobile-nav-link ${isActive('/profiles') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon icon="mdi:account-group" width="20" color="#C99726" /> Community Profiles
            </Link>

            <div className="cwp-mobile-drawer-actions">
              {/* Mobile Pay Tuition Button */}
              <button
                type="button"
                onClick={handleOpenPayment}
                className="cwp-mobile-drawer-btn pay"
              >
                <Icon icon="mdi:cash-fast" width="20" color="#C99726" />
                Pay Tuition / Mobile Money
              </button>

              {user ? (
                <>
                  <Link
                    to={
                      profile?.role === 'admin'
                        ? '/admin'
                        : profile?.role === 'tutor'
                        ? '/tutor'
                        : '/student'
                    }
                    className="cwp-mobile-drawer-btn login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon icon="mdi:view-dashboard" width="18" /> My Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="cwp-logout-btn"
                    style={{ width: '100%', padding: '10px' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="cwp-mobile-drawer-btn login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon icon="mdi:login" width="18" /> Login
                  </Link>
                  <Link
                    to="/register"
                    className="cwp-mobile-drawer-btn register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon icon="mdi:account-plus" width="18" /> Create Account
                  </Link>
                </>
              )}

              <a
                href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`}
                className="cwp-mobile-drawer-btn whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon icon="mdi:whatsapp" width="18" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Embedded Global Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </>
  );
}
