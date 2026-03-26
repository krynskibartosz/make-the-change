import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ebmjxinsyyjwshnynwwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibWp4aW5zeXlqd3Nobnlud3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTkxOTEsImV4cCI6MjA3MjA5NTE5MX0.LabNGcAN6XQuv6alj7oCLty5E3rG9fRrZeBZZDkJ-Eo'
)

async function test() {
  const { data, error } = await supabase.schema('investment').from('projects').select('id, name_default, featured').eq('featured', true)
  console.log('Projects error:', error)
  console.log('Projects data:', data)

  const { data: pData, error: pError } = await supabase.schema('shop').from('products').select('id, name_default, featured').eq('featured', true)
  console.log('Products error:', pError)
  console.log('Products data:', pData)
}

test()
