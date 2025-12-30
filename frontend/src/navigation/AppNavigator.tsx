import React, { useState } from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import EventsDiscoveryScreen from '../screens/events/EventsDiscoveryScreen';
import EventDetailScreen from '../screens/events/EventDetailScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import OAuthSelectionScreen from '../screens/auth/OAuthSelectionScreen';
import RestrictedAccessScreen from '../screens/RestrictedAccessScreen';
import { Event } from '../utils/eventTypes';
import { UserProvider, useUser } from '../context/UserContext';
import { UserStatus, ScreenPermission } from '../types/userTypes';

type Screen = 'Splash' | 'Login' | 'Signup' | 'OTPVerification' | 'OAuthSelection' | 'Home' | 'Events' | 'EventDetail' | 'CreateEvent' | 'Restricted';

interface NavigationState {
  currentScreen: Screen;
  eventDetail?: Event;
  userEmail?: string;
}

const AppNavigatorInner = () => {
  const { userState, login, logout, checkPermission, completeProfile } = useUser();
  const [navState, setNavState] = useState<NavigationState>({
    currentScreen: 'Splash',
  });

  const navigation = {
    navigate: (screen: Screen, params?: any) => {
      // Check permissions before navigation
      if (!validateScreenAccess(screen)) {
        setNavState({ ...navState, currentScreen: 'Restricted' });
        return;
      }

      setNavState({
        ...navState,
        currentScreen: screen,
        eventDetail: params?.event,
        userEmail: params?.email,
      });
    },
    goBack: () => {
      if (navState.currentScreen === 'EventDetail') {
        setNavState({ ...navState, currentScreen: 'Events' });
      } else if (navState.currentScreen === 'CreateEvent') {
        setNavState({ ...navState, currentScreen: 'Home' });
      } else if (navState.currentScreen === 'Signup' || navState.currentScreen === 'OAuthSelection') {
        setNavState({ ...navState, currentScreen: 'Login' });
      } else if (navState.currentScreen === 'OTPVerification') {
        setNavState({ ...navState, currentScreen: 'Signup' });
      } else {
        setNavState({ ...navState, currentScreen: 'Home' });
      }
    },
  };

  const validateScreenAccess = (screen: Screen): boolean => {
    switch (screen) {
      case 'Splash':
      case 'Login':
      case 'Signup':
      case 'OTPVerification':
      case 'OAuthSelection':
        return true; // Public screens
      
      case 'Home':
      case 'Events':
      case 'EventDetail':
        return checkPermission(ScreenPermission.AUTHENTICATED);
      
      case 'CreateEvent':
        return checkPermission(ScreenPermission.PROFILE_COMPLETE) && 
               checkPermission(ScreenPermission.UNRESTRICTED);
      
      default:
        return false;
    }
  };

  const handleSplashFinish = () => {
    // Check user state
    if (userState.isAuthenticated) {
      handlePostAuthFlow();
    } else {
      setNavState({ ...navState, currentScreen: 'Login' });
    }
  };

  const handleLoginSuccess = async (isNewUser: boolean) => {
    // Login is handled in LoginScreen, just navigate based on state
    handlePostAuthFlow();
  };

  const handlePostAuthFlow = () => {
    switch (userState.status) {
      case UserStatus.NEW_USER:
      case UserStatus.PROFILE_INCOMPLETE:
        setNavState({ ...navState, currentScreen: 'Restricted' });
        break;
      
      case UserStatus.SUSPENDED:
      case UserStatus.RESTRICTED:
        setNavState({ ...navState, currentScreen: 'Restricted' });
        break;
      
      case UserStatus.RETURNING_USER:
        setNavState({ ...navState, currentScreen: 'Home' });
        break;
      
      default:
        setNavState({ ...navState, currentScreen: 'Login' });
    }
  };

  const handleSignupSuccess = (email: string) => {
    setNavState({ ...navState, currentScreen: 'OTPVerification', userEmail: email });
  };

  const handleOTPVerificationSuccess = () => {
    setNavState({ ...navState, currentScreen: 'Home' });
  };

  const handleOAuthSelect = (provider: string) => {
    console.log(`OAuth selected: ${provider}`);
    setNavState({ ...navState, currentScreen: 'Home' });
  };

  const handleCompleteProfile = () => {
    completeProfile();
    setNavState({ ...navState, currentScreen: 'Home' });
  };

  const handleLogout = () => {
    logout();
    setNavState({ ...navState, currentScreen: 'Login' });
  };

  const renderScreen = () => {
    console.log('🖥️  Rendering screen:', navState.currentScreen);
    
    switch (navState.currentScreen) {
      case 'Splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      
      case 'Login':
        return <LoginScreen navigation={navigation} onLoginSuccess={handleLoginSuccess} />;
      
      case 'Signup':
        return <SignupScreen navigation={navigation} onSignupSuccess={handleSignupSuccess} />;
      
      case 'OTPVerification':
        return (
          <OTPVerificationScreen
            navigation={navigation}
            route={{ params: { email: navState.userEmail || '' } }}
            onVerificationSuccess={handleOTPVerificationSuccess}
          />
        );
      
      case 'OAuthSelection':
        return <OAuthSelectionScreen navigation={navigation} onOAuthSelect={handleOAuthSelect} />;
      
      case 'Restricted':
        return (
          <RestrictedAccessScreen
            status={userState.status}
            restrictionReason={userState.restrictionReason}
            onLogout={handleLogout}
            onCompleteProfile={handleCompleteProfile}
          />
        );
      
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      
      case 'Events':
        return <EventsDiscoveryScreen navigation={navigation} />;
      
      case 'EventDetail':
        return (
          <EventDetailScreen
            navigation={navigation}
            route={{ params: { event: navState.eventDetail } }}
          />
        );
      
      case 'CreateEvent':
        return <CreateEventScreen navigation={navigation} />;
      
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  return renderScreen();
};

const AppNavigator = () => {
  return (
    <UserProvider>
      <AppNavigatorInner />
    </UserProvider>
  );
};

export default AppNavigator;
