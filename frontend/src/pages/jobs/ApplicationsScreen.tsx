/**
 * ApplicationsScreen
 * Track all job applications with status timeline
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { getMockApplications } from '../../data/mockJobs';
import { getApplicationStatusColor } from '../../utils/jobUtils';
import { ApplicationStatus } from '../../types/job.types';

interface Props {
    navigation?: any;
}

const ApplicationsScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const applications = getMockApplications();
    const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');

    const statusFilters: { id: ApplicationStatus | 'all'; label: string; count: number }[] = [
        { id: 'all', label: 'All', count: applications.length },
        { id: 'submitted', label: 'Submitted', count: applications.filter(a => a.status === 'submitted').length },
        { id: 'in-review', label: 'In Review', count: applications.filter(a => a.status === 'in-review').length },
        { id: 'interview', label: 'Interview', count: applications.filter(a => a.status === 'interview').length },
        { id: 'offer', label: 'Offer', count: applications.filter(a => a.status === 'offer').length },
    ];

    const filteredApplications = filter === 'all'
        ? applications
        : applications.filter(app => app.status === filter);

    const getStatusIcon = (status: ApplicationStatus) => {
        switch (status) {
            case 'submitted': return 'send';
            case 'in-review': return 'eye';
            case 'interview': return 'people';
            case 'offer': return 'gift';
            case 'rejected': return 'close-circle';
            case 'accepted': return 'checkmark-circle';
            default: return 'document';
        }
    };

    const getStatusLabel = (status: ApplicationStatus) => {
        return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation?.goBack?.()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Applications</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="filter-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{applications.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {applications.filter(a => a.status === 'interview').length}
                        </Text>
                        <Text style={styles.statLabel}>Interviews</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {applications.filter(a => a.status === 'offer').length}
                        </Text>
                        <Text style={styles.statLabel}>Offers</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
            >
                {statusFilters.map((f) => (
                    <TouchableOpacity
                        key={f.id}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor: filter === f.id ? colors.primary : colors.surface,
                                borderColor: filter === f.id ? colors.primary : colors.border,
                            },
                        ]}
                        onPress={() => setFilter(f.id)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                { color: filter === f.id ? '#FFFFFF' : colors.text },
                            ]}
                        >
                            {f.label}
                        </Text>
                        {f.count > 0 && (
                            <View
                                style={[
                                    styles.filterBadge,
                                    {
                                        backgroundColor: filter === f.id ? 'rgba(255,255,255,0.3)' : colors.primary + '20',
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterBadgeText,
                                        { color: filter === f.id ? '#FFFFFF' : colors.primary },
                                    ]}
                                >
                                    {f.count}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {filteredApplications.map((application) => (
                    <TouchableOpacity
                        key={application.id}
                        style={[styles.applicationCard, { backgroundColor: colors.surface }]}
                        activeOpacity={0.7}
                        onPress={() => navigation?.navigate?.('JobDetail', { job: application.job })}
                    >
                        {/* Header */}
                        <View style={styles.cardHeader}>
                            <View style={styles.companyLogo}>
                                <Ionicons name="business" size={24} color={colors.primary} />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={[styles.jobTitle, { color: colors.text }]}>
                                    {application.job.title}
                                </Text>
                                <Text style={[styles.companyName, { color: colors.textSecondary }]}>
                                    {application.job.company.name}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: getApplicationStatusColor(application.status) + '20' },
                                ]}
                            >
                                <Ionicons
                                    name={getStatusIcon(application.status)}
                                    size={14}
                                    color={getApplicationStatusColor(application.status)}
                                />
                            </View>
                        </View>

                        {/* Status */}
                        <View style={styles.statusSection}>
                            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Status:</Text>
                            <Text
                                style={[
                                    styles.statusText,
                                    { color: getApplicationStatusColor(application.status) },
                                ]}
                            >
                                {getStatusLabel(application.status)}
                            </Text>
                        </View>

                        {/* Timeline */}
                        <View style={styles.timeline}>
                            {application.timeline.slice(0, 3).map((event, index) => (
                                <View key={event.id} style={styles.timelineItem}>
                                    <View
                                        style={[
                                            styles.timelineDot,
                                            {
                                                backgroundColor:
                                                    index === 0
                                                        ? getApplicationStatusColor(application.status)
                                                        : colors.border,
                                            },
                                        ]}
                                    />
                                    {index < application.timeline.length - 1 && (
                                        <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                                    )}
                                    <View style={styles.timelineContent}>
                                        <Text style={[styles.timelineStatus, { color: colors.text }]}>
                                            {getStatusLabel(event.status)}
                                        </Text>
                                        <Text style={[styles.timelineDate, { color: colors.textSecondary }]}>
                                            {formatDate(event.date)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Interview Details */}
                        {application.interviewDetails && !application.interviewDetails.completed && (
                            <View style={[styles.interviewAlert, { backgroundColor: '#8B5CF620' }]}>
                                <Ionicons name="calendar" size={20} color="#8B5CF6" />
                                <View style={styles.interviewInfo}>
                                    <Text style={[styles.interviewTitle, { color: colors.text }]}>
                                        Interview Scheduled
                                    </Text>
                                    <Text style={[styles.interviewDate, { color: colors.textSecondary }]}>
                                        {new Date(application.interviewDetails.scheduledDate!).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        })}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.prepButton}
                                    onPress={() => navigation?.navigate?.('InterviewPrep', { jobId: application.jobId })}
                                >
                                    <Text style={styles.prepButtonText}>Prep</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Actions */}
                        <View style={styles.cardActions}>
                            <Text style={[styles.appliedDate, { color: colors.textSecondary }]}>
                                Applied {formatDate(application.appliedDate)}
                            </Text>
                            <TouchableOpacity>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {filteredApplications.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Applications</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            {filter === 'all'
                                ? 'Start applying to jobs to track them here'
                                : `No applications in ${getStatusLabel(filter as ApplicationStatus)} status`}
                        </Text>
                    </View>
                )}

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    filtersContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 10,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1.5,
        gap: 8,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    },
    filterBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        alignItems: 'center',
    },
    filterBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    applicationCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    companyLogo: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: {
        flex: 1,
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    companyName: {
        fontSize: 14,
    },
    statusBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusSection: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    statusLabel: {
        fontSize: 14,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '700',
    },
    timeline: {
        marginBottom: 16,
    },
    timelineItem: {
        flexDirection: 'row',
        position: 'relative',
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 4,
    },
    timelineLine: {
        position: 'absolute',
        left: 5.5,
        top: 16,
        width: 1,
        height: 28,
    },
    timelineContent: {
        marginLeft: 12,
        marginBottom: 12,
    },
    timelineStatus: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    timelineDate: {
        fontSize: 12,
    },
    interviewAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 12,
        marginBottom: 12,
    },
    interviewInfo: {
        flex: 1,
    },
    interviewTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    interviewDate: {
        fontSize: 12,
    },
    prepButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#8B5CF6',
        borderRadius: 8,
    },
    prepButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    appliedDate: {
        fontSize: 13,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    },
    bottomSpacing: {
        height: 40,
    },
});

export default ApplicationsScreen;
