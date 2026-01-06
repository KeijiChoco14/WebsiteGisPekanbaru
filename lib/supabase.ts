import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan Key dari Dashboard Supabase kamu
const supabaseUrl = 'https://tezmmhmbyrhqmnimimcp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlem1taG1ieXJocW1uaW1pbWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDg5MTMsImV4cCI6MjA4MDkyNDkxM30.GfO-CAH6Ub-hZADfkxFAFHgFGfyL8uBYib1KZoIUiYU';

export const supabase = createClient(supabaseUrl, supabaseKey);