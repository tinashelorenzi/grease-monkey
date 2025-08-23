import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { authService, UserProfile } from '../services';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const profile = await authService.getCurrentUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await refreshUserProfile();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    logout,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
