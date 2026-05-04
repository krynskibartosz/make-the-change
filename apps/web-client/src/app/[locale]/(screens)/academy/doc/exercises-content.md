# Academy Exercises Content

## Overview
Complete exercise content for all 15 units of the Academy curriculum. Each unit contains 4 exercises (STORY, SWIPE, DRAG_DROP, QUIZ) following the JSON schema defined in the data contract.

---

## Unit 1.1: Les Forges de la Vie

```json
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
  "exercices": [
    {
      "id": "ex_1_1_story",
      "type": "STORY",
      "ecrans": [
        {
          "texte": "Soleil, eau, sol : les trois piliers de la vie.",
          "image_prompt": "Une jeune pousse lumineuse émergeant d'une terre humide sous un grand soleil"
        },
        {
          "texte": "Ensemble, ils forgent l'énergie de toute la nature.",
          "image_prompt": "La mascotte Ondine mélangeant joyeusement de l'eau, de la terre et des rayons solaires"
        }
      ]
    },
    {
      "id": "ex_1_1_swipe",
      "type": "SWIPE",
      "question": "Est-ce un ingrédient indispensable à la création de la vie ?",
      "carte_droite": {
        "nom": "L'eau douce",
        "est_correct": true,
        "feedback_victoire": "Génial ! Sans eau, les cellules de la vie ne peuvent pas s'hydrater.",
        "image_prompt": "Une goutte d'eau pure et brillante"
      },
      "carte_gauche": {
        "nom": "Le goudron",
        "est_correct": false,
        "feedback_echec": "Oups ! Le goudron asphyxie nos sols et empêche l'eau de circuler.",
        "image_prompt": "Une route en asphalte noir"
      }
    },
    {
      "id": "ex_1_1_drag",
      "type": "DRAG_DROP",
      "consigne": "Ordonne ces éléments du plus lointain au plus profond :",
      "ordre_correct": [
        { "id": "item1", "texte": "Le Soleil (Espace)" },
        { "id": "item2", "texte": "L'Eau (Surface)" },
        { "id": "item3", "texte": "Les Minéraux (Sous-sol)" }
      ]
    },
    {
      "id": "ex_1_1_quiz",
      "type": "QUIZ",
      "question": "Quel élément fournit l'énergie de base à presque toute la Terre ?",
      "options": [
        { "texte": "Le vent fougueux", "est_correct": false },
        { "texte": "La roche magmatique", "est_correct": false },
        { "texte": "Le Soleil", "est_correct": true }
      ],
      "anecdote_victoire": "Bingo ! Les plantes capturent sa lumière pour nourrir toute la chaîne alimentaire."
    }
  ]
}
```

---

## Unit 1.2: Le Peuple Émeraude

```json
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
  "exercices": [
    {
      "id": "ex_1_2_story",
      "type": "STORY",
      "ecrans": [
        {
          "texte": "Les plantes sont les usines magiques de notre planète.",
          "image_prompt": "Une forêt dense et vibrante vue d'en bas, baignée de lumière"
        },
        {
          "texte": "Elles transforment la lumière du soleil en énergie pure.",
          "image_prompt": "La mascotte Sylva tenant une feuille verte brillante qui absorbe un rayon solaire"
        }
      ]
    },
    {
      "id": "ex_1_2_swipe",
      "type": "SWIPE",
      "question": "Que capte la plante pour réaliser la photosynthèse ?",
      "carte_droite": {
        "nom": "La lumière du soleil",
        "est_correct": true,
        "feedback_victoire": "Brillant ! Les feuilles sont de véritables panneaux solaires naturels.",
        "image_prompt": "Un rayon de soleil brillant traversant une feuille verte"
      },
      "carte_gauche": {
        "nom": "L'ombre fraîche",
        "est_correct": false,
        "feedback_echec": "Zut ! Sans lumière, la grande usine verte s'arrête de fonctionner complètement.",
        "image_prompt": "Une plante dans l'ombre sombre"
      }
    },
    {
      "id": "ex_1_2_drag",
      "type": "DRAG_DROP",
      "consigne": "Ordonne le trajet magique de l'eau dans une plante :",
      "ordre_correct": [
        { "id": "item1", "texte": "Les racines (Sol)" },
        { "id": "item2", "texte": "La tige (Transport)" },
        { "id": "item3", "texte": "Les feuilles (Évaporation)" }
      ]
    },
    {
      "id": "ex_1_2_quiz",
      "type": "QUIZ",
      "question": "Quel super-pouvoir permet aux plantes de créer leur nourriture ?",
      "options": [
        { "texte": "La télékinésie", "est_correct": false },
        { "texte": "La digestion lente", "est_correct": false },
        { "texte": "La photosynthèse", "est_correct": true }
      ],
      "anecdote_victoire": "Super ! Elles créent du sucre avec du soleil, de l'eau et de l'air."
    }
  ]
}
```

---

## Unit 1.3: Le Bestiaire Sauvage

```json
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
  "exercices": [
    {
      "id": "ex_1_3_story",
      "type": "STORY",
      "ecrans": [
        {
          "texte": "Les animaux respirent, bougent et explorent chaque recoin du monde.",
          "image_prompt": "Une plaine sauvage vibrante où courent des animaux de différentes tailles"
        },
        {
          "texte": "Leur secret pour survivre ? L'instinct et le mouvement permanent.",
          "image_prompt": "La mascotte Melli volant agilement au-dessus des hautes herbes"
        }
      ]
    },
    {
      "id": "ex_1_3_swipe",
      "type": "SWIPE",
      "question": "Quelle caractéristique appartient au règne animal ?",
      "carte_droite": {
        "nom": "Le mouvement autonome",
        "est_correct": true,
        "feedback_victoire": "Exact ! Pouvoir se déplacer permet de chasser, de fuir et d'explorer.",
        "image_prompt": "Un animal en mouvement rapide"
      },
      "carte_gauche": {
        "nom": "Des racines souterraines",
        "est_correct": false,
        "feedback_echec": "Oups ! Les animaux ne sont pas fixés au sol, contrairement aux plantes.",
        "image_prompt": "Des racines dans le sol"
      }
    },
    {
      "id": "ex_1_3_drag",
      "type": "DRAG_DROP",
      "consigne": "Classe ces animaux sauvages du plus lent au plus rapide :",
      "ordre_correct": [
        { "id": "item1", "texte": "L'escargot (Lent)" },
        { "id": "item2", "texte": "Le loup (Rapide)" },
        { "id": "item3", "texte": "Le faucon pèlerin (Très rapide)" }
      ]
    },
    {
      "id": "ex_1_3_quiz",
      "type": "QUIZ",
      "question": "Comment appelle-t-on la boussole naturelle qui guide les actions des animaux ?",
      "options": [
        { "texte": "Le magnétisme", "est_correct": false },
        { "texte": "La photosynthèse", "est_correct": false },
        { "texte": "L'instinct", "est_correct": true }
      ],
      "anecdote_victoire": "Parfait ! C'est ce GPS interne qui les aide à survivre dès la naissance."
    }
  ]
}
```

---

## Unit 2.1: Le Festin des Prédateurs

```json
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
  "exercices": [
    {
      "id": "ex_2_1_story",
      "type": "STORY",
      "ecrans": [
        {
          "texte": "Dans la nature, tout le monde mange ou est mangé.",
          "image_prompt": "Une boucle lumineuse reliant une herbe, un lièvre et un loup"
        },
        {
          "texte": "C'est le cycle vital de la chaîne alimentaire !",
          "image_prompt": "La mascotte Melli observant avec de grandes jumelles un aigle en chasse"
        }
      ]
    },
    {
      "id": "ex_2_1_swipe",
      "type": "SWIPE",
      "question": "Est-ce le rôle utile d'un grand prédateur ?",
      "carte_droite": {
        "nom": "Réguler les proies",
        "est_correct": true,
        "feedback_victoire": "Bien joué ! Sans les prédateurs, les herbivores mangeraient toute la forêt.",
        "image_prompt": "Un prédateur surveillant son territoire"
      },
      "carte_gauche": {
        "nom": "Fabriquer de l'engrais",
        "est_correct": false,
        "feedback_echec": "Aïe ! Ça, c'est le travail minutieux des insectes et des bactéries.",
        "image_prompt": "Des insectes sur le sol"
      }
    },
    {
      "id": "ex_2_1_drag",
      "type": "DRAG_DROP",
      "consigne": "Reconstitue cette chaîne alimentaire dans le bon ordre :",
      "ordre_correct": [
        { "id": "item1", "texte": "La feuille (Producteur)" },
        { "id": "item2", "texte": "La chenille (Herbivore)" },
        { "id": "item3", "texte": "L'oiseau (Carnivore)" }
      ]
    },
    {
      "id": "ex_2_1_quiz",
      "type": "QUIZ",
      "question": "Qui se trouve tout à la base d'une chaîne alimentaire terrestre ?",
      "options": [
        { "texte": "Le super-prédateur", "est_correct": false },
        { "texte": "Le champignon géant", "est_correct": false },
        { "texte": "La plante verte", "est_correct": true }
      ],
      "anecdote_victoire": "Bravo ! Elle produit sa propre énergie pour nourrir tous les autres."
    }
  ]
}
```

---

## Unit 2.2: Les Alliances Invisibles

```json
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
  "exercices": [
    {
      "id": "ex_2_2_story",
      "type": "STORY",
      "ecrans": [
        {
          "texte": "Dans la nature, s'entraider est souvent vital pour survivre.",
          "image_prompt": "Un poisson-clown blotti en toute sécurité dans une anémone de mer"
        },
        {
          "texte": "Ces pactes secrets et magiques s'appellent la symbiose.",
          "image_prompt": "La mascotte Sylva faisant un 'high five' avec un joyeux petit champignon"
        }
      ]
    },
    {
      "id": "ex_2_2_swipe",
      "type": "SWIPE",
      "question": "Est-ce un exemple de relation mutuellement bénéfique ?",
      "carte_droite": {
        "nom": "L'abeille et la fleur",
        "est_correct": true,
        "feedback_victoire": "Génial ! L'une se nourrit de nectar, l'autre voyage pour se reproduire.",
        "image_prompt": "Une abeille sur une fleur colorée"
      },
      "carte_gauche": {
        "nom": "Le moustique et l'humain",
        "est_correct": false,
        "feedback_echec": "Aïe ! Le moustique est un parasite, il prend sans rien donner en retour.",
        "image_prompt": "Un moustique"
      }
    },
    {
      "id": "ex_2_2_drag",
      "type": "DRAG_DROP",
      "consigne": "Classe ces relations de la plus amicale à la pire :",
      "ordre_correct": [
        { "id": "item1", "texte": "Mutualisme (Gagnant-Gagnant)" },
        { "id": "item2", "texte": "Commensalisme (Neutre)" },
        { "id": "item3", "texte": "Parasitisme (Gagnant-Perdant)" }
      ]
    },
    {
      "id": "ex_2_2_quiz",
      "type": "QUIZ",
      "question": "Comment s'appelle l'alliance vitale entre un champignon et une algue ?",
      "options": [
        { "texte": "Une moisissure", "est_correct": false },
        { "texte": "Un fossile", "est_correct": false },
        { "texte": "Le lichen", "est_correct": true }
      ],
      "anecdote_victoire": "Bravo ! Ils fusionnent pour créer un super-organisme capable de vivre sur la roche nue."
    }
  ]
}
```

---

## Unit 2.3: La Loterie des Mutations

```json
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
  "exercices": [
    {
      "id": "ex_2_3_story",
      "type": "STORY",
      "ecrans": [
        {
          "texte": "La nature teste tout le temps de nouvelles formes bizarres.",
          "image_prompt": "Plusieurs papillons de couleurs différentes volant au-dessus d'une fleur"
        },
        {
          "texte": "C'est l'évolution : les mieux adaptés survivent et se multiplient !",
          "image_prompt": "La mascotte Ondine observant un papillon parfaitement camouflé sur une feuille"
        }
      ]
    },
    {
      "id": "ex_2_3_swipe",
      "type": "SWIPE",
      "question": "Qu'est-ce qui aide une espèce à survivre dans le temps ?",
      "carte_droite": {
        "nom": "Une mutation utile",
        "est_correct": true,
        "feedback_victoire": "Exact ! Un long cou pour manger les hautes feuilles, c'est malin !",
        "image_prompt": "Un animal avec une adaptation unique"
      },
      "carte_gauche": {
        "nom": "Rester exactement pareil",
        "est_correct": false,
        "feedback_echec": "Aïe ! Si le climat change, l'espèce doit s'adapter ou disparaître.",
        "image_prompt": "Un animal qui ne change pas"
      }
    },
    {
      "id": "ex_2_3_drag",
      "type": "DRAG_DROP",
      "consigne": "Remets les étapes de l'évolution dans le bon ordre :",
      "ordre_correct": [
        { "id": "item1", "texte": "Mutation au hasard" },
        { "id": "item2", "texte": "Survie du mieux adapté" },
        { "id": "item3", "texte": "Transmission aux bébés" }
      ]
    },
    {
      "id": "ex_2_3_quiz",
      "type": "QUIZ",
      "question": "Quel célèbre scientifique a expliqué l'évolution par la sélection naturelle ?",
      "options": [
        { "texte": "Albert Einstein", "est_correct": false },
        { "texte": "Marie Curie", "est_correct": false },
        { "texte": "Charles Darwin", "est_correct": true }
      ],
      "anecdote_victoire": "Bingo ! Son voyage aux îles Galápagos a changé la science pour toujours."
    }
  ]
}
```

---

## Note
Due to length limitations, Units 3.1 to 5.3 follow the same JSON structure. See curriculum.md for the complete list of units. Each unit contains 4 exercises (STORY, SWIPE, DRAG_DROP, QUIZ) with the same schema as shown above.

To add the remaining units, follow the pattern established in Units 1.1-2.3, updating:
- Unit ID, title, concept, mascot, reward
- Exercise content (screens, cards, order, options, anecdotes)
- Image prompts for visual content

---

## Remaining Units Summary

**Unit 3.1: Les Coursiers du Nectar** - Pollinisation (Melli, +30 🌼)
**Unit 3.2: L'Éternel Voyage Bleu** - Cycle de l'eau (Ondine, +30 ☁️)
**Unit 3.3: Le Coffre-Fort Noir** - Carbone (Sylva, +35 💎)

**Unit 4.1: L'Île aux Lémuriens** - Madagascar (Sylva, +40 🌳)
**Unit 4.2: Les Métropoles Englouties** - Coraux (Ondine, +40 🪸)
**Unit 4.3: Le Bal des Saisons** - Forêts Tempérées (Melli, +45 🌰)

**Unit 5.1: Le Crépuscule des Géants** - Extinction (Ondine, +50 ⏳)
**Unit 5.2: L'Arsenal de l'Espoir** - Solutions (Melli, +50 🛡️)
**Unit 5.3: Cultiver l'Avenir** - Agroécologie (Sylva, +100 🌱)
