import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import UserCard from '../../components/network/UserCard';

interface Props { navigation?: any }

const ConnectionsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  const users = [
    { id: 'u4', name: 'Saira Khan', headline: 'Data Scientist @ Nimbus' },
    { id: 'u5', name: 'Aman Verma', headline: 'Frontend Dev @ Pixel' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerBar}>
        <Text style={[styles.header, { color: colors.text }]}>Connections</Text>
        <Text onPress={() => (navigation?.goBack ? navigation.goBack() : null)} style={[styles.backLink, { color: colors.text }]}>Back</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {users.map(u => (
          <UserCard key={u.id} name={u.name} headline={u.headline} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: '700' },
  backLink: { fontSize: 14 },
});

export default ConnectionsScreen;
