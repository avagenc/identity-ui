import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import { building } from '$app/environment';

const supabaseUrl = env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!building && (!supabaseUrl || !supabaseAnonKey)) {
    throw new Error('Supabase environment variables missing. Please check your .env file.');
}

// During build time, provide a placeholder URL to prevent createClient from throwing
// This allows the build to complete without needing actual secrets
const urlToUse = building ? 'https://placeholder.supabase.co' : supabaseUrl;
const keyToUse = building ? 'placeholder-key' : supabaseAnonKey;

export const supabase = createClient(urlToUse, keyToUse);
