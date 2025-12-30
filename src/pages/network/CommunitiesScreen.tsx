import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CommunityCard from '../../components/network/CommunityCard';

interface Props { navigation?: any }

const CommunitiesScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  const communities = [
    { id: 'c1', name: 'React Developers', members: 12345 },
    { id: 'c2', name: 'Designers Guild', members: 8421 },
    { id: 'c3', name: 'IIT Alumni', members: 2103 },
  ];

  const toggle = (id: string) => setJoined((s) => ({ ...s, [id]: !s[id] }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <View style={styles.headerBar}>
        <Text style={[styles.header, { color: colors.text }]}>Communities</Text>
        <Text onPress={() => navigation?.goBack?.()} style={[styles.backLink, { color: colors.text }]}>Back</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {communities.map((c) => (
          <CommunityCard key={c.id} name={c.name} members={c.members} joined={!!joined[c.id]} onToggle={() => toggle(c.id)} />
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

export default CommunitiesScreen;
