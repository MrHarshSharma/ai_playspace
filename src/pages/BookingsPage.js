import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Container, 
  Spinner, 
  Center, 
  IconButton, 
  Input,
  Spacer,
  Button,

} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import { fetchBookings, deleteBooking } from '../server/api';
import { supabase } from '../server/supabaseClient';
import BookingCard from '../components/BookingCard';
import ProfileMenu from '../components/ProfileMenu';
import { useNavigate } from 'react-router-dom';

function BookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      setIsLoading(true);
      try {
        if (user && user.uid) { 
          const data = await fetchBookings(user.uid);
          setBookings(data);
        } else {
          console.warn('User UID is undefined');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getBookings(); 
  }, [user]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBookings = bookings.filter((booking) => 
    booking.playspace.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (booking) => {
    // Implement edit logic (e.g., open a modal with the booking details)
    console.log('Edit booking:', booking);
  };

  const handleDelete = async (bookingId) => {
    try {
      await deleteBooking(bookingId);

      // Remove the deleted booking from the state
      setBookings((prevBookings) => prevBookings.filter(booking => booking.id !== bookingId));
      console.log(`Deleted booking with ID: ${bookingId}`);
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  if (!user) {
    return (
      <Center height="100vh">
        <Text>Please log in to view your bookings</Text>
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
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
        {/* Back Button */}
        <IconButton 
          icon={<ChevronLeftIcon />} 
          aria-label="Back" 
          size="sm"
          onClick={() => navigate(-1)} 
          marginRight="2" 
          borderRadius="full" 
          border="2px solid #d2d2d2" 
        />
        {/* Search Bar */}
        <Box 
          flex={1}
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
            placeholder="Search for booked venues..."
            _placeholder={{ color: 'gray.500' }}
            fontSize="sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Box>

        <ProfileMenu />
      </Box>
      {/* <Heading>My Bookings</Heading> */}
      <Spacer padding={4}/>
      {filteredBookings.length === 0 ? (
        <Text>You have no bookings yet.</Text>
      ) : (
        <Box overflowY="auto" flex="1" height="calc(100vh - 200px)" maxHeight="90vh">
          {filteredBookings.map((booking) => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </Box>
      )}
    </Container>
  );
}

export default BookingsPage;
