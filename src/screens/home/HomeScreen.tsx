import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { useTheme } from '../../context/ThemeContext';
import { TabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<TabParamList, 'Home'>;

const HomeScreen = (_: Props) => {
  const { colors, typography } = useTheme();

  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text
          style={{ color: colors.text, fontSize: typography.size.lg }}
          allowFontScaling
        >
          Home Screen
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;

