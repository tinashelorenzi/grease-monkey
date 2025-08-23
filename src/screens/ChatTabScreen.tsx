import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '../theme';
import { Card, Text } from '../components/common';
import { Ionicons } from '@expo/vector-icons';

export const ChatTabScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2" color="primary" style={styles.title}>
            Chat Support
          </Text>
          <Text variant="body1" color="secondary" style={styles.subtitle}>
            Get help from our support team via chat
          </Text>
        </View>

        {/* Empty State */}
        <Card variant="elevated" style={styles.emptyCard}>
          <View style={styles.emptyContent}>
            <Ionicons 
              name="chatbubbles-outline" 
              size={64} 
              color={theme.colors.text.tertiary} 
            />
            <Text variant="h4" style={styles.emptyTitle}>
              Start a Conversation
            </Text>
            <Text variant="body2" color="secondary" style={styles.emptyText}>
              Chat with our support team for help with your service requests, billing questions, or any other assistance you need.
            </Text>
          </View>
        </Card>

        {/* Support Features */}
        <Card variant="elevated" style={styles.infoCard}>
          <Text variant="h4" style={styles.cardTitle}>
            How We Can Help
          </Text>
          <Text variant="body2" color="secondary" style={styles.cardText}>
            • Service request assistance{'\n'}
            • Billing and payment support{'\n'}
            • Technical troubleshooting{'\n'}
            • General inquiries{'\n'}
            • Emergency support (24/7)
          </Text>
        </Card>

        {/* Contact Info */}
        <Card variant="elevated" style={styles.contactCard}>
          <Text variant="h4" style={styles.cardTitle}>
            Other Ways to Reach Us
          </Text>
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color={theme.colors.primary.darkBlue} />
            <Text variant="body2" style={styles.contactText}>
              Phone: 1-800-GREASE-MONKEY
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary.darkBlue} />
            <Text variant="body2" style={styles.contactText}>
              Email: support@greasemonkey.com
            </Text>
          </View>
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
  contactCard: {
    marginBottom: theme.spacing.xl,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  contactText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
});
