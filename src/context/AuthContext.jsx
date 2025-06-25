import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

const initialState = {
  user: null,
  session: null,
  loading: true,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        session: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({
        type: 'SET_USER',
        payload: {
          user: session?.user ?? null,
          session: session
        }
      });
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      dispatch({
        type: 'SET_USER',
        payload: {
          user: session?.user ?? null,
          session: session
        }
      });

      // If user just signed up, create their profile (without blocking)
      if (event === 'SIGNED_UP' && session?.user) {
        console.log('New user signed up, creating profile...');
        createUserProfile(session.user).catch(error => {
          console.log('Profile creation will be handled later:', error);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (user) => {
    try {
      console.log('Creating profile for user:', user.id);
      
      // انتظار قصير فقط
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const profileData = {
        user_id: user.id,
        email: user.email,
        first_name: user.user_metadata?.firstName || '',
        last_name: user.user_metadata?.lastName || ''
      };

      console.log('Inserting profile data:', profileData);

      const { data, error } = await supabase
        .from('user_profiles_simple')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.log('Profile creation error (will retry later):', error);
        return;
      }

      console.log('User profile created successfully:', data);
      return data;
    } catch (error) {
      console.log('Profile creation failed (not critical):', error);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      console.log('Starting sign up process...');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || ''
          }
        }
      });

      if (error) {
        console.error('Auth signup error:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { error };
      }

      console.log('Signup successful:', data);
      return { data };
    } catch (error) {
      console.error('Signup catch error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { error };
    }
  };

  const signIn = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { error };
      }

      return { data };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { error };
      }

      dispatch({ type: 'SIGN_OUT' });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { error };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { error };
      }

      return { data };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { error };
      }

      return { data };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { error };
    }
  };

  const value = {
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}