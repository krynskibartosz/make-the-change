export const primaryContext: Record<string, { body: string; notes: string[]; caution?: string }> = {
  // ── Ilanga Nature ──
  'Certification Ecocert': {
    body: "Certains miels Ilanga Nature disposent d'une certification biologique Ecocert. Cette information permet de situer le niveau de contrôle qualité associé aux produits concernés.",
    notes: [
      'Miels biologiques certifiés Ecocert',
      'Contrôle humidité 16–18 %',
      "Mielleries homologuées Ministère malgache de l'Élevage",
    ],
    caution:
      "Cette certification concerne les produits documentés, pas nécessairement l'ensemble des actions terrain.",
  },
  '2 mielleries mobiles': {
    body: 'Ilanga utilise 2 unités mobiles pour collecter le miel au plus près des zones de production, notamment sur le canal des Pangalanes.',
    notes: [
      '2 unités mobiles de collecte',
      'Barge motorisée, canal des Pangalanes',
      '3 mielleries fixes : Antananarivo, Manakara, Fort-Dauphin',
    ],
    caution:
      "La proximité de collecte est une pratique opérationnelle documentée, pas une mesure d'impact environnemental.",
  },
  "École d'apiculture": {
    body: 'Ilanga forme des apiculteurs locaux à Fort-Dauphin dans une logique de transmission de savoir-faire et de structuration de la filière.',
    notes: [
      'Formation terrain pratique',
      'Localisation : Fort-Dauphin',
      'Accompagnement Miarakap / IIP — programme Mitsiry',
    ],
    caution: "Cette démarche de formation ne constitue pas une preuve d'impact mesuré.",
  },
  // ── Habeebee ──
  'Certification ECOGARANTIE': {
    body: 'Les produits Habeebee sont associés à une démarche de certification ECOGARANTIE, contrôlée par Certisys. Ce label concerne les ingrédients, les procédés de fabrication et les pratiques de transparence.',
    notes: [
      'Label ECOGARANTIE — contrôle Certisys',
      'Exigences sur les ingrédients et la fabrication',
      'Certification documentée sur habeebee.be',
    ],
    caution:
      "Cette certification documente une démarche qualité, pas une mesure d'impact environnemental.",
  },
  'Collecte locale à vélo': {
    body: "La cire d'abeille et la propolis utilisées dans les produits Habeebee sont collectées localement à Bruxelles, notamment à vélo, dans une logique de proximité ruche-atelier.",
    notes: [
      'Collecte à vélo — circuit court',
      "Cire d'abeille et propolis",
      'Ruches en milieu urbain et périurbain bruxellois',
    ],
    caution:
      "Cette pratique de collecte de proximité est documentée par le partenaire, pas une mesure d'empreinte carbone.",
  },
  'Saponification à froid': {
    body: "La saponification à froid est la méthode de fabrication des savons Habeebee. Elle préserve les propriétés des ingrédients naturels, notamment la cire d'abeille et la propolis.",
    notes: [
      'Méthode artisanale à froid',
      'Conservation des actifs naturels',
      'Fabrication 100% à la main à Watermael-Boitsfort',
    ],
    caution:
      'Cette méthode est une pratique de fabrication documentée, pas une certification indépendante.',
  },
  // ── Trilogy Ocean Restoration ──
  'Site de restauration': {
    body: "Cilik Island, dans l'archipel de Karimunjawa (Java central, Indonésie), est le site principal de restauration corallienne documenté par Trilogy Ocean Restoration.",
    notes: [
      'Site : Cilik Island, Karimunjawa',
      'Localisation : Java central, Indonésie',
      'Actions documentées via TikTok & YouTube @TrilogyOceanRestoration',
    ],
    caution:
      "Ce site est documenté par le partenaire via vidéos terrain. Il ne s'agit pas d'une mesure d'impact certifiée.",
  },
  'Suivi des coraux': {
    body: 'Le monitoring photographique et vidéo documente la croissance des fragments coralliens fixés sur les structures de restauration à Cilik Island.',
    notes: [
      'Suivi photographique des coraux implantés',
      'Documentation vidéo via TikTok & YouTube',
      'Croissance observée sur les sites de Karimunjawa',
    ],
    caution:
      'Ce suivi est documenté qualitativement par le partenaire. Il ne constitue pas un monitoring scientifique certifié de façon indépendante.',
  },
  "Programme d'adoption de coraux": {
    body: 'Le Coral Adoption Program de Trilogy permet à des individus et organisations de soutenir financièrement la restauration corallienne à Karimunjawa.',
    notes: [
      'Coral Adoption Program',
      'Soutien individuel ou collectif',
      'Lien direct avec les actions terrain documentées',
    ],
    caution:
      "Ce programme est un mécanisme d'engagement et de financement, pas une garantie de résultat d'impact mesuré.",
  },
}
