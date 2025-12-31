import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Status = 'Draft' | 'Published' | 'Past';

interface Props {
  title: string;
  status: Status;
  dateTime: string;
  registrations: number;
  capacity?: number;
  onEdit?: () => void;
  onCancel?: () => void;
  onAttendees?: () => void;
}

const statusColors: Record<Status, string> = {
  Draft: '#6b7280',
  Published: '#0ea5e9',
  Past: '#9ca3af',
};

const EventCard: React.FC<Props> = ({ title, status, dateTime, registrations, capacity, onEdit, onCancel, onAttendees }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: statusColors[status] }]}>
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      </View>
      <Text style={{ color: colors.text, marginTop: 4 }}>{dateTime}</Text>
      <Text style={{ color: colors.text, marginTop: 4 }}>Registrations: {registrations}{capacity ? ` / ${capacity}` : ''}</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <TouchableOpacity onPress={onEdit} style={[styles.btn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAttendees} style={[styles.btn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text }}>Attendees</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={[styles.btn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text }}>Cancel Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  title: { fontWeight: '700', fontSize: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  btn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
});

export default EventCard;
