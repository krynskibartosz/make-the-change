import { chromium } from 'playwright';

interface ScrapedProduct {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  vendor: string;
}

export async function scrapeIlanga(): Promise<{ producer: any, products: ScrapedProduct[] }> {
  console.log('🌸 Scraping Ilanga Nature via Playwright...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const products: ScrapedProduct[] = [];

  try {
    await page.goto('https://www.ilanga-nature.com/en/shop', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Evaluate in browser context to extract data
    const scrapedItems = await page.evaluate(() => {
      const items: any[] = [];
      // Heuristic: Find all elements that look like product cards
      // Usually they have an image, a title and a price.
      
      // Let's look for all 'article' or divs that contain an img and text with '€'
      const candidates = Array.from(document.querySelectorAll('div, article, li'));
      
      // Filter for leaf-ish nodes that contain price and title
      const productCards = candidates.filter(el => {
        const text = el.textContent || '';
        const hasPrice = text.includes('€');
        const hasImg = el.querySelector('img');
        // Simple check: shouldn't contain too many other divs with prices
        // If innerText length is small enough, it's likely a card
        return hasPrice && hasImg && el.innerText.length < 500 && el.innerText.length > 10;
      });

      // Dedup: if A contains B, keep B (the smaller one)
      const uniqueCards = productCards.filter(card => {
        return !productCards.some(other => other !== card && card.contains(other));
      });

      uniqueCards.forEach(card => {
        const imgEl = card.querySelector('img');
        const img = imgEl ? imgEl.src : null;
        const text = card.innerText;
        // Naive parser
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        // Price usually is the one with €
        const priceLine = lines.find(l => l.includes('€'));
        const price = priceLine ? parseFloat(priceLine.replace(',', '.').replace(/[^\d.]/g, '')) : 0;
        
        // Title is usually the first line that is not "Madagascar" or "Bio" or the Price
        const title = lines.find(l => l !== priceLine && l !== 'Madagascar' && l !== 'Bio' && l.length > 3);
        
        if (title && price > 0 && img) {
          items.push({
            name: title,
            price,
            image: img,
            category: 'Épicerie' // Default
          });
        }
      });
      
      return items;
    });

    for (const item of scrapedItems) {
      // Basic category detection
      let category = 'Épicerie';
      const lowerName = item.name.toLowerCase();
      if (lowerName.includes('miel') || lowerName.includes('honey')) category = 'Miels';
      else if (lowerName.includes('vanill')) category = 'Vanille';
      else if (lowerName.includes('poivre') || lowerName.includes('pepper') || lowerName.includes('salt') || lowerName.includes('sel')) category = 'Épices';
      else if (lowerName.includes('oil') || lowerName.includes('huile')) category = 'Huiles';
      else if (lowerName.includes('jam') || lowerName.includes('confiture')) category = 'Confitures';

      products.push({
        name: item.name,
        description: `Produit authentique de Madagascar. ${item.name}.`,
        category,
        price: item.price,
        image: item.image,
        vendor: 'Ilanga Nature'
      });
    }
    
  } catch (e) {
    console.error('Error scraping Ilanga:', e);
  } finally {
    await browser.close();
  }
  
  console.log(`✅ Found ${products.length} products from Ilanga Nature.`);

  return {
    producer: {
      name: 'Ilanga Nature',
      slug: 'ilanga-nature',
      type: 'company',
      description_i18n: {
        fr: "Produits naturels et éthiques de Madagascar.",
        en: "Natural and ethical products from Madagascar."
      },
      story_i18n: {
        fr: "ILANGA NATURE est une entreprise familiale née de la volonté de relancer l'apiculture à Madagascar. Nous collaborons directement avec les apiculteurs pour offrir des miels d'exception, des confitures et des épices, tout en protégeant la biodiversité.",
        en: "ILANGA NATURE is a family business born from the desire to revive beekeeping in Madagascar. We collaborate directly with beekeepers to offer exceptional honeys, jams, and spices, while protecting biodiversity."
      },
      address_city: 'Antananarivo',
      address_country_code: 'MG',
      contact_website: 'https://www.ilanga-nature.com',
      status: 'active'
    },
    products
  };
}
