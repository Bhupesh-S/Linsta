import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen = ({ navigation }: Props) => {
  const { colors, spacing, typography } = useTheme();
  const { completeOnboarding, login } = useAuth();

  const handleContinue = () => {
    completeOnboarding();
    login();
  };

  return (
    <ScreenWrapper scrollable>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: typography.size.lg },
          ]}
          allowFontScaling
        >
          Quick onboarding
        </Text>
        <Text style={{ color: colors.muted }} allowFontScaling>
          Capture lightweight profile info. These fields are placeholders only.
        </Text>

        <View style={[styles.form, { gap: spacing.md }]}>
          <Input placeholder="College" accessibilityLabel="College input" />
          <Input placeholder="Course" accessibilityLabel="Course input" />
          <Input placeholder="Year" accessibilityLabel="Year input" />
          <Input
            placeholder="Interests"
            accessibilityLabel="Interests input"
            multiline
          />
        </View>

        <Button label="Continue" onPress={handleContinue} />
        <Button
          label="Back to login"
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: colors.secondary }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  form: {
    marginVertical: 8,
  },
  title: {
    fontWeight: '700',
  },
});

export default OnboardingScreen;

