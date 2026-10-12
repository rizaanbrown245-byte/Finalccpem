import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
const cleanSupabaseUrl = rawSupabaseUrl
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');

const supabasePublishableKey = (
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ||
  ''
);

export const isSupabaseConfigured = Boolean(
  cleanSupabaseUrl &&
  supabasePublishableKey &&
  cleanSupabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL' &&
  !cleanSupabaseUrl.includes('placeholder')
);

// Fallback to avoid fatal initialization errors when environment variables have not been configured yet
const safeUrl = isSupabaseConfigured ? cleanSupabaseUrl : 'https://placeholder-project.supabase.co';
const safeKey = isSupabaseConfigured ? supabasePublishableKey : 'placeholder-anon-key';

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const STORAGE_BUCKET = 'community-images';
export default supabase;
