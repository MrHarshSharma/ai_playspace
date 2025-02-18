import { supabase } from './supabaseClient';

// Function to store Google Sign-In user
export const storeGoogleUser = async (user) => {
    try {
        // First, check if user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

        // If user exists, return the existing user
        if (existingUser) {
            console.log('User already exists:', existingUser);
            return existingUser;
        }

        // If there's an error during fetch (other than no rows), log and throw
        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking user existence:', fetchError);
            throw fetchError;
        }

        // If no user exists, create a new user
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([
                { 
                    id: user.uid, 
                    email: user.email, 
                    displayName: user.displayName, 
                    photoURL: user.photoURL, 
                    created_at: new Date() 
                }
            ])
            .select();

        if (insertError) {
            console.error('Error creating new user:', insertError);
            throw insertError;
        }

        console.log('New user created:', newUser[0]);
        return newUser[0];
    } catch (error) {
        console.error('User storage failed:', error);
        // Provide a user-friendly error message
        throw new Error('Unable to process user profile. Please try again.');
    }
};

// Function to get user by email
export const getUserByEmail = async (email) => {
    try {
        // Validate email input
        if (!email) {
            throw new Error('Email is required');
        }

        // Debugging log to check the exact email value
        console.log('Searching for user with email:', email);

        // Fetch user by email
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.trim())  // Trim any whitespace
            .single();

        // Handle no user found
        if (error) {
            if (error.code === 'PGRST116') {
                console.log(`No user found with email: ${email}`);
                return null;
            }
            console.error('Supabase error:', error);
            throw error;
        }

        // Log and return user data
        console.log('User found:', data);
        return data;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};

// Function to save booking data
export const saveBooking = async (userId, playSpace, requirement) => {
    const { data, error } = await supabase
        .from('bookings')
        .insert(
            {
                userId: userId,
                playspace: playSpace,
                requirement: requirement,
                status: 'pending',

            },
        );

    if (error) {
        console.error('Error saving booking:', error);
        throw error;
    }
    return data;
};

// Function to fetch bookings
export const fetchBookings = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('userId', userId); // Match user ID

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

// Function to delete booking
export const deleteBooking = async (bookingId) => {
    try {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        if (error) throw error;

        return true; // Indicate successful deletion
    } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
    }
};
