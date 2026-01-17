import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Job } from '../types/job.types';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  navigation?: any;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply, navigation }) => {
  const [hasApplied, setHasApplied] = useState(job.userState?.hasApplied || false);

  // Sync local state with prop changes (e.g., when loaded from AsyncStorage)
  useEffect(() => {
    setHasApplied(job.userState?.hasApplied || false);
  }, [job.userState?.hasApplied]);

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full_time':
        return '#10b981';
      case 'part_time':
        return '#f59e0b';
      case 'internship':
        return '#3b82f6';
      case 'contract':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const formatJobType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleCardPress = () => {
    if (navigation) {
      navigation.navigate('JobDetail', { job });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleCardPress} activeOpacity={0.7}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyLogoContainer}>
          <Ionicons name="business" size={32} color="#2563eb" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={styles.company}>{job.company}</Text>
        </View>
      </View>

      {/* Location and Type */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text style={styles.metaText}>{job.location}</Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: `${getJobTypeColor(job.type)}15` }]}>
          <Text style={[styles.typeText, { color: getJobTypeColor(job.type) }]}>
            {formatJobType(job.type)}
          </Text>
        </View>
      </View>

      {/* Salary */}
      {job.salary && (
        <View style={styles.salaryRow}>
          <Ionicons name="cash-outline" size={16} color="#059669" />
          <Text style={styles.salaryText}>{job.salary}</Text>
        </View>
      )}

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {job.description}
      </Text>

      {/* Skills */}
      <View style={styles.tagsContainer}>
        {job.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{skill}</Text>
          </View>
        ))}
        {job.skills.length > 3 && (
          <Text style={styles.moreTagsText}>+{job.skills.length - 3} more</Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Ionicons name="people-outline" size={16} color="#6b7280" />
          <Text style={styles.applicantsText}>{job.applicantsCount} applicants</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.postedText}>{formatDate(job.postedDate)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.applyButton, hasApplied && styles.appliedButton]}
          onPress={(e) => {
            e.stopPropagation();
            if (!hasApplied) {
              setHasApplied(true);
              onApply?.(job.id);
            }
          }}
          disabled={hasApplied}
        >
          <Text style={[styles.applyButtonText, hasApplied && styles.appliedButtonText]}>
            {hasApplied ? 'Applied' : 'Apply'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  companyLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  salaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  applicantsText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 4,
  },
  dotSeparator: {
    fontSize: 13,
    color: '#d1d5db',
    marginHorizontal: 6,
  },
  postedText: {
    fontSize: 13,
    color: '#6b7280',
  },
  applyButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  appliedButton: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  appliedButtonText: {
    color: '#6b7280',
  },
});
