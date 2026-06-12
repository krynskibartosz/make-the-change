export type ValidationReceipt = Readonly<{
  disclaimer: string
  reference: string
  statusLabel: string
}>

export type ValidationFlowState =
  | Readonly<{ status: 'pending' }>
  | Readonly<{ status: 'confirming' }>
  | Readonly<{ status: 'clarification-sent' }>
  | Readonly<{ receipt: ValidationReceipt; status: 'accepted' }>

export type ValidationFlowAction =
  | Readonly<{ type: 'request-acceptance' }>
  | Readonly<{ type: 'cancel-confirmation' }>
  | Readonly<{ type: 'confirm-acceptance' }>
  | Readonly<{ type: 'request-clarification' }>

export const initialValidationFlowState: ValidationFlowState = { status: 'pending' }

export function validationFlowReducer(
  state: ValidationFlowState,
  action: ValidationFlowAction,
): ValidationFlowState {
  switch (action.type) {
    case 'request-acceptance':
      return { status: 'confirming' }
    case 'cancel-confirmation':
      return initialValidationFlowState
    case 'confirm-acceptance':
      return {
        status: 'accepted',
        receipt: {
          reference: 'SIM-P1.7-120626',
          statusLabel: 'Accord simulé enregistré',
          disclaimer: 'Reçu de démonstration non contractuel',
        },
      }
    case 'request-clarification':
      return { status: 'clarification-sent' }
    default:
      return state
  }
}
