import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

function BookingModal({ isOpen, onClose, playSpace }) {
  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px)'
    />
  );
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookingData = {
      playSpaceId: playSpace.id,
      date: formData.get('date'),
      time: formData.get('time'),
      players: formData.get('players'),
      sport: formData.get('sport')
    };

    // Here you would typically make an API call to save the booking
    console.log('Booking data:', bookingData);
    
    toast({
      title: 'Booking Successful!',
      description: `You've booked ${playSpace.name} for ${bookingData.date} at ${bookingData.time}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    onClose();
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      isCentered
    >
      <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(10px)'
      />
      <ModalContent
        mx={6}
        my={4}
        p={6}
        borderRadius="xl"
        boxShadow="2xl"
        bg="white"
      >
        <ModalHeader>Book {playSpace?.name}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  name="date"
                  type="date"
                  min={today}
                  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 30 days from now
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Time</FormLabel>
                <Select name="time">
                  <option value="06:00">6:00 AM</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Number of Players</FormLabel>
                <NumberInput min={1} max={30} defaultValue={2}>
                  <NumberInputField name="players" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Sport</FormLabel>
                <Select name="sport" defaultValue={playSpace?.sport}>
                  <option value="Tennis">Tennis</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Football">Football</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Cricket">Cricket</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Book Now
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default BookingModal;
