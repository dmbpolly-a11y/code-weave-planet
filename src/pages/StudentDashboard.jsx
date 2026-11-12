import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import cwLogo from '../../public/images/Cwlogo.png';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { profile, logout, updateProfile, uploadAvatar } = useAuth();

  const [activeTab, setActiveTab] = useState('browse');
  const [allCourses, setAllCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [applyForm, setApplyForm] = useState({ full_name: '', email: '', phone: '', motivation: '' });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonyForm, setTestimonyForm] = useState({
    course: 'Web Design with Vite.js',
    rating: 5,
    title: '',
    story: '',
    outcome: ''
  });
  const [submittingTestimony, setSubmittingTestimony] = useState(false);
  const [myTestimonies, setMyTestimonies] = useState([]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-UG', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  useEffect(() => {
    if (!profile || profile.role !== 'student') { navigate('/'); return; }
    loadAll();
  }, [profile]);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadCourses(), loadEnrollments(), loadApplications()]);
    loadStudentTestimonies();
    setLoading(false);
  };

  const loadStudentTestimonies = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('testimonials') || '[]');
      const mine = stored.filter(t => t.student_id === profile?.id || (profile?.full_name && t.name === profile.full_name));
      setMyTestimonies(mine);
    } catch {
      setMyTestimonies([]);
    }
  };

  const handlePostTestimony = (e) => {
    e.preventDefault();
    if (!testimonyForm.story.trim() || !testimonyForm.title.trim()) {
      showToast('Please provide a headline and your story', 'error');
      return;
    }
    setSubmittingTestimony(true);

    const chosenCourse = testimonyForm.course || (enrollments[0]?.course?.title || 'Web Design with Vite.js');
    const newEntry = {
      id: `student-${profile.id}-${Date.now()}`,
      name: profile.full_name || 'Code Weave Student',
      student_id: profile.id,
      role: 'Student at Code Weave Planet',
      course: chosenCourse,
      rating: Number(testimonyForm.rating) || 5,
      avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: testimonyForm.title.trim(),
      message: testimonyForm.story.trim(),
      outcome: testimonyForm.outcome.trim() || 'Active Student',
      date: new Date().toISOString(),
      likes: 1,
      verified: true
    };

    try {
      const existing = JSON.parse(localStorage.getItem('testimonials') || '[]');
      const updated = [newEntry, ...existing];
      localStorage.setItem('testimonials', JSON.stringify(updated));
      setMyTestimonies([newEntry, ...myTestimonies]);
      showToast('Your testimony has been published live to the Testimonials page!');
      setTestimonyForm({
        course: chosenCourse,
        rating: 5,
        title: '',
        story: '',
        outcome: ''
      });
    } catch (err) {
      showToast('Failed to save testimony', 'error');
    } finally {
      setSubmittingTestimony(false);
    }
  };

  const loadCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*, tutor:profiles!courses_tutor_id_fkey(full_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setAllCourses(data || []);
  };

  const loadEnrollments = async () => {
    const { data } = await supabase
      .from('enrollments')
      .select('*, course:courses(*, tutor:profiles!courses_tutor_id_fkey(full_name))')
      .eq('student_id', profile.id);
    setEnrollments(data || []);
  };

  const loadApplications = async () => {
    const { data } = await supabase
      .from('applications')
      .select('*, course:courses(title)')
      .eq('student_id', profile.id)
      .order('applied_at', { ascending: false });
    setApplications(data || []);
  };

  const loadResourcesForCourse = async (courseId) => {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    setResources(data || []);
  };

  // ─── Logout & Profile ─────────────────────────────────────
  const handleLogout = async () => { await logout(); navigate('/'); };

  const openProfileEdit = () => {
    setProfileForm({ full_name: profile.full_name, phone: profile.phone, bio: profile.bio });
    setEditingProfile(true);
    setShowProfileMenu(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await updateProfile(profileForm);
    setSaving(false);
    if (error) { showToast(error, 'error'); return; }
    showToast('Profile updated!');
    setEditingProfile(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { error } = await uploadAvatar(file);
    if (error) { showToast(error, 'error'); return; }
    showToast('Avatar updated!');
    setShowProfileMenu(false);
  };

  // ─── Application ──────────────────────────────────────────
  const openApplyModal = (course) => {
    setSelectedCourse(course);
    setApplyForm({
      full_name: profile.full_name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      motivation: '',
    });
    setModalType('apply');
    setShowModal(true);
  };

  const submitApplication = async () => {
    if (!applyForm.full_name || !applyForm.email) { showToast('Please fill required fields', 'error'); return; }
    setSaving(true);

    const { error } = await supabase.from('applications').upsert([{
      student_id: profile.id,
      course_id: selectedCourse.id,
      ...applyForm,
    }]);

    setSaving(false);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Application submitted! The tutor will review it.');
    setShowModal(false);
    await loadApplications();
  };

  // ─── Resources view ───────────────────────────────────────
  const openResources = async (enrollment) => {
    setSelectedCourse(enrollment.course);
    await loadResourcesForCourse(enrollment.course_id);
    setModalType('resources');
    setShowModal(true);
  };

  // ─── Helpers ─────────────────────────────────────────────
  const enrolledCourseIds = new Set(enrollments.map(e => e.course_id));
  const appliedCourseIds = new Set(applications.map(a => a.course_id));

  const availableCourses = allCourses.filter(c =>
    !enrolledCourseIds.has(c.id) &&
    (!searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase()) || (c.tutor?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getApplicationStatus = (courseId) => applications.find(a => a.course_id === courseId)?.status;

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading Student Portal...</p></div>;

  return (
    <PageTransition>
      <div className="dashboard-container page-container">
        {toast && (
          <div style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            padding: '12px 20px', borderRadius: '10px',
            background: toast.type === 'error' ? '#EF4444' : '#22C55E',
            color: '#fff', fontWeight: 600, fontSize: '14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            {toast.msg}
          </div>
        )}

        {/* Mobile Top Header Bar */}
        <div className="mobile-dashboard-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={cwLogo} alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>Student Portal</div>
              <div style={{ fontSize: '11px', color: '#C99726' }}>Code Weave Planet</div>
            </div>
          </div>
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <Icon icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"} width="22" />
          </button>
        </div>

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div className="sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={cwLogo} alt="Logo" className="sidebar-logo" />
              <h2>Student Portal</h2>
            </div>
            {mobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Close menu"
              >
                <Icon icon="mdi:close" width="18" />
              </button>
            )}
          </div>

          <nav className="sidebar-nav">
            {[
              { id: 'browse',       icon: 'mdi:magnify',              label: 'Browse Courses' },
              { id: 'enrolled',     icon: 'mdi:school',               label: `My Courses (${enrollments.length})` },
              { id: 'applications', icon: 'mdi:file-document-edit',   label: `Applications (${applications.length})` },
              { id: 'testimony',    icon: 'mdi:star-box-multiple',    label: 'Post Testimony Story' },
            ].map(tab => (
              <button key={tab.id} className={activeTab === tab.id ? 'active' : ''}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}>
                <Icon icon={tab.icon} width="20" /> {tab.label}
              </button>
            ))}
            <button
              onClick={() => { navigate('/testimonials'); setMobileMenuOpen(false); }}
              style={{ marginTop: 6, color: '#C99726' }}
            >
              <Icon icon="mdi:comment-quote" width="20" /> View Testimonials Wall
            </button>
            <button
              onClick={() => { navigate('/profiles'); setMobileMenuOpen(false); }}
              style={{ color: '#22D3EE' }}
            >
              <Icon icon="mdi:card-account-details-outline" width="20" /> Community Profiles
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="profile-pic-container">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="profile-pic" />
                ) : (
                  <div className="profile-pic-placeholder"><Icon icon="mdi:account" width="24" /></div>
                )}
                <button className="profile-pic-edit" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  <Icon icon="mdi:cog" width="14" />
                </button>
                {showProfileMenu && (
                  <div className="profile-menu">
                    <label className="profile-menu-item">
                      <Icon icon="mdi:camera" width="16" /><span>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                    </label>
                    <button className="profile-menu-item" onClick={openProfileEdit}>
                      <Icon icon="mdi:account-edit" width="16" /><span>Edit Profile</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="user-info">
                <p className="user-name">{profile?.full_name || 'Student'}</p>
                <p className="user-role">Student</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              <Icon icon="mdi:logout" width="18" /> Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>
              {activeTab === 'browse' && 'Browse Available Courses'}
              {activeTab === 'enrolled' && 'My Enrolled Courses'}
              {activeTab === 'applications' && 'My Applications'}
              {activeTab === 'testimony' && 'Post Testimony Story'}
            </h1>
          </header>

          {/* Quick Tab Scroller for Mobile */}
          <div className="mobile-tab-scroller">
            {[
              { id: 'browse',       icon: 'mdi:magnify',              label: 'Browse' },
              { id: 'enrolled',     icon: 'mdi:school',               label: `Enrolled (${enrollments.length})` },
              { id: 'applications', icon: 'mdi:file-document-edit',   label: `Applications (${applications.length})` },
              { id: 'testimony',    icon: 'mdi:star-box-multiple',    label: 'Post Story' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`mobile-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
              >
                <Icon icon={tab.icon} width="16" />
                <span>{tab.label}</span>
              </button>
            ))}
            <button
              className="mobile-tab-pill"
              onClick={() => navigate('/testimonials')}
              style={{ color: '#C99726' }}
            >
              <Icon icon="mdi:comment-quote" width="16" />
              <span>Wall</span>
            </button>
          </div>

          <div className="dashboard-content">

            {/* ── BROWSE ── */}
            {activeTab === 'browse' && (
              <>
                <div className="content-header">
                  <div className="search-bar">
                    <Icon icon="mdi:magnify" width="18" />
                    <input placeholder="Search courses by name or tutor..."
                      value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>

                <div className="course-grid">
                  {availableCourses.map(course => {
                    const appStatus = getApplicationStatus(course.id);
                    return (
                      <div key={course.id} className="course-card-student">
                        <div className="course-card-body">
                          <h3>{course.title}</h3>
                          <p className="course-tutor">
                            <Icon icon="mdi:account" width="16" />
                            {course.tutor?.full_name || 'TBD'}
                          </p>
                          <p className="course-description">{course.description}</p>
                          <div className="course-info">
                            {course.duration && <div className="info-item"><Icon icon="mdi:clock" width="15" /><span>{course.duration}</span></div>}
                            {course.schedule && <div className="info-item"><Icon icon="mdi:calendar" width="15" /><span>{course.schedule}</span></div>}
                          </div>
                          {course.fee && <div className="course-fee">{course.fee}</div>}
                        </div>
                        <div className="course-card-footer">
                          {appStatus === 'pending' && (
                            <span style={{ color: '#F59E0B', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon icon="mdi:clock" width="16" /> Application Pending
                            </span>
                          )}
                          {appStatus === 'rejected' && (
                            <span style={{ color: '#EF4444', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon icon="mdi:close-circle" width="16" /> Application Rejected
                            </span>
                          )}
                          {!appStatus && (
                            <button className="btn-primary" onClick={() => openApplyModal(course)}>
                              <Icon icon="mdi:file-document-edit" width="16" /> Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {availableCourses.length === 0 && (
                    <div className="empty-state">
                      <Icon icon="mdi:book-open" width="48" />
                      <p>{searchTerm ? 'No courses match your search.' : 'No available courses right now.'}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── ENROLLED ── */}
            {activeTab === 'enrolled' && (
              <>
                {enrollments.length === 0 ? (
                  <div className="empty-state">
                    <Icon icon="mdi:school" width="48" />
                    <p>You haven't been enrolled in any courses yet.</p>
                    <button className="btn-primary" onClick={() => setActiveTab('browse')}>Browse Courses</button>
                  </div>
                ) : (
                  <div className="enrolled-courses-list">
                    {enrollments.map(e => (
                      <div key={e.id} className="enrolled-course-card">
                        <div className="enrolled-header">
                          <div>
                            <h3>{e.course?.title}</h3>
                            <p className="course-tutor">
                              <Icon icon="mdi:account" width="16" />
                              Tutor: {e.course?.tutor?.full_name || 'TBD'}
                            </p>
                          </div>
                          <span className={`enrolled-badge ${e.status === 'completed' ? 'completed' : ''}`}>
                            <Icon icon={e.status === 'completed' ? 'mdi:check-circle' : 'mdi:school'} width="16" />
                            {e.status === 'completed' ? 'Completed' : 'Enrolled'}
                          </span>
                        </div>

                        {e.course?.description && <p className="course-description">{e.course.description}</p>}

                        <div className="enrolled-info">
                          {e.course?.duration && <div className="info-item"><Icon icon="mdi:clock" width="16" /><span>{e.course.duration}</span></div>}
                          {e.course?.schedule && <div className="info-item"><Icon icon="mdi:calendar" width="16" /><span>{e.course.schedule}</span></div>}
                          <div className="info-item"><Icon icon="mdi:calendar-check" width="16" /><span>Enrolled: {fmtDate(e.enrolled_at)}</span></div>
                          {e.completed_at && <div className="info-item"><Icon icon="mdi:check-circle" width="16" /><span style={{ color: '#22C55E' }}>Completed: {fmtDate(e.completed_at)}</span></div>}
                        </div>

                        <div className="enrolled-actions">
                          <button className="btn-primary" onClick={() => openResources(e)}>
                            <Icon icon="mdi:link-variant" width="16" /> View Resources
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── TESTIMONY STORY SECTION ── */}
            {activeTab === 'testimony' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Intro Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(201, 151, 38, 0.15) 0%, rgba(10, 17, 40, 0.05) 100%)',
                  border: '1.5px solid rgba(201, 151, 38, 0.35)',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A1128', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon icon="mdi:star-circle" width="24" color="#C99726" />
                      Post Your Student Testimony & Success Story
                    </h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#475569', maxWidth: '650px', lineHeight: 1.5 }}>
                      Share what you’ve learned, how your tutors supported you, and how your skills are advancing. Your story is published immediately to the public Testimonials page!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/testimonials')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#0A1128',
                      color: '#FFD700',
                      border: '1.5px solid #C99726',
                      borderRadius: '8px',
                      padding: '10px 18px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(10, 17, 40, 0.15)'
                    }}
                  >
                    <Icon icon="mdi:open-in-new" width="16" />
                    View Live Testimonials Page
                  </button>
                </div>

                {/* Form & Live Preview Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '24px',
                  alignItems: 'start'
                }}>
                  {/* Testimony Form */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(201, 151, 38, 0.28)',
                    padding: '24px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)'
                  }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0A1128', marginBottom: '18px' }}>
                      Write Your Experience
                    </h3>

                    <form onSubmit={handlePostTestimony} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Course Selection */}
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                          Course or Program
                        </label>
                        <select
                          value={testimonyForm.course}
                          onChange={e => setTestimonyForm({ ...testimonyForm, course: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '14px',
                            background: '#FFFFFF'
                          }}
                        >
                          {enrollments.map(e => (
                            <option key={e.id} value={e.course?.title || 'Course'}>
                              {e.course?.title} (Enrolled)
                            </option>
                          ))}
                          <option value="AI and Machine Learning">AI and Machine Learning</option>
                          <option value="Web Design with Vite.js">Web Design with Vite.js</option>
                          <option value="System Development with PHP Laravel">System Development with PHP Laravel</option>
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Mobile App Development">Mobile App Development</option>
                          <option value="General Tech Training">General Tech Training Experience</option>
                        </select>
                      </div>

                      {/* Rating Stars */}
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                          Rating: {testimonyForm.rating} / 5 Stars
                        </label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setTestimonyForm({ ...testimonyForm, rating: star })}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                color: star <= testimonyForm.rating ? '#F59E0B' : '#D1D5DB'
                              }}
                            >
                              <Icon icon="mdi:star" width="26" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Headline / Title */}
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                          Headline / Summary *
                        </label>
                        <input
                          type="text"
                          value={testimonyForm.title}
                          onChange={e => setTestimonyForm({ ...testimonyForm, title: e.target.value })}
                          placeholder="e.g. Mastered Vite & React, built my first 3 web projects!"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '14px',
                            background: '#FFFFFF'
                          }}
                        />
                      </div>

                      {/* Career Outcome / Status */}
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                          Your Goal / Current Outcome (Optional)
                        </label>
                        <input
                          type="text"
                          value={testimonyForm.outcome}
                          onChange={e => setTestimonyForm({ ...testimonyForm, outcome: e.target.value })}
                          placeholder="e.g. Aspiring Frontend Developer / Freelancer"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '14px',
                            background: '#FFFFFF'
                          }}
                        />
                      </div>

                      {/* Story Message */}
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0A1128', marginBottom: '6px' }}>
                          Your Story *
                        </label>
                        <textarea
                          value={testimonyForm.story}
                          onChange={e => setTestimonyForm({ ...testimonyForm, story: e.target.value })}
                          placeholder="Tell us what you liked most about the tutors, the assignments, the community, or how it helped your career..."
                          required
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            background: '#FFFFFF'
                          }}
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={submittingTestimony}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          background: '#C99726',
                          color: '#0A1128',
                          fontWeight: 800,
                          fontSize: '15px',
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(201, 151, 38, 0.4)',
                          transition: 'all 0.2s ease',
                          marginTop: '6px'
                        }}
                      >
                        <Icon icon="mdi:send-check" width="18" />
                        {submittingTestimony ? 'Publishing...' : 'Publish to Testimonials Page'}
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Live Preview & Published List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Live Preview Card */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.92)',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(201, 151, 38, 0.3)',
                      padding: '20px',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.04)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#C99726', textTransform: 'uppercase' }}>
                          Live Preview Card
                        </span>
                        <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
                          {[...Array(testimonyForm.rating)].map((_, i) => (
                            <Icon key={i} icon="mdi:star" width="16" />
                          ))}
                        </div>
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A1128', margin: '0 0 8px 0' }}>
                        "{testimonyForm.title || 'My Experience at Code Weave Planet'}"
                      </h4>

                      <p style={{ fontSize: '13.5px', color: '#475569', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '14px' }}>
                        "{testimonyForm.story || 'Your testimonial text will appear here as you type in the form...'}"
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Profile" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #C99726' }} />
                        ) : (
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717A' }}>
                            <Icon icon="mdi:account" width="20" />
                          </div>
                        )}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A1128' }}>{profile?.full_name || 'Your Name'}</span>
                            <Icon icon="mdi:check-decagram" width="14" color="#10B981" />
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                            {testimonyForm.outcome || 'Active Student'} • {testimonyForm.course || 'Tech Course'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Published Testimonies */}
                    {myTestimonies.length > 0 && (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.92)',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(16, 185, 129, 0.3)',
                        padding: '20px'
                      }}>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0A1128', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Icon icon="mdi:check-circle" width="18" color="#10B981" />
                          Your Published Testimonies ({myTestimonies.length})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {myTestimonies.map((t, idx) => (
                            <div key={idx} style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0A1128' }}>{t.title}</span>
                                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>Live on Wall ✓</span>
                              </div>
                              <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 6px 0', fontStyle: 'italic' }}>
                                "{t.message.slice(0, 90)}..."
                              </p>
                              <Link to="/testimonials" style={{ fontSize: '12px', color: '#C99726', fontWeight: 700, textDecoration: 'none' }}>
                                View on Testimonials page →
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}


          </div>
        </main>

        {/* ── Application Modal ── */}
        {showModal && modalType === 'apply' && selectedCourse && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>Apply for Course</h2>
                  <p style={{ color: '#8B7355', fontSize: '14px', marginTop: '4px' }}>{selectedCourse.title}</p>
                </div>
                <button className="btn-icon" onClick={() => setShowModal(false)}><Icon icon="mdi:close" width="20" /></button>
              </div>
              <div className="modal-body">
                <div style={{
                  background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '10px', padding: '14px', marginBottom: '20px',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', color: '#8B7355' }}>
                    {selectedCourse.tutor?.full_name && <span><strong style={{ color: '#D4AF37' }}>Tutor:</strong> {selectedCourse.tutor.full_name}</span>}
                    {selectedCourse.duration && <span><strong style={{ color: '#D4AF37' }}>Duration:</strong> {selectedCourse.duration}</span>}
                    {selectedCourse.schedule && <span><strong style={{ color: '#D4AF37' }}>Schedule:</strong> {selectedCourse.schedule}</span>}
                    {selectedCourse.fee && <span><strong style={{ color: '#D4AF37' }}>Fee:</strong> {selectedCourse.fee}</span>}
                  </div>
                </div>

                {[
                  { label: 'Full Name *', key: 'full_name', type: 'text', ph: 'Your full name' },
                  { label: 'Email Address *', key: 'email', type: 'email', ph: 'your@email.com' },
                  { label: 'Phone Number', key: 'phone', type: 'tel', ph: '0750937506' },
                ].map(f => (
                  <div className="form-group" key={f.key}>
                    <label>{f.label}</label>
                    <input type={f.type} value={applyForm[f.key]} placeholder={f.ph}
                      onChange={e => setApplyForm({ ...applyForm, [f.key]: e.target.value })} />
                  </div>
                ))}

                <div className="form-group">
                  <label>Why do you want to take this course? (optional)</label>
                  <textarea value={applyForm.motivation} rows="3" placeholder="Tell us about your motivation and goals..."
                    onChange={e => setApplyForm({ ...applyForm, motivation: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={submitApplication} disabled={saving || !applyForm.full_name || !applyForm.email}>
                  <Icon icon="mdi:send" width="18" />
                  {saving ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Resources Modal ── */}
        {showModal && modalType === 'resources' && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>Course Resources</h2>
                  <p style={{ color: '#8B7355', fontSize: '14px', marginTop: '4px' }}>{selectedCourse?.title}</p>
                </div>
                <button className="btn-icon" onClick={() => setShowModal(false)}><Icon icon="mdi:close" width="20" /></button>
              </div>
              <div className="modal-body">
                {resources.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#5C4B3A' }}>
                    <Icon icon="mdi:link-variant" width="48" style={{ opacity: 0.4, display: 'block', margin: '0 auto 12px' }} />
                    <p>No resources have been posted yet. Check back soon!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {resources.map(r => (
                      <div key={r.id} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
                        borderRadius: '12px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start',
                      }}>
                        <div style={{ padding: '10px', background: 'rgba(34,211,238,0.1)', borderRadius: '8px', flexShrink: 0 }}>
                          <Icon icon="mdi:link-variant" width="22" style={{ color: '#22D3EE' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: '#F5F0E8', fontWeight: 700, marginBottom: '4px', fontSize: '15px' }}>{r.title}</h3>
                          {r.description && <p style={{ color: '#8B7355', fontSize: '13px', marginBottom: '8px' }}>{r.description}</p>}
                          <a href={r.url} target="_blank" rel="noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '7px 14px', background: 'rgba(34,211,238,0.12)',
                              color: '#22D3EE', borderRadius: '8px', fontSize: '13px',
                              fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(34,211,238,0.25)',
                              transition: 'all 0.2s',
                            }}>
                            <Icon icon="mdi:open-in-new" width="14" /> Open Resource
                          </a>
                          <p style={{ color: '#5C4B3A', fontSize: '11px', marginTop: '6px' }}>
                            Posted {fmtDate(r.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Profile Edit Modal ── */}
        {editingProfile && (
          <div className="modal-overlay" onClick={() => setEditingProfile(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button className="btn-icon" onClick={() => setEditingProfile(false)}><Icon icon="mdi:close" width="20" /></button>
              </div>
              <div className="modal-body">
                {[{ label: 'Full Name', key: 'full_name', type: 'text' }, { label: 'Phone', key: 'phone', type: 'tel' }].map(f => (
                  <div className="form-group" key={f.key}>
                    <label>{f.label}</label>
                    <input type={f.type} value={profileForm[f.key] || ''}
                      onChange={e => setProfileForm({ ...profileForm, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Bio</label>
                  <textarea value={profileForm.bio || ''} rows="3"
                    onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setEditingProfile(false)}>Cancel</button>
                <button className="btn-primary" onClick={saveProfile} disabled={saving}>
                  <Icon icon="mdi:content-save" width="18" /> {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
