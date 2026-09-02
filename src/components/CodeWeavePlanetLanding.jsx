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
} from "lucide-react";
import cwLogo from "../../public/images/Cwlogo.png";

const COURSES = [
  {
    icon: Cpu,
    name: "AI and machine learning",
    blurb: "Build models that actually ship — from data cleaning to a working prediction API.",
  },
  {
    icon: LayoutTemplate,
    name: "Web design with Vite.js",
    blurb: "Fast, modern front ends. Component-driven builds you can deploy the same week you learn them.",
  },
  {
    icon: Server,
    name: "System development with PHP Laravel",
    blurb: "Backend systems that hold up in production: auth, databases, APIs, admin dashboards.",
  },
  {
    icon: Megaphone,
    name: "Digital marketing",
    blurb: "SEO, paid ads, and content strategy for businesses trying to be found online.",
  },
  {
    icon: CloudCog,
    name: "Hosting services",
    blurb: "Deploying and maintaining live sites — domains, servers, uptime, and security basics.",
  },
  {
    icon: Smartphone,
    name: "Mobile app development",
    blurb: "React Native and Flutter — one skill set, apps on both Android and iOS.",
  },
  {
    icon: MonitorSmartphone,
    name: "Desktop applications",
    blurb: "Software that runs natively on Windows and beyond, built for real offline use.",
  },
  {
    icon: Video,
    name: "Video Editing",
    blurb: "Master professional video editing with industry-standard tools and modern techniques.",
  },
  {
    icon: Film,
    name: "New Video Editing Tools",
    blurb: "Learn cutting-edge video editing software, AI-powered tools, and content creation for social media.",
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

  const heroImages = [
    "/images/CD1.jpg",
    "/images/CD2.jpg",
    "/images/CD3.jpg"
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
                <rect width="360" height="360" fill="#0E1526" />
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
        <div style={styles.courseGrid}>
          {COURSES.map((c) => (
            <div key={c.name} style={styles.courseCard}>
              <c.icon size={22} color="#22D3EE" strokeWidth={1.6} />
              <h3 style={styles.courseName}>{c.name}</h3>
              <p style={styles.courseBlurb}>{c.blurb}</p>
              <span style={styles.courseLink}>
                View course details <ArrowUpRight size={13} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ ...styles.section, background: "#0E1526" }}>
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
            </div>

            <div style={styles.footerSection}>
              <h4 style={styles.footerHeading}>Connect With Us</h4>
              <div style={styles.socialLinks}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="Facebook">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="Twitter/X">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="Instagram">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="LinkedIn">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="YouTube">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="TikTok">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="WhatsApp">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="Telegram">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
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
            <span>Weaving Digital Excellence</span>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    background: "#0A0F1E",
    color: "#EDEFF7",
    fontFamily: "'Inter', system-ui, sans-serif",
    minHeight: "100vh",
  },
  header: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    background: "rgba(10,15,30,0.95)",
    backdropFilter: "blur(12px)",
    zIndex: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
    width: 40,
    height: 40,
    objectFit: "contain",
    animation: "fadeInScale 1s ease-in-out",
  },
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: 16,
    letterSpacing: "-0.01em",
    background: "linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  nav: { display: "flex", gap: 28 },
  navLink: {
    color: "#8B96AC",
    textDecoration: "none",
    fontSize: 14,
    transition: "color 0.3s ease",
  },
  headerCta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "transparent",
    border: "1px solid rgba(34,211,238,0.4)",
    color: "#22D3EE",
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
    color: "#0A0F1E",
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
    background: "linear-gradient(135deg, #EDEFF7 0%, #D4AF37 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: {
    color: "#8B96AC",
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
  heroFootnote: { color: "#66708A", fontSize: 13.5 },
  heroArt: {
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  section: { maxWidth: 1100, margin: "0 auto", padding: "72px 24px" },
  sectionHeadline: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 28,
    fontWeight: 600,
    margin: "0 0 10px",
    letterSpacing: "-0.01em",
  },
  sectionSub: { color: "#8B96AC", fontSize: 15.5, maxWidth: 540, marginBottom: 40 },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 18,
  },
  courseCard: {
    background: "#121A2E",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "22px 20px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  courseName: {
    fontSize: 16.5,
    fontWeight: 500,
    margin: "14px 0 8px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  courseBlurb: { color: "#8B96AC", fontSize: 14, lineHeight: 1.55, marginBottom: 16 },
  courseLink: {
    color: "#22D3EE",
    fontSize: 13.5,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
  },
  roleCard: {
    background: "#0A0F1E",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "24px 22px",
    transition: "all 0.3s ease",
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: 500,
    margin: "14px 0 8px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  roleText: { color: "#8B96AC", fontSize: 14, lineHeight: 1.6 },
  contact: { borderTop: "1px solid rgba(255,255,255,0.08)" },
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
    background: "linear-gradient(135deg, #121A2E 0%, #0E1526 100%)",
    border: "2px solid rgba(212,175,55,0.3)",
    borderRadius: 16,
    padding: "24px 32px",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  clockTime: {
    fontSize: 36,
    fontWeight: 700,
    color: "#D4AF37",
    fontFamily: "'Space Grotesk', monospace",
    letterSpacing: "0.05em",
    marginBottom: 8,
    textShadow: "0 0 20px rgba(212,175,55,0.5)",
  },
  clockDate: {
    fontSize: 14,
    color: "#8B96AC",
    fontWeight: 400,
  },
  mapSection: {
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  map: {
    width: "100%",
    height: 300,
    border: "none",
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    background: "#0E1526",
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
    color: "#D4AF37",
    fontFamily: "'Space Grotesk', sans-serif",
    margin: 0,
  },
  footerTagline: {
    fontSize: 13,
    color: "#8B96AC",
    margin: 0,
  },
  footerHeading: {
    fontSize: 16,
    fontWeight: 600,
    color: "#EDEFF7",
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
    background: "rgba(212,175,55,0.1)",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: 8,
    color: "#D4AF37",
    textDecoration: "none",
    transition: "all 0.3s ease",
  },
  footerLinks: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  footerLink: {
    color: "#8B96AC",
    textDecoration: "none",
    fontSize: 14,
    transition: "color 0.3s ease",
  },
  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    color: "#8B96AC",
    fontSize: 14,
    margin: 0,
  },
  footerBar: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "20px 24px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    justifyContent: "space-between",
    color: "#66708A",
    fontSize: 13,
    flexWrap: "wrap",
    gap: 16,
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
    border-color: rgba(212,175,55,0.3);
    box-shadow: 0 8px 24px rgba(212,175,55,0.15);
  }

  .roleCard:hover {
    transform: translateY(-2px);
    border-color: rgba(212,175,55,0.2);
  }

  .socialLink:hover {
    background: rgba(212,175,55,0.2);
    border-color: rgba(212,175,55,0.5);
    transform: translateY(-2px);
  }

  .footerLink:hover {
    color: #D4AF37;
  }

  .navLink:hover {
    color: #D4AF37;
  }

  .headerCta:hover {
    background: rgba(34,211,238,0.1);
    border-color: rgba(34,211,238,0.6);
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
  }
`;
