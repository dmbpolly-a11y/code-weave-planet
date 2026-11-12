import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
];

export default function Portal() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [course, setCourse] = useState('AI and Machine Learning');
  const [outcome, setOutcome] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [submitted, setSubmitted] = useState(false);

  const COURSES_LIST = [
    'AI and Machine Learning',
    'Web Design with Vite.js',
    'System Development with PHP Laravel',
    'Digital Marketing',
    'Mobile App Development',
    'Desktop Applications',
    'Hosting Services',
    'Video Editing',
    'New Video Editing Tools'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      alert('Please provide your name and your testimonial message.');
      return;
    }

    const newTestimonial = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Student',
      course,
      rating: Number(rating) || 5,
      avatar: selectedAvatar,
      title: title.trim() || `${course} Experience`,
      message: message.trim(),
      outcome: outcome.trim() || 'Code Weave Planet Community Member',
      date: new Date().toISOString(),
      likes: 1,
      verified: true
    };

    try {
      const existing = JSON.parse(localStorage.getItem('testimonials') || '[]');
      localStorage.setItem('testimonials', JSON.stringify([newTestimonial, ...existing]));
    } catch {
      localStorage.setItem('testimonials', JSON.stringify([newTestimonial]));
    }

    setSubmitted(true);
    setTimeout(() => {
      navigate('/testimonials');
    }, 1800);
  };

  return (
    <div className="portal-page page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GlobalHeader />

      <main style={{ flex: 1, padding: '36px 20px 80px 20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(201, 151, 38, 0.12)',
            border: '1px solid rgba(201, 151, 38, 0.35)',
            color: '#B45309',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '14px'
          }}>
            <Icon icon="mdi:planet" width="16" color="#C99726" />
            COMMUNITY PORTAL & TESTIMONIAL FEED
          </div>

          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 800,
            color: '#0A1128',
            fontFamily: "'Space Grotesk', sans-serif",
            margin: '0 0 10px 0',
            lineHeight: 1.2
          }}>
            Share Your Experience with Western Uganda & the World
          </h1>

          <p style={{
            maxWidth: '650px',
            margin: '0 auto',
            fontSize: '15.5px',
            color: '#475569',
            lineHeight: 1.6
          }}>
            Your story inspires the next generation of coders, designers, and innovators. Post your feedback directly to the public Testimonials wall.
          </p>
        </div>

        {submitted ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            border: '2px solid #22C55E',
            padding: '50px 30px',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(34, 197, 94, 0.2)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <Icon icon="mdi:check-circle" width="64" color="#22C55E" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0A1128', marginBottom: '10px' }}>
              Story Published Successfully!
            </h2>
            <p style={{ color: '#475569', fontSize: '15px', marginBottom: '20px' }}>
              Thank you for sharing your experience. We are now redirecting you to the Testimonials wall...
            </p>
            <Link
              to="/testimonials"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#C99726',
                color: '#FFFFFF',
                padding: '10px 22px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700
              }}
            >
              View on Testimonials Wall
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            alignItems: 'start'
          }}>
            {/* Form Column */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1.5px solid rgba(201, 151, 38, 0.3)',
              padding: '28px',
              boxShadow: '0 10px 30px rgba(10, 17, 40, 0.06)'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0A1128',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Icon icon="mdi:form-select" width="22" color="#C99726" />
                Submit Your Feedback
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ronald Kato"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14.5px',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                {/* Role / Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                      I am a...
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14px',
                        outline: 'none',
                        background: '#FFFFFF'
                      }}
                    >
                      <option value="Student">Current Student</option>
                      <option value="Graduate">Graduate / Alumnus</option>
                      <option value="Tutor / Instructor">Tutor / Instructor</option>
                      <option value="Community Member">Tech Community Member</option>
                      <option value="Hiring Partner">Hiring Partner / Employer</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                      Program / Course
                    </label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14px',
                        outline: 'none',
                        background: '#FFFFFF'
                      }}
                    >
                      {COURSES_LIST.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Career Outcome / Current Role */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                    Current Role or Outcome (Optional)
                  </label>
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="e.g. Junior Web Developer at DevSprout"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                {/* Rating Stars */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                    Your Rating: {rating} / 5 Stars
                  </label>
                  <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          color: star <= rating ? '#F59E0B' : '#D1D5DB',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <Icon icon="mdi:star" width="28" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choose Avatar */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                    Choose Your Avatar
                  </label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {AVATAR_PRESETS.map((av, idx) => (
                      <img
                        key={idx}
                        src={av}
                        alt="Avatar Option"
                        onClick={() => setSelectedAvatar(av)}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: selectedAvatar === av ? '3px solid #C99726' : '2px solid transparent',
                          transform: selectedAvatar === av ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Headline Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                    Headline / Summary *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mastered AI models and landed my first tech job!"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                {/* Testimonial Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                    Your Story & Feedback *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share what you learned, how the instructors helped you, or how this changed your career path..."
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14.5px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: '#C99726',
                    color: '#0A1128',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(201, 151, 38, 0.4)',
                    transition: 'all 0.2s ease',
                    marginTop: '8px'
                  }}
                >
                  <Icon icon="mdi:send-check" width="20" />
                  Post to Live Testimonials Wall
                </button>
              </form>
            </div>

            {/* Live Preview Column */}
            <div>
              <div style={{
                position: 'sticky',
                top: '90px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1.5px solid rgba(201, 151, 38, 0.3)',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(10, 17, 40, 0.06)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #E2E8F0',
                  paddingBottom: '12px',
                  marginBottom: '16px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#C99726', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Live Preview Card
                  </span>
                  <span style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon icon="mdi:broadcast" width="14" /> Real-Time Sync
                  </span>
                </div>

                {/* Card simulation */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(201, 151, 38, 0.35)',
                  padding: '20px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '3px', color: '#F59E0B' }}>
                      {[...Array(rating)].map((_, i) => (
                        <Icon key={i} icon="mdi:star" width="18" />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#0A1128', background: 'rgba(201, 151, 38, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>
                      {course}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0A1128', marginBottom: '8px' }}>
                    "{title || 'My Amazing Transformation at Code Weave Planet'}"
                  </h3>

                  <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '16px' }}>
                    "{message || 'Type your message on the left to see your story rendered right here in real-time!'}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <img
                      src={selectedAvatar}
                      alt="Avatar"
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C99726' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#0A1128' }}>{name || 'Your Name'}</span>
                        <Icon icon="mdi:check-decagram" width="15" color="#10B981" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>
                        {outcome || role}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                  <Icon icon="mdi:shield-check" width="16" color="#10B981" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  Submissions are immediately available across the network and persisted on the Testimonials page.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
}
