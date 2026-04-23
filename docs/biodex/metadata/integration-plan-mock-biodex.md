# Plan d'Intégration - mock-biodex.ts

Document de préparation pour l'intégration des données scientifiques validées dans `apps/web-client/src/lib/mock/mock-biodex.ts`.

## Corrections Requises

### 1. Noms Scientifiques à Corriger (11 espèces)

| Espèce | Ancien nom scientifique | Nouveau nom scientifique | ID Mock |
|--------|------------------------|--------------------------|---------|
| Abeille noire | Apis mellifera mellifera | Apis mellifera unicolor | MOCK_SPECIES_BLACK_BEE_ID |
| Osmie rousse | Osmia rufa | Osmia bicornis | MOCK_SPECIES_OSMIA_ID |
| Mégachile | Megachile sp. | Megachile centuncularis | MOCK_SPECIES_MEGACHILE_ID |
| Syrphe ceinturé | Syrphus ribesii | Episyrphus balteatus | MOCK_SPECIES_SYRPHID_ID |
| Gecko diurne | Phelsuma sp. | Phelsuma laticauda | MOCK_SPECIES_GECKO_ID |
| Chouette chevêche | Athene noctua | Athene superciliaris | MOCK_SPECIES_LITTLE_OWL_ID |
| Acropora corne de cerf | Acropora spp. | Acropora muricata | MOCK_SPECIES_ACROPORA_ID |
| Poisson clown | Amphiprion spp. | Amphiprion ocellaris | MOCK_SPECIES_CLOWNFISH_ID |
| Demoiselle bleue | Chrysiptera spp. | Chrysiptera cyanea | MOCK_SPECIES_BLUE_DEMOISELLE_ID |
| Poisson-papillon | Chaetodon spp. | Chaetodon auriga | MOCK_SPECIES_BUTTERFLYFISH_ID |
| Hippocampe | Hippocampus spp. | Hippocampus bargibanti | MOCK_SPECIES_SEAHORSE_ID |

### 2. Statuts IUCN à Mettre à Jour (1 espèce)

| Espèce | Ancien statut | Nouveau statut | Raison |
|--------|---------------|----------------|--------|
| Hérisson européen | LC | NT | Reclassé par IUCN en 2024 |

### 3. Espèces à Ajouter (2 espèces)

Les espèces suivantes doivent être ajoutées au BioDex avec de nouveaux IDs :

#### Liotrigona bitika (Abeille pollinisatrice - Antsirabe)
- **Nom français** : Abeille pollinisatrice
- **Nom scientifique** : Liotrigona bitika
- **Statut IUCN** : NE (Non évalué)
- **Projet** : Antsirabe (Madagascar)
- **Description** : Considérée comme la plus petite abeille sans dard du monde, plus petite qu'une drosophile. Sa taille microscopique lui permet de polliniser des fleurs endémiques minuscules.
- **Habitats** : Forêts pluviales, Lisières forestières, Grands arbres de nidification
- **Menaces** : Perte de grands arbres de nidification, Compétition avec les fourmis invasives
- **Image** : À définir

#### Apis mellifera ligustica (Abeille mellifère italienne - Sardaigne)
- **Nom français** : Abeille mellifère italienne
- **Nom scientifique** : Apis mellifera ligustica
- **Statut IUCN** : NE (Non évalué)
- **Projet** : Sardaigne (Italie)
- **Description** : Sous-espèce apicole extrêmement populaire originaire de la péninsule italienne. Elle soutient le rendement commercial et la résilience florale des paysages secs.
- **Habitats** : Maquis, Vergers, Zones agroforestières, Jardins
- **Menaces** : Acariens parasites (Varroa), Pesticides systémiques, Aléas climatiques
- **Image** : À définir

### 4. Descriptions à Mettre à Jour (Toutes les espèces)

Les descriptions actuelles sont mockées et doivent être remplacées par les descriptions scientifiques validées. Voir les fichiers markdown individuels dans `docs/biodex/species-data/` pour les descriptions exactes.

### 5. Habitats à Mettre à Jour (Toutes les espèces)

Les listes d'habitats actuelles doivent être remplacées par les données scientifiques validées. Voir les fichiers markdown individuels pour les habitats exacts.

### 6. Menaces à Mettre à Jour (Toutes les espèces)

Les listes de menaces actuelles doivent être remplacées par les données scientifiques validées. Voir les fichiers markdown individuels pour les menaces exactes.

## Ordre de Priorité

1. **HIGH** : Corriger les 11 noms scientifiques
2. **HIGH** : Mettre à jour le statut IUCN du Hérisson (LC → NT)
3. **MEDIUM** : Ajouter les 2 espèces manquantes (nécessite création de nouveaux IDs)
4. **MEDIUM** : Mettre à jour les descriptions, habitats et menaces

## Notes Techniques

- Les IDs des espèces existantes ne doivent pas changer
- Les nouvelles espèces nécessitent la création de nouveaux IDs dans `mock-ids.ts`
- Conserver la structure existante de `MOCK_SPECIES`
- Maintenir les relations avec les projets, producteurs et défis existants
- Les images actuelles peuvent être conservées sauf pour les nouvelles espèces

## Fichiers à Modifier

1. `apps/web-client/src/lib/mock/mock-ids.ts` - Ajouter les nouveaux IDs pour les 2 espèces
2. `apps/web-client/src/lib/mock/mock-biodex.ts` - Mettre à jour les données scientifiques
