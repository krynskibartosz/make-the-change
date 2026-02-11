# Données pour l'intégration frontend des paiements

## Configuration Supabase

**URL**: `https://ebmjxinsyyjwshnynwwu.supabase.co`
**Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibWp4aW5zeXlqd3Nobnlud3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTkxOTEsImV4cCI6MjA3MjA5NTE5MX0.LabNGcAN6XQuv6alj7oCLty5E3rG9fRrZeBZZDkJ-Eo`
**Publishable Key**: `sb_publishable_YP46LVcoks4DKSDsGCqetg_Ca9UZI5k`

## Schéma des tables

### Products (commerce.products)
```typescript
interface Product {
  id: string;                    // UUID
  slug: string;                  // URL-friendly name
  category_id: string;           // UUID
  producer_id: string;           // UUID
  price_points: number;          // Prix en points
  price_eur_equivalent: string;  // Prix en EUR (decimal)
  fulfillment_method: 'ship' | 'pickup' | 'digital' | 'experience' | 'dropship' | 'ondemand';
  is_hero_product: boolean;
  stock_quantity: number;
  stock_management: boolean;
  weight_grams: number | null;
  dimensions: object | null;
  tags: string[];
  variants: object;
  nutrition_facts: object;
  allergens: string[];           // enum: gluten, lactose, nuts, etc.
  certifications: string[];      // enum: bio, organic, fair_trade, etc.
  seasonal_availability: object;
  min_tier: 'explorateur' | 'protecteur' | 'ambassadeur';
  featured: boolean;
  is_active: boolean;
  launch_date: string | null;
  discontinue_date: string | null;
  seo_title: string | null;
  seo_description: string | null;
  metadata: object;
  created_at: string;
  updated_at: string;
  secondary_category_id: string | null;
  partner_source: 'direct' | 'cooperative' | 'partner' | 'marketplace';
  deleted_at: string | null;
  name_i18n: {                  // Noms multilingues
    en: string;
    fr: string;
    nl?: string;
  };
  description_i18n: {
    en: string;
    fr: string;
    nl?: string;
  };
  short_description_i18n: {
    en: string;
    fr: string;
    nl?: string;
  };
  name_default: string;         // Généré: FR > EN > NL
  description_default: string;
  search_vector: string;
  origin_country: string | null;
  created_by: string | null;
  updated_by: string | null;
  short_description_default: string;
  images: string[];             // URLs des images
  seo_title_i18n: object;
  seo_description_i18n: object;
  seo_keywords: string | null;
}
```

### Categories (commerce.categories)
```typescript
interface Category {
  id: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  metadata: object;
  path_ltree: string | null;
  depth: number | null;
  root_id: string | null;
  name_i18n: {
    en: string;
    fr: string;
    nl?: string;
  };
  description_i18n: {
    en: string;
    fr: string;
    nl?: string;
  };
  name_default: string;
  description_default: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}
```

### Orders (commerce.orders)
```typescript
interface Order {
  id: string;
  user_id: string;
  subtotal_points: number;
  shipping_cost_points: number;
  tax_points: number;
  total_points: number;
  points_used: number;
  points_earned: number;
  payment_method: 'mixed' | 'points' | 'stripe_bank_transfer' | 'stripe_card' | 'stripe_sepa';
  stripe_payment_intent_id: string | null;
  shipping_address: {
    city: string;
    street: string;
    country: string;
  };
  billing_address: object | null;
  tracking_number: string | null;
  carrier: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
  deleted_at: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  updated_by: string | null;
  total_amount: string | null;   // EUR amount
  currency: string;            // 'EUR'
  created_by: string | null;
}
```

### Order Items (commerce.order_items)
```typescript
interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_points: number;
  total_price_points: number;
  product_snapshot: object | null;
  created_at: string;
  deleted_at: string | null;
  unit_price_amount: string | null;  // EUR amount
  total_price_amount: string | null;
}
```

### Profiles (public.profiles)
```typescript
interface Profile {
  id: string;
  email: string;
  email_verified_at: string | null;
  last_login_at: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  phone: string | null;
  bio: string | null;
  address_street: string | null;
  address_city: string | null;
  address_postal_code: string | null;
  address_country_code: string | null;
  language_code: string;        // 'fr', 'en', 'nl'
  timezone: string;             // 'Europe/Paris'
  notification_preferences: object;
  social_links: object;
  user_level: 'explorateur' | 'protecteur' | 'ambassadeur';
  kyc_status: 'pending' | 'light' | 'complete' | 'rejected';
  kyc_level: number | null;
  metadata: object;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  points_balance: number;
  is_public: boolean;
  avatar_url: string | null;
  cover_url: string | null;
  theme_config: object;
}
```

## Exemples de données réelles

### Produits disponibles
```json
{
  "huile_olive": {
    "id": "e8f78510-93f8-4f08-a020-87d08d4b438d",
    "slug": "huile-olive-extra-vierge",
    "name_default": "Huile d'Olive Extra Vierge 750ml",
    "description_default": "Huile d'olive extra vierge première pression à froid",
    "price_points": 1800,
    "price_eur_equivalent": "18.00",
    "stock_quantity": 29,
    "images": ["https://ebmjxinsyyjwshnynwwu.supabase.co/storage/v1/object/public/products/e8f78510-93f8-4f08-a020-87d08d4b438d/gallery/1770580150243-vwoyhm84h-image-1770580149377.jpg"]
  },
  "miel_foret": {
    "id": "3342feab-e8aa-440f-a66f-3a9ee563a59a",
    "slug": "miel-foret-250g",
    "name_default": "Miel de Forêt 250g",
    "description_default": "Miel de forêt au goût prononcé et caractère unique",
    "price_points": 800,
    "price_eur_equivalent": "8.00",
    "stock_quantity": 39
  },
  "visite_ferme": {
    "id": "1cabd434-9d3f-4032-b5d8-18a3d94af628",
    "slug": "visite-ferme-guidee",
    "name_default": "Visite Guidée de la Ferme",
    "description_default": "Découvrez notre ferme bio lors d'une visite guidée de 2h",
    "price_points": 2000,
    "price_eur_equivalent": "20.00",
    "fulfillment_method": "experience",
    "stock_quantity": 10
  }
}
```

### Catégories principales
```json
{
  "miel": {
    "id": "b56a39e3-0dee-491e-b269-a066587c35a8",
    "slug": "miel-produits-ruche",
    "name_default": "Miel & Produits de la ruche",
    "description_default": "Miel, pollen, propolis et autres produits de la ruche"
  },
  "huiles": {
    "id": "97b51c95-88b0-4e68-80e2-53defa39345e",
    "slug": "huiles-vinaigres",
    "name_default": "Huiles & Vinaigres",
    "description_default": "Huiles d'olive, vinaigres balsamiques et condiments"
  },
  "soins": {
    "id": "b1f73976-2e4f-4e17-af6c-6a9a261ff22f",
    "slug": "soins",
    "name_default": "Soins",
    "description_default": ""
  }
}
```

### Exemple de commande
```json
{
  "id": "1ba343f8-5d43-41ca-98d6-113c7fd9bff3",
  "user_id": "498fbc9e-18cd-439c-b5a5-1d40585217da",
  "subtotal_points": 8400,
  "total_points": 8400,
  "payment_method": "points",
  "shipping_address": {
    "city": "Paris",
    "street": "123 Rue de la Paix",
    "country": "FR"
  },
  "status": "completed",
  "created_at": "2026-02-08T22:16:19.634124+00:00"
}
```

## Méthodes de paiement disponibles
- `points` - Paiement par points (actuellement utilisé)
- `stripe_card` - Carte de crédit via Stripe
- `stripe_sepa` - Virement SEPA via Stripe
- `stripe_bank_transfer` - Virement bancaire via Stripe
- `mixed` - Combinaison de plusieurs méthodes

## Statuts de commande
- `pending` - En attente
- `processing` - En traitement
- `shipped` - Expédié
- `delivered` - Livré
- `cancelled` - Annulé
- `refunded` - Remboursé

## Niveaux d'utilisateur
- `explorateur` - Niveau débutant
- `protecteur` - Niveau intermédiaire
- `ambassadeur` - Niveau avancé

## Notes importantes pour le frontend
1. **Internationalisation**: Tous les textes sont disponibles en FR/EN/NL via les champs `*_i18n`
2. **Points**: 1 point = 0.01 EUR (100 points = 1€)
3. **Images**: Stockées dans Supabase Storage avec l'URL base: `https://ebmjxinsyyjwshnynwwu.supabase.co/storage/v1/object/public/`
4. **RLS**: Toutes les tables ont Row Level Security activé
5. **Stripe**: La table `stripe_events` est prête mais vide - nécessite configuration
6. **Adresses**: Format simple avec street/city/country pour le shipping
