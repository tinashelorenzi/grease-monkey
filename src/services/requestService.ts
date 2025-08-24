import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Mechanic, UserLocation } from './mechanicService';

export interface ServiceRequest {
  id: string;
  requestId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  mechanicId: string;
  mechanicName: string;
  serviceType: string;
  location: UserLocation;
  address?: string;
  description?: string;
  status: 'pending' | 'accepted' | 'declined' | 'quoted' | 'completed' | 'cancelled';
  createdAt: number;
  updatedAt: number;
  acceptedAt?: number;
  estimatedArrival?: number;
  actualArrival?: number;
  completedAt?: number;
  price?: number;
  notes?: string;
  quoteAmount?: number;
  quoteDescription?: string;
  quotedAt?: number;
}

export interface CreateRequestData {
  customerId: string;
  customerName: string;
  customerPhone?: string;
  mechanicId: string;
  mechanicName: string;
  serviceType: string;
  location: UserLocation;
  address?: string;
  description?: string;
}

// Create a new service request
export const createServiceRequest = async (requestData: CreateRequestData): Promise<string> => {
  try {
    console.log('📝 createServiceRequest called with data:', requestData);
    console.log('📝 Creating service request...', requestData);
    
    const timestamp = Date.now();
    const requestId = `req_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('📝 Request data to be saved:', {
      requestId,
      timestamp,
      requestData
    });
    
    const request: Omit<ServiceRequest, 'id'> = {
      customerId: requestData.customerId,
      customerName: requestData.customerName,
      customerPhone: requestData.customerPhone,
      mechanicId: requestData.mechanicId,
      mechanicName: requestData.mechanicName,
      serviceType: requestData.serviceType,
      location: requestData.location,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Add optional fields only if they have values
    if (requestData.address) {
      (request as any).address = requestData.address;
    }
    if (requestData.description) {
      (request as any).description = requestData.description;
    }

    // Clean the request object by removing any undefined values
    const cleanRequest = Object.fromEntries(
      Object.entries(request).filter(([_, value]) => value !== undefined)
    );

    console.log('🧹 Cleaned request data:', cleanRequest);

    // Add to main requests collection
    console.log('📝 Adding to main requests collection...');
    const requestsRef = collection(db, 'requests');
    const mainRequestDoc = await addDoc(requestsRef, {
      ...cleanRequest,
      requestId: requestId, // Include the requestId in the document
    });
    console.log('✅ Added to main requests collection with ID:', mainRequestDoc.id);

    // Add to mechanic's requests subcollection for the mechanics app
    console.log('📝 Adding to mechanic requests subcollection...');
    const mechanicRequestsRef = collection(db, 'mechanics', requestData.mechanicId, 'requests');
    const mechanicRequestDoc = await addDoc(mechanicRequestsRef, {
      ...cleanRequest,
      requestId: requestId,
    });
    console.log('✅ Added to mechanic requests subcollection with ID:', mechanicRequestDoc.id);

    console.log('✅ Service request created successfully with ID:', requestId);
    return requestId;
    
  } catch (error) {
    console.error('❌ Error creating service request:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    throw new Error('Failed to create service request');
  }
};

// Listen to request status changes
export const listenToRequestStatus = (
  requestId: string,
  onStatusChange: (request: ServiceRequest | null) => void
) => {
  console.log('👂 Listening to request status for:', requestId);
  
  const requestsRef = collection(db, 'requests');
  const q = query(requestsRef, where('requestId', '==', requestId), limit(1));
  
  return onSnapshot(q, (snapshot) => {
    console.log('📊 Snapshot received, empty:', snapshot.empty, 'size:', snapshot.size);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      console.log('📋 Raw document data:', data);
      
      const request: ServiceRequest = {
        id: doc.id,
        ...data,
      } as ServiceRequest;
      
      console.log('📊 Request status update:', request.status);
      console.log('📊 Full request object:', request);
      onStatusChange(request);
    } else {
      console.log('❌ Request not found in main collection');
      // Try to find in mechanic's subcollection as fallback
      console.log('🔍 Trying to find request in mechanic subcollections...');
      onStatusChange(null);
    }
  }, (error) => {
    console.error('❌ Error listening to request status:', error);
    onStatusChange(null);
  });
};

// Update request status
export const updateRequestStatus = async (
  requestId: string,
  status: ServiceRequest['status'],
  additionalData?: Partial<ServiceRequest>
) => {
  try {
    console.log('🔄 Updating request status:', requestId, 'to', status);
    
    const requestsRef = collection(db, 'requests');
    const q = query(requestsRef, where('requestId', '==', requestId), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docRef = doc(db, 'requests', snapshot.docs[0].id);
      const updateData: any = {
        status,
        updatedAt: Date.now(),
        ...additionalData,
      };
      
      // Add timestamp based on status
      if (status === 'accepted') {
        updateData.acceptedAt = Date.now();
      } else if (status === 'completed') {
        updateData.completedAt = Date.now();
      }
      
      await updateDoc(docRef, updateData);
      console.log('✅ Request status updated successfully');
    } else {
      throw new Error('Request not found');
    }
    
  } catch (error) {
    console.error('❌ Error updating request status:', error);
    throw new Error('Failed to update request status');
  }
};

// Get request by ID
export const getRequestById = async (requestId: string): Promise<ServiceRequest | null> => {
  try {
    const requestsRef = collection(db, 'requests');
    const q = query(requestsRef, where('requestId', '==', requestId), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      } as ServiceRequest;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error getting request by ID:', error);
    throw new Error('Failed to get request');
  }
};

// Delete service request from both collections
export const deleteServiceRequest = async (requestId: string, mechanicId: string): Promise<void> => {
  try {
    console.log('🗑️ Starting request deletion...');
    console.log('📋 Request ID:', requestId);
    console.log('🔧 Mechanic ID:', mechanicId);

    // Find the document in main requests collection
    const requestsRef = collection(db, 'requests');
    const q = query(requestsRef, where('requestId', '==', requestId), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      // Delete from main requests collection
      console.log('📝 Deleting from main requests collection...');
      const mainRequestRef = doc(db, 'requests', snapshot.docs[0].id);
      await deleteDoc(mainRequestRef);
      console.log('✅ Deleted from main requests collection');
    } else {
      console.log('⚠️ Request not found in main collection');
    }

    // Delete from mechanic's requests subcollection
    console.log('📝 Deleting from mechanic requests subcollection...');
    const mechanicRequestRef = doc(db, 'mechanics', mechanicId, 'requests', requestId);
    await deleteDoc(mechanicRequestRef);
    console.log('✅ Deleted from mechanic requests subcollection');

    console.log('🎉 Request deletion completed successfully');
  } catch (error) {
    console.error('❌ Error deleting service request:', error);
    throw new Error('Failed to delete service request');
  }
};
