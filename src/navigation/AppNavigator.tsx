import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EventDetailScreen from '../screens/common/EventDetailScreen';
import CreateEventScreen from '../screens/common/CreateEventScreen';
import UserProfileScreen from '../screens/common/UserProfileScreen';
import ChatScreen from '../screens/common/ChatScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Tabs"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

export default AppNavigator;

