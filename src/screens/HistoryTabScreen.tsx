import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '../theme';
import { Card, Text } from '../components/common';
import { Ionicons } from '@expo/vector-icons';

export const HistoryTabScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2" color="primary" style={styles.title}>
            Service History
          </Text>
          <Text variant="body1" color="secondary" style={styles.subtitle}>
            View your past service requests and maintenance records
          </Text>
        </View>

        {/* Empty State */}
        <Card variant="elevated" style={styles.emptyCard}>
          <View style={styles.emptyContent}>
            <Ionicons 
              name="time-outline" 
              size={64} 
              color={theme.colors.text.tertiary} 
            />
            <Text variant="h4" style={styles.emptyTitle}>
              No Service History
            </Text>
            <Text variant="body2" color="secondary" style={styles.emptyText}>
              Your service requests and maintenance records will appear here once you start using our services.
            </Text>
          </View>
        </Card>

        {/* Placeholder for future history items */}
        <Card variant="elevated" style={styles.infoCard}>
          <Text variant="h4" style={styles.cardTitle}>
            Coming Soon
          </Text>
          <Text variant="body2" color="secondary" style={styles.cardText}>
            • Detailed service history{'\n'}
            • Maintenance records{'\n'}
            • Service receipts{'\n'}
            • Mechanic ratings{'\n'}
            • Service notes and recommendations
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
