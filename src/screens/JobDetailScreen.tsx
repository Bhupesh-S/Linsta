import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Job } from '../types/job.types';

interface JobDetailScreenProps {
  navigation: any;
  route: {
    params: {
      job: Job;
    };
  };
}

export const JobDetailScreen: React.FC<JobDetailScreenProps> = ({ navigation, route }) => {
  const { job } = route.params;

  // State management for job actions
  const [isSaved, setIsSaved] = useState(job.userState?.isSaved || false);
  const [hasApplied, setHasApplied] = useState(job.userState?.hasApplied || false);
  const [applicationStatus, setApplicationStatus] = useState(job.userState?.applicationStatus);

  const handleApply = async () => {
    if (hasApplied) return;

    if (job.applyType === 'external' && job.externalApplyUrl) {
      // External apply - open URL
      const canOpen = await Linking.canOpenURL(job.externalApplyUrl);
      if (canOpen) {
        await Linking.openURL(job.externalApplyUrl);
      } else {
        Alert.alert('Error', 'Cannot open application link');
      }
    } else {
      // Easy apply - in-app
      Alert.alert(
        'Apply for this job?',
        `You are applying for ${job.title} at ${job.company}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Apply',
            onPress: () => {
              setHasApplied(true);
              setApplicationStatus('applied');
              Alert.alert('Success', 'Your application has been submitted!');
            },
          },
        ]
      );
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? 'Removed from saved' : 'Saved',
      isSaved ? 'Job removed from your saved jobs' : 'Job saved for later'
    );
  };

  const handleShare = async () => {
    try {
      const message = `Check out this job opportunity!\n\n${job.title} at ${job.company}\n\nLocation: ${job.location}\nSalary: ${job.salary}\n\n${job.description}`;
      
      const result = await Share.share({
        message: message,
        title: `${job.title} - ${job.company}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
          console.log('Shared with activity type:', result.activityType);
        } else {
          // Shared successfully
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share job posting');
      console.error('Error sharing:', error);
    }
  };

  const getApplicationStatusBadge = () => {
    if (!hasApplied) return null;

    const statusConfig = {
      applied: { label: 'Applied', color: '#2563eb', icon: 'checkmark-circle' },
      in_review: { label: 'In Review', color: '#f59e0b', icon: 'time' },
      rejected: { label: 'Rejected', color: '#ef4444', icon: 'close-circle' },
      accepted: { label: 'Accepted', color: '#10b981', icon: 'checkmark-circle' },
    };

    const config = statusConfig[applicationStatus || 'applied'];

    return (
      <View style={[styles.statusBadge, { backgroundColor: `${config.color}15` }]}>
        <Ionicons name={config.icon as any} size={16} color={config.color} />
        <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
      </View>
    );
  };

  const formatJobType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Company and Title */}
        <View style={styles.titleSection}>
          <View style={styles.companyLogo}>
            <Text style={styles.companyLogoText}>{job.companyLogo || '🏢'}</Text>
          </View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>
          {getApplicationStatusBadge()}
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>{job.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>{formatJobType(job.type)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>{job.salary}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>Posted {formatDate(job.postedDate)}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={24} color="#2563eb" />
            <Text style={styles.statValue}>{job.applicantsCount}</Text>
            <Text style={styles.statLabel}>Applicants</Text>
          </View>
          {job.applicationDeadline && (
            <View style={styles.statItem}>
              <Ionicons name="time" size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{formatDate(job.applicationDeadline)}</Text>
              <Text style={styles.statLabel}>Deadline</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Job</Text>
          <Text style={styles.sectionText}>
            {job.fullDescription || job.description}
          </Text>
        </View>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {job.requirements.map((req, index) => (
              <View key={index} style={styles.bulletItem}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{req}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Responsibilities</Text>
            {job.responsibilities.map((resp, index) => (
              <View key={index} style={styles.bulletItem}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{resp}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            {job.benefits.map((benefit, index) => (
              <View key={index} style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.bulletText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skillsContainer}>
            {job.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Company Info */}
        {job.companyDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {job.company}</Text>
            <Text style={styles.sectionText}>{job.companyDescription}</Text>
            {job.companySize && (
              <View style={styles.companyMetaRow}>
                <Ionicons name="people-outline" size={16} color="#6b7280" />
                <Text style={styles.companyMetaText}>{job.companySize}</Text>
              </View>
            )}
            {job.companyIndustry && (
              <View style={styles.companyMetaRow}>
                <Ionicons name="business-outline" size={16} color="#6b7280" />
                <Text style={styles.companyMetaText}>{job.companyIndustry}</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.saveButton, isSaved && styles.saveButtonActive]}
          onPress={handleSave}
        >
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? '#2563eb' : '#6b7280'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.applyButton,
            hasApplied && styles.applyButtonDisabled,
          ]}
          onPress={handleApply}
          disabled={hasApplied}
        >
          <Text style={styles.applyButtonText}>
            {hasApplied ? 'Applied ✓' : job.applyType === 'external' ? 'Apply on Website' : 'Easy Apply'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 40, // Add gap for status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  shareButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  companyLogoText: {
    fontSize: 40,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickInfoSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
    marginTop: 8,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  skillText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  companyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  companyMetaText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  saveButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonActive: {
    backgroundColor: '#eff6ff',
  },
  applyButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
