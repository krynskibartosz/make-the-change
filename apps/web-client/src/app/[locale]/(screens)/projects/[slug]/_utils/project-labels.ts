export function getTagline(
  projectType: string | null | undefined,
  isDonationProject: boolean,
): string {
  const type = projectType?.toLowerCase() ?? ''
  if (isDonationProject || type.includes('coral') || type.includes('reef')) {
    return 'Soutenir la restauration des récifs coralliens et documenter leur évolution terrain.'
  }
  if (type.includes('orchard') || type.includes('olive')) {
    return 'Soutenir des producteurs locaux et la valorisation de leurs terres vivantes.'
  }
  return 'Soutenir des ruches locales, leur suivi terrain et la valorisation du miel produit.'
}

export function getSupportChips(
  projectType: string | null | undefined,
  isDonationProject: boolean,
): string[] {
  const type = projectType?.toLowerCase() ?? ''
  if (isDonationProject || type.includes('coral') || type.includes('reef')) {
    return ['Implantation coraux', 'Équipement plongée', 'Suivi photo', 'Entretien nurseries']
  }
  if (type.includes('orchard') || type.includes('olive')) {
    return ['Taille oliviers', 'Équipement récolte', 'Transformation huile', 'Distribution locale']
  }
  return ['Entretien des ruches', 'Matériel apicole', 'Déplacements terrain', 'Suivi sanitaire', 'Récolte du miel']
}

export function getReceiveChips(isDonationProject: boolean): string[] {
  if (isDonationProject) {
    return ['Photos sous-marines', 'Nouvelles projet', 'Progression documentée', 'Infos partenaire']
  }
  return ['Photos terrain', 'Nouvelles partenaire', 'Étapes projet', 'Suivi production']
}
