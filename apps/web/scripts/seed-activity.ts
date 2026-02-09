import { supabaseAdmin } from './utils/supabase-admin';

// --- Helpers ---

function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomElement<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error('Empty array');
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

// --- Project Updates ---

const updateTemplates = [
  {
    type: 'production',
    title: 'Plantation terminée !',
    content: 'Nous avons fini de planter les 500 premiers arbres. Merci à tous pour votre soutien.',
    metrics: { trees_planted: 500, survival_rate: '98%' }
  },
  {
    type: 'maintenance',
    title: 'Entretien des ruches',
    content: 'Visite de printemps effectuée. Les colonies se portent à merveille.',
    metrics: { hives_checked: 20, health_status: 'Excellent' }
  },
  {
    type: 'harvest',
    title: 'Première récolte',
    content: 'La récolte a été fructueuse cette année ! Bientôt disponible en boutique.',
    metrics: { yield_kg: 150, quality: 'Premium' }
  },
  {
    type: 'impact',
    title: 'Impact sur la biodiversité',
    content: 'Nous avons observé le retour de plusieurs espèces d\'oiseaux sur la parcelle.',
    metrics: { species_count: 12, area_restored_m2: 5000 }
  },
  {
    type: 'news',
    title: 'Visite des parrains',
    content: 'Superbe journée passée avec les parrains venus voir l\'avancement du projet.',
    metrics: { visitors: 45 }
  }
];

async function seedProjectUpdates() {
  console.log('📢 Seeding Project Updates...');
  
  const { data: projects } = await supabaseAdmin
    .schema('investment')
    .from('projects')
    .select('id, slug, type');
    
  if (!projects) return;

  for (const project of projects) {
    // Add 2-3 updates per project
    const numUpdates = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < numUpdates; i++) {
      const template = getRandomElement(updateTemplates);
      
      // Customize content slightly
      const date = getRandomDate(new Date(2025, 0, 1), new Date());
      
      const { error } = await supabaseAdmin
        .schema('investment')
        .from('project_updates')
        .insert({
          project_id: project.id,
          type: template.type,
          title: template.title,
          content: template.content,
          metrics: template.metrics,
          published_at: date.toISOString(),
          updated_at: new Date().toISOString(), // Explicitly set updated_at to satisfy trigger?
          images: [] // Could add images if we had more
        });
        
      if (error) {
        console.error(`Failed update for ${project.slug}:`, error.message);
      } else {
        console.log(`Added update "${template.title}" to ${project.slug}`);
      }
    }
  }
}

// --- Orders ---

async function seedOrders() {
  console.log('🛍️ Seeding Orders...');
  
  // 1. Get Users
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, address_city, address_country_code')
    .limit(50);
    
  if (!profiles || profiles.length === 0) return;

  // 2. Get Products
  const { data: products } = await supabaseAdmin
    .schema('commerce')
    .from('products')
    .select('id, price_points')
    .limit(20);
    
  if (!products || products.length === 0) return;

  // 3. Create Orders
  for (const profile of profiles) {
    // 30% chance to have an order
    if (Math.random() > 0.3) continue;
    
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = [];
    let totalPoints = 0;
    
    for (let i = 0; i < numItems; i++) {
        const p = getRandomElement(products);
        selectedProducts.push(p);
        totalPoints += (p.price_points || 100);
    }

    try {
        const { data: order, error: orderError } = await supabaseAdmin
            .schema('commerce')
            .from('orders')
            .insert({
                user_id: profile.id,
                subtotal_points: totalPoints,
                total_points: totalPoints,
                points_used: 0,
                status: 'completed',
                shipping_address: { 
                    city: profile.address_city || 'Paris', 
                    country: profile.address_country_code || 'FR',
                    street: '123 Rue de la Paix'
                },
                payment_method: 'points'
            })
            .select()
            .single();
            
        if (orderError) {
            console.error(`Failed order for user ${profile.id}:`, orderError.message);
            continue;
        }

        // Items
        for (const p of selectedProducts) {
            await supabaseAdmin
                .schema('commerce')
                .from('order_items')
                .insert({
                    order_id: order.id,
                    product_id: p.id,
                    quantity: 1,
                    unit_price_points: p.price_points || 100,
                    total_price_points: p.price_points || 100
                });
        }
        console.log(`Created order for user ${profile.id} (${totalPoints} pts)`);
        
    } catch (e) {
        console.error(`Exception creating order:`, e);
    }
  }
}

async function main() {
    await seedProjectUpdates();
    await seedOrders();
}

main().catch(console.error);
