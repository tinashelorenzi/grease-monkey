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
import { ServiceRequest, listenToRequestStatus, deleteServiceRequest, updateRequestStatus } from '../services/requestService';
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
    console.log('🚀 RequestSessionScreen mounted');
    console.log('📋 Request ID:', requestId);
    console.log('🔧 Mechanic Name:', mechanicName);
    console.log('🔧 Service Type:', serviceType);
    
    // Start listening to request status changes
    const unsubscribe = listenToRequestStatus(requestId, (updatedRequest) => {
      console.log('🔄 RequestSessionScreen received update:', updatedRequest);
      setRequest(updatedRequest);
      setLoading(false);
      
      if (updatedRequest) {
        console.log('📊 Request status:', updatedRequest.status);
        console.log('📊 Request ID:', updatedRequest.requestId);
        console.log('📊 Mechanic ID:', updatedRequest.mechanicId);
        console.log('📊 Updated at:', new Date(updatedRequest.updatedAt).toLocaleString());
        
        // Handle different status changes
        if (updatedRequest.status === 'accepted') {
          console.log('✅ Request accepted by mechanic');
          // Initialize chat session when request is accepted
          initializeChatSession();
        } else if (updatedRequest.status === 'quoted') {
          console.log('💰 Quote received from mechanic');
          console.log('💰 Quote amount:', updatedRequest.quoteAmount);
          console.log('💰 Quote description:', updatedRequest.quoteDescription);
          // Navigate to quote screen
          navigation.navigate('Quote', {
            requestId: requestId,
            mechanicName: mechanicName,
            serviceType: serviceType,
            quoteAmount: updatedRequest.quoteAmount || 0,
            quoteDescription: updatedRequest.quoteDescription || '',
          });
        } else if (updatedRequest.status === 'completed') {
          console.log('🎉 Service completed');
          Alert.alert(
            'Service Completed!',
            'Your service has been completed successfully.',
            [{ text: 'Great!', onPress: () => navigation.navigate('Main') }]
          );
        } else if (updatedRequest.status === 'declined') {
          console.log('❌ Request declined by mechanic');
          Alert.alert(
            'Request Declined',
            `${mechanicName} is unable to take your request at this time.`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }
      } else {
        console.log('⚠️ No request data received - this might be normal during initial load');
      }
    });

    // Start ping animation
    startPingAnimation();

    return () => {
      console.log('🛑 RequestSessionScreen unmounting - cleaning up listeners');
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

  // Test function for development only
  const handleTestStatusUpdate = async (newStatus: ServiceRequest['status']) => {
    if (!__DEV__) return;
    
    try {
      console.log('🧪 Testing status update to:', newStatus);
      await updateRequestStatus(requestId, newStatus);
      console.log('✅ Test status update completed');
    } catch (error) {
      console.error('❌ Test status update failed:', error);
      Alert.alert('Test Error', 'Failed to update status for testing');
    }
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

  const renderStatusInfo = () => {
    const getStatusInfo = () => {
      if (!request) {
        return {
          title: 'Requesting Service',
          icon: 'time-outline',
          color: theme.colors.primary.darkBlue,
          status: 'pending',
          description: 'Waiting for mechanic to respond...',
          details: [
            { icon: 'checkmark-circle', color: theme.colors.semantic.success.primary, text: 'Request sent successfully' },
            { icon: 'time-outline', color: theme.colors.text.secondary, text: 'Waiting for mechanic to respond...' }
          ]
        };
      }

      switch (request.status) {
        case 'accepted':
          return {
            title: 'Request Accepted!',
            icon: 'checkmark-circle',
            color: theme.colors.semantic.success.primary,
            status: 'accepted',
            description: `${mechanicName} has accepted your request`,
            details: [
              { icon: 'checkmark-circle', color: theme.colors.semantic.success.primary, text: 'Request accepted by mechanic' },
              { icon: 'person-outline', color: theme.colors.text.secondary, text: `${mechanicName} is on the way` }
            ]
          };
        case 'quoted':
          return {
            title: 'Quote Received',
            icon: 'card-outline',
            color: theme.colors.semantic.info.primary,
            status: 'quoted',
            description: `${mechanicName} has sent you a quote`,
            details: [
              { icon: 'card-outline', color: theme.colors.semantic.info.primary, text: 'Quote received from mechanic' },
              { icon: 'information-circle-outline', color: theme.colors.text.secondary, text: 'Review the quote details' }
            ]
          };
        case 'completed':
          return {
            title: 'Service Completed',
            icon: 'checkmark-done-circle',
            color: theme.colors.semantic.success.primary,
            status: 'completed',
            description: 'Your service has been completed successfully',
            details: [
              { icon: 'checkmark-done-circle', color: theme.colors.semantic.success.primary, text: 'Service completed successfully' },
              { icon: 'star-outline', color: theme.colors.text.secondary, text: 'Rate your experience' }
            ]
          };
        case 'declined':
          return {
            title: 'Request Declined',
            icon: 'close-circle',
            color: theme.colors.semantic.error.primary,
            status: 'declined',
            description: `${mechanicName} is unable to take your request`,
            details: [
              { icon: 'close-circle', color: theme.colors.semantic.error.primary, text: 'Request declined by mechanic' },
              { icon: 'arrow-back-outline', color: theme.colors.text.secondary, text: 'Try another mechanic' }
            ]
          };
        default:
          return {
            title: 'Requesting Service',
            icon: 'time-outline',
            color: theme.colors.primary.darkBlue,
            status: request.status,
            description: 'Waiting for mechanic to respond...',
            details: [
              { icon: 'checkmark-circle', color: theme.colors.semantic.success.primary, text: 'Request sent successfully' },
              { icon: 'time-outline', color: theme.colors.text.secondary, text: `Current status: ${request.status}` }
            ]
          };
      }
    };

    const statusInfo = getStatusInfo();

    return (
      <Card style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons name={statusInfo.icon as any} size={24} color={statusInfo.color} />
          <Text style={[styles.statusTitle, { color: statusInfo.color }]}>{statusInfo.title}</Text>
        </View>
        
        <View style={styles.mechanicInfo}>
          <Text style={styles.mechanicName}>{mechanicName}</Text>
          <Text style={styles.serviceType}>
            {serviceType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Text>
        </View>
        
        <Text style={styles.statusDescription}>{statusInfo.description}</Text>
        
        <View style={styles.statusDetails}>
          {statusInfo.details.map((detail, index) => (
            <View key={index} style={styles.statusItem}>
              <Ionicons name={detail.icon as any} size={16} color={detail.color} />
              <Text style={styles.statusText}>{detail.text}</Text>
            </View>
          ))}
        </View>

        {/* Debug information */}
        {__DEV__ && request && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugTitle}>Debug Info:</Text>
            <Text style={styles.debugText}>Request ID: {request.requestId}</Text>
            <Text style={styles.debugText}>Status: {request.status}</Text>
            <Text style={styles.debugText}>Updated: {new Date(request.updatedAt).toLocaleTimeString()}</Text>
          </View>
        )}
      </Card>
    );
  };

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

      {/* Connection status indicator */}
      <View style={styles.connectionStatus}>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: theme.colors.semantic.success.primary }]} />
          <Text style={styles.statusLabel}>Listening for updates</Text>
        </View>
        <Text style={styles.statusSubtext}>Real-time status monitoring active</Text>
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
        
        {/* Test buttons for development only */}
        {__DEV__ && (
          <View style={styles.testButtons}>
            <Text style={styles.testTitle}>Test Status Updates:</Text>
            <View style={styles.testButtonRow}>
              <TouchableOpacity 
                style={[styles.testButton, { backgroundColor: theme.colors.semantic.success.primary }]} 
                onPress={() => handleTestStatusUpdate('accepted')}
              >
                <Text style={styles.testButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.testButton, { backgroundColor: theme.colors.semantic.info.primary }]} 
                onPress={() => handleTestStatusUpdate('quoted')}
              >
                <Text style={styles.testButtonText}>Quote</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.testButton, { backgroundColor: theme.colors.semantic.warning.primary }]} 
                onPress={() => handleTestStatusUpdate('completed')}
              >
                <Text style={styles.testButtonText}>Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.testButton, { backgroundColor: theme.colors.semantic.error.primary }]} 
                onPress={() => handleTestStatusUpdate('declined')}
              >
                <Text style={styles.testButtonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  statusDescription: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
  debugInfo: {
    marginTop: theme.spacing[4],
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  debugTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  },
  debugText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing[1],
  },
  connectionStatus: {
    marginTop: theme.spacing[4],
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing[2],
  },
  statusLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  statusSubtext: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
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
  testButtons: {
    marginTop: theme.spacing[4],
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  testTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  testButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  testButton: {
    flex: 1,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.borders.radius.sm,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },
});
