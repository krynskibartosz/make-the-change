'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Fetch the active quests and the user's progress on them
 */
export async function getActiveQuests() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    // Get all active quests
    const { data: quests, error: questsError } = await supabase
        .schema('gamification')
        .from('quests')
        .select('*')
        .eq('status', 'active')

    if (questsError) {
        console.error('Error fetching quests:', questsError)
        throw new Error('Impossible de charger les quêtes')
    }

    // Get user progress for these quests
    const { data: userQuests, error: userQuestsError } = await supabase
        .schema('gamification')
        .from('user_quests')
        .select('*')
        .eq('user_id', user.id)

    if (userQuestsError) {
        console.error('Error fetching user quests:', userQuestsError)
        throw new Error('Impossible de charger la progression des quêtes')
    }

    const userQuestsMap = new Map(userQuests.map(uq => [uq.quest_id, uq]))

    return quests.map(quest => {
        const userProgress = userQuestsMap.get(quest.id)
        return {
            ...quest,
            user_progress: {
                status: userProgress?.status || 'active', // active, completed, claimed
                progress: userProgress?.progress || 0,
                id: userProgress?.id
            }
        }
    })
}

/**
 * Claim the reward for a completed quest
 */
export async function claimQuestReward(questId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Vous devez être connecté')

    // Find the exact user_quest relationship
    const { data: userQuest, error: fetchError } = await supabase
        .schema('gamification')
        .from('user_quests')
        .select('*, quest:quests(*)')
        .eq('user_id', user.id)
        .eq('quest_id', questId)
        .single()

    if (fetchError || !userQuest) {
        throw new Error("Quête introuvable ou vous n'avez pas commencé cette quête")
    }

    if (userQuest.status === 'claimed') {
        throw new Error('Récompense déjà réclamée')
    }

    if (userQuest.status !== 'completed' && userQuest.progress < 100) {
        // Check if progress should mean completion based on our business logic.
        // For this project, assume it needs to be explicitly marked 'completed' or progress >= 100
        throw new Error('Quête non terminée')
    }

    // Use the admin client to grant rewards safely (bypass RLS for ledger updates)
    const { data: quest } = await supabase.schema('gamification').from('quests').select('*').eq('id', questId).single()

    if (!quest) throw new Error('Quête source introuvable')

    // Example: Grant XP
    if (quest.reward_points && quest.reward_points > 0) {
        await supabase.schema('gamification').from('xp_ledger').insert({
            user_id: user.id,
            amount: quest.reward_points,
            source_type: 'quest',
            source_id: quest.id,
            description: `Récompense de la quête: ${quest.title}`
        })
    }

    // Example: Grant Items
    if (quest.reward_items && Array.isArray(quest.reward_items)) {
        for (const item of quest.reward_items as any[]) {
            // Find item
            if (item.id) {
                // Upsert inventory
                const { data: existing } = await supabase.schema('gamification').from('user_inventory')
                    .select('id, quantity').eq('user_id', user.id).eq('item_id', item.id).single()

                if (existing) {
                    await supabase.schema('gamification').from('user_inventory')
                        .update({ quantity: existing.quantity + (item.quantity || 1) })
                        .eq('id', existing.id)
                } else {
                    await supabase.schema('gamification').from('user_inventory')
                        .insert({ user_id: user.id, item_id: item.id, quantity: item.quantity || 1 })
                }
            }
        }
    }

    // Mark Quest as Claimed
    await supabase
        .schema('gamification')
        .from('user_quests')
        .update({
            status: 'claimed',
            claimed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', userQuest.id)

    revalidatePath('/dashboard')

    return { success: true, reward_points: quest.reward_points }
}
