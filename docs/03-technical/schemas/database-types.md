# Database Types & Enums - Make the CHANGE

 Scope: Canonical enums and constraints referenced by backend logic.

## Enums
- fulfillment_method: ship | pickup | digital | experience
- user_level_enum: explorateur | protecteur | ambassadeur
- product_partner_source: direct | cooperative | partner | marketplace
- allergen_enum: gluten | lactose | nuts | peanuts | eggs | fish | shellfish | soy | sesame | sulfites | celery | mustard | lupin
- certification_enum: bio | organic | fair_trade | vegan | vegetarian | halal | kosher | gluten_free | non_gmo | rainforest_alliance | msc | fsc | ecocert | demeter

## Constraints (actuelles)
- PKs sur toutes les tables Drizzle (UUID).
- Aucune contrainte unique ou index secondaire explicitement défini dans Drizzle à ce stade.

## À prévoir (si besoin)
- Index sur `slug`, `created_at`, `user_id` selon les requêtes réelles.
- Contraintes uniques sur `slug` pour `projects`, `products`, `categories` si validé métier.

## References
- `../database-schema.md`
- `packages/core/src/shared/db/schema.ts`
