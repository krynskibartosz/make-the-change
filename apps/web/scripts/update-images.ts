import { supabaseAdmin } from './utils/supabase-admin';

// Map of keywords to relevant Unsplash image IDs
const imageMappings: Record<string, string[]> = {
  // Beehive / Honey related
  'beehive': ['1521185496955-15097b20c5fe', '1478489896450-51b98bdbd259', '1587049352846-4a222e784d38'],
  'ruche': ['1521185496955-15097b20c5fe', '1478489896450-51b98bdbd259', '1587049352846-4a222e784d38'],
  'honey': ['1587049352846-4a222e784d38', '1478489896450-51b98bdbd259'],
  'abeille': ['1521185496955-15097b20c5fe', '1478489896450-51b98bdbd259'],
  
  // Trees / Nature related
  'olive': ['1542601906990-b4d3fb7d5b73', '1502082553048-f009c37129b9'],
  'tree': ['1542601906990-b4d3fb7d5b73', '1502082553048-f009c37129b9'],
  'ylang': ['1611080626919-7cf5a9dbab5b', '1542601906990-b4d3fb7d5b73'],
  'forest': ['1542601906990-b4d3fb7d5b73', '1502082553048-f009c37129b9'],
  
  // Default fallback
  'default': ['1542601906990-b4d3fb7d5b73', '1478489896450-51b98bdbd259']
};

function getImageForProject(project: any): { hero: string, gallery: string[] } {
  const text = (project.slug + ' ' + (project.name_default || '')).toLowerCase();
  
  let keyword = 'default';
  for (const key of Object.keys(imageMappings)) {
    if (text.includes(key)) {
      keyword = key;
      break;
    }
  }
  
  const images = imageMappings[keyword];
  const heroId = images[0];
  const galleryIds = images.slice(1).concat(images.slice(0, 1)); // Rotate for variety
  
  return {
    hero: `https://images.unsplash.com/photo-${heroId}?auto=format&fit=crop&w=1200&q=80`,
    gallery: galleryIds.map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`)
  };
}

async function updateProjectImages() {
  console.log('🖼️ Updating Project Images...');
  
  const { data: projects, error } = await supabaseAdmin
    .schema('investment')
    .from('projects')
    .select('*');
    
  if (error) {
    console.error('Error fetching projects:', error);
    return;
  }
  
  console.log(`Found ${projects.length} projects to update.`);
  
  for (const project of projects) {
    // Only update if missing images
    if (!project.hero_image_url || !project.gallery_image_urls || project.gallery_image_urls.length === 0) {
      const { hero, gallery } = getImageForProject(project);
      
      const { error: updateError } = await supabaseAdmin
        .schema('investment')
        .from('projects')
        .update({
          hero_image_url: hero,
          gallery_image_urls: gallery
        })
        .eq('id', project.id);
        
      if (updateError) {
        console.error(`Failed to update project ${project.slug}:`, updateError);
      } else {
        console.log(`Updated images for ${project.slug}`);
      }
    } else {
        console.log(`Project ${project.slug} already has images.`);
    }
  }
  
  console.log('✅ Project images update completed!');
}

async function updateProductImages() {
    console.log('🧴 Updating Product Images (if missing)...');
    // Currently products already have images from seed-producers.ts but let's check
    const { data: products } = await supabaseAdmin
        .schema('commerce')
        .from('products')
        .select('id, name_default, images');

    if (!products) return;

    for (const product of products) {
        if (!product.images || product.images.length === 0) {
             // Fallback images based on name
             const isHoney = product.name_default?.toLowerCase().includes('miel');
             const isSoap = product.name_default?.toLowerCase().includes('savon');
             
             let imageUrl = 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=800&q=80'; // Default jar
             
             if (isHoney) imageUrl = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80';
             if (isSoap) imageUrl = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80';
             
             await supabaseAdmin.schema('commerce').from('products').update({
                 images: [imageUrl]
             }).eq('id', product.id);
             console.log(`Updated images for product ${product.name_default}`);
        }
    }
}

async function main() {
    await updateProjectImages();
    await updateProductImages();
}

main();
