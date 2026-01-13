// API service for backend communication with auto-detection
// Automatically finds the working backend URL for any network configuration

// Dynamic API URL - will be set by auto-detection
let API_BASE_URL = 'http://localhost:5000'; // Fallback default

// Common backend endpoints to try (without specific IPs)
const getCommonUrls = (): string[] => {
  const urls = [
    'http://192.168.43.114:5000',   // Your PC's IP on Wi-Fi
    'http://10.0.2.2:5000',         // Android emulator
    'http://10.46.192.61:5000',     // Alternative network IP
    'http://localhost:5000',        // Localhost/iOS simulator
  ];
  
  // In development, the app will auto-detect the correct URL on first API call
  return urls;
};

// Auto-detect working backend URL
export const testConnection = async (): Promise<string | null> => {
  console.log('🔍 Auto-detecting backend server...');
  const urls = getCommonUrls();
  
  for (const url of urls) {
    try {
      console.log(`Testing: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${url}/api/auth/login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test', password: 'test' }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      // Any response (even errors) means server is reachable
      console.log(`✅ Server found at: ${url}`);
      API_BASE_URL = url;
      return url;
    } catch (error: any) {
      console.log(`❌ Not reachable: ${url}`, error.message);
    }
  }
  
  console.log('❌ No backend server found. Using fallback:', API_BASE_URL);
  return null;
};

// Get current API URL (with auto-detection on first call)
let connectionTested = false;
let connectionPromise: Promise<string> | null = null;

export const getApiUrl = async (): Promise<string> => {
  // If detection is already in progress, wait for it
  if (connectionPromise) {
    await connectionPromise;
    return API_BASE_URL;
  }

  // If not tested yet, start detection
  if (!connectionTested) {
    connectionTested = true;
    connectionPromise = (async () => {
      const detectedUrl = await testConnection();
      if (detectedUrl) {
        API_BASE_URL = detectedUrl;
        console.log('🎯 Using detected backend URL:', API_BASE_URL);
      } else {
        console.log('⚠️ No backend detected, using fallback:', API_BASE_URL);
      }
      return API_BASE_URL;
    })();
    await connectionPromise;
    connectionPromise = null;
  }
  return API_BASE_URL;
};

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    status: string;
  };
  token: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const apiUrl = await getApiUrl();
      console.log('Registering user with:', { email: data.email, name: data.name });
      console.log('API URL:', `${apiUrl}/api/auth/register`);
      
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Registration response:', result);

      if (!response.ok) {
        console.error('Registration failed:', result.error);
        throw new Error(result.error || 'Registration failed');
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const apiUrl = await getApiUrl();
      console.log('🔐 Logging in user:', data.email);
      console.log('API URL:', `${apiUrl}/api/auth/login`);
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('✅ Login API response:', JSON.stringify(result, null, 2));
      console.log('✅ Has token?', !!result.token);
      console.log('✅ Has user?', !!result.user);

      if (!response.ok) {
        console.error('Login failed:', result.error);
        throw new Error(result.error || 'Login failed');
      }

      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const apiUrl = await getApiUrl();
    const response = await fetch(`${apiUrl}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Google login failed');
    }

    return result;
  },

  verifyOTP: async (email: string, code: string): Promise<AuthResponse> => {
    const apiUrl = await getApiUrl();
    const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'OTP verification failed');
    }

    return result;
  },

  resendOTP: async (email: string): Promise<void> => {
    const apiUrl = await getApiUrl();
    const response = await fetch(`${apiUrl}/api/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to resend OTP');
    }
  },
};

// Helper function to get authorization header
export const getAuthHeader = async (): Promise<{ Authorization: string }> => {
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  const token = await AsyncStorage.getItem('token');
  
  if (!token) {
    console.warn('⚠️ No token found in AsyncStorage');
    throw new Error('No authentication token found');
  }
  
  console.log('🔑 Token retrieved for auth header:', token.substring(0, 20) + '...');
  return { Authorization: `Bearer ${token}` };
};

// Export API_BASE_URL for backward compatibility
export { API_BASE_URL };
