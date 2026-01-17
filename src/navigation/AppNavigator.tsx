import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import HomeScreen from '../screens/home/HomeScreen';
import EventsDiscoveryScreen from '../screens/events/EventsDiscoveryScreen';
import EventDetailScreen from '../screens/events/EventDetailScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import CreateContentScreen from '../screens/CreateContentScreen';
import CreateStoryScreen from '../screens/CreateStoryScreen';
import CreateArticleScreen from '../screens/CreateArticleScreen';
import CreateReelScreen from '../screens/CreateReelScreen';
import { NetworkScreen } from '../screens/NetworkScreen';
import { UserProfileDetailScreen } from '../screens/UserProfileDetailScreen';
import { JobDetailScreen } from '../screens/JobDetailScreen';
import CommunityDetailScreen from '../screens/CommunityDetailScreen';
import CommunitiesListScreen from '../screens/CommunitiesListScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import OAuthSelectionScreen from '../screens/auth/OAuthSelectionScreen';

import { Event } from '../utils/eventTypes';
import MyTicketsScreen from '../pages/tickets/MyTicketsScreen';
import TicketDetailScreen from '../pages/tickets/TicketDetailScreen';
import MyEventsScreen from '../pages/organizer/MyEventsScreen';
import EventDashboardScreen from '../pages/organizer/EventDashboardScreen';
import CreateOrganizerEventScreen from '../pages/organizer/CreateEventScreen';
import AttendeesScreen from '../pages/organizer/AttendeesScreen';
import RSVPConfirmationScreen from '../pages/rsvp/RSVPConfirmationScreen';
import RegistrationFormScreen from '../pages/rsvp/RegistrationFormScreen';
import RegistrationSuccessScreen from '../pages/rsvp/RegistrationSuccessScreen';
import EditEventScreen from '../pages/organizer/EditEventScreen';
import ProfileScreen from '../pages/profile/ProfileScreen';
import EditProfileScreen from '../pages/profile/EditProfileScreen';

import ConnectionsScreen from '../pages/network/ConnectionsScreen';
import CommunitiesScreen from '../pages/network/CommunitiesScreen';
import MessagesListScreen from '../pages/messages/MessagesListScreen';
import ChatScreen from '../pages/messages/ChatScreen';
import NotificationsScreen from '../pages/notifications/NotificationsScreen';
import NotificationSettingsScreen from '../pages/notifications/NotificationSettingsScreen';
import { UserProvider, useUser } from '../context/UserContext';
import { UserStatus } from '../types/userTypes';

type Screen =
  | 'Splash'
  | 'Login'
  | 'Signup'
  | 'OTPVerification'
  | 'OAuthSelection'
  | 'Home'
  | 'Events'
  | 'EventDetail'
  | 'CreateEvent'
  | 'CreateContent'
  | 'CreateStory'
  | 'CreateArticle'
  | 'CreateReel'
  | 'MyTickets'
  | 'TicketDetail'
  | 'OrganizerMyEvents'
  | 'EventDashboard'
  | 'CreateOrganizerEvent'
  | 'OrganizerAttendees'
  | 'RSVPConfirm'
  | 'RSVPForm'
  | 'RSVPSuccess'
  | 'EditEvent'
  | 'Profile'
  | 'ProfileEdit'
  | 'Network'
  | 'UserProfileDetail'
  | 'JobDetail'
  | 'CommunityDetail'
  | 'CommunitiesList'
  | 'Connections'
  | 'Communities'
  | 'Messages'
  | 'Chat'
  | 'Notifications'
  | 'NotificationSettings';

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
  const { userState, login, logout, completeProfile } = useUser();
  const [navState, setNavState] = useState<NavigationState>({
    currentScreen: 'Splash',
    currentParams: undefined,
    history: [],
  });

  const navigation = {
    navigate: (screen: Screen, params?: any) => {
      setNavState((s) => ({
        currentScreen: screen,
        eventDetail: params?.event,
        userEmail: params?.email,
        currentParams: params,
        history: [...s.history, { screen: s.currentScreen, params: s.currentParams }],
      }));
    },
    goBack: () => {
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

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // If we're on main screens (Home, Login, Splash), exit the app
      if (navState.currentScreen === 'Home' || navState.currentScreen === 'Login' || navState.currentScreen === 'Splash') {
        return false; // Let default behavior happen (exit app)
      }
      
      // Otherwise, navigate back in our navigation history
      navigation.goBack();
      return true; // Prevent default behavior
    });

    return () => backHandler.remove();
  }, [navState.currentScreen, navState.history]);



  const handleSplashFinish = () => {
    // Check user state
    if (userState.isAuthenticated) {
      handlePostAuthFlow();
    } else {
      setNavState((s) => ({ ...s, currentScreen: 'Login' }));
    }
  };

  const handleLoginSuccess = async (isNewUser: boolean) => {
    // Login is handled in LoginScreen, just navigate based on state
    handlePostAuthFlow();
  };

  const handlePostAuthFlow = () => {
    // Simply navigate to Home if authenticated
    if (userState.isAuthenticated) {
      setNavState((s) => ({ ...s, currentScreen: 'Home' }));
    } else {
      setNavState((s) => ({ ...s, currentScreen: 'Login' }));
    }
  };

  const handleSignupSuccess = (email: string) => {
    setNavState((s) => ({ ...s, currentScreen: 'OTPVerification', userEmail: email }));
  };

  const handleOTPVerificationSuccess = () => {
    setNavState((s) => ({ ...s, currentScreen: 'Home' }));
  };

  const handleOAuthSelect = (provider: string) => {
    console.log(`OAuth selected: ${provider}`);
    setNavState((s) => ({ ...s, currentScreen: 'Home' }));
  };

  const handleCompleteProfile = () => {
    completeProfile();
    setNavState((s) => ({ ...s, currentScreen: 'Home' }));
  };

  const handleLogout = () => {
    logout();
    setNavState((s) => ({ ...s, currentScreen: 'Login' }));
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

      case 'Home':
        return <HomeScreen navigation={navigation} />;

      case 'Network':
        return <NetworkScreen navigation={navigation} />;

      case 'UserProfileDetail':
        return <UserProfileDetailScreen navigation={navigation} route={{ params: navState.currentParams }} />;

      case 'JobDetail':
        return <JobDetailScreen navigation={navigation} route={{ params: navState.currentParams }} />;

      case 'CommunityDetail':
        return <CommunityDetailScreen navigation={navigation} route={{ params: navState.currentParams }} />;

      case 'CommunitiesList':
        return <CommunitiesListScreen navigation={navigation} />;

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

      case 'CreateContent':
        return <CreateContentScreen navigation={navigation} />;

      case 'CreateStory':
        return <CreateStoryScreen navigation={navigation} />;

      case 'CreateArticle':
        return <CreateArticleScreen navigation={navigation} />;

      case 'CreateReel':
        return <CreateReelScreen navigation={navigation} />;

      case 'MyTickets':
        return <MyTicketsScreen navigation={navigation} />;
      case 'TicketDetail':
        return <TicketDetailScreen navigation={navigation} route={{ params: navState.currentParams }} />;
      case 'OrganizerMyEvents':
        return <MyEventsScreen navigation={navigation} />;
      case 'EventDashboard':
        return <EventDashboardScreen navigation={navigation} route={{ params: navState.currentParams }} />;
      case 'CreateOrganizerEvent':
        return <CreateOrganizerEventScreen navigation={navigation} />;
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
      case 'NotificationSettings':
        return <NotificationSettingsScreen navigation={navigation} />;
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
