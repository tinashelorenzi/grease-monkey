import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { Button, Card, Text, ServiceRequestModal } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width: screenWidth } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export const HomeTabScreen: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [serviceRequestVisible, setServiceRequestVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleRequestMechanic = () => {
    setServiceRequestVisible(true);
  };

  const handleServiceSelected = (serviceType: string, requestType: 'find' | 'visit') => {
    setServiceRequestVisible(false);
    
    if (requestType === 'find') {
      // Navigate to nearby mechanics screen
      navigation.navigate('NearbyMechanics', { serviceType });
    } else {
      const requestTypeText = 'Request a Visit';
      Alert.alert(
        'Service Request Submitted',
        `Your ${serviceType} service request (${requestTypeText}) has been submitted. We'll notify you when mechanics are available in your area.`,
        [{ text: 'Got it!' }]
      );
    }
  };

  const handleEmergencyService = () => {
    Alert.alert(
      'Emergency Service',
      'Our 24/7 emergency service is coming soon. For immediate assistance, please call our support line.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Support', onPress: () => Alert.alert('Calling...', 'Support: 1-800-GREASE-MONKEY') },
      ]
    );
  };

  const handleViewProfile = () => {
    Alert.alert('Profile', 'Profile management coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[theme.colors.primary.darkBlue, theme.colors.primary.lightBlue]}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContent}>
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile?.firstName?.charAt(0)}{userProfile?.lastName?.charAt(0)}
              </Text>
            </View>
            <View style={styles.statusIndicator} />
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.userName}>
              {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User'}
            </Text>
            <TouchableOpacity onPress={handleViewProfile} activeOpacity={0.7}>
              <Text style={styles.viewProfile}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color={theme.colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderMainActions = () => (
    <View style={styles.mainActions}>
      {/* Primary Action Card */}
      <Card style={styles.primaryActionCard}>
        <LinearGradient
          colors={[theme.colors.primary.darkBlue, theme.colors.primary.lightBlue]}
          style={styles.primaryActionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.primaryActionContent}>
            <View style={styles.primaryActionHeader}>
              <Ionicons name="construct" size={32} color={theme.colors.primary.tan} />
              <View style={styles.primaryActionText}>
                <Text style={styles.primaryActionTitle}>Need a Mechanic?</Text>
                <Text style={styles.primaryActionSubtitle}>Professional service at your location</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleRequestMechanic}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color={theme.colors.primary.darkBlue} />
              <Text style={styles.primaryActionButtonText}>Request Service</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Card>

      {/* Emergency Service */}
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleEmergencyService}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.colors.semantic.error.primary, '#ff6b6b']}
          style={styles.emergencyGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="alert-circle" size={24} color={theme.colors.text.inverse} />
          <Text style={styles.emergencyText}>Emergency Service</Text>
          <Text style={styles.emergencySubtext}>24/7 Available</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderQuickServices = () => (
    <View style={styles.quickServices}>
      <Text style={styles.sectionTitle}>Quick Services</Text>
      
      <View style={styles.servicesGrid}>
        {[
          { icon: 'car', title: 'Oil Change', color: theme.colors.semantic.info.primary },
          { icon: 'battery-charging', title: 'Battery', color: theme.colors.semantic.warning.primary },
          { icon: 'speedometer', title: 'Diagnostics', color: theme.colors.semantic.success.primary },
          { icon: 'build', title: 'Repair', color: theme.colors.primary.lightBlue },
        ].map((service, index) => (
          <TouchableOpacity
            key={index}
            style={styles.serviceCard}
            onPress={() => handleServiceSelected(service.title.toLowerCase().replace(' ', '-'), 'find')}
            activeOpacity={0.8}
          >
            <View style={[styles.serviceIcon, { backgroundColor: service.color + '20' }]}>
              <Ionicons name={service.icon as any} size={28} color={service.color} />
            </View>
            <Text style={styles.serviceTitle}>{service.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderVehicleInfo = () => (
    userProfile?.vehicle && (
      <Card style={styles.vehicleCard}>
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleIconContainer}>
            <Ionicons name="car-sport" size={24} color={theme.colors.primary.darkBlue} />
          </View>
          <Text style={styles.vehicleTitle}>Your Vehicle</Text>
        </View>
        
        <View style={styles.vehicleDetails}>
          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleLabel}>Vehicle:</Text>
            <Text style={styles.vehicleValue}>
              {userProfile.vehicle.brand} {userProfile.vehicle.model}
            </Text>
          </View>
          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleLabel}>Plate:</Text>
            <Text style={styles.vehicleValue}>{userProfile.vehicle.registration}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editVehicleButton} activeOpacity={0.7}>
          <Text style={styles.editVehicleText}>Edit Vehicle Info</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.primary.darkBlue} />
        </TouchableOpacity>
      </Card>
    )
  );

  const renderRecentActivity = () => (
    <Card style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <Ionicons name="time" size={20} color={theme.colors.primary.darkBlue} />
        <Text style={styles.activityTitle}>Recent Activity</Text>
      </View>
      
      <View style={styles.emptyActivity}>
        <Ionicons name="clipboard-outline" size={48} color={theme.colors.text.tertiary} />
        <Text style={styles.emptyActivityTitle}>No Recent Activity</Text>
        <Text style={styles.emptyActivityText}>
          Your service requests and maintenance history will appear here.
        </Text>
      </View>
    </Card>
  );

  const renderTips = () => (
    <Card style={styles.tipsCard}>
      <View style={styles.tipsHeader}>
        <Ionicons name="bulb" size={20} color={theme.colors.semantic.warning.primary} />
        <Text style={styles.tipsTitle}>Maintenance Tips</Text>
      </View>
      
      <View style={styles.tipsList}>
        {[
          'Check your oil level monthly',
          'Inspect tire pressure regularly',
          'Replace air filter every 12,000 miles',
        ].map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </Card>
  );



  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary.darkBlue]}
            tintColor={theme.colors.primary.darkBlue}
          />
        }
      >
        {renderHeader()}
        {renderMainActions()}
        {renderQuickServices()}
        {renderVehicleInfo()}
        {renderRecentActivity()}
        {renderTips()}
      </ScrollView>
      
      <ServiceRequestModal
        visible={serviceRequestVisible}
        onClose={() => setServiceRequestVisible(false)}
        onServiceSelected={handleServiceSelected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing[8],
  },

  // Header styles
  header: {
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[5],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing[4],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary.tan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.darkBlue,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.status.online,
    borderWidth: 2,
    borderColor: theme.colors.text.inverse,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.inverse,
    opacity: 0.8,
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginVertical: theme.spacing[1],
  },
  viewProfile: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.tan,
    textDecorationLine: 'underline',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main actions
  mainActions: {
    paddingHorizontal: theme.spacing[5],
    marginTop: -theme.spacing[6],
    gap: theme.spacing[4],
  },
  primaryActionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  primaryActionGradient: {
    padding: theme.spacing[6],
  },
  primaryActionContent: {
    gap: theme.spacing[5],
  },
  primaryActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  primaryActionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.inverse,
    opacity: 0.8,
    marginTop: theme.spacing[1],
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.tan,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borders.radius.lg,
    gap: theme.spacing[2],
    alignSelf: 'center',
    minWidth: 180,
  },
  primaryActionButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },

  // Emergency button
  emergencyButton: {
    borderRadius: theme.borders.radius.lg,
    overflow: 'hidden',
  },
  emergencyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
    gap: theme.spacing[3],
  },
  emergencyText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
    flex: 1,
  },
  emergencySubtext: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.inverse,
    opacity: 0.8,
  },

  // Quick services
  quickServices: {
    paddingHorizontal: theme.spacing[5],
    marginTop: theme.spacing[8],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[4],
  },
  serviceCard: {
    width: (screenWidth - theme.spacing[5] * 2 - theme.spacing[4]) / 2,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[5],
    alignItems: 'center',
    gap: theme.spacing[3],
    ...theme.shadows.component.card.default,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },

  // Vehicle card
  vehicleCard: {
    marginHorizontal: theme.spacing[5],
    marginTop: theme.spacing[6],
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
    gap: theme.spacing[3],
  },
  vehicleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.darkBlue + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  vehicleDetails: {
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  vehicleValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  editVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.md,
  },
  editVehicleText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.darkBlue,
  },

  // Activity card
  activityCard: {
    marginHorizontal: theme.spacing[5],
    marginTop: theme.spacing[6],
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[5],
  },
  activityTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
    gap: theme.spacing[3],
  },
  emptyActivityTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  emptyActivityText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
    maxWidth: 280,
  },

  // Tips card
  tipsCard: {
    marginHorizontal: theme.spacing[5],
    marginTop: theme.spacing[6],
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  tipsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  tipsList: {
    gap: theme.spacing[3],
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.semantic.warning.primary,
    marginTop: theme.spacing[2],
  },
  tipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    flex: 1,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },


});