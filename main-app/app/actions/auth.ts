'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signInWithGoogleAction() {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    } catch {
                        // Ignored
                    }
                },
            },
        }
    )

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
