import React, { useState } from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import EventsDiscoveryScreen from '../screens/events/EventsDiscoveryScreen';
import EventDetailScreen from '../screens/events/EventDetailScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
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
  currentParams?: any;
  history: NavEntry[];
}

const AppNavigator = () => {
  const [navState, setNavState] = useState<NavigationState>({
    currentScreen: 'Home',
    currentParams: undefined,
    history: [],
  });

  const navigation = {
    navigate: (screen: Screen, params?: any) => {
      setNavState((s) => ({
        currentScreen: screen,
        eventDetail: params?.event,
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

  const renderScreen = () => {
    switch (navState.currentScreen) {
      case 'Home':
        return <HomeScreen navigation={navigation} />;
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

export default AppNavigator;
