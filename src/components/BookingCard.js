import React from 'react';
import { Box, Text, Button, VStack } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const BookingCard = ({ booking, onEdit, onDelete }) => {
    return (
        <Box borderWidth="1px" borderRadius="lg" padding="4" margin="2" boxShadow="md" display="flex" flexDirection="column" justifyContent="space-between">
            <VStack align="start">
                <Text fontWeight="bold" fontSize="lg">{booking.playspace.name}</Text>
                <Text>Date: {booking.requirement.date}</Text>
                <Text>Time: {booking.requirement.time}</Text>
                <Text>Sport: {booking.requirement.sport}</Text>
                <Text>Players Needed: {booking.requirement.players}</Text>
            </VStack>
            <Box display="flex" justifyContent="flex-end" marginTop="4">
                <Button
                    leftIcon={<EditIcon />}
                    onClick={() => onEdit(booking)}
                    colorScheme="blue"
                    borderRadius="full"
                    marginRight="2"
                >
                    Edit
                </Button>
                <Button
                    leftIcon={<DeleteIcon />}
                    onClick={() => onDelete(booking.id)}
                    colorScheme="red"
                    borderRadius="full"
                >
                    Delete
                </Button>
            </Box>
        </Box>
    );
};

export default BookingCard;
