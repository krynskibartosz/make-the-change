import { describe, expect, it } from 'vitest'
import { getProjectImpactMetrics } from '@/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics'

describe('getProjectImpactMetrics', () => {
  it('uses exact coral donation option impact when selected', () => {
    const metrics = getProjectImpactMetrics({
      amount: 180,
      projectType: 'reef',
      isContributionProject: true,
      donationOptions: [
        {
          id: 'coral-12',
          projectId: 'coral',
          name: '12 coraux',
          price: 180,
          quantity: 12,
          unitLabel: 'coraux',
          rewards: {
            seeds: 180,
            certificate: true,
            photo: true,
            location: true,
            updates: true,
          },
          impact: {
            unitsRestored: 12,
            unitsLabel: 'coraux',
            survivalRate: '60-85%',
            areaRestored: '0,24 m2',
            habitatCreated: 12,
          },
        },
      ],
    })

    if (metrics.kind !== 'reef') {
      throw new Error(`Expected reef metrics, got ${metrics.kind}`)
    }

    expect(metrics.corals).toBe(12)
    expect(metrics.areaLabel).toBe('0,24 m2')
    expect(metrics.fishShelter).toBe(12)
  })

  it('uses project bee ratios instead of hardcoded defaults', () => {
    const metrics = getProjectImpactMetrics({
      amount: 100,
      projectType: 'beehive',
      projectImpact: {
        co2Absorbed: null,
        biodiversityGain: null,
        jobsCreated: null,
        timeline: null,
        beesPerEur: 38,
        honeyGramsPerEur: 7.7,
        flowersPerEur: 290,
      },
    })

    if (metrics.kind !== 'bees') {
      throw new Error(`Expected bee metrics, got ${metrics.kind}`)
    }

    expect(metrics.bees).toBe(3800)
    expect(metrics.flowers).toBe(29000)
  })

  it('calculates current Antsirabe-style beehive impact values from funding amount', () => {
    const metrics = getProjectImpactMetrics({
      amount: 7640,
      projectType: 'beehive',
      projectImpact: {
        co2Absorbed: null,
        biodiversityGain: null,
        jobsCreated: null,
        timeline: null,
        hivesPerEur: 0.0008,
        beesPerEur: 152,
        honeyGramsPerEur: 7.7,
        flowersPerEur: 1154,
        co2GramsPerEur: 38.5,
      },
    })

    if (metrics.kind !== 'bees') {
      throw new Error(`Expected bee metrics, got ${metrics.kind}`)
    }

    expect(metrics.hivesSupported).toBe(6)
    expect(Math.round(metrics.honeyKg)).toBe(59)
    expect(metrics.flowers > 8_000_000).toBe(true)
  })
})
