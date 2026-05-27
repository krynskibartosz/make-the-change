const ID = '/images/producteurs/illanga-nature/identity'
const MD = '/images/producteurs/illanga-nature/media'
const SHOP = '/new-product-img-to-integrate'

export const ILANGA_PATHS = {
  identity: {
    cover: `${ID}/cover.png`,
    portrait: `${ID}/pur-logo.png`,
    logo: `${ID}/logo-ilanga-nature-hd.webp`,
    logoCompact: `${ID}/logo-ilanga-nature-compact.png`,
    badgeMiarakap: `${ID}/badge-miarakap-partenaire.jpg`,
    badgeUsaid: `${ID}/badge-usaid.webp`,
  },
  media: {
    auxOrigines: `${MD}/aux-origines-d-Ilanga-nature.png`,
    portraitFamilleLaurent: `${MD}/portrait-famille-laurent.webp`,
    portraitApiculteurFortDauphin: `${MD}/portrait-apiculteur-fort-dauphin.webp`,
    miellerieManakaraExterieur: `${MD}/miellerie-manakara-exterieur.webp`,
    miellieriesMobilesTerrain: `${MD}/mielleries-mobiles-terrain.webp`,
    ecoleApicultureFortDauphin: `${MD}/ecole-apiculture-fort-dauphin.webp`,
    produitsMielsTrio: `${MD}/produits-miels-trio.jpg`,
    heroLemures: `${MD}/hero-lemures-miel-fort-dauphin.webp`,
    miellierieInterieur01: `${MD}/miellerie-interieur-01.jpg`,
    miellierieInterieur02: `${MD}/miellerie-interieur-02.jpg`,
    oliveraiToscane: `${MD}/oliverai-toscane.png`,
    produitsVanillesCollection: `${MD}/produits-vanilles-collection.jpg`,
    vanilleTerrainManakara: `${MD}/vanille-terrain-manakara.webp`,
    shopCollection3Miels: `${SHOP}/ilanga-collection-3-miels.webp`,
    shopCollection3MielsAmbience:
      'https://images.unsplash.com/photo-1668510468038-3607aae3f03c?auto=format&fit=crop&q=80&w=1200',
    shopMielEucalyptus: `${SHOP}/ilanga-miel-eucalyptus.webp`,
    shopMielLitchi: `${SHOP}/ilanga-miel-litchi.webp`,
    advantageCollection3MielsReduction: `${SHOP}/ilanga-collection-3-miels-reduction.webp`,
  },
} as const
