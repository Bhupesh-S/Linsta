// UserCard Component - Displays user information with connection button

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NetworkUser } from '../types/network.types';

interface UserCardProps {
  user: NetworkUser;
  onConnect: (userId: string) => Promise<void>;
  onViewProfile: (user: NetworkUser) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onConnect, onViewProfile }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect(user.id);
    } finally {
      setIsConnecting(false);
    }
  };

  const renderConnectionButton = () => {
    // For connected users, don't show connection status badge
    if (user.connectionStatus === 'connected') {
      return null;
    }

    // Pending - we sent a request
    if (user.connectionStatus === 'pending') {
      return (
        <View style={styles.pendingButton}>
          <Text style={styles.pendingButtonText}>Pending</Text>
        </View>
      );
    }

    // Requested - they sent us a request
    if (user.connectionStatus === 'requested') {
      return (
        <View style={styles.requestedButton}>
          <Text style={styles.requestedButtonText}>Respond</Text>
        </View>
      );
    }

    // None state - No relationship, show Connect button
    return (
      <TouchableOpacity
        onPress={handleConnect}
        disabled={isConnecting}
        style={styles.connectButton}
      >
        {isConnecting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.connectButtonText}>Connect</Text>
        )}
      </TouchableOpacity>
    );
  };

  const getFollowButton = () => {
    // Don't show follow button if they sent us a request (we should respond first)
    if (user.connectionStatus === 'requested') {
      return null;
    }

    if (user.isFollowing) {
      return (
        <View style={styles.followingButton}>
          <Text style={styles.followingButtonText}>Following</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {/* Handle follow */}}
        style={styles.followButton}
      >
        <Ionicons name="add" size={16} color="#2563eb" />
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      onPress={() => onViewProfile(user)}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color="#0a66c2" />
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
          <Text style={styles.userOrg}>{user.organization}</Text>
          
          {/* Skills */}
          {user.skills.length > 0 && (
            <View style={styles.skillsContainer}>
              {user.skills.slice(0, 3).map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
              {user.skills.length > 3 && (
                <View style={styles.moreSkills}>
                  <Text style={styles.moreSkillsText}>+{user.skills.length - 3}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {renderConnectionButton()}
          {getFollowButton()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  userRole: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  userOrg: {
    fontSize: 14,
    color: '#9ca3af',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  skillTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#374151',
  },
  moreSkills: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  moreSkillsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  buttonsContainer: {
    marginLeft: 8,
    gap: 6,
  },
  connectedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
  },
  connectedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  pendingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
  },
  pendingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  requestedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 20,
  },
  requestedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 20,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: '#fff',
    gap: 4,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  followingButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  followingButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
});
