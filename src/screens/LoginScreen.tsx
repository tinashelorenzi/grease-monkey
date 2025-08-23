import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { Button, Card, Text } from '../components/common';
import { TextInput } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../services';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await authService.login({ email, password });
      // Navigation will be handled automatically by AuthContext
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    try {
      await authService.sendPasswordReset(email);
      Alert.alert(
        'Password Reset',
        'Password reset email sent. Please check your inbox.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1" color="primary" align="center" style={styles.title}>
            Grease Monkey
          </Text>
          <Text variant="body1" color="secondary" align="center" style={styles.subtitle}>
            Your trusted automotive partner
          </Text>
        </View>

        {/* Login Card */}
        <Card variant="elevated" style={styles.loginCard}>
          <Text variant="h2" style={styles.cardTitle}>
            Welcome Back
          </Text>
          <Text variant="body2" color="secondary" style={styles.cardSubtitle}>
            Sign in to access your account
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text variant="body2" style={styles.inputLabel}>
              Email Address
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.text.tertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text variant="body2" style={styles.inputLabel}>
              Password
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor={theme.colors.text.tertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Login Button */}
          <Button
            title="Sign In"
            onPress={handleLogin}
            variant="primary"
            size="lg"
            loading={isLoading}
            style={styles.loginButton}
          />

          {/* Forgot Password */}
          <Button
            title="Forgot Password?"
            onPress={handleForgotPassword}
            variant="ghost"
            size="sm"
            style={styles.forgotButton}
          />
        </Card>

        {/* Register Section */}
        <View style={styles.registerSection}>
          <Text variant="body1" color="secondary" align="center">
            Don't have an account?
          </Text>
          <Button
            title="Create Account"
            onPress={handleRegister}
            variant="outline"
            size="md"
            style={styles.registerButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing['2xl'],
    paddingTop: theme.spacing['2xl'],
  },
  title: {
    marginBottom: theme.spacing.lg,
  },
  subtitle: {
    opacity: 0.8,
    marginTop: theme.spacing.sm,
  },
  loginCard: {
    marginBottom: theme.spacing.xl,
  },
  cardTitle: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary.darkBlue,
  },
  cardSubtitle: {
    marginBottom: theme.spacing['2xl'],
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  textInput: {
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borders.radius.input,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.component.input.paddingVertical,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.primary,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.card,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  registerSection: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
  },
  registerButton: {
    marginTop: theme.spacing.md,
    minWidth: 200,
  },
});
