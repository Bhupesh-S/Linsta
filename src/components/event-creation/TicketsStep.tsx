import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { EventFormData } from '../../utils/eventFormTypes';

interface Props {
  value: EventFormData;
  onChange: (patch: Partial<EventFormData>) => void;
  errors?: Partial<Record<keyof EventFormData, string>>;
}

const TicketsStep: React.FC<Props> = ({ value, onChange, errors }) => {
  const { colors } = useTheme();

  const Toggle = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
        backgroundColor: active ? colors.primary : colors.card,
        marginRight: 8,
      }}
    >
      <Text style={{ color: active ? '#fff' : colors.text }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>Ticket type</Text>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Toggle active={value.ticketType === 'Free'} label="Free" onPress={() => onChange({ ticketType: 'Free' })} />
        <Toggle active={value.ticketType === 'Paid'} label="Paid" onPress={() => onChange({ ticketType: 'Paid' })} />
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Capacity</Text>
      <TextInput
        placeholder="e.g. 100"
        placeholderTextColor={colors.border}
        value={value.capacity?.toString() ?? ''}
        onChangeText={(t) => onChange({ capacity: Number(t.replace(/[^0-9]/g, '')) || undefined })}
        keyboardType="numeric"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: errors?.capacity ? colors.primary : colors.border }]}
      />

      <Text style={[styles.label, { color: colors.text }]}>Registration deadline</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.border}
        value={value.registrationDeadline ?? ''}
        onChangeText={(t) => onChange({ registrationDeadline: t })}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: errors?.registrationDeadline ? colors.primary : colors.border }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
});

export default TicketsStep;
