import type { Database } from '@make-the-change/core/database-types'

export type User = Database['public']['Tables']['profiles']['Row'] & {
  name: string
}

export type UserSummary = Pick<User, 'id' | 'name' | 'email' | 'user_level' | 'kyc_status'>
