import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Card, Text, Button } from '../components/common';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'support';
  timestamp: string;
  isRead: boolean;
}

interface SupportAgent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  specialization: string;
}

// Mock data
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    message: 'Hi! How can I help you today?',
    sender: 'support',
    timestamp: '2024-03-15T10:00:00Z',
    isRead: true,
  },
  {
    id: '2',
    message: 'I need help with my recent service request',
    sender: 'user',
    timestamp: '2024-03-15T10:01:00Z',
    isRead: true,
  },
  {
    id: '3',
    message: 'Of course! Let me look into that for you. Can you provide your service request ID?',
    sender: 'support',
    timestamp: '2024-03-15T10:02:00Z',
    isRead: true,
  },
];

const mockAgents: SupportAgent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    status: 'online',
    specialization: 'General Support',
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'MC',
    status: 'online',
    specialization: 'Technical Issues',
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    avatar: 'LR',
    status: 'away',
    specialization: 'Billing & Payments',
  },
];

export const ChatTabScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'chat' | 'faq'>('overview');
  const [message, setMessage] = useState('');
  const [showMockData, setShowMockData] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      Alert.alert('Message Sent', 'Chat functionality will be available soon!');
      setMessage('');
    }
  };

  const handleStartChat = () => {
    setActiveView('chat');
    setShowMockData(true);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {activeView === 'chat' ? (
          <>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setActiveView('overview')}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.primary.darkBlue} />
            </TouchableOpacity>
            <View style={styles.chatHeader}>
              <View style={styles.agentAvatar}>
                <Text style={styles.agentAvatarText}>SJ</Text>
              </View>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>Sarah Johnson</Text>
                <View style={styles.agentStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Online • General Support</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.chatOptionsButton}>
              <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.primary.darkBlue} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Support</Text>
              <Text style={styles.subtitle}>Get help when you need it</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => Alert.alert('Notifications', 'No new notifications')}
            >
              <Ionicons name="notifications" size={20} color={theme.colors.primary.darkBlue} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const renderNavigationTabs = () => {
    if (activeView === 'chat') return null;
    
    return (
      <View style={styles.tabsContainer}>
        {[
          { key: 'overview', label: 'Overview', icon: 'home' },
          { key: 'faq', label: 'FAQ', icon: 'help-circle' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeView === tab.key && styles.tabActive]}
            onPress={() => setActiveView(tab.key as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={activeView === tab.key ? theme.colors.primary.darkBlue : theme.colors.text.tertiary}
            />
            <Text style={[
              styles.tabText,
              activeView === tab.key && styles.tabTextActive,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Get Help</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleStartChat}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary.darkBlue + '20' }]}>
              <Ionicons name="chatbubbles" size={28} color={theme.colors.primary.darkBlue} />
            </View>
            <Text style={styles.actionTitle}>Live Chat</Text>
            <Text style={styles.actionSubtitle}>Get instant help from our support team</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => Alert.alert('Emergency', 'Calling emergency support...')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.semantic.error.primary + '20' }]}>
              <Ionicons name="call" size={28} color={theme.colors.semantic.error.primary} />
            </View>
            <Text style={styles.actionTitle}>Emergency</Text>
            <Text style={styles.actionSubtitle}>24/7 emergency roadside assistance</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Support Team */}
      <Card style={styles.teamCard}>
        <View style={styles.teamHeader}>
          <Ionicons name="people" size={20} color={theme.colors.primary.darkBlue} />
          <Text style={styles.teamTitle}>Support Team</Text>
        </View>
        
        <View style={styles.agentsList}>
          {mockAgents.map((agent) => (
            <TouchableOpacity
              key={agent.id}
              style={styles.agentCard}
              onPress={() => {
                setShowMockData(true);
                setActiveView('chat');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.agentLeft}>
                <View style={styles.agentAvatarSmall}>
                  <Text style={styles.agentAvatarSmallText}>{agent.avatar}</Text>
                </View>
                <View style={[
                  styles.agentStatusIndicator,
                  { backgroundColor: agent.status === 'online' ? theme.colors.status.online : theme.colors.status.away }
                ]} />
              </View>
              <View style={styles.agentDetails}>
                <Text style={styles.agentNameSmall}>{agent.name}</Text>
                <Text style={styles.agentSpecialization}>{agent.specialization}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Contact Options */}
      <Card style={styles.contactCard}>
        <Text style={styles.contactTitle}>Other Ways to Reach Us</Text>
        <View style={styles.contactOptions}>
          {[
            { icon: 'call', label: 'Phone Support', value: '1-800-GREASE-MONKEY', color: theme.colors.semantic.info.primary },
            { icon: 'mail', label: 'Email Support', value: 'support@greasemonkey.com', color: theme.colors.semantic.success.primary },
            { icon: 'time', label: 'Average Response', value: '< 2 minutes', color: theme.colors.semantic.warning.primary },
          ].map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactOption}
              onPress={() => Alert.alert(contact.label, contact.value)}
              activeOpacity={0.8}
            >
              <View style={[styles.contactIcon, { backgroundColor: contact.color + '20' }]}>
                <Ionicons name={contact.icon as any} size={20} color={contact.color} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{contact.label}</Text>
                <Text style={styles.contactValue}>{contact.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Recent Chats */}
      {showMockData && (
        <Card style={styles.recentCard}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Conversations</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.recentChat}
            onPress={() => setActiveView('chat')}
            activeOpacity={0.8}
          >
            <View style={styles.recentLeft}>
              <View style={styles.recentAvatar}>
                <Text style={styles.recentAvatarText}>SJ</Text>
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>Sarah Johnson</Text>
                <Text style={styles.recentMessage}>Of course! Let me look into that...</Text>
              </View>
            </View>
            <View style={styles.recentRight}>
              <Text style={styles.recentTime}>10:02 AM</Text>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>1</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      )}
    </View>
  );

  const renderChat = () => (
    <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {showMockData && mockMessages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageContainer,
              msg.sender === 'user' ? styles.userMessage : styles.supportMessage,
            ]}
          >
            {msg.sender === 'support' && (
              <View style={styles.messageSenderAvatar}>
                <Text style={styles.messageSenderAvatarText}>SJ</Text>
              </View>
            )}
            <View style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.supportBubble,
            ]}>
              <Text style={[
                styles.messageText,
                msg.sender === 'user' ? styles.userMessageText : styles.supportMessageText,
              ]}>
                {msg.message}
              </Text>
              <Text style={[
                styles.messageTime,
                msg.sender === 'user' ? styles.userMessageTime : styles.supportMessageTime,
              ]}>
                {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
        ))}
        
        {!showMockData && (
          <View style={styles.emptyChatContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.text.tertiary} />
            <Text style={styles.emptyChatTitle}>Start a Conversation</Text>
            <Text style={styles.emptyChatText}>
              Send a message below to get help from our support team.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.messageInputContainer}>
        <View style={styles.messageInputWrapper}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send"
              size={20}
              color={message.trim() ? theme.colors.text.inverse : theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const renderFAQ = () => (
    <View style={styles.faqContainer}>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      
      {[
        {
          question: 'How do I request a mechanic?',
          answer: 'You can request a mechanic through the Home tab by tapping "Request Service" and selecting your service type.',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, PayPal, and bank transfers. You can manage payment methods in the Payments tab.',
        },
        {
          question: 'How long does it take for a mechanic to arrive?',
          answer: 'Average response time is 30-45 minutes, depending on your location and service availability.',
        },
        {
          question: 'Are your mechanics certified?',
          answer: 'Yes, all our mechanics are licensed, insured, and background-checked professionals with extensive experience.',
        },
        {
          question: 'What if I need emergency roadside assistance?',
          answer: 'We offer 24/7 emergency support. Use the emergency button or call our hotline for immediate assistance.',
        },
      ].map((faq, index) => (
        <Card key={index} style={styles.faqCard}>
          <TouchableOpacity style={styles.faqHeader} activeOpacity={0.8}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Ionicons name="chevron-down" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
          <Text style={styles.faqAnswer}>{faq.answer}</Text>
        </Card>
      ))}

      <Card style={styles.helpCard}>
        <Text style={styles.helpTitle}>Still need help?</Text>
        <Text style={styles.helpText}>
          Our support team is here to help with any questions not covered in our FAQ.
        </Text>
        <Button
          title="Contact Support"
          onPress={handleStartChat}
          variant="primary"
          style={styles.helpButton}
        />
      </Card>
    </View>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'chat':
        return renderChat();
      case 'faq':
        return renderFAQ();
      default:
        return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderNavigationTabs()}
      
      {activeView !== 'chat' ? (
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
          {renderContent()}
        </ScrollView>
      ) : (
        renderContent()
      )}
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
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Chat header
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing[4],
    gap: theme.spacing[3],
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentAvatarText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  agentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
    marginTop: theme.spacing[0.5],
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.status.online,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
  },
  chatOptionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
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
    gap: theme.spacing[4],
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

  // Overview
  overviewContainer: {
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[5],
    gap: theme.spacing[6],
  },
  quickActions: {},
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  actionsGrid: {
    gap: theme.spacing[4],
  },
  actionCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[6],
    alignItems: 'center',
    gap: theme.spacing[3],
    ...theme.shadows.component.card.default,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  actionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },

  // Support team
  teamCard: {},
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[5],
  },
  teamTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  agentsList: {
    gap: theme.spacing[4],
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.md,
    gap: theme.spacing[4],
  },
  agentLeft: {
    position: 'relative',
  },
  agentAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentAvatarSmallText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  agentStatusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.background.card,
  },
  agentDetails: {
    flex: 1,
  },
  agentNameSmall: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[0.5],
  },
  agentSpecialization: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
  },

  // Contact options
  contactCard: {},
  contactTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
    marginBottom: theme.spacing[5],
  },
  contactOptions: {
    gap: theme.spacing[4],
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.md,
    gap: theme.spacing[4],
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[0.5],
  },
  contactValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
  },

  // Recent chats
  recentCard: {},
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  recentTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
  },
  seeAllText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.darkBlue,
  },
  recentChat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.md,
    gap: theme.spacing[4],
  },
  recentLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  recentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentAvatarText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[0.5],
  },
  recentMessage: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
  },
  recentRight: {
    alignItems: 'flex-end',
    gap: theme.spacing[2],
  },
  recentTime: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
  },
  unreadBadge: {
    backgroundColor: theme.colors.semantic.error.primary,
    borderRadius: theme.borders.radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },

  // Chat
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: theme.spacing[5],
    gap: theme.spacing[4],
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing[2],
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  supportMessage: {
    justifyContent: 'flex-start',
  },
  messageSenderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageSenderAvatarText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: theme.borders.radius.lg,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[1],
  },
  userBubble: {
    backgroundColor: theme.colors.primary.darkBlue,
    borderBottomRightRadius: theme.borders.radius.sm,
  },
  supportBubble: {
    backgroundColor: theme.colors.background.secondary,
    borderBottomLeftRadius: theme.borders.radius.sm,
  },
  messageText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
  userMessageText: {
    color: theme.colors.text.inverse,
  },
  supportMessageText: {
    color: theme.colors.text.primary,
  },
  messageTime: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: theme.colors.text.inverse,
    opacity: 0.7,
  },
  supportMessageTime: {
    color: theme.colors.text.tertiary,
  },
  emptyChatContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing[10],
    gap: theme.spacing[4],
  },
  emptyChatTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  emptyChatText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },

  // Message input
  messageInputContainer: {
    backgroundColor: theme.colors.background.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[4],
  },
  messageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.lg,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[3],
  },
  messageInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.primary,
    maxHeight: 100,
    paddingVertical: theme.spacing[2],
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.background.disabled,
  },

  // FAQ
  faqContainer: {
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[5],
    gap: theme.spacing[4],
  },
  faqCard: {
    padding: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
  },
  faqQuestion: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing[3],
  },
  faqAnswer: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
    paddingHorizontal: theme.spacing[5],
    paddingBottom: theme.spacing[4],
  },
  helpCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
    marginTop: theme.spacing[4],
  },
  helpTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBlue,
    marginBottom: theme.spacing[3],
  },
  helpText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
    marginBottom: theme.spacing[6],
    maxWidth: 300,
  },
  helpButton: {
    minWidth: 200,
  },
});