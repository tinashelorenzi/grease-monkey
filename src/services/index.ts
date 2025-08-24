export { authService } from './authService';
export { auth, db } from './firebase';
export type { UserProfile, RegisterData, LoginData } from './authService';
export { searchNearbyMechanics, getCurrentLocation } from './mechanicService';
export type { Mechanic, UserLocation } from './mechanicService';
export { createServiceRequest, listenToRequestStatus, updateRequestStatus, deleteServiceRequest } from './requestService';
export type { ServiceRequest, CreateRequestData } from './requestService';
export { findOrCreateChatSession, sendMessage, listenToMessages, markMessagesAsRead, getChatSessionByRequestId } from './chatService';
export type { ChatMessage, ChatSession } from './chatService';
