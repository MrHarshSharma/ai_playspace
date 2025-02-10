import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Button, useToast } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BookingModal from './BookingModal';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';

// Custom marker icons
const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const playSpaceIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Debounce function to limit how often a function can fire
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

// Component to handle map view updates
function MapUpdater({ userLocation }) {
    const map = useMap();
    const isFirstUpdate = React.useRef(true);
    
    const updateMapView = useCallback((position, animate = true) => {
        const zoomLevel = 15;
        if (animate) {
            map.flyTo(position, zoomLevel, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        } else {
            map.setView(position, zoomLevel);
        }
    }, [map]);

    useEffect(() => {
        if (userLocation) {
            const position = [userLocation.lat, userLocation.lng];
            updateMapView(position, !isFirstUpdate.current);
            isFirstUpdate.current = false;
        }
    }, [userLocation, updateMapView]);
    
    return null;
}

function Map({ userLocation, playSpaces }) {
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [debouncedUserLocation, setDebouncedUserLocation] = useState(userLocation);
    const defaultPosition = useMemo(() => [28.6139, 77.2090], []); // Default to Delhi
    const { user, signInWithGoogle } = useAuth();
    const toast = useToast();
    
    // Initial map center
    const center = useMemo(() => {
        return debouncedUserLocation ? [debouncedUserLocation.lat, debouncedUserLocation.lng] : defaultPosition;
    }, [debouncedUserLocation, defaultPosition]);

    const updateLocation = useCallback(debounce((newLocation) => {
        setDebouncedUserLocation(newLocation);
    }, 300), []);

    useEffect(() => {
        if (userLocation) {
            updateLocation(userLocation);
        }
    }, [userLocation, updateLocation]);

    // User location marker and circle
    const UserLocationMarker = useCallback(() => {
        if (!debouncedUserLocation) return null;

        return (
            <>
                <Marker 
                    position={[debouncedUserLocation.lat, debouncedUserLocation.lng]}
                    icon={userIcon}
                >
                    <Popup>
                        <div>
                            <h3>Your Location</h3>
                            <p>Accuracy: ±{Math.round(debouncedUserLocation.accuracy)}m</p>
                        </div>
                    </Popup>
                </Marker>
                
                <Circle
                    center={[debouncedUserLocation.lat, debouncedUserLocation.lng]}
                    radius={debouncedUserLocation.accuracy}
                    pathOptions={{ 
                        color: '#2196F3',
                        fillColor: '#2196F3',
                        fillOpacity: 0.15
                    }}
                />
            </>
        );
    }, [debouncedUserLocation]);

    // Play spaces markers
    const PlaySpaceMarkers = useCallback(() => {
        if (!playSpaces?.length) return null;

        return playSpaces.map((space) => (
            <Marker 
                key={space.id}
                position={[space.location.lat, space.location.lng]}
                icon={playSpaceIcon}
            >
                <Popup>
                    <div style={{ minWidth: '200px' }}>
                        <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            color: '#2D3748'
                        }}>
                            {space.name}
                        </h3>
                        <p style={{ 
                            fontSize: '14px',
                            color: '#4A5568',
                            marginBottom: '4px'
                        }}>
                            <strong>Sport:</strong> {space.sport}
                        </p>
                        <p style={{ 
                            fontSize: '14px',
                            color: '#4A5568',
                            marginBottom: '4px'
                        }}>
                            <strong>Address:</strong> {space.location.address}
                        </p>
                        <p style={{ 
                            fontSize: '14px',
                            color: '#4A5568',
                            marginBottom: '4px'
                        }}>
                            <strong>Available:</strong> {space.availableTime}
                        </p>
                        <p style={{ 
                            fontSize: '14px',
                            color: '#4A5568',
                            marginBottom: '4px'
                        }}>
                            <strong>Price:</strong> {space.price}
                        </p>
                        <p style={{ 
                            fontSize: '14px',
                            color: '#4A5568',
                            marginBottom: '4px'
                        }}>
                            <strong>Distance:</strong> {space.distance.toFixed(1)}km
                        </p>
                        <div style={{ 
                            marginTop: '8px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '4px'
                        }}>
                            {space.facilities.map((facility, index) => (
                                <span key={index} style={{
                                    backgroundColor: '#EDF2F7',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    color: '#4A5568'
                                }}>
                                    {facility}
                                </span>
                            ))}
                        </div>
                        <Button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (auth.currentUser) {
                                    setSelectedSpace(space);
                                    setIsBookingModalOpen(true);
                                } else {
                                    toast({
                                        title: 'Authentication Required',
                                        description: 'Please sign in to book a venue.',
                                        status: 'warning',
                                        duration: 3000,
                                        isClosable: true,
                                    });
                                    try {
                                        await signInWithGoogle();
                                    } catch (error) {
                                        console.error('Sign in error:', error);
                                    }
                                }
                            }}
                            colorScheme="blue"
                            size="sm"
                            mt={3}
                            w="100%"
                        >
                            Book Now
                        </Button>
                    </div>
                </Popup>
            </Marker>
        ));
    }, [playSpaces]);

    return (
        <>
        <MapContainer 
            center={center}
            zoom={15} 
            style={{ height: '100vh', width: '100vw' }}
            zoomControl={false}
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapUpdater userLocation={debouncedUserLocation} />
            <UserLocationMarker />
            <PlaySpaceMarkers />
        </MapContainer>

        {/* Booking Modal */}
        <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => {
                setIsBookingModalOpen(false);
                setSelectedSpace(null);
            }}
            playSpace={selectedSpace}
        />
        </>
    );
}

export default Map;
