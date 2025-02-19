import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, Text, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { MultiSelect } from 'react-multi-select-component';
import { getPlaySpace, updatePlaySpace } from '../server/api';

function EditPlaySpace() {
    const { id } = useParams();
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

    useEffect(() => {
        const fetchPlaySpace = async () => {
            const { data, error } = await getPlaySpace(id);
            if (error) {
                console.error('Error fetching play space:', error);
                toast({
                    title: "Error",
                    description: "Could not fetch play space data.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
            if (data) {
                setName(data.name);
                setSelectedSports(data.sports.map(sport => ({ value: sport, label: sport })));
                setLocation(data.location);
                setAvailableTimeFrom(data.availableTime.split(' - ')[1]);
                setAvailableTimeTo(data.availableTime.split(' - ')[0]);
                setPrice(data.price);
                setSelectedFacilities(data.facilities.map(facility => ({ value: facility, label: facility })));
            }
        };

        fetchPlaySpace();
    }, [id]);

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
        const { data, error } = await updatePlaySpace(id, playSpaceData);
        if (error) {
            console.error('Error updating data:', error);
            toast({
                title: "Error",
                description: "There was an error updating the playspace.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } else {
            console.log('Data updated successfully:', data);
            toast({
                title: "Success",
                description: "Playspace updated successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate('/view-play-space');
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
                    <Button type="submit" colorScheme="blue">Update Play Space</Button>
                </VStack>
            </form>
        </Box>
    );
}

export default EditPlaySpace;
