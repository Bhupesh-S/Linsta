import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { EventFormData } from '../../utils/eventFormTypes';

interface Props {
  value: EventFormData;
  onChange: (patch: Partial<EventFormData>) => void;
  errors?: Partial<Record<keyof EventFormData, string>>;
}

const LocationStep: React.FC<Props> = ({ value, onChange, errors }) => {
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
      <Text style={[styles.label, { color: colors.text }]}>Location type</Text>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Toggle active={value.isOnline} label="Online" onPress={() => onChange({ isOnline: true })} />
        <Toggle active={!value.isOnline} label="Offline" onPress={() => onChange({ isOnline: false })} />
      </View>

      {value.isOnline ? (
        <View>
          <Text style={[styles.label, { color: colors.text }]}>Meeting link</Text>
          <TextInput
            placeholder="https://..."
            placeholderTextColor={colors.border}
            value={value.meetingLink ?? ''}
            onChangeText={(t) => onChange({ meetingLink: t })}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: errors?.meetingLink ? colors.primary : colors.border }]}
          />
        </View>
      ) : (
        <View>
          <Text style={[styles.label, { color: colors.text }]}>Venue address</Text>
          <TextInput
            placeholder="123 Street, City"
            placeholderTextColor={colors.border}
            value={value.venueAddress ?? ''}
            onChangeText={(t) => onChange({ venueAddress: t })}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: errors?.venueAddress ? colors.primary : colors.border }]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
});

export default LocationStep;
