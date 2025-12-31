// OAuth authentication service for Google, Microsoft, and LinkedIn
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Complete web browser session
WebBrowser.maybeCompleteAuthSession();

export interface OAuthResult {
  idToken?: string;
  email?: string;
  name?: string;
  provider: 'google' | 'microsoft' | 'linkedin';
}

export const OAuthService = {
  // Google Sign-In (using expo-auth-session)
  signInWithGoogle: async (): Promise<OAuthResult> => {
    try {
      // Use Expo's default redirect URI for development
      const redirectUri = makeRedirectUri({
        native: 'linsta://redirect',
        useProxy: true, // Uses Expo's proxy for development
      });

      console.log('🔗 Redirect URI:', redirectUri);

      // Google OAuth endpoint
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=660713181192-aadcea55sg7a2uhenictdep4vnp0hlft.apps.googleusercontent.com&` +
        `response_type=id_token&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=openid%20profile%20email&` +
        `nonce=${Date.now()}`;

      console.log('🌐 Opening auth URL...');
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === 'success' && result.url) {
        // Parse the token from URL fragment
        const params = new URLSearchParams(result.url.split('#')[1]);
        const idToken = params.get('id_token');

        // Decode JWT to get user info (basic parsing)
        if (idToken) {
          const payload = JSON.parse(atob(idToken.split('.')[1]));
          
          return {
            idToken,
            email: payload.email,
            name: payload.name,
            provider: 'google',
          };
        }
      }

      throw new Error('Google Sign-In failed');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw new Error(error.message || 'Google Sign-In failed');
    }
  },

  // Microsoft Sign-In (using expo-auth-session)
  signInWithMicrosoft: async (): Promise<OAuthResult> => {
    try {
      const redirectUri = makeRedirectUri({
        scheme: 'linsta',
        path: 'redirect'
      });

      // Microsoft OAuth endpoint
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=YOUR_MICROSOFT_CLIENT_ID&` +
        `response_type=id_token&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=openid%20profile%20email&` +
        `response_mode=fragment&` +
        `nonce=${Date.now()}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === 'success' && result.url) {
        // Parse the token from URL fragment
        const params = new URLSearchParams(result.url.split('#')[1]);
        const idToken = params.get('id_token');

        // Decode JWT to get user info (basic parsing)
        if (idToken) {
          const payload = JSON.parse(atob(idToken.split('.')[1]));
          
          return {
            idToken,
            email: payload.email,
            name: payload.name,
            provider: 'microsoft',
          };
        }
      }

      throw new Error('Microsoft Sign-In failed');
    } catch (error: any) {
      console.error('Microsoft Sign-In Error:', error);
      throw new Error(error.message || 'Microsoft Sign-In failed');
    }
  },

  // LinkedIn Sign-In (using expo-auth-session)
  signInWithLinkedIn: async (): Promise<OAuthResult> => {
    try {
      const redirectUri = makeRedirectUri({
        scheme: 'linsta',
        path: 'redirect'
      });

      // LinkedIn OAuth endpoint
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=YOUR_LINKEDIN_CLIENT_ID&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=openid%20profile%20email`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === 'success' && result.url) {
        // Parse authorization code
        const params = new URLSearchParams(result.url.split('?')[1]);
        const code = params.get('code');

        if (code) {
          // Note: In production, exchange code for token on backend
          console.log('LinkedIn authorization code:', code);
          
          return {
            idToken: code,
            provider: 'linkedin',
          };
        }
      }

      throw new Error('LinkedIn Sign-In failed');
    } catch (error: any) {
      console.error('LinkedIn Sign-In Error:', error);
      throw new Error(error.message || 'LinkedIn Sign-In failed');
    }
  },

  // Sign out
  signOut: async () => {
    try {
      // Clear any cached auth data if needed
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
};
