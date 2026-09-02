import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Cpu,
  LayoutTemplate,
  Server,
  Megaphone,
  CloudCog,
  Smartphone,
  MonitorSmartphone,
  MessageCircle,
  Phone,
  ArrowUpRight,
  ShieldCheck,
  UserCog,
  Users,
  LogIn,
  Video,
  Film,
  Search,
  Clock,
  DollarSign,
  BookOpen,
  Award,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import cwLogo from "../../public/images/Cwlogo.png";

// Import Iconify
import { Icon } from '@iconify/react';

const COURSES = [
  {
    icon: 'mdi:robot',
    name: "AI and Machine Learning",
    blurb: "Build models that actually ship — from data cleaning to a working prediction API.",
    description: "Master artificial intelligence and machine learning using modern tools like TensorFlow, PyTorch, and Scikit-learn. Learn to build, train, and deploy AI models for real-world applications.",
    duration: "12 weeks",
    level: "Intermediate to Advanced",
    skills: ["Python", "TensorFlow", "Neural Networks", "Data Science", "Model Deployment"],
    price: "800,000 UGX"
  },
  {
    icon: 'vscode-icons:file-type-vite',
    name: "Web Design with Vite.js",
    blurb: "Fast, modern front ends. Component-driven builds you can deploy the same week you learn them.",
    description: "Create lightning-fast, responsive websites using Vite.js, React, and modern CSS frameworks. Build production-ready web applications with optimal performance.",
    duration: "8 weeks",
    level: "Beginner to Intermediate",
    skills: ["React", "Vite", "JavaScript", "CSS3", "Responsive Design"],
    price: "600,000 UGX"
  },
  {
    icon: 'logos:laravel',
    name: "System Development with PHP Laravel",
    blurb: "Backend systems that hold up in production: auth, databases, APIs, admin dashboards.",
    description: "Build robust backend systems using Laravel framework. Master REST APIs, authentication, database design, and create powerful admin panels for modern web applications.",
    duration: "10 weeks",
    level: "Intermediate",
    skills: ["PHP", "Laravel", "MySQL", "REST APIs", "Authentication", "MVC"],
    price: "700,000 UGX"
  },
  {
    icon: 'carbon:analytics',
    name: "Digital Marketing",
    blurb: "SEO, paid ads, and content strategy for businesses trying to be found online.",
    description: "Master modern marketing tools including Google Ads, Facebook Ads Manager, SEO optimization, content marketing, social media strategy, and analytics using cutting-edge platforms.",
    duration: "6 weeks",
    level: "Beginner to Intermediate",
    skills: ["SEO", "Google Ads", "Social Media Marketing", "Content Strategy", "Analytics"],
    price: "500,000 UGX"
  },
  {
    icon: 'mdi:cloud-upload',
    name: "Hosting Services",
    blurb: "Deploying and maintaining live sites — domains, servers, uptime, and security basics.",
    description: "Learn to deploy and manage web applications on cloud platforms like AWS, Vercel, Netlify, and DigitalOcean. Master DNS, SSL certificates, and server management.",
    duration: "4 weeks",
    level: "Beginner to Intermediate",
    skills: ["Cloud Computing", "AWS", "Server Management", "DNS", "SSL/TLS"],
    price: "400,000 UGX"
  },
  {
    icon: 'logos:react',
    name: "Mobile App Development",
    blurb: "React Native and Flutter — one skill set, apps on both Android and iOS.",
    description: "Build cross-platform mobile applications using React Native and Flutter. Deploy apps to both iOS and Android from a single codebase with native performance.",
    duration: "14 weeks",
    level: "Intermediate to Advanced",
    skills: ["React Native", "Flutter", "Mobile UI/UX", "API Integration", "App Store Deployment"],
    price: "900,000 UGX"
  },
  {
    icon: 'vscode-icons:file-type-electron',
    name: "Desktop Applications",
    blurb: "Software that runs natively on Windows and beyond, built for real offline use.",
    description: "Create powerful desktop applications using Electron, .NET, and modern frameworks. Build cross-platform software for Windows, macOS, and Linux.",
    duration: "10 weeks",
    level: "Intermediate to Advanced",
    skills: ["Electron", "C#", ".NET", "Desktop UI", "System Integration"],
    price: "750,000 UGX"
  },
  {
    icon: 'mdi:video-vintage',
    name: "Video Editing",
    blurb: "Master professional video editing with industry-standard tools and modern techniques.",
    description: "Learn professional video editing using Adobe Premiere Pro, Final Cut Pro, and DaVinci Resolve. Master color grading, audio editing, effects, and export for various platforms.",
    duration: "8 weeks",
    level: "Beginner to Intermediate",
    skills: ["Premiere Pro", "Final Cut Pro", "Color Grading", "Audio Editing", "Motion Graphics"],
    price: "550,000 UGX"
  },
  {
    icon: 'streamline:ai-technology-spark',
    name: "New Video Editing Tools",
    blurb: "Learn cutting-edge video editing software, AI-powered tools, and content creation for social media.",
    description: "Master modern AI-powered video editing tools like CapCut, Runway ML, and Adobe Firefly. Create viral content for TikTok, Instagram Reels, YouTube Shorts, and more.",
    duration: "6 weeks",
    level: "Beginner to Intermediate",
    skills: ["CapCut", "AI Video Tools", "Social Media Content", "Short-Form Video", "Viral Marketing"],
    price: "500,000 UGX"
  },
];

const ROLES = [
  {
    icon: UserCog,
    title: "Admin",
    text: "Runs the whole platform — approves tutors, manages every course page, and moderates everything that gets posted.",
  },
  {
    icon: ShieldCheck,
    title: "Tutors",
    text: "Own their course content — post detailed lessons, resource links, and their WhatsApp class group.",
  },
  {
    icon: Users,
    title: "Students",
    text: "Browse courses, follow tutor links, join WhatsApp groups for live sessions, and reach the team directly.",
  },
];

const WHATSAPP_NUMBER = "0750937506";
const WHATSAPP_GROUP = "Tech Over Ten with Polly";

export default function CodeWeavePlanetLanding() {
  const [threadsDrawn, setThreadsDrawn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(COURSES);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const heroImages = [
    "/images/codew.png",
    "/images/codew1.png",
    "/images/CD1.png"
  ];

  useEffect(() => {
    const t = setTimeout(() => setThreadsDrawn(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Hero image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Digital clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(COURSES);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = COURSES.filter(course => 
        course.name.toLowerCase().includes(query) ||
        course.blurb.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.skills.some(skill => skill.toLowerCase().includes(query)) ||
        course.level.toLowerCase().includes(query)
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery]);

  const openCourseModal = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const closeCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <img src={cwLogo} alt="Code Weave Planet" style={styles.logoImage} />
            <span style={styles.logoText}>Code Weave Planet</span>
          </div>
          <nav style={styles.nav}>
            <a href="#courses" style={styles.navLink}>Courses</a>
            <a href="#how" style={styles.navLink}>How it works</a>
            <Link to="/about" style={styles.navLink}>About</Link>
            <a href="#contact" style={styles.navLink}>Contact</a>
          </nav>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/login" style={styles.headerLogin}>
              <LogIn size={15} />
              Login
            </Link>
            <a
              href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`}
              style={styles.headerCta}
            >
              <MessageCircle size={15} />
              WhatsApp us
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section with Image Slider */}
      <section style={styles.heroSection}>
        <div style={styles.heroSlider}>
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              style={{
                ...styles.heroSlide,
                opacity: idx === currentSlide ? 1 : 0,
                transform: idx === currentSlide ? 'scale(1)' : 'scale(1.1)',
              }}
            >
              <img src={img} alt={`Hero ${idx + 1}`} style={styles.heroImage} />
              <div style={styles.heroOverlay}>
                <img src={cwLogo} alt="Code Weave Planet" style={styles.heroLogo} />
              </div>
            </div>
          ))}
          <div style={styles.sliderDots}>
            {heroImages.map((_, idx) => (
              <span
                key={idx}
                style={{
                  ...styles.dot,
                  background: idx === currentSlide ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                  width: idx === currentSlide ? '32px' : '8px',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroGrid}>
          <div>
            <p style={styles.heroKicker}>Digital skills training, from Mbarara to anywhere</p>
            <h1 style={styles.heroHeadline}>
              Skills woven into careers you can start this year.
            </h1>
            <p style={styles.heroSub}>
              Code Weave Planet trains developers, designers, and marketers through
              courses taught by working tutors — with real projects, live WhatsApp
              classes, and a straight line from lesson to job.
            </p>
            <div style={styles.heroActions}>
              <a href="#courses" style={styles.primaryBtn}>Browse courses</a>
              <a
                href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`}
                style={styles.secondaryBtn}
              >
                <Phone size={15} />
                Call or WhatsApp {WHATSAPP_NUMBER}
              </a>
            </div>
            <p style={styles.heroFootnote}>
              Live classes run in the <strong style={{ color: "#D4AF37", fontWeight: 500 }}>{WHATSAPP_GROUP}</strong> WhatsApp group and other tutor-led groups.
            </p>
          </div>

          <div style={styles.heroArt}>
            <svg viewBox="0 0 360 360" width="100%" height="100%">
              <defs>
                <clipPath id="frame"><rect x="0" y="0" width="360" height="360" rx="18" /></clipPath>
              </defs>
              <g clipPath="url(#frame)">
                <rect width="360" height="360" fill="#F5F5F5" />
                {Array.from({ length: 5 }).map((_, row) => {
                  const y = 40 + row * 68;
                  const cyan = row % 2 === 0;
                  return (
                    <path
                      key={row}
                      d={`M -20 ${y} C 70 ${y - 34}, 110 ${y + 34}, 180 ${y} S 290 ${y - 34}, 380 ${y}`}
                      fill="none"
                      stroke={cyan ? "#22D3EE" : "#D4AF37"}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      opacity={cyan ? 0.75 : 0.55}
                      style={{
                        strokeDasharray: 900,
                        strokeDashoffset: threadsDrawn ? 0 : 900,
                        transition: `stroke-dashoffset 1.6s cubic-bezier(.2,.7,.3,1) ${row * 0.12}s`,
                      }}
                    />
                  );
                })}
                {[
                  [80, 108], [230, 176], [130, 244], [280, 40], [55, 312],
                ].map(([cx, cy], i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill="#D4AF37"
                    opacity={threadsDrawn ? 0.9 : 0}
                    style={{ transition: `opacity .5s ease ${1 + i * 0.15}s` }}
                  />
                ))}
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" style={styles.section}>
        <h2 style={styles.sectionHeadline}>What you can learn here</h2>
        <p style={styles.sectionSub}>
          Every course is run by a tutor who posts the full syllabus, resource links,
          and class schedule directly on their course page.
        </p>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchBar}>
            <Search size={20} color="#D4AF37" />
            <input
              type="text"
              placeholder="Search for courses, skills, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p style={styles.searchResults}>
              Found {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            </p>
          )}
        </div>

        <div style={styles.courseGrid}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((c) => (
              <div key={c.name} style={styles.courseCard} onClick={() => openCourseModal(c)}>
                <Icon icon={c.icon} width="32" height="32" style={{ color: '#D4AF37' }} />
                <h3 style={styles.courseName}>{c.name}</h3>
                <p style={styles.courseBlurb}>{c.blurb}</p>
                <div style={styles.courseMetadata}>
                  <span style={styles.metaBadge}>
                    <Clock size={14} />
                    {c.duration}
                  </span>
                  <span style={styles.metaBadge}>
                    <Award size={14} />
                    {c.level}
                  </span>
                </div>
                <div style={styles.coursePrice}>{c.price}</div>
                <span style={styles.courseLink}>
                  View course details <ArrowUpRight size={13} />
                </span>
              </div>
            ))
          ) : (
            <div style={styles.noResults}>
              <Search size={48} color="#8B7355" />
              <p>No courses found matching "{searchQuery}"</p>
              <button onClick={() => setSearchQuery('')} style={styles.resetButton}>
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ ...styles.section, background: "#FFFFFF" }}>
        <h2 style={styles.sectionHeadline}>How the platform runs</h2>
        <p style={styles.sectionSub}>
          Three roles keep the content current and the classes accountable.
        </p>
        <div style={styles.roleGrid}>
          {ROLES.map((r) => (
            <div key={r.title} style={styles.roleCard}>
              <r.icon size={20} color="#D4AF37" strokeWidth={1.6} />
              <h3 style={styles.roleTitle}>{r.title}</h3>
              <p style={styles.roleText}>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / footer */}
      <section id="contact" style={styles.contact}>
        <div style={styles.contactInner}>
          <div>
            <h2 style={styles.sectionHeadline}>Ready to start?</h2>
            <p style={styles.sectionSub}>
              Reach the team directly — we'll point you to the right course and the
              right WhatsApp group.
            </p>
          </div>
          <div style={styles.contactActions}>
            <a href={`tel:+256${WHATSAPP_NUMBER.slice(1)}`} style={styles.primaryBtn}>
              <Phone size={15} />
              {WHATSAPP_NUMBER}
            </a>
            <a
              href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`}
              style={styles.secondaryBtn}
            >
              <MessageCircle size={15} />
              Message on WhatsApp
            </a>
          </div>
        </div>

        {/* Digital Clock and Map Section */}
        <div style={styles.preFooter}>
          <div style={styles.clockSection}>
            <div style={styles.digitalClock}>
              <div style={styles.clockTime}>{formatTime(currentTime)}</div>
              <div style={styles.clockDate}>{formatDate(currentTime)}</div>
            </div>
          </div>
          <div style={styles.mapSection}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127545.24696407558!2d30.578536!3d-0.597373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1761334d99f88849%3A0x5d5f7b2f8f7b2f8f!2sMbarara%2C%20Uganda!5e0!3m2!1sen!2sus!4v1234567890"
              style={styles.map}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mbarara Location"
            />
          </div>
        </div>

        {/* Footer with Social Media */}
        <div style={styles.footer}>
          <div style={styles.footerContent}>
            <div style={styles.footerSection}>
              <img src={cwLogo} alt="Code Weave Planet" style={styles.footerLogo} />
              <h3 style={styles.footerBrand}>Code Weave Planet</h3>
              <p style={styles.footerTagline}>Weaving Skills into Careers</p>
              <p style={styles.footerAboutText}>
                Discover our full story, mission, and everything about Code Weave Planet on our dedicated About Us page.
              </p>
              <Link to="/about" style={styles.aboutLink}>
                Visit About Us Page →
              </Link>
            </div>

            <div style={styles.footerSection}>
              <h4 style={styles.footerHeading}>Connect With Us</h4>
              <div style={styles.socialLinks}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="Facebook">
                  <Icon icon="mdi:facebook" width="20" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="Twitter/X">
                  <Icon icon="mdi:twitter" width="20" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="Instagram">
                  <Icon icon="mdi:instagram" width="20" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="LinkedIn">
                  <Icon icon="mdi:linkedin" width="20" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="YouTube">
                  <Icon icon="mdi:youtube" width="20" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="TikTok">
                  <Icon icon="ic:baseline-tiktok" width="20" />
                </a>
                <a href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="WhatsApp">
                  <Icon icon="mdi:whatsapp" width="20" />
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="Telegram">
                  <Icon icon="mdi:telegram" width="20" />
                </a>
              </div>
            </div>

            <div style={styles.footerSection}>
              <h4 style={styles.footerHeading}>Quick Links</h4>
              <div style={styles.footerLinks}>
                <a href="#courses" style={styles.footerLink}>Courses</a>
                <a href="#how" style={styles.footerLink}>How it Works</a>
                <a href="#contact" style={styles.footerLink}>Contact</a>
                <Link to="/login" style={styles.footerLink}>Login</Link>
                <Link to="/register" style={styles.footerLink}>Register</Link>
              </div>
            </div>

            <div style={styles.footerSection}>
              <h4 style={styles.footerHeading}>Contact Info</h4>
              <div style={styles.contactInfo}>
                <p style={styles.contactItem}>
                  <Phone size={16} style={{ marginRight: 8 }} />
                  {WHATSAPP_NUMBER}
                </p>
                <p style={styles.contactItem}>
                  <MessageCircle size={16} style={{ marginRight: 8 }} />
                  WhatsApp Available
                </p>
                <p style={styles.contactItem}>Mbarara, Western Uganda</p>
              </div>
            </div>
          </div>

          <div style={styles.footerBar}>
            <span>© {new Date().getFullYear()} Code Weave Planet. All rights reserved.</span>
            <span>Revolutionising Tech Education</span>
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      {showCourseModal && selectedCourse && (
        <div style={styles.modalOverlay} onClick={closeCourseModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <Icon icon={selectedCourse.icon} width="40" height="40" style={{ color: '#D4AF37' }} />
                <h2 style={styles.modalTitle}>{selectedCourse.name}</h2>
              </div>
              <button style={styles.closeButton} onClick={closeCourseModal}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <p style={styles.courseDescription}>{selectedCourse.description}</p>
              
              <div style={styles.modalGrid}>
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>
                    <Clock size={18} />
                    Duration
                  </h3>
                  <p style={styles.modalText}>{selectedCourse.duration}</p>
                </div>
                
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>
                    <Award size={18} />
                    Level
                  </h3>
                  <p style={styles.modalText}>{selectedCourse.level}</p>
                </div>
                
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>
                    <DollarSign size={18} />
                    Course Fee
                  </h3>
                  <p style={styles.modalPrice}>{selectedCourse.price}</p>
                </div>
              </div>
              
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>
                  <BookOpen size={18} />
                  Skills You'll Learn
                </h3>
                <div style={styles.skillsGrid}>
                  {selectedCourse.skills.map((skill, idx) => (
                    <span key={idx} style={styles.skillBadge}>
                      <Sparkles size={14} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={styles.modalActions}>
                <Link to="/register" style={styles.modalEnrollButton}>
                  <TrendingUp size={18} />
                  Enroll Now
                </Link>
                <a href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`} style={styles.modalWhatsAppButton}>
                  <MessageCircle size={18} />
                  Ask Questions
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(180deg, #FFFFFF 0%, #F9F8F6 50%, #FFF9E6 100%)",
    color: "#2C1810",
    fontFamily: "'Inter', system-ui, sans-serif",
    minHeight: "100vh",
  },
  header: {
    borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
    position: "sticky",
    top: 0,
    background: "linear-gradient(135deg, #F5F5DC 0%, #FFF8E7 50%, #FFFAF0 100%)",
    backdropFilter: "blur(12px)",
    zIndex: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  headerInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoImage: {
    width: 80,
    height: 80,
    objectFit: "contain",
    animation: "fadeInScale 1.2s ease-in-out",
  },
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: 16,
    letterSpacing: "-0.01em",
    background: "linear-gradient(135deg, #D4AF37 0%, #8B7355 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  nav: { display: "flex", gap: 28 },
  navLink: {
    color: "#5C4B3A",
    textDecoration: "none",
    fontSize: 14,
    transition: "color 0.3s ease",
    fontWeight: 500,
  },
  headerCta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "transparent",
    border: "1px solid rgba(139, 115, 85, 0.4)",
    color: "#5C4B3A",
    padding: "8px 14px",
    borderRadius: 6,
    fontSize: 13.5,
    textDecoration: "none",
    fontWeight: 500,
    transition: "all 0.3s ease",
  },
  headerLogin: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)",
    color: "#2C1810",
    padding: "8px 14px",
    borderRadius: 6,
    fontSize: 13.5,
    textDecoration: "none",
    fontWeight: 600,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
  },
  heroSection: {
    position: "relative",
    width: "100%",
    height: "500px",
    overflow: "hidden",
    marginBottom: 40,
  },
  heroSlider: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  heroSlide: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transition: "opacity 2s ease-in-out, transform 2s ease-in-out",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  heroOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 2,
    animation: "pulse 3s ease-in-out infinite",
  },
  heroLogo: {
    width: 150,
    height: 150,
    objectFit: "contain",
    filter: "drop-shadow(0 8px 24px rgba(212,175,55,0.6))",
  },
  sliderDots: {
    position: "absolute",
    bottom: 30,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 10,
    zIndex: 3,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: "all 0.5s ease",
    cursor: "pointer",
  },
  hero: { maxWidth: 1100, margin: "0 auto", padding: "72px 24px 88px" },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 56,
    alignItems: "center",
  },
  heroKicker: { color: "#D4AF37", fontSize: 14.5, marginBottom: 14, fontWeight: 500 },
  heroHeadline: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 44,
    lineHeight: 1.12,
    fontWeight: 600,
    letterSpacing: "-0.015em",
    margin: "0 0 20px",
    maxWidth: 560,
    color: "#2C1810",
  },
  heroSub: {
    color: "#5C4B3A",
    fontSize: 16.5,
    lineHeight: 1.6,
    maxWidth: 480,
    margin: "0 0 32px",
  },
  heroActions: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 },
  primaryBtn: {
    background: "linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)",
    color: "#0A0F1E",
    padding: "12px 22px",
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 14.5,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
  },
  secondaryBtn: {
    border: "1px solid rgba(212,175,55,0.5)",
    color: "#D4AF37",
    padding: "12px 22px",
    borderRadius: 6,
    fontWeight: 500,
    fontSize: 14.5,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.3s ease",
  },
  heroFootnote: { color: "#5C4B3A", fontSize: 13.5 },
  heroArt: {
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(212,175,55,0.2)",
  },
  section: { maxWidth: 1100, margin: "0 auto", padding: "72px 24px" },
  sectionHeadline: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 28,
    fontWeight: 600,
    margin: "0 0 10px",
    letterSpacing: "-0.01em",
    color: "#2C1810",
  },
  sectionSub: { color: "#5C4B3A", fontSize: 15.5, maxWidth: 540, marginBottom: 40 },
  searchContainer: {
    marginBottom: 32,
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#FFFFFF",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: 10,
    padding: "12px 16px",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 15,
    background: "transparent",
    color: "#2C1810",
  },
  clearButton: {
    background: "none",
    border: "none",
    color: "#D4AF37",
    cursor: "pointer",
    fontSize: 18,
    padding: "0 8px",
  },
  searchResults: {
    color: "#5C4B3A",
    fontSize: 13,
    margin: 0,
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 18,
  },
  courseCard: {
    background: "#FFFFFF",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: 12,
    padding: "22px 20px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    color: "#2C1810",
  },
  courseName: {
    fontSize: 16.5,
    fontWeight: 500,
    margin: "14px 0 8px",
    fontFamily: "'Space Grotesk', sans-serif",
    color: "#2C1810",
  },
  courseBlurb: { color: "#5C4B3A", fontSize: 14, lineHeight: 1.55, marginBottom: 16 },
  courseMetadata: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  metaBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    color: "#5C4B3A",
    background: "rgba(212,175,55,0.1)",
    padding: "4px 8px",
    borderRadius: 4,
  },
  coursePrice: {
    fontSize: 14,
    fontWeight: 600,
    color: "#D4AF37",
    marginBottom: 8,
  },
  courseLink: {
    color: "#D4AF37",
    fontSize: 13.5,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontWeight: 500,
  },
  noResults: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px 20px",
    color: "#5C4B3A",
  },
  resetButton: {
    background: "linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)",
    color: "#0A0F1E",
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 16,
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
  },
  roleCard: {
    background: "#FFFFFF",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: 12,
    padding: "24px 22px",
    transition: "all 0.3s ease",
    color: "#2C1810",
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: 500,
    margin: "14px 0 8px",
    fontFamily: "'Space Grotesk', sans-serif",
    color: "#2C1810",
  },
  roleText: { color: "#5C4B3A", fontSize: 14, lineHeight: 1.6 },
  contact: { borderTop: "1px solid rgba(212,175,55,0.2)", background: "#FFFFFF" },
  contactInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "64px 24px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 32,
    flexWrap: "wrap",
  },
  contactActions: { display: "flex", gap: 14, flexWrap: "wrap" },
  preFooter: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 24px",
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 32,
    alignItems: "start",
  },
  clockSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  digitalClock: {
    background: "#FFFFFF",
    border: "2px solid rgba(212,175,55,0.3)",
    borderRadius: 16,
    padding: "24px 32px",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(212,175,55,0.15)",
  },
  clockTime: {
    fontSize: 36,
    fontWeight: 700,
    color: "#D4AF37",
    fontFamily: "'Space Grotesk', monospace",
    letterSpacing: "0.05em",
    marginBottom: 8,
    textShadow: "0 0 20px rgba(212,175,55,0.3)",
  },
  clockDate: {
    fontSize: 14,
    color: "#5C4B3A",
    fontWeight: 400,
  },
  mapSection: {
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(212,175,55,0.2)",
    boxShadow: "0 8px 24px rgba(212,175,55,0.1)",
  },
  map: {
    width: "100%",
    height: 300,
    border: "none",
  },
  footer: {
    borderTop: "1px solid rgba(212, 175, 55, 0.3)",
    background: "linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)",
  },
  footerContent: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "48px 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 32,
  },
  footerSection: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  footerLogo: {
    width: 50,
    height: 50,
    objectFit: "contain",
    marginBottom: 8,
  },
  footerBrand: {
    fontSize: 18,
    fontWeight: 600,
    color: "#2C1810",
    fontFamily: "'Space Grotesk', sans-serif",
    margin: 0,
  },
  footerTagline: {
    fontSize: 13,
    color: "#2C1810",
    margin: 0,
    opacity: 0.9,
  },
  aboutSection: {
    marginTop: 12,
  },
  aboutHeading: {
    fontSize: 14,
    fontWeight: 600,
    color: "#2C1810",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 13,
    color: "#2C1810",
    lineHeight: 1.5,
    marginBottom: 8,
  },
  footerAboutText: {
    fontSize: 13,
    color: "#2C1810",
    lineHeight: 1.5,
    marginBottom: 12,
  },
  aboutLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    color: "#D4AF37",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 13,
    transition: "all 0.3s ease",
  },
  techBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  techBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    color: "#2C1810",
    background: "rgba(44, 24, 16, 0.1)",
    padding: "4px 8px",
    borderRadius: 4,
  },
  footerHeading: {
    fontSize: 16,
    fontWeight: 600,
    color: "#2C1810",
    marginBottom: 8,
  },
  socialLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    background: "rgba(44, 24, 16, 0.15)",
    border: "1px solid rgba(44, 24, 16, 0.3)",
    borderRadius: 8,
    color: "#2C1810",
    textDecoration: "none",
    transition: "all 0.3s ease",
  },
  footerLinks: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  footerLink: {
    color: "#2C1810",
    textDecoration: "none",
    fontSize: 14,
    transition: "color 0.3s ease",
    fontWeight: 500,
  },
  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    color: "#2C1810",
    fontSize: 14,
    margin: 0,
    fontWeight: 500,
  },
  footerBar: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "20px 24px",
    borderTop: "2px solid rgba(44, 24, 16, 0.2)",
    display: "flex",
    justifyContent: "space-between",
    color: "#2C1810",
    fontSize: 13,
    flexWrap: "wrap",
    gap: 16,
    fontWeight: 500,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#FFFFFF",
    borderRadius: 16,
    maxWidth: 600,
    maxHeight: "85vh",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "24px",
    borderBottom: "1px solid rgba(212,175,55,0.2)",
    background: "#FFFFFF",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 600,
    margin: "8px 0 0",
    color: "#2C1810",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    color: "#2C1810",
    padding: "0",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    padding: "24px",
    color: "#2C1810",
  },
  courseDescription: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#5C4B3A",
    marginBottom: 24,
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  modalSection: {
    padding: "16px",
    background: "rgba(212,175,55,0.05)",
    borderRadius: 8,
    border: "1px solid rgba(212,175,55,0.1)",
  },
  modalSectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    margin: "0 0 8px",
    color: "#2C1810",
  },
  modalText: {
    fontSize: 14,
    color: "#5C4B3A",
    margin: 0,
  },
  modalPrice: {
    fontSize: 16,
    fontWeight: 600,
    color: "#D4AF37",
    margin: 0,
  },
  skillsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(212,175,55,0.1)",
    color: "#2C1810",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
  },
  modalActions: {
    display: "flex",
    gap: 12,
    marginTop: 24,
  },
  modalEnrollButton: {
    flex: 1,
    background: "linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)",
    color: "#0A0F1E",
    padding: "12px 16px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.3s ease",
  },
  modalWhatsAppButton: {
    flex: 1,
    background: "transparent",
    border: "1px solid rgba(212,175,55,0.5)",
    color: "#D4AF37",
    padding: "12px 16px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.3s ease",
  },
};

const css = `
  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.05);
    }
  }

  .courseCard:hover {
    transform: translateY(-4px);
    border-color: rgba(212,175,55,0.4);
    box-shadow: 0 8px 24px rgba(212,175,55,0.15);
  }

  .roleCard:hover {
    transform: translateY(-2px);
    border-color: rgba(212,175,55,0.3);
  }

  .socialLink:hover {
    background: rgba(212,175,55,0.2);
    border-color: rgba(212,175,55,0.5);
    transform: translateY(-2px);
  }

  .footerLink:hover {
    color: #5C4B3A;
  }

  .navLink:hover {
    color: #D4AF37;
  }

  .headerCta:hover {
    background: rgba(212, 175, 55, 0.1);
    border-color: rgba(212, 175, 55, 0.6);
    color: #D4AF37;
  }

  .headerLogin:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(212,175,55,0.4);
  }

  .primaryBtn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212,175,55,0.4);
  }

  .secondaryBtn:hover {
    background: rgba(212,175,55,0.1);
    border-color: rgba(212,175,55,0.7);
  }

  .modalEnrollButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212,175,55,0.4);
  }

  .modalWhatsAppButton:hover {
    background: rgba(212,175,55,0.1);
    border-color: rgba(212,175,55,0.7);
  }

  @media (max-width: 820px) {
    nav { display: none !important; }
  }

  @media (max-width: 768px) {
    .preFooter {
      grid-template-columns: 1fr !important;
    }
    .heroSection {
      height: 350px !important;
    }
    .heroLogo {
      width: 100px !important;
      height: 100px !important;
    }
    .clockTime {
      font-size: 28px !important;
    }
    .modalGrid {
      grid-template-columns: 1fr !important;
    }
  }
`;
