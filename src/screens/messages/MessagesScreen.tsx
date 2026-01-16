import React from 'react';
import { View, Text, Button } from 'react-native';

const MessagesScreen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Messages Screen</Text>
      <Button title="Go to Chat" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
};

export default MessagesScreen;
