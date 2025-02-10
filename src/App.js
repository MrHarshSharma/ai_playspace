import React, { useState, useEffect, useCallback } from 'react';
import { Box, VStack, Container, Text, useToast, Spinner, Center, Input } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import ProfileMenu from './components/ProfileMenu';
import Map from './components/Map';
import { getNearbyPlaySpaces } from './services/playSpaceService';

function App() {
  // Handle mobile viewport height
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
  const [hasShownSavedLocationToast, setHasShownSavedLocationToast] = useState(false);
  const [userLocation, setUserLocation] = useState(() => {
    // Try to get initial location from localStorage
    const savedLocation = localStorage.getItem('userLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });
  const [playSpaces, setPlaySpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(!userLocation);
  const [notificationShown, setNotificationShown] = useState(false);
  const toast = useToast();

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const updatePlaySpaces = useCallback(debounce(() => {
    if (userLocation?.lat && userLocation?.lng) {
      const nearbySpaces = getNearbyPlaySpaces(userLocation.lat, userLocation.lng, 10);
      setPlaySpaces(nearbySpaces);

      // Show toast if spaces are found and notification hasn't been shown
      if (nearbySpaces.length > 0 && !notificationShown) {
        toast({
          title: 'Play Spaces Found',
          description: `Found ${nearbySpaces.length} play spaces near you`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setNotificationShown(true); // Set the flag to true after showing the notification
      }
    }
  }, 300), [userLocation]);

  useEffect(() => {
    updatePlaySpaces(); // Call updatePlaySpaces only when userLocation changes
  }, [userLocation]);

  // Save location to localStorage whenever it updates
  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
    }
  }, [userLocation]);

  useEffect(() => {
    let watchId = null;

    // Function to handle successful location updates
    const handleSuccess = (position) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().getTime() // Add timestamp for freshness check
      };
      setUserLocation(newLocation);
      setIsLoading(false);
    };

    // Function to handle location errors
    const handleError = (error) => {
      console.error('Location error:', error);
      setIsLoading(false);

      // Try to get location from localStorage if available
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation && !hasShownSavedLocationToast) {
        const parsedLocation = JSON.parse(savedLocation);
        const locationAge = new Date().getTime() - parsedLocation.timestamp;
        const locationAgeMinutes = Math.round(locationAge / (1000 * 60));

        setUserLocation(parsedLocation);
        toast({
          title: 'Using Saved Location',
          description: `Using your last known location from ${locationAgeMinutes} minutes ago`,
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
        setHasShownSavedLocationToast(true);
      } else {
        toast({
          title: 'Location Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setIsLoading(false);
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        setUserLocation(JSON.parse(savedLocation));
      }
      toast({
        title: 'Browser Not Supported',
        description: 'Using last known location',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simple options for geolocation
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0
    };

    // Start watching position
    watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    // Cleanup function
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [toast]); // Only re-run if toast changes

  return (
    <AuthProvider>
      <Box h="100vh" w="100vw" position="relative">
        <Box position="fixed" top={0} left={0} right={0} bottom={0} overflow="hidden" bg="gray.50">
          <Box w="100%" h="100%" position="relative">
            <Map 
              userLocation={userLocation} 
              playSpaces={playSpaces}
            />
            {isLoading && !userLocation && (
              <Center
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="rgba(0, 0, 0, 0.7)"
                zIndex="overlay"
              >
                <VStack spacing={4}>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                  <Text color="white" fontWeight="medium">
                    Getting your location...
                  </Text>
                </VStack>
              </Center>
            )}
          </Box>

          <Box 
            position="fixed" 
            top="env(safe-area-inset-top, 16px)"
            left={4} 
            right={4} 
            p={2} 
            zIndex={1000}
            display="flex"
            alignItems="center"
            gap={3}
          >
            {/* Search Bar */}
            <Box 
              flex={1}
              bg="white" 
              borderRadius="full" 
              boxShadow="lg"
              display="flex"
              alignItems="center"
              px={4}
              py={2}
            >
              <Box as="span" mr={3} color="gray.500">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </Box>
              <Input
                variant="unstyled"
                placeholder="Search for sports venues..."
                _placeholder={{ color: 'gray.500' }}
                fontSize="sm"
              />
            </Box>

            {/* Profile Menu */}
            <ProfileMenu />
          </Box>
        </Box>
      </Box>
    </AuthProvider>
  );
}

export default App;
