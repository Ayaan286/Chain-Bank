import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  country?: string;
  user_type?: string;
  date_of_birth?: string;
  email_verified?: boolean;
  created_at?: string;
  account_number?: string;
  public_key?: string;
  wallet_address?: string;
  private_key_hash?: string;
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for user:', userId);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });

        // If profile doesn't exist, create a basic one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating basic profile...');
          try {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: userId,
                  email: user?.email,
                  email_verified: user?.email_confirmed_at ? true : false,
                  created_at: new Date().toISOString()
                }
              ])
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
              console.error('Create error details:', {
                code: createError.code,
                message: createError.message,
                details: createError.details,
                hint: createError.hint
              });
              return;
            }

            console.log('Successfully created basic profile:', newProfile);
            setProfile(newProfile);
            return;
          } catch (createErr) {
            console.error('Exception during profile creation:', createErr);
            return;
          }
        }

        // For other errors, just return without setting profile
        console.log('Profile fetch failed, continuing without profile data');
        return;
      }

      console.log('Successfully fetched profile:', data);
      setProfile(data);
    } catch (error) {
      console.error('Exception during profile fetch:', error);
      // Set loading to false even if there's an error
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('Refreshing profile for user:', user.id);
      await fetchProfile(user.id);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('Getting initial session...');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session data:', session);
        
        if (session?.user) {
          console.log('User found in session:', session.user.id);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log('No user found in session');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        try {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 