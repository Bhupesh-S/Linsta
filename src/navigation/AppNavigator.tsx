import React, { useState } from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import EventsDiscoveryScreen from '../screens/events/EventsDiscoveryScreen';
import EventDetailScreen from '../screens/events/EventDetailScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import CreateContentScreen from '../screens/CreateContentScreen';
import CreateStoryScreen from '../screens/CreateStoryScreen';
import CreateArticleScreen from '../screens/CreateArticleScreen';
import CreateReelScreen from '../screens/CreateReelScreen';
import { NetworkScreen } from '../screens/NetworkScreen';
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
import ResumeBuilderHome from '../pages/resume/ResumeBuilderHome';
import AIAnalysisScreen from '../pages/resume/AIAnalysisScreen';
import CreateResumeScreen from '../pages/resume/CreateResumeScreen';
import CoverLetterScreen from '../pages/resume/CoverLetterScreen';
import SkillGapScreen from '../pages/resume/SkillGapScreen';
import JobsHomeScreen from '../pages/jobs/JobsHomeScreen';
import JobDetailScreen from '../pages/jobs/JobDetailScreen';
import InterviewPrepScreen from '../pages/jobs/InterviewPrepScreen';
import ApplicationsScreen from '../pages/jobs/ApplicationsScreen';
import CompanyDetailScreen from '../pages/jobs/CompanyDetailScreen';
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
  | 'Connections'
  | 'Communities'
  | 'Messages'
  | 'Chat'
  | 'Notifications'
  | 'NotificationSettings'
  | 'ResumeBuilder'
  | 'AIAnalysis'
  | 'CreateResume'
  | 'CoverLetter'
  | 'SkillGap'
  | 'Jobs'
  | 'JobDetail'
  | 'InterviewPrep'
  | 'Applications'
  | 'CompanyDetail';

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
      case 'ResumeBuilder':
        return <ResumeBuilderHome navigation={navigation} />;
      case 'AIAnalysis':
        return <AIAnalysisScreen navigation={navigation} route={{ params: navState.currentParams }} />;
      case 'CreateResume':
        return <CreateResumeScreen navigation={navigation} />;
      case 'CoverLetter':
        return <CoverLetterScreen navigation={navigation} route={{ params: navState.currentParams }} />;
      case 'SkillGap':
        return <SkillGapScreen navigation={navigation} route={{ params: navState.currentParams }} />;
      case 'Jobs':
        return <JobsHomeScreen navigation={navigation} />;
      case 'JobDetail':
        return <JobDetailScreen navigation={navigation} route={{ params: navState.currentParams }} />;
      case 'InterviewPrep':
        return <InterviewPrepScreen navigation={navigation} route={{ params: navState.currentParams }} />;
      case 'Applications':
        return <ApplicationsScreen navigation={navigation} />;
      case 'CompanyDetail':
        return <CompanyDetailScreen navigation={navigation} route={{ params: navState.currentParams }} />;
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
