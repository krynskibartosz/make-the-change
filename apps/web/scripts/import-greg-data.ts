import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load .env.local if present (for local dev)
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  config({ path: envLocalPath });
} else {
    // Try looking one level up if run from scripts dir (though usually run from root of app)
    const envLocalUp = path.resolve(process.cwd(), '../.env.local');
    if (fs.existsSync(envLocalUp)) {
        console.log('Loading ../.env.local...');
        config({ path: envLocalUp });
    }
}

import { parse } from 'csv-parse/sync';
// import { db } from '../src/lib/db'; // Avoid server-only import
import { producers, projects, species, products, categories } from '@make-the-change/core/schema';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Setup DB connection manually
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema: { producers, projects, species, products, categories } });


const DATA_DIR = path.join(process.cwd(), '../../greg-excell');

const simpleSlugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

async function main() {
  console.log('🚀 Starting import from Greg\'s Excel/CSV files...');

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }

  // --- 1. PRODUCERS ---
  console.log('\n📦 Importing Producers...');
  const producersFile = path.join(DATA_DIR, 'Base de données APP V3 - Entreprise.csv');
  const producerMap = new Map<string, string>(); // Slug -> ID

  if (fs.existsSync(producersFile)) {
    const records = parse(fs.readFileSync(producersFile), {
      columns: true,
      skip_empty_lines: true,
    });

    for (const row of records) {
      if (!row.Nom) continue;
      
      const slug = simpleSlugify(row.Nom);
      let producerId: string;

      const existing = await db.query.producers.findFirst({
        where: eq(producers.slug, slug),
      });

      if (!existing) {
        console.log(`   ✨ Creating producer: ${row.Nom}`);
        const [inserted] = await db.insert(producers).values({
          slug,
          // name_default is generated
          name_i18n: { fr: row.Nom, en: row.Nom },
          contact_person_name: row.Fondateur,
          contact_website: row['Site web ']?.trim(),
          contact_email: row.Contact?.trim(),
          // description_default is generated
          description_i18n: { fr: row['Description de l\'entreprise'] || '', en: row['Description de l\'entreprise'] || '' },
          status: 'active',
          type: 'company',
          address_country_code: row.Pays === 'Belgique' ? 'BE' : (row.Pays ? 'BE' : null), // Defaulting to BE if unsure but present
          address_city: row.Ville || 'Unknown', // Required if country is present
        } as any).returning({ id: producers.id });
        producerId = inserted.id;
      } else {
        console.log(`   Example: ${row.Nom} already exists.`);
        producerId = existing.id;
      }
      producerMap.set(slug, producerId);
    }
  }

  // --- 2. SPECIES ---
  console.log('\n🌿 Importing Species...');
  const speciesFile = path.join(DATA_DIR, 'Base de données APP V3 - Espèces.csv');
  const speciesMap = new Map<string, string>(); // Scientific Name -> ID

  if (fs.existsSync(speciesFile)) {
    const records = parse(fs.readFileSync(speciesFile), {
      columns: true,
      skip_empty_lines: true,
    });

    for (const row of records) {
      const name = row['Nom commun'];
      const scientificName = row['Nom latin'];
      if (!name) continue;

      // Check existence by scientific name if available, else name
      const searchName = scientificName || name;
      
      // We can't query by scientific_name easily if it's not unique in schema (it is not unique constraint but should be unique data)
      // We'll search using findFirst
      const existing = await db.query.species.findFirst({
        where: scientificName ? eq(species.scientific_name, scientificName) : undefined, // Fallback if no scientific name?
      });
      // If no scientific name, maybe skip or assume unique name?
      // Actually, let's assume scientific name is key.

      let speciesId: string;

      if (!existing) {
        console.log(`   ✨ Creating species: ${name} (${scientificName})`);
        const bioscore = row.Bioscore ? parseInt(row.Bioscore.replace('/10', '')) : null;
        const habitatArr = row.Habitat ? row.Habitat.split(',').map((s: string) => s.trim()) : [];

        const [inserted] = await db.insert(species).values({
          scientific_name: scientificName,
          habitat: habitatArr, // Array
          bioscore: bioscore,
          characteristics: {
            taille: row.Taille,
            poids: row.Poids,
            regime_alimentaire: row['Régime alimentaire'],
            groupe: row.Groupe
          },
          name_i18n: { fr: name, en: name },
          description_i18n: { fr: row['Description de l\'espèce'] || '', en: row['Description de l\'espèce'] || '' },
          habitat_i18n: { fr: row.Habitat || '', en: row.Habitat || '' }
        } as any).returning({ id: species.id });
        speciesId = inserted.id;
      } else {
        speciesId = existing.id;
      }
      speciesMap.set(scientificName || name, speciesId);
    }
  }

  // --- 3. PROJECTS ---
  console.log('\n🏗️ Importing Projects...');
  const projectsFile = path.join(DATA_DIR, 'Base de données APP V3 - Projets.csv');
  
  if (fs.existsSync(projectsFile)) {
    const records = parse(fs.readFileSync(projectsFile), {
      columns: true,
      skip_empty_lines: true,
    });

    for (const row of records) {
      if (!row.Nom) continue;

      const slug = simpleSlugify(row.Nom);
      const existing = await db.query.projects.findFirst({
        where: eq(projects.slug, slug),
      });

      if (!existing) {
        console.log(`   ✨ Creating project: ${row.Nom}`);
        
        // Link Producer
        // Heuristic: try to match 'Responsable' with producer name, or default to Habeebee
        let producerId = producerMap.get('habeebee'); // Default
        // If row.Responsable matches a producer slug...
        if (row.Responsable) {
            const respSlug = simpleSlugify(row.Responsable);
            if (producerMap.has(respSlug)) producerId = producerMap.get(respSlug);
        }

        if (!producerId) {
             // Fallback to first producer found in map
             producerId = producerMap.values().next().value;
        }

        // Link Species
        // Heuristic: Check if project name contains species name
        let speciesId = null;
        for (const [sName, sId] of speciesMap.entries()) {
            // sName is scientific name or common name.
            // Check against common names
            // This is tricky without a mapping.
            // For 'Ruche', we map to 'Apis mellifera'
            if (row.Nom.toLowerCase().includes('ruche') && sName.includes('Apis')) {
                speciesId = sId;
                break;
            }
        }

        // Project Type
        let type = 'beehive';
        if (row.Nom.toLowerCase().includes('ruche')) type = 'beehive';
        else if (row.Nom.toLowerCase().includes('arbre') || row.Nom.toLowerCase().includes('agroforesterie')) type = 'agroforestry';
        
        const impact = {
            biodiversity_score: row['Score du projet par rapport à la biodiversité'],
            superficie: row.Superficie
        };

        await db.insert(projects).values({
          slug,
          name_i18n: { fr: row.Nom, en: row.Nom },
          description_i18n: null, // Explicitly null to avoid default issue if any, or provide description if available
          producer_id: producerId,
          type: type as any,
          target_budget: 10000,
          address_country_code: row.Pays === 'Belgique' ? 'BE' : 'BE',
          address_region: row['Zone du projet'],
          address_city: 'Unknown', // Required if country present
          status: 'active',
          species_id: speciesId,
          impact_metrics: impact
        } as any);
      } else {
        console.log(`   Example: ${row.Nom} already exists.`);
      }
    }
  }

  // --- 4. PRODUCTS ---
  console.log('\n🛍️ Importing Products...');
  const productsFile = path.join(DATA_DIR, 'Base de données APP V3 - Produits.csv');
  
  if (fs.existsSync(productsFile)) {
    const records = parse(fs.readFileSync(productsFile), {
      columns: true,
      skip_empty_lines: true,
    });

    // Ensure category exists
    let categoryId: string;
    const catSlug = 'soins';
    const existingCat = await db.query.categories.findFirst({ where: eq(categories.slug, catSlug) });
    if (!existingCat) {
        const [inserted] = await db.insert(categories).values({
            slug: catSlug,
            name_i18n: { fr: 'Soins', en: 'Care' },
            is_active: true
        } as any).returning({ id: categories.id });
        categoryId = inserted.id;
    } else {
        categoryId = existingCat.id;
    }

    for (const row of records) {
      if (!row.Nom) continue;

      const slug = simpleSlugify(row.Nom);
      const existing = await db.query.products.findFirst({
        where: eq(products.slug, slug),
      });

      if (!existing) {
        console.log(`   ✨ Creating product: ${row.Nom}`);
        
        let producerId = producerMap.get('habeebee'); // Default
         if (row.Vendeur) {
            const respSlug = simpleSlugify(row.Vendeur);
            if (producerMap.has(respSlug)) producerId = producerMap.get(respSlug);
        }
        if (!producerId) producerId = producerMap.values().next().value;

        await db.insert(products).values({
          slug,
          name_i18n: { fr: row.Nom, en: row.Nom },
          description_i18n: { fr: row.Description || '', en: row.Description || '' },
          price_eur_equivalent: row['Prix (EUR)'] ? parseFloat(row['Prix (EUR)'].replace(',', '.')) : 0,
          price_points: row['Prix (Points)'] ? parseInt(row['Prix (Points)']) : 0,
          category_id: categoryId,
          producer_id: producerId,
          fulfillment_method: 'ship',
          variants: { contenance: row.Contenance },
          is_active: true
        } as any);
      }
    }
  }

  console.log('\n✅ Import completed!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
