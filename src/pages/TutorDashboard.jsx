import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import cwLogo from '../../public/images/Cwlogo.png';

export default function TutorDashboard() {
  const navigate = useNavigate();
  const { profile, logout, updateProfile, uploadAvatar } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [resources, setResources] = useState([]);
  const [applications, setApplications] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-UG', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const isOnline = (lastSeen) => lastSeen && new Date() - new Date(lastSeen) < 5 * 60 * 1000;

  useEffect(() => {
    if (!profile || profile.role !== 'tutor') { navigate('/'); return; }
    loadAll();
  }, [profile]);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadCourses(), loadApplications()]);
    setLoading(false);
  };

  const loadCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('tutor_id', profile.id)
      .order('created_at', { ascending: false });
    setCourses(data || []);
  };

  const loadEnrollmentsForCourse = async (courseId) => {
    const { data } = await supabase
      .from('enrollments')
      .select('*, student:profiles!enrollments_student_id_fkey(id, full_name, email, phone, avatar_url, last_seen)')
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false });
    setEnrollments(data || []);
  };

  const loadResourcesForCourse = async (courseId) => {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    setResources(data || []);
  };

  const loadApplications = async () => {
    // Get applications for all my courses
    const { data: myCourses } = await supabase.from('courses').select('id').eq('tutor_id', profile.id);
    const courseIds = (myCourses || []).map(c => c.id);
    if (courseIds.length === 0) { setApplications([]); return; }

    const { data } = await supabase
      .from('applications')
      .select('*, student:profiles!applications_student_id_fkey(full_name, email), course:courses(title)')
      .in('course_id', courseIds)
      .order('applied_at', { ascending: false });
    setApplications(data || []);
  };

  const selectCourse = (course) => {
    setSelectedCourse(course);
    setSearchTerm('');
    loadEnrollmentsForCourse(course.id);
    loadResourcesForCourse(course.id);
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

  // ─── Courses CRUD ─────────────────────────────────────────
  const openModal = (type, item = null) => {
    setModalType(type);
    setFormData(item ? { ...item } : { title: '', description: '', duration: '', schedule: '', fee: '', status: 'active' });
    setShowModal(true);
  };

  const saveCourse = async () => {
    setSaving(true);
    if (modalType === 'add-course') {
      const { error } = await supabase.from('courses').insert([{ ...formData, tutor_id: profile.id }]);
      if (error) { showToast(error.message, 'error'); } else { showToast('Course created!'); }
    } else {
      const { error } = await supabase.from('courses').update(formData).eq('id', formData.id).eq('tutor_id', profile.id);
      if (error) { showToast(error.message, 'error'); } else { showToast('Course updated!'); }
    }
    setSaving(false);
    setShowModal(false);
    await loadCourses();
    if (selectedCourse) await loadEnrollmentsForCourse(selectedCourse.id);
  };

  const deleteCourse = async (id) => {
    if (!confirm('Delete this course and all its data?')) return;
    await supabase.from('courses').delete().eq('id', id).eq('tutor_id', profile.id);
    showToast('Course deleted');
    if (selectedCourse?.id === id) setSelectedCourse(null);
    loadCourses();
  };

  // ─── Resources ────────────────────────────────────────────
  const saveResource = async () => {
    if (!selectedCourse) return;
    setSaving(true);
    if (modalType === 'add-resource') {
      const { error } = await supabase.from('resources').insert([{ ...formData, course_id: selectedCourse.id, tutor_id: profile.id }]);
      if (error) { showToast(error.message, 'error'); } else { showToast('Resource posted!'); }
    } else {
      const { error } = await supabase.from('resources').update(formData).eq('id', formData.id).eq('tutor_id', profile.id);
      if (error) { showToast(error.message, 'error'); } else { showToast('Resource updated!'); }
    }
    setSaving(false);
    setShowModal(false);
    await loadResourcesForCourse(selectedCourse.id);
  };

  const deleteResource = async (id) => {
    if (!confirm('Delete this resource?')) return;
    await supabase.from('resources').delete().eq('id', id).eq('tutor_id', profile.id);
    showToast('Resource removed');
    await loadResourcesForCourse(selectedCourse.id);
  };

  // ─── Enrollment Management ────────────────────────────────
  const removeStudent = async (enrollmentId) => {
    if (!confirm('Remove this student from the course?')) return;
    await supabase.from('enrollments').delete().eq('id', enrollmentId);
    showToast('Student removed');
    await loadEnrollmentsForCourse(selectedCourse.id);
  };

  const markComplete = async (enrollmentId) => {
    await supabase.from('enrollments').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', enrollmentId);
    showToast('Marked as completed!');
    await loadEnrollmentsForCourse(selectedCourse.id);
  };

  // ─── Applications ─────────────────────────────────────────
  const reviewApplication = async (appId, newStatus, studentId, courseId) => {
    await supabase.from('applications')
      .update({ status: newStatus, reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', appId);

    if (newStatus === 'approved') {
      await supabase.from('enrollments').upsert([{ student_id: studentId, course_id: courseId, status: 'enrolled' }]);
      showToast('Approved and enrolled!');
    } else {
      showToast('Application rejected');
    }
    loadApplications();
    if (selectedCourse?.id === courseId) await loadEnrollmentsForCourse(courseId);
  };

  const filteredEnrollments = enrollments.filter(e =>
    !searchTerm || (e.student?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading Tutor Portal...</p></div>;

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
            <h2>Tutor Portal</h2>
          </div>

          <nav className="sidebar-nav">
            {[
              { id: 'overview',      icon: 'mdi:view-dashboard', label: 'Overview' },
              { id: 'courses',       icon: 'mdi:book-open',       label: 'My Courses' },
              { id: 'students',      icon: 'mdi:account-group',   label: 'Students' },
              { id: 'resources',     icon: 'mdi:link-variant',    label: 'Resources' },
              { id: 'applications',  icon: 'mdi:file-document-edit', label: `Applications${applications.filter(a=>a.status==='pending').length ? ` (${applications.filter(a=>a.status==='pending').length})` : ''}` },
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
                <p className="user-name">{profile?.full_name || 'Tutor'}</p>
                <p className="user-role">Tutor</p>
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
              {activeTab === 'overview' && 'Overview'}
              {activeTab === 'courses' && 'My Courses'}
              {activeTab === 'students' && (selectedCourse ? `Students — ${selectedCourse.title}` : 'Select a Course')}
              {activeTab === 'resources' && (selectedCourse ? `Resources — ${selectedCourse.title}` : 'Select a Course')}
              {activeTab === 'applications' && 'Course Applications'}
            </h1>
          </header>

          <div className="dashboard-content">

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div>
                <div className="overview-grid">
                  {[
                    { label: 'My Courses',     val: courses.length,                                                          icon: 'mdi:book-open',        color: '#22D3EE' },
                    { label: 'Total Students', val: new Set(enrollments.map(e=>e.student_id)).size,                          icon: 'mdi:account-group',    color: '#D4AF37' },
                    { label: 'Pending Apps',   val: applications.filter(a=>a.status==='pending').length,                     icon: 'mdi:file-document-edit', color: '#F59E0B' },
                    { label: 'Completed',      val: enrollments.filter(e=>e.status==='completed').length,                    icon: 'mdi:check-circle',     color: '#22C55E' },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <Icon icon={s.icon} width="32" style={{ color: s.color }} />
                      <h3>{s.val}</h3>
                      <p>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '28px' }}>
                  <h2 style={{ color: '#D4AF37', marginBottom: '16px', fontSize: '16px', fontWeight: 700 }}>My Courses</h2>
                  <div className="course-grid">
                    {courses.map(c => (
                      <div key={c.id} className="course-card-tutor">
                        <div className="course-card-header">
                          <h3>{c.title}</h3>
                          <span className={`status-badge ${c.status}`}>{c.status}</span>
                        </div>
                        <p className="course-description">{c.description}</p>
                        <div className="course-stats">
                          <div className="stat-item"><Icon icon="mdi:calendar" width="16" /><span>{c.schedule || 'TBD'}</span></div>
                          <div className="stat-item"><Icon icon="mdi:clock" width="16" /><span>{c.duration || 'TBD'}</span></div>
                        </div>
                        <button className="btn-secondary btn-block" onClick={() => { selectCourse(c); setActiveTab('students'); }}>
                          <Icon icon="mdi:account-group" width="16" /> View Students
                        </button>
                      </div>
                    ))}
                    {courses.length === 0 && (
                      <div className="empty-state">
                        <Icon icon="mdi:book-open" width="48" />
                        <p>No courses yet. Add your first course!</p>
                        <button className="btn-primary" onClick={() => { openModal('add-course'); setActiveTab('courses'); }}>
                          Add Course
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── COURSES ── */}
            {activeTab === 'courses' && (
              <>
                <div className="content-header">
                  <button className="btn-primary" onClick={() => openModal('add-course')}>
                    <Icon icon="mdi:plus" width="18" /> Add New Course
                  </button>
                </div>
                <div className="course-grid">
                  {courses.map(c => (
                    <div key={c.id} className="course-card-tutor">
                      <div className="course-card-header">
                        <h3>{c.title}</h3>
                        <div className="course-actions">
                          <button className="btn-icon" onClick={() => openModal('edit-course', c)}><Icon icon="mdi:pencil" width="16" /></button>
                          <button className="btn-icon danger" onClick={() => deleteCourse(c.id)}><Icon icon="mdi:delete" width="16" /></button>
                        </div>
                      </div>
                      <p className="course-description">{c.description}</p>
                      <div className="course-stats">
                        <div className="stat-item"><Icon icon="mdi:currency-usd" width="16" /><span>{c.fee || 'Free'}</span></div>
                        <div className="stat-item"><Icon icon="mdi:calendar" width="16" /><span>{c.schedule || 'TBD'}</span></div>
                        <div className="stat-item"><Icon icon="mdi:clock" width="16" /><span>{c.duration || 'TBD'}</span></div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button className="btn-secondary" style={{ flex: 1, fontSize: '13px' }}
                          onClick={() => { selectCourse(c); setActiveTab('students'); }}>
                          <Icon icon="mdi:account-group" width="14" /> Students
                        </button>
                        <button className="btn-secondary" style={{ flex: 1, fontSize: '13px' }}
                          onClick={() => { selectCourse(c); setActiveTab('resources'); }}>
                          <Icon icon="mdi:link-variant" width="14" /> Resources
                        </button>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <div className="empty-state">
                      <Icon icon="mdi:book-open" width="48" />
                      <p>No courses yet. Click "Add New Course" to begin.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── STUDENTS ── */}
            {activeTab === 'students' && (
              <>
                {/* Course Selector */}
                <div className="content-header" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {courses.map(c => (
                      <button key={c.id}
                        onClick={() => selectCourse(c)}
                        style={{
                          padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                          border: selectedCourse?.id === c.id ? '2px solid #D4AF37' : '1px solid rgba(212,175,55,0.3)',
                          background: selectedCourse?.id === c.id ? 'rgba(212,175,55,0.15)' : 'transparent',
                          color: selectedCourse?.id === c.id ? '#D4AF37' : '#8B7355', cursor: 'pointer',
                        }}>
                        {c.title}
                      </button>
                    ))}
                  </div>
                  {selectedCourse && (
                    <div className="search-bar" style={{ minWidth: '220px' }}>
                      <Icon icon="mdi:magnify" width="18" />
                      <input placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                  )}
                </div>

                {!selectedCourse ? (
                  <div className="empty-state"><Icon icon="mdi:book-open" width="48" /><p>Select a course above to view its students</p></div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                      {[
                        { label: 'Enrolled',  val: filteredEnrollments.filter(e=>e.status==='enrolled').length,  color: '#22D3EE' },
                        { label: 'Completed', val: filteredEnrollments.filter(e=>e.status==='completed').length, color: '#22C55E' },
                        { label: 'Online',    val: filteredEnrollments.filter(e=>isOnline(e.student?.last_seen)).length, color: '#F59E0B' },
                      ].map(s => (
                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.val}</div>
                          <div style={{ fontSize: '12px', color: '#8B7355' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="data-table">
                      <table>
                        <thead><tr><th>Student</th><th>Email</th><th>Status</th><th>Enrolled</th><th>Online</th><th>Actions</th></tr></thead>
                        <tbody>
                          {filteredEnrollments.map(e => (
                            <tr key={e.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {e.student?.avatar_url ? <img src={e.student.avatar_url} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} /> : null}
                                  {e.student?.full_name || '—'}
                                </div>
                              </td>
                              <td>{e.student?.email}</td>
                              <td><span className={`status-badge ${e.status}`}>{e.status}</span></td>
                              <td>{fmtDate(e.enrolled_at)}</td>
                              <td>
                                <span style={{
                                  display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px',
                                  color: isOnline(e.student?.last_seen) ? '#22C55E' : '#6B7280'
                                }}>
                                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: isOnline(e.student?.last_seen) ? '#22C55E' : '#6B7280' }} />
                                  {isOnline(e.student?.last_seen) ? 'Online' : 'Offline'}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  {e.status === 'enrolled' && (
                                    <button className="btn-sm success" onClick={() => markComplete(e.id)}>Complete</button>
                                  )}
                                  <button className="btn-icon danger" onClick={() => removeStudent(e.id)}><Icon icon="mdi:account-remove" width="16" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredEnrollments.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', color: '#8B7355' }}>No students enrolled yet</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── RESOURCES ── */}
            {activeTab === 'resources' && (
              <>
                <div className="content-header" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {courses.map(c => (
                      <button key={c.id} onClick={() => selectCourse(c)}
                        style={{
                          padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                          border: selectedCourse?.id === c.id ? '2px solid #D4AF37' : '1px solid rgba(212,175,55,0.3)',
                          background: selectedCourse?.id === c.id ? 'rgba(212,175,55,0.15)' : 'transparent',
                          color: selectedCourse?.id === c.id ? '#D4AF37' : '#8B7355', cursor: 'pointer',
                        }}>
                        {c.title}
                      </button>
                    ))}
                  </div>
                  {selectedCourse && (
                    <button className="btn-primary" onClick={() => openModal('add-resource')}>
                      <Icon icon="mdi:link-plus" width="18" /> Post Resource Link
                    </button>
                  )}
                </div>

                {!selectedCourse ? (
                  <div className="empty-state"><Icon icon="mdi:link-variant" width="48" /><p>Select a course to manage its resources</p></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {resources.map(r => (
                      <div key={r.id} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
                        borderRadius: '12px', padding: '16px',
                        display: 'flex', alignItems: 'flex-start', gap: '14px',
                      }}>
                        <div style={{ padding: '10px', background: 'rgba(34,211,238,0.1)', borderRadius: '8px', flexShrink: 0 }}>
                          <Icon icon="mdi:link-variant" width="22" style={{ color: '#22D3EE' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: '#F5F0E8', fontWeight: 700, marginBottom: '4px' }}>{r.title}</h3>
                          {r.description && <p style={{ color: '#8B7355', fontSize: '13px', marginBottom: '8px' }}>{r.description}</p>}
                          <a href={r.url} target="_blank" rel="noreferrer"
                            style={{ color: '#22D3EE', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon icon="mdi:open-in-new" width="14" /> {r.url}
                          </a>
                          <p style={{ color: '#5C4B3A', fontSize: '11px', marginTop: '6px' }}>Posted {fmtDate(r.created_at)}</p>
                        </div>
                        <div className="action-buttons">
                          <button className="btn-icon" onClick={() => openModal('edit-resource', r)}><Icon icon="mdi:pencil" width="16" /></button>
                          <button className="btn-icon danger" onClick={() => deleteResource(r.id)}><Icon icon="mdi:delete" width="16" /></button>
                        </div>
                      </div>
                    ))}
                    {resources.length === 0 && (
                      <div className="empty-state">
                        <Icon icon="mdi:link-variant" width="48" />
                        <p>No resources posted yet. Share a link with your students!</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ── APPLICATIONS ── */}
            {activeTab === 'applications' && (
              <div className="data-table">
                <table>
                  <thead><tr><th>Student</th><th>Course</th><th>Phone</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td>{app.student?.full_name}<br /><small style={{ color: '#8B7355' }}>{app.email}</small></td>
                        <td>{app.course?.title}</td>
                        <td>{app.phone || '—'}</td>
                        <td>{fmtDate(app.applied_at)}</td>
                        <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                        <td>
                          {app.status === 'pending' ? (
                            <div className="action-buttons">
                              <button className="btn-sm success" onClick={() => reviewApplication(app.id, 'approved', app.student_id, app.course_id)}>Approve</button>
                              <button className="btn-sm danger" onClick={() => reviewApplication(app.id, 'rejected', app.student_id, app.course_id)}>Reject</button>
                            </div>
                          ) : <span style={{ color: '#5C4B3A', fontSize: '13px' }}>Reviewed</span>}
                        </td>
                      </tr>
                    ))}
                    {applications.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#8B7355' }}>No applications yet</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </main>

        {/* ── Course Modal ── */}
        {showModal && (modalType === 'add-course' || modalType === 'edit-course') && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modalType === 'add-course' ? 'Add New Course' : 'Edit Course'}</h2>
                <button className="btn-icon" onClick={() => setShowModal(false)}><Icon icon="mdi:close" width="20" /></button>
              </div>
              <div className="modal-body">
                {[
                  { label: 'Course Title', key: 'title', type: 'text', ph: 'e.g. Advanced React' },
                  { label: 'Duration',     key: 'duration', type: 'text', ph: 'e.g. 8 weeks' },
                  { label: 'Schedule',     key: 'schedule', type: 'text', ph: 'Mon, Wed, Fri - 7:00 PM' },
                  { label: 'Fee',          key: 'fee',      type: 'text', ph: 'e.g. 500,000 UGX' },
                ].map(f => (
                  <div className="form-group" key={f.key}>
                    <label>{f.label}</label>
                    <input type={f.type} value={formData[f.key] || ''} placeholder={f.ph}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={formData.description || ''} rows="3"
                    onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status || 'active'} className="form-select"
                    onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={saveCourse} disabled={saving}>
                  <Icon icon="mdi:content-save" width="18" /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Resource Modal ── */}
        {showModal && (modalType === 'add-resource' || modalType === 'edit-resource') && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modalType === 'add-resource' ? 'Post Resource Link' : 'Edit Resource'}</h2>
                <button className="btn-icon" onClick={() => setShowModal(false)}><Icon icon="mdi:close" width="20" /></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" value={formData.title || ''} placeholder="e.g. Week 3 - React Hooks Video"
                    onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>URL *</label>
                  <input type="url" value={formData.url || ''} placeholder="https://youtube.com/watch?v=..."
                    onChange={e => setFormData({ ...formData, url: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Description (optional)</label>
                  <textarea value={formData.description || ''} rows="3" placeholder="What will students learn from this?"
                    onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={saveResource} disabled={saving || !formData.title || !formData.url}>
                  <Icon icon="mdi:link-plus" width="18" /> {saving ? 'Posting...' : 'Post Resource'}
                </button>
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
