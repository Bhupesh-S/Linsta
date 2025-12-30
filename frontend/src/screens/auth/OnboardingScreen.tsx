import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const OnboardingScreen = () => {
  const { login } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Onboarding Screen</Text>
      <TextInput placeholder="College" style={{ borderWidth: 1, padding: 8, marginVertical: 8, width: '80%' }} />
      <TextInput placeholder="Course" style={{ borderWidth: 1, padding: 8, marginVertical: 8, width: '80%' }} />
      <TextInput placeholder="Year" style={{ borderWidth: 1, padding: 8, marginVertical: 8, width: '80%' }} />
      <TextInput placeholder="Interests" style={{ borderWidth: 1, padding: 8, marginVertical: 8, width: '80%' }} />
      <Button title="Complete" onPress={login} />
    </View>
  );
};

export default OnboardingScreen;
