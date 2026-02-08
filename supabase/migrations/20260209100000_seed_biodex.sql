-- Add missing columns to species table to match frontend types
ALTER TABLE investment.species ADD COLUMN IF NOT EXISTS habitat text[];
ALTER TABLE investment.species ADD COLUMN IF NOT EXISTS threats text[];
ALTER TABLE investment.species ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE investment.species ADD COLUMN IF NOT EXISTS gallery_urls text[];

-- Update project_type enum to support more diverse projects
-- Note: ALTER TYPE ... ADD VALUE cannot be executed inside a transaction block in some Postgres versions.
-- Supabase migrations run in transactions by default.
-- However, we can use a DO block to catch errors if the value already exists, 
-- or just try to add it. But 'ADD VALUE IF NOT EXISTS' is supported in newer Postgres (12+).
-- If this fails, we might need to separate it.
ALTER TYPE investment.project_type ADD VALUE IF NOT EXISTS 'forest';
ALTER TYPE investment.project_type ADD VALUE IF NOT EXISTS 'marine';

-- Seed Species Data
INSERT INTO investment.species (
  id, 
  scientific_name, 
  conservation_status, 
  name_i18n, 
  description_i18n, 
  habitat, 
  threats, 
  content_levels, 
  image_url,
  gallery_urls,
  is_featured,
  is_endemic
)
VALUES
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Apis mellifera mellifera',
    'EN',
    '{"fr": "Abeille Noire", "en": "Black Bee"}',
    '{"fr": "L''abeille noire est une sous-espèce de l''abeille domestique européenne. Elle est rustique et adaptée aux climats locaux.", "en": "The black bee is a subspecies of the European honey bee. It is hardy and adapted to local climates."}',
    ARRAY['Forêts', 'Prairies', 'Zones bocagères'],
    ARRAY['Pesticides', 'Hybridation', 'Frelon asiatique', 'Maladies'],
    '{"level_1": {"title": "Ouvrière", "description": "Vous commencez à comprendre le rôle vital de la pollinisation.", "unlocked_at_level": 1}, "level_5": {"title": "Reine", "description": "Vous êtes un expert de la colonie.", "unlocked_at_level": 5}}',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
    ARRAY['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800'],
    true,
    true
  ),
  (
    'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    'Lynx lynx',
    'VU',
    '{"fr": "Lynx Boréal", "en": "Eurasian Lynx"}',
    '{"fr": "Le lynx boréal est le plus grand félin sauvage d''Europe. Discret et solitaire, il joue un rôle clé dans la régulation des populations d''ongulés.", "en": "The Eurasian lynx is the largest wild cat in Europe. Discreet and solitary, it plays a key role in regulating ungulate populations."}',
    ARRAY['Forêts denses', 'Montagnes', 'Massifs forestiers'],
    ARRAY['Braconnage', 'Fragmentation de l''habitat', 'Collisions routières'],
    '{"level_1": {"title": "Pisteur", "description": "Vous savez reconnaître les traces du fantôme des bois.", "unlocked_at_level": 1}, "level_5": {"title": "Gardien", "description": "Vous protégez activement le territoire du lynx.", "unlocked_at_level": 5}}',
    'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?auto=format&fit=crop&q=80&w=800',
    ARRAY['https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?auto=format&fit=crop&q=80&w=800'],
    true,
    false
  ),
  (
    'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
    'Posidonia oceanica',
    'NT',
    '{"fr": "Posidonie", "en": "Posidonia"}',
    '{"fr": "La posidonie est une plante à fleurs marine endémique de la Méditerranée. Ses herbiers sont le poumon de la mer et abritent une biodiversité exceptionnelle.", "en": "Posidonia is a marine flowering plant endemic to the Mediterranean. Its meadows are the lungs of the sea and harbor exceptional biodiversity."}',
    ARRAY['Fonds marins', 'Méditerranée', 'Zones côtières'],
    ARRAY['Ancrage des bateaux', 'Pollution', 'Réchauffement de l''eau'],
    '{"level_1": {"title": "Plongeur", "description": "Vous découvrez la richesse des herbiers.", "unlocked_at_level": 1}, "level_5": {"title": "Océanographe", "description": "Les secrets de la Méditerranée n''ont plus de mystère pour vous.", "unlocked_at_level": 5}}',
    'https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&q=80&w=800',
    ARRAY['https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&q=80&w=800'],
    true,
    true
  ),
  (
    'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    'Testudo hermanni',
    'NT',
    '{"fr": "Tortue d''Hermann", "en": "Hermann''s Tortoise"}',
    '{"fr": "La tortue d''Hermann est la seule tortue terrestre sauvage de France métropolitaine. Elle est menacée par la destruction de son habitat.", "en": "Hermann''s tortoise is the only wild land tortoise in mainland France. It is threatened by habitat destruction."}',
    ARRAY['Maquis', 'Garrigues', 'Vignes'],
    ARRAY['Incendies', 'Urbanisation', 'Prélèvement sauvage'],
    '{"level_1": {"title": "Observateur", "description": "Vous apprenez à respecter le rythme de la tortue.", "unlocked_at_level": 1}, "level_5": {"title": "Protecteur", "description": "Vous veillez sur les derniers refuges de l''espèce.", "unlocked_at_level": 5}}',
    'https://images.unsplash.com/photo-1458571037713-913d8b481dc6?auto=format&fit=crop&q=80&w=800',
    ARRAY['https://images.unsplash.com/photo-1458571037713-913d8b481dc6?auto=format&fit=crop&q=80&w=800'],
    true,
    false
  )
ON CONFLICT (id) DO UPDATE SET
  scientific_name = EXCLUDED.scientific_name,
  conservation_status = EXCLUDED.conservation_status,
  name_i18n = EXCLUDED.name_i18n,
  description_i18n = EXCLUDED.description_i18n,
  habitat = EXCLUDED.habitat,
  threats = EXCLUDED.threats,
  content_levels = EXCLUDED.content_levels,
  image_url = EXCLUDED.image_url,
  gallery_urls = EXCLUDED.gallery_urls,
  is_featured = EXCLUDED.is_featured,
  is_endemic = EXCLUDED.is_endemic;

-- Seed Projects linked to species
DO $$
DECLARE
  v_producer_id uuid;
BEGIN
  -- Get the first producer, or insert one if none exist
  SELECT id INTO v_producer_id FROM investment.producers LIMIT 1;
  
  IF v_producer_id IS NULL THEN
    INSERT INTO investment.producers (name_i18n, type, status, contact_email)
    VALUES ('{"fr": "Producteur Test", "en": "Test Producer"}', 'association', 'active', 'test@example.com')
    RETURNING id INTO v_producer_id;
  END IF;

  INSERT INTO investment.projects (
    slug, 
    producer_id, 
    species_id, 
    type, 
    target_budget, 
    current_funding, 
    status, 
    name_i18n, 
    description_i18n, 
    hero_image_url
  )
  VALUES
    (
      'sauvons-abeille-noire',
      v_producer_id,
      'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', -- Abeille
      'beehive',
      150000, -- Points
      45000,
      'active',
      '{"fr": "Sauvons l''Abeille Noire en Bretagne", "en": "Save the Black Bee in Brittany"}',
      '{"fr": "Parrainez des ruches pour préserver l''abeille noire locale et soutenir la pollinisation. Ce projet vise à installer 50 ruches dans des zones protégées.", "en": "Sponsor hives to preserve the local black bee and support pollination. This project aims to install 50 hives in protected areas."}',
      'https://images.unsplash.com/photo-1523950247076-4d0186171baf?auto=format&fit=crop&q=80&w=800'
    ),
    (
      'reforestation-lynx',
      v_producer_id,
      'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', -- Lynx
      'forest',
      500000,
      120000,
      'active',
      '{"fr": "Corridors écologiques pour le Lynx", "en": "Ecological Corridors for the Lynx"}',
      '{"fr": "Plantation d''arbres pour reconnecter les massifs forestiers et permettre au lynx de circuler en toute sécurité.", "en": "Planting trees to reconnect forest masses and allow the lynx to roam safely."}',
      'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800'
    ),
    (
      'protection-herbiers',
      v_producer_id,
      'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', -- Posidonie
      'marine',
      300000,
      280000,
      'active',
      '{"fr": "Sanctuaire de Posidonie", "en": "Posidonia Sanctuary"}',
      '{"fr": "Installation de mouillages écologiques pour protéger les herbiers de posidonie des ancres de bateaux.", "en": "Installation of ecological moorings to protect Posidonia meadows from boat anchors."}',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800'
    ),
    (
      'refuge-tortues',
      v_producer_id,
      'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', -- Tortue
      'vineyard',
      100000,
      15000,
      'active',
      '{"fr": "Vignes refuges pour la Tortue", "en": "Vineyard Refuges for the Tortoise"}',
      '{"fr": "Aménagement de zones refuges au sein des vignobles pour protéger les tortues lors des vendanges et favoriser leur reproduction.", "en": "Development of refuge areas within vineyards to protect tortoises during harvest and encourage reproduction."}',
      'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=800'
    )
  ON CONFLICT (slug) DO UPDATE SET
    producer_id = EXCLUDED.producer_id,
    species_id = EXCLUDED.species_id,
    type = EXCLUDED.type,
    target_budget = EXCLUDED.target_budget,
    current_funding = EXCLUDED.current_funding,
    status = EXCLUDED.status,
    name_i18n = EXCLUDED.name_i18n,
    description_i18n = EXCLUDED.description_i18n,
    hero_image_url = EXCLUDED.hero_image_url;
END $$;
