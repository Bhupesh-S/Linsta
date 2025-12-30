// OAuth authentication service for Google, Microsoft, and LinkedIn
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Complete web browser session
WebBrowser.maybeCompleteAuthSession();

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '660713181192-aadcea55sg7a2uhenictdep4vnp0hlft.apps.googleusercontent.com', // Your Google Client ID
  offlineAccess: true,
});

export interface OAuthResult {
  idToken?: string;
  email?: string;
  name?: string;
  provider: 'google' | 'microsoft' | 'linkedin';
}

export const OAuthService = {
  // Google Sign-In
  signInWithGoogle: async (): Promise<OAuthResult> => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      return {
        idToken: userInfo.idToken || undefined,
        email: userInfo.user.email,
        name: userInfo.user.name || undefined,
        provider: 'google',
      };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign-in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign-in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available');
      } else {
        throw new Error('Google Sign-In failed');
      }
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
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
};
