import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { EventFormData, EventCategory } from '../../utils/eventFormTypes';

interface Props {
  value: EventFormData;
  onChange: (patch: Partial<EventFormData>) => void;
  errors?: Partial<Record<keyof EventFormData, string>>;
}

const CATEGORIES: EventCategory[] = ['Conference', 'Workshop', 'Meetup', 'Webinar', 'Networking', 'Festival'];

const BasicInfoStep: React.FC<Props> = ({ value, onChange, errors }) => {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>Event title *</Text>
      <TextInput
        placeholder="Enter a clear title"
        placeholderTextColor={colors.border}
        value={value.title}
        onChangeText={(t) => onChange({ title: t })}
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: errors?.title ? colors.primary : colors.border,
          },
        ]}
      />
      {!!errors?.title && <Text style={[styles.error, { color: colors.text }]}>{errors?.title}</Text>}

      <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
      <TextInput
        placeholder="Describe your event"
        placeholderTextColor={colors.border}
        value={value.description}
        onChangeText={(t) => onChange({ description: t })}
        multiline
        numberOfLines={4}
        style={[
          styles.textarea,
          { backgroundColor: colors.card, color: colors.text, borderColor: errors?.description ? colors.primary : colors.border },
        ]}
      />
      {!!errors?.description && <Text style={[styles.error, { color: colors.text }]}>{errors?.description}</Text>}

      <Text style={[styles.label, { color: colors.text }]}>Category</Text>
      <View style={[styles.pillRow]}>
        {CATEGORIES.map((cat) => {
          const active = value.category === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onChange({ category: cat })}
              style={[
                styles.pill,
                { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border },
              ]}
            >
              <Text style={{ color: active ? '#fff' : colors.text, fontSize: 12 }}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Cover image</Text>
      {value.coverImageUri ? (
        <Image source={{ uri: value.coverImageUri }} style={styles.cover} />
      ) : (
        <View style={[styles.coverPlaceholder, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.border, fontSize: 12 }}>No image selected</Text>
        </View>
      )}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => onChange({ coverImageUri: 'https://picsum.photos/640/360' })}
      >
        <Text style={{ color: colors.text }}>Upload (mock)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
  textarea: { borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 100, textAlignVertical: 'top' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  cover: { width: '100%', height: 160, borderRadius: 8 },
  coverPlaceholder: { height: 160, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  button: { marginTop: 8, borderWidth: 1, borderRadius: 8, padding: 12, alignItems: 'center' },
  error: { marginTop: 4, fontSize: 12 },
});

export default BasicInfoStep;
