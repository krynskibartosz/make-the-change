'use client'

import { Button, Menu, MenuContent, MenuItem, MenuTrigger } from '@make-the-change/core/ui'
import { Edit, MoreHorizontal } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'

type BlogPostActionsMenuProps = {
  postId: string
}

export function BlogPostActionsMenu({ postId }: BlogPostActionsMenuProps) {
  const router = useRouter()

  return (
    <Menu>
      <MenuTrigger>
        <Button variant="outline" size="icon" aria-label="Ouvrir les actions de l'article">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem onClick={() => router.push(`/admin/cms/blog/${postId}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Éditer
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
