import { createClient } from '@/lib/supabase/server'
import { ThemeSelection } from '@/components/theme/theme-selection'

export default async function AppearancePage() {
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
