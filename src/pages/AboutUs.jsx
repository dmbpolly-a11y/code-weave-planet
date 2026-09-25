import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Target, 
  Users, 
  Award,
  Lightbulb,
  Zap,
  Globe,
  TrendingUp,
  ArrowLeft,
  Code,
  Video,
  BarChart3,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Icon } from '@iconify/react';
import PageTransition from '../components/PageTransition';
import cwLogo from '../../public/images/Cwlogo.png';
import '../styles/aboutus.css';

export default function AboutUs() {
  const WHATSAPP_NUMBER = "0750937506";

  return (
    <PageTransition type="origami">
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <div className="about-header-inner">
          <Link to="/" className="about-logo">
            <img src={cwLogo} alt="Code Weave Planet" className="about-logo-image" />
            <span className="about-logo-text">Code Weave Planet</span>
          </Link>
          <nav className="about-nav" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#2C1810', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Home</Link>
            <Link to="/#courses" style={{ color: '#2C1810', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Courses</Link>
            <Link to="/#how" style={{ color: '#2C1810', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>How it works</Link>
            <Link to="/about" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>About</Link>
            <Link to="/#contact" style={{ color: '#2C1810', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Contact</Link>
          </nav>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/login" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              background: '#2C1810',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
            }}>
              <Icon icon="mdi:login" width="15" />
              Login
            </Link>
            <Link to="/" className="back-home-btn">
              <ArrowLeft size={16} />
              Back Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="about-content visible">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <div className="about-hero-badge">
              <Sparkles size={16} />
              <span>About Us</span>
            </div>
            <h1 className="about-hero-title">
              Revolutionising IT & Computer Science Education
            </h1>
            <p className="about-hero-subtitle">
              Code Weave Planet is a tech hub dedicated to transforming how people learn 
              and master technology in the digital age.
            </p>
          </div>
          <div className="about-hero-image">
            <img src={cwLogo} alt="Code Weave Planet" className="about-hero-logo" />
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision-section">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="mission-icon">
                <Target size={32} />
              </div>
              <h2>Our Mission</h2>
              <p>
                To empower individuals with cutting-edge technical skills using modern tools 
                and methodologies, building fast, responsive, and innovative systems that meet 
                today's digital demands.
              </p>
            </div>

            <div className="vision-card">
              <div className="vision-icon">
                <Lightbulb size={32} />
              </div>
              <h2>Our Vision</h2>
              <p>
                To become the leading tech education hub in East Africa, recognized for 
                producing world-class developers, designers, marketers, and content creators 
                who drive digital transformation.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="what-we-do-section">
          <div className="section-header">
            <h2>What We Do</h2>
            <p>We specialize in comprehensive tech education across multiple disciplines</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <Icon icon="mdi:robot" width="40" />
              </div>
              <h3>AI & Machine Learning</h3>
              <p>
                Cutting-edge AI tools and technologies to build intelligent systems, 
                from data science to neural networks and model deployment.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Code size={40} />
              </div>
              <h3>Modern Web Development</h3>
              <p>
                Fast, responsive systems using latest frameworks like Vite.js, React, 
                and Laravel for both frontend and backend development.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Video size={40} />
              </div>
              <h3>Professional Video Editing</h3>
              <p>
                Modern video editing tools including AI-powered software for creating 
                viral content for social media platforms.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <BarChart3 size={40} />
              </div>
              <h3>Digital Marketing</h3>
              <p>
                Modern marketing tools and strategies including SEO, social media 
                marketing, content creation, and analytics.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Icon icon="mdi:cellphone-link" width="40" />
              </div>
              <h3>Mobile & Desktop Apps</h3>
              <p>
                Cross-platform application development for iOS, Android, Windows, 
                macOS, and Linux using modern frameworks.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Globe size={40} />
              </div>
              <h3>Cloud & Hosting</h3>
              <p>
                Deployment and management of modern applications on cloud platforms 
                with focus on performance and security.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-choose-section">
          <div className="section-header">
            <h2>Why Choose Code Weave Planet</h2>
            <p>What sets us apart from other tech training providers</p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">
                <Zap size={28} />
              </div>
              <h3>Modern Tools & Technologies</h3>
              <p>
                We teach using the latest industry-standard tools and frameworks 
                that companies are actually using right now.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <Users size={28} />
              </div>
              <h3>Expert Tutors</h3>
              <p>
                Learn from working professionals with real-world experience in 
                building production systems.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <TrendingUp size={28} />
              </div>
              <h3>Practical Projects</h3>
              <p>
                Build real applications from day one. Every course includes 
                hands-on projects you can add to your portfolio.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <Award size={28} />
              </div>
              <h3>Career Support</h3>
              <p>
                From complete beginner to job-ready professional. We guide you 
                every step of your tech career journey.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Students Trained</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">9+</div>
              <div className="stat-label">Course Programs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">20+</div>
              <div className="stat-label">Expert Tutors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Your Tech Journey?</h2>
            <p>
              Join hundreds of students who have transformed their careers with 
              Code Weave Planet's comprehensive tech training programs.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn-primary">
                Enroll Now
              </Link>
              <Link to="/" className="cta-btn-secondary">
                Explore Courses
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Social Media — Animated Square Blocks */}
      <div className="footer-animated">
        {/* Decorative Top Edge */}
        <div className="footer-edge">
          <div className="footer-edge-line"></div>
          <div className="footer-edge-diamond"></div>
          <div className="footer-edge-line"></div>
        </div>

        {/* 4 Square Blocks with Borders */}
        <div className="footer-blocks-grid">
          {/* Block 1: Brand & Identity */}
          <div className="footer-block footer-block-brand">
            <div className="footer-block-inner">
              <img src={cwLogo} alt="Code Weave Planet" className="footer-block-logo" />
              <h3 className="footer-block-title">Code Weave Planet</h3>
              <p className="footer-block-tagline">Weaving Skills into Careers</p>
              <div className="footer-block-divider"></div>
              <p className="footer-block-text">
                East Africa's premier modern tech hub. Hands-on coding, live tutor-led WhatsApp classes, and career-ready portfolios.
              </p>
              <Link to="/about" className="footer-block-link">
                Learn more about us
                <Icon icon="mdi:arrow-right" width="14" />
              </Link>
            </div>
          </div>

          {/* Block 2: Social Media Grid */}
          <div className="footer-block footer-block-social">
            <div className="footer-block-inner">
              <h4 className="footer-block-heading">
                <Icon icon="mdi:share-variant-outline" width="18" className="footer-heading-icon" />
                Connect With Us
              </h4>
              <p className="footer-block-text">Follow our tutorials, student showcases, and announcements:</p>
              <div className="footer-social-grid">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-square" title="Facebook">
                  <Icon icon="mdi:facebook" width="22" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-square" title="Twitter/X">
                  <Icon icon="mdi:twitter" width="22" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-square" title="Instagram">
                  <Icon icon="mdi:instagram" width="22" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-square" title="LinkedIn">
                  <Icon icon="mdi:linkedin" width="22" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-square" title="YouTube">
                  <Icon icon="mdi:youtube" width="22" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-social-square" title="TikTok">
                  <Icon icon="ic:baseline-tiktok" width="22" />
                </a>
                <a href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`} target="_blank" rel="noopener noreferrer" className="footer-social-square footer-social-whatsapp" title="WhatsApp">
                  <Icon icon="mdi:whatsapp" width="22" />
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="footer-social-square" title="Telegram">
                  <Icon icon="mdi:telegram" width="22" />
                </a>
              </div>
            </div>
          </div>

          {/* Block 3: Quick Navigation */}
          <div className="footer-block footer-block-links">
            <div className="footer-block-inner">
              <h4 className="footer-block-heading">
                <Icon icon="mdi:compass-outline" width="18" className="footer-heading-icon" />
                Explore
              </h4>
              <div className="footer-links-list">
                <Link to="/#courses" className="footer-nav-item">
                  <Icon icon="mdi:chevron-right" width="14" className="footer-nav-arrow" />
                  All Courses
                </Link>
                <Link to="/#how" className="footer-nav-item">
                  <Icon icon="mdi:chevron-right" width="14" className="footer-nav-arrow" />
                  How It Works
                </Link>
                <Link to="/#contact" className="footer-nav-item">
                  <Icon icon="mdi:chevron-right" width="14" className="footer-nav-arrow" />
                  Contact Tutors
                </Link>
                <Link to="/login" className="footer-nav-item">
                  <Icon icon="mdi:chevron-right" width="14" className="footer-nav-arrow" />
                  Student / Tutor Portal
                </Link>
                <Link to="/register" className="footer-nav-item">
                  <Icon icon="mdi:chevron-right" width="14" className="footer-nav-arrow" />
                  Create an Account
                </Link>
              </div>
            </div>
          </div>

          {/* Block 4: Direct Contact & Location */}
          <div className="footer-block footer-block-contact">
            <div className="footer-block-inner">
              <h4 className="footer-block-heading">
                <Icon icon="mdi:card-account-phone-outline" width="18" className="footer-heading-icon" />
                Get in Touch
              </h4>
              <div className="footer-contact-cards">
                <div className="footer-contact-card">
                  <Icon icon="mdi:phone" width="18" className="footer-contact-icon" />
                  <div>
                    <span className="footer-contact-label">Phone</span>
                    <span className="footer-contact-value">{WHATSAPP_NUMBER}</span>
                  </div>
                </div>
                <div className="footer-contact-card">
                  <Icon icon="mdi:whatsapp" width="18" className="footer-contact-icon footer-whatsapp-accent" />
                  <div>
                    <span className="footer-contact-label">WhatsApp</span>
                    <span className="footer-contact-value">Direct Chat Available</span>
                  </div>
                </div>
                <div className="footer-contact-card">
                  <Icon icon="mdi:map-marker" width="18" className="footer-contact-icon" />
                  <div>
                    <span className="footer-contact-label">Hub Location</span>
                    <span className="footer-contact-value">Mbarara, Uganda</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              © {new Date().getFullYear()} <strong style={{ color: '#D4AF37' }}>Code Weave Planet</strong>. All rights reserved.
            </p>
            <div className="footer-legal">
              <a href="#privacy" className="footer-legal-link">Privacy Policy</a>
              <span className="footer-legal-dot">•</span>
              <a href="#terms" className="footer-legal-link">Terms of Service</a>
              <span className="footer-legal-dot">•</span>
              <span className="footer-tagline-small">Weaving Skills into Careers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
