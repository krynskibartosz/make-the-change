import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentMockUserPreferences } from '@/lib/mock/mock-user-preferences-server'
import { createClient } from '@/lib/supabase/server'
import { ThemeSelection } from './_features/theme/theme-selection'

export default async function AppearancePage() {
  if (isMockDataSource) {
    const preferences = await getCurrentMockUserPreferences()
    if (!preferences) return null

    return (
      <div className="w-full">
        <ThemeSelection initialConfig={preferences.themeConfig} />
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('theme_config')
    .eq('id', user.id)
    .single()

  return (
    <div className="w-full">
      <ThemeSelection initialConfig={profile?.theme_config || null} />
    </div>
  )
}
