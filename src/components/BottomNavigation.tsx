import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomNavigationProps {
  activeTab?: string;
  navigation?: any;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'Home',
  navigation,
}) => {
  const tabs = [
    { id: 'Home', icon: 'home', label: 'Home' },
    { id: 'Network', icon: 'people', label: 'Network' },
    { id: 'Create', icon: 'add-circle', label: 'Post' },
    { id: 'Events', icon: 'calendar', label: 'Events' },
    { id: 'Profile', icon: 'person', label: 'Me' },
  ];

  const handleTabPress = (tabId: string) => {
    if (tabId === 'Events' && navigation) {
      navigation.navigate('Events');
    } else if (tabId === 'Home' && navigation) {
      navigation.navigate('Home');
    } else if (tabId === 'Create' && navigation) {
      navigation.navigate('CreateEvent');
    } else if (tabId === 'Network' && navigation) {
      navigation.navigate('Network');
    } else if (tabId === 'Profile' && navigation) {
      navigation.navigate('Profile');
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            activeOpacity={0.6}
            onPress={() => handleTabPress(tab.id)}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name={isActive ? tab.icon : `${tab.icon}-outline` as any}
                size={28}
                color={isActive ? '#0A66C2' : '#666666'}
              />
              <Text
                style={[
                  styles.label,
                  isActive && styles.activeLabel,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  label: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  activeLabel: {
    color: '#0A66C2',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 32,
    height: 3,
    backgroundColor: '#0A66C2',
    borderRadius: 2,
  },
});

export default BottomNavigation;

