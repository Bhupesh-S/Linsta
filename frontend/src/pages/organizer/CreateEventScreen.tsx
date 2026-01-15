/**
 * CreateEventScreen
 * Form to create a new event
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

interface Props {
    navigation?: any;
}

const CreateEventScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();

    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [venueName, setVenueName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [capacity, setCapacity] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');

    const categories = ['Conference', 'Workshop', 'Networking', 'Entertainment', 'Sports', 'Food & Beverage'];

    const handleCreate = () => {
        if (!eventName || !category || !venueName || !startDate) {
            Alert.alert('Required Fields', 'Please fill in all required fields');
            return;
        }

        Alert.alert(
            'Event Created!',
            'Your event has been created successfully',
            [
                {
                    text: 'OK',
                    onPress: () => navigation?.goBack?.(),
                },
            ]
        );
    };

    const handleSaveDraft = () => {
        Alert.alert('Draft Saved', 'Your event has been saved as draft');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={[colors.primary, colors.primary + 'DD']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation?.goBack?.()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Event</Text>
                    <TouchableOpacity
                        onPress={handleSaveDraft}
                        style={styles.draftButton}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.draftButtonText}>Save Draft</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Event Banner Upload */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Event Banner</Text>
                    <TouchableOpacity
                        style={[styles.uploadBox, { borderColor: colors.border }]}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="image-outline" size={48} color={colors.textSecondary} />
                        <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                            Upload Event Banner
                        </Text>
                        <Text style={[styles.uploadHint, { color: colors.textTertiary }]}>
                            Recommended: 1200x400px
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Basic Information */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Basic Information
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>
                            Event Name <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                            ]}
                            placeholder="Enter event name"
                            placeholderTextColor={colors.textSecondary}
                            value={eventName}
                            onChangeText={setEventName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>
                            Category <Text style={styles.required}>*</Text>
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.categoryRow}>
                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[
                                            styles.categoryChip,
                                            {
                                                backgroundColor: category === cat ? colors.primary : colors.background,
                                                borderColor: category === cat ? colors.primary : colors.border,
                                            },
                                        ]}
                                        onPress={() => setCategory(cat)}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                { color: category === cat ? '#FFFFFF' : colors.text },
                                            ]}
                                        >
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
                        <TextInput
                            style={[
                                styles.textArea,
                                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                            ]}
                            placeholder="Describe your event..."
                            placeholderTextColor={colors.textSecondary}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                {/* Date & Time */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Date & Time</Text>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>
                                Start Date <Text style={styles.required}>*</Text>
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.input,
                                    { backgroundColor: colors.background, borderColor: colors.border },
                                ]}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                                <Text style={[styles.inputText, { color: colors.textSecondary }]}>
                                    {startDate || 'Select date'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>
                                Start Time <Text style={styles.required}>*</Text>
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.input,
                                    { backgroundColor: colors.background, borderColor: colors.border },
                                ]}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                                <Text style={[styles.inputText, { color: colors.textSecondary }]}>
                                    {startTime || 'Select time'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Venue */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Venue</Text>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>
                            Venue Name <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                            ]}
                            placeholder="Enter venue name"
                            placeholderTextColor={colors.textSecondary}
                            value={venueName}
                            onChangeText={setVenueName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Address</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                            ]}
                            placeholder="Street address"
                            placeholderTextColor={colors.textSecondary}
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>City</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                            ]}
                            placeholder="Enter city"
                            placeholderTextColor={colors.textSecondary}
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>
                </View>

                {/* Tickets */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Tickets</Text>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>
                                Total Capacity
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                                ]}
                                placeholder="100"
                                placeholderTextColor={colors.textSecondary}
                                value={capacity}
                                onChangeText={setCapacity}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>
                                Ticket Price (₹)
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                                ]}
                                placeholder="999"
                                placeholderTextColor={colors.textSecondary}
                                value={ticketPrice}
                                onChangeText={setTicketPrice}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Bottom Actions */}
            <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.previewButton, { borderColor: colors.border }]}
                    activeOpacity={0.7}
                >
                    <Ionicons name="eye-outline" size={20} color={colors.text} />
                    <Text style={[styles.previewButtonText, { color: colors.text }]}>Preview</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.createButton, { backgroundColor: colors.primary }]}
                    onPress={handleCreate}
                    activeOpacity={0.7}
                >
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.createButtonText}>Create Event</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    draftButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    draftButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        margin: 16,
        padding: 20,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    uploadBox: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
    },
    uploadText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
    },
    uploadHint: {
        fontSize: 13,
        marginTop: 4,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    required: {
        color: '#EF4444',
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 15,
        gap: 10,
    },
    inputText: {
        fontSize: 15,
    },
    textArea: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 15,
        textAlignVertical: 'top',
    },
    categoryRow: {
        flexDirection: 'row',
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    bottomSpacing: {
        height: 100,
    },
    bottomBar: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
    },
    previewButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    previewButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    createButton: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default CreateEventScreen;
