'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { Button } from '@make-the-change/core/ui'
import { Edit, Mail, Save, Shield, User, X } from 'lucide-react'
import type { FC } from 'react'

type UserData = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  user_level: 'explorateur' | 'protecteur' | 'ambassadeur'
  kyc_status: 'pending' | 'light' | 'complete' | 'rejected'
  address_country_code?: string | null
}

type UserCompactHeaderProps = {
  userData: UserData
  isEditing?: boolean
  onEditToggle?: (editing: boolean) => void
  onSave?: () => void
  isSaving?: boolean
}

export const UserCompactHeader: FC<UserCompactHeaderProps> = ({
  userData,
  isEditing = false,
  onEditToggle,
  onSave,
  isSaving = false,
}) => {
  const displayName =
    `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-3 md:pb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
        {}
        <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0">
          <div className="p-2 md:p-3 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0">
            <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-foreground leading-tight truncate mb-2 md:mb-2">
              {displayName}
            </h1>

            <div className="flex items-center gap-4 flex-wrap">
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20',
                )}
              >
                <Shield className="h-3 w-3" />
                {userData.user_level}
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium">
                <Mail className="h-3 w-3" />
                {userData.email}
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium">
                <Shield className="h-3 w-3" />
                {userData.kyc_status}
              </div>

              <div className="px-3 py-1 bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                #{userData.id}
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
          {onEditToggle && (
            <>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Button
                    className="text-sm"
                    disabled={isSaving}
                    size="sm"
                    variant="outline"
                    onClick={() => onEditToggle(false)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                  <Button
                    className="text-sm"
                    disabled={isSaving}
                    size="sm"
                    variant="default"
                    onClick={onSave}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>
              ) : (
                <Button
                  className="text-sm"
                  size="sm"
                  variant="outline"
                  onClick={() => onEditToggle(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
