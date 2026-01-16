import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zrwahwgwuupvjcsjakom.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd2Fod2d3dXVwdmpjc2pha29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTYyMzcsImV4cCI6MjA4MzYzMjIzN30.LA9fP_7zS32HLsbhV63AZbYDrR3xnEwFIY7e5S_LgLg';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
