import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { StoryProvider } from './src/context/StoryContext';
import { ArticleProvider } from './src/context/ArticleContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <StoryProvider>
            <ArticleProvider>
              <StatusBar style="auto" />
              <AppNavigator />
            </ArticleProvider>
          </StoryProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

