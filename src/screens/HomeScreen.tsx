import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Button, Card, Text } from '../components/common';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  comingSoon?: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    title: 'Oil Change',
    icon: 'car',
    color: theme.colors.semantic.info.primary,
    description: 'Quick oil change service',
  },
  {
    id: '2',
    title: 'Tire Service',
    icon: 'ellipse',
    color: theme.colors.semantic.warning.primary,
    description: 'Tire repair and replacement',
  },
  {
    id: '3',
    title: 'Battery Check',
    icon: 'battery-charging',
    color: theme.colors.semantic.success.primary,
    description: 'Battery testing and replacement',
  },
  {
    id: '4',
    title: 'Diagnostics',
    icon: 'speedometer',
    color: theme.colors.primary.lightBlue,
    description: 'Computer diagnostics',
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Service Reminder',
    message: 'Your vehicle is due for an oil change',
    type: 'info',
    timestamp: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'New Feature',
    message: 'Emergency roadside assistance now available 24/7',
    type: 'success',
    timestamp: '2024-03-14T15:30:00Z',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, userProfile, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleRequestMechanic = () => {
    Alert.alert(
      'Request Mechanic',
      'Choose how you\'d like to request service:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Emergency Service',
          onPress: () => handleEmergencyService(),
        },
        {
          text: 'Schedule Service',
          onPress: () => handleScheduleService(),
        },
      ]
    );
  };

  const handleEmergencyService = () => {
    Alert.alert(
      'Emergency Service',
      '🚨 Emergency roadside assistance will be available soon!\n\nFor immediate help, please call our 24/7 hotline.',
      [
        { text: 'OK', style: 'default' },
        {
          text: 'Call Now',
          onPress: () => Alert.alert('Calling...', '📞 1-800-GREASE-MONKEY'),
        },
      ]
    );
  };

  const handleScheduleService = () => {
    Alert.alert(
      'Schedule Service',
      '📅 Service scheduling will be available soon!\n\nYou\'ll be able to book appointments with certified mechanics in your area.',
      [{ text: 'Got it!' }]
    );
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.comingSoon) {
      Alert.alert(
        'Coming Soon',
        `${action.title} service will be available in the next update. Stay tuned!`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        action.title,
        `${action.description} will be available soon. We'll notify you when mechanics in your area can provide this service.`,
        [{ text: 'Notify Me' }]
      );
    }
  };

  const handleViewHistory = () => {
    navigation.navigate('Main');
  };

  const handleViewPayments = () => {
    navigation.navigate('Main');
  };

  const handleOpenChat = () => {
    navigation.navigate('Main');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
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
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.darkBlue} />
      
      <View style={styles.headerContent}>
        <View style={styles.userSection}>
          <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile?.firstName?.charAt(0) || 'U'}{userProfile?.lastName?.charAt(0) || ''}
              </Text>
            </View>
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>{greeting}!</Text>
            <Text style={styles.userName}>
              {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User'}
            </Text>
            <Text style={styles.location}>
              📍 {userProfile?.address?.city || 'Location'}, {userProfile?.address?.state || 'State'}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowNotifications(!showNotifications)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications" size={24} color={theme.colors.text.inverse} />
            {MOCK_NOTIFICATIONS.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{MOCK_NOTIFICATIONS.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <View style={styles.notificationsDropdown}>
          <Text style={styles.notificationsTitle}>Notifications</Text>
          {MOCK_NOTIFICATIONS.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationItem}
              onPress={() => setShowNotifications(false)}
              activeOpacity={0.8}
            >
              <View style={styles.notificationContent}>
                <Text style={styles.notificationItemTitle}>{notification.title}</Text>
                <Text style={styles.notificationItemMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>
                  {new Date(notification.timestamp).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.clearNotifications}>
            <Text style={styles.clearNotificationsText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );

  const renderMainAction = () => (
    <View style={styles.mainActionContainer}>
      <Card style={styles.mainActionCard}>
        <LinearGradient
          colors={[theme.colors.primary.darkBlue, theme.colors.primary.lightBlue]}
          style={styles.mainActionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.mainActionContent}>
            <View style={styles.mainActionHeader}>
              <View style={styles.mainActionIcon}>
                <Ionicons name="construct" size={48} color={theme.colors.primary.tan} />
              </View>
              <View style={styles.mainActionText}>
                <Text style={styles.mainActionTitle}>Need Automotive Service?</Text>
                <Text style={styles.mainActionSubtitle}>
                  Professional mechanics at your location
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.requestButton}
              onPress={handleRequestMechanic}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={24} color={theme.colors.primary.darkBlue} />
              <Text style={styles.requestButtonText}>Request Mechanic</Text>
            </TouchableOpacity>
            
            <View style={styles.mainActionFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary.tan} />
                <Text style={styles.featureText}>Certified Professionals</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="time" size={16} color={theme.colors.primary.tan} />
                <Text style={styles.featureText}>30-45 min arrival</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="card" size={16} color={theme.colors.primary.tan} />
                <Text style={styles.featureText}>Secure payment</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Card>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Services</Text>
      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => handleQuickAction(action)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
              <Ionicons name={action.icon as any} size={28} color={action.color} />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionDescription}>{action.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderVehicleInfo = () => (
    userProfile?.vehicle && (
      <View style={styles.vehicleContainer}>
        <Text style={styles.sectionTitle}>Your Vehicle</Text>
        <Card style={styles.vehicleCard}>
          <View style={styles.vehicleHeader}>
            <View style={styles.vehicleIconContainer}>
              <Ionicons name="car-sport" size={28} color={theme.colors.primary.darkBlue} />
            </View>
            <View style={styles.vehicleMainInfo}>
              <Text style={styles.vehicleTitle}>
                {userProfile.vehicle.brand} {userProfile.vehicle.model}
              </Text>
              <Text style={styles.vehiclePlate}>
                🏷️ {userProfile.vehicle.registration}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
              <Ionicons name="pencil" size={16} color={theme.colors.primary.darkBlue} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.vehicleStats}>
            <View style={styles.vehicleStat}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Services</Text>
            </View>
            <View style={styles.vehicleStat}>
              <Text style={styles.statValue}>85K</Text>
              <Text style={styles.statLabel}>Miles</Text>
            </View>
            <View style={styles.vehicleStat}>
              <Text style={styles.statValue}>4.8★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </Card>
      </View>
    )
  );

  const renderQuickNavigation = () => (
    <View style={styles.navigationContainer}>
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.navigationGrid}>
        {[
          { icon: 'time', title: 'History', onPress: handleViewHistory, color: theme.colors.semantic.info.primary },
          { icon: 'card', title: 'Payments', onPress: handleViewPayments, color: theme.colors.semantic.success.primary },
          { icon: 'chatbubbles', title: 'Support', onPress: handleOpenChat, color: theme.colors.semantic.warning.primary },
          { icon: 'settings', title: 'Settings', onPress: () => Alert.alert('Settings', 'Coming soon!'), color: theme.colors.text.tertiary },
        ].map((nav, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navCard}
            onPress={nav.onPress}
            activeOpacity={0.8}
          >
            <View style={[styles.navIcon, { backgroundColor: nav.color + '20' }]}>
              <Ionicons name={nav.icon as any} size={24} color={nav.color} />
            </View>
            <Text style={styles.navTitle}>{nav.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTips = () => (
    <View style={styles.tipsContainer}>
      <Card style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Ionicons name="bulb" size={24} color={theme.colors.semantic.warning.primary} />
          <Text style={styles.tipsTitle}>Today's Maintenance Tip</Text>
        </View>
        
        <Text style={styles.tipContent}>
          💡 Check your tire pressure monthly! Properly inflated tires improve fuel efficiency by up to 3% and extend tire life.
        </Text>
        
        <TouchableOpacity style={styles.tipAction} activeOpacity={0.8}>
          <Text style={styles.tipActionText}>More Tips</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.colors.primary.darkBlue} />
        </TouchableOpacity>
      </Card>
    </View>
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
        {renderMainAction()}
        {renderQuickActions()}
        {renderVehicleInfo()}
        {renderQuickNavigation()}
        {renderTips()}
      </ScrollView>
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
    paddingBottom: theme.spacing[10],
  },

  // Header styles
  header: {
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[5],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing[4],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary.tan,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.darkBlue,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.status.online,
    borderWidth: 3,
    borderColor: theme.colors.text.inverse,
  },
  userInfo: {
    flex: 1,
    gap: theme.spacing[1],
  },
  greeting: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.inverse,
    opacity: 0.9,
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  location: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.inverse,
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.semantic.error.primary,
    borderRadius: theme.borders.radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },

  // Notifications dropdown
  notificationsDropdown: {
    position: 'absolute',
    top: '100%',
    right: theme.spacing[5],
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[5],
    minWidth: 280,
    maxWidth: screenWidth - theme.spacing[10],
    ...theme.shadows.component.modal.content,
    zIndex: 1000,
  },
  notificationsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  notificationItem: {
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  notificationContent: {
    gap: theme.spacing[1],
  },
  notificationItemTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  notificationItemMessage: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },
  notificationTime: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
  },
  clearNotifications: {
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    marginTop: theme.spacing[2],
  },
  // Main action section
  mainActionContainer: {
    paddingHorizontal: theme.spacing[5],
    marginTop: -theme.spacing[8],
    marginBottom: theme.spacing[8],
  },
  mainActionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  mainActionGradient: {
    padding: theme.spacing[6],
  },
  mainActionContent: {
    gap: theme.spacing[6],
  },
  mainActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  mainActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainActionText: {
    flex: 1,
  },
  mainActionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[1],
  },
  mainActionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.inverse,
    opacity: 0.9,
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.tan,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[8],
    borderRadius: theme.borders.radius.lg,
    gap: theme.spacing[3],
    alignSelf: 'center',
    minWidth: 200,
    ...theme.shadows.component.button.elevated,
  },
  requestButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  mainActionFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing[2],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  featureText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.inverse,
    opacity: 0.9,
  },

  // Quick actions
  quickActionsContainer: {
    paddingHorizontal: theme.spacing[5],
    marginBottom: theme.spacing[8],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[5],
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[4],
  },
  actionCard: {
    width: (screenWidth - theme.spacing[5] * 2 - theme.spacing[4]) / 2,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[5],
    alignItems: 'center',
    gap: theme.spacing[3],
    ...theme.shadows.component.card.default,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.xs,
  },

  // Vehicle section
  vehicleContainer: {
    paddingHorizontal: theme.spacing[5],
    marginBottom: theme.spacing[8],
  },
  vehicleCard: {},
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[5],
    gap: theme.spacing[4],
  },
  vehicleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary.darkBlue + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleMainInfo: {
    flex: 1,
    gap: theme.spacing[1],
  },
  vehicleTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  vehiclePlate: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing[5],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  vehicleStat: {
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.darkBlue,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
  },

  // Navigation section
  navigationContainer: {
    paddingHorizontal: theme.spacing[5],
    marginBottom: theme.spacing[8],
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[4],
  },
  navCard: {
    width: (screenWidth - theme.spacing[5] * 2 - theme.spacing[4]) / 2,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[5],
    alignItems: 'center',
    gap: theme.spacing[3],
    ...theme.shadows.component.card.default,
  },
  navIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },

  // Tips section
  tipsContainer: {
    paddingHorizontal: theme.spacing[5],
    marginBottom: theme.spacing[8],
  },
  tipsCard: {},
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
  tipContent: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
    marginBottom: theme.spacing[5],
  },
  tipAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.md,
    alignSelf: 'center',
  },
  tipActionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.darkBlue,
  },
});