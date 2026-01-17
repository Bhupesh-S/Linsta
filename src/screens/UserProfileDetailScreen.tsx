import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NetworkUser } from '../types/network.types';

interface UserProfileDetailScreenProps {
  route: {
    params: {
      user: NetworkUser;
    };
  };
  navigation: any;
}

export const UserProfileDetailScreen: React.FC<UserProfileDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { user } = route.params;

  const getConnectionStatusBadge = () => {
    switch (user.connectionStatus) {
      case 'connected':
        return { text: 'Connected', color: '#10b981', bg: '#d1fae5' };
      case 'pending':
        return { text: 'Pending', color: '#f59e0b', bg: '#fef3c7' };
      case 'requested':
        return { text: 'Requested', color: '#3b82f6', bg: '#dbeafe' };
      case 'blocked':
        return { text: 'Blocked', color: '#ef4444', bg: '#fee2e2' };
      default:
        return null;
    }
  };

  const badge = getConnectionStatusBadge();

  const handleConnect = () => {
    Alert.alert('Connect', `Sending connection request to ${user.name}`);
  };

  const handleFollow = () => {
    Alert.alert('Follow', `Following ${user.name}`);
  };

  const handleMessage = () => {
    Alert.alert('Message', `Opening chat with ${user.name}`);
  };

  const handleCall = () => {
    Alert.alert('Call', `Calling ${user.name}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color="#2563eb" />
          </View>
          
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
          <Text style={styles.organization}>{user.organization}</Text>
          
          {user.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#6b7280" />
              <Text style={styles.location}>{user.location}</Text>
            </View>
          )}

          {badge && (
            <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.statusText, { color: badge.color }]}>{badge.text}</Text>
            </View>
          )}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>234</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>567</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>123</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {user.connectionStatus === 'connected' ? (
            // Connected: Show Message & Call
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleMessage}>
                <Ionicons name="chatbubble-outline" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleCall}>
                <Ionicons name="call-outline" size={20} color="#2563eb" />
                <Text style={styles.secondaryButtonText}>Call</Text>
              </TouchableOpacity>
            </>
          ) : user.connectionStatus === 'pending' ? (
            // Pending: I sent them a request (awaiting their approval)
            <TouchableOpacity style={styles.disabledButton} disabled>
              <Text style={styles.disabledButtonText}>Request Pending</Text>
            </TouchableOpacity>
          ) : user.connectionStatus === 'requested' ? (
            // Requested: They sent me a request (I need to accept/reject)
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Accept', 'Accepting connection request')}>
                <Text style={styles.primaryButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Reject', 'Rejecting connection request')}>
                <Text style={styles.secondaryButtonText}>Reject</Text>
              </TouchableOpacity>
            </>
          ) : (
            // None: No relationship, show Connect & Follow
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleConnect}>
                <Ionicons name="person-add-outline" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleFollow}>
                <Ionicons name="add-outline" size={20} color="#2563eb" />
                <Text style={styles.secondaryButtonText}>Follow</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* About Section */}
        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {user.skills.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.activityCard}>
            <Ionicons name="newspaper-outline" size={24} color="#6b7280" />
            <Text style={styles.activityText}>No recent activity</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    fontWeight: '600',
    color: '#111827',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  organization: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButtonText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  bioText: {
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  activityText: {
    fontSize: 15,
    color: '#6b7280',
  },
});
