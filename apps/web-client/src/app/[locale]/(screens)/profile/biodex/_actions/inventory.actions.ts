'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Fetch the current user's inventory
 */
export async function getUserInventory() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data: inventory, error } = await supabase
        .schema('gamification')
        .from('user_inventory')
        .select(`
      id,
      quantity,
      acquired_at,
      metadata,
      item:items (
        id,
        slug,
        name_i18n,
        description_i18n,
        type,
        image_url,
        rarity
      )
    `)
        .eq('user_id', user.id)
        .gt('quantity', 0)
        .order('acquired_at', { ascending: false })

    if (error) {
        console.error('Error fetching inventory:', JSON.stringify(error, null, 2))
        throw new Error("Impossible de charger l'inventaire")
    }

    return inventory.map((entry) => ({
        ...entry,
        item: Array.isArray(entry.item) ? entry.item[0] : entry.item
    }))
}

/**
 * Consume an item from the user's inventory
 */
export async function useItem(itemId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Vous devez être connecté')

    // Find the item in the user's inventory
    const { data: inventoryItem, error } = await supabase
        .schema('gamification')
        .from('user_inventory')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .single()

    if (error || !inventoryItem || inventoryItem.quantity < 1) {
        throw new Error('Vous ne possédez pas cet objet ou quantité insuffisante')
    }

    // Deduct one item
    const { error: updateError } = await supabase
        .schema('gamification')
        .from('user_inventory')
        .update({
            quantity: inventoryItem.quantity - 1,
            updated_at: new Date().toISOString()
        })
        .eq('id', inventoryItem.id)

    if (updateError) {
        console.error('Error using item:', updateError)
        throw new Error("Erreur lors de l'utilisation de l'objet")
    }

    revalidatePath('/dashboard')

    return true
}
