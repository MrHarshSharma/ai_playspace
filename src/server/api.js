import { supabase } from './supabaseClient';

// Function to store Google Sign-In user
export const storeGoogleUser = async (user) => {
    const { data, error } = await supabase
        .from('users')
        .insert([
            { id: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL, created_at: new Date() }
        ]);

    if (error) {
        console.error('Error storing user:', error);
        return null;
    }
    return data;
};

// Function to get user by email
export const getUserByEmail = async (email) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single(); // Get a single user

    if (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
    
    return data; // Return the user data if found
};

// Function to get user by email

