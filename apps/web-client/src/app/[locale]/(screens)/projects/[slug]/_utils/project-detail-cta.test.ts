import { describe, expect, it } from 'vitest'
import { getProjectDetailCtaLabel } from './project-detail-cta'

describe('getProjectDetailCtaLabel', () => {
  it('returns the closed label when funding is closed', () => {
    expect(
      getProjectDetailCtaLabel({
        activeTab: 'impact',
        isFundingClosed: true,
        isContributionProject: false,
        closedLabel: 'Projet finance',
        contributionCtaLabel: 'Contribuer au projet',
        supportCtaLabel: 'Choisir une contrepartie',
      }),
    ).toBe('Projet finance')
  })

  it('uses softer support wording on the impact tab', () => {
    expect(
      getProjectDetailCtaLabel({
        activeTab: 'impact',
        isFundingClosed: false,
        isContributionProject: false,
        closedLabel: 'Projet finance',
        contributionCtaLabel: 'Contribuer au projet',
        supportCtaLabel: 'Choisir une contrepartie',
      }),
    ).toBe('Voir les contreparties')
  })

  it('keeps contribution wording for donation projects', () => {
    expect(
      getProjectDetailCtaLabel({
        activeTab: 'impact',
        isFundingClosed: false,
        isContributionProject: true,
        closedLabel: 'Projet finance',
        contributionCtaLabel: 'Contribuer au projet',
        supportCtaLabel: 'Choisir une contrepartie',
      }),
    ).toBe('Contribuer au projet')
  })

  it('keeps the direct support label on the rewards tab', () => {
    expect(
      getProjectDetailCtaLabel({
        activeTab: 'rewards',
        isFundingClosed: false,
        isContributionProject: false,
        closedLabel: 'Projet finance',
        contributionCtaLabel: 'Contribuer au projet',
        supportCtaLabel: 'Choisir une contrepartie',
      }),
    ).toBe('Choisir une contrepartie')
  })
})
