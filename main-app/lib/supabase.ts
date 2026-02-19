import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for public access (Subject to RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for admin access (Bypasses RLS - Use carefully)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Separate client for reading Waitlist data (if cross-project)
// If waitlist is in same project, use supabaseAdmin
const waitlistUrl = process.env.WAITLIST_SUPABASE_URL || supabaseUrl
const waitlistKey = process.env.WAITLIST_SUPABASE_KEY || supabaseServiceKey

export const supabaseWaitlist = createClient(waitlistUrl, waitlistKey)
