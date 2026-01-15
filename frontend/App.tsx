import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { StoryProvider } from './src/context/StoryContext';
import { ArticleProvider } from './src/context/ArticleContext';
import { EventProvider } from './src/context/EventContext';
import { MessageProvider } from './src/context/MessageContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <StoryProvider>
            <ArticleProvider>
              <EventProvider>
                <MessageProvider>
                  <StatusBar style="auto" />
                  <AppNavigator />
                </MessageProvider>
              </EventProvider>
            </ArticleProvider>
          </StoryProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

