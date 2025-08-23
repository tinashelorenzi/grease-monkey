import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { Button, Card, Text } from '../components/common';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, userProfile, logout } = useAuth();

  const handleRequestMechanic = () => {
    Alert.alert(
      'Request Mechanic',
      'This feature will be implemented soon. You\'ll be able to request a mechanic to come to your location.',
      [{ text: 'OK' }]
    );
  };

  const handleViewHistory = () => {
    Alert.alert(
      'Service History',
      'This feature will be implemented soon. You\'ll be able to view your past service requests.',
      [{ text: 'OK' }]
    );
  };

  const handleViewPayments = () => {
    Alert.alert(
      'Payments',
      'This feature will be implemented soon. You\'ll be able to view and manage your payment history.',
      [{ text: 'OK' }]
    );
  };

  const handleOpenChat = () => {
    Alert.alert(
      'Chat Support',
      'This feature will be implemented soon. You\'ll be able to chat with our support team.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text variant="h2" color="primary" style={styles.welcomeText}>
                Welcome back!
              </Text>
              <Text variant="body1" color="secondary" style={styles.userName}>
                {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User'}
              </Text>
            </View>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="ghost"
              size="sm"
              style={styles.logoutButton}
            />
          </View>
        </View>

        {/* Main Action Card */}
        <Card variant="elevated" style={styles.mainCard}>
          <Text variant="h3" style={styles.cardTitle}>
            Need a Mechanic?
          </Text>
          <Text variant="body2" color="secondary" style={styles.cardSubtitle}>
            Request a professional mechanic to come to your location for any automotive service.
          </Text>
          
          <Button
            title="Request Mechanic"
            onPress={handleRequestMechanic}
            variant="primary"
            size="lg"
            style={styles.requestButton}
          />
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text variant="h4" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          
          <View style={styles.actionGrid}>
            <Card variant="elevated" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <Text variant="h5" style={styles.actionTitle}>
                  Service History
                </Text>
                <Text variant="body2" color="secondary" style={styles.actionDescription}>
                  View your past service requests and maintenance records.
                </Text>
                <Button
                  title="View History"
                  onPress={handleViewHistory}
                  variant="outline"
                  size="sm"
                  style={styles.actionButton}
                />
              </View>
            </Card>

            <Card variant="elevated" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <Text variant="h5" style={styles.actionTitle}>
                  Payments
                </Text>
                <Text variant="body2" color="secondary" style={styles.actionDescription}>
                  Manage your payment history and billing information.
                </Text>
                <Button
                  title="View Payments"
                  onPress={handleViewPayments}
                  variant="outline"
                  size="sm"
                  style={styles.actionButton}
                />
              </View>
            </Card>

            <Card variant="elevated" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <Text variant="h5" style={styles.actionTitle}>
                  Chat Support
                </Text>
                <Text variant="body2" color="secondary" style={styles.actionDescription}>
                  Get help from our support team via chat.
                </Text>
                <Button
                  title="Open Chat"
                  onPress={handleOpenChat}
                  variant="outline"
                  size="sm"
                  style={styles.actionButton}
                />
              </View>
            </Card>
          </View>
        </View>

        {/* Vehicle Information */}
        {userProfile?.vehicle && (
          <Card variant="elevated" style={styles.vehicleCard}>
            <Text variant="h4" style={styles.cardTitle}>
              Your Vehicle
            </Text>
            <View style={styles.vehicleInfo}>
              <Text variant="body1" style={styles.vehicleText}>
                <Text style={styles.vehicleLabel}>Vehicle:</Text> {userProfile.vehicle.brand} {userProfile.vehicle.model}
              </Text>
              <Text variant="body1" style={styles.vehicleText}>
                <Text style={styles.vehicleLabel}>Plate Number:</Text> {userProfile.vehicle.registration}
              </Text>
            </View>
          </Card>
        )}

        {/* Recent Activity Placeholder */}
        <Card variant="elevated" style={styles.activityCard}>
          <Text variant="h4" style={styles.cardTitle}>
            Recent Activity
          </Text>
          <Text variant="body2" color="secondary" style={styles.placeholderText}>
            No recent activity. Your service requests and updates will appear here.
          </Text>
        </Card>
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
    marginBottom: theme.spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    marginBottom: theme.spacing.xs,
  },
  userName: {
    opacity: 0.8,
  },
  logoutButton: {
    minWidth: 80,
  },
  mainCard: {
    marginBottom: theme.spacing.xl,
  },
  cardTitle: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary.darkBlue,
  },
  cardSubtitle: {
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
  requestButton: {
    alignSelf: 'center',
    minWidth: 200,
  },
  quickActions: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary.darkBlue,
  },
  actionGrid: {
    gap: theme.spacing.lg,
  },
  actionCard: {
    marginBottom: theme.spacing.lg,
  },
  actionContent: {
    alignItems: 'flex-start',
  },
  actionTitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary.darkBlue,
  },
  actionDescription: {
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
  vehicleCard: {
    marginBottom: theme.spacing.xl,
  },
  vehicleInfo: {
    gap: theme.spacing.sm,
  },
  vehicleText: {
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
  vehicleLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  activityCard: {
    marginBottom: theme.spacing.xl,
  },
  placeholderText: {
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
});
