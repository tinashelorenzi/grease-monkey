import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Button, Card, Text } from '../components/common';
import { TextInput } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService, RegisterData } from '../services';

const { width: screenWidth } = Dimensions.get('window');

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

type Step = 'personal' | 'address' | 'vehicle' | 'review';

const STEPS: { key: Step; title: string; description: string; icon: string }[] = [
  { key: 'personal', title: 'Personal', description: 'Basic information', icon: 'person-outline' },
  { key: 'address', title: 'Address', description: 'Location details', icon: 'location-outline' },
  { key: 'vehicle', title: 'Vehicle', description: 'Car information', icon: 'car-outline' },
  { key: 'review', title: 'Review', description: 'Confirm details', icon: 'checkmark-outline' },
];

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusStates, setFocusStates] = useState<Record<string, boolean>>({});
  
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

  const currentStepIndex = STEPS.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'personal':
        const personalFields = [
          { field: formData.firstName, name: 'First Name' },
          { field: formData.lastName, name: 'Last Name' },
          { field: formData.email, name: 'Email' },
          { field: formData.password, name: 'Password' },
          { field: formData.confirmPassword, name: 'Confirm Password' },
          { field: formData.phoneNumber, name: 'Phone Number' },
          { field: formData.dateOfBirth, name: 'Date of Birth' },
        ];
        
        const emptyPersonalField = personalFields.find(f => !f.field);
        if (emptyPersonalField) {
          Alert.alert('Error', `Please fill in ${emptyPersonalField.name}`);
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
        const addressFields = [
          { field: formData.address.street, name: 'Street Address' },
          { field: formData.address.city, name: 'City' },
          { field: formData.address.state, name: 'State' },
          { field: formData.address.zipCode, name: 'ZIP Code' },
        ];
        
        const emptyAddressField = addressFields.find(f => !f.field);
        if (emptyAddressField) {
          Alert.alert('Error', `Please fill in ${emptyAddressField.name}`);
          return false;
        }
        return true;
        
      case 'vehicle':
        const vehicleFields = [
          { field: formData.vehicle.brand, name: 'Vehicle Brand' },
          { field: formData.vehicle.model, name: 'Vehicle Model' },
          { field: formData.vehicle.registration, name: 'License Plate' },
        ];
        
        const emptyVehicleField = vehicleFields.find(f => !f.field);
        if (emptyVehicleField) {
          Alert.alert('Error', `Please fill in ${emptyVehicleField.name}`);
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < STEPS.length) {
      setCurrentStep(STEPS[nextStepIndex].key);
    }
  };

  const handlePrevious = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(STEPS[prevStepIndex].key);
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

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {currentStepIndex + 1} of {STEPS.length}
        </Text>
      </View>
      
      {/* Step Icons */}
      <View style={styles.stepsContainer}>
        {STEPS.map((step, index) => (
          <View key={step.key} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              index <= currentStepIndex ? styles.stepCircleActive : styles.stepCircleInactive
            ]}>
              <Ionicons
                name={step.icon as any}
                size={16}
                color={index <= currentStepIndex ? theme.colors.text.inverse : theme.colors.text.tertiary}
              />
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
    </View>
  );

  const setFieldFocus = (fieldKey: string, focused: boolean) => {
    setFocusStates(prev => ({
      ...prev,
      [fieldKey]: focused
    }));
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    options: {
      placeholder?: string;
      keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
      secureTextEntry?: boolean;
      icon?: string;
      required?: boolean;
      showToggle?: boolean;
      fieldKey?: string;
    } = {}
  ) => {
    const {
      placeholder = `Enter ${label.toLowerCase()}`,
      keyboardType = 'default',
      autoCapitalize = 'sentences',
      secureTextEntry = false,
      icon,
      required = false,
      showToggle = false,
      fieldKey,
    } = options;

    const isFocused = focusStates[fieldKey || ''] || false;
    const showPasswordToggle = showToggle && secureTextEntry;

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          {label} {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <View style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}>
          {icon && (
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={isFocused ? theme.colors.primary.darkBlue : theme.colors.text.tertiary}
              style={styles.inputIcon}
            />
          )}
          <TextInput
            style={[
              styles.textInput,
              showPasswordToggle && styles.passwordInput,
            ]}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text.tertiary}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => {
              if (fieldKey) {
                setFieldFocus(fieldKey, true);
              }
            }}
            onBlur={() => {
              if (fieldKey) {
                setFieldFocus(fieldKey, false);
              }
            }}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry && (fieldKey === 'password' ? !showPassword : !showConfirmPassword)}
            autoCorrect={false}
            autoComplete="off"
            textContentType="none"
            returnKeyType={fieldKey === 'confirmPassword' || fieldKey === 'registration' ? 'done' : 'next'}
            selectTextOnFocus={false}
            clearButtonMode="never"
          />
          {showPasswordToggle && (
            <TouchableOpacity
              onPress={() => {
                if (fieldKey === 'password') {
                  setShowPassword(!showPassword);
                } else {
                  setShowConfirmPassword(!showConfirmPassword);
                }
              }}
              style={styles.passwordToggle}
              activeOpacity={0.7}
            >
              <Ionicons
                name={(fieldKey === 'password' ? showPassword : showConfirmPassword) ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.text.tertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderPersonalStep = () => (
    <Card style={styles.stepCard}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Personal Information</Text>
        <Text style={styles.stepDescription}>Tell us about yourself</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            {renderInputField(
              'First Name',
              formData.firstName,
              (value) => updateFormData('firstName', value),
              { 
                icon: 'person-outline',
                autoCapitalize: 'words',
                required: true,
                fieldKey: 'firstName'
              }
            )}
          </View>
          <View style={styles.halfWidth}>
            {renderInputField(
              'Last Name',
              formData.lastName,
              (value) => updateFormData('lastName', value),
              { 
                autoCapitalize: 'words',
                required: true,
                fieldKey: 'lastName'
              }
            )}
          </View>
        </View>

        {renderInputField(
          'Email Address',
          formData.email,
          (value) => updateFormData('email', value),
          { 
            icon: 'mail-outline',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            required: true,
            fieldKey: 'email'
          }
        )}

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            {renderInputField(
              'Password',
              formData.password,
              (value) => updateFormData('password', value),
              { 
                icon: 'lock-closed-outline',
                secureTextEntry: true,
                autoCapitalize: 'none',
                required: true,
                showToggle: true,
                fieldKey: 'password'
              }
            )}
          </View>
          <View style={styles.halfWidth}>
            {renderInputField(
              'Confirm Password',
              formData.confirmPassword,
              (value) => updateFormData('confirmPassword', value),
              { 
                secureTextEntry: true,
                autoCapitalize: 'none',
                required: true,
                showToggle: true,
                fieldKey: 'confirmPassword'
              }
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            {renderInputField(
              'Phone Number',
              formData.phoneNumber,
              (value) => updateFormData('phoneNumber', value),
              { 
                icon: 'call-outline',
                keyboardType: 'phone-pad',
                required: true,
                fieldKey: 'phoneNumber'
              }
            )}
          </View>
          <View style={styles.halfWidth}>
            {renderInputField(
              'Date of Birth',
              formData.dateOfBirth,
              (value) => updateFormData('dateOfBirth', value),
              { 
                icon: 'calendar-outline',
                placeholder: 'MM/DD/YYYY',
                keyboardType: 'numeric',
                required: true,
                fieldKey: 'dateOfBirth'
              }
            )}
          </View>
        </View>

        {renderInputField(
          'Ethnicity',
          formData.ethnicity,
          (value) => updateFormData('ethnicity', value),
          { 
            icon: 'people-outline',
            autoCapitalize: 'words',
            fieldKey: 'ethnicity'
          }
        )}
      </View>
    </Card>
  );

  const renderAddressStep = () => (
    <Card style={styles.stepCard}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Address Information</Text>
        <Text style={styles.stepDescription}>Where can we find you?</Text>
      </View>
      
      <View style={styles.formContainer}>
        {renderInputField(
          'Street Address',
          formData.address.street,
          (value) => updateFormData('address', value, 'street'),
          { 
            icon: 'home-outline',
            autoCapitalize: 'words',
            required: true,
            fieldKey: 'street'
          }
        )}

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            {renderInputField(
              'City',
              formData.address.city,
              (value) => updateFormData('address', value, 'city'),
              { 
                icon: 'location-outline',
                autoCapitalize: 'words',
                required: true,
                fieldKey: 'city'
              }
            )}
          </View>
          <View style={styles.halfWidth}>
            {renderInputField(
              'State',
              formData.address.state,
              (value) => updateFormData('address', value, 'state'),
              { 
                autoCapitalize: 'characters',
                required: true,
                fieldKey: 'state'
              }
            )}
          </View>
        </View>

        {renderInputField(
          'ZIP Code',
          formData.address.zipCode,
          (value) => updateFormData('address', value, 'zipCode'),
          { 
            icon: 'mail-outline',
            keyboardType: 'numeric',
            required: true,
            fieldKey: 'zipCode'
          }
        )}
      </View>
    </Card>
  );

  const renderVehicleStep = () => (
    <Card style={styles.stepCard}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Vehicle Information</Text>
        <Text style={styles.stepDescription}>Tell us about your vehicle</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            {renderInputField(
              'Vehicle Brand',
              formData.vehicle.brand,
              (value) => updateFormData('vehicle', value, 'brand'),
              { 
                icon: 'car-outline',
                placeholder: 'e.g., Toyota',
                autoCapitalize: 'words',
                required: true,
                fieldKey: 'brand'
              }
            )}
          </View>
          <View style={styles.halfWidth}>
            {renderInputField(
              'Vehicle Model',
              formData.vehicle.model,
              (value) => updateFormData('vehicle', value, 'model'),
              { 
                placeholder: 'e.g., Camry',
                autoCapitalize: 'words',
                required: true,
                fieldKey: 'model'
              }
            )}
          </View>
        </View>

        {renderInputField(
          'License Plate Number',
          formData.vehicle.registration,
          (value) => updateFormData('vehicle', value, 'registration'),
          { 
            icon: 'card-outline',
            autoCapitalize: 'characters',
            required: true,
            fieldKey: 'registration'
          }
        )}
      </View>
    </Card>
  );

  const renderReviewStep = () => (
    <Card style={styles.stepCard}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Review Your Information</Text>
        <Text style={styles.stepDescription}>Please review your details before creating your account</Text>
      </View>
      
      <View style={styles.reviewContainer}>
        <View style={styles.reviewSection}>
          <View style={styles.reviewSectionHeader}>
            <Ionicons name="person-outline" size={20} color={theme.colors.primary.darkBlue} />
            <Text style={styles.reviewSectionTitle}>Personal Information</Text>
          </View>
          <View style={styles.reviewContent}>
            <Text style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Name: </Text>
              {formData.firstName} {formData.lastName}
            </Text>
            <Text style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Email: </Text>
              {formData.email}
            </Text>
            <Text style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Phone: </Text>
              {formData.phoneNumber}
            </Text>
            <Text style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Date of Birth: </Text>
              {formData.dateOfBirth}
            </Text>
            {formData.ethnicity && (
              <Text style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Ethnicity: </Text>
                {formData.ethnicity}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.reviewSection}>
          <View style={styles.reviewSectionHeader}>
            <Ionicons name="location-outline" size={20} color={theme.colors.primary.darkBlue} />
            <Text style={styles.reviewSectionTitle}>Address</Text>
          </View>
          <View style={styles.reviewContent}>
            <Text style={styles.reviewItem}>{formData.address.street}</Text>
            <Text style={styles.reviewItem}>
              {formData.address.city}, {formData.address.state} {formData.address.zipCode}
            </Text>
          </View>
        </View>

        <View style={styles.reviewSection}>
          <View style={styles.reviewSectionHeader}>
            <Ionicons name="car-outline" size={20} color={theme.colors.primary.darkBlue} />
            <Text style={styles.reviewSectionTitle}>Vehicle</Text>
          </View>
          <View style={styles.reviewContent}>
            <Text style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Vehicle: </Text>
              {formData.vehicle.brand} {formData.vehicle.model}
            </Text>
            <Text style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Plate Number: </Text>
              {formData.vehicle.registration}
            </Text>
          </View>
        </View>
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.inverse} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Join Grease Monkey today</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <View style={styles.navigationButtons}>
            {currentStep !== 'personal' && (
              <Button
                title="Previous"
                onPress={handlePrevious}
                variant="secondary"
                size="base"
                style={styles.navButton}
              />
            )}
            
            {currentStep === 'review' ? (
              <Button
                title="Create Account"
                onPress={handleRegister}
                variant="primary"
                size="base"
                loading={isLoading}
                style={[
                  styles.navButton, 
                  currentStep === 'personal' || currentStep === 'review' ? { flex: 1 } : undefined
                ]}
                leftIcon={<Ionicons name="checkmark" size={20} color={theme.colors.text.inverse} />}
              />
            ) : (
              <Button
                title="Next"
                onPress={handleNext}
                variant="primary"
                size="base"
                style={[
                  styles.navButton, 
                  currentStep === 'personal' ? { flex: 1 } : undefined
                ]}
                rightIcon={<Ionicons name="arrow-forward" size={20} color={theme.colors.text.inverse} />}
              />
            )}
          </View>
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
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[6],
    gap: theme.spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[1],
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.inverse,
    opacity: 0.9,
  },
  
  scrollContent: {
    paddingHorizontal: theme.spacing[5],
    paddingBottom: theme.spacing[10],
  },
  
  // Step indicator styles
  stepIndicator: {
    marginBottom: theme.spacing[8],
  },
  progressBarContainer: {
    marginBottom: theme.spacing[6],
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: theme.colors.border.primary,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing[2],
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary.darkBlue,
    borderRadius: 2,
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
  },
  stepCircleActive: {
    backgroundColor: theme.colors.primary.darkBlue,
  },
  stepCircleInactive: {
    backgroundColor: theme.colors.border.primary,
  },
  stepTitle: {
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
  },
  stepTitleActive: {
    color: theme.colors.primary.darkBlue,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  stepTitleInactive: {
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.normal,
  },
  
  // Step card styles
  stepCard: {
    marginBottom: theme.spacing[8],
  },
  stepHeader: {
    marginBottom: theme.spacing[6],
    alignItems: 'center',
  },
  stepDescription: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },
  
  // Form styles
  formContainer: {
    gap: theme.spacing[5],
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  halfWidth: {
    flex: 1,
  },
  inputGroup: {
    gap: theme.spacing[2],
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  requiredStar: {
    color: theme.colors.semantic.error.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.components.input.height.base,
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.components.input.radius,
    backgroundColor: theme.colors.background.input,
    paddingHorizontal: theme.spacing[4],
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary.darkBlue,
    borderWidth: theme.borders.width.focus,
    ...theme.shadows.component.input.focused,
  },
  inputIcon: {
    marginRight: theme.spacing[3],
  },
  textInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.primary,
    padding: 0,
  },
  passwordInput: {
    paddingRight: theme.spacing[10],
  },
  passwordToggle: {
    position: 'absolute',
    right: theme.spacing[4],
    width: theme.spacing[6],
    height: theme.spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Review section styles
  reviewContainer: {
    gap: theme.spacing[6],
  },
  reviewSection: {
    borderBottomWidth: theme.borders.width.hairline,
    borderBottomColor: theme.colors.border.primary,
    paddingBottom: theme.spacing[4],
  },
  reviewSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  reviewSectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  reviewContent: {
    gap: theme.spacing[3],
  },
  reviewItem: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
  reviewLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  
  // Button styles
  buttonContainer: {
    marginTop: theme.spacing[8],
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  navButton: {
    flex: 1,
  },
});