import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserState, UserStatus, UserProfile, ScreenPermission } from '../types/userTypes';

interface UserContextType {
  userState: UserState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  checkPermission: (permission: ScreenPermission) => boolean;
  completeProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>({
    status: UserStatus.RETURNING_USER,
    profile: {
      id: '1',
      email: 'dev@linsta.com',
      fullName: 'Development User',
      profileComplete: true,
    },
    isAuthenticated: true,
  });

  // Check for existing auth token on mount
  useEffect(() => {
    checkAuthToken();
  }, []);

  const checkAuthToken = async () => {
    // TODO: Check AsyncStorage for auth token
    // For now, assume logged out
    console.log('Checking auth token...');
  };

  const login = async (email: string, password: string) => {
    // Simulate login logic
    // Determine user status based on email
    let status = UserStatus.RETURNING_USER;
    let profileComplete = true;

    if (email === 'new@example.com') {
      status = UserStatus.NEW_USER;
      profileComplete = false;
    } else if (email === 'incomplete@example.com') {
      status = UserStatus.PROFILE_INCOMPLETE;
      profileComplete = false;
    } else if (email === 'suspended@example.com') {
      status = UserStatus.SUSPENDED;
    } else if (email === 'restricted@example.com') {
      status = UserStatus.RESTRICTED;
    }

    const profile: UserProfile = {
      id: '1',
      email,
      fullName: status === UserStatus.NEW_USER ? undefined : 'Test User',
      profileComplete,
    };

    setUserState({
      status,
      profile,
      isAuthenticated: true,
      restrictionReason: status === UserStatus.SUSPENDED ? 'Account suspended for policy violation' : undefined,
    });
  };

  const logout = () => {
    setUserState({
      status: UserStatus.LOGGED_OUT,
      profile: null,
      isAuthenticated: false,
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (userState.profile) {
      setUserState({
        ...userState,
        profile: {
          ...userState.profile,
          ...updates,
        },
      });
    }
  };

  const completeProfile = () => {
    if (userState.profile) {
      setUserState({
        ...userState,
        status: UserStatus.RETURNING_USER,
        profile: {
          ...userState.profile,
          profileComplete: true,
        },
      });
    }
  };

  const checkPermission = (permission: ScreenPermission): boolean => {
    switch (permission) {
      case ScreenPermission.PUBLIC:
        return true;
      
      case ScreenPermission.AUTHENTICATED:
        return userState.isAuthenticated;
      
      case ScreenPermission.PROFILE_COMPLETE:
        return userState.isAuthenticated && (userState.profile?.profileComplete ?? false);
      
      case ScreenPermission.UNRESTRICTED:
        return userState.isAuthenticated && 
               userState.status !== UserStatus.SUSPENDED && 
               userState.status !== UserStatus.RESTRICTED;
      
      default:
        return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userState,
        login,
        logout,
        updateProfile,
        checkPermission,
        completeProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
