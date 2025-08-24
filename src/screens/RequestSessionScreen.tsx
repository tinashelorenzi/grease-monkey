import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { Card } from '../components/common';
import { ServiceRequest, listenToRequestStatus, deleteServiceRequest } from '../services/requestService';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getCurrentLocation } from '../services/mechanicService';
import { findOrCreateChatSession, listenToMessages, markMessagesAsRead } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';

type RequestSessionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RequestSession'>;
type RequestSessionScreenRouteProp = RouteProp<RootStackParamList, 'RequestSession'>;

const { width: screenWidth } = Dimensions.get('window');

export const RequestSessionScreen: React.FC = () => {
  const navigation = useNavigation<RequestSessionScreenNavigationProp>();
  const route = useRoute<RequestSessionScreenRouteProp>();
  const { requestId, mechanicName, serviceType } = route.params;
  const { userProfile } = useAuth();
  
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [hasQuote, setHasQuote] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  
  // Animation values
  const pingScale = useRef(new Animated.Value(0)).current;
  const pingOpacity = useRef(new Animated.Value(1)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Start listening to request status changes
    const unsubscribe = listenToRequestStatus(requestId, (updatedRequest) => {
      console.log('🔄 RequestSessionScreen received update:', updatedRequest);
      setRequest(updatedRequest);
      setLoading(false);
      
      if (updatedRequest) {
        console.log('📊 Request status:', updatedRequest.status);
        console.log('📊 Request ID:', updatedRequest.requestId);
        console.log('📊 Mechanic ID:', updatedRequest.mechanicId);
        
        // Handle different status changes
        if (updatedRequest.status === 'accepted') {
          console.log('✅ Request accepted by mechanic');
          // Initialize chat session when request is accepted
          initializeChatSession();
        } else if (updatedRequest.status === 'quoted') {
          console.log('💰 Quote received from mechanic');
          // Navigate to quote screen
          navigation.navigate('Quote', {
            requestId: requestId,
            mechanicName: mechanicName,
            serviceType: serviceType,
            quoteAmount: updatedRequest.quoteAmount || 0,
            quoteDescription: updatedRequest.quoteDescription || '',
          });
        } else if (updatedRequest.status === 'completed') {
          Alert.alert(
            'Service Completed!',
            'Your service has been completed successfully.',
            [{ text: 'Great!', onPress: () => navigation.navigate('Main') }]
          );
        } else if (updatedRequest.status === 'declined') {
          Alert.alert(
            'Request Declined',
            `${mechanicName} is unable to take your request at this time.`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }
      }
    });

    // Start ping animation
    startPingAnimation();

    return () => {
      unsubscribe();
    };
  }, [requestId, mechanicName]);

  const initializeChatSession = async () => {
    if (!userProfile || !request) return;
    
    try {
      console.log('💬 Initializing chat session...');
      const sessionId = await findOrCreateChatSession(
        requestId,
        userProfile.uid,
        request.mechanicId,
        `${userProfile.firstName} ${userProfile.lastName}`,
        request.mechanicName
      );
      
      setChatSessionId(sessionId);
      console.log('✅ Chat session initialized:', sessionId);
      
      // Start listening to messages
      const messageUnsubscribe = listenToMessages(
        sessionId,
        (messages) => {
          // Messages are handled in the chat screen
        },
        (unreadCount) => {
          setUnreadMessages(unreadCount);
          console.log('📊 Unread messages:', unreadCount);
        }
      );
      
      return () => messageUnsubscribe();
    } catch (error) {
      console.error('❌ Error initializing chat session:', error);
    }
  };

  const handleMessagePress = () => {
    if (chatSessionId) {
      navigation.navigate('Chat', {
        sessionId: chatSessionId,
        mechanicName: mechanicName,
        requestId: requestId,
      });
    }
  };

  const startPingAnimation = () => {
    // Ping animation (expanding circle)
    const pingAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(pingScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pingOpacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // Pulse animation (continuous pulsing)
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Start both animations
    Animated.loop(pingAnimation).start();
    pulseAnimation.start();
  };

  const handleCancelRequest = async () => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this request? This action cannot be undone.',
      [
        { text: 'Keep Request', style: 'cancel' },
        { 
          text: 'Cancel Request', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ User confirmed request cancellation');
              
              if (!request) {
                console.log('❌ No request data available for deletion');
                Alert.alert('Error', 'Unable to cancel request. Please try again.');
                return;
              }

              console.log('📋 Deleting request:', requestId);
              console.log('🔧 Mechanic ID:', request.mechanicId);
              
              // Delete the request from both collections
              await deleteServiceRequest(requestId, request.mechanicId);
              
              console.log('✅ Request deleted successfully');
              
              // Show success message and navigate back
              Alert.alert(
                'Request Cancelled',
                'Your service request has been cancelled successfully.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate back to home screen
                      navigation.navigate('Main');
                    }
                  }
                ]
              );
              
            } catch (error) {
              console.error('❌ Error cancelling request:', error);
              Alert.alert(
                'Error',
                'Failed to cancel request. Please try again.',
                [{ text: 'OK' }]
              );
            }
          }
        },
      ]
    );
  };

  const renderPingAnimation = () => (
    <View style={styles.animationContainer}>
      {/* Background pulse */}
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
          },
        ]}
      />
      
      {/* Ping animation */}
      <Animated.View
        style={[
          styles.pingCircle,
          {
            transform: [{ scale: pingScale }],
            opacity: pingOpacity,
          },
        ]}
      />
      
      {/* Center icon */}
      <View style={styles.centerIcon}>
        <Ionicons name="construct" size={48} color={theme.colors.primary.darkBlue} />
      </View>
    </View>
  );

  const renderStatusInfo = () => (
    <Card style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <Ionicons name="time-outline" size={24} color={theme.colors.primary.darkBlue} />
        <Text style={styles.statusTitle}>Requesting Service</Text>
      </View>
      
      <View style={styles.mechanicInfo}>
        <Text style={styles.mechanicName}>{mechanicName}</Text>
        <Text style={styles.serviceType}>
          {serviceType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Text>
      </View>
      
      <View style={styles.statusDetails}>
        <View style={styles.statusItem}>
          <Ionicons name="checkmark-circle" size={16} color={theme.colors.semantic.success.primary} />
          <Text style={styles.statusText}>Request sent successfully</Text>
        </View>
        <View style={styles.statusItem}>
          <Ionicons name="time-outline" size={16} color={theme.colors.text.secondary} />
          <Text style={styles.statusText}>Waiting for mechanic to respond...</Text>
        </View>
      </View>
    </Card>
  );

  const renderRequestDetails = () => (
    <Card style={styles.detailsCard}>
      <Text style={styles.detailsTitle}>Request Details</Text>
      
      <View style={styles.detailRow}>
        <Ionicons name="person-outline" size={16} color={theme.colors.text.secondary} />
        <Text style={styles.detailLabel}>Mechanic:</Text>
        <Text style={styles.detailValue}>{mechanicName}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Ionicons name="construct-outline" size={16} color={theme.colors.text.secondary} />
        <Text style={styles.detailLabel}>Service:</Text>
        <Text style={styles.detailValue}>
          {serviceType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Text>
      </View>
      
      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={16} color={theme.colors.text.secondary} />
        <Text style={styles.detailLabel}>Location:</Text>
        <Text style={styles.detailValue}>Your current location</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Ionicons name="time-outline" size={16} color={theme.colors.text.secondary} />
        <Text style={styles.detailLabel}>Requested:</Text>
        <Text style={styles.detailValue}>
          {request ? new Date(request.createdAt).toLocaleTimeString() : 'Just now'}
        </Text>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Session</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.content}>
          {renderPingAnimation()}
          {renderStatusInfo()}
          {renderRequestDetails()}
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRequest}>
            <Text style={styles.cancelButtonText}>Cancel Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Session</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        {renderPingAnimation()}
        {renderStatusInfo()}
        {renderRequestDetails()}
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRequest}>
          <Text style={styles.cancelButtonText}>Cancel Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[5],
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: theme.spacing[6],
  },
  pulseCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary.darkBlue + '20',
  },
  pingCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: theme.colors.primary.darkBlue,
    backgroundColor: 'transparent',
  },
  centerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.component.card.default,
  },
  statusCard: {
    marginBottom: theme.spacing[4],
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  statusTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  mechanicInfo: {
    marginBottom: theme.spacing[4],
  },
  mechanicName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  serviceType: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  statusDetails: {
    gap: theme.spacing[2],
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  detailsCard: {
    marginBottom: theme.spacing[4],
  },
  detailsTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
    gap: theme.spacing[2],
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    minWidth: 80,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  footer: {
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[5],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  cancelButton: {
    backgroundColor: theme.colors.semantic.error.primary,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },
});
