import { createBrowserClient, isBrowser, parseCookieHeader } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import { building } from '$app/environment';

const supabaseUrl = env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!building && (!supabaseUrl || !supabaseAnonKey)) {
    throw new Error('Supabase environment variables missing. Please check your .env file.');
}

// Global client for browser usage
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

