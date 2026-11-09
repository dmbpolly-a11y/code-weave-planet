import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Default platform accounts for immediate testing and production fallback
const DEFAULT_DEMO_USERS = [
  {
    id: 'cw-admin-01',
    email: 'admin@codeweave.com',
    password: 'admin123',
    role: 'admin',
    full_name: 'Platform Administrator',
    phone: '+256750937506',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Oversees Code Weave Planet courses, tutors, and system operations.',
    status: 'active'
  },
  {
    id: 'cw-tutor-01',
    email: 'tutor@codeweave.com',
    password: 'tutor123',
    role: 'tutor',
    full_name: 'Emmanuel Mugisha',
    phone: '+256750937506',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Lead software engineering instructor & full-stack architect.',
    status: 'active'
  },
  {
    id: 'cw-student-01',
    email: 'student@codeweave.com',
    password: 'student123',
    role: 'student',
    full_name: 'Alex Mugabi',
    phone: '+256775678901',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: 'Digital skills and web development trainee.',
    status: 'active'
  }
];

const LOCAL_USERS_KEY = 'codeweave_registered_accounts';
const ACTIVE_SESSION_KEY = 'codeweave_active_session';

function getLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
    return DEFAULT_DEMO_USERS;
  } catch {
    return DEFAULT_DEMO_USERS;
  }
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage:', e);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // User auth object
  const [profile, setProfile] = useState(null); // User profile data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile row for authenticated Supabase user
  const fetchProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return null;
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (!profileError && data) {
          setProfile(data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase profile fetch error:', err);
      }
    }

    // Fallback to local users
    const localUsers = getLocalUsers();
    const found = localUsers.find(u => u.id === authUser.id || u.email.toLowerCase() === authUser.email?.toLowerCase());
    if (found) {
      setProfile(found);
      return found;
    }

    const fallbackProfile = {
      id: authUser.id,
      email: authUser.email,
      full_name: authUser.user_metadata?.full_name || 'Member',
      role: authUser.user_metadata?.role || 'student',
      phone: authUser.user_metadata?.phone || '',
      avatar_url: authUser.user_metadata?.avatar_url || '',
      bio: 'Code Weave Planet member.',
      status: 'active'
    };
    setProfile(fallbackProfile);
    return fallbackProfile;
  }, []);

  // Initialize Session on App Mount
  useEffect(() => {
    const initSession = async () => {
      try {
        // 1. Check local session first for instantaneous response
        const savedSession = localStorage.getItem(ACTIVE_SESSION_KEY);
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            if (parsed?.user && parsed?.profile) {
              setUser(parsed.user);
              setProfile(parsed.profile);
            }
          } catch (e) {
            console.error('Error parsing saved session:', e);
          }
        }

        // 2. If Supabase is configured, check Supabase session
        if (isSupabaseConfigured) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              setUser(session.user);
              await fetchProfile(session.user);
            }
          } catch (supaErr) {
            console.warn('Supabase session fetch issue:', supaErr);
          }
        }
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for Supabase auth state change if configured
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user);
          }
        }
      );
      return () => subscription?.unsubscribe();
    }
  }, [fetchProfile]);

  // ─── Sign Up (Works Offline & Online Seamlessly) ──────────────
  const signUp = async (email, password, meta = {}) => {
    try {
      setError(null);
      const cleanEmail = email.toLowerCase().trim();

      if (!cleanEmail || !password) {
        throw new Error('Email and password are required');
      }

      // Check if user already exists locally
      const existingUsers = getLocalUsers();
      if (existingUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      let supaUserId = null;
      if (isSupabaseConfigured) {
        try {
          const { data: supaData, error: supaErr } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              data: meta,
            },
          });
          if (!supaErr && supaData?.user) {
            supaUserId = supaData.user.id;
          }
        } catch (supaErr) {
          console.warn('Supabase signup network fallback to local:', supaErr);
        }
      }

      // Create local user profile
      const userId = supaUserId || `cw-user-${Date.now()}`;
      const newUser = {
        id: userId,
        email: cleanEmail,
        password: password,
        full_name: meta.full_name?.trim() || cleanEmail.split('@')[0],
        phone: meta.phone || '',
        role: meta.role || 'student',
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(meta.full_name || cleanEmail)}`,
        bio: 'Member of Code Weave Planet.',
        status: 'active',
        created_at: new Date().toISOString()
      };

      existingUsers.push(newUser);
      saveLocalUsers(existingUsers);

      const authUser = {
        id: newUser.id,
        email: newUser.email,
        user_metadata: {
          full_name: newUser.full_name,
          role: newUser.role,
          phone: newUser.phone,
          avatar_url: newUser.avatar_url
        }
      };

      // Set active session immediately so the user can use the website right away
      setUser(authUser);
      setProfile(newUser);
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ user: authUser, profile: newUser }));

      return { data: { user: authUser, profile: newUser }, error: null };
    } catch (err) {
      console.error('signUp error:', err);
      setError(err.message);
      return { data: null, error: err.message };
    }
  };

  // ─── Sign In (Works Offline & Online Seamlessly) ──────────────
  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const cleanEmail = email.toLowerCase().trim();

      if (!cleanEmail || !password) {
        throw new Error('Please enter both email and password.');
      }

      // If Supabase is configured, try Supabase first
      if (isSupabaseConfigured) {
        try {
          const { data, error: supaErr } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password
          });
          if (!supaErr && data?.user) {
            setUser(data.user);
            const userProf = await fetchProfile(data.user);
            localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ user: data.user, profile: userProf }));
            return { data: { user: data.user, profile: userProf }, error: null };
          }
        } catch (supaErr) {
          console.warn('Supabase signIn issue, attempting local match:', supaErr);
        }
      }

      // Check local users database (including default demo accounts)
      const allUsers = getLocalUsers();
      const matched = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

      if (!matched) {
        throw new Error('No account found with this email. Please check your spelling or sign up.');
      }

      if (matched.password !== password) {
        throw new Error('Incorrect password. Please verify your password and try again.');
      }

      const authUser = {
        id: matched.id,
        email: matched.email,
        user_metadata: {
          full_name: matched.full_name,
          role: matched.role,
          phone: matched.phone,
          avatar_url: matched.avatar_url
        }
      };

      setUser(authUser);
      setProfile(matched);
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ user: authUser, profile: matched }));

      return { data: { user: authUser, profile: matched }, error: null };
    } catch (err) {
      console.error('signInWithEmail error:', err);
      setError(err.message);
      return { data: null, error: err.message };
    }
  };

  // ─── Google OAuth ──────────────────────────────────────────
  const signInWithGoogle = async (role = 'student') => {
    try {
      setError(null);
      if (!isSupabaseConfigured) {
        // Provide demo Google login if Supabase keys not set
        const googleDemoUser = {
          id: `cw-google-${Date.now()}`,
          email: 'google.trainee@codeweave.com',
          full_name: 'Google User',
          role: role || 'student',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          status: 'active'
        };
        setUser({ id: googleDemoUser.id, email: googleDemoUser.email, user_metadata: googleDemoUser });
        setProfile(googleDemoUser);
        localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ user: googleDemoUser, profile: googleDemoUser }));
        return { data: { user: googleDemoUser }, error: null };
      }

      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: { access_type: 'offline', prompt: 'consent' },
          data: { role: role || 'student' },
        },
      });
      if (err) throw err;
      return { data, error: null };
    } catch (err) {
      console.error('signInWithGoogle error:', err);
      setError(err.message);
      return { data: null, error: err.message };
    }
  };

  // ─── Logout ────────────────────────────────────────────────
  const logout = async () => {
    try {
      setError(null);
      if (isSupabaseConfigured) {
        try { await supabase.auth.signOut(); } catch (e) { /* ignore */ }
      }
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      setUser(null);
      setProfile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Update Profile ────────────────────────────────────────
  const updateProfile = async (updates) => {
    try {
      setError(null);
      const updatedProfile = { ...(profile || {}), ...updates, updated_at: new Date().toISOString() };
      setProfile(updatedProfile);

      // Save locally
      const allUsers = getLocalUsers();
      const idx = allUsers.findIndex(u => u.id === profile?.id || u.email === profile?.email);
      if (idx >= 0) {
        allUsers[idx] = { ...allUsers[idx], ...updates };
        saveLocalUsers(allUsers);
      }

      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ user, profile: updatedProfile }));

      // If Supabase is configured
      if (isSupabaseConfigured && user) {
        try {
          await supabase.from('profiles').update(updates).eq('id', user.id);
        } catch (supaErr) {
          console.warn('Supabase profile update sync issue:', supaErr);
        }
      }

      return { data: updatedProfile, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    }
  };

  const uploadAvatar = async (file) => {
    try {
      if (isSupabaseConfigured && user) {
        const ext = file.name.split('.').pop();
        const filePath = `${user.id}/avatar.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
          await updateProfile({ avatar_url: publicUrl });
          return { url: publicUrl, error: null };
        }
      }

      // Fallback: convert to base64 Data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUrl = reader.result;
          await updateProfile({ avatar_url: dataUrl });
          resolve({ url: dataUrl, error: null });
        };
        reader.readAsDataURL(file);
      });
    } catch (err) {
      return { url: null, error: err.message };
    }
  };

  const refreshProfile = (targetUser = null) => fetchProfile(targetUser || user);
  const isAuthenticated = () => !!user;

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signInWithEmail,
    signInWithGoogle,
    logout,
    updateProfile,
    uploadAvatar,
    refreshProfile,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
