import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Button, useToast, Spinner } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BookingModal from './BookingModal';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../server/supabaseClient';
import { saveBooking, fetchPlaySpaces } from '../server/api';

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
    
    const updateMapView = useCallback((position) => {
        const zoomLevel = 15;
        map.setView(position, zoomLevel);
    }, [map]);

    useEffect(() => {
        if (userLocation) {
            const position = [userLocation.lat, userLocation.lng];
            updateMapView(position);
            isFirstUpdate.current = false;
        }
    }, [userLocation]);
    
    return null;
}

function Map({ userLocation }) {
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [pendingSpaceId, setPendingSpaceId] = useState(null);
    const defaultPosition = useMemo(() => [28.6139, 77.2090], []); // Default to Delhi
    const { user, signInWithGoogle } = useAuth();
    const isAuthenticated = !!user;
    const toast = useToast();
    const [playSpaces, setPlaySpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   

    // Initial map center
    const center = useMemo(() => {
        return userLocation ? [userLocation.lat, userLocation.lng] : defaultPosition;
    }, [userLocation, defaultPosition]);

    // Store markers in state
    const markers = useMemo(() => {
        return playSpaces.map(space => {
            console.log(`Rendering marker for ${space.name} at coordinates: ${space.location.lat}, ${space.location.lng}`);
            return (
                <Marker 
                    key={space.id} 
                    position={{ lat: parseFloat(space.location.lat), lng: parseFloat(space.location.lng) }} 
                    icon={playSpaceIcon}
                >
                    <Popup>
                        <div style={{ minWidth: '200px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#2D3748' }}>
                                {space.name}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#4A5568', marginBottom: '4px' }}>
                                <strong>Sport:</strong> {space?.sports?.map((sport) => sport).join(', ')}
                            </p>
                            <p style={{ fontSize: '14px', color: '#4A5568', marginBottom: '4px' }}>
                                <strong>Address:</strong> {space.location.address}
                            </p>
                            <p style={{ fontSize: '14px', color: '#4A5568', marginBottom: '4px' }}>
                                <strong>Available:</strong> {space.availableTime}
                            </p>
                            <Button colorScheme='teal' size='sm' onClick={() => handleBook(space.id)}>Book</Button>
                        </div>
                    </Popup>
                </Marker>
            );
        });
    }, [playSpaces]);

    // User location marker and circle
    const UserLocationMarker = useCallback(() => {
        if (!userLocation) return null;
        return (
            <>
                <Marker 
                    position={[userLocation.lat, userLocation.lng]}
                    icon={userIcon}
                >
                    <Popup>
                        <div>
                            <h3>Your Location</h3>
                            <p>Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
                        </div>
                    </Popup>
                </Marker>
                
                <Circle
                    center={[userLocation.lat, userLocation.lng]}
                    radius={userLocation.accuracy}
                    pathOptions={{ 
                        color: '#2196F3',
                        fillColor: '#2196F3',
                        fillOpacity: 0.15
                    }}
                />
            </>
        );
    }, [userLocation]);

    const handleBook = (spaceId) => {
        if (!isAuthenticated) {
            setPendingSpaceId(spaceId); 
            signInWithGoogle(); 
        } else {
            const space = playSpaces.find(space => space.id === spaceId);
            setSelectedSpace(space);
            setIsBookingModalOpen(true);
        }
    };

    useEffect(() => {
        if (isAuthenticated && pendingSpaceId) {
            const space = playSpaces.find(space => space.id === pendingSpaceId);
            setSelectedSpace(space);
            setIsBookingModalOpen(true);
            setPendingSpaceId(null); 
        }
    }, [isAuthenticated, pendingSpaceId, playSpaces]);

   

    const [loadingBooking, setLoadingBooking] = useState(false);

    const handleSubmit = async (formData, onClose) => {
        setLoadingBooking(true); 
        const userId = user.id ? user.id : user.uid; 
        const playSpace = selectedSpace
        const requirement = {...formData}
        

        try {
            const result = await saveBooking(userId, playSpace, requirement);
            console.log('Booking saved:', result);
            toast({
                title: 'Booking Successful!',
                description: `You've booked ${playSpace.name} for ${formData.date} at ${formData.time}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
        } catch (error) {
            console.error('Error saving booking:', error);
            toast({
                title: 'Booking Failed!',
                description: 'There was an error saving your booking. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
        } finally {
            setLoadingBooking(false); 
            onClose(); 
        }
    };

    useEffect(() => {
        const fetchPlaySpacesData = async () => {
            const { data, error } = await fetchPlaySpaces();
            if (error) {
                setError(error);
            } else {
                setPlaySpaces(data);
            }
            setLoading(false);
        };

        fetchPlaySpacesData();
    }, []);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="xl" thickness="2px" speed="0.65s" color="blue.500" />
    </div>;
    if (error) return <div>Error fetching play spaces: {error.message}</div>;

    return (
        <>
        <MapContainer 
            center={center}
            zoom={13} 
            style={{ height: '100vh', width: '100%' }}
            zoomControl={true}
            attributionControl={false}
            scrollWheelZoom={true}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* <MapUpdater userLocation={userLocation} /> */}
            <UserLocationMarker />
            {markers}
        </MapContainer>

        {/* Booking Modal */}
        <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            playSpace={selectedSpace}
            handleSubmit={(formData) => handleSubmit(formData, () => setIsBookingModalOpen(false))}
            loading={loadingBooking}
        />
        </>
    );
}

export default Map;
