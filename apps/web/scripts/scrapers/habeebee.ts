import { cleanHtml } from '../utils/text-cleaner';

interface ScrapedProduct {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  vendor: string;
}

export async function scrapeHabeebee(): Promise<{ producer: any, products: ScrapedProduct[] }> {
  console.log('🐝 Scraping Habeebee via API...');
  
  const response = await fetch('https://habeebee.be/products.json');
  if (!response.ok) {
    throw new Error(`Failed to fetch Habeebee products: ${response.statusText}`);
  }
  
  const data = await response.json();
  const products: ScrapedProduct[] = [];

  for (const item of data.products) {
    // Skip if no variants or price
    if (!item.variants || item.variants.length === 0) continue;
    
    // Get image
    const image = item.images && item.images.length > 0 ? item.images[0].src : null;
    if (!image) continue; // Skip if no image

    // Clean description
    const description = cleanHtml(item.body_html || '');
    
    // Determine category
    let category = 'Soins'; // Default
    if (item.product_type) {
      category = item.product_type;
    }
    
    products.push({
      name: item.title,
      description,
      category,
      price: parseFloat(item.variants[0].price),
      image,
      vendor: 'Habeebee'
    });
  }

  console.log(`✅ Found ${products.length} products from Habeebee.`);

  return {
    producer: {
      name: 'Habeebee',
      slug: 'habeebee',
      type: 'cooperative', // Enum: farmer, cooperative, etc.
      description_i18n: {
        fr: "Savonnerie artisanale belge qui valorise la cire d'abeille.",
        en: "Belgian artisanal soap factory valuing beeswax."
      },
      story_i18n: {
        fr: "Habeebee est bien plus qu'une savonnerie artisanale à Bruxelles. C'est un projet collaboratif qui valorise la cire d'abeille et la propolis, à travers une gamme de soins pour le corps, bons pour la peau et pour la planète. Tout est bio, local, artisanal.",
        en: "Habeebee is much more than an artisanal soap factory in Brussels. It is a collaborative project that values beeswax and propolis through a range of body care products, good for the skin and the planet. Everything is organic, local, and artisanal."
      },
      address_city: 'Bruxelles',
      address_country_code: 'BE',
      contact_website: 'https://habeebee.be',
      status: 'active'
    },
    products
  };
}
