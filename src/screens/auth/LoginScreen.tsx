import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';

interface LoginScreenProps {
  navigation?: any;
  onLoginSuccess?: (isNewUser: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    setErrors({ email: '', password: '' });

    let hasError = false;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      setIsLoading(false);
      onLoginSuccess?.(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };

  const handleOAuthLogin = (provider: string) => {
    Alert.alert(`${provider} Login`, `${provider} authentication would be implemented here.`);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset link would be sent to your email.');
  };

  const handleSignUp = () => {
    console.log('Sign Up clicked, navigating to Signup screen');
    navigation?.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="calendar" size={32} color="#fff" />
            </View>
            <Text style={styles.logoText}>Linsta</Text>
          </View>

          {/* Welcome Title */}
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Ionicons name="mail-outline" size={20} color="#8e8e8e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#8e8e8e"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color="#8e8e8e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#8e8e8e"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#8e8e8e"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.loginButtonText}>Logging in...</Text>
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* OAuth Buttons */}
          <View style={styles.oauthContainer}>
            <TouchableOpacity
              style={styles.oauthButton}
              onPress={() => handleOAuthLogin('Google')}
            >
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.oauthButton}
              onPress={() => handleOAuthLogin('Microsoft')}
            >
              <Ionicons name="logo-microsoft" size={24} color="#00A4EF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.oauthButton}
              onPress={() => handleOAuthLogin('LinkedIn')}
            >
              <Ionicons name="logo-linkedin" size={24} color="#0A66C2" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0a66c2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#262626',
  },
  headerContainer: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#8e8e8e',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#ed4956',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#262626',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ed4956',
    marginTop: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#0a66c2',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#0a66c2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dbdbdb',
  },
  dividerText: {
    fontSize: 13,
    color: '#8e8e8e',
    marginHorizontal: 12,
  },
  oauthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  oauthButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#8e8e8e',
  },
  signUpLink: {
    fontSize: 14,
    color: '#0a66c2',
    fontWeight: '600',
  },
});

export default LoginScreen;
