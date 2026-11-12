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
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import PaymentModal from '../components/PaymentModal';
import cwLogo from '../../public/images/Cwlogo.png';
import '../styles/aboutus.css';

export default function AboutUs() {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const curtainTimer = setTimeout(() => {
      setCurtainOpen(true);
    }, 300);

    const contentTimer = setTimeout(() => {
      setContentVisible(true);
    }, 1800);

    return () => {
      clearTimeout(curtainTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const WHATSAPP_NUMBER = "0750937506";

  return (
    <div className="about-page">
      {/* Curtain Animation */}
      <div className={`curtain-container ${curtainOpen ? 'open' : ''}`}>
        <div className="curtain curtain-left"></div>
        <div className="curtain curtain-right"></div>
      </div>

      {/* Unified Global Navigation Header with Mobile Hamburger */}
      <GlobalHeader onOpenPayment={() => setShowPaymentModal(true)} />

      {/* Main Content */}
      <main className={`about-content ${contentVisible ? 'visible' : ''}`}>
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

        {/* Leadership & Founder Spotlight */}
        <section className="why-choose-section" style={{ marginTop: '40px' }}>
          <div className="section-header">
            <h2>Leadership & Founder</h2>
            <p>The vision and driving force behind Code Weave Planet</p>
          </div>

          <div style={{
            maxWidth: '920px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '2px solid #C99726',
            boxShadow: '0 12px 36px rgba(10, 17, 40, 0.08)',
            padding: '36px 30px',
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', flexShrink: 0, margin: '0 auto' }}>
              <img
                src="/images/CEO.png"
                alt="Founder & CEO, Code Weave Planet"
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #C99726',
                  boxShadow: '0 8px 24px rgba(201, 151, 38, 0.35)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '6px',
                right: '6px',
                background: '#C99726',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <Icon icon="mdi:shield-check" width="18" />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(201, 151, 38, 0.15)',
                color: '#B45309',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 800,
                marginBottom: '8px'
              }}>
                <Icon icon="mdi:crown" width="14" color="#C99726" />
                FOUNDER & LEAD DIRECTOR
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0A1128', margin: '0 0 10px 0', fontFamily: "'Space Grotesk', sans-serif" }}>
                Polly — Founder & CEO
              </h3>

              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, marginBottom: '16px', fontStyle: 'italic' }}>
                "At Code Weave Planet, we believe tech education shouldn't be about endless theory or outdated slides. We build a straight line from zero experience to production systems — connecting African youth directly to real-world software engineering, artificial intelligence, and digital careers."
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0A1128', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon icon="mdi:map-marker" width="16" color="#C99726" /> Mbarara, Western Uganda
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0A1128', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon icon="mdi:whatsapp" width="16" color="#22C55E" /> Host of Tech Over Ten with Polly
                </span>
              </div>
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

      {/* Interactive Steering Wheel Circle and Modular Animated Footer in Blocks */}
      <GlobalFooter />

      {/* Embedded Global Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  );
}
