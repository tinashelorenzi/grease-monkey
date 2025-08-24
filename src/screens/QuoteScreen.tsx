import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { Card } from '../components/common';
import { RootStackParamList } from '../navigation/AppNavigator';

type QuoteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quote'>;
type QuoteScreenRouteProp = RouteProp<RootStackParamList, 'Quote'>;

export const QuoteScreen: React.FC = () => {
  const navigation = useNavigation<QuoteScreenNavigationProp>();
  const route = useRoute<QuoteScreenRouteProp>();
  const { requestId, mechanicName, serviceType, quoteAmount, quoteDescription } = route.params;
  
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleProcessPayment = async () => {
    try {
      setProcessingPayment(true);
      console.log('💳 Processing payment for quote:', quoteAmount);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Payment processed successfully');
      setPaymentCompleted(true);
      
      Alert.alert(
        'Payment Successful!',
        'Your payment has been processed successfully. The mechanic will complete your service.',
        [
          {
            text: 'OK',
                          onPress: () => {
                // Navigate back to home after payment
                navigation.navigate('Main');
              }
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleDeclineQuote = () => {
    Alert.alert(
      'Decline Quote',
      'Are you sure you want to decline this quote? This will cancel your service request.',
      [
        { text: 'Keep Quote', style: 'cancel' },
        { 
          text: 'Decline Quote', 
          style: 'destructive',
          onPress: () => {
            console.log('❌ Quote declined by customer');
            navigation.navigate('Main');
          }
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Service Quote</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderQuoteDetails = () => (
    <Card style={styles.quoteCard}>
      <View style={styles.quoteHeader}>
        <Ionicons name="receipt-outline" size={32} color={theme.colors.primary.darkBlue} />
        <Text style={styles.quoteTitle}>Quote Received</Text>
      </View>
      
      <View style={styles.mechanicInfo}>
        <Text style={styles.mechanicName}>{mechanicName}</Text>
        <Text style={styles.serviceType}>
          {serviceType.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Text>
      </View>
      
      <View style={styles.quoteAmount}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amountValue}>R {quoteAmount.toLocaleString()}</Text>
      </View>
      
      {quoteDescription && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Service Details</Text>
          <Text style={styles.descriptionText}>{quoteDescription}</Text>
        </View>
      )}
    </Card>
  );

  const renderPaymentSection = () => (
    <Card style={styles.paymentCard}>
      <Text style={styles.paymentTitle}>Payment Method</Text>
      
      <View style={styles.paymentMethod}>
        <Ionicons name="card-outline" size={24} color={theme.colors.text.primary} />
        <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
      </View>
      
      <View style={styles.paymentNote}>
        <Ionicons name="information-circle-outline" size={16} color={theme.colors.text.secondary} />
        <Text style={styles.paymentNoteText}>
          Payment will be processed securely. You'll only be charged after the service is completed.
        </Text>
      </View>
    </Card>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.payButton, processingPayment && styles.payButtonDisabled]}
        onPress={handleProcessPayment}
        disabled={processingPayment || paymentCompleted}
      >
        {processingPayment ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={20} color={theme.colors.text.inverse} style={styles.spinning} />
            <Text style={styles.payButtonText}>Processing...</Text>
          </View>
        ) : paymentCompleted ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.text.inverse} />
            <Text style={styles.payButtonText}>Payment Complete</Text>
          </View>
        ) : (
          <>
            <Ionicons name="card" size={20} color={theme.colors.text.inverse} />
            <Text style={styles.payButtonText}>Pay R {quoteAmount.toLocaleString()}</Text>
          </>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.declineButton}
        onPress={handleDeclineQuote}
        disabled={processingPayment || paymentCompleted}
      >
        <Text style={styles.declineButtonText}>Decline Quote</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderQuoteDetails()}
        {renderPaymentSection()}
      </ScrollView>
      
      <View style={styles.footer}>
        {renderActionButtons()}
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
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[5],
  },
  quoteCard: {
    marginBottom: theme.spacing[4],
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  quoteTitle: {
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
  quoteAmount: {
    alignItems: 'center',
    marginBottom: theme.spacing[4],
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.md,
  },
  amountLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },
  amountValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.darkBlue,
  },
  descriptionContainer: {
    marginTop: theme.spacing[3],
  },
  descriptionLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  descriptionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  paymentCard: {
    marginBottom: theme.spacing[4],
  },
  paymentTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.md,
    marginBottom: theme.spacing[3],
  },
  paymentMethodText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[3],
  },
  paymentNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[2],
  },
  paymentNoteText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[5],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  actionButtons: {
    gap: theme.spacing[3],
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    backgroundColor: theme.colors.primary.darkBlue,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borders.radius.md,
  },
  payButtonDisabled: {
    backgroundColor: theme.colors.background.secondary,
  },
  payButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
  declineButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.semantic.error.primary,
  },
  declineButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.semantic.error.primary,
  },
});
