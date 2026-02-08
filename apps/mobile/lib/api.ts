import { supabase } from './supabase'

// Featured projects using public view
export async function fetchFeaturedProjects() {
  const { data, error } = await supabase.from('public_featured_projects').select('*').limit(10)

  if (error) throw error
  return data || []
}

// Projects listing using public view
export async function fetchProjects() {
  const { data, error } = await supabase
    .from('public_projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Products listing using public view
export async function fetchProducts() {
  const { data, error } = await supabase
    .from('public_products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// User investments (requires auth, uses RLS)
export async function fetchUserInvestments() {
  const { data, error } = await supabase
    .from('investments')
    .select(`
      id,
      amount_eur_equivalent,
      amount_points,
      returns_received_points,
      status,
      created_at,
      project:public_projects!project_id(name_default, slug, status)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// User orders (requires auth, uses RLS)
export async function fetchUserOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total_points,
      created_at,
      items:order_items(
        id,
        quantity,
        unit_price_points,
        total_price_points,
        product:public_products!product_id(name_default, slug)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// User profile (requires auth, uses RLS)
export async function fetchUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (error) throw error
  return data
}
