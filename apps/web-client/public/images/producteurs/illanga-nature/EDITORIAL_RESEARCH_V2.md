# Ilanga Nature — Recherche éditoriale complémentaire (V2)
> Complément Puppeteer — Make the Change · Mai 2026  
> Droits d'usage assets : **autorisés par Ilanga Nature**  
> Sources : ilanga-nature.com · miarakap.com · blog Ilanga

---

## Résumé exécutif

Cette V2 complète la recherche initiale sur 7 axes :
1. **Réseau apicole** — pas de chiffre précis publié ; formulations prudentes établies.
2. **Mielleries** — 3 fixes + 2 mobiles + 1 barge confirmées avec rôles détaillés.
3. **Barge Canal des Pangalanes** — confirmée, soutenue par Miarakap/Mitsiry.
4. **Biodiversité** — flore mellifère identifiée par variété ; espèce abeille probable *Apis mellifera unicolor* (non mentionnée directement) ; lémurs liés visuellement, pas biologiquement aux ruches ; association ADAMA (protection forêts) découverte.
5. **Produits & terroirs** — 12 miels + vanilles Manakara/Manoro + épices + confitures documentés.
6. **File de téléchargement assets** — 14 URLs prioritisées.
7. **Wording final** — textes prêts à intégrer.

---

## 1. Réseau apicole

```json
{
  "apicultureNetwork": {
    "beekeepersCount": null,
    "hivesCount": null,
    "communitiesCount": null,
    "trainingCount": null,
    "notes": "Aucun chiffre précis publié sur le site officiel ou Miarakap. La page Notre Histoire mentionne 'apiculteurs locaux' et 'réseau de petits producteurs' sans quantifier. Miarakap indique 42 collaborateurs au total (pas uniquement apiculteurs).",
    "sourceUrls": [
      "https://www.ilanga-nature.com/notre-histoire",
      "https://miarakap.com/entrepreneur/ilanga-nature/"
    ],
    "confidence": "uncertain",
    "safeWording": "un réseau de petits producteurs et d'apiculteurs partenaires à Madagascar — nombre exact non publié"
  }
}
```

> ⚠️ **Ne pas inventer de chiffre.** Pour la page Make the Change, utiliser : *"un réseau d'apiculteurs partenaires"* sans quantifier, sauf obtention directe d'Ilanga Nature.

---

## 2. Mielleries — détail complet

```json
{
  "honeyFacilities": [
    {
      "type": "fixed",
      "location": "Antananarivo (Analamanga)",
      "description": "Première miellerie créée. Centre de transformation principal. Contrôle qualité, déshumidification (16–18%), filtration, maturation, conditionnement. Homologuée Ministère de l'Élevage.",
      "imageUrl": "https://www.ilanga-nature.com/web/image/185599-103f02d9/Usine_Miellerie_2.0-10.jpg",
      "sourceUrl": "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar",
      "confidence": "confirmed"
    },
    {
      "type": "fixed",
      "location": "Manakara (Fitovinany)",
      "description": "Deuxième miellerie fixe. Zone côtière est de Madagascar, riche en litchi et plantes mellifères. Certifiée Ecocert pour miels biologiques.",
      "imageUrl": "https://www.ilanga-nature.com/web/image/185601-a09d1147/Miellerie_Manakara_RFI-34.webp",
      "sourceUrl": "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar",
      "confidence": "confirmed"
    },
    {
      "type": "fixed",
      "location": "Fort-Dauphin / Tôlanaro (Anosy)",
      "description": "Troisième miellerie fixe, construite avec le soutien Miarakap (Matching Grant Mitsiry). Région du Grand Sud, zone aride à biodiversité unique (cactus, forêts sèches). Siège de l'école d'apiculture 'Académie Ilanga'.",
      "imageUrl": "https://www.ilanga-nature.com/web/image/206632-772d6f87/ed177e47-7604-4a59-8622-b9227f63c289.webp",
      "sourceUrl": "https://miarakap.com/entrepreneur/ilanga-nature/",
      "confidence": "confirmed"
    },
    {
      "type": "mobile",
      "location": "Déployées dans les zones de production (zones reculées Madagascar)",
      "description": "2 unités mobiles d'extraction. Collectent le miel en un seul passage pour minimiser la perturbation des ruches et des écosystèmes. Transportent ensuite vers les centres de traitement fixes.",
      "imageUrl": "https://www.ilanga-nature.com/web/image/206633-5f4f6fd4/84198ffc-3d3e-47bf-927b-2df792ecef0e.webp",
      "sourceUrl": "https://www.ilanga-nature.com/nos-valeurs",
      "confidence": "confirmed"
    },
    {
      "type": "barge",
      "location": "Canal des Pangalanes (côte est, entre Manakara et Antananarivo)",
      "description": "Barge à ruches motorisée sur le canal des Pangalanes. Permet d'atteindre les apiculteurs dans des zones inaccessibles par route. Financée en partie via le Matching Grant Program Mitsiry de Miarakap.",
      "imageUrl": null,
      "sourceUrl": "https://miarakap.com/entrepreneur/ilanga-nature/",
      "confidence": "confirmed"
    }
  ]
}
```

---

## 3. Barge Canal des Pangalanes

```json
{
  "barge": {
    "confirmed": true,
    "location": "Canal des Pangalanes — côte est de Madagascar, entre Farafangana et Manakara",
    "description": "Barge à ruches motorisée permettant l'accès aux apiculteurs en zones reculées le long du canal. Utilisée pour la collecte, le transport des ruches et du miel brut vers les mielleries fixes. Logistique légère conçue pour minimiser l'impact environnemental.",
    "imageCandidates": [],
    "sourceUrls": [
      "https://miarakap.com/entrepreneur/ilanga-nature/",
      "https://www.ilanga-nature.com/nos-valeurs"
    ],
    "miarakapSupport": "Subvention de contrepartie Mitsiry pour la mise en place de la barge apicole (mentionné explicitement dans l'appui Miarakap)",
    "safeWording": "une barge apicole motorisée sur le canal des Pangalanes, associée à la collecte du miel dans les zones reculées de la côte est malgache"
  }
}
```

> ⚠️ Aucune photo de la barge trouvée publiquement. À demander directement à Ilanga Nature.

---

## 4. Espèces et biodiversité

```json
{
  "biodiversity": [
    {
      "name": "Abeille mellifère de Madagascar",
      "scientificName": "Apis mellifera unicolor (probable)",
      "relationToIlanga": "direct",
      "habitat": "Forêts tropicales humides, zones sèches, zones côtières de Madagascar",
      "sourceUrl": "https://www.ilanga-nature.com/en/blog/honey-from-madagascar-9/why-choose-honey-from-madagascar-3",
      "confidence": "probable",
      "safeWording": "les abeilles mellifères de Madagascar — espèce locale probablement Apis mellifera unicolor, non mentionnée explicitement par Ilanga"
    },
    {
      "name": "Litchi",
      "scientificName": "Litchi chinensis",
      "relationToIlanga": "direct",
      "habitat": "Côte est de Madagascar (Manakara, Fitovinany) — zone tropicale humide",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "confirmed",
      "safeWording": "le miel de litchi est produit à partir des fleurs du litchi (Litchi chinensis), cultivé sur la côte est de Madagascar"
    },
    {
      "name": "Niaouli",
      "scientificName": "Melaleuca quinquenervia",
      "relationToIlanga": "direct",
      "habitat": "Savanes et zones humides de Madagascar",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "confirmed",
      "safeWording": "le miel de niaouli est lié à Melaleuca quinquenervia, espèce mellifère présente dans les savanes malgaches"
    },
    {
      "name": "Cactus (opuntia ou espèce endémique locale)",
      "scientificName": "Opuntia sp. (probable pour Grand Sud)",
      "relationToIlanga": "direct",
      "habitat": "Grand Sud de Madagascar (Anosy, zones arides) — Fort-Dauphin",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "probable",
      "safeWording": "le miel de cactus est associé à la flore succulente du Grand Sud malgache — espèce exacte à confirmer"
    },
    {
      "name": "Jujubier",
      "scientificName": "Ziziphus jujuba",
      "relationToIlanga": "direct",
      "habitat": "Zones chaudes et sèches de Madagascar",
      "sourceUrl": "https://www.ilanga-nature.com/en/blog/honey-from-madagascar-9/discover-the-honey-of-jujube-tree-of-madagascar-a-treasure-of-nature-41",
      "confidence": "confirmed",
      "safeWording": "le miel de jujubier est produit à partir des fleurs du jujubier (Ziziphus jujuba), espèce des zones arides de Madagascar"
    },
    {
      "name": "Eucalyptus",
      "scientificName": "Eucalyptus sp.",
      "relationToIlanga": "direct",
      "habitat": "Zones reboisées de Madagascar",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "confirmed",
      "safeWording": "le miel d'eucalyptus est lié aux plantations d'eucalyptus, présentes dans plusieurs régions de Madagascar"
    },
    {
      "name": "Baobab",
      "scientificName": "Adansonia sp. (6 espèces endémiques à Madagascar)",
      "relationToIlanga": "ecosystem",
      "habitat": "Grand Sud de Madagascar (Anosy) — région de Fort-Dauphin",
      "sourceUrl": "https://www.ilanga-nature.com/en/blog/travel-8/the-grand-south-of-madagascar-69",
      "confidence": "confirmed",
      "safeWording": "les baobabs géants sont présents dans les zones d'intervention du Grand Sud — espèce écosystème, non directement liée aux ruches Ilanga"
    },
    {
      "name": "Lémuriens (espèces non précisées)",
      "scientificName": "Lemur catta (probable pour le Grand Sud) et autres",
      "relationToIlanga": "illustrative",
      "habitat": "Forêts et zones sèches de Madagascar, notamment Grand Sud (Anosy)",
      "sourceUrl": "https://www.ilanga-nature.com/nos-valeurs",
      "confidence": "probable",
      "safeWording": "les lémuriens sont présents dans les écosystèmes où Ilanga intervient — présence visuellement illustrée sur le site officiel (FORT-DAUPHIN-LEMURES.webp), lien avec les ruches illustratif et non démontré"
    },
    {
      "name": "Vanille Bourbon",
      "scientificName": "Vanilla planifolia",
      "relationToIlanga": "direct",
      "habitat": "Manakara et région de Manoro, côte est de Madagascar",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/vanille-14",
      "confidence": "confirmed",
      "safeWording": "la vanille Bourbon (Vanilla planifolia) est cultivée dans la région de Manoro à l'est de Madagascar"
    },
    {
      "name": "Mokarana",
      "scientificName": "Espèce florale non identifiée publiquement",
      "relationToIlanga": "direct",
      "habitat": "Forêts humides de l'océan Indien / Madagascar",
      "sourceUrl": "https://www.ilanga-nature.com/en/blog/other-5/around-the-world-of-rare-honey-when-nature-becomes-exceptional-71",
      "confidence": "probable",
      "safeWording": "le miel de mokarana est associé à une flore mellifère spécifique des forêts humides malgaches — espèce botanique exacte non publiée"
    },
    {
      "name": "Forêts primaires et forêts sèches",
      "scientificName": "Divers (1000 espèces végétales endémiques citées)",
      "relationToIlanga": "direct",
      "habitat": "Ensemble du territoire malgache",
      "sourceUrl": "https://www.ilanga-nature.com/en/blog/honey-from-madagascar-9/why-choose-honey-from-madagascar-3",
      "confidence": "confirmed",
      "safeWording": "les miels 'forêts primaires' et 'forêts sèches' sont issus d'une flore mellifère endémique diverse — Madagascar compte 19 000 espèces botaniques dont 1 000 endémiques selon le blog Ilanga"
    },
    {
      "name": "Orchidées endémiques",
      "scientificName": "Aeranthes, Phajus, Grammangis (cités)",
      "relationToIlanga": "ecosystem",
      "habitat": "Forêts humides de Madagascar",
      "sourceUrl": "https://www.ilanga-nature.com/en/blog/honey-from-madagascar-9/why-choose-honey-from-madagascar-3",
      "confidence": "probable",
      "safeWording": "les orchidées endémiques malgaches (Aeranthes, Phajus, Grammangis) sont citées dans le contexte de la biodiversité pollinisée — lien indirect avec les abeilles Ilanga"
    }
  ]
}
```

---

## 5. Produits et terroirs

```json
{
  "productOrigins": [
    {
      "productName": "Miel de Litchi",
      "family": "honey",
      "origin": "Côte est de Madagascar — Manakara (Fitovinany)",
      "plantOrFloralSource": "Litchi chinensis",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "confirmed"
    },
    {
      "productName": "Miel de Niaouli",
      "family": "honey",
      "origin": "Madagascar (zones de savanes)",
      "plantOrFloralSource": "Melaleuca quinquenervia",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "confirmed"
    },
    {
      "productName": "Miel de Cactus",
      "family": "honey",
      "origin": "Grand Sud de Madagascar — Fort-Dauphin (Anosy)",
      "plantOrFloralSource": "Opuntia sp. (probable)",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "probable"
    },
    {
      "productName": "Miel de Baies Roses",
      "family": "honey",
      "origin": "Madagascar",
      "plantOrFloralSource": "Schinus terebinthifolia (baies roses) — source à confirmer",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "probable"
    },
    {
      "productName": "Miel d'Eucalyptus",
      "family": "honey",
      "origin": "Madagascar",
      "plantOrFloralSource": "Eucalyptus sp.",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "confirmed"
    },
    {
      "productName": "Miel de Jujubier (bio)",
      "family": "honey",
      "origin": "Zones sèches et chaudes de Madagascar",
      "plantOrFloralSource": "Ziziphus jujuba",
      "sourceUrl": "https://www.ilanga-nature.com/en/blog/honey-from-madagascar-9/discover-the-honey-of-jujube-tree-of-madagascar-a-treasure-of-nature-41",
      "confidence": "confirmed"
    },
    {
      "productName": "Miel de Mokarana (bio)",
      "family": "honey",
      "origin": "Forêts humides de Madagascar",
      "plantOrFloralSource": "Espèce florale non identifiée publiquement",
      "sourceUrl": "https://www.ilanga-nature.com/en/blog/other-5/around-the-world-of-rare-honey-when-nature-becomes-exceptional-71",
      "confidence": "probable"
    },
    {
      "productName": "Miel de Forêt Primaire / Rainforest",
      "family": "honey",
      "origin": "Forêts tropicales humides de Madagascar",
      "plantOrFloralSource": "Flore endémique diverse (multiflorale)",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "confirmed"
    },
    {
      "productName": "Miel de Forêt Sèche / Dry Forest",
      "family": "honey",
      "origin": "Grand Sud de Madagascar",
      "plantOrFloralSource": "Flore des zones arides malgaches",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/miels-4",
      "confidence": "confirmed"
    },
    {
      "productName": "Vanille Bourbon",
      "family": "vanilla",
      "origin": "Manoro — côte est de Madagascar (Manakara)",
      "plantOrFloralSource": "Vanilla planifolia",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/vanille-14",
      "confidence": "confirmed"
    },
    {
      "productName": "Vanille Tahiti",
      "family": "vanilla",
      "origin": "Polynésie Française",
      "plantOrFloralSource": "Vanilla tahitensis",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/vanille-14",
      "confidence": "confirmed"
    },
    {
      "productName": "Huile d'Olive",
      "family": "oil",
      "origin": "Sardaigne (Italie) — oliveraie avec 10 000 plants de variétés toscanes",
      "plantOrFloralSource": "Olea europaea (variétés toscanes dont une oubliée + sughero / chênes-lièges locaux)",
      "sourceUrl": "https://www.ilanga-nature.com/nos-valeurs",
      "confidence": "confirmed"
    },
    {
      "productName": "Épices (poivre noir, gingembre, cannelle, curcuma)",
      "family": "spice",
      "origin": "Madagascar",
      "plantOrFloralSource": "Piper nigrum, Zingiber officinale, Cinnamomum sp., Curcuma longa",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/epices-5",
      "confidence": "confirmed"
    },
    {
      "productName": "Confitures artisanales",
      "family": "jam",
      "origin": "Madagascar",
      "plantOrFloralSource": "Fruit de la passion, fruits exotiques locaux",
      "sourceUrl": "https://www.ilanga-nature.com/shop/category/confitures-6",
      "confidence": "confirmed"
    }
  ]
}
```

---

## 6. File de téléchargement assets (prioritisée)

> ✅ Usage autorisé par Ilanga Nature pour l'app Make the Change.  
> Conserver les crédits : "© Ilanga Nature" sur chaque asset utilisé.

```json
{
  "downloadQueue": [
    {
      "priority": 1,
      "url": "https://www.ilanga-nature.com/web/image/206634-05b3d4eb/FORT-DAUPHIN-LEMURES.webp",
      "sourcePage": "https://www.ilanga-nature.com/nos-valeurs",
      "recommendedFileName": "hero-lemures-miel-fort-dauphin.webp",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "hero",
      "alt": "Lémur de Madagascar aux côtés d'un pot de miel Ilanga Nature",
      "notes": "Image 962×962. Forte valeur émotionnelle. Meilleur candidat hero mobile. Bien cadrer pour format 16:9 ou portrait."
    },
    {
      "priority": 2,
      "url": "https://www.ilanga-nature.com/web/image/187239-d2e47bd8/FORT-DAUPHIN---APICULTEUR.webp",
      "sourcePage": "https://www.ilanga-nature.com/notre-histoire",
      "recommendedFileName": "portrait-apiculteur-fort-dauphin.webp",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "portrait",
      "alt": "Apiculteur au travail à Fort-Dauphin, Madagascar",
      "notes": "Image 962×962. Preuve terrain directe. Usage recommandé : section histoire ou preuves."
    },
    {
      "priority": 3,
      "url": "https://www.ilanga-nature.com/web/image/187219-b437b10a/Famille%20Laurent%20d%27Ilanga%20Nature.webp",
      "sourcePage": "https://www.ilanga-nature.com/",
      "recommendedFileName": "portrait-famille-laurent.webp",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "portrait",
      "alt": "La famille Laurent — Olivier, Nathan et Naya, fondateurs d'Ilanga Nature",
      "notes": "Image 962×641. Portrait famille fondatrice. Section 'Qui sont-ils ?'"
    },
    {
      "priority": 4,
      "url": "https://www.ilanga-nature.com/web/image/185601-a09d1147/Miellerie_Manakara_RFI-34.webp",
      "sourcePage": "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar",
      "recommendedFileName": "miellerie-manakara-exterieur.webp",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "proof",
      "alt": "Miellerie Ilanga Nature à Manakara, Madagascar",
      "notes": "1920×1080. Meilleure image extérieure de miellerie. Nom de fichier contient 'RFI' — vérifier si source RFI ou photo interne Ilanga."
    },
    {
      "priority": 5,
      "url": "https://www.ilanga-nature.com/web/image/185599-103f02d9/Usine_Miellerie_2.0-10.jpg",
      "sourcePage": "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar",
      "recommendedFileName": "miellerie-interieur-01.jpg",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "proof",
      "alt": "Intérieur de la miellerie Ilanga Nature à Madagascar",
      "notes": "1920×1080. Photo intérieure de transformation. Section preuves / crédibilité."
    },
    {
      "priority": 6,
      "url": "https://www.ilanga-nature.com/web/image/185600-d4e18453/Usine_Miellerie_2.0-5.jpg",
      "sourcePage": "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar",
      "recommendedFileName": "miellerie-interieur-02.jpg",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "proof",
      "alt": "Équipement de transformation du miel — miellerie Madagascar",
      "notes": "1920×1080. Deuxième vue intérieure. Alterner avec miellerie-01 en carrousel."
    },
    {
      "priority": 7,
      "url": "https://www.ilanga-nature.com/web/image/206633-5f4f6fd4/84198ffc-3d3e-47bf-927b-2df792ecef0e.webp",
      "sourcePage": "https://www.ilanga-nature.com/nos-valeurs",
      "recommendedFileName": "mielleries-mobiles-terrain.webp",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "story",
      "alt": "Mielleries mobiles Ilanga Nature sur le terrain à Madagascar",
      "notes": "Photo des unités mobiles. Section 'Comment ils travaillent'."
    },
    {
      "priority": 8,
      "url": "https://www.ilanga-nature.com/web/image/206632-772d6f87/ed177e47-7604-4a59-8622-b9227f63c289.webp",
      "sourcePage": "https://www.ilanga-nature.com/nos-valeurs",
      "recommendedFileName": "ecole-apiculture-fort-dauphin.webp",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "story",
      "alt": "École de formation apicole Ilanga Academy à Fort-Dauphin",
      "notes": "Section 'Projets portés'. Illustre l'engagement formation."
    },
    {
      "priority": 9,
      "url": "https://www.ilanga-nature.com/web/image/194402-b11c30bb/_DSC0062.jpg",
      "sourcePage": "https://www.ilanga-nature.com/",
      "recommendedFileName": "produits-miels-trio.jpg",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "product",
      "alt": "Trois pots de miel Ilanga Nature — niaouli, cactus, baies roses 140g",
      "notes": "1920×1280. Meilleure photo produit disponible. Section produits."
    },
    {
      "priority": 10,
      "url": "https://www.ilanga-nature.com/web/image/186480-09918b18/les%20vanilles%20d%27ilanga%20nature.JPG?access_token=a15ee087-408c-4020-be1f-e732db7d9a67",
      "sourcePage": "https://www.ilanga-nature.com/shop/category/vanille-14",
      "recommendedFileName": "produits-vanilles-collection.jpg",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "product",
      "alt": "Collection de vanilles Ilanga Nature — Manakara Madagascar",
      "notes": "1920px. Photo collection vanilles. Section produits complémentaire."
    },
    {
      "priority": 11,
      "url": "https://www.ilanga-nature.com/web/image/204092-d6f96892/vanille-manakara-transhumance-7.webp",
      "sourcePage": "https://www.ilanga-nature.com/",
      "recommendedFileName": "vanille-terrain-manakara.webp",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "story",
      "alt": "Vanille Manakara — terrain à Madagascar",
      "notes": "1920×1080. Section histoire ou produits. Illustre le terroir."
    },
    {
      "priority": 12,
      "url": "https://www.ilanga-nature.com/web/image/183074-fd7372ee/LOGO%20-%20ILANGA%20NATURE.webp",
      "sourcePage": "https://www.ilanga-nature.com/",
      "recommendedFileName": "logo-ilanga-nature-hd.webp",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "logo",
      "alt": "Logo Ilanga Nature",
      "notes": "690×690. Logo officiel HD. À utiliser dans le header partenaire."
    },
    {
      "priority": 13,
      "url": "https://www.ilanga-nature.com/web/image/154694-d15396d6/Miarakap-Ilanga-nature.jpg",
      "sourcePage": "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar",
      "recommendedFileName": "badge-miarakap-partenaire.jpg",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "certification",
      "alt": "Partenariat Ilanga Nature — Miarakap IIP",
      "notes": "1030×293. Badge/logo partenariat Miarakap. Section preuves & crédibilité."
    },
    {
      "priority": 14,
      "url": "https://www.ilanga-nature.com/web/image/185602-dcb677cc/usaid.webp",
      "sourcePage": "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar",
      "recommendedFileName": "badge-usaid.webp",
      "recommendedPath": "/images/producteurs/illanga-nature/",
      "role": "certification",
      "alt": "Partenaire USAID",
      "notes": "225×225. Logo USAID visible en section partenaires mielleries. Détails du partenariat non publiés — ne pas en faire une preuve centrale."
    }
  ]
}
```

---

## 7. Wording final (mobile-first, premium, sans greenwashing)

```json
{
  "hero": {
    "tagline": "Du rucher malgache à votre table.",
    "subtitle": "Ilanga Nature structure une filière apicole ancrée dans les terroirs de Madagascar — avec des mielleries réelles, des apiculteurs partenaires et une certification biologique."
  },
  "mission": {
    "title": "Pourquoi ils existent",
    "intro": "Fondée en 2017, Ilanga Nature valorise les richesses naturelles de Madagascar à travers une filière apicole artisanale : formation, infrastructures terrain, traçabilité et commerce équitable."
  },
  "proofs": {
    "title": "Ce qui est vérifiable",
    "intro": "Trois mielleries fixes, deux unités mobiles, une barge sur le canal des Pangalanes. Certifiés Ecocert. Homologués par le Ministère malgache de l'Élevage."
  },
  "story": {
    "title": "Une aventure de famille et de territoire"
  },
  "projects": {
    "title": "Sur le terrain",
    "intro": "De Fort-Dauphin au canal des Pangalanes, des projets concrets : école d'apiculture, partenariat Hope Madagascar, soutien à l'association ADAMA pour la protection des forêts."
  },
  "species": {
    "title": "Les écosystèmes qu'ils habitent",
    "intro": "Litchi, niaouli, jujubier, cactus, forêts primaires — la flore mellifère endémique de Madagascar donne à chaque miel un caractère unique, lié à un territoire précis."
  },
  "products": {
    "title": "Leurs produits",
    "intro": "12 variétés de miel certifiées biologiques, vanilles de Manakara, épices rares, confitures artisanales. Chaque référence est tracée, de la ruche au pot."
  },
  "cta": {
    "primary": "Soutenir Ilanga Nature",
    "secondary": "Découvrir leurs produits"
  }
}
```

---

## Découvertes importantes V2

### Partenariat ADAMA / AMADA (nouvelle information)
- **Source** : blog Ilanga, article "Green Week" (novembre 2025)
- **Nature** : 10% des ventes Ilanga (semaine Green Week) reversés à l'association malgache **ADAMA**, qui protège les forêts, restaure les écosystèmes fragiles et sensibilise les communautés locales.
- **Pertinence Make the Change** : lien direct biodiversité forêts → abeilles → produits. Peut devenir un argument de preuve terrain.
- **Logo** : `https://www.ilanga-nature.com/web/image/189557-e07ba633/Logo%20AMADA%20coul.webp?access_token=a3b121f2-a5c8-44c7-8276-a7e9855d4733`
- **Confidence** : confirmed (blog officiel Ilanga)
- **Safe wording** : *"associée à l'association ADAMA pour la protection des forêts malgaches (campagne Green Week 2025)"*

### Partenariat Hope Madagascar (nouvelle information)
- **Source** : blog Ilanga, article novembre 2025
- **Nature** : collaboration avec Hope Madagascar (association fondée mai 2025) pour le soutien psychologique des jeunes et des équipes terrain lors d'événements de crise (septembre 2025). Naya Laurent a animé des sessions en lycées partenaires.
- **Pertinence Make the Change** : démontre un engagement humain et communautaire au-delà de l'apiculture.
- **Confidence** : confirmed (blog officiel)
- **Safe wording** : *"partenaire de Hope Madagascar pour l'accompagnement des jeunes malgaches et des équipes terrain"*

### Transport à vide / logistique bas-carbone (information confirmée)
- **Source** : blog "Why choose honey from Madagascar?"
- **Détail** : les produits Ilanga sont transportés par bateaux revenant à vide depuis l'Europe vers Madagascar — permettant de réduire les coûts et l'empreinte carbone du transport.
- **Confidence** : confirmed (blog officiel)
- **Safe wording** : *"transport maritime en retour à vide, décrit comme une approche moins polluante"*

### 19 000 espèces botaniques / 1 000 endémiques (citées par Ilanga)
- **Source** : blog "Why choose honey from Madagascar?"
- Ces chiffres sont cités par Ilanga comme contexte de biodiversité mellifère — à utiliser comme contexte éducatif, pas comme preuve directe d'un impact Ilanga.

---

## Incertitudes restantes

| Information | Statut | Action |
|---|---|---|
| Nombre exact d'apiculteurs / ruches / communautés | Non publié | Demander à Ilanga Nature |
| Photo barge Canal des Pangalanes | Non trouvée | Demander directement |
| Espèce exacte d'abeille (Apis mellifera unicolor ?) | Non mentionnée explicitement | Probable mais à confirmer |
| Source florale exacte du miel de baies roses | Non précisée | Demander ou laisser comme "flore à baies roses de Madagascar" |
| Source florale exacte du miel de mokarana | Non précisée | Laisser "flore endémique des forêts humides" |
| Détails partenariat USAID (durée, nature, montant) | Logo visible, aucun détail | Confirmer avec Ilanga |
| Noms des ONG partenaires au-delà de Miarakap/ADAMA/Hope | "Plusieurs ONG" — non précisé | Demander si pertinent |
| Clients / maisons citées (BtoB) | Non public | Non prioritaire |
| Accès Instagram @ilanganature | Non scraped (JS requis) | Vérifier manuellement |
| Nombre de références disponibles en BtoB / pro | Page pro accessible mais non scrapée | Option si besoin |

---

## Sources complètes utilisées

- https://www.ilanga-nature.com/ (homepage)
- https://www.ilanga-nature.com/notre-histoire
- https://www.ilanga-nature.com/nos-valeurs
- https://www.ilanga-nature.com/en/des-mielleries-a-madagascar
- https://www.ilanga-nature.com/shop/category/miels-4
- https://www.ilanga-nature.com/shop/category/vanille-14
- https://www.ilanga-nature.com/en/blog/honey-from-madagascar-9/why-choose-honey-from-madagascar-3
- https://www.ilanga-nature.com/en/blog/honey-from-madagascar-9/discover-the-honey-of-jujube-tree-of-madagascar-a-treasure-of-nature-41
- https://www.ilanga-nature.com/en/blog/other-5/around-the-world-of-rare-honey-when-nature-becomes-exceptional-71
- https://www.ilanga-nature.com/en/blog/travel-8/the-grand-south-of-madagascar-69
- https://www.ilanga-nature.com/en/blog/news-3/ilanga-nature-x-hope-madagascar-supporting-youth-together-75
- https://www.ilanga-nature.com/en/blog/news-3/consuming-differently-is-already-taking-action-74
- https://miarakap.com/entrepreneur/ilanga-nature/
- YouTube : https://www.youtube.com/watch?v=wdesfc3w7Rw (vidéo officielle "son histoire et ses valeurs")

---

## Priorités d'intégration recommandées

| Priorité | Élément | Statut |
|---|---|---|
| P1 | Télécharger les 14 assets listés | Autorisé — à faire |
| P2 | Intégrer `hero-lemures-miel-fort-dauphin.webp` comme cover hero | Remplace `cover.png` provisoire |
| P3 | Enrichir `mock-producer.ts` avec l'identité V2 complète | JSON prêt |
| P4 | Ajouter les 9 miels + vanille + épices au catalogue mock | productOrigins JSON prêt |
| P5 | Ajouter ADAMA comme "projet porté" dans la page partenaire | Nouveau — source blog confirmé |
| P6 | Ajouter Hope Madagascar comme partenaire humain | Nouveau — source blog confirmé |
| P7 | Section biodiversité BioDex : litchi, niaouli, jujubier en priorité | Sources confirmées |
| P8 | Section biodiversité illustrative : lémur, baobab | Avec formulation prudente obligatoire |
| P9 | Demander à Ilanga : nombre apiculteurs + photo barge | Toujours manquant |
