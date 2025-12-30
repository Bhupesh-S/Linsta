import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  name: string;
  members: number;
  joined?: boolean;
  onToggle?: () => void;
}

const CommunityCard: React.FC<Props> = ({ name, members, joined, onToggle }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={{ color: colors.text }}>{members} members</Text>
      </View>
      <TouchableOpacity onPress={onToggle} style={[styles.btn, { backgroundColor: joined ? colors.card : colors.primary, borderColor: colors.border }]}>
        <Text style={{ color: joined ? colors.text : '#fff' }}>{joined ? 'Leave' : 'Join'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  name: { fontSize: 15, fontWeight: '700' },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
});

export default CommunityCard;
