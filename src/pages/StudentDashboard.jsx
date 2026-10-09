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
    setLoading(false);
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

        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <img src={cwLogo} alt="Logo" className="sidebar-logo" />
            <h2>Student Portal</h2>
          </div>

          <nav className="sidebar-nav">
            {[
              { id: 'browse',       icon: 'mdi:magnify',              label: 'Browse Courses' },
              { id: 'enrolled',     icon: 'mdi:school',               label: `My Courses (${enrollments.length})` },
              { id: 'applications', icon: 'mdi:file-document-edit',   label: `Applications (${applications.length})` },
            ].map(tab => (
              <button key={tab.id} className={activeTab === tab.id ? 'active' : ''}
                onClick={() => setActiveTab(tab.id)}>
                <Icon icon={tab.icon} width="20" /> {tab.label}
              </button>
            ))}
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
            </h1>
          </header>

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

            {/* ── APPLICATIONS ── */}
            {activeTab === 'applications' && (
              <>
                {applications.length === 0 ? (
                  <div className="empty-state">
                    <Icon icon="mdi:file-document-edit" width="48" />
                    <p>You haven't applied to any courses yet.</p>
                    <button className="btn-primary" onClick={() => setActiveTab('browse')}>Browse Courses</button>
                  </div>
                ) : (
                  <div className="data-table">
                    <table>
                      <thead><tr><th>Course</th><th>Applied</th><th>Status</th></tr></thead>
                      <tbody>
                        {applications.map(app => (
                          <tr key={app.id}>
                            <td><strong>{app.course?.title}</strong></td>
                            <td>{fmtDate(app.applied_at)}</td>
                            <td>
                              <span className={`status-badge ${app.status}`}>{app.status}</span>
                              {app.status === 'approved' && (
                                <span style={{ marginLeft: '8px', color: '#22C55E', fontSize: '12px' }}>✓ You are enrolled!</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
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
