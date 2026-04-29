# Academy Curriculum Content

## Overview
Complete curriculum structure for the Academy with 5 chapters and 15 units, following the JSON schema defined in the data contract.

---

## Chapter 1: L'Alphabet Originel (A1)
**Description:** Découvrez et maîtrisez les éléments fondamentaux et les acteurs principaux qui composent la grande scène de la nature.

```json
{
  "id": "chapitre_1",
  "slug": "alphabet-originel",
  "titre": "L'Alphabet Originel",
  "description": "Découvrez et maîtrisez les éléments fondamentaux et les acteurs principaux qui composent la grande scène de la nature.",
  "ordre": 1,
  "duree_estimee": 45,
  "difficulte": "debutant",
  "prerequis": [],
  "unites": [
    {
      "id": "unite_1_1",
      "chapitre_id": "chapitre_1",
      "titre": "Les Forges de la Vie",
      "concept_cle": "Énergie, Minéraux, Hydratation",
      "mascotte": "Ondine",
      "recompense": {
        "type": "gouttes",
        "montant": 10,
        "icone": "💧"
      },
      "ordre": 1
    },
    {
      "id": "unite_1_2",
      "chapitre_id": "chapitre_1",
      "titre": "Le Peuple Émeraude",
      "concept_cle": "Photosynthèse, Racines, Feuilles",
      "mascotte": "Sylva",
      "recompense": {
        "type": "feuilles",
        "montant": 10,
        "icone": "🍃"
      },
      "ordre": 2
    },
    {
      "id": "unite_1_3",
      "chapitre_id": "chapitre_1",
      "titre": "Le Bestiaire Sauvage",
      "concept_cle": "Animaux, Mouvement, Instinct",
      "mascotte": "Melli",
      "recompense": {
        "type": "empreintes",
        "montant": 15,
        "icone": "🐾"
      },
      "ordre": 3
    }
  ],
  "vignette": "image_prompt: Une forêt luxuriante avec des rayons de soleil filtrant à travers les feuilles",
  "est_verrouille": false,
  "taux_completion": 0
}
```

---

## Chapter 2: La Grammaire des Espèces (A2)
**Description:** Comprenez comment les êtres vivants interagissent, s'allient secrètement et se transforment à travers les âges.

```json
{
  "id": "chapitre_2",
  "slug": "grammaire-especes",
  "titre": "La Grammaire des Espèces",
  "description": "Comprenez comment les êtres vivants interagissent, s'allient secrètement et se transforment à travers les âges.",
  "ordre": 2,
  "duree_estimee": 60,
  "difficulte": "debutant",
  "prerequis": ["chapitre_1"],
  "unites": [
    {
      "id": "unite_2_1",
      "chapitre_id": "chapitre_2",
      "titre": "Le Festin des Prédateurs",
      "concept_cle": "Proies, Prédateurs, Équilibre",
      "mascotte": "Melli",
      "recompense": {
        "type": "crocs",
        "montant": 20,
        "icone": "🐺"
      },
      "ordre": 1
    },
    {
      "id": "unite_2_2",
      "chapitre_id": "chapitre_2",
      "titre": "Les Alliances Invisibles",
      "concept_cle": "Mutualisme, Parasitisme, Coévolution",
      "mascotte": "Sylva",
      "recompense": {
        "type": "lichens",
        "montant": 20,
        "icone": "🦠"
      },
      "ordre": 2
    },
    {
      "id": "unite_2_3",
      "chapitre_id": "chapitre_2",
      "titre": "La Loterie des Mutations",
      "concept_cle": "Adaptation, Sélection, Survie",
      "mascotte": "Ondine",
      "recompense": {
        "type": "fossiles",
        "montant": 25,
        "icone": "🐚"
      },
      "ordre": 3
    }
  ],
  "vignette": "image_prompt: Un écosystème complexe avec des animaux interagissant dans une forêt dense",
  "est_verrouille": true,
  "taux_completion": 0
}
```

---

## Chapter 3: L'Économie de la Biosphère (B1)
**Description:** Plongez dans les immenses cycles de troc et d'échange qui maintiennent le moteur de notre planète en marche.

```json
{
  "id": "chapitre_3",
  "slug": "economie-biosphere",
  "titre": "L'Économie de la Biosphère",
  "description": "Plongez dans les immenses cycles de troc et d'échange qui maintiennent le moteur de notre planète en marche.",
  "ordre": 3,
  "duree_estimee": 75,
  "difficulte": "intermediaire",
  "prerequis": ["chapitre_2"],
  "unites": [
    {
      "id": "unite_3_1",
      "chapitre_id": "chapitre_3",
      "titre": "Les Coursiers du Nectar",
      "concept_cle": "Fleurs, Insectes, Reproduction",
      "mascotte": "Melli",
      "recompense": {
        "type": "pollens",
        "montant": 30,
        "icone": "🌼"
      },
      "ordre": 1
    },
    {
      "id": "unite_3_2",
      "chapitre_id": "chapitre_3",
      "titre": "L'Éternel Voyage Bleu",
      "concept_cle": "Évaporation, Précipitations, Infiltration",
      "mascotte": "Ondine",
      "recompense": {
        "type": "nuages",
        "montant": 30,
        "icone": "☁️"
      },
      "ordre": 2
    },
    {
      "id": "unite_3_3",
      "chapitre_id": "chapitre_3",
      "titre": "Le Coffre-Fort Noir",
      "concept_cle": "Absorption, Stockage, Émissions",
      "mascotte": "Sylva",
      "recompense": {
        "type": "diamants",
        "montant": 35,
        "icone": "💎"
      },
      "ordre": 3
    }
  ],
  "vignette": "image_prompt: Le cycle de l'eau avec des nuages, des rivières et des océans dans un paysage magnifique",
  "est_verrouille": true,
  "taux_completion": 0
}
```

---

## Chapter 4: Les Sanctuaires Sauvages (B2)
**Description:** Explorez les écosystèmes les plus fascinants, complexes et fragiles que notre Terre a façonnés.

```json
{
  "id": "chapitre_4",
  "slug": "sanctuaires-sauvages",
  "titre": "Les Sanctuaires Sauvages",
  "description": "Explorez les écosystèmes les plus fascinants, complexes et fragiles que notre Terre a façonnés.",
  "ordre": 4,
  "duree_estimee": 90,
  "difficulte": "intermediaire",
  "prerequis": ["chapitre_3"],
  "unites": [
    {
      "id": "unite_4_1",
      "chapitre_id": "chapitre_4",
      "titre": "L'Île aux Lémuriens",
      "concept_cle": "Endémisme, Isolement, Biodiversité",
      "mascotte": "Sylva",
      "recompense": {
        "type": "baobabs",
        "montant": 40,
        "icone": "🌳"
      },
      "ordre": 1
    },
    {
      "id": "unite_4_2",
      "chapitre_id": "chapitre_4",
      "titre": "Les Métropoles Englouties",
      "concept_cle": "Récifs, Polypes, Blanchissement",
      "mascotte": "Ondine",
      "recompense": {
        "type": "coraux",
        "montant": 40,
        "icone": "🪸"
      },
      "ordre": 2
    },
    {
      "id": "unite_4_3",
      "chapitre_id": "chapitre_4",
      "titre": "Le Bal des Saisons",
      "concept_cle": "Saisons, Humus, Hibernation",
      "mascotte": "Melli",
      "recompense": {
        "type": "glands",
        "montant": 45,
        "icone": "🌰"
      },
      "ordre": 3
    }
  ],
  "vignette": "image_prompt: Un paysage diversifié avec une forêt tempérée, des coraux et une île tropicale",
  "est_verrouille": true,
  "taux_completion": 0
}
```

---

## Chapter 5: L'Éveil des Gardiens (C1/C2)
**Description:** Passez à l'action en comprenant les crises planétaires actuelles pour forger concrètement le monde de demain.

```json
{
  "id": "chapitre_5",
  "slug": "eveil-gardiens",
  "titre": "L'Éveil des Gardiens",
  "description": "Passez à l'action en comprenant les crises planétaires actuelles pour forger concrètement le monde de demain.",
  "ordre": 5,
  "duree_estimee": 120,
  "difficulte": "avance",
  "prerequis": ["chapitre_4"],
  "unites": [
    {
      "id": "unite_5_1",
      "chapitre_id": "chapitre_5",
      "titre": "Le Crépuscule des Géants",
      "concept_cle": "Déclin, Menaces, Anthropocène",
      "mascotte": "Ondine",
      "recompense": {
        "type": "sabliers",
        "montant": 50,
        "icone": "⏳"
      },
      "ordre": 1
    },
    {
      "id": "unite_5_2",
      "chapitre_id": "chapitre_5",
      "titre": "L'Arsenal de l'Espoir",
      "concept_cle": "Conservation, Restauration, Innovation",
      "mascotte": "Melli",
      "recompense": {
        "type": "boucliers",
        "montant": 50,
        "icone": "🛡️"
      },
      "ordre": 2
    },
    {
      "id": "unite_5_3",
      "chapitre_id": "chapitre_5",
      "titre": "Cultiver l'Avenir",
      "concept_cle": "Permaculture, Synergie, Résilience",
      "mascotte": "Sylva",
      "recompense": {
        "type": "graines",
        "montant": 100,
        "icone": "🌱"
      },
      "ordre": 3
    }
  ],
  "vignette": "image_prompt: Un futur durable avec des fermes permacoles, des énergies renouvelables et une nature restaurée",
  "est_verrouille": true,
  "taux_completion": 0
}
```

---

## Mascottes

### Ondine (Eau/Corail)
- Domaine: Eau, océans, cycles hydrologiques
- Personnalité: Calme, profonde, mystérieuse
- Chapitres: 1.1, 2.3, 3.2, 4.2, 5.1

### Sylva (Forêt/Plante)
- Domaine: Forêts, plantes, photosynthèse
- Personnalité: Sage, nourricière, ancienne
- Chapitres: 1.2, 2.2, 3.3, 4.1, 4.3, 5.3

### Melli (Terre/Abeille)
- Domaine: Terre, insectes, pollinisation
- Personnalité: Énergique, travailleuse, sociale
- Chapitres: 1.3, 2.1, 3.1, 4.3, 5.2

---

## Progression des Récompenses

| Niveau | Récompense Min | Récompense Max | Total Chapitre |
|--------|---------------|----------------|----------------|
| A1     | 10 💧         | 15 🐾          | 35             |
| A2     | 20 🐺         | 25 🐚          | 65             |
| B1     | 30 🌼         | 35 💎          | 95             |
| B2     | 40 🌳         | 45 🌰          | 125            |
| C1/C2  | 50 ⏳         | 100 🌱         | 200            |

**Total Curriculum:** 520 points de récompense potentiels
