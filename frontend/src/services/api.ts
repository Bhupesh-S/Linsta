// API service for backend communication
// Use your computer's IP address for physical devices/emulators
// For Android emulator use: http://10.0.2.2:5000
// For iOS simulator use: http://localhost:5000
// For physical device use: http://YOUR_IP_ADDRESS:5000

// AUTO-DETECT: Try multiple endpoints
const POSSIBLE_URLS = [
  'http://10.0.2.2:5000',      // Android emulator
  'http://10.46.192.61:5000',  // Your computer's WiFi IP
  'http://192.168.56.1:5000',  // VirtualBox host
  'http://localhost:5000',     // Localhost
];

// Start with emulator default
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.18.61:5000'  // Physical device - use WiFi IP
  : 'http://localhost:5000';  // Production

console.log('🌐 API_BASE_URL:', API_BASE_URL);
console.log('📱 Try these URLs if connection fails:', POSSIBLE_URLS);

// Test network connectivity
export const testConnection = async (): Promise<string | null> => {
  console.log('🔍 Testing API connections...');
  
  for (const url of POSSIBLE_URLS) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(`${url}/`, { 
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok || response.status === 404) { // 404 is fine, means server is reachable
        console.log(`✅ Connected to: ${url}`);
        return url;
      }
    } catch (error: any) {
      console.log(`❌ Failed: ${url} - ${error.message}`);
    }
  }
  
  console.log('❌ No working connection found');
  return null;
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
    name: string;
    email: string;
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
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Login failed');
    }

    return result;
  },

  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
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
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
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
