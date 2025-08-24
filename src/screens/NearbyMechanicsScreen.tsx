import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { Card, Text } from '../components/common';
import { searchNearbyMechanics, getCurrentLocation, Mechanic, UserLocation } from '../services/mechanicService';
import { createServiceRequest } from '../services/requestService';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../services/authService';

type NearbyMechanicsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NearbyMechanics'>;
type NearbyMechanicsScreenRouteProp = RouteProp<RootStackParamList, 'NearbyMechanics'>;

interface NearbyMechanicsScreenProps {
  serviceType?: string;
  onMechanicSelect?: (mechanic: Mechanic) => void;
  onBack?: () => void;
}

export const NearbyMechanicsScreen: React.FC<NearbyMechanicsScreenProps> = ({
  serviceType,
  onMechanicSelect,
  onBack,
}) => {
  const navigation = useNavigation<NearbyMechanicsScreenNavigationProp>();
  const route = useRoute<NearbyMechanicsScreenRouteProp>();
  const { userProfile } = useAuth();
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creatingRequest, setCreatingRequest] = useState<string | null>(null);
  const [localUserProfile, setLocalUserProfile] = useState<UserProfile | null>(null);

  // Get serviceType from route params or props
  const currentServiceType = route.params?.serviceType || serviceType;

  const loadMechanics = async (isRefresh = false) => {
    try {
      console.log('🔄 Starting to load mechanics...');
      setError(null);
      
      // Get user's current location
      console.log('📍 Getting user location...');
      const location = await getCurrentLocation();
      console.log('📍 User location obtained:', location);
      setUserLocation(location);

      // Fetch user profile from Firestore
      console.log('👤 Fetching user profile...');
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            console.log('✅ User profile loaded:', profile);
            setLocalUserProfile(profile);
          } else {
            console.log('❌ User document does not exist');
            setLocalUserProfile(null);
          }
        } catch (profileError) {
          console.error('❌ Error fetching user profile:', profileError);
          setLocalUserProfile(null);
        }
      }

      // Search for nearby mechanics
      console.log('🔍 Searching for nearby mechanics...');
      const nearbyMechanics = await searchNearbyMechanics(location, currentServiceType);
      console.log('✅ Search completed, found', nearbyMechanics.length, 'mechanics');
      setMechanics(nearbyMechanics);
      
    } catch (err) {
      console.error('❌ Error loading mechanics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load mechanics');
      
      if (!isRefresh) {
        Alert.alert(
          'Location Error',
          'Unable to get your location. Please ensure location services are enabled and try again.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: () => loadMechanics() },
          ]
        );
      }
    } finally {
      console.log('🏁 Loading completed');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMechanics();
  }, [currentServiceType]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMechanics(true);
  };

  const handleMechanicSelect = async (mechanic: Mechanic) => {
    console.log('🔘 Request Service button clicked for mechanic:', mechanic.id);
    console.log('🔍 Auth state check:');
    console.log('  authContext userProfile:', userProfile);
    console.log('  localUserProfile:', localUserProfile);
    console.log('  auth.currentUser:', auth.currentUser);
    console.log('  auth.currentUser?.uid:', auth.currentUser?.uid);
    console.log('📍 User location:', userLocation);
    
    if (onMechanicSelect) {
      console.log('📞 Using onMechanicSelect callback');
      onMechanicSelect(mechanic);
      return;
    }

    if (!userLocation) {
      console.log('❌ Missing user location');
      Alert.alert('Error', 'Unable to get your location. Please try again.');
      return;
    }

    // Use localUserProfile if available, otherwise fall back to Firebase auth user
    const currentUser = localUserProfile || auth.currentUser;
    if (!currentUser) {
      console.log('❌ No user available');
      Alert.alert('Error', 'Please log in to request a service.');
      return;
    }

    console.log('✅ User available:', currentUser);

    setCreatingRequest(mechanic.id);
    console.log('⏳ Setting loading state for mechanic:', mechanic.id);

    try {
      console.log('📝 Creating request for mechanic:', mechanic.id);
      // Prepare user data
      const customerId = localUserProfile?.uid || auth.currentUser?.uid || 'unknown';
      const customerName = localUserProfile 
        ? `${localUserProfile.firstName} ${localUserProfile.lastName}`
        : auth.currentUser?.displayName || 'Unknown User';
      const customerPhone = localUserProfile?.phoneNumber || '';

      console.log('📋 Request data:', {
        customerId,
        customerName,
        customerPhone,
        mechanicId: mechanic.id,
        mechanicName: `${mechanic.firstName} ${mechanic.lastName}`,
        serviceType: currentServiceType || 'general',
        location: userLocation,
      });
      
      const requestId = await createServiceRequest({
        customerId,
        customerName,
        customerPhone,
        mechanicId: mechanic.id,
        mechanicName: `${mechanic.firstName} ${mechanic.lastName}`,
        serviceType: currentServiceType || 'general',
        location: userLocation,
        description: `${currentServiceType?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} service requested`,
      });

      console.log('✅ Request created successfully:', requestId);
      
      // Navigate to request session screen
      console.log('🧭 Navigating to RequestSession with params:', {
        requestId,
        mechanicName: `${mechanic.firstName} ${mechanic.lastName}`,
        serviceType: currentServiceType || 'general',
      });
      
      navigation.navigate('RequestSession', {
        requestId,
        mechanicName: `${mechanic.firstName} ${mechanic.lastName}`,
        serviceType: currentServiceType || 'general',
      });

    } catch (error) {
      console.error('❌ Error creating request:', error);
      Alert.alert(
        'Request Failed',
        'Unable to create service request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setCreatingRequest(null);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Mechanics</Text>
        <View style={styles.placeholder} />
      </View>
      
      {currentServiceType && (
        <View style={styles.serviceTypeContainer}>
          <Ionicons name="construct" size={20} color={theme.colors.primary.darkBlue} />
          <Text style={styles.serviceTypeText}>
            {currentServiceType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Text>
        </View>
      )}
      
      {userLocation && (
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={theme.colors.text.secondary} />
          <Text style={styles.locationText}>
            Searching within 50km of your location
          </Text>
        </View>
      )}
    </View>
  );

  const renderMechanicCard = (mechanic: Mechanic) => (
    <TouchableOpacity
      key={mechanic.id}
      style={styles.mechanicCard}
      onPress={() => handleMechanicSelect(mechanic)}
      activeOpacity={0.7}
    >
      <View style={styles.mechanicHeader}>
        <View style={styles.mechanicAvatar}>
          <Text style={styles.mechanicInitials}>
            {mechanic.firstName.charAt(0)}{mechanic.lastName.charAt(0)}
          </Text>
        </View>
        
        <View style={styles.mechanicInfo}>
          <Text style={styles.mechanicName}>
            {mechanic.firstName} {mechanic.lastName}
          </Text>
          <Text style={styles.businessName}>{mechanic.businessName}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= mechanic.rating ? "star" : "star-outline"}
                  size={14}
                  color={star <= mechanic.rating ? theme.colors.semantic.warning.primary : theme.colors.text.tertiary}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {mechanic.rating.toFixed(1)} ({mechanic.totalJobs} jobs)
            </Text>
          </View>
        </View>
        
        <View style={styles.mechanicStatus}>
          <View style={[styles.statusIndicator, { backgroundColor: theme.colors.status.online }]} />
          <Text style={styles.statusText}>Available</Text>
        </View>
      </View>
      
      <View style={styles.mechanicDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.detailText}>{mechanic.yearsOfExperience} years exp.</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.detailText}>
              {mechanic.distance ? `${mechanic.distance.toFixed(1)}km away` : 'Distance unknown'}
            </Text>
          </View>
        </View>
        

      </View>
      
      <TouchableOpacity 
        style={[
          styles.requestButton,
          creatingRequest === mechanic.id && styles.requestButtonLoading
        ]}
        disabled={creatingRequest === mechanic.id}
        onPress={() => handleMechanicSelect(mechanic)}
      >
        {creatingRequest === mechanic.id ? (
          <>
            <Ionicons name="hourglass-outline" size={16} color={theme.colors.text.inverse} />
            <Text style={styles.requestButtonText}>Creating...</Text>
          </>
        ) : (
          <>
            <Text style={styles.requestButtonText}>Request Service</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.text.inverse} />
          </>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={theme.colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No Mechanics Found</Text>
      <Text style={styles.emptyText}>
        {error || 'No mechanics are currently available in your area. Try expanding your search radius or check back later.'}
      </Text>
      
      {error && (
        <TouchableOpacity style={styles.retryButton} onPress={() => loadMechanics()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.darkBlue} />
        <Text style={styles.loadingText}>Finding nearby mechanics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
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
        {mechanics.length > 0 ? (
          <View style={styles.mechanicsList}>
            {mechanics.map(renderMechanicCard)}
          </View>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    marginTop: theme.spacing[4],
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  header: {
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  serviceTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[3],
  },
  serviceTypeText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.darkBlue,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  locationText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[5],
  },
  mechanicsList: {
    gap: theme.spacing[4],
  },
  mechanicCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[5],
    ...theme.shadows.component.card.default,
  },
  mechanicHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  mechanicAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[4],
  },
  mechanicInitials: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  businessName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  mechanicStatus: {
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  mechanicDetails: {
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    flex: 1,
  },
  detailText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.darkBlue,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borders.radius.md,
    gap: theme.spacing[2],
  },
  requestButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },
  requestButtonLoading: {
    opacity: 0.7,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing[12],
    gap: theme.spacing[4],
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
    maxWidth: 280,
  },
  retryButton: {
    backgroundColor: theme.colors.primary.darkBlue,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borders.radius.md,
    marginTop: theme.spacing[4],
  },
  retryButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },
});
