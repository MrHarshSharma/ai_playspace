// Mock data for play spaces
const mockPlaySpaces = [
  {
    id: '1',
    name: 'Central Park Tennis',
    sport: 'Tennis',
    location: {
      lat: 28.6129,
      lng: 77.2295,
      address: 'Central Park, Block A'
    },
    availableTime: '6 AM - 10 PM',
    price: '₹0/hour',
    facilities: ['Floodlights', 'Equipment Rental', 'Parking']
  },
  {
    id: '2',
    name: 'SportZone Basketball',
    sport: 'Basketball',
    location: {
      lat: 28.6139,
      lng: 77.2195,
      address: 'SportZone Complex, Sector 15'
    },
    availableTime: '24/7',
    price: '₹0/hour',
    facilities: ['Indoor Court', 'Locker Room', 'Cafe']
  },
  {
    id: '3',
    name: 'Green Field Soccer',
    sport: 'Football',
    location: {
      lat: 28.6159,
      lng: 77.2175,
      address: 'Green Field Arena, Block D'
    },
    availableTime: '5 AM - 11 PM',
    price: '₹0/hour',
    facilities: ['Natural Grass', 'Floodlights', 'Changing Rooms']
  },
  {
    id: '4',
    name: 'Cricket Stadium',
    sport: 'Cricket',
    location: {
      lat: 28.6189,
      lng: 77.2355,
      address: 'Stadium Complex, Sector 20'
    },
    availableTime: '6 AM - 9 PM',
    price: '₹0/hour',
    facilities: ['Cricket Pitch', 'Practice Nets', 'Equipment Rental', 'Pavilion']
  },
  {
    id: '5',
    name: 'Badminton Arena',
    sport: 'Badminton',
    location: {
      lat: 28.6219,
      lng: 77.2405,
      address: 'Indoor Sports Complex, Block F'
    },
    availableTime: '7 AM - 11 PM',
    price: '₹0/hour',
    facilities: ['Indoor Courts', 'Air Conditioning', 'Equipment Shop']
  },
  {
    id: '6',
    name: 'Multi-Sport Complex',
    sport: 'Multiple',
    location: {
      lat: 28.6249,
      lng: 77.2455,
      address: 'Sports City, Sector 25'
    },
    availableTime: '5 AM - 10 PM',
    price: '₹0/hour',
    facilities: ['Multiple Courts', 'Gym', 'Swimming Pool', 'Cafe']
  },
  {
    id: '7',
    name: 'Table Tennis Center',
    sport: 'Table Tennis',
    location: {
      lat: 28.6279,
      lng: 77.2505,
      address: 'Indoor Games Complex, Block H'
    },
    availableTime: '9 AM - 9 PM',
    price: '₹0/hour',
    facilities: ['Professional Tables', 'Training Programs', 'Air Conditioning']
  },
  {
    id: '8',
    name: 'Volleyball Court',
    sport: 'Volleyball',
    location: {
      lat: 28.6309,
      lng: 77.2555,
      address: 'Beach Sports Arena, Sector 30'
    },
    availableTime: '6 AM - 8 PM',
    price: '₹0/hour',
    facilities: ['Sand Court', 'Night Lighting', 'Changing Rooms']
  }
];

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
  // For mock data, we'll adjust the locations relative to user's position
  const adjustedPlaySpaces = mockPlaySpaces.map(space => {
    // Create slight variations in location
    const latOffset = (Math.random() - 0.5) * 0.015; // ~1km variation
    const lngOffset = (Math.random() - 0.5) * 0.015;
    
    return {
      ...space,
      location: {
        ...space.location,
        lat: userLat + latOffset,
        lng: userLng + lngOffset
      },
      distance: getDistance(
        userLat,
        userLng,
        userLat + latOffset,
        userLng + lngOffset
      )
    };
  });

  // Filter spaces within the radius and sort by distance
  return adjustedPlaySpaces
    .filter(space => space.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}
