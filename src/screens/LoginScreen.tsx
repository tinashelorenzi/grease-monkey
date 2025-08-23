import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Button, Card, Text } from '../components/common';
import { TextInput } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../services';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const passwordInputRef = useRef<TextInput>(null);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          theme.colors.primary.darkBlue,
          theme.colors.primary.lightBlue,
          theme.colors.background.primary,
        ]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons 
                name="build" 
                size={48} 
                color={theme.colors.primary.tan} 
              />
            </View>
          </View>
          
          <Text style={styles.appTitle}>
            Grease Monkey
          </Text>
          <Text style={styles.appSubtitle}>
            Your trusted automotive partner
          </Text>
        </View>

        {/* Login Card */}
        <Card style={styles.loginCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Welcome Back
            </Text>
            <Text style={styles.cardSubtitle}>
              Sign in to access your account
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Email Address
              </Text>
              <View style={[
                styles.inputContainer,
                emailFocused && styles.inputContainerFocused,
              ]}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={emailFocused ? theme.colors.primary.darkBlue : theme.colors.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  selectTextOnFocus={false}
                  clearButtonMode="never"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Password
              </Text>
              <View style={[
                styles.inputContainer,
                passwordFocused && styles.inputContainerFocused,
              ]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={passwordFocused ? theme.colors.primary.darkBlue : theme.colors.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={passwordInputRef}
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  selectTextOnFocus={false}
                  clearButtonMode="never"
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.passwordToggle}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={theme.colors.text.tertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot your password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title="Sign In"
              onPress={handleLogin}
              variant="primary"
              size="lg"
              loading={isLoading}
              style={styles.loginButton}
            />
          </View>
        </Card>

        {/* Register Section */}
        <View style={styles.registerSection}>
          <Text style={styles.registerText}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.registerButton}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>
            Why Choose Grease Monkey?
          </Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.semantic.success.primary} />
              <Text style={styles.featureText}>Professional certified mechanics</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.semantic.success.primary} />
              <Text style={styles.featureText}>24/7 emergency service</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.semantic.success.primary} />
              <Text style={styles.featureText}>Transparent pricing</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: screenHeight * 0.6,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing[5], // 20px
    paddingTop: theme.spacing[12], // 48px
    paddingBottom: theme.spacing[8], // 32px
  },
  
  // Header styles
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[10], // 40px
  },
  logoContainer: {
    marginBottom: theme.spacing[6], // 24px
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primary.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.component.card.elevated,
  },
  appTitle: {
    fontSize: theme.typography.fontSize['4xl'], // 36px
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[2], // 8px
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: theme.typography.fontSize.lg, // 18px
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.inverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  
  // Card styles
  loginCard: {
    marginBottom: theme.spacing[8], // 32px
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.components.card.radius.base, // 12px
    ...theme.shadows.component.card.elevated,
  },
  cardHeader: {
    marginBottom: theme.spacing[8], // 32px
  },
  cardTitle: {
    fontSize: theme.typography.fontSize['2xl'], // 24px
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.darkBlue,
    marginBottom: theme.spacing[2], // 8px
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: theme.typography.fontSize.base, // 16px
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  
  // Form styles
  formContainer: {
    gap: theme.spacing[6], // 24px
  },
  inputGroup: {
    gap: theme.spacing[2], // 8px
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm, // 14px
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.components.input.height.base, // 44px
    borderWidth: theme.borders.width.thin, // 1px
    borderColor: theme.colors.border.primary,
    borderRadius: theme.components.input.radius, // 8px
    backgroundColor: theme.colors.background.input,
    paddingHorizontal: theme.spacing[4], // 16px
    ...theme.shadows.component.input.default,
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary.darkBlue,
    borderWidth: theme.borders.width.focus, // 2px
    ...theme.shadows.component.input.focused,
  },
  inputIcon: {
    marginRight: theme.spacing[3], // 12px
  },
  textInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base, // 16px
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.primary,
    padding: 0, // Remove default padding
  },
  passwordInput: {
    paddingRight: theme.spacing[10], // 40px for toggle button
  },
  passwordToggle: {
    position: 'absolute',
    right: theme.spacing[4], // 16px
    width: theme.spacing[6], // 24px
    height: theme.spacing[6], // 24px
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Forgot password
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    paddingVertical: theme.spacing[2], // 8px
  },
  forgotPasswordText: {
    fontSize: theme.typography.fontSize.sm, // 14px
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.darkBlue,
  },
  
  // Login button
  loginButton: {
    marginTop: theme.spacing[4], // 16px
  },
  
  // Register section
  registerSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing[6], // 24px
    gap: theme.spacing[4], // 16px
  },
  registerText: {
    fontSize: theme.typography.fontSize.base, // 16px
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
  },
  registerButton: {
    paddingVertical: theme.spacing[3], // 12px
    paddingHorizontal: theme.spacing[6], // 24px
    borderRadius: theme.components.button.radius, // 8px
    borderWidth: theme.borders.width.thin, // 1px
    borderColor: theme.colors.primary.darkBlue,
    backgroundColor: 'transparent',
  },
  registerButtonText: {
    fontSize: theme.typography.fontSize.base, // 16px
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  
  // Features section
  featuresSection: {
    marginTop: theme.spacing[8], // 32px
    paddingVertical: theme.spacing[6], // 24px
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.components.card.radius.base, // 12px
    paddingHorizontal: theme.spacing[5], // 20px
  },
  featuresTitle: {
    fontSize: theme.typography.fontSize.lg, // 18px
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
    marginBottom: theme.spacing[4], // 16px
    textAlign: 'center',
  },
  featuresList: {
    gap: theme.spacing[3], // 12px
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3], // 12px
  },
  featureText: {
    fontSize: theme.typography.fontSize.sm, // 14px
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    flex: 1,
  },
});