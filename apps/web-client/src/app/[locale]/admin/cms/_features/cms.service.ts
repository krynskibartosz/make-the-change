import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { homePageContentSchema, mainMenuStructureSchema } from './cms.schemas'
import type { HomePageContent, MainMenuStructure } from './types'

export async function getMenu(slug: string): Promise<MainMenuStructure | null> {
  // console.log(`Fetching menu ${slug} from content schema...`)
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .schema('content')
      .from('menus')
      .select('structure')
      .eq('slug', slug)
      .single()

    if (error) {
      // PGRST106 means the schema is not exposed, but we can't fix it from here.
      // We should log it but not crash the whole app.
      console.error(`Error fetching menu ${slug}:`, error)
      return null
    }

    const parsed = mainMenuStructureSchema.safeParse(data?.structure)

    if (!parsed.success) {
      console.error(`Invalid menu ${slug} payload`, {
        issues: parsed.error.issues,
      })
      return null
    }

    return parsed.data
  } catch (error) {
    console.error(`Unexpected error fetching menu ${slug}:`, error)
    return null
  }
}

export async function getPageContent(slug: string): Promise<HomePageContent | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .schema('content')
      .from('pages')
      .select('sections')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error(`Error fetching page ${slug}:`, error)
      return null
    }

    const parsed = homePageContentSchema.safeParse(data?.sections)

    if (!parsed.success) {
      console.error(`Invalid page ${slug} payload`, {
        issues: parsed.error.issues,
      })
      return null
    }

    return parsed.data
  } catch (error) {
    console.error(`Unexpected error fetching page ${slug}:`, error)
    return null
  }
}
