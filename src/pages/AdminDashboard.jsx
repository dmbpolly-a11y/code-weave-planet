import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import cwLogo from '../../public/images/Cwlogo.png';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profile, logout, updateProfile, uploadAvatar } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState({ courses: 0, tutors: 0, students: 0, applications: 0, online: 0 });

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const fileRef = useRef();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Load all data ────────────────────────────────────────
  useEffect(() => {
    if (!profile || profile.role !== 'admin') { navigate('/'); return; }
    loadAll();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [profile]);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadCourses(), loadUsers(), loadApplications(), loadEnrollments(), loadResources(), loadStats()]);
    setLoading(false);
  };

  const loadCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*, tutor:profiles!courses_tutor_id_fkey(id, full_name, email)')
      .order('created_at', { ascending: false });
    setCourses(data || []);
  };

  const loadUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    const allProfiles = data || [];
    setTutors(allProfiles.filter(p => p.role === 'tutor'));
    setStudents(allProfiles.filter(p => p.role === 'student'));
  };

  const loadApplications = async () => {
    const { data } = await supabase
      .from('applications')
      .select('*, student:profiles!applications_student_id_fkey(full_name, email), course:courses(title)')
      .order('applied_at', { ascending: false });
    setApplications(data || []);
  };

  const loadEnrollments = async () => {
    const { data } = await supabase
      .from('enrollments')
      .select('*, student:profiles!enrollments_student_id_fkey(full_name, email), course:courses(title)')
      .order('enrolled_at', { ascending: false });
    setEnrollments(data || []);
  };

  const loadResources = async () => {
    const { data } = await supabase
      .from('resources')
      .select('*, course:courses(title), tutor:profiles!resources_tutor_id_fkey(full_name)')
      .order('created_at', { ascending: false });
    setResources(data || []);
  };

  const loadStats = async () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const [{ count: coursesCount }, { count: tutorsCount }, { count: studentsCount },
           { count: appsCount }, { count: onlineCount }] = await Promise.all([
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'tutor'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('last_seen', fiveMinAgo),
    ]);
    setStats({ courses: coursesCount, tutors: tutorsCount, students: studentsCount, applications: appsCount, online: onlineCount });
  };

  // ─── Logout ───────────────────────────────────────────────
  const handleLogout = async () => { await logout(); navigate('/'); };

  // ─── Profile ─────────────────────────────────────────────
  const openProfileEdit = () => {
    setProfileForm({ full_name: profile.full_name, phone: profile.phone, bio: profile.bio });
    setEditingProfile(true);
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
    setSelectedItem(item);
    setFormData(item ? { ...item, tutor_id: item.tutor_id || '' } : { title: '', description: '', duration: '', schedule: '', fee: '', status: 'active', tutor_id: '' });
    setShowModal(true);
  };

  const saveCourse = async () => {
    setSaving(true);
    if (modalType === 'add-course') {
      const { error } = await supabase.from('courses').insert([{ ...formData, tutor_id: formData.tutor_id || null }]);
      if (error) { showToast(error.message, 'error'); } else { showToast('Course added!'); }
    } else {
      const { error } = await supabase.from('courses').update({ ...formData, tutor_id: formData.tutor_id || null }).eq('id', selectedItem.id);
      if (error) { showToast(error.message, 'error'); } else { showToast('Course updated!'); }
    }
    setSaving(false);
    setShowModal(false);
    loadCourses(); loadStats();
  };

  const deleteCourse = async (id) => {
    if (!confirm('Delete this course? All enrollments and resources will be removed.')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Course deleted');
    loadCourses(); loadStats();
  };

  // ─── User Management ──────────────────────────────────────
  const updateUserRole = async (userId, newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Role updated!');
    loadUsers();
  };

  const updateUserStatus = async (userId, newStatus) => {
    const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Status updated!');
    loadUsers();
  };

  const deleteUser = async (userId) => {
    if (!confirm('Remove this user? This will delete their profile data.')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('User removed');
    loadUsers();
  };

  // ─── Applications ─────────────────────────────────────────
  const reviewApplication = async (appId, newStatus, studentId, courseId) => {
    const { error } = await supabase.from('applications')
      .update({ status: newStatus, reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', appId);
    if (error) { showToast(error.message, 'error'); return; }

    if (newStatus === 'approved') {
      await supabase.from('enrollments').upsert([{ student_id: studentId, course_id: courseId, status: 'enrolled' }]);
      showToast('Application approved & student enrolled!');
    } else {
      showToast('Application rejected');
    }
    loadApplications(); loadEnrollments(); loadStats();
  };

  // ─── Enrollments ──────────────────────────────────────────
  const updateEnrollmentStatus = async (id, status) => {
    await supabase.from('enrollments').update({ status, ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}) }).eq('id', id);
    showToast('Enrollment updated!');
    loadEnrollments();
  };

  const removeEnrollment = async (id) => {
    if (!confirm('Remove this enrollment?')) return;
    await supabase.from('enrollments').delete().eq('id', id);
    showToast('Enrollment removed');
    loadEnrollments();
  };

  // ─── Helpers ─────────────────────────────────────────────
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-UG', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const isOnline = (lastSeen) => lastSeen && new Date() - new Date(lastSeen) < 5 * 60 * 1000;

  const filterBySearch = (arr, fields) =>
    arr.filter(item => fields.some(f => (item[f] || '').toLowerCase().includes(searchTerm.toLowerCase())));

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>Loading Admin Panel...</p>
    </div>
  );

  return (
    <PageTransition>
      <div className="dashboard-container page-container">
        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            padding: '12px 20px', borderRadius: '10px',
            background: toast.type === 'error' ? '#EF4444' : '#22C55E',
            color: '#fff', fontWeight: 600, fontSize: '14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'slideInRight 0.3s ease',
          }}>
            {toast.msg}
          </div>
        )}

        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <img src={cwLogo} alt="Logo" className="sidebar-logo" />
            <h2>Admin Panel</h2>
          </div>

          <nav className="sidebar-nav">
            {[
              { id: 'overview',      icon: 'mdi:view-dashboard',  label: 'Overview' },
              { id: 'courses',       icon: 'mdi:book-open',        label: 'Courses' },
              { id: 'applications',  icon: 'mdi:file-document-edit', label: `Applications${stats.applications > 0 ? ` (${stats.applications})` : ''}` },
              { id: 'enrollments',   icon: 'mdi:account-school',   label: 'Enrollments' },
              { id: 'tutors',        icon: 'mdi:account-check',    label: 'Tutors' },
              { id: 'students',      icon: 'mdi:account-group',    label: 'Students' },
              { id: 'resources',     icon: 'mdi:link-variant',     label: 'Resources' },
            ].map(tab => (
              <button key={tab.id} className={activeTab === tab.id ? 'active' : ''}
                onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}>
                <Icon icon={tab.icon} width="20" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="profile-pic-container">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="profile-pic" />
                ) : (
                  <div className="profile-pic-placeholder">
                    <Icon icon="mdi:account" width="24" />
                  </div>
                )}
                <button className="profile-pic-edit" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  <Icon icon="mdi:cog" width="14" />
                </button>
                {showProfileMenu && (
                  <div className="profile-menu">
                    <label className="profile-menu-item">
                      <Icon icon="mdi:camera" width="16" /><span>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} ref={fileRef} />
                    </label>
                    <button className="profile-menu-item" onClick={openProfileEdit}>
                      <Icon icon="mdi:account-edit" width="16" /><span>Edit Profile</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="user-info">
                <p className="user-name">{profile?.full_name || 'Admin'}</p>
                <p className="user-role">Administrator</p>
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
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'courses' && 'Manage Courses'}
              {activeTab === 'applications' && 'Course Applications'}
              {activeTab === 'enrollments' && 'Enrollments'}
              {activeTab === 'tutors' && 'Manage Tutors'}
              {activeTab === 'students' && 'Manage Students'}
              {activeTab === 'resources' && 'Course Resources'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#22C55E' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 6px #22C55E' }} />
              {stats.online} online now
            </div>
          </header>

          <div className="dashboard-content">

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div>
                <div className="overview-grid">
                  {[
                    { label: 'Total Courses',       val: stats.courses,      icon: 'mdi:book-open',           color: '#22D3EE' },
                    { label: 'Active Tutors',        val: stats.tutors,       icon: 'mdi:account-check',       color: '#D4AF37' },
                    { label: 'Total Students',       val: stats.students,     icon: 'mdi:account-group',       color: '#22D3EE' },
                    { label: 'Pending Applications', val: stats.applications, icon: 'mdi:file-document-edit',  color: '#F59E0B' },
                    { label: 'Online Now',           val: stats.online,       icon: 'mdi:circle',              color: '#22C55E' },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <Icon icon={s.icon} width="32" style={{ color: s.color }} />
                      <h3>{s.val}</h3>
                      <p>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Applications */}
                <div style={{ marginTop: '28px' }}>
                  <h2 style={{ color: '#D4AF37', marginBottom: '16px', fontSize: '16px', fontWeight: 700 }}>
                    Recent Applications
                  </h2>
                  <div className="data-table">
                    <table>
                      <thead><tr><th>Student</th><th>Course</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                      <tbody>
                        {applications.slice(0, 5).map(app => (
                          <tr key={app.id}>
                            <td>{app.student?.full_name}</td>
                            <td>{app.course?.title}</td>
                            <td>{fmtDate(app.applied_at)}</td>
                            <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                            <td>
                              {app.status === 'pending' && (
                                <div className="action-buttons">
                                  <button className="btn-sm success" onClick={() => reviewApplication(app.id, 'approved', app.student_id, app.course_id)}>Approve</button>
                                  <button className="btn-sm danger" onClick={() => reviewApplication(app.id, 'rejected', app.student_id, app.course_id)}>Reject</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                        {applications.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#8B7355' }}>No applications yet</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── COURSES ── */}
            {activeTab === 'courses' && (
              <>
                <div className="content-header">
                  <div className="search-bar">
                    <Icon icon="mdi:magnify" width="18" />
                    <input placeholder="Search courses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <button className="btn-primary" onClick={() => openModal('add-course')}>
                    <Icon icon="mdi:plus" width="18" /> Add Course
                  </button>
                </div>
                <div className="data-table">
                  <table>
                    <thead><tr><th>Course</th><th>Tutor</th><th>Fee</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filterBySearch(courses, ['title']).map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.title}</strong><br /><small style={{ color: '#8B7355' }}>{c.duration}</small></td>
                          <td>{c.tutor?.full_name || '—'}</td>
                          <td>{c.fee || '—'}</td>
                          <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                          <td>{fmtDate(c.created_at)}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-icon" onClick={() => openModal('edit-course', c)}><Icon icon="mdi:pencil" width="16" /></button>
                              <button className="btn-icon danger" onClick={() => deleteCourse(c.id)}><Icon icon="mdi:delete" width="16" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── APPLICATIONS ── */}
            {activeTab === 'applications' && (
              <>
                <div className="content-header">
                  <div className="search-bar">
                    <Icon icon="mdi:magnify" width="18" />
                    <input placeholder="Search by student..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <div className="data-table">
                  <table>
                    <thead><tr><th>Student</th><th>Email</th><th>Course</th><th>Phone</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {applications.filter(a => !searchTerm || (a.student?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())).map(app => (
                        <tr key={app.id}>
                          <td>{app.student?.full_name}</td>
                          <td>{app.email}</td>
                          <td>{app.course?.title}</td>
                          <td>{app.phone || '—'}</td>
                          <td>{fmtDate(app.applied_at)}</td>
                          <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                          <td>
                            {app.status === 'pending' && (
                              <div className="action-buttons">
                                <button className="btn-sm success" onClick={() => reviewApplication(app.id, 'approved', app.student_id, app.course_id)}>Approve</button>
                                <button className="btn-sm danger" onClick={() => reviewApplication(app.id, 'rejected', app.student_id, app.course_id)}>Reject</button>
                              </div>
                            )}
                            {app.status !== 'pending' && <span style={{ color: '#8B7355', fontSize: '13px' }}>Reviewed</span>}
                          </td>
                        </tr>
                      ))}
                      {applications.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: '#8B7355' }}>No applications</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── ENROLLMENTS ── */}
            {activeTab === 'enrollments' && (
              <>
                <div className="content-header">
                  <div className="search-bar">
                    <Icon icon="mdi:magnify" width="18" />
                    <input placeholder="Search enrollments..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <div className="data-table">
                  <table>
                    <thead><tr><th>Student</th><th>Course</th><th>Enrolled</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {enrollments.filter(e => !searchTerm || (e.student?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())).map(e => (
                        <tr key={e.id}>
                          <td>{e.student?.full_name}<br /><small style={{ color: '#8B7355' }}>{e.student?.email}</small></td>
                          <td>{e.course?.title}</td>
                          <td>{fmtDate(e.enrolled_at)}</td>
                          <td><span className={`status-badge ${e.status}`}>{e.status}</span></td>
                          <td>
                            <div className="action-buttons">
                              {e.status === 'enrolled' && (
                                <button className="btn-sm success" onClick={() => updateEnrollmentStatus(e.id, 'completed')}>Mark Complete</button>
                              )}
                              <button className="btn-icon danger" onClick={() => removeEnrollment(e.id)}><Icon icon="mdi:delete" width="16" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {enrollments.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#8B7355' }}>No enrollments yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── TUTORS ── */}
            {activeTab === 'tutors' && (
              <>
                <div className="content-header">
                  <div className="search-bar">
                    <Icon icon="mdi:magnify" width="18" />
                    <input placeholder="Search tutors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <div className="data-table">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Last Seen</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filterBySearch(tutors, ['full_name', 'email']).map(t => (
                        <tr key={t.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: isOnline(t.last_seen) ? '#22C55E' : '#6B7280', flexShrink: 0
                              }} />
                              {t.avatar_url ? <img src={t.avatar_url} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} /> : null}
                              {t.full_name || '—'}
                            </div>
                          </td>
                          <td>{t.email}</td>
                          <td><span className={`status-badge ${t.status}`}>{t.status}</span></td>
                          <td>{fmtDate(t.last_seen)}</td>
                          <td>
                            <div className="action-buttons">
                              <select value={t.status} onChange={e => updateUserStatus(t.id, e.target.value)}
                                style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.3)', background: 'transparent', color: '#D4AF37', cursor: 'pointer' }}>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                              </select>
                              <button className="btn-icon danger" onClick={() => deleteUser(t.id)}><Icon icon="mdi:delete" width="16" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {tutors.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#8B7355' }}>No tutors registered</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── STUDENTS ── */}
            {activeTab === 'students' && (
              <>
                <div className="content-header">
                  <div className="search-bar">
                    <Icon icon="mdi:magnify" width="18" />
                    <input placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <div className="data-table">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filterBySearch(students, ['full_name', 'email']).map(s => (
                        <tr key={s.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isOnline(s.last_seen) ? '#22C55E' : '#6B7280', flexShrink: 0 }} />
                              {s.avatar_url ? <img src={s.avatar_url} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} /> : null}
                              {s.full_name || '—'}
                            </div>
                          </td>
                          <td>{s.email}</td>
                          <td>{s.phone || '—'}</td>
                          <td><span className={`status-badge ${s.status}`}>{s.status}</span></td>
                          <td>{fmtDate(s.created_at)}</td>
                          <td>
                            <div className="action-buttons">
                              <select value={s.status} onChange={e => updateUserStatus(s.id, e.target.value)}
                                style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.3)', background: 'transparent', color: '#D4AF37', cursor: 'pointer' }}>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                              </select>
                              <button className="btn-icon danger" onClick={() => deleteUser(s.id)}><Icon icon="mdi:delete" width="16" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {students.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#8B7355' }}>No students registered</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── RESOURCES ── */}
            {activeTab === 'resources' && (
              <>
                <div className="data-table">
                  <table>
                    <thead><tr><th>Title</th><th>Course</th><th>Tutor</th><th>URL</th><th>Posted</th></tr></thead>
                    <tbody>
                      {resources.map(r => (
                        <tr key={r.id}>
                          <td>{r.title}<br /><small style={{ color: '#8B7355' }}>{r.description}</small></td>
                          <td>{r.course?.title}</td>
                          <td>{r.tutor?.full_name}</td>
                          <td><a href={r.url} target="_blank" rel="noreferrer" style={{ color: '#22D3EE', fontSize: '13px' }}>Open Link ↗</a></td>
                          <td>{fmtDate(r.created_at)}</td>
                        </tr>
                      ))}
                      {resources.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#8B7355' }}>No resources posted</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </div>
        </main>

        {/* Course Modal */}
        {showModal && (modalType === 'add-course' || modalType === 'edit-course') && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modalType === 'add-course' ? 'Add New Course' : 'Edit Course'}</h2>
                <button className="btn-icon" onClick={() => setShowModal(false)}><Icon icon="mdi:close" width="20" /></button>
              </div>
              <div className="modal-body">
                {[
                  { label: 'Course Title', key: 'title', type: 'text', ph: 'e.g. Advanced React Development' },
                  { label: 'Duration',     key: 'duration', type: 'text', ph: 'e.g. 8 weeks' },
                  { label: 'Schedule',     key: 'schedule', type: 'text', ph: 'e.g. Mon, Wed, Fri - 7:00 PM' },
                  { label: 'Fee (UGX)',    key: 'fee',      type: 'text', ph: 'e.g. 500,000 UGX' },
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
                  <label>Assign Tutor</label>
                  <select value={formData.tutor_id || ''} className="form-select"
                    onChange={e => setFormData({ ...formData, tutor_id: e.target.value })}>
                    <option value="">— No Tutor Assigned —</option>
                    {tutors.map(t => <option key={t.id} value={t.id}>{t.full_name} ({t.email})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status || 'active'} className="form-select"
                    onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={saveCourse} disabled={saving}>
                  <Icon icon="mdi:content-save" width="18" /> {saving ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Edit Modal */}
        {editingProfile && (
          <div className="modal-overlay" onClick={() => setEditingProfile(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button className="btn-icon" onClick={() => setEditingProfile(false)}><Icon icon="mdi:close" width="20" /></button>
              </div>
              <div className="modal-body">
                {[
                  { label: 'Full Name', key: 'full_name', type: 'text' },
                  { label: 'Phone', key: 'phone', type: 'tel' },
                ].map(f => (
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
