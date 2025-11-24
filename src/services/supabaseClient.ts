import { createClient } from '@supabase/supabase-js';

// TRÊN MÁY TÍNH (VITE): Dùng import.meta.env.VITE_...
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return (
    supabaseUrl && 
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseAnonKey && 
    supabaseAnonKey !== 'placeholder-key'
  );
};