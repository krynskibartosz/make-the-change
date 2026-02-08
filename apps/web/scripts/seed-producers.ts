import { scrapeHabeebee } from './scrapers/habeebee';
import { scrapeIlanga } from './scrapers/ilanga';
import { supabaseAdmin } from './utils/supabase-admin';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // decomposed for accents
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function ensureCountry(code: string, name: string) {
  const { data } = await supabaseAdmin
    .from('countries')
    .select('code')
    .eq('code', code)
    .maybeSingle();
    
  if (!data) {
    const { error } = await supabaseAdmin
      .from('countries')
      .insert({
        code,
        name_en: name,
        name_fr: name,
        name_native: name,
        name_nl: name
      });
      
    if (error) {
        console.error(`Error creating country ${code}:`, error);
    } else {
        console.log(`Created country ${code}`);
    }
  }
}

async function seedProducer(data: { producer: any, products: any[] }) {
  console.log(`🌱 Seeding producer: ${data.producer.name}`);

  // Ensure country exists
  if (data.producer.address_country_code) {
    await ensureCountry(data.producer.address_country_code, data.producer.address_country_code === 'BE' ? 'Belgium' : 'Madagascar');
  }

  // Prepare producer payload (remove 'name' property as it's not a column)
  const { name, ...producerData } = data.producer;
  const producerPayload = {
    ...producerData,
    name_i18n: { fr: name, en: name }, // Ensure this is set
  };

  // 1. Upsert Producer
  // Check if exists by slug
  const { data: producer, error: producerError } = await supabaseAdmin
    .schema('investment')
    .from('producers')
    .select('id')
    .eq('slug', data.producer.slug)
    .maybeSingle();

  let producerId = producer?.id;

  if (!producerId) {
    const { data: newProducer, error: createError } = await supabaseAdmin
      .schema('investment')
      .from('producers')
      .insert(producerPayload)
      .select('id')
      .single();

    if (createError) {
      console.error(`Error creating producer ${data.producer.name}:`, createError);
      return;
    }
    producerId = newProducer.id;
    console.log(`Created producer ${data.producer.name} (${producerId})`);
  } else {
    console.log(`Producer ${data.producer.name} already exists (${producerId})`);
  }

  // 2. Process Products
  console.log(`Processing ${data.products.length} products...`);
  
  for (const product of data.products) {
    // 3. Upsert Category
    const categorySlug = slugify(product.category);
    let categoryId;
    
    const { data: category, error: catError } = await supabaseAdmin
      .schema('commerce')
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();
      
    if (category) {
      categoryId = category.id;
    } else {
      const { data: newCategory, error: createCatError } = await supabaseAdmin
        .schema('commerce')
        .from('categories')
        .insert({
          name_i18n: { fr: product.category, en: product.category },
          slug: categorySlug,
          is_active: true
        })
        .select('id')
        .single();
        
      if (createCatError) {
        console.error(`Error creating category ${product.category}:`, createCatError);
        // Fallback to a default category or skip?
        // Let's try to find ANY category to attach to, or skip
        continue; 
      }
      categoryId = newCategory.id;
    }

    // 4. Upsert Product
    const productSlug = slugify(product.name);
    
    // Check if exists
    const { data: existingProduct } = await supabaseAdmin
      .schema('commerce')
      .from('products')
      .select('id')
      .eq('slug', productSlug)
      .maybeSingle();

    let productId = existingProduct?.id;

    if (!productId) {
      const { data: newProduct, error: prodError } = await supabaseAdmin
        .schema('commerce')
        .from('products')
        .insert({
          producer_id: producerId,
          category_id: categoryId,
          name_i18n: { fr: product.name, en: product.name },
          description_i18n: { fr: product.description, en: product.description },
          slug: productSlug,
          images: product.image ? [product.image] : [],
          is_active: true,
          price_points: Math.round(product.price * 10),
          price_eur_equivalent: product.price,
          stock_quantity: 100,
          fulfillment_method: 'ship'
        })
        .select('id')
        .single();

      if (prodError) {
        console.error(`Error creating product ${product.name}:`, prodError);
        continue;
      }
      productId = newProduct.id;
      console.log(`Created product ${product.name}`);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting Seed Process...');
    
    // 1. Habeebee
    try {
      console.log('\n--- HABEEBEE ---');
      const habeebeeData = await scrapeHabeebee();
      await seedProducer(habeebeeData);
    } catch (e) {
      console.error('Failed Habeebee:', e);
    }

    // 2. Ilanga
    try {
      console.log('\n--- ILANGA NATURE ---');
      const ilangaData = await scrapeIlanga();
      await seedProducer(ilangaData);
    } catch (e) {
      console.error('Failed Ilanga:', e);
    }

    console.log('\n✅ Seeding completed!');
  } catch (e) {
    console.error('Fatal error:', e);
    process.exit(1);
  }
}

main();
