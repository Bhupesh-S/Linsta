import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { EventFormData } from '../../utils/eventFormTypes';

interface Props {
  value: EventFormData;
}

const PreviewPublishStep: React.FC<Props> = ({ value }) => {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>Preview</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {value.coverImageUri ? (
          <Image source={{ uri: value.coverImageUri }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, { backgroundColor: colors.border }]} />
        )}
        <View style={{ padding: 12 }}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>{value.title || 'Untitled event'}</Text>
          <Text style={{ color: colors.text }} numberOfLines={2}>
            {value.description || 'No description'}
          </Text>
          <Text style={{ color: colors.text, marginTop: 6 }}>
            {value.startDate || 'Start date'} {value.startTime || ''} → {value.endDate || 'End date'} {value.endTime || ''}
          </Text>
          <Text style={{ color: colors.text, marginTop: 4 }}>
            {value.isOnline ? 'Online' : 'Offline'} {value.isOnline ? value.meetingLink || '' : value.venueAddress || ''}
          </Text>
          <Text style={{ color: colors.text, marginTop: 4 }}>
            {value.ticketType} {value.capacity ? `• Capacity: ${value.capacity}` : ''}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontWeight: '700', fontSize: 18, marginBottom: 8 },
  card: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  cover: { width: '100%', height: 160 },
  eventTitle: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
});

export default PreviewPublishStep;
