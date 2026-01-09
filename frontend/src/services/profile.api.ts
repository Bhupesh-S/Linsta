// Profile API service
import { getAuthHeader, getApiUrl } from './api';

export interface UserProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  profile?: {
    _id: string;
    userId: string;
    university?: string;
    course?: string;
    year?: string;
    skills: string[];
    interests: string[];
  };
}

export const profileApi = {
  // Get user profile
  getProfile: async (): Promise<UserProfileResponse> => {
    console.log('📱 Fetching user profile...');
    try {
      const apiUrl = await getApiUrl();
      const response = await fetch(`${apiUrl}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(await getAuthHeader()),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Get profile error:', error);
        throw new Error(error.error || 'Failed to fetch profile');
      }

      const data = await response.json();
      console.log('✅ Profile fetched successfully');
      return data;
    } catch (error: any) {
      console.error('❌ Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData: {
    university?: string;
    course?: string;
    year?: string;
    skills?: string[];
    interests?: string[];
  }): Promise<UserProfileResponse> => {
    console.log('📱 Updating user profile...');
    try {
      const apiUrl = await getApiUrl();
      const response = await fetch(`${apiUrl}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(await getAuthHeader()),
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Update profile error:', error);
        throw new Error(error.error || 'Failed to update profile');
      }

      const data = await response.json();
      console.log('✅ Profile updated successfully');
      return data;
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  },
};
