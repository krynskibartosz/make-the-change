import { scrapeHabeebee } from './scrapers/habeebee';
import { scrapeIlanga } from './scrapers/ilanga';
import { supabaseAdmin } from './utils/supabase-admin';

async function checkPrices() {
  console.log('🔍 Checking prices...');

  // 1. Fetch products from DB
  const { data: dbProducts, error } = await supabaseAdmin
    .schema('commerce')
    .from('products')
    .select(`
      id,
      name_i18n,
      price_eur_equivalent,
      slug,
      producer_id
    `);

  if (error) {
    console.error('❌ Error fetching products from DB:', error);
    console.error('Check if your .env.local or .env file contains valid Supabase credentials.');
    return;
  }

  // Fetch producers to know which one is which
  const { data: producers, error: producerError } = await supabaseAdmin
    .schema('investment')
    .from('producers')
    .select('id, slug, name_i18n');

  if (producerError) {
    console.error('❌ Error fetching producers:', producerError);
    return;
  }

  const producerMap = new Map(producers.map((p: any) => [p.id, p.slug]));

  // Group DB products by producer slug
  const dbProductsByProducer: Record<string, any[]> = {};
  for (const p of dbProducts) {
    const producerSlug = producerMap.get(p.producer_id);
    if (!producerSlug) continue;
    if (!dbProductsByProducer[producerSlug]) {
      dbProductsByProducer[producerSlug] = [];
    }
    dbProductsByProducer[producerSlug].push(p);
  }

  // 2. Scrape and Compare
  // Habeebee
  if (dbProductsByProducer['habeebee']) {
    console.log('\n--- Checking Habeebee ---');
    try {
      const { products: scrapedProducts } = await scrapeHabeebee();
      compareProducts(dbProductsByProducer['habeebee'], scrapedProducts);
    } catch (e) {
      console.error('Failed to check Habeebee:', e);
    }
  } else {
    console.log('No products for Habeebee found in DB.');
  }

  // Ilanga
  if (dbProductsByProducer['ilanga-nature']) {
    console.log('\n--- Checking Ilanga Nature ---');
    try {
      const { products: scrapedProducts } = await scrapeIlanga();
      compareProducts(dbProductsByProducer['ilanga-nature'], scrapedProducts);
    } catch (e) {
      console.error('Failed to check Ilanga Nature:', e);
    }
  } else {
     console.log('No products for Ilanga Nature found in DB.');
  }
}

function compareProducts(dbProducts: any[], scrapedProducts: any[]) {
  let matchCount = 0;
  let mismatchCount = 0;
  let missingInDbCount = 0;
  
  // Create maps for faster lookup
  // DB products key: try name (fr) or slug
  const dbMap = new Map();
  for (const p of dbProducts) {
    // Assuming name_i18n has fr
    const name = p.name_i18n?.fr || p.name_i18n?.en || '';
    dbMap.set(normalizeName(name), p);
  }

  const scrapedMap = new Map();
  for (const p of scrapedProducts) {
    scrapedMap.set(normalizeName(p.name), p);
  }

  console.log(`DB has ${dbProducts.length} products. Site has ${scrapedProducts.length} products.`);

  // Check from Site perspective (what SHOULD be there)
  for (const scraped of scrapedProducts) {
    const normName = normalizeName(scraped.name);
    const dbProduct = dbMap.get(normName);

    if (!dbProduct) {
      // console.log(`⚠️  Missing in DB: "${scraped.name}" (${scraped.price}€)`);
      missingInDbCount++;
      continue;
    }

    // Compare Price
    const dbPrice = dbProduct.price_eur_equivalent;
    // Allow small floating point diffs
    if (Math.abs(dbPrice - scraped.price) > 0.01) {
      console.log(`❌ Price Mismatch: "${scraped.name}" - DB: ${dbPrice}€ vs Site: ${scraped.price}€`);
      mismatchCount++;
    } else {
      matchCount++;
    }
    
    // Remove from dbMap to see what's left
    dbMap.delete(normName);
  }

  // Remaining in DB map are products in DB but not found on site
  if (dbMap.size > 0) {
    console.log(`❓ In DB but not found on site (or name mismatch): ${dbMap.size} products`);
    // for (const [key, val] of dbMap) {
    //   console.log(`   - ${val.name_i18n?.fr}`); 
    // }
  }

  console.log(`\nSummary:`);
  console.log(`✅ Matches: ${matchCount}`);
  console.log(`❌ Price Mismatches: ${mismatchCount}`);
  console.log(`⚠️  Missing in DB (found on site): ${missingInDbCount}`);
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

checkPrices();
