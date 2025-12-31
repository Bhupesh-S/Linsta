import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ConnectButton from './ConnectButton';

interface Props {
  name: string;
  headline: string;
  avatar?: string;
}

const UserCard: React.FC<Props> = ({ name, headline, avatar }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: avatar || 'https://i.pravatar.cc/120' }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={{ color: colors.text }}>{headline}</Text>
      </View>
      <ConnectButton />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ccc' },
  name: { fontSize: 15, fontWeight: '700' },
});

export default UserCard;
