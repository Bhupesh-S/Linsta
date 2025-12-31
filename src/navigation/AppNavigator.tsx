import React, { useState } from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import EventsDiscoveryScreen from '../screens/events/EventsDiscoveryScreen';
import EventDetailScreen from '../screens/events/EventDetailScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import { NetworkScreen } from '../screens/NetworkScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import OAuthSelectionScreen from '../screens/auth/OAuthSelectionScreen';
import RestrictedAccessScreen from '../screens/RestrictedAccessScreen';
import { Event } from '../utils/eventTypes';
import MyTicketsScreen from '../pages/tickets/MyTicketsScreen';
import TicketDetailScreen from '../pages/tickets/TicketDetailScreen';
import MyEventsScreen from '../pages/organizer/MyEventsScreen';
import AttendeesScreen from '../pages/organizer/AttendeesScreen';
import RSVPConfirmationScreen from '../pages/rsvp/RSVPConfirmationScreen';
import RegistrationFormScreen from '../pages/rsvp/RegistrationFormScreen';
import RegistrationSuccessScreen from '../pages/rsvp/RegistrationSuccessScreen';
import EditEventScreen from '../pages/organizer/EditEventScreen';
import ProfileScreen from '../pages/profile/ProfileScreen';
import EditProfileScreen from '../pages/profile/EditProfileScreen';
import NetworkScreen from '../pages/network/NetworkScreen';
import ConnectionsScreen from '../pages/network/ConnectionsScreen';
import CommunitiesScreen from '../pages/network/CommunitiesScreen';
import MessagesListScreen from '../pages/messages/MessagesListScreen';
import ChatScreen from '../pages/messages/ChatScreen';
import NotificationsScreen from '../pages/notifications/NotificationsScreen';

type Screen =
  | 'Home'
  | 'Events'
  | 'EventDetail'
  | 'CreateEvent'
  | 'MyTickets'
  | 'TicketDetail'
  | 'OrganizerMyEvents'
  | 'OrganizerAttendees'
  | 'RSVPConfirm'
  | 'RSVPForm'
  | 'RSVPSuccess'
  | 'EditEvent'
  | 'Profile'
  | 'ProfileEdit'
  | 'Network'
  | 'Connections'
  | 'Communities'
  | 'Messages'
  | 'Chat'
  | 'Notifications';

type NavEntry = {
  screen: Screen;
  params?: any;
};

interface NavigationState {
  currentScreen: Screen;
  eventDetail?: Event;
  userEmail?: string;
  currentParams?: any;
  history: NavEntry[];
}

const AppNavigatorInner = () => {
  const { userState, login, logout, checkPermission, completeProfile } = useUser();
  const [navState, setNavState] = useState<NavigationState>({
    currentScreen: 'Splash',
    currentScreen: 'Home',
    currentParams: undefined,
    history: [],
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
      setNavState((s) => ({
        currentScreen: screen,
        eventDetail: params?.event,
        userEmail: params?.email,
      });
        currentParams: params,
        history: [...s.history, { screen: s.currentScreen, params: s.currentParams }],
      }));
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
      setNavState((s) => {
        if (s.history.length === 0) {
          return { currentScreen: 'Home', eventDetail: undefined, currentParams: undefined, history: [] } as NavigationState;
        }
        const prev = s.history[s.history.length - 1];
        return {
          currentScreen: prev.screen,
          eventDetail: prev.params?.event,
          currentParams: prev.params,
          history: s.history.slice(0, -1),
        };
      });
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
      case 'Network':
      case 'Events':
      case 'EventDetail':
      case 'Profile':
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
      
      case 'Network':
        return <NetworkScreen />;
      
      case 'Events':
        return <EventsDiscoveryScreen navigation={navigation} />;
      
      case 'EventDetail':
        return (
          <EventDetailScreen
            navigation={navigation}
            route={{ params: { event: navState.currentParams?.event } }}
          />
        );
      
      case 'CreateEvent':
        return <CreateEventScreen navigation={navigation} />;
      
      case 'MyTickets':
        return <MyTicketsScreen navigation={navigation} />;
      case 'TicketDetail':
        return <TicketDetailScreen navigation={navigation} />;
      case 'OrganizerMyEvents':
        return <MyEventsScreen navigation={navigation} />;
      case 'OrganizerAttendees':
        return <AttendeesScreen navigation={navigation} />;
      case 'RSVPConfirm':
        return <RSVPConfirmationScreen navigation={navigation} />;
      case 'RSVPForm':
        return <RegistrationFormScreen navigation={navigation} />;
      case 'RSVPSuccess':
        return <RegistrationSuccessScreen navigation={navigation} />;
      case 'EditEvent':
        return <EditEventScreen navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      case 'ProfileEdit':
        return <EditProfileScreen navigation={navigation} />;
      case 'Network':
        return <NetworkScreen navigation={navigation} />;
      case 'Connections':
        return <ConnectionsScreen navigation={navigation} />;
      case 'Communities':
        return <CommunitiesScreen navigation={navigation} />;
      case 'Messages':
        return <MessagesListScreen navigation={navigation} />;
      case 'Chat':
        return <ChatScreen navigation={navigation} route={{ params: navState.currentParams }} />;
      case 'Notifications':
        return <NotificationsScreen navigation={navigation} />;
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
