import React, { useEffect, useState } from 'react';
import { supabase } from '../server/supabaseClient';
import { Box, Heading, VStack, Text, Spinner, Alert, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function ViewPlaySpaces() {
    const [playSpaces, setPlaySpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaySpaces = async () => {
            const { data, error } = await supabase
                .from('playspaces')
                .select('*');
            if (error) {
                setError(error);
            } else {
                setPlaySpaces(data);
            }
            setLoading(false);
        };

        fetchPlaySpaces();
    }, []);

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('playspaces')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting play space:', error);
        } else {
            setPlaySpaces(playSpaces.filter(playSpace => playSpace.id !== id));
        }
    };

    if (loading) return <Spinner />;
    if (error) return <Alert status="error">Error fetching play spaces: {error.message}</Alert>;

    return (
        <Box maxW="container.md" mx="auto" p={4}>
            <Heading mb={4}>Play Spaces</Heading>
            <Button as={Link} to="/add-play-space" colorScheme="blue" mb={4}>Add Play Space</Button>
            <VStack spacing={4} align="stretch">
                {playSpaces.map((playSpace) => (
                    <Box key={playSpace.id} p={4} borderWidth={1} borderRadius="md">
                        <Heading size="md">{playSpace.name}</Heading>
                        <Text>Sports: {playSpace.sports.join(', ')}</Text>
                        <Text>Location: {playSpace.location.address}</Text>
                        <Text>Available Time: {playSpace.availableTime}</Text>
                        <Text>Price: {playSpace.price}</Text>
                        <Text>Facilities: {playSpace.facilities.join(', ')}</Text>
                        <Button as={Link} to={`/edit-play-space/${playSpace.id}`} colorScheme="yellow" mr={2}>Edit</Button>
                        <Button onClick={() => handleDelete(playSpace.id)} colorScheme="red">Delete</Button>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}

export default ViewPlaySpaces;
