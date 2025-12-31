import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ExperienceCard from '../../components/profile/ExperienceCard';
import SkillTag from '../../components/profile/SkillTag';
import MediaGrid from '../../components/profile/MediaGrid';

interface Props { navigation?: any; username?: string }

const ProfileScreen: React.FC<Props> = ({ navigation, username = 'johndoe' }) => {
  const { colors } = useTheme();
  const { logout } = useUser();

  const onConnect = () => { };

  const handleLogout = () => {
    logout();
    navigation?.navigate?.('Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Enhanced Header Bar */}
      <View style={[styles.headerBar, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack?.()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation?.navigate?.('ProfileEdit')}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ProfileHeader
          name="John Doe"
          headline="Software Engineer @ Acme"
          location="Bengaluru, India"
          relation="Connect"
          onActionPress={onConnect}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        <Text style={{ color: colors.text, marginBottom: 12 }}>
          Passionate engineer building delightful mobile experiences. Previously at FooCorp.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Experience</Text>
        <ExperienceCard company="Acme Inc." role="Senior Engineer" duration="2023 – Present" description="Leading the mobile platform." />
        <ExperienceCard company="FooCorp" role="Engineer" duration="2020 – 2023" description="Shipped multiple consumer apps." />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Education</Text>
        <ExperienceCard company="IIT Example" role="B.Tech, CSE" duration="2016 – 2020" />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Certifications</Text>
        <ExperienceCard company="AWS" role="AWS Certified Developer" duration="2024" />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills & Achievements</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <SkillTag label="React Native" endorsed />
          <SkillTag label="TypeScript" endorsed />
          <SkillTag label="Node.js" />
          <SkillTag label="UI/UX" />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Media</Text>
        <MediaGrid items={[
          { id: 'm1', uri: 'https://picsum.photos/400/400?1', type: 'image' },
          { id: 'm2', uri: 'https://picsum.photos/400/400?2', type: 'image' },
          { id: 'm3', uri: 'https://picsum.photos/400/400?3', type: 'image' },
        ]} />

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  backLink: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    marginBottom: 100,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#dc2626',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
});

export default ProfileScreen;
