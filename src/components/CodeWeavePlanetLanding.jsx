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
} from "lucide-react";

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

  useEffect(() => {
    const t = setTimeout(() => setThreadsDrawn(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="13" stroke="#22D3EE" strokeWidth="1.4" opacity="0.5" />
              <path d="M6 12c4 3 5 3 9 0s5-3 9 0" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <path d="M6 18c4-3 5-3 9 0s5 3 9 0" stroke="#22D3EE" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
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
        <div style={styles.footerBar}>
          <span>Code Weave Planet</span>
          <span>Mbarara, Western Uganda</span>
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
    background: "rgba(10,15,30,0.85)",
    backdropFilter: "blur(8px)",
    zIndex: 10,
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
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: 16,
    letterSpacing: "-0.01em",
  },
  nav: { display: "flex", gap: 28 },
  navLink: {
    color: "#8B96AC",
    textDecoration: "none",
    fontSize: 14,
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
  },
  headerLogin: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#22D3EE",
    color: "#0A0F1E",
    padding: "8px 14px",
    borderRadius: 6,
    fontSize: 13.5,
    textDecoration: "none",
    fontWeight: 600,
    transition: "all 0.2s",
  },
  hero: { maxWidth: 1100, margin: "0 auto", padding: "72px 24px 88px" },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 56,
    alignItems: "center",
  },
  heroKicker: { color: "#22D3EE", fontSize: 14.5, marginBottom: 14, fontWeight: 500 },
  heroHeadline: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 44,
    lineHeight: 1.12,
    fontWeight: 600,
    letterSpacing: "-0.015em",
    margin: "0 0 20px",
    maxWidth: 560,
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
    background: "#22D3EE",
    color: "#0A0F1E",
    padding: "12px 22px",
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 14.5,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
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
  footerBar: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "20px 24px 32px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    justifyContent: "space-between",
    color: "#66708A",
    fontSize: 13,
  },
};

const css = `
  @media (max-width: 820px) {
    nav { display: none !important; }
  }
`;
