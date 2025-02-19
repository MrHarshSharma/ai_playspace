import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from 'react-multi-select-component';
import { supabase } from '../server/supabaseClient';
import { insertPlaySpace } from '../server/api';

function AddPlaySpace() {
    const [name, setName] = useState('');
    const [sports, setSelectedSports] = useState([]);
    const [location, setLocation] = useState({ lat: '', lng: '', address: '' });
    const [availableTimeFrom, setAvailableTimeFrom] = useState('');
    const [availableTimeTo, setAvailableTimeTo] = useState('');
    const [price, setPrice] = useState('');
    const [facilities, setSelectedFacilities] = useState([]);
    const navigate = useNavigate();
    const toast = useToast();

    const sportsOptions = [
        { value: 'Football', label: 'Football' },
        { value: 'Basketball', label: 'Basketball' },
        { value: 'Tennis', label: 'Tennis' },
        { value: 'Badminton', label: 'Badminton' },
    ];

    const facilitiesOptions = [
        { value: 'Sand Court', label: 'Sand Court' },
        { value: 'Night Lighting', label: 'Night Lighting' },
        { value: 'Changing Rooms', label: 'Changing Rooms' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const availableTime = `${availableTimeTo} - ${availableTimeFrom}`;
        const playSpaceData = { 
            name, 
            sports: sports.map(sport => sport.value), 
            location, 
            availableTime, 
            price, 
            facilities: facilities.map(facility => facility.value) 
        };
        const { data, error } = await insertPlaySpace(playSpaceData);
        if (error) {
            console.error('Error inserting data:', error);
            toast({
                title: "Error",
                description: "There was an error inserting the playspace.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } else {
            console.log('Data inserted successfully:', data);
            toast({
                title: "Success",
                description: "Playspace inserted successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

        }
    };

    return (
        <Box maxW="container.sm" mx="auto" p={4} overflowY="auto" maxHeight="100vh">
            <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Available Time</FormLabel>
                        <Box display="flex" gap={4}>
                            <Input type="time" value={availableTimeFrom} onChange={(e) => setAvailableTimeFrom(e.target.value)} />
                            <Text as="span">to</Text>
                            <Input type="time" value={availableTimeTo} onChange={(e) => setAvailableTimeTo(e.target.value)} />
                        </Box>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Sport</FormLabel>
                        <MultiSelect 
                            options={sportsOptions} 
                            value={sports} 
                            onChange={(selectedOptions) => setSelectedSports(selectedOptions)} 
                            labelledBy="Select sports" 
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Location</FormLabel>
                        <Input placeholder="Latitude" value={location.lat} onChange={(e) => setLocation({ ...location, lat: e.target.value })} />
                        <Input placeholder="Longitude" value={location.lng} onChange={(e) => setLocation({ ...location, lng: e.target.value })} />
                        <Input placeholder="Address" value={location.address} onChange={(e) => setLocation({ ...location, address: e.target.value })} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Price</FormLabel>
                        <Input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Facilities</FormLabel>
                        <MultiSelect 
                            options={facilitiesOptions} 
                            value={facilities} 
                            onChange={(selectedOptions) => setSelectedFacilities(selectedOptions)} 
                            labelledBy="Select facilities" 
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="blue">Add Play Space</Button>
                </VStack>
            </form>
        </Box>
    );
}

export default AddPlaySpace;
