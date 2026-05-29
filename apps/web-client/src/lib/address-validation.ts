export type ValidationSuggestion = {
  street: string
  postalCode: string
  city: string
  label: string
}

export type AddressValidationResult =
  | { status: 'confirmed' }
  | { status: 'suggested'; suggestion: ValidationSuggestion }
  | { status: 'invalid' }
  | { status: 'unavailable' }
