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
    console.log('🔍 Starting mechanic search...');
    console.log('📍 User location:', userLocation);
    console.log('🔧 Service type:', serviceType);
    console.log('📏 Max distance:', maxDistance, 'km');

    // Create a bounding box for the search area
    const latDelta = maxDistance / 111; // Roughly 111km per degree latitude
    const lonDelta = maxDistance / (111 * Math.cos(userLocation.latitude * Math.PI / 180));
    
    const minLat = userLocation.latitude - latDelta;
    const maxLat = userLocation.latitude + latDelta;
    const minLon = userLocation.longitude - lonDelta;
    const maxLon = userLocation.longitude + lonDelta;

    console.log('🗺️ Search bounding box:');
    console.log('  Min Lat:', minLat, 'Max Lat:', maxLat);
    console.log('  Min Lon:', minLon, 'Max Lon:', maxLon);

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

    console.log('🔍 Executing Firestore query...');
    const querySnapshot = await getDocs(mechanicsQuery);
    console.log('📊 Query returned', querySnapshot.size, 'documents');

    // Debug: Let's also check if there are ANY mechanics in the database
    const allMechanicsQuery = query(collection(db, 'mechanics'));
    const allMechanicsSnapshot = await getDocs(allMechanicsQuery);
    console.log('📊 Total mechanics in database:', allMechanicsSnapshot.size);
    
    if (allMechanicsSnapshot.size > 0) {
      console.log('📋 All mechanics in database:');
      allMechanicsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`  - ${doc.id}: ${data.firstName} ${data.lastName} (Online: ${data.isOnline}, Available: ${data.isAvailable}, Active: ${data.isActive})`);
      });
    }

    const mechanics: Mechanic[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('👤 Processing mechanic:', doc.id);
      console.log('  Data:', {
        firstName: data.firstName,
        lastName: data.lastName,
        isOnline: data.isOnline,
        isAvailable: data.isAvailable,
        isActive: data.isActive,
        location: data.location,
        specializations: data.specializations,
        preferences: data.preferences
      });
      console.log('  Preferences:', {
        maxDistance: data.preferences?.maxDistance || 'undefined (using default 50)',
        hourlyRate: data.preferences?.hourlyRate || 'undefined'
      });

      const mechanicLocation = data.location;
      
      if (mechanicLocation) {
        console.log('📍 Mechanic location:', mechanicLocation);
        
        // Filter by longitude (Firestore doesn't support multiple range queries easily)
        if (mechanicLocation.longitude >= minLon && mechanicLocation.longitude <= maxLon) {
          console.log('✅ Mechanic within longitude bounds');
          
          // Calculate actual distance
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            mechanicLocation.latitude,
            mechanicLocation.longitude
          );
          console.log('📏 Calculated distance:', distance, 'km');

          // Only include mechanics within maxDistance and their maxDistance preference
          const mechanicMaxDistance = data.preferences?.maxDistance || 50; // Default to 50km if not set
          if (distance <= maxDistance && distance <= mechanicMaxDistance) {
            console.log('✅ Mechanic within distance limits');
            
            // Add mechanic to results (service type is just for display, not filtering)
            console.log('✅ Mechanic added to results');
            
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
          } else {
            console.log('❌ Mechanic outside distance limits');
            console.log('  Max allowed:', maxDistance, 'km');
            console.log('  Mechanic max:', data.preferences?.maxDistance || 50, 'km');
          }
        } else {
          console.log('❌ Mechanic outside longitude bounds');
        }
      } else {
        console.log('❌ Mechanic has no location data');
      }
    });

    console.log('📋 Final results:', mechanics.length, 'mechanics found');
    mechanics.forEach((mechanic, index) => {
      console.log(`  ${index + 1}. ${mechanic.firstName} ${mechanic.lastName} - ${mechanic.distance?.toFixed(1)}km`);
    });

    // Sort by distance and rating, then take top 10
    const sortedMechanics = mechanics
      .sort((a, b) => {
        // Primary sort by distance
        const distanceDiff = (a.distance || 0) - (b.distance || 0);
        if (Math.abs(distanceDiff) < 1) { // If within 1km, sort by rating
          return (b.rating || 0) - (a.rating || 0);
        }
        return distanceDiff;
      })
      .slice(0, 10);

    console.log('🏆 Top 10 mechanics after sorting:');
    sortedMechanics.forEach((mechanic, index) => {
      console.log(`  ${index + 1}. ${mechanic.firstName} ${mechanic.lastName} - ${mechanic.distance?.toFixed(1)}km - Rating: ${mechanic.rating}`);
    });

    return sortedMechanics;

  } catch (error) {
    console.error('❌ Error searching for nearby mechanics:', error);
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
