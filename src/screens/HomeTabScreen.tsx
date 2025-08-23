import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { theme } from '../theme';
import { Button, Card, Text } from '../components/common';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export const HomeTabScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [trayAnimation] = useState(new Animated.Value(0));

  const toggleTray = () => {
    const toValue = isTrayOpen ? 0 : 1;
    setIsTrayOpen(!isTrayOpen);
    
    Animated.spring(trayAnimation, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleRequestMechanic = () => {
    toggleTray();
  };

  const handleUseMyLocation = () => {
    Alert.alert(
      'Use My Location',
      'This will use your current GPS location to find nearby mechanics.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Use Location', onPress: () => {
          Alert.alert('Success', 'Location services will be implemented soon.');
          toggleTray();
        }},
      ]
    );
  };

  const handleFindNearest = () => {
    Alert.alert(
      'Find Nearest',
      'This will search for mechanics in your area.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Find', onPress: () => {
          Alert.alert('Success', 'Mechanic search will be implemented soon.');
          toggleTray();
        }},
      ]
    );
  };

  const trayHeight = trayAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const trayOpacity = trayAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2" color="primary" style={styles.welcomeText}>
            Welcome back!
          </Text>
          <Text variant="body1" color="secondary" style={styles.userName}>
            {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User'}
          </Text>
        </View>

        {/* Main Request Card */}
        <Card variant="elevated" style={styles.mainCard}>
          <Text variant="h3" style={styles.cardTitle}>
            Need a Mechanic?
          </Text>
          <Text variant="body2" color="secondary" style={styles.cardSubtitle}>
            Request a professional mechanic to come to your location for any automotive service.
          </Text>
          
          <TouchableOpacity
            style={styles.requestButton}
            onPress={handleRequestMechanic}
            activeOpacity={0.8}
          >
            <Ionicons name="car" size={24} color={theme.colors.neutral.white} />
            <Text style={styles.requestButtonText}>Request Mechanic</Text>
          </TouchableOpacity>
        </Card>

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

      {/* Animated Request Tray */}
      <Animated.View
        style={[
          styles.tray,
          {
            height: trayHeight,
            opacity: trayOpacity,
          },
        ]}
      >
        <View style={styles.trayContent}>
          <View style={styles.trayHeader}>
            <Text variant="h4" style={styles.trayTitle}>
              Choose Location
            </Text>
            <TouchableOpacity onPress={toggleTray} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.trayButtons}>
            <TouchableOpacity
              style={styles.trayButton}
              onPress={handleUseMyLocation}
              activeOpacity={0.8}
            >
              <Ionicons name="location" size={24} color={theme.colors.primary.darkBlue} />
              <Text style={styles.trayButtonText}>Use My Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.trayButton}
              onPress={handleFindNearest}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={24} color={theme.colors.primary.darkBlue} />
              <Text style={styles.trayButtonText}>Find Nearest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
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
  welcomeText: {
    marginBottom: theme.spacing.xs,
  },
  userName: {
    opacity: 0.8,
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
    backgroundColor: theme.colors.primary.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borders.radius.button,
    alignSelf: 'center',
    minWidth: 200,
    ...theme.shadows.component.button,
  },
  requestButtonText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing.sm,
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
  tray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.card,
    borderTopLeftRadius: theme.borders.radius.lg,
    borderTopRightRadius: theme.borders.radius.lg,
    ...theme.shadows.component.modal,
    overflow: 'hidden',
  },
  trayContent: {
    padding: theme.spacing.lg,
  },
  trayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  trayTitle: {
    color: theme.colors.primary.darkBlue,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  trayButtons: {
    gap: theme.spacing.md,
  },
  trayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  trayButtonText: {
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
});
