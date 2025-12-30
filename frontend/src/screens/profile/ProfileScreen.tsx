import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { TabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<TabParamList, 'Profile'>;

const ProfileScreen = (_: Props) => {
  const { colors, typography } = useTheme();
  const { user, logout } = useAuth();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text, fontSize: typography.size.xxl }]}>
            Profile
          </Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.text, fontSize: typography.size.lg }]}>
            {user?.name}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary, fontSize: typography.size.md }]}>
            {user?.email}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.danger }]} 
          onPress={logout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    marginBottom: 10,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;

