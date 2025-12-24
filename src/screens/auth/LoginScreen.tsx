import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { colors, spacing, typography } = useTheme();
  const { login } = useAuth();

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: typography.size.xl },
          ]}
          allowFontScaling
        >
          Welcome back
        </Text>
        <Text
          style={{ color: colors.muted, marginTop: spacing.xs }}
          allowFontScaling
        >
          Sign in to continue. Google button is UI-only for now.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          label="Continue with Google"
          onPress={() => navigation.navigate('Onboarding')}
          accessibilityLabel="Mock Google sign in"
        />
        <Button
          label="Skip to app (mock)"
          onPress={login}
          style={{ backgroundColor: colors.secondary }}
          accessibilityLabel="Bypass sign in for development"
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  title: {
    fontWeight: '700',
  },
  actions: {
    marginTop: 24,
    gap: 16,
  },
});

export default LoginScreen;

