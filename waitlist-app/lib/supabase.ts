import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Use anon key for client-side/public access, service role for server-side
const keyToUse = supabaseServiceKey || supabaseAnonKey

if (typeof window === 'undefined' && !supabaseServiceKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is missing in server environment!')
}

export const supabase = createClient(
    supabaseUrl,
    keyToUse
)
