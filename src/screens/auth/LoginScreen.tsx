import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
      <Button title="Sign in with Google" onPress={login} />
      <Button title="Go to Onboarding" onPress={() => navigation.navigate('Onboarding')} />
    </View>
  );
};

export default LoginScreen;
