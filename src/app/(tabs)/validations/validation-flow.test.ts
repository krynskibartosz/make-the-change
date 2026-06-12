import { describe, expect, it } from 'vitest'

import { initialValidationFlowState, validationFlowReducer } from './validation-flow'

describe('validationFlowReducer', () => {
  it('opens a detailed confirmation before accepting P1.7', () => {
    expect(
      validationFlowReducer(initialValidationFlowState, { type: 'request-acceptance' }),
    ).toEqual({
      status: 'confirming',
    })
  })

  it('produces a simulated non-contractual receipt after final confirmation', () => {
    const result = validationFlowReducer({ status: 'confirming' }, { type: 'confirm-acceptance' })

    expect(result).toEqual({
      status: 'accepted',
      receipt: {
        reference: 'SIM-P1.7-120626',
        statusLabel: 'Accord simulé enregistré',
        disclaimer: 'Reçu de démonstration non contractuel',
      },
    })
  })

  it('shows a visible acknowledgement after requesting clarification', () => {
    expect(
      validationFlowReducer(initialValidationFlowState, { type: 'request-clarification' }),
    ).toEqual({
      status: 'clarification-sent',
    })
  })

  it('returns to the pending decision when confirmation is cancelled', () => {
    expect(
      validationFlowReducer({ status: 'confirming' }, { type: 'cancel-confirmation' }),
    ).toEqual(initialValidationFlowState)
  })
})
