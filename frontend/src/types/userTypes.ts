// User State Types
export enum UserStatus {
  NEW_USER = 'NEW_USER',
  RETURNING_USER = 'RETURNING_USER',
  PROFILE_INCOMPLETE = 'PROFILE_INCOMPLETE',
  SUSPENDED = 'SUSPENDED',
  RESTRICTED = 'RESTRICTED',
  LOGGED_OUT = 'LOGGED_OUT',
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  profileComplete: boolean;
}

export interface UserState {
  status: UserStatus;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  restrictionReason?: string;
}

// Permission levels for different screens
export enum ScreenPermission {
  PUBLIC = 'PUBLIC', // No auth required
  AUTHENTICATED = 'AUTHENTICATED', // Any logged-in user
  PROFILE_COMPLETE = 'PROFILE_COMPLETE', // Profile must be complete
  UNRESTRICTED = 'UNRESTRICTED', // Not suspended/restricted
}
