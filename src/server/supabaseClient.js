import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asahhoewkmfzblmbthty.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYWhob2V3a21memJsbWJ0aHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTU0ODYsImV4cCI6MjA1NDc3MTQ4Nn0.l0mapofPyes3ylmpB1GcH1RTKN0HIfVjBL_wwsIzKco';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
