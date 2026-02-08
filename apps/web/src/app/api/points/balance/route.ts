import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/points/balance
 * Get current user's points balance (protected)
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Dynamic imports to avoid circular dependency
    const { db } = await import('@/lib/db')
    const { profiles } = await import('@make-the-change/core/schema')

    // Get user profile
    const profileData = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1)

    if (!profileData || profileData.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const profile = profileData[0]

    // Note: points_balance n'existe pas en base, on retourne 0 par défaut
    // TODO: Implémenter la logique de calcul des points si nécessaire
    return NextResponse.json({
      balance: 0, // Temporaire, car points_balance n'existe pas dans la DB
      profile: {
        user_level: profile?.user_level,
        kyc_status: profile?.kyc_status,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
