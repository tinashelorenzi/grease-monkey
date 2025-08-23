import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '../theme';
import { Card, Text } from '../components/common';
import { Ionicons } from '@expo/vector-icons';

export const PaymentsTabScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2" color="primary" style={styles.title}>
            Payments
          </Text>
          <Text variant="body1" color="secondary" style={styles.subtitle}>
            Manage your payment history and billing information
          </Text>
        </View>

        {/* Empty State */}
        <Card variant="elevated" style={styles.emptyCard}>
          <View style={styles.emptyContent}>
            <Ionicons 
              name="card-outline" 
              size={64} 
              color={theme.colors.text.tertiary} 
            />
            <Text variant="h4" style={styles.emptyTitle}>
              No Payment History
            </Text>
            <Text variant="body2" color="secondary" style={styles.emptyText}>
              Your payment history and billing information will appear here once you make your first service request.
            </Text>
          </View>
        </Card>

        {/* Placeholder for future payment features */}
        <Card variant="elevated" style={styles.infoCard}>
          <Text variant="h4" style={styles.cardTitle}>
            Payment Features
          </Text>
          <Text variant="body2" color="secondary" style={styles.cardText}>
            • Secure payment processing{'\n'}
            • Multiple payment methods{'\n'}
            • Payment history and receipts{'\n'}
            • Billing information management{'\n'}
            • Subscription plans (coming soon)
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
  title: {
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    opacity: 0.8,
  },
  emptyCard: {
    marginBottom: theme.spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    color: theme.colors.text.secondary,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
    paddingHorizontal: theme.spacing.lg,
  },
  infoCard: {
    marginBottom: theme.spacing.xl,
  },
  cardTitle: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary.darkBlue,
  },
  cardText: {
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
});
