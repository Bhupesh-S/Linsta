import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import TicketQRCard from '../../components/tickets/TicketQRCard';
import CalendarActions from '../../components/tickets/CalendarActions';

interface Props { navigation?: any }

const TicketDetailScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  const onDownload = () => Alert.alert('Download', 'Ticket downloaded (UI only)');
  const onAddGoogle = () => Alert.alert('Calendar', 'Added to Google Calendar (UI only)');
  const onAddOutlook = () => Alert.alert('Calendar', 'Added to Outlook Calendar (UI only)');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerBar}>
        <Text style={[styles.header, { color: colors.text }]}>Ticket</Text>
        <Text
          onPress={() => (navigation?.goBack ? navigation.goBack() : null)}
          style={[styles.backLink, { color: colors.text }]}
        >
          Back
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TicketQRCard
          title="Tech Networking Night"
          dateTime="Jan 20, 6:00 PM – 9:00 PM (IST)"
          locationSummary="Offline • Indiranagar, Bengaluru"
          ticketId="TCKT-123456"
        />

        <View style={{ height: 12 }} />
        <CalendarActions onAddGoogle={onAddGoogle} onAddOutlook={onAddOutlook} />

        <View style={{ height: 12 }} />
        <TouchableOpacity onPress={onDownload} style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text }}>Download Ticket</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  backLink: { fontSize: 14 },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
});

export default TicketDetailScreen;
