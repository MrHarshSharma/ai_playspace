// Mock data for play spaces

import { mockPlaySpaces } from "../constants/places";


// Function to calculate distance between two points using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

// Function to get nearby play spaces within a radius
export function getNearbyPlaySpaces(userLat, userLng, radiusKm = 10) {
  // Use mock data directly without adjustments
  const nearbySpaces = mockPlaySpaces.filter(space => {
    const distance = getDistance(userLat, userLng, space.location.lat, space.location.lng);
    return distance <= radiusKm;
  });

  // Return the filtered spaces without sorting
  return nearbySpaces;
}
