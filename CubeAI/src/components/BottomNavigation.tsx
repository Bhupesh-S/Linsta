import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => handleTabPress(tab.id)}
        >
          <Ionicons
            name={tab.icon as any}
            size={26}
            color={activeTab === tab.id ? '#262626' : '#8e8e8e'}
          />
          <Text
            style={[
              styles.label,
              activeTab === tab.id && styles.activeLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
    paddingVertical: 6,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 10,
    color: '#8e8e8e',
    fontWeight: '500',
    marginTop: 2,
  },
  activeLabel: {
    color: '#262626',
  },
});

export default BottomNavigation;
