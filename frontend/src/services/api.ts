// API service for backend communication with auto-detection
// Automatically finds the working backend URL for any network configuration

// Dynamic API URL - will be set by auto-detection
let API_BASE_URL = 'http://localhost:5000'; // Fallback default

// Common backend endpoints to try (without specific IPs)
const getCommonUrls = (): string[] => {
  const urls = [
    'http://10.0.2.2:5000',      // Android emulator
    'http://localhost:5000',     // Localhost/iOS simulator
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
      const response = await fetch(`${url}/api/auth/login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test', password: 'test' }),
        signal: AbortSignal.timeout(2000)
      });
      // Any response (even errors) means server is reachable
      console.log(`✅ Server found at: ${url}`);
      API_BASE_URL = url;
      return url;
    } catch (error: any) {
      console.log(`❌ Not reachable: ${url}`);
    }
  }
  
  console.log('❌ No backend server found. Using fallback:', API_BASE_URL);
  return API_BASE_URL;
};

// Get current API URL (with auto-detection on first call)
let connectionTested = false;
const getApiUrl = async (): Promise<string> => {
  if (!connectionTested && __DEV__) {
    connectionTested = true;
    const detectedUrl = await testConnection();
    if (detectedUrl) {
      API_BASE_URL = detectedUrl;
    }
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
  user: {t apiUrl = await getApiUrl();
      console.log('Registering user with:', { email: data.email, name: data.name });
      console.log('API URL:', `${apiUrl}/api/auth/register`);
      
      const response = await fetch(`${apiUrl
  };
  token: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('Registering user with:', { email: data.email, name: data.name });
      console.log('API URL:', `${API_BASE_URL}/api/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
      }t apiUrl = await getApiUrl();
      console.log('🔐 Logging in user:', data.email);
      console.log('API URL:', `${apiUrl}/api/auth/login`);
      
      const response = await fetch(`${apiUrl
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log('🔐 Logging in user:', data.email);
      console.log('API URL:', `${API_BASE_URL}/api/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
        thapiUrl = await getApiUrl();
    const response = await fetch(`${apiUrlailed');
      }

      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
apiUrl = await getApiUrl();
    const response = await fetch(`${apiUrl
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Google login failed');
    }

    return result;
  },

  verifyOTP: async (email: string, code: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });
apiUrl = await getApiUrl();
    const response = await fetch(`${apiUrl
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'OTP verification failed');
    }

    return result;
  },

  resendOTP: async (email: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
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
