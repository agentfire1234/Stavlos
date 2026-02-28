import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Public client for browser use (uses Anon Key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server use ONLY (uses Service Role Key)
// BUG 012 FIX: Strictly separate admin client to prevent service key leakage.
// This should never be imported into a client component.
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null

if (typeof window === 'undefined' && !supabaseServiceKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is missing in server environment!')
}
