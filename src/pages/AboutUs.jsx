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
import cwLogo from '../../public/images/Cwlogo.png';
import '../styles/aboutus.css';

export default function AboutUs() {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

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

      {/* Header */}
      <header className="about-header">
        <div className="about-header-inner">
          <Link to="/" className="about-logo">
            <img src={cwLogo} alt="Code Weave Planet" className="about-logo-image" />
            <span className="about-logo-text">Code Weave Planet</span>
          </Link>
          <Link to="/" className="back-home-btn">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="about-footer">
        <div className="about-footer-content">
          <div className="footer-brand">
            <img src={cwLogo} alt="Code Weave Planet" className="footer-logo-img" />
            <h3>Code Weave Planet</h3>
            <p>Weaving Skills into Careers</p>
          </div>
          <div className="footer-info">
            <div className="footer-links">
              <a href="#home">Home</a>
              <a href="#courses">Courses</a>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
            <div className="footer-contact">
              <a href={`tel:+256${WHATSAPP_NUMBER.slice(1)}`}>
                <Phone size={16} />
                {WHATSAPP_NUMBER}
              </a>
              <a href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`}>
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Code Weave Planet. All rights reserved.</p>
          <p>Revolutionising Tech Education</p>
        </div>
      </footer>
    </div>
  );
}
