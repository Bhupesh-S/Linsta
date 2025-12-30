import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserStatus } from '../types/userTypes';

interface RestrictedAccessScreenProps {
  status: UserStatus;
  restrictionReason?: string;
  onLogout?: () => void;
  onCompleteProfile?: () => void;
}

const RestrictedAccessScreen: React.FC<RestrictedAccessScreenProps> = ({
  status,
  restrictionReason,
  onLogout,
  onCompleteProfile,
}) => {
  const getContent = () => {
    switch (status) {
      case UserStatus.SUSPENDED:
        return {
          icon: 'ban' as const,
          iconColor: '#ed4956',
          title: 'Account Suspended',
          message: restrictionReason || 'Your account has been suspended. Please contact support for more information.',
          action: 'Contact Support',
        };
      
      case UserStatus.RESTRICTED:
        return {
          icon: 'alert-circle' as const,
          iconColor: '#ffa500',
          title: 'Limited Access',
          message: restrictionReason || 'Your account has limited access. Some features may be unavailable.',
          action: 'Learn More',
        };
      
      case UserStatus.PROFILE_INCOMPLETE:
        return {
          icon: 'person-add' as const,
          iconColor: '#0a66c2',
          title: 'Complete Your Profile',
          message: 'Please complete your profile to access all features and connect with others.',
          action: 'Complete Profile',
        };
      
      default:
        return {
          icon: 'lock-closed' as const,
          iconColor: '#8e8e8e',
          title: 'Access Restricted',
          message: 'You do not have permission to access this content.',
          action: 'Go Back',
        };
    }
  };

  const content = getContent();

  const handleAction = () => {
    if (status === UserStatus.PROFILE_INCOMPLETE) {
      onCompleteProfile?.();
    } else {
      // Handle other actions
      console.log('Action clicked:', content.action);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${content.iconColor}15` }]}>
          <Ionicons name={content.icon} size={64} color={content.iconColor} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{content.title}</Text>

        {/* Message */}
        <Text style={styles.message}>{content.message}</Text>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: content.iconColor }]}
          onPress={handleAction}
        >
          <Text style={styles.actionButtonText}>{content.action}</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        {status !== UserStatus.PROFILE_INCOMPLETE && (
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#8e8e8e',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  logoutButton: {
    paddingVertical: 12,
  },
  logoutButtonText: {
    fontSize: 15,
    color: '#8e8e8e',
    fontWeight: '600',
  },
});

export default RestrictedAccessScreen;
