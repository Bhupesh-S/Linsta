import React, { useState } from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import EventsDiscoveryScreen from '../screens/events/EventsDiscoveryScreen';
import EventDetailScreen from '../screens/events/EventDetailScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import { Event } from '../utils/eventTypes';

type Screen = 'Home' | 'Events' | 'EventDetail' | 'CreateEvent';

interface NavigationState {
  currentScreen: Screen;
  eventDetail?: Event;
}

const AppNavigator = () => {
  const [navState, setNavState] = useState<NavigationState>({
    currentScreen: 'Home',
  });

  const navigation = {
    navigate: (screen: Screen, params?: any) => {
      setNavState({
        currentScreen: screen,
        eventDetail: params?.event,
      });
    },
    goBack: () => {
      // Determine where to go back based on current screen
      if (navState.currentScreen === 'EventDetail') {
        setNavState({ currentScreen: 'Events' });
      } else if (navState.currentScreen === 'CreateEvent') {
        setNavState({ currentScreen: 'Home' });
      } else {
        setNavState({ currentScreen: 'Home' });
      }
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

export default AppNavigator;
