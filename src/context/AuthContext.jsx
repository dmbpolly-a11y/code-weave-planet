import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // raw Supabase auth user
  const [profile, setProfile] = useState(null); // row from profiles table
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the profile row for the authenticated user
  const fetchProfile = useCallback(async (authUser) => {
    if (!authUser) { setProfile(null); return null; }
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        // Profile might not exist yet (e.g., right after signup before trigger fires)
        if (profileError.code === 'PGRST116') return null;
        throw profileError;
      }

      // Update last_seen
      await supabase
        .from('profiles')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', authUser.id);

      setProfile(data);
      return data;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user);
        }
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Small delay to allow trigger to create profile
          if (event === 'SIGNED_IN') {
            setTimeout(() => fetchProfile(session.user), 500);
          } else {
            await fetchProfile(session.user);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, [fetchProfile]);

  // ─── Auth Methods ─────────────────────────────────────────

  const signUp = async (email, password, meta = {}) => {
    try {
      setError(null);
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: meta, // includes full_name, role, phone
        },
      });
      if (err) throw err;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (err) throw err;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Profile Methods ──────────────────────────────────────

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (err) throw err;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const ext = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      return { url: publicUrl, error: null };
    } catch (err) {
      return { url: null, error: err.message };
    }
  };

  const refreshProfile = () => fetchProfile(user);

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
