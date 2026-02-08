import { supabaseAdmin } from './utils/supabase-admin';

// --- Biodex Data ---

const speciesList = [
  {
    scientific_name: 'Apis mellifera',
    name_i18n: { fr: 'Abeille mellifère', en: 'Honey Bee' },
    description_i18n: { fr: 'La principale espèce d\'abeille élevée pour la production de miel.', en: 'Main species used for honey production.' },
    // content_levels replaces separate kingdom/family columns
    content_levels: { kingdom: 'Animalia', family: 'Apidae', metadata: { role: 'Pollinisateur majeur' } },
    conservation_status: 'LC',
    // image_url is missing from schema, assume it's handled via media_relations or not needed
  },
  {
    scientific_name: 'Cananga odorata',
    name_i18n: { fr: 'Ylang-Ylang', en: 'Ylang-Ylang' },
    description_i18n: { fr: 'Arbre tropical dont les fleurs sont distillées pour la parfumerie.', en: 'Tropical tree distilled for perfume.' },
    content_levels: { kingdom: 'Plantae', family: 'Annonaceae', metadata: { role: 'Production huile essentielle' } },
    conservation_status: 'LC',
  },
  {
    scientific_name: 'Lavandula angustifolia',
    name_i18n: { fr: 'Lavande vraie', en: 'True Lavender' },
    description_i18n: { fr: 'Plante aromatique emblématique de la Provence.', en: 'Aromatic plant iconic to Provence.' },
    content_levels: { kingdom: 'Plantae', family: 'Lamiaceae', metadata: { role: 'Mellifère' } },
    conservation_status: 'LC',
  },
  {
    scientific_name: 'Olea europaea',
    name_i18n: { fr: 'Olivier', en: 'Olive Tree' },
    description_i18n: { fr: 'Arbre fruitier produisant les olives, symbole de paix.', en: 'Fruit tree producing olives.' },
    content_levels: { kingdom: 'Plantae', family: 'Oleaceae', metadata: { role: 'Production huile' } },
    conservation_status: 'NE', // Not Evaluated
  }
];

async function seedSpecies() {
  console.log('🦋 Seeding Biodex (Species)...');
  
  for (const s of speciesList) {
    // Check if exists first to avoid ON CONFLICT issue if constraint is missing
    const { data: existing } = await supabaseAdmin
        .schema('investment')
        .from('species')
        .select('id')
        .eq('scientific_name', s.scientific_name)
        .maybeSingle();

    if (existing) {
        console.log(`Species ${s.scientific_name} already exists.`);
        continue;
    }

    const { error } = await supabaseAdmin
      .schema('investment')
      .from('species')
      .insert(s);
      
    if (error) console.error(`Error adding ${s.name_i18n.fr}:`, error.message);
    else console.log(`Added species: ${s.name_i18n.fr}`);
  }
}

async function seedSubscriptions() {
  console.log('🔄 Seeding Subscriptions...');
  
  const { data: users } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .limit(10);
    
  if (!users) return;

  for (const user of users) {
      // 50% chance
      if (Math.random() > 0.5) continue;
      
      const { error } = await supabaseAdmin
        .schema('commerce')
        .from('subscriptions')
        .insert({
            user_id: user.id,
            status: 'active',
            plan_id: 'monthly_honey_box',
            start_date: new Date().toISOString(),
            next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            // amount_points removed as it does not exist in schema
            interval: 'month'
        });
        
     if (error) console.error(`Error adding sub for user ${user.id}:`, error.message);
     else console.log(`Added subscription for user ${user.id}`);
  }
}

async function seedInvestments() {
  console.log('📈 Seeding additional investments for Biodex gamification...');
  
  // Get active projects
  const { data: projects } = await supabaseAdmin
    .schema('investment')
    .from('projects')
    .select('id, slug')
    .eq('status', 'active');
    
  if (!projects || projects.length === 0) return;
  
  // Get users
  const { data: users } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .limit(20);
    
  if (!users) return;

  for (const user of users) {
    // 40% chance to invest
    if (Math.random() > 0.4) {
      const project = projects[Math.floor(Math.random() * projects.length)];
      const amount = Math.floor(Math.random() * 5 + 1) * 100; // 100, 200, ... 500
      
      const { error } = await supabaseAdmin
        .schema('investment')
        .from('investments')
        .insert({
          user_id: user.id,
          project_id: project.id,
          amount_points: amount,
          amount_eur_equivalent: amount / 10,
          status: 'completed'
        });
        
      if (!error) console.log(`User ${user.id} invested ${amount}pts in ${project.slug}`);
    }
  }
}

async function main() {
    await seedSpecies();
    await seedSubscriptions();
    await seedInvestments();
    // Finance skipped
}

main().catch(console.error);
