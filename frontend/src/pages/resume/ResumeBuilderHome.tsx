/**
 * ResumeBuilderHome
 * Main screen for Resume Builder feature
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
import { getMockResumes } from '../../data/mockResumes';
import { Resume } from '../../types/resume.types';

interface Props {
    navigation?: any;
}

const ResumeBuilderHome: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const resumes = getMockResumes();

    const getScoreColor = (score: number) => {
        if (score >= 90) return '#10B981';
        if (score >= 75) return '#3B82F6';
        if (score >= 60) return '#F59E0B';
        return '#EF4444';
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
                    <Text style={styles.headerTitle}>Resume Builder</Text>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Overall Score */}
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Your Best Resume Score</Text>
                    <Text style={styles.scoreValue}>92/100</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '92%' }]} />
                    </View>
                    <Text style={styles.scoreHint}>Excellent! ATS-optimized</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity
                            style={[styles.actionCard, { backgroundColor: colors.surface }]}
                            activeOpacity={0.7}
                            onPress={() => navigation?.navigate?.('AIAnalysis', { resume: resumes[0] })}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#10B98120' }]}>
                                <Ionicons name="sparkles" size={24} color="#10B981" />
                            </View>
                            <Text style={[styles.actionLabel, { color: colors.text }]}>AI Analyze</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionCard, { backgroundColor: colors.surface }]}
                            activeOpacity={0.7}
                            onPress={() => navigation?.navigate?.('CoverLetter', { resume: resumes[0] })}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#3B82F620' }]}>
                                <Ionicons name="document-text" size={24} color="#3B82F6" />
                            </View>
                            <Text style={[styles.actionLabel, { color: colors.text }]}>Cover Letter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionCard, { backgroundColor: colors.surface }]}
                            activeOpacity={0.7}
                            onPress={() => navigation?.navigate?.('SkillGap', { resume: resumes[0] })}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#F59E0B20' }]}>
                                <Ionicons name="analytics" size={24} color="#F59E0B" />
                            </View>
                            <Text style={[styles.actionLabel, { color: colors.text }]}>Skill Gap</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* My Resumes */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            My Resumes ({resumes.length})
                        </Text>
                        <TouchableOpacity>
                            <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {resumes.map((resume) => (
                        <TouchableOpacity
                            key={resume.id}
                            style={[styles.resumeCard, { backgroundColor: colors.surface }]}
                            activeOpacity={0.7}
                        >
                            <View style={styles.resumeHeader}>
                                <View style={styles.resumeInfo}>
                                    <Ionicons name="document-text" size={24} color={colors.primary} />
                                    <View style={styles.resumeDetails}>
                                        <Text style={[styles.resumeTitle, { color: colors.text }]}>
                                            {resume.title}
                                        </Text>
                                        <Text style={[styles.resumeSubtitle, { color: colors.textSecondary }]}>
                                            Updated {new Date(resume.updatedAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(resume.aiScore.overall) + '20' }]}>
                                    <Text style={[styles.scoreText, { color: getScoreColor(resume.aiScore.overall) }]}>
                                        {resume.aiScore.overall}/100
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.resumeStats}>
                                <View style={styles.stat}>
                                    <Ionicons name="briefcase-outline" size={16} color={colors.textSecondary} />
                                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                                        {resume.experience.length} experiences
                                    </Text>
                                </View>
                                <View style={styles.stat}>
                                    <Ionicons name="school-outline" size={16} color={colors.textSecondary} />
                                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                                        {resume.education.length} education
                                    </Text>
                                </View>
                                <View style={styles.stat}>
                                    <Ionicons name="code-slash-outline" size={16} color={colors.textSecondary} />
                                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                                        {resume.skills.length} skills
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.resumeActions}>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Ionicons name="create-outline" size={18} color={colors.text} />
                                    <Text style={[styles.actionBtnText, { color: colors.text }]}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Ionicons name="share-social-outline" size={18} color={colors.text} />
                                    <Text style={[styles.actionBtnText, { color: colors.text }]}>Share</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn, { backgroundColor: colors.primary }]}>
                                    <Ionicons name="download-outline" size={18} color="#FFFFFF" />
                                    <Text style={styles.primaryBtnText}>Export</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Create New Resume */}
                <TouchableOpacity
                    style={[styles.createButton, { backgroundColor: colors.primary }]}
                    activeOpacity={0.8}
                    onPress={() => navigation?.navigate?.('CreateResume')}
                >
                    <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.createButtonText}>Create New Resume</Text>
                </TouchableOpacity>

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
        marginBottom: 24,
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
    settingsButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    scoreLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    scoreHint: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    actionCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionLabel: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    resumeCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    resumeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    resumeInfo: {
        flexDirection: 'row',
        gap: 12,
        flex: 1,
    },
    resumeDetails: {
        flex: 1,
    },
    resumeTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    resumeSubtitle: {
        fontSize: 13,
    },
    scoreBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    scoreText: {
        fontSize: 14,
        fontWeight: '700',
    },
    resumeStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
    },
    resumeActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    actionBtnText: {
        fontSize: 13,
        fontWeight: '600',
    },
    primaryBtn: {
        borderWidth: 0,
    },
    primaryBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default ResumeBuilderHome;
