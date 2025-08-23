import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { Button, Card, Text } from '../components/common';
import { TextInput } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService, RegisterData } from '../services';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

type Step = 'personal' | 'address' | 'vehicle' | 'review';

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    ethnicity: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    vehicle: {
      brand: '',
      model: '',
      registration: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: string, value: string, subField?: string) => {
    if (subField) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field as keyof typeof prev],
          [subField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const steps: { key: Step; title: string; description: string }[] = [
    { key: 'personal', title: 'Personal Information', description: 'Tell us about yourself' },
    { key: 'address', title: 'Address', description: 'Where can we find you?' },
    { key: 'vehicle', title: 'Vehicle Details', description: 'Tell us about your vehicle' },
    { key: 'review', title: 'Review & Create', description: 'Review your information' },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'personal':
        if (!formData.firstName || !formData.lastName || !formData.email || 
            !formData.password || !formData.confirmPassword || !formData.phoneNumber || !formData.dateOfBirth) {
          Alert.alert('Error', 'Please fill in all required fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          Alert.alert('Error', 'Password must be at least 6 characters long');
          return false;
        }
        return true;
      case 'address':
        if (!formData.address.street || !formData.address.city || 
            !formData.address.state || !formData.address.zipCode) {
          Alert.alert('Error', 'Please fill in all address fields');
          return false;
        }
        return true;
      case 'vehicle':
        if (!formData.vehicle.brand || !formData.vehicle.model || !formData.vehicle.registration) {
          Alert.alert('Error', 'Please fill in all vehicle fields');
          return false;
        }
        return true;
      case 'review':
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    console.log('Next button pressed, current step:', currentStep);
    if (!validateCurrentStep()) {
      console.log('Validation failed');
      return;
    }

    const nextSteps: Step[] = ['personal', 'address', 'vehicle', 'review'];
    const currentIndex = nextSteps.indexOf(currentStep);
    console.log('Current index:', currentIndex, 'Next steps length:', nextSteps.length);
    if (currentIndex < nextSteps.length - 1) {
      const nextStep = nextSteps[currentIndex + 1];
      console.log('Moving to next step:', nextStep);
      setCurrentStep(nextStep);
    }
  };

  const handlePrevious = () => {
    const nextSteps: Step[] = ['personal', 'address', 'vehicle', 'review'];
    const currentIndex = nextSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(nextSteps[currentIndex - 1]);
    }
  };

  const handleRegister = async () => {
    if (!validateCurrentStep()) return;

    setIsLoading(true);
    try {
      const registerData: RegisterData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        ethnicity: formData.ethnicity,
        address: formData.address,
        vehicle: formData.vehicle,
      };

      await authService.register(registerData);
      // Navigation will be handled automatically by AuthContext
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <View key={step.key} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            index <= currentStepIndex ? styles.stepCircleActive : styles.stepCircleInactive
          ]}>
            <Text style={[
              styles.stepNumber,
              index <= currentStepIndex ? styles.stepNumberActive : styles.stepNumberInactive
            ]}>
              {index + 1}
            </Text>
          </View>
          <Text style={[
            styles.stepTitle,
            index <= currentStepIndex ? styles.stepTitleActive : styles.stepTitleInactive
          ]}>
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderPersonalStep = () => (
    <Card variant="elevated" style={styles.card}>
      <Text variant="h3" style={styles.cardTitle}>
        Personal Information
      </Text>
      <Text variant="body2" color="secondary" style={styles.cardSubtitle}>
        Tell us about yourself
      </Text>
      
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text variant="body2" style={styles.inputLabel}>
            First Name *
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter first name"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.firstName}
            onChangeText={(value) => updateFormData('firstName', value)}
            autoCapitalize="words"
          />
        </View>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text variant="body2" style={styles.inputLabel}>
            Last Name *
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter last name"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.lastName}
            onChangeText={(value) => updateFormData('lastName', value)}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text variant="body2" style={styles.inputLabel}>
          Email Address *
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your email"
          placeholderTextColor={theme.colors.text.tertiary}
          value={formData.email}
          onChangeText={(value) => updateFormData('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text variant="body2" style={styles.inputLabel}>
            Password *
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter password"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text variant="body2" style={styles.inputLabel}>
            Confirm Password *
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm password"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text variant="body2" style={styles.inputLabel}>
            Phone Number *
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter phone number"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.phoneNumber}
            onChangeText={(value) => updateFormData('phoneNumber', value)}
            keyboardType="phone-pad"
          />
        </View>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text variant="body2" style={styles.inputLabel}>
            Date of Birth *
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.dateOfBirth}
            onChangeText={(value) => updateFormData('dateOfBirth', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text variant="body2" style={styles.inputLabel}>
          Ethnicity
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your ethnicity"
          placeholderTextColor={theme.colors.text.tertiary}
          value={formData.ethnicity}
          onChangeText={(value) => updateFormData('ethnicity', value)}
          autoCapitalize="words"
        />
      </View>
    </Card>
  );

  const renderAddressStep = () => (
    <Card variant="elevated" style={styles.card}>
      <Text variant="h3" style={styles.cardTitle}>
        Address Information
      </Text>
      <Text variant="body2" color="secondary" style={styles.cardSubtitle}>
        Where can we find you?
      </Text>
      
      <View style={styles.inputContainer}>
        <Text variant="body2" style={styles.inputLabel}>
          Street Address *
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter street address"
          placeholderTextColor={theme.colors.text.tertiary}
          value={formData.address.street}
          onChangeText={(value) => updateFormData('address', value, 'street')}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text variant="body2" style={styles.inputLabel}>
            City *
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter city"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.address.city}
            onChangeText={(value) => updateFormData('address', value, 'city')}
            autoCapitalize="words"
          />
        </View>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text variant="body2" style={styles.inputLabel}>
            State *
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter state"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.address.state}
            onChangeText={(value) => updateFormData('address', value, 'state')}
            autoCapitalize="characters"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text variant="body2" style={styles.inputLabel}>
          ZIP Code *
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter ZIP code"
          placeholderTextColor={theme.colors.text.tertiary}
          value={formData.address.zipCode}
          onChangeText={(value) => updateFormData('address', value, 'zipCode')}
          keyboardType="numeric"
        />
      </View>
    </Card>
  );

  const renderVehicleStep = () => (
    <Card variant="elevated" style={styles.card}>
      <Text variant="h3" style={styles.cardTitle}>
        Vehicle Information
      </Text>
      <Text variant="body2" color="secondary" style={styles.cardSubtitle}>
        Tell us about your vehicle
      </Text>
      
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text variant="body2" style={styles.inputLabel}>
            Vehicle Brand *
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Toyota"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.vehicle.brand}
            onChangeText={(value) => updateFormData('vehicle', value, 'brand')}
            autoCapitalize="words"
          />
        </View>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text variant="body2" style={styles.inputLabel}>
            Vehicle Model *
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Camry"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.vehicle.model}
            onChangeText={(value) => updateFormData('vehicle', value, 'model')}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text variant="body2" style={styles.inputLabel}>
          License Plate Number *
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter plate number"
          placeholderTextColor={theme.colors.text.tertiary}
          value={formData.vehicle.registration}
          onChangeText={(value) => updateFormData('vehicle', value, 'registration')}
          autoCapitalize="characters"
        />
      </View>
    </Card>
  );

  const renderReviewStep = () => (
    <Card variant="elevated" style={styles.card}>
      <Text variant="h3" style={styles.cardTitle}>
        Review Your Information
      </Text>
      <Text variant="body2" color="secondary" style={styles.cardSubtitle}>
        Please review your details before creating your account
      </Text>
      
      <View style={styles.reviewSection}>
        <Text variant="h4" style={styles.reviewSectionTitle}>Personal Information</Text>
        <Text variant="body2" style={styles.reviewText}>
          <Text style={styles.reviewLabel}>Name:</Text> {formData.firstName} {formData.lastName}
        </Text>
        <Text variant="body2" style={styles.reviewText}>
          <Text style={styles.reviewLabel}>Email:</Text> {formData.email}
        </Text>
        <Text variant="body2" style={styles.reviewText}>
          <Text style={styles.reviewLabel}>Phone:</Text> {formData.phoneNumber}
        </Text>
        <Text variant="body2" style={styles.reviewText}>
          <Text style={styles.reviewLabel}>Date of Birth:</Text> {formData.dateOfBirth}
        </Text>
        {formData.ethnicity && (
          <Text variant="body2" style={styles.reviewText}>
            <Text style={styles.reviewLabel}>Ethnicity:</Text> {formData.ethnicity}
          </Text>
        )}
      </View>

      <View style={styles.reviewSection}>
        <Text variant="h4" style={styles.reviewSectionTitle}>Address</Text>
        <Text variant="body2" style={styles.reviewText}>
          {formData.address.street}
        </Text>
        <Text variant="body2" style={styles.reviewText}>
          {formData.address.city}, {formData.address.state} {formData.address.zipCode}
        </Text>
      </View>

      <View style={styles.reviewSection}>
        <Text variant="h4" style={styles.reviewSectionTitle}>Vehicle</Text>
        <Text variant="body2" style={styles.reviewText}>
          <Text style={styles.reviewLabel}>Vehicle:</Text> {formData.vehicle.brand} {formData.vehicle.model}
        </Text>
        <Text variant="body2" style={styles.reviewText}>
          <Text style={styles.reviewLabel}>Plate Number:</Text> {formData.vehicle.registration}
        </Text>
      </View>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal':
        return renderPersonalStep();
      case 'address':
        return renderAddressStep();
      case 'vehicle':
        return renderVehicleStep();
      case 'review':
        return renderReviewStep();
      default:
        return renderPersonalStep();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1" color="primary" align="center" style={styles.title}>
            Create Account
          </Text>
          <Text variant="body1" color="secondary" align="center" style={styles.subtitle}>
            Join Grease Monkey for professional automotive services
          </Text>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <View style={styles.buttonSection}>
          <View style={styles.buttonRow}>
            {currentStep !== 'personal' && (
              <Button
                title="Previous"
                onPress={handlePrevious}
                variant="outline"
                size="md"
                style={styles.navButton}
              />
            )}
            
            {currentStep === 'review' ? (
              <Button
                title="Create Account"
                onPress={handleRegister}
                variant="primary"
                size="lg"
                loading={isLoading}
                style={styles.navButton}
              />
            ) : (
              <Button
                title="Next"
                onPress={handleNext}
                variant="primary"
                size="md"
                style={styles.navButton}
              />
            )}
          </View>
          
          <Button
            title="Back to Login"
            onPress={handleBackToLogin}
            variant="ghost"
            size="sm"
            style={styles.backButton}
          />
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
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
  },
  header: {
    marginBottom: theme.spacing['2xl'],
    paddingTop: theme.spacing['2xl'],
  },
  title: {
    marginBottom: theme.spacing.xl,
  },
  subtitle: {
    opacity: 0.8,
    marginTop: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.md,
    flexWrap: 'wrap',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepCircleActive: {
    backgroundColor: theme.colors.primary.darkBlue,
  },
  stepCircleInactive: {
    backgroundColor: theme.colors.border.primary,
  },
  stepNumber: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  stepNumberActive: {
    color: theme.colors.neutral.white,
  },
  stepNumberInactive: {
    color: theme.colors.text.secondary,
  },
  stepTitle: {
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
  },
  stepTitleActive: {
    color: theme.colors.primary.darkBlue,
    fontWeight: theme.typography.fontWeight.medium,
  },
  stepTitleInactive: {
    color: theme.colors.text.tertiary,
  },
  card: {
    marginBottom: theme.spacing['2xl'],
  },
  cardTitle: {
    marginBottom: theme.spacing.xl,
    color: theme.colors.primary.darkBlue,
  },
  cardSubtitle: {
    marginBottom: theme.spacing['2xl'],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  halfWidth: {
    width: '48%',
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
  reviewSection: {
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  reviewSectionTitle: {
    color: theme.colors.primary.darkBlue,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  reviewText: {
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
  reviewLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  buttonSection: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  navButton: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  backButton: {
    minWidth: 200,
  },
});
