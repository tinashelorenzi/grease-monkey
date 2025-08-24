import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'mechanic' | 'customer';
  senderName: string;
  content: string;
  read: boolean;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  sessionId: string;
  requestId: string;
  customerId: string;
  mechanicId: string;
  customerName: string;
  mechanicName: string;
  lastMessage: string;
  lastMessageTime: number;
  createdAt: number;
  updatedAt: number;
}

// Find or create chat session for a request
export const findOrCreateChatSession = async (
  requestId: string,
  customerId: string,
  mechanicId: string,
  customerName: string,
  mechanicName: string
): Promise<string> => {
  try {
    console.log('🔍 Finding or creating chat session for request:', requestId);
    
    // Check if chat session already exists
    const chatSessionsRef = collection(db, 'chatSessions');
    const q = query(chatSessionsRef, where('requestId', '==', requestId), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const session = snapshot.docs[0];
      console.log('✅ Found existing chat session:', session.id);
      return session.id;
    }
    
    // Create new chat session
    console.log('📝 Creating new chat session...');
    const newSessionRef = await addDoc(chatSessionsRef, {
      requestId: requestId,
      customerId: customerId,
      mechanicId: mechanicId,
      customerName: customerName,
      mechanicName: mechanicName,
      lastMessage: '',
      lastMessageTime: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    console.log('✅ Created new chat session:', newSessionRef.id);
    return newSessionRef.id;
  } catch (error) {
    console.error('❌ Error finding/creating chat session:', error);
    throw new Error('Failed to create chat session');
  }
};

// Send a message
export const sendMessage = async (
  sessionId: string,
  senderId: string,
  senderType: 'mechanic' | 'customer',
  senderName: string,
  content: string
): Promise<void> => {
  try {
    console.log('📤 Sending message in session:', sessionId);
    
    // Add message to chat
    const messagesRef = collection(db, 'chatSessions', sessionId, 'messages');
    await addDoc(messagesRef, {
      senderId: senderId,
      senderType: senderType,
      senderName: senderName,
      content: content,
      read: false,
      timestamp: Date.now(),
    });
    
    // Update chat session
    const sessionRef = doc(db, 'chatSessions', sessionId);
    await updateDoc(sessionRef, {
      lastMessage: content,
      lastMessageTime: Date.now(),
      updatedAt: Date.now(),
    });
    
    console.log('✅ Message sent successfully');
  } catch (error) {
    console.error('❌ Error sending message:', error);
    throw new Error('Failed to send message');
  }
};

// Listen to messages in a chat session
export const listenToMessages = (
  sessionId: string,
  onMessagesUpdate: (messages: ChatMessage[]) => void,
  onUnreadCountUpdate: (count: number) => void
) => {
  console.log('👂 Listening to messages in session:', sessionId);
  
  const messagesRef = collection(db, 'chatSessions', sessionId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    let unreadCount = 0;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const message: ChatMessage = {
        id: doc.id,
        senderId: data.senderId,
        senderType: data.senderType,
        senderName: data.senderName,
        content: data.content,
        read: data.read,
        timestamp: data.timestamp,
      };
      
      messages.push(message);
      
      // Count unread messages from mechanic
      if (data.senderType === 'mechanic' && !data.read) {
        unreadCount++;
      }
    });
    
    console.log('📊 Messages update:', messages.length, 'messages,', unreadCount, 'unread');
    onMessagesUpdate(messages);
    onUnreadCountUpdate(unreadCount);
  }, (error) => {
    console.error('❌ Error listening to messages:', error);
  });
};

// Mark messages as read
export const markMessagesAsRead = async (sessionId: string, customerId: string): Promise<void> => {
  try {
    console.log('📖 Marking messages as read in session:', sessionId);
    
    const messagesRef = collection(db, 'chatSessions', sessionId, 'messages');
    const q = query(
      messagesRef,
      where('senderType', '==', 'mechanic'),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    const updatePromises = snapshot.docs.map((docSnapshot) => {
      const messageRef = doc(db, 'chatSessions', sessionId, 'messages', docSnapshot.id);
      return updateDoc(messageRef, { read: true });
    });
    
    await Promise.all(updatePromises);
    console.log('✅ Marked', snapshot.docs.length, 'messages as read');
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
  }
};

// Get chat session by request ID
export const getChatSessionByRequestId = async (requestId: string): Promise<ChatSession | null> => {
  try {
    const chatSessionsRef = collection(db, 'chatSessions');
    const q = query(chatSessionsRef, where('requestId', '==', requestId), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        sessionId: doc.id,
        requestId: data.requestId,
        customerId: data.customerId,
        mechanicId: data.mechanicId,
        customerName: data.customerName,
        mechanicName: data.mechanicName,
        lastMessage: data.lastMessage,
        lastMessageTime: data.lastMessageTime,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error getting chat session:', error);
    return null;
  }
};
