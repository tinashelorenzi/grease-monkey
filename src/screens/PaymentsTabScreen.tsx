import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Card, Text, Button } from '../components/common';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: string;
  service: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  mechanic: string;
}

// Mock data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa ending in 1234',
    last4: '1234',
    expiryDate: '12/26',
    isDefault: true,
  },
  {
    id: '2',
    type: 'paypal',
    name: 'PayPal',
    isDefault: false,
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-15',
    service: 'Oil Change',
    amount: 45.99,
    status: 'completed',
    paymentMethod: 'Visa •••• 1234',
    mechanic: 'John Smith',
  },
  {
    id: '2',
    date: '2024-03-08',
    service: 'Brake Inspection',
    amount: 89.99,
    status: 'completed',
    paymentMethod: 'PayPal',
    mechanic: 'Sarah Johnson',
  },
  {
    id: '3',
    date: '2024-03-01',
    service: 'Diagnostic Check',
    amount: 75.00,
    status: 'pending',
    paymentMethod: 'Visa •••• 1234',
    mechanic: 'Mike Wilson',
  },
];

export const PaymentsTabScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'methods' | 'history'>('overview');
  const [showMockData, setShowMockData] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.semantic.success.primary;
      case 'pending':
        return theme.colors.semantic.warning.primary;
      case 'failed':
        return theme.colors.semantic.error.primary;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return 'card';
      case 'paypal':
        return 'logo-paypal';
      case 'bank':
        return 'business';
      default:
        return 'wallet';
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Payments</Text>
          <Text style={styles.subtitle}>Manage your billing and payments</Text>
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('Add Payment', 'Payment method management coming soon!')}>
          <Ionicons name="add" size={20} color={theme.colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {[
        { key: 'overview', label: 'Overview', icon: 'pie-chart' },
        { key: 'methods', label: 'Methods', icon: 'card' },
        { key: 'history', label: 'History', icon: 'time' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          onPress={() => setActiveTab(tab.key as any)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab.icon as any}
            size={18}
            color={activeTab === tab.key ? theme.colors.primary.darkBlue : theme.colors.text.tertiary}
          />
          <Text style={[
            styles.tabText,
            activeTab === tab.key && styles.tabTextActive,
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {showMockData ? (
        <>
          {/* Spending Summary */}
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Monthly Spending</Text>
              <Text style={styles.summaryMonth}>March 2024</Text>
            </View>
            
            <View style={styles.summaryAmount}>
              <Text style={styles.totalAmount}>$210.98</Text>
              <View style={styles.changeIndicator}>
                <Ionicons name="trending-up" size={16} color={theme.colors.semantic.success.primary} />
                <Text style={styles.changeText}>+15% from last month</Text>
              </View>
            </View>
            
            <View style={styles.summaryBreakdown}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Completed</Text>
                <Text style={styles.breakdownValue}>$135.98</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Pending</Text>
                <Text style={styles.breakdownValue}>$75.00</Text>
              </View>
            </View>
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {[
                { icon: 'add-circle', title: 'Add Card', color: theme.colors.primary.darkBlue },
                { icon: 'receipt', title: 'View Receipt', color: theme.colors.semantic.info.primary },
                { icon: 'card', title: 'Auto-pay', color: theme.colors.semantic.success.primary },
                { icon: 'help-circle', title: 'Support', color: theme.colors.semantic.warning.primary },
              ].map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionCard}
                  onPress={() => Alert.alert(action.title, 'Feature coming soon!')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => setActiveTab('history')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {mockTransactions.slice(0, 3).map((transaction) => (
              <Card key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionContent}>
                  <View style={styles.transactionLeft}>
                    <Text style={styles.transactionService}>{transaction.service}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                  
                  <View style={styles.transactionRight}>
                    <Text style={styles.transactionAmount}>
                      ${transaction.amount.toFixed(2)}
                    </Text>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(transaction.status) }
                    ]} />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </>
      ) : (
        renderEmptyOverview()
      )}
    </View>
  );

  const renderEmptyOverview = () => (
    <View style={styles.emptyContainer}>
      <Card style={styles.emptyCard}>
        <View style={styles.emptyContent}>
          <Ionicons name="wallet-outline" size={64} color={theme.colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Payment History</Text>
          <Text style={styles.emptyDescription}>
            Your payment history and billing information will appear here once you make your first service request.
          </Text>
          
          <TouchableOpacity
            style={styles.mockDataButton}
            onPress={() => setShowMockData(!showMockData)}
            activeOpacity={0.8}
          >
            <Text style={styles.mockDataButtonText}>Show Sample Data</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Features Preview */}
      <Card style={styles.featuresCard}>
        <View style={styles.featuresHeader}>
          <Ionicons name="card" size={20} color={theme.colors.primary.darkBlue} />
          <Text style={styles.featuresTitle}>Payment Features</Text>
        </View>
        
        <View style={styles.featuresList}>
          {[
            { icon: 'shield-checkmark', text: 'Secure payment processing' },
            { icon: 'card', text: 'Multiple payment methods' },
            { icon: 'receipt', text: 'Digital receipts & invoices' },
            { icon: 'refresh', text: 'Auto-pay for regular services' },
            { icon: 'analytics', text: 'Spending insights & reports' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name={feature.icon as any} size={16} color={theme.colors.primary.darkBlue} />
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );

  const renderPaymentMethods = () => (
    <View style={styles.tabContent}>
      {showMockData ? (
        <>
          <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
          {mockPaymentMethods.map((method) => (
            <Card key={method.id} style={styles.methodCard}>
              <View style={styles.methodContent}>
                <View style={styles.methodLeft}>
                  <View style={styles.methodIcon}>
                    <Ionicons
                      name={getPaymentIcon(method.type) as any}
                      size={24}
                      color={theme.colors.primary.darkBlue}
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    {method.expiryDate && (
                      <Text style={styles.methodExpiry}>Expires {method.expiryDate}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.methodRight}>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.methodOptions}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.text.tertiary} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
          
          <Button
            title="Add Payment Method"
            onPress={() => Alert.alert('Add Payment Method', 'Coming soon!')}
            variant="outline"
            style={styles.addMethodButton}
            leftIcon={<Ionicons name="add" size={20} color={theme.colors.primary.darkBlue} />}
          />
        </>
      ) : (
        <View style={styles.emptyMethods}>
          <Ionicons name="card-outline" size={64} color={theme.colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Payment Methods</Text>
          <Text style={styles.emptyDescription}>
            Add a payment method to make service payments quick and easy.
          </Text>
          <Button
            title="Show Sample Methods"
            onPress={() => setShowMockData(true)}
            variant="primary"
            style={styles.sampleButton}
          />
        </View>
      )}
    </View>
  );

  const renderTransactionHistory = () => (
    <View style={styles.tabContent}>
      {showMockData ? (
        <>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={16} color={theme.colors.primary.darkBlue} />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>
          
          {mockTransactions.map((transaction) => (
            <Card key={transaction.id} style={styles.historyCard}>
              <TouchableOpacity style={styles.historyContent} activeOpacity={0.7}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyService}>{transaction.service}</Text>
                  <Text style={styles.historyMechanic}>with {transaction.mechanic}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                  <Text style={styles.historyPaymentMethod}>{transaction.paymentMethod}</Text>
                </View>
                
                <View style={styles.historyRight}>
                  <Text style={styles.historyAmount}>${transaction.amount.toFixed(2)}</Text>
                  <View style={[
                    styles.historyStatus,
                    { backgroundColor: getStatusColor(transaction.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.historyStatusText,
                      { color: getStatusColor(transaction.status) }
                    ]}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </>
      ) : (
        <View style={styles.emptyHistory}>
          <Ionicons name="receipt-outline" size={64} color={theme.colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Transaction History</Text>
          <Text style={styles.emptyDescription}>
            Your payment history will appear here after you complete services.
          </Text>
          <Button
            title="Show Sample History"
            onPress={() => setShowMockData(true)}
            variant="primary"
            style={styles.sampleButton}
          />
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'methods':
        return renderPaymentMethods();
      case 'history':
        return renderTransactionHistory();
      default:
        return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      
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
        {renderTabContent()}
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
    paddingBottom: theme.spacing[8],
  },

  // Header styles
  header: {
    backgroundColor: theme.colors.background.card,
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[5],
    paddingHorizontal: theme.spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.darkBlue,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.card,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borders.radius.md,
    gap: theme.spacing[2],
  },
  tabActive: {
    backgroundColor: theme.colors.background.secondary,
  },
  tabText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.tertiary,
  },
  tabTextActive: {
    color: theme.colors.primary.darkBlue,
  },

  // Tab content
  tabContent: {
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[5],
    gap: theme.spacing[5],
  },

  // Overview tab
  summaryCard: {},
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  summaryTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  summaryMonth: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
  },
  summaryAmount: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  totalAmount: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.darkBlue,
    marginBottom: theme.spacing[2],
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  changeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.semantic.success.primary,
  },
  summaryBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  breakdownItem: {
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  breakdownLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
  },
  breakdownValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },

  // Quick actions
  quickActions: {},
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[4],
  },
  actionCard: {
    width: '47%',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[4],
    alignItems: 'center',
    gap: theme.spacing[3],
    ...theme.shadows.component.card.default,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },

  // Recent transactions
  recentSection: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  seeAllText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.darkBlue,
  },
  transactionCard: {
    marginBottom: theme.spacing[3],
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionService: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  transactionDate: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: theme.spacing[2],
  },
  transactionAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Payment methods
  methodCard: {
    marginBottom: theme.spacing[3],
  },
  methodContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing[4],
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary.darkBlue + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  methodExpiry: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
  },
  methodRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  defaultBadge: {
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[2],
    backgroundColor: theme.colors.semantic.success.primary + '20',
    borderRadius: theme.borders.radius.full,
  },
  defaultText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.semantic.success.primary,
  },
  methodOptions: {
    padding: theme.spacing[2],
  },
  addMethodButton: {
    marginTop: theme.spacing[4],
  },

  // Transaction history
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.md,
    gap: theme.spacing[2],
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.darkBlue,
  },
  historyCard: {
    marginBottom: theme.spacing[3],
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyLeft: {
    flex: 1,
    gap: theme.spacing[1],
  },
  historyService: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  historyMechanic: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
  },
  historyDate: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
  },
  historyPaymentMethod: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: theme.spacing[2],
  },
  historyAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  historyStatus: {
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[2],
    borderRadius: theme.borders.radius.full,
  },
  historyStatusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },

  // Empty states
  emptyContainer: {
    gap: theme.spacing[6],
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing[10],
  },
  emptyContent: {
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
    maxWidth: 300,
  },
  mockDataButton: {
    marginTop: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    backgroundColor: theme.colors.primary.darkBlue,
    borderRadius: theme.borders.radius.md,
  },
  mockDataButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.inverse,
  },
  emptyMethods: {
    alignItems: 'center',
    paddingVertical: theme.spacing[10],
    gap: theme.spacing[4],
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: theme.spacing[10],
    gap: theme.spacing[4],
  },
  sampleButton: {
    marginTop: theme.spacing[2],
  },

  // Features card
  featuresCard: {},
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[5],
  },
  featuresTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  featuresList: {
    gap: theme.spacing[4],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  featureText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    flex: 1,
  },
});