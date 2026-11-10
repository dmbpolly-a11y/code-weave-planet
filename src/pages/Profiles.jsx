import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import PaymentModal from '../components/PaymentModal';
import cwLogo from '../../public/images/Cwlogo.png';
import {
  getProfiles,
  saveProfile,
  deleteProfile,
  getSavedMyProfileId,
  normalizeSocialUrl
} from '../services/profilesService';
import '../styles/profiles.css';

const WHATSAPP_NUMBER = "0750937506";

const POPULAR_SKILLS = [
  'React', 'Vite', 'JavaScript', 'Python', 'PHP Laravel', 'TensorFlow',
  'UI/UX Design', 'Figma', 'Digital Marketing', 'SEO', 'Video Editing',
  'Flutter', 'React Native', 'Cloud Hosting', 'MySQL', 'Tailwind CSS'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CodeWeaver1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CodeWeaver2'
];

export default function Profiles() {
  const navigate = useNavigate();
  const { user, profile: authProfile } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentSkillInput, setCurrentSkillInput] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // My profile tracking
  const [myProfileId, setMyProfileId] = useState(() => getSavedMyProfileId());

  // Form State
  const initialFormState = {
    id: '',
    full_name: '',
    email: '',
    phone: '',
    headline: '',
    role: 'student',
    role_title: '',
    location: 'Mbarara, Uganda',
    avatar_url: PRESET_AVATARS[0],
    bio: '',
    skills: ['Web Development', 'React'],
    social_links: {
      github: '',
      linkedin: '',
      twitter: '',
      whatsapp: '',
      instagram: '',
      youtube: '',
      tiktok: '',
      telegram: '',
      website: '',
      facebook: ''
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load profiles
  const fetchAllProfiles = async () => {
    setLoading(true);
    try {
      const data = await getProfiles();
      setProfiles(data);
    } catch (err) {
      console.error(err);
      showToast('Could not load profiles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  // Check if current user has an existing profile in the list
  const userExistingProfile = useMemo(() => {
    if (user?.id) {
      const found = profiles.find(p => p.id === user.id || p.email === user.email);
      if (found) return found;
    }
    if (myProfileId) {
      const found = profiles.find(p => p.id === myProfileId);
      if (found) return found;
    }
    return null;
  }, [profiles, user, myProfileId]);

  // Open Create Form
  const handleOpenCreate = () => {
    if (userExistingProfile) {
      handleOpenEdit(userExistingProfile);
      return;
    }

    setFormData({
      ...initialFormState,
      id: user?.id || `cw-profile-${Date.now()}`,
      full_name: authProfile?.full_name || '',
      email: user?.email || '',
      phone: authProfile?.phone || '',
      role: authProfile?.role || 'student',
      role_title: authProfile?.role ? (authProfile.role.charAt(0).toUpperCase() + authProfile.role.slice(1)) : 'Student',
      avatar_url: authProfile?.avatar_url || PRESET_AVATARS[0],
      bio: authProfile?.bio || '',
      skills: ['Web Development', 'React'],
      social_links: {
        github: '',
        linkedin: '',
        twitter: '',
        whatsapp: authProfile?.phone ? normalizeSocialUrl('whatsapp', authProfile.phone) : '',
        instagram: '',
        youtube: '',
        tiktok: '',
        telegram: '',
        website: '',
        facebook: ''
      }
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Form for a profile
  const handleOpenEdit = (profileToEdit) => {
    setFormData({
      id: profileToEdit.id,
      full_name: profileToEdit.full_name || '',
      email: profileToEdit.email || '',
      phone: profileToEdit.phone || '',
      headline: profileToEdit.headline || '',
      role: profileToEdit.role || 'student',
      role_title: profileToEdit.role_title || '',
      location: profileToEdit.location || 'Mbarara, Uganda',
      avatar_url: profileToEdit.avatar_url || PRESET_AVATARS[0],
      bio: profileToEdit.bio || '',
      skills: Array.isArray(profileToEdit.skills) ? profileToEdit.skills : [],
      social_links: {
        github: profileToEdit.social_links?.github || '',
        linkedin: profileToEdit.social_links?.linkedin || '',
        twitter: profileToEdit.social_links?.twitter || '',
        whatsapp: profileToEdit.social_links?.whatsapp || '',
        instagram: profileToEdit.social_links?.instagram || '',
        youtube: profileToEdit.social_links?.youtube || '',
        tiktok: profileToEdit.social_links?.tiktok || '',
        telegram: profileToEdit.social_links?.telegram || '',
        website: profileToEdit.social_links?.website || '',
        facebook: profileToEdit.social_links?.facebook || ''
      }
    });
    setIsFormModalOpen(true);
  };

  // Delete profile
  const handleDeleteProfile = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this profile?')) return;
    const ok = await deleteProfile(id);
    if (ok) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (myProfileId === id) setMyProfileId(null);
      if (viewingProfile?.id === id) setViewingProfile(null);
      showToast('Profile deleted successfully.');
    } else {
      showToast('Could not delete profile', 'error');
    }
  };

  // Add skill tag
  const handleAddSkill = (skillToAdd) => {
    const s = (skillToAdd || currentSkillInput).trim();
    if (!s) return;
    if (!formData.skills.includes(s)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, s]
      }));
    }
    setCurrentSkillInput('');
  };

  // Remove skill tag
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Handle avatar upload via file reader
  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image file too large (max 2MB)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    setSaving(true);
    try {
      const saved = await saveProfile(formData, user);
      setMyProfileId(saved.id);
      showToast('Your profile has been created and published!');
      setIsFormModalOpen(false);
      await fetchAllProfiles();
      setViewingProfile(saved);
    } catch (err) {
      console.error(err);
      showToast('Failed to save profile. Please check your inputs.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filtered & Sorted profiles
  const filteredProfiles = useMemo(() => {
    return profiles
      .filter(p => {
        const matchesRole = selectedRole === 'all' || p.role === selectedRole;
        if (!matchesRole) return false;

        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        const nameMatch = p.full_name?.toLowerCase().includes(q);
        const headlineMatch = p.headline?.toLowerCase().includes(q);
        const bioMatch = p.bio?.toLowerCase().includes(q);
        const locMatch = p.location?.toLowerCase().includes(q);
        const skillMatch = p.skills?.some(s => s.toLowerCase().includes(q));

        return nameMatch || headlineMatch || bioMatch || locMatch || skillMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        if (sortBy === 'name') {
          return (a.full_name || '').localeCompare(b.full_name || '');
        }
        if (sortBy === 'skills') {
          return (b.skills?.length || 0) - (a.skills?.length || 0);
        }
        return 0;
      });
  }, [profiles, selectedRole, searchTerm, sortBy]);

  // Social icon helper
  const renderSocialIcon = (platform) => {
    switch (platform) {
      case 'github': return <Icon icon="mdi:github" />;
      case 'linkedin': return <Icon icon="mdi:linkedin" />;
      case 'twitter': return <Icon icon="ri:twitter-x-fill" />;
      case 'whatsapp': return <Icon icon="mdi:whatsapp" />;
      case 'instagram': return <Icon icon="mdi:instagram" />;
      case 'youtube': return <Icon icon="mdi:youtube" />;
      case 'tiktok': return <Icon icon="ic:baseline-tiktok" />;
      case 'telegram': return <Icon icon="mdi:telegram" />;
      case 'website': return <Icon icon="mdi:earth" />;
      case 'facebook': return <Icon icon="mdi:facebook" />;
      default: return <Icon icon="mdi:link" />;
    }
  };

  // Check if profile belongs to current user
  const isMyProfile = (p) => {
    if (user?.id && p.id === user.id) return true;
    if (myProfileId && p.id === myProfileId) return true;
    if (user?.email && p.email === user.email) return true;
    return Boolean(p.is_user_owned);
  };

  return (
    <PageTransition>
      <div className="profiles-page">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 9999,
              padding: '14px 20px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: toastMessage.type === 'error' ? '#EF4444' : '#10B981',
              color: '#FFFFFF',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            <Icon icon={toastMessage.type === 'error' ? 'mdi:alert-circle' : 'mdi:check-circle'} width="20" />
            {toastMessage.msg}
          </div>
        )}

        {/* Unified Global Navigation Header with Mobile Hamburger */}
        <GlobalHeader onOpenPayment={() => setShowPaymentModal(true)} />

        {/* Hero Section */}
        <section className="profiles-hero">
          <div className="profiles-hero-badge">
            <Icon icon="mdi:account-group" width="16" />
            Code Weave Community
          </div>

          <h1 className="profiles-hero-title">
            Meet Our Builders, Tutors & Students
          </h1>

          <p className="profiles-hero-subtitle">
            Create your custom tech profile, showcase your skills, and link all your social media platforms.
            Connect with learners and instructors across Western Uganda and beyond.
          </p>

          <div className="profiles-hero-cta-group">
            <button onClick={handleOpenCreate} className="profiles-btn-create" style={{ fontSize: 16, padding: '12px 24px' }}>
              <Icon icon="mdi:card-account-details-outline" width="20" />
              {userExistingProfile ? 'Update Your Profile' : 'Fill Form & Create Your Profile'}
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="profiles-btn-create"
              style={{ fontSize: 15, padding: '12px 20px', background: '#FFFDF0', color: '#92400E', border: '1.5px solid #C99726' }}
            >
              <Icon icon="mdi:cash-fast" width="18" color="#C99726" />
              Pay Tuition (MTN/Airtel/Bank)
            </button>
            <a
              href={`https://wa.me/256${WHATSAPP_NUMBER.slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="profiles-btn-secondary"
              style={{ fontSize: 15, padding: '12px 20px' }}
            >
              <Icon icon="mdi:whatsapp" width="18" style={{ color: '#25D366' }} />
              Join WhatsApp Community
            </a>
          </div>

          {/* Stats Ribbon */}
          <div className="profiles-stats-ribbon">
            <div className="stat-item">
              <span className="stat-number">{profiles.length}+</span>
              <span className="stat-label">Member Profiles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {profiles.filter(p => p.role === 'tutor').length || 4}
              </span>
              <span className="stat-label">Active Instructors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Social Platforms</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Free Community</span>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="profiles-container">
          {/* Search & Filter Toolbar */}
          <div className="profiles-toolbar">
            <div className="toolbar-top">
              <div className="search-input-box">
                <Icon icon="mdi:magnify" className="search-icon" width="20" />
                <input
                  type="text"
                  placeholder="Search by name, skill (e.g. React, Python), headline, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="sort-select-box">
                <Icon icon="mdi:sort" width="18" style={{ color: '#8B96AC' }} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="name">Alphabetical (A-Z)</option>
                  <option value="skills">Most Skills</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="category-pills">
              {[
                { id: 'all', label: 'All Profiles' },
                { id: 'tutor', label: 'Tutors & Mentors' },
                { id: 'student', label: 'Students' },
                { id: 'developer', label: 'Developers' },
                { id: 'designer', label: 'UI/UX Designers' },
                { id: 'marketer', label: 'Digital Marketers' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedRole(cat.id)}
                  className={`category-pill ${selectedRole === cat.id ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count & action */}
          <div className="results-count">
            <span>
              Showing <strong>{filteredProfiles.length}</strong> {filteredProfiles.length === 1 ? 'profile' : 'profiles'}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
            {userExistingProfile && (
              <span style={{ color: '#22D3EE', fontSize: 13, cursor: 'pointer' }} onClick={() => handleOpenEdit(userExistingProfile)}>
                ⭐ You have an active profile ({userExistingProfile.full_name})
              </span>
            )}
          </div>

          {/* Profiles Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8B96AC' }}>
              <Icon icon="mdi:loading" className="spin-animation" width="40" style={{ color: '#22D3EE' }} />
              <p style={{ marginTop: 12 }}>Loading community profiles...</p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="empty-state">
              <Icon icon="mdi:account-search" className="empty-state-icon" />
              <h3 className="empty-state-title">No Profiles Found</h3>
              <p className="empty-state-desc">
                We couldn't find any profile matching your filters. Be the first to create one!
              </p>
              <button onClick={handleOpenCreate} className="profiles-btn-create">
                <Icon icon="mdi:plus" width="18" />
                Create New Profile
              </button>
            </div>
          ) : (
            <div className="profiles-grid">
              {filteredProfiles.map((p) => {
                const owned = isMyProfile(p);
                const socialEntries = Object.entries(p.social_links || {}).filter(([_, url]) => Boolean(url));

                return (
                  <article key={p.id} className="profile-card">
                    {/* Banner */}
                    <div className="profile-card-banner">
                      <div className="profile-card-pattern"></div>
                      <span className={`role-badge ${p.role || 'student'}`}>
                        {p.role_title || p.role || 'Member'}
                      </span>
                    </div>

                    <div className="profile-card-body">
                      {/* Avatar */}
                      <div className="profile-avatar-wrapper">
                        <img
                          src={p.avatar_url || PRESET_AVATARS[0]}
                          alt={p.full_name}
                          className="profile-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = PRESET_AVATARS[0];
                          }}
                        />
                        {p.is_verified && (
                          <div className="verified-dot" title="Verified Member">
                            <Icon icon="mdi:check" />
                          </div>
                        )}
                      </div>

                      {/* Header Info */}
                      <div className="profile-name-row">
                        <h3 className="profile-name">
                          {p.full_name}
                        </h3>
                        {owned && (
                          <span style={{ fontSize: 11, background: 'rgba(34,211,238,0.15)', color: '#22D3EE', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                            You
                          </span>
                        )}
                      </div>

                      <div className="profile-headline">
                        {p.headline || 'Code Weave Member'}
                      </div>

                      <div className="profile-location">
                        <Icon icon="mdi:map-marker" width="14" style={{ color: '#D4AF37' }} />
                        {p.location || 'Uganda'}
                      </div>

                      <p className="profile-bio">
                        {p.bio || 'Building skills and projects on Code Weave Planet.'}
                      </p>

                      {/* Skills */}
                      {p.skills && p.skills.length > 0 && (
                        <div className="profile-skills">
                          {p.skills.slice(0, 4).map((sk, idx) => (
                            <span key={idx} className="skill-chip">
                              {sk}
                            </span>
                          ))}
                          {p.skills.length > 4 && (
                            <span className="skill-chip" style={{ color: '#22D3EE' }}>
                              +{p.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Social Links Row */}
                      {socialEntries.length > 0 && (
                        <div className="profile-social-bar">
                          {socialEntries.map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`social-icon-btn ${platform}`}
                              title={`${platform.toUpperCase()}: ${url}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {renderSocialIcon(platform)}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      <div className="profile-card-footer">
                        <button
                          onClick={() => setViewingProfile(p)}
                          className="btn-view-profile"
                        >
                          <Icon icon="mdi:eye" width="16" />
                          View Full Profile
                        </button>

                        {owned && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="card-action-icon"
                              title="Edit this profile"
                            >
                              <Icon icon="mdi:pencil" width="16" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteProfile(p.id, e)}
                              className="card-action-icon delete"
                              title="Delete this profile"
                            >
                              <Icon icon="mdi:trash-can-outline" width="16" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        {/* ======================================================== */}
        {/* MODAL 1: CREATE / EDIT PROFILE FORM                      */}
        {/* ======================================================== */}
        {isFormModalOpen && (
          <div className="profiles-modal-overlay" onClick={() => setIsFormModalOpen(false)}>
            <div
              className="profiles-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: showLivePreview ? 960 : 760 }}
            >
              {/* Header Bar */}
              <div className="modal-header-bar">
                <div className="modal-title-group">
                  <div className="modal-icon-badge">
                    <Icon icon="mdi:account-edit" width="22" />
                  </div>
                  <div>
                    <h2 className="modal-title">
                      {formData.id && profiles.some(p => p.id === formData.id) ? 'Edit Your Profile' : 'Create Community Profile'}
                    </h2>
                    <p className="modal-subtitle">
                      Fill out your information and connect all your social networks
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowLivePreview(!showLivePreview)}
                    className="profiles-btn-secondary"
                    style={{ fontSize: 12, padding: '6px 12px' }}
                  >
                    <Icon icon="mdi:cellphone-link" width="16" />
                    {showLivePreview ? 'Hide Preview' : 'Live Preview'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="modal-close-btn"
                  >
                    <Icon icon="mdi:close" width="20" />
                  </button>
                </div>
              </div>

              {/* Form & Optional Live Preview Body */}
              <div
                className="modal-scrollable-body"
                style={{
                  display: showLivePreview ? 'grid' : 'block',
                  gridTemplateColumns: showLivePreview ? '1fr 340px' : '1fr',
                  gap: 24
                }}
              >
                {/* The Form */}
                <form id="profile-form" onSubmit={handleFormSubmit}>
                  <div className="profile-form-grid">
                    {/* Full Name */}
                    <div className="form-group">
                      <label className="form-label">
                        Full Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Mugabi"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    {/* Category / Role */}
                    <div className="form-group">
                      <label className="form-label">Role / Category</label>
                      <select
                        value={formData.role}
                        onChange={(e) => {
                          const r = e.target.value;
                          setFormData({
                            ...formData,
                            role: r,
                            role_title: r.charAt(0).toUpperCase() + r.slice(1)
                          });
                        }}
                        className="form-select"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor / Instructor</option>
                        <option value="developer">Developer</option>
                        <option value="designer">UI/UX Designer</option>
                        <option value="marketer">Digital Marketer</option>
                        <option value="alumni">Alumni / Graduate</option>
                      </select>
                    </div>

                    {/* Headline */}
                    <div className="form-group form-full-width">
                      <label className="form-label">
                        Professional Headline / Specialization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. React & Laravel Developer | AI Enthusiast"
                        value={formData.headline}
                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">WhatsApp or Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 0750937506 or +256..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    {/* Location */}
                    <div className="form-group form-full-width">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Mbarara, Uganda"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    {/* Avatar Selection */}
                    <div className="form-group form-full-width">
                      <label className="form-label">
                        Profile Picture / Avatar
                      </label>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <img
                          src={formData.avatar_url || PRESET_AVATARS[0]}
                          alt="Avatar Preview"
                          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #22D3EE' }}
                        />
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            placeholder="Enter image URL or select from presets below"
                            value={formData.avatar_url}
                            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                            className="form-input"
                          />
                        </div>
                        <label
                          className="profiles-btn-secondary"
                          style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          <Icon icon="mdi:upload" width="16" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvatarFileUpload}
                          />
                        </label>
                      </div>

                      {/* Quick Avatar Presets */}
                      <div className="avatar-preset-selector">
                        <span className="preset-title">Or pick a quick avatar:</span>
                        <div className="preset-grid">
                          {PRESET_AVATARS.map((av, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setFormData({ ...formData, avatar_url: av })}
                              className={`preset-avatar-btn ${formData.avatar_url === av ? 'selected' : ''}`}
                            >
                              <img src={av} alt={`Preset ${idx + 1}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="form-group form-full-width">
                      <label className="form-label">About You / Biography</label>
                      <textarea
                        rows="3"
                        placeholder="Share a short bio, your tech journey, or what you are currently learning/building..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="form-textarea"
                      />
                    </div>

                    {/* Skills Manager */}
                    <div className="form-group form-full-width">
                      <label className="form-label">Skills & Technologies</label>
                      <div className="skills-input-wrapper">
                        <input
                          type="text"
                          placeholder="Type a skill (e.g. Next.js, Python) and press Enter"
                          value={currentSkillInput}
                          onChange={(e) => setCurrentSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                          className="form-input"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSkill()}
                          className="btn-add-skill"
                        >
                          + Add
                        </button>
                      </div>

                      {/* Active skill tags */}
                      <div className="active-skills-tags">
                        {formData.skills.map((s, idx) => (
                          <span key={idx} className="editable-skill-tag">
                            {s}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(s)}
                              className="btn-remove-tag"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Popular Quick Suggestions */}
                      <div className="quick-skills-suggestions">
                        <span style={{ fontSize: 11, color: '#8B96AC' }}>Quick add:</span>
                        {POPULAR_SKILLS.slice(0, 8).map(sk => (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => handleAddSkill(sk)}
                            className="quick-skill-btn"
                          >
                            + {sk}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* SOCIAL MEDIA LINKS SECTION                               */}
                    {/* ======================================================== */}
                    <div className="form-full-width social-inputs-section">
                      <h4 className="social-section-title">
                        <Icon icon="mdi:share-variant" width="18" />
                        Social Media & Portfolio Links
                      </h4>
                      <p className="social-section-desc">
                        Add links to your social profiles. You can enter full URLs or just your handle/username.
                      </p>

                      <div className="social-inputs-grid">
                        {/* GitHub */}
                        <div className="social-input-group">
                          <Icon icon="mdi:github" className="social-input-icon" />
                          <input
                            type="text"
                            placeholder="GitHub (username or url)"
                            value={formData.social_links.github}
                            onChange={(e) => setFormData({
                              ...formData,
                              social_links: { ...formData.social_links, github: e.target.value }
                            })}
                            className="social-input"
                          />
                        </div>

                        {/* LinkedIn */}
                        <div className="social-input-group">
                          <Icon icon="mdi:linkedin" className="social-input-icon" style={{ color: '#0A66C2' }} />
                          <input
                            type="text"
                            placeholder="LinkedIn profile url"
                            value={formData.social_links.linkedin}
                            onChange={(e) => setFormData({
                              ...formData,
                              social_links: { ...formData.social_links, linkedin: e.target.value }
                            })}
                            className="social-input"
                          />
                        </div>

                        {/* Twitter / X */}
                        <div className="social-input-group">
                          <Icon icon="ri:twitter-x-fill" className="social-input-icon" />
                          <input
                            type="text"
                            placeholder="Twitter / X (@handle or url)"
                            value={formData.social_links.twitter}
                            onChange={(e) => setFormData({
                              ...formData,
                              social_links: { ...formData.social_links, twitter: e.target.value }
                            })}
                            className="social-input"
                          />
                        </div>

                        {/* WhatsApp Link */}
                        <div className="social-input-group">
                          <Icon icon="mdi:whatsapp" className="social-input-icon" style={{ color: '#25D366' }} />
                          <input
                            type="text"
                            placeholder="WhatsApp (phone number or wa.me link)"
                            value={formData.social_links.whatsapp}
                            onChange={(e) => setFormData({
                              ...formData,
                              social_links: { ...formData.social_links, whatsapp: e.target.value }
                            })}
                            className="social-input"
                          />
                        </div>

                        {/* Instagram */}
                        <div className="social-input-group">
                          <Icon icon="mdi:instagram" className="social-input-icon" style={{ color: '#E4405F' }} />
                          <input
                            type="text"
                            placeholder="Instagram (@username or url)"
                            value={formData.social_links.instagram}
                            onChange={(e) => setFormData({
                              ...formData,
                              social_links: { ...formData.social_links, instagram: e.target.value }
                            })}
                            className="social-input"
                          />
                        </div>

                        {/* YouTube */}
                        <div className="social-input-group">
                          <Icon icon="mdi:youtube" className="social-input-icon" style={{ color: '#FF0000' }} />
                          <input
                            type="text"
                            placeholder="YouTube channel url"
                            value={formData.social_links.youtube}
                            onChange={(e) => setFormData({
                              ...formData,
                              social_links: { ...formData.social_links, youtube: e.target.value }
                            })}
                            className="social-input"
                          />
                        </div>

                        {/* TikTok */}
                        <div className="social-input-group">
                          <Icon icon="ic:baseline-tiktok" className="social-input-icon" style={{ color: '#00F2FE' }} />
                          <input
                            type="text"
                            placeholder="TikTok (@handle or url)"
                            value={formData.social_links.tiktok}
                            onChange={(e) => setFormData({
                              ...formData,
                              social_links: { ...formData.social_links, tiktok: e.target.value }
                            })}
                            className="social-input"
                          />
                        </div>

                        {/* Telegram */}
                        <div className="social-input-group">
                          <Icon icon="mdi:telegram" className="social-input-icon" style={{ color: '#229ED9' }} />
                          <input
                            type="text"
                            placeholder="Telegram (username or t.me link)"
                            value={formData.social_links.telegram}
                            onChange={(e) => setFormData({
                              ...formData,
                              social_links: { ...formData.social_links, telegram: e.target.value }
                            })}
                            className="social-input"
                          />
                        </div>

                        {/* Personal Website / Portfolio */}
                        <div className="social-input-group">
                          <Icon icon="mdi:earth" className="social-input-icon" style={{ color: '#D4AF37' }} />
                          <input
                            type="text"
                            placeholder="Portfolio or personal website url"
                            value={formData.social_links.website}
                            onChange={(e) => setFormData({
                              ...formData,
                              social_links: { ...formData.social_links, website: e.target.value }
                            })}
                            className="social-input"
                          />
                        </div>

                        {/* Facebook */}
                        <div className="social-input-group">
                          <Icon icon="mdi:facebook" className="social-input-icon" style={{ color: '#1877F2' }} />
                          <input
                            type="text"
                            placeholder="Facebook profile url"
                            value={formData.social_links.facebook}
                            onChange={(e) => setFormData({
                              ...formData,
                              social_links: { ...formData.social_links, facebook: e.target.value }
                            })}
                            className="social-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Optional Live Preview Sidebar */}
                {showLivePreview && (
                  <div style={{ position: 'sticky', top: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#D4AF37', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon icon="mdi:eye-outline" width="16" />
                      Live Card Preview
                    </div>
                    <div className="profile-card" style={{ boxShadow: 'none' }}>
                      <div className="profile-card-banner">
                        <span className={`role-badge ${formData.role}`}>
                          {formData.role_title || formData.role}
                        </span>
                      </div>
                      <div className="profile-card-body">
                        <div className="profile-avatar-wrapper">
                          <img
                            src={formData.avatar_url || PRESET_AVATARS[0]}
                            alt="Preview"
                            className="profile-avatar"
                          />
                        </div>
                        <h4 className="profile-name">{formData.full_name || 'Your Full Name'}</h4>
                        <div className="profile-headline">{formData.headline || 'Your Headline Here'}</div>
                        <div className="profile-location">
                          <Icon icon="mdi:map-marker" width="14" style={{ color: '#D4AF37' }} />
                          {formData.location || 'Mbarara, Uganda'}
                        </div>
                        <p className="profile-bio">{formData.bio || 'Your bio will appear here...'}</p>
                        <div className="profile-skills">
                          {formData.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="skill-chip">{s}</span>
                          ))}
                        </div>
                        <div className="profile-social-bar">
                          {Object.entries(formData.social_links)
                            .filter(([_, u]) => Boolean(u))
                            .map(([platform]) => (
                              <span key={platform} className={`social-icon-btn ${platform}`}>
                                {renderSocialIcon(platform)}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="modal-footer-bar">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="profiles-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="profile-form"
                  disabled={saving}
                  className="profiles-btn-create"
                >
                  {saving ? (
                    <>
                      <Icon icon="mdi:loading" className="spin-animation" width="16" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:check" width="16" />
                      Publish & Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 2: FULL PROFILE VIEW DETAILS                       */}
        {/* ======================================================== */}
        {viewingProfile && (
          <div className="profiles-modal-overlay" onClick={() => setViewingProfile(null)}>
            <div
              className="profiles-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 680 }}
            >
              {/* Header Image banner */}
              <div className="detail-modal-header">
                <button
                  onClick={() => setViewingProfile(null)}
                  className="modal-close-btn"
                  style={{ background: 'rgba(0,0,0,0.4)' }}
                >
                  <Icon icon="mdi:close" width="20" />
                </button>
              </div>

              {/* Body */}
              <div className="detail-modal-body">
                <div className="detail-avatar-row">
                  <img
                    src={viewingProfile.avatar_url || PRESET_AVATARS[0]}
                    alt={viewingProfile.full_name}
                    className="detail-avatar"
                  />
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className={`role-badge ${viewingProfile.role}`}>
                      {viewingProfile.role_title || viewingProfile.role}
                    </span>
                    {isMyProfile(viewingProfile) && (
                      <button
                        onClick={() => {
                          setViewingProfile(null);
                          handleOpenEdit(viewingProfile);
                        }}
                        className="profiles-btn-secondary"
                        style={{ fontSize: 12, padding: '6px 12px' }}
                      >
                        <Icon icon="mdi:pencil" width="14" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#EDEFF7' }}>
                  {viewingProfile.full_name}
                </h2>

                <div style={{ fontSize: 15, color: '#22D3EE', fontWeight: 600, marginBottom: 8 }}>
                  {viewingProfile.headline || 'Code Weave Planet Community Member'}
                </div>

                <div style={{ display: 'flex', gap: 16, color: '#8B96AC', fontSize: 13, marginBottom: 20, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon icon="mdi:map-marker" width="16" style={{ color: '#D4AF37' }} />
                    {viewingProfile.location || 'Uganda'}
                  </span>
                  {viewingProfile.email && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon icon="mdi:email-outline" width="16" />
                      {viewingProfile.email}
                    </span>
                  )}
                  {viewingProfile.phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon icon="mdi:phone-outline" width="16" />
                      {viewingProfile.phone}
                    </span>
                  )}
                </div>

                {/* About Section */}
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#D4AF37', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    About & Bio
                  </h4>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: '#C0C8D6', whiteSpace: 'pre-line', margin: 0 }}>
                    {viewingProfile.bio || 'No bio provided yet.'}
                  </p>
                </div>

                {/* Skills Section */}
                {viewingProfile.skills && viewingProfile.skills.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#D4AF37', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Skills & Tech Stack
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {viewingProfile.skills.map((sk, idx) => (
                        <span key={idx} className="skill-chip" style={{ fontSize: 12, padding: '5px 10px' }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Networks Section */}
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#D4AF37', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Connected Social Media & Links
                  </h4>
                  {viewingProfile.social_links && Object.keys(viewingProfile.social_links).some(k => Boolean(viewingProfile.social_links[k])) ? (
                    <div className="detail-social-grid">
                      {Object.entries(viewingProfile.social_links)
                        .filter(([_, url]) => Boolean(url))
                        .map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="detail-social-btn"
                          >
                            <span style={{ fontSize: 18 }}>{renderSocialIcon(platform)}</span>
                            <span style={{ textTransform: 'capitalize' }}>{platform}</span>
                            <Icon icon="mdi:open-in-new" width="14" style={{ marginLeft: 'auto', opacity: 0.6 }} />
                          </a>
                        ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: '#8B96AC' }}>
                      No social media accounts linked to this profile yet.
                    </p>
                  )}
                </div>

                {/* Fast Action: Direct WhatsApp message */}
                {viewingProfile.phone && (
                  <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <a
                      href={normalizeSocialUrl('whatsapp', viewingProfile.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="profiles-btn-create"
                      style={{
                        background: '#25D366',
                        color: '#FFFFFF',
                        width: '100%',
                        justifyContent: 'center',
                        fontSize: 15,
                        boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)'
                      }}
                    >
                      <Icon icon="mdi:whatsapp" width="20" />
                      Chat with {viewingProfile.full_name.split(' ')[0]} on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Steering Wheel Circle and Modular Animated Footer in Blocks */}
        <GlobalFooter />

        {/* Embedded Global Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      </div>
    </PageTransition>
  );
}
