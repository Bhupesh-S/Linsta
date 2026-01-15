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
    profileImageUrl?: string;
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

  // Upload profile image
  uploadProfileImage: async (imageUri: string): Promise<UserProfileResponse> => {
    console.log('📱 Uploading profile image...', imageUri);

    return new Promise(async (resolve, reject) => {
      try {
        const apiUrl = await getApiUrl();
        const authHeader = await getAuthHeader();

        // Create FormData
        const formData = new FormData();

        // Get file extension and create proper filename
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        // Create file object for React Native
        const file = {
          uri: imageUri,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        };

        console.log('📤 Uploading file:', file);

        // Append image to FormData - React Native format
        formData.append('profileImage', file as any);

        // Use XMLHttpRequest for better React Native compatibility
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              console.log('✅ Profile image uploaded successfully');
              resolve(data);
            } catch (error) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              console.error('❌ Upload profile image error:', error);
              reject(new Error(error.error || 'Failed to upload profile image'));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => {
          console.error('❌ Network error during upload');
          reject(new Error('Network error during upload'));
        };

        xhr.open('POST', `${apiUrl}/api/users/profile/image`);

        // Set auth header
        if (authHeader.Authorization) {
          xhr.setRequestHeader('Authorization', authHeader.Authorization);
        }

        // Don't set Content-Type - let XMLHttpRequest set it with boundary
        xhr.send(formData);
      } catch (error: any) {
        console.error('❌ Upload profile image error:', error);
        reject(error);
      }
    });
  },
};
