import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc,
  orderBy, 
  limit,
  GeoPoint,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Mechanic {
  id: string;
  firstName: string;
  lastName: string;
  businessName: string;
  rating: number;
  totalJobs: number;
  yearsOfExperience: number;
  specializations: string[];
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  };
  preferences: {
    hourlyRate: number;
    maxDistance: number;
  };
  isOnline: boolean;
  isAvailable: boolean;
  distance?: number; // Calculated distance from user
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Get user's current location
export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    // For React Native, we'll need to implement proper geolocation
    // For now, return a mock location (Johannesburg, South Africa)
    // TODO: Implement proper React Native geolocation
    console.log('Getting current location...');
    
    // Mock location for development
    resolve({
      latitude: -26.2041, // Johannesburg latitude
      longitude: 28.0473, // Johannesburg longitude
      accuracy: 100,
    });
    
    // TODO: Replace with actual React Native geolocation
    // import * as Location from 'expo-location';
    // 
    // Location.requestForegroundPermissionsAsync()
    //   .then(({ status }) => {
    //     if (status !== 'granted') {
    //       reject(new Error('Location permission denied'));
    //       return;
    //     }
    //     
    //     return Location.getCurrentPositionAsync({
    //       accuracy: Location.Accuracy.High,
    //     });
    //   })
    //   .then((location) => {
    //     if (location) {
    //       resolve({
    //         latitude: location.coords.latitude,
    //         longitude: location.coords.longitude,
    //         accuracy: location.coords.accuracy,
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     reject(new Error(`Geolocation error: ${error.message}`));
    //   });
  });
};

// Search for nearby mechanics
export const searchNearbyMechanics = async (
  userLocation: UserLocation,
  serviceType?: string,
  maxDistance: number = 50 // Default 50km radius
): Promise<Mechanic[]> => {
  try {
    // Create a bounding box for the search area
    const latDelta = maxDistance / 111; // Roughly 111km per degree latitude
    const lonDelta = maxDistance / (111 * Math.cos(userLocation.latitude * Math.PI / 180));
    
    const minLat = userLocation.latitude - latDelta;
    const maxLat = userLocation.latitude + latDelta;
    const minLon = userLocation.longitude - lonDelta;
    const maxLon = userLocation.longitude + lonDelta;

    // Build the query
    let mechanicsQuery = query(
      collection(db, 'mechanics'),
      where('isOnline', '==', true),
      where('isAvailable', '==', true),
      where('isActive', '==', true),
      where('location.latitude', '>=', minLat),
      where('location.latitude', '<=', maxLat),
      orderBy('rating', 'desc'),
      limit(20) // Get more than 10 to filter by longitude and distance
    );

    const querySnapshot = await getDocs(mechanicsQuery);
    const mechanics: Mechanic[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const mechanicLocation = data.location;
      
      if (mechanicLocation) {
        // Filter by longitude (Firestore doesn't support multiple range queries easily)
        if (mechanicLocation.longitude >= minLon && mechanicLocation.longitude <= maxLon) {
          // Calculate actual distance
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            mechanicLocation.latitude,
            mechanicLocation.longitude
          );

          // Only include mechanics within maxDistance and their maxDistance preference
          if (distance <= maxDistance && distance <= data.preferences?.maxDistance) {
            // Filter by service type if specified
            if (!serviceType || data.specializations?.includes(serviceType)) {
              mechanics.push({
                id: doc.id,
                firstName: data.firstName,
                lastName: data.lastName,
                businessName: data.businessName,
                rating: data.rating || 0,
                totalJobs: data.totalJobs || 0,
                yearsOfExperience: data.yearsOfExperience || 0,
                specializations: data.specializations || [],
                location: mechanicLocation,
                preferences: data.preferences || { hourlyRate: 0, maxDistance: 50 },
                isOnline: data.isOnline,
                isAvailable: data.isAvailable,
                distance: distance,
              });
            }
          }
        }
      }
    });

    // Sort by distance and rating, then take top 10
    return mechanics
      .sort((a, b) => {
        // Primary sort by distance
        const distanceDiff = (a.distance || 0) - (b.distance || 0);
        if (Math.abs(distanceDiff) < 1) { // If within 1km, sort by rating
          return (b.rating || 0) - (a.rating || 0);
        }
        return distanceDiff;
      })
      .slice(0, 10);

  } catch (error) {
    console.error('Error searching for nearby mechanics:', error);
    throw new Error('Failed to search for nearby mechanics');
  }
};

// Get mechanic by ID
export const getMechanicById = async (mechanicId: string): Promise<Mechanic | null> => {
  try {
    const docRef = doc(db, 'mechanics', mechanicId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        firstName: data.firstName,
        lastName: data.lastName,
        businessName: data.businessName,
        rating: data.rating || 0,
        totalJobs: data.totalJobs || 0,
        yearsOfExperience: data.yearsOfExperience || 0,
        specializations: data.specializations || [],
        location: data.location,
        preferences: data.preferences || { hourlyRate: 0, maxDistance: 50 },
        isOnline: data.isOnline,
        isAvailable: data.isAvailable,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting mechanic by ID:', error);
    throw new Error('Failed to get mechanic details');
  }
};
