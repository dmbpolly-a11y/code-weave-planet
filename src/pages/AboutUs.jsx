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

        {/* Leadership & Founder Spotlight: Polly Byabazaire */}
        <section className="why-choose-section" style={{ marginTop: '50px', marginBottom: '40px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(201, 151, 38, 0.15)',
              color: '#B45309',
              padding: '6px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 800,
              marginBottom: '12px'
            }}>
              <Icon icon="mdi:crown" width="16" color="#C99726" />
              FOUNDER & TECHNOLOGY VISIONARY | CODE WEAVE PLANET
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0A1128', fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 10px 0' }}>
              Revolutionising IT & Computer Science Education Through Innovation
            </h2>
            <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '16px', color: '#475569' }}>
              Bridging the gap between theoretical computing and transformative real-world digital solutions.
            </p>
          </div>

          {/* Main Founder Profile Card */}
          <div style={{
            maxWidth: '1080px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            border: '2px solid #C99726',
            boxShadow: '0 16px 40px rgba(10, 17, 40, 0.08)',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '36px'
          }}>
            {/* Top Founder Header Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '36px',
              flexWrap: 'wrap',
              borderBottom: '1.5px solid #F1F5F9',
              paddingBottom: '32px'
            }}>
              <div style={{ position: 'relative', flexShrink: 0, margin: '0 auto' }}>
                <img
                  src="/images/CEO.png"
                  alt="Polly Byabazaire - Founder & CEO, Code Weave Planet"
                  style={{
                    width: '210px',
                    height: '210px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #C99726',
                    boxShadow: '0 10px 30px rgba(201, 151, 38, 0.4)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: '#C99726',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  border: '2px solid #FFFFFF'
                }} title="Verified Technology Visionary">
                  <Icon icon="mdi:shield-check" width="22" />
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#C99726', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  About the Founder
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#0A1128', margin: '0 0 10px 0', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Polly Byabazaire
                </h3>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#B45309', marginBottom: '14px' }}>
                  Computer Scientist • Technology Entrepreneur • Full-Stack Developer • Digital Innovation Enthusiast
                </div>
                <p style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.7, margin: '0 0 14px 0' }}>
                  In a world increasingly shaped by technology, innovation is no longer just about understanding computers or writing lines of code. It is about identifying problems, developing intelligent solutions, and creating technology that transforms how people live, work, learn, and do business.
                </p>
                <p style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                  Polly Byabazaire is driven by a bold vision: <strong>to make technology practical, accessible, and transformative for individuals, businesses, and communities.</strong> As the founder of Code Weave Planet, Polly is guided by the firm belief that the future belongs to those who do not simply consume technology but understand it, build it, and use it to solve real-world challenges.
                </p>
              </div>
            </div>

            {/* Quote Callout */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 151, 38, 0.12) 0%, rgba(10, 17, 40, 0.04) 100%)',
              borderLeft: '4px solid #C99726',
              borderRadius: '0 12px 12px 0',
              padding: '20px 24px',
              fontStyle: 'italic',
              color: '#0A1128',
              fontSize: '16.5px',
              lineHeight: 1.6
            }}>
              "Technology should not just make life easier; it should create opportunities, empower people, transform businesses, and build stronger communities."
              <div style={{ fontSize: '13px', fontStyle: 'normal', fontWeight: 700, color: '#B45309', marginTop: '8px' }}>
                — Polly Byabazaire's Guiding Philosophy
              </div>
            </div>

            {/* A Vision Built Around Technology and Impact */}
            <div>
              <h4 style={{ fontSize: '22px', fontWeight: 800, color: '#0A1128', marginBottom: '12px', fontFamily: "'Space Grotesk', sans-serif" }}>
                A Vision Built Around Technology and Impact
              </h4>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, marginBottom: '20px' }}>
                His vision extends beyond traditional computer education. He seeks to bridge the gap between theoretical knowledge and practical technological innovation by empowering learners to transform ideas into functional digital products, intelligent systems, and sustainable business solutions.
              </p>

              {/* 6 Core Areas Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Icon icon="mdi:robot" width="22" color="#C99726" />
                    <strong style={{ fontSize: '15px', color: '#0A1128' }}>Artificial Intelligence & ML</strong>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Exploring intelligent systems, automation, predictive technologies, and AI-powered solutions that address real-world problems.
                  </p>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Icon icon="mdi:code-braces" width="22" color="#C99726" />
                    <strong style={{ fontSize: '15px', color: '#0A1128' }}>Full-Stack Software Development</strong>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Building complete digital solutions, from intuitive user interfaces to powerful backend systems, databases, and application architectures.
                  </p>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Icon icon="mdi:chart-bar" width="22" color="#C99726" />
                    <strong style={{ fontSize: '15px', color: '#0A1128' }}>Data Science and Analytics</strong>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Transforming raw data into meaningful insights that support innovation, strategic planning, and informed decision-making.
                  </p>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Icon icon="mdi:shield-lock" width="22" color="#C99726" />
                    <strong style={{ fontSize: '15px', color: '#0A1128' }}>Cybersecurity & Protection</strong>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Understanding digital security, information protection, risk management, and the importance of building secure technological environments.
                  </p>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Icon icon="mdi:bullhorn" width="22" color="#C99726" />
                    <strong style={{ fontSize: '15px', color: '#0A1128' }}>Digital Marketing & Strategy</strong>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Leveraging digital platforms, online branding, search visibility, and digital strategies to help businesses grow in an increasingly connected world.
                  </p>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Icon icon="mdi:clipboard-check" width="22" color="#C99726" />
                    <strong style={{ fontSize: '15px', color: '#0A1128' }}>Project Management</strong>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Applying project planning, coordination, leadership, and execution principles to turn ideas into structured and achievable projects.
                  </p>
                </div>
              </div>

              <div style={{
                marginTop: '16px',
                padding: '12px 18px',
                background: '#F1F5F9',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Icon icon="mdi:school" width="18" color="#C99726" />
                <span>Professional development enriched through learning institutions including <strong>Saiket Systems</strong>, <strong>Coursera</strong>, and the <strong>Project Management Institute (PMI)</strong>.</span>
              </div>
            </div>

            {/* The Birth of Code Weave Planet */}
            <div>
              <h4 style={{ fontSize: '22px', fontWeight: 800, color: '#0A1128', marginBottom: '12px', fontFamily: "'Space Grotesk', sans-serif" }}>
                The Birth of Code Weave Planet
              </h4>
              <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7, marginBottom: '14px' }}>
                Code Weave Planet represents Polly's vision of a new generation of technology education and innovation.
              </p>
              <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7, marginBottom: '14px' }}>
                The initiative is founded on the understanding that the digital world is changing rapidly, and traditional approaches to learning technology must evolve alongside it.
              </p>
              <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7, marginBottom: '16px' }}>
                Code Weave Planet seeks to create an environment where technology enthusiasts, students, aspiring developers, entrepreneurs, and professionals can explore emerging technologies, develop practical skills, and build solutions that matter.
              </p>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#0A1128', marginBottom: '12px' }}>
                Its focus is on connecting computer science education with real-world implementation through:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '12px',
                marginBottom: '16px'
              }}>
                {[
                  'Practical programming and software development.',
                  'Artificial intelligence and machine learning innovation.',
                  'Web and mobile application development.',
                  'Data science and intelligent analytics.',
                  'Cybersecurity awareness and digital protection.',
                  'Digital entrepreneurship and business transformation.',
                  'Technology research, innovation, and project development.'
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    background: '#F8FAFC',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                    color: '#334155',
                    lineHeight: 1.5
                  }}>
                    <Icon icon="mdi:check-decagram" width="18" color="#C99726" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7, margin: 0, fontStyle: 'italic', background: 'rgba(201, 151, 38, 0.08)', padding: '14px 18px', borderRadius: '8px', borderLeft: '3px solid #C99726' }}>
                The ultimate ambition is to nurture a generation of creators, innovators, and problem-solvers who can compete globally while developing solutions that respond to local and international challenges.
              </p>
            </div>

            {/* Beyond Coding: Building Solutions That Matter */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '26px'
            }}>
              <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0A1128', marginBottom: '12px', fontFamily: "'Space Grotesk', sans-serif" }}>
                Beyond Coding: Building Solutions That Matter
              </h4>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
                For Polly, being a computer scientist means more than mastering programming languages or understanding technical concepts. It means having the ability to look at a challenge and imagine how technology can provide a better solution.
              </p>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
                He is particularly interested in the intersection of artificial intelligence, software engineering, business innovation, and digital transformation.
              </p>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
                His long-term ambition is to contribute to the development of intelligent digital ecosystems that support businesses, improve service delivery, create employment opportunities, and expand access to technology education.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.7, margin: 0, fontWeight: 600, color: '#0A1128' }}>
                He believes that Africa has enormous untapped technological potential and that empowering young people with practical digital skills is one of the most important investments in the continent's future.
              </p>
            </div>

            {/* The Philosophy: Learn. Build. Innovate. Transform. */}
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#C99726', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Core Four Principles
                </span>
                <h4 style={{ fontSize: '24px', fontWeight: 800, color: '#0A1128', margin: '4px 0 0 0', fontFamily: "'Space Grotesk', sans-serif" }}>
                  The Philosophy: Learn. Build. Innovate. Transform.
                </h4>
                <p style={{ fontSize: '14px', color: '#64748B', marginTop: '6px' }}>
                  Polly's philosophy is centred on four fundamental principles:
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px'
              }}>
                <div style={{ background: '#FFFFFF', border: '1.5px solid #C99726', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 14px rgba(201, 151, 38, 0.1)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#C99726', marginBottom: '6px' }}>LEARN</div>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Continuously explore emerging technologies and develop the knowledge required to remain relevant in a rapidly changing digital world.
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #0A1128', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 14px rgba(10, 17, 40, 0.08)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0A1128', marginBottom: '6px' }}>BUILD</div>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Convert knowledge and creative ideas into practical applications, software systems, and technological products.
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #C99726', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 14px rgba(201, 151, 38, 0.1)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#C99726', marginBottom: '6px' }}>INNOVATE</div>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Challenge conventional thinking, experiment with new possibilities, and discover better ways of solving existing problems.
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #0A1128', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 14px rgba(10, 17, 40, 0.08)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0A1128', marginBottom: '6px' }}>TRANSFORM</div>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Apply technology to create measurable value for businesses, individuals, institutions, and communities.
                  </p>
                </div>
              </div>
            </div>

            {/* The Road Ahead & Final Signature Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #0A1128 0%, #172554 100%)',
              borderRadius: '16px',
              padding: '36px 28px',
              color: '#FFFFFF',
              boxShadow: '0 12px 30px rgba(10, 17, 40, 0.25)',
              border: '2px solid #C99726',
              textAlign: 'center'
            }}>
              <h4 style={{ fontSize: '22px', fontWeight: 800, color: '#FFD700', marginBottom: '14px', fontFamily: "'Space Grotesk', sans-serif" }}>
                The Road Ahead
              </h4>
              <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.7, maxWidth: '820px', margin: '0 auto 14px auto' }}>
                Through Code Weave Planet, Polly Byabazaire envisions building more than a technology learning hub. He envisions a platform that inspires innovation, develops technological talent, supports digital entrepreneurship, and contributes to the next generation of African technology solutions.
              </p>
              <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.7, maxWidth: '820px', margin: '0 auto 14px auto' }}>
                His ambition is to see a world where young people are not merely searching for jobs in the technology industry but are equipped to create technology companies, develop innovative products, solve community challenges, and participate meaningfully in the global digital economy.
              </p>
              <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.7, maxWidth: '820px', margin: '0 auto 14px auto' }}>
                He represents a growing generation of African technology innovators who believe that world-changing ideas can emerge from anywhere and that the right knowledge, determination, and technological tools can turn those ideas into reality.
              </p>
              <p style={{ fontSize: '15.5px', color: '#FFD700', fontWeight: 600, lineHeight: 1.7, maxWidth: '820px', margin: '0 auto 24px auto' }}>
                His mission is clear: to weave knowledge, creativity, and technology together to build a smarter, more innovative, and digitally empowered world.
              </p>

              <div style={{
                background: 'rgba(201, 151, 38, 0.15)',
                border: '1px solid rgba(201, 151, 38, 0.4)',
                borderRadius: '12px',
                padding: '20px',
                maxWidth: '750px',
                margin: '0 auto',
                fontStyle: 'italic',
                fontSize: '16px',
                color: '#FFFDF0',
                lineHeight: 1.6
              }}>
                “The future of technology should not only be imagined by a few; it should be created by everyone with the courage to learn, the vision to innovate, and the determination to build.”
              </div>

              <div style={{ marginTop: '22px' }}>
                <div style={{ fontSize: '19px', fontWeight: 800, color: '#FFD700', letterSpacing: '0.05em' }}>
                  POLLY BYABAZAIRE
                </div>
                <div style={{ fontSize: '14px', color: '#94A3B8', marginTop: '2px' }}>
                  Founder – Code Weave Planet
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#C99726', marginTop: '10px', letterSpacing: '0.04em' }}>
                  CODE WEAVE PLANET — Where Knowledge Meets Innovation, and Ideas Become Technology.
                </div>
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
