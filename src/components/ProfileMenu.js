import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Box,
  Text,
  Link,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProfileMenu() {
  const { user, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const handleBookingsClick = () => {
    navigate('/bookings');
  };

  console.log('User object:', user);

  return (
    <Menu zIndex={900}>
      <MenuButton>
        {user ? (
          <Avatar
            size="sm"
            src={user.photoURL}
            name={user.displayName}
          />
        ) : (
          <Box
            bg="white"
            p={2}
            borderRadius="full"
            boxShadow="lg"
            cursor="pointer"
            _hover={{ bg: 'gray.50' }}
          >
            <Box as="span" color="gray.600">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
            </Box>
          </Box>
        )}
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem>
              <Text>{user.displayName}</Text>
            </MenuItem>
            <MenuItem onClick={handleBookingsClick}>
              My Bookings
            </MenuItem>
            <MenuItem as={RouterLink} to="/add-play-space">Add Play Space</MenuItem>
            <MenuItem as={RouterLink} to="/view-play-spaces">View Play Spaces</MenuItem>
            <MenuItem onClick={logout}>
              Logout
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={signInWithGoogle}>
            Sign in with Google
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

export default ProfileMenu;
