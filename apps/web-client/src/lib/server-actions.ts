export type ServerActionState = {
  success?: boolean
  errors?: Record<string, string>
  formError?: string
  redirectUrl?: string
}
