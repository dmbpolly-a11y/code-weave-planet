import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';

// Initial pre-seeded inspirational student testimonials
const INITIAL_TESTIMONIALS = [
  {
    id: 'seed-1',
    name: 'Ronald Kato',
    role: 'AI & Machine Learning Graduate',
    course: 'AI & Machine Learning',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'From zero Python knowledge to building working prediction APIs',
    message: 'Code Weave Planet gave me the exact hands-on practical skills I needed. The tutors are deeply invested in your growth. Within 3 months of graduation, I secured a role as a junior ML developer.',
    outcome: 'Junior ML Engineer at DevSprout',
    date: '2026-10-18',
    likes: 24,
    verified: true
  },
  {
    id: 'seed-2',
    name: 'Sarah Tukundane',
    role: 'Frontend Engineering Student',
    course: 'Web Design with Vite.js',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'The component-driven approach and modern Vite stack is top-notch',
    message: 'Before joining Code Weave Planet, CSS felt impossible. The tutors broke down modern responsive design and Vite + React in a way that just clicked. I built my portfolio in week 4!',
    outcome: 'Freelance UI/Web Developer',
    date: '2026-10-24',
    likes: 19,
    verified: true
  },
  {
    id: 'seed-3',
    name: 'Ivan Mugisha',
    role: 'Backend Engineering Graduate',
    course: 'System Development with PHP Laravel',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Production-grade backend architectures and database design',
    message: 'The Laravel curriculum here does not just teach syntax; it teaches enterprise auth, RESTful APIs, and relational databases. Best practical training center in Western Uganda.',
    outcome: 'Backend Developer at NilePay FinTech',
    date: '2026-11-02',
    likes: 31,
    verified: true
  },
  {
    id: 'seed-4',
    name: 'Faith Ainomugisha',
    role: 'Mobile Applications Alumna',
    course: 'Mobile App Development',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Shipped my first cross-platform mobile app to Google Play Store',
    message: 'Learning React Native and Flutter here was an absolute game changer. The classroom vibe is supportive, hands-on, and focused on real shipping rather than memorizing slides.',
    outcome: 'Mobile App Creator & Tutor',
    date: '2026-11-08',
    likes: 27,
    verified: true
  },
  {
    id: 'seed-5',
    name: 'Brian Nuwagaba',
    role: 'Digital Marketing & Growth',
    course: 'Digital Marketing',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Scaled real business campaigns and mastered SEO analytics',
    message: 'The practical campaign budgets and live ad reviews gave me real client experience before I even finished the course. I now run growth marketing for multiple local enterprises.',
    outcome: 'Lead Growth Marketer at Mbarara Hub',
    date: '2026-11-10',
    likes: 14,
    verified: true
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [likesMap, setLikesMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Load custom user submissions from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('testimonials') || '[]');
      // Merge user submissions at the top, followed by seeds
      setTestimonials([...stored, ...INITIAL_TESTIMONIALS]);
    } catch {
      setTestimonials(INITIAL_TESTIMONIALS);
    }
  }, []);

  const handleLike = (id) => {
    setLikesMap(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const categories = ['All', 'AI & Machine Learning', 'Web Design with Vite.js', 'System Development with PHP Laravel', 'Mobile App Development', 'Digital Marketing'];

  const filteredList = activeFilter === 'All'
    ? testimonials
    : testimonials.filter(t => t.course === activeFilter || t.role?.includes(activeFilter));

  return (
    <div className="testimonials-page page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GlobalHeader />

      <main style={{ flex: 1, padding: '40px 20px 80px 20px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(201, 151, 38, 0.12)',
            border: '1px solid rgba(201, 151, 38, 0.35)',
            color: '#B45309',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '13.5px',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            <Icon icon="mdi:star-four-points" width="16" color="#C99726" />
            ★ 4.9/5 RATED BY 320+ EMPOWERED TECH STUDENTS
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            color: '#0A1128',
            fontFamily: "'Space Grotesk', sans-serif",
            margin: '0 0 14px 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Stories of Growth, Code & Transformation
          </h1>

          <p style={{
            maxWidth: '680px',
            margin: '0 auto 28px auto',
            fontSize: '16px',
            color: '#475569',
            lineHeight: 1.6
          }}>
            Read how students, developers, and entrepreneurs in Uganda and beyond pivoted into high-demand tech careers through Code Weave Planet.
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/portal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#C99726',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14.5px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(201, 151, 38, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon icon="mdi:pencil-box-multiple" width="20" />
              Post Your Story on Portal
            </Link>

            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                color: '#0A1128',
                border: '1.5px solid #0A1128',
                padding: '12px 22px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14.5px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon icon="mdi:school-outline" width="20" />
              Enroll in a Course
            </Link>
          </div>
        </div>

        {/* Filter Badges */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '32px',
          scrollbarWidth: 'none',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: activeFilter === cat ? '1.5px solid #C99726' : '1px solid #CBD5E1',
                background: activeFilter === cat ? '#0A1128' : 'rgba(255, 255, 255, 0.85)',
                color: activeFilter === cat ? '#FFD700' : '#475569',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Embedded Keyframes for Testimonial Animations */}
        <style>{`
          @keyframes testimonialEntrance {
            from {
              opacity: 0;
              transform: translateY(22px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes starPulse {
            0% { transform: scale(1); filter: drop-shadow(0 0 1px rgba(245, 158, 11, 0.4)); }
            50% { transform: scale(1.2); filter: drop-shadow(0 0 7px rgba(245, 158, 11, 0.9)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 1px rgba(245, 158, 11, 0.4)); }
          }

          @keyframes badgeGlowPulse {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px #10B981); }
            50% { transform: scale(1.15); filter: drop-shadow(0 0 8px #10B981); }
          }

          .testimonial-card-animated {
            animation: testimonialEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }

          .testimonial-card-animated:hover {
            transform: translateY(-8px) scale(1.02) !important;
            border-color: #C99726 !important;
            box-shadow: 0 20px 48px rgba(201, 151, 38, 0.22), 0 6px 16px rgba(10, 17, 40, 0.08) !important;
          }

          .testimonial-card-animated:hover .star-icon-twinkle {
            animation: starPulse 1.2s infinite ease-in-out alternate;
          }

          .verified-badge-pulse {
            animation: badgeGlowPulse 2.8s infinite ease-in-out;
          }

          .like-btn-animated:active {
            transform: scale(1.25);
          }
        `}</style>

        {/* Testimonials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: '24px'
        }}>
          {filteredList.map((item, index) => {
            const extraLikes = likesMap[item.id || index] || 0;
            const totalLikes = (item.likes || 12) + extraLikes;

            return (
              <div
                key={item.id || index}
                className="testimonial-card-animated"
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(201, 151, 38, 0.3)',
                  padding: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(10, 17, 40, 0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  animationDelay: `${(index % 8) * 0.08}s`
                }}
              >
                {/* Top Quote Accent & Stars */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '3px', color: '#F59E0B' }}>
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <span key={i} className="star-icon-twinkle" style={{ display: 'inline-block', animationDelay: `${i * 0.15}s` }}>
                          <Icon icon="mdi:star" width="18" />
                        </span>
                      ))}
                    </div>

                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#0A1128',
                      background: 'rgba(201, 151, 38, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}>
                      {item.course || 'Tech Program'}
                    </span>
                  </div>

                  {item.title && (
                    <h3 style={{
                      fontSize: '16.5px',
                      fontWeight: 700,
                      color: '#0A1128',
                      marginBottom: '10px',
                      lineHeight: 1.35
                    }}>
                      "{item.title}"
                    </h3>
                  )}

                  <p style={{
                    fontSize: '14.5px',
                    color: '#334155',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                    fontStyle: 'italic'
                  }}>
                    "{item.message}"
                  </p>
                </div>

                {/* Bottom Author Section */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={item.name}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #C99726'
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#0A1128' }}>{item.name}</span>
                          <span className="verified-badge-pulse" style={{ display: 'inline-flex' }}>
                            <Icon icon="mdi:check-decagram" width="16" color="#10B981" title="Verified Student" />
                          </span>
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                          {item.outcome || item.role || 'Code Weave Planet Alumnus'}
                        </div>
                      </div>
                    </div>

                    {/* Like counter button */}
                    <button
                      type="button"
                      className="like-btn-animated"
                      onClick={() => handleLike(item.id || index)}
                      style={{
                        background: 'none',
                        border: '1px solid #E2E8F0',
                        borderRadius: '20px',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#64748B',
                        transition: 'all 0.15s ease'
                      }}
                      title="Mark as helpful"
                    >
                      <Icon icon="mdi:heart" width="14" color="#EF4444" />
                      <span>{totalLikes}</span>
                    </button>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '10px' }}>
                    Posted {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bottom Banner */}
        <div style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, #0A1128 0%, #172554 100%)',
          borderRadius: '16px',
          padding: '40px 30px',
          textAlign: 'center',
          color: '#FFFFFF',
          boxShadow: '0 12px 36px rgba(10, 17, 40, 0.25)',
          border: '2px solid #C99726'
        }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '12px', color: '#FFD700', fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to Build Your Own Success Story?
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 24px auto', color: '#CBD5E1', fontSize: '15px' }}>
            Join hundreds of students mastering AI, full-stack systems, mobile apps, and digital growth in Western Uganda.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/portal"
              style={{
                background: '#C99726',
                color: '#0A1128',
                fontWeight: 800,
                padding: '12px 26px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Icon icon="mdi:pencil" width="18" /> Submit A Story / Testimonial
            </Link>
            <Link
              to="/login"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1.5px solid #FFFFFF',
                color: '#FFFFFF',
                fontWeight: 700,
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Icon icon="mdi:account" width="18" /> Student & Tutor Portal
            </Link>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
