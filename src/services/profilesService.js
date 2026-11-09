// profilesService.js
// Storage and management service for Code Weave Planet community profiles
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEY = 'codeweave_planet_profiles';
const MY_PROFILE_KEY = 'codeweave_planet_my_profile_id';

// Default initial profiles to showcase the community
export const INITIAL_PROFILES = [
  {
    id: 'cw-profile-lead-1',
    full_name: 'Emmanuel Mugisha',
    role: 'tutor',
    role_title: 'Lead Tutor & Senior Software Engineer',
    headline: 'Full-Stack Developer | Laravel, React & Cloud Architect',
    bio: 'Passionate about training next-generation software developers in Uganda. Over 7 years experience building scalable web solutions, backend microservices, and leading tech mentorship bootcamps.',
    location: 'Mbarara, Uganda',
    email: 'emmanuel@codeweave.com',
    phone: '+256750937506',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    skills: ['PHP Laravel', 'React', 'MySQL', 'System Architecture', 'REST APIs', 'Cloud Hosting'],
    social_links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
      whatsapp: 'https://wa.me/256750937506',
      website: 'https://codeweaveplanet.com'
    },
    status: 'active',
    is_verified: true,
    created_at: '2026-01-10T10:00:00.000Z',
    updated_at: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'cw-profile-lead-2',
    full_name: 'Lydia Namutebi',
    role: 'designer',
    role_title: 'UI/UX & Product Designer',
    headline: 'Crafting Human-Centered Digital Experiences & Design Systems',
    bio: 'Specialized in turning complex workflows into sleek, accessible, and delightful mobile and web interfaces. Mentoring aspiring UI/UX designers and collaborating on African open source products.',
    location: 'Kampala, Uganda',
    email: 'lydia.design@codeweave.com',
    phone: '+256701234567',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'React Frontends', 'Wireframing', 'Prototyping'],
    social_links: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
      instagram: 'https://instagram.com',
      website: 'https://behance.net',
      whatsapp: 'https://wa.me/256701234567'
    },
    status: 'active',
    is_verified: true,
    created_at: '2026-01-15T11:30:00.000Z',
    updated_at: '2026-01-15T11:30:00.000Z'
  },
  {
    id: 'cw-profile-lead-3',
    full_name: 'Brian Kato',
    role: 'tutor',
    role_title: 'AI & Data Science Instructor',
    headline: 'Machine Learning Engineer & Data Scientist',
    bio: 'Building AI pipelines and teaching students how to move from basic Python scripting to deploying production machine learning models and computer vision pipelines.',
    location: 'Mbarara, Uganda',
    email: 'brian.kato@codeweave.com',
    phone: '+256782345678',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'FastAPI', 'Neural Networks'],
    social_links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com',
      twitter: 'https://x.com'
    },
    status: 'active',
    is_verified: true,
    created_at: '2026-02-01T08:00:00.000Z',
    updated_at: '2026-02-01T08:00:00.000Z'
  },
  {
    id: 'cw-profile-student-1',
    full_name: 'Sarah Ahimbisibwe',
    role: 'marketer',
    role_title: 'Digital Marketer & Growth Strategist',
    headline: 'SEO Expert | Social Media Campaign Strategist & Brand Storyteller',
    bio: 'Helping local brands and tech startups scale their reach across East Africa with high-converting Facebook Ads, organic SEO, and viral short-form video content.',
    location: 'Mbarara, Uganda',
    email: 'sarah.growth@codeweave.com',
    phone: '+256775678901',
    avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    skills: ['SEO', 'Google Ads', 'Content Strategy', 'TikTok Ads', 'Analytics', 'Copywriting'],
    social_links: {
      instagram: 'https://instagram.com',
      tiktok: 'https://tiktok.com',
      linkedin: 'https://linkedin.com',
      whatsapp: 'https://wa.me/256775678901'
    },
    status: 'active',
    is_verified: false,
    created_at: '2026-02-10T14:20:00.000Z',
    updated_at: '2026-02-10T14:20:00.000Z'
  },
  {
    id: 'cw-profile-student-2',
    full_name: 'Derrick Twinomujuni',
    role: 'student',
    role_title: 'Mobile App Developer & Code Weave Student',
    headline: 'Building cross-platform Android & iOS apps with Flutter and React Native',
    bio: 'Enrolled in Code Weave Planet mobile track. Currently building practical fintech & agricultural tracking apps for farmers in Western Uganda.',
    location: 'Kabale / Mbarara, Uganda',
    email: 'derrick.apps@codeweave.com',
    phone: '+256758901234',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    skills: ['Flutter', 'React Native', 'Dart', 'Firebase', 'Mobile UI/UX', 'Git'],
    social_links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      telegram: 'https://t.me/derrick_dev',
      twitter: 'https://x.com'
    },
    status: 'active',
    is_verified: false,
    created_at: '2026-02-18T09:15:00.000Z',
    updated_at: '2026-02-18T09:15:00.000Z'
  }
];

// Helper to normalize any social url
export function normalizeSocialUrl(platform, rawValue) {
  if (!rawValue) return '';
  const val = rawValue.trim();
  if (!val) return '';

  if (val.startsWith('http://') || val.startsWith('https://')) {
    return val;
  }

  // Handle specific platforms
  switch (platform) {
    case 'github':
      return `https://github.com/${val.replace(/^@/, '')}`;
    case 'linkedin':
      return val.includes('linkedin.com') ? `https://${val}` : `https://linkedin.com/in/${val.replace(/^@/, '')}`;
    case 'twitter':
    case 'x':
      return `https://x.com/${val.replace(/^@/, '')}`;
    case 'instagram':
      return `https://instagram.com/${val.replace(/^@/, '')}`;
    case 'youtube':
      return val.includes('youtube.com') ? `https://${val}` : `https://youtube.com/@${val.replace(/^@/, '')}`;
    case 'tiktok':
      return `https://tiktok.com/@${val.replace(/^@/, '')}`;
    case 'telegram':
      return `https://t.me/${val.replace(/^@/, '')}`;
    case 'whatsapp': {
      const cleanNum = val.replace(/[^0-9]/g, '');
      if (cleanNum.startsWith('0')) {
        return `https://wa.me/256${cleanNum.slice(1)}`;
      }
      return `https://wa.me/${cleanNum}`;
    }
    case 'facebook':
      return val.includes('facebook.com') ? `https://${val}` : `https://facebook.com/${val}`;
    case 'website':
    default:
      return `https://${val}`;
  }
}

// Get all profiles (localStorage + default seed + Supabase if available)
export async function getProfiles() {
  let stored = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      stored = JSON.parse(raw);
    } else {
      stored = INITIAL_PROFILES;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROFILES));
    }
  } catch (err) {
    console.error('Error reading profiles from localStorage:', err);
    stored = INITIAL_PROFILES;
  }

  // Attempt to enrich with Supabase profiles if configured
  if (isSupabaseConfigured) {
    try {
      const { data: supaProfiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(supaProfiles) && supaProfiles.length > 0) {
        // Map Supabase profiles
        const mappedSupa = supaProfiles.map(sp => ({
          id: sp.id,
          full_name: sp.full_name || 'Anonymous User',
          role: sp.role || 'student',
          role_title: sp.role ? sp.role.charAt(0).toUpperCase() + sp.role.slice(1) : 'Member',
          headline: sp.headline || `${sp.role ? sp.role.toUpperCase() : 'Student'} at Code Weave Planet`,
          bio: sp.bio || 'Tech enthusiast learning and building on Code Weave Planet.',
          location: sp.location || 'Uganda',
          email: sp.email || '',
          phone: sp.phone || '',
          avatar_url: sp.avatar_url || '',
          skills: Array.isArray(sp.skills) ? sp.skills : (typeof sp.skills === 'string' ? sp.skills.split(',').map(s => s.trim()).filter(Boolean) : ['Digital Skills']),
          social_links: sp.social_links || {},
          status: sp.status || 'active',
          is_verified: sp.role === 'admin' || sp.role === 'tutor',
          created_at: sp.created_at,
          updated_at: sp.updated_at
        }));

        // Merge: avoid duplicates by ID or Email
        const existingIds = new Set(stored.map(p => p.id));
        const existingEmails = new Set(stored.map(p => p.email).filter(Boolean));

        const nonDuplicates = mappedSupa.filter(p => !existingIds.has(p.id) && !existingEmails.has(p.email));
        return [...stored, ...nonDuplicates];
      }
    } catch (supaErr) {
      console.warn('Could not sync profiles from Supabase, using local:', supaErr);
    }
  }

  return stored;
}

// Get single profile by ID
export async function getProfileById(id) {
  const all = await getProfiles();
  return all.find(p => p.id === id) || null;
}

// Save or Update a profile
export async function saveProfile(formData, currentUser = null) {
  let stored = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    stored = raw ? JSON.parse(raw) : [...INITIAL_PROFILES];
  } catch (err) {
    stored = [...INITIAL_PROFILES];
  }

  // Normalize all social links
  const normalizedSocial = {};
  if (formData.social_links) {
    Object.entries(formData.social_links).forEach(([platform, url]) => {
      if (url && url.trim()) {
        normalizedSocial[platform] = normalizeSocialUrl(platform, url);
      }
    });
  }

  // Parse skills
  let parsedSkills = [];
  if (Array.isArray(formData.skills)) {
    parsedSkills = formData.skills;
  } else if (typeof formData.skills === 'string') {
    parsedSkills = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  const profileId = formData.id || (currentUser ? currentUser.id : `cw-profile-${Date.now()}`);
  const now = new Date().toISOString();

  const newProfile = {
    id: profileId,
    full_name: formData.full_name?.trim() || 'Tech Creator',
    role: formData.role || 'student',
    role_title: formData.role_title?.trim() || (formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : 'Community Member'),
    headline: formData.headline?.trim() || 'Digital Creator & Tech Learner',
    bio: formData.bio?.trim() || 'Passionate developer and learner creating digital solutions.',
    location: formData.location?.trim() || 'Mbarara, Uganda',
    email: formData.email?.trim() || (currentUser?.email || ''),
    phone: formData.phone?.trim() || '',
    avatar_url: formData.avatar_url?.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.full_name || 'CW')}`,
    skills: parsedSkills.length > 0 ? parsedSkills : ['Web Development', 'Digital Skills'],
    social_links: normalizedSocial,
    status: formData.status || 'active',
    is_verified: formData.role === 'admin' || formData.role === 'tutor' || Boolean(formData.is_verified),
    created_at: formData.created_at || now,
    updated_at: now,
    is_user_owned: true
  };

  const existingIndex = stored.findIndex(p => p.id === profileId || (p.email && p.email === newProfile.email));

  if (existingIndex >= 0) {
    stored[existingIndex] = {
      ...stored[existingIndex],
      ...newProfile,
      updated_at: now
    };
  } else {
    stored.unshift(newProfile);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    localStorage.setItem(MY_PROFILE_KEY, profileId);
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }

  // Try saving to Supabase if logged in
  if (isSupabaseConfigured && currentUser) {
    try {
      await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          full_name: newProfile.full_name,
          email: newProfile.email,
          phone: newProfile.phone,
          avatar_url: newProfile.avatar_url,
          bio: newProfile.bio,
          role: newProfile.role,
          updated_at: now
        });
    } catch (supaErr) {
      console.warn('Could not sync to Supabase profiles table:', supaErr);
    }
  }

  return newProfile;
}

// Delete profile by ID
export async function deleteProfile(id) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    let stored = JSON.parse(raw);
    stored = stored.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    
    if (localStorage.getItem(MY_PROFILE_KEY) === id) {
      localStorage.removeItem(MY_PROFILE_KEY);
    }
    return true;
  } catch (err) {
    console.error('Failed to delete profile:', err);
    return false;
  }
}

// Get the user's saved profile ID from this browser
export function getSavedMyProfileId() {
  try {
    return localStorage.getItem(MY_PROFILE_KEY) || null;
  } catch {
    return null;
  }
}
