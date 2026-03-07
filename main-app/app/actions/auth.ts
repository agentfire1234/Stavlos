'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithGoogleAction() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
        },
    })

    if (error) {
        console.error('OAuth error:', error.message)
        redirect('/login?error=OAuthInitFailed')
    }

    if (data.url) {
        // This redirect securely transfers the code-verifier cookie to the browser 
        // before bouncing the user out to Google.
        redirect(data.url)
    }
}
