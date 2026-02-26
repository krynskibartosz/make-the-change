import { getTranslations } from 'next-intl/server'
import { Feed } from '@/components/social/feed'
import { CommunityLeftSidebar } from './_features/community-left-sidebar'
import { CommunityLeaderboardCard } from './_features/community-leaderboard-card'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata() {
    const t = await getTranslations('navigation')
    return {
        title: `${t('community')} | Make the Change`,
    }
}

export default async function CommunityPage() {
    const t = await getTranslations('navigation')

    // Fetch user for auth-aware sidebar
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    let profile: { avatar_url: string | null; first_name: string | null; last_name: string | null } | null = null
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('avatar_url, first_name, last_name')
            .eq('id', user.id)
            .single()
        profile = data
    }

    const sidebarUser = user
        ? {
            id: user.id,
            email: user.email || '',
            avatarUrl: profile?.avatar_url || null,
            displayName: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user.email || '',
        }
        : null

    return (
        <div className="bg-background relative">
            <div className="flex justify-center max-w-[1260px] mx-auto w-full">

                {/* 1. Colonne de gauche (Navigation) */}
                <div className="hidden sm:block w-[88px] xl:w-[275px] shrink-0">
                    <header className="sticky top-0 h-screen overflow-y-auto flex flex-col justify-between">
                        <CommunityLeftSidebar user={sidebarUser} />
                    </header>
                </div>

                {/* 2. Colonne centrale (Feed public) */}
                <main className="w-full max-w-[600px] min-h-screen border-x border-border flex flex-col shrink-0">
                    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 cursor-pointer">
                        <h1 className="text-xl font-bold">{t('community')}</h1>
                    </div>

                    <div className="w-full relative z-0">
                        <Feed />
                    </div>
                </main>

                {/* 3. Colonne de droite (Tendances/Suggestions) */}
                <div className="hidden lg:block w-[350px] shrink-0">
                    <aside className="sticky top-0 h-screen overflow-y-auto px-6 py-4">
                        <div className="mb-4">
                            <div className="bg-muted/50 rounded-full flex items-center px-4 py-[10px] border border-transparent focus-within:bg-background focus-within:border-primary focus-within:text-primary transition-colors cursor-text group">
                                <span className="text-muted-foreground group-focus-within:text-primary">Rechercher...</span>
                            </div>
                        </div>
                        <CommunityLeaderboardCard />
                    </aside>
                </div>

            </div>
        </div>
    )
}
