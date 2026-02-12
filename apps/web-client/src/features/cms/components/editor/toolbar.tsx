'use client'

import {
  Toggle,
  ToolbarGroup,
  Toolbar as ToolbarRoot,
  ToolbarSeparator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@make-the-change/core/ui'
import type { Editor } from '@tiptap/react'
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from 'lucide-react'
import type { ReactNode } from 'react'

interface ToolbarProps {
  editor: Editor | null
}

interface FormatToggleProps {
  label: string
  pressed: boolean
  onPressedChange: () => void
  children: ReactNode
}

function FormatToggle({ label, pressed, onPressedChange, children }: FormatToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<Toggle size="sm" pressed={pressed} onPressedChange={onPressedChange} />}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <TooltipProvider>
      <ToolbarRoot className="w-full rounded-none border-0 border-b bg-muted/20 p-2">
        <ToolbarGroup>
          <FormatToggle
            label="Gras"
            pressed={editor.isActive('bold')}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </FormatToggle>
          <FormatToggle
            label="Italique"
            pressed={editor.isActive('italic')}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </FormatToggle>
          <FormatToggle
            label="Barré"
            pressed={editor.isActive('strike')}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </FormatToggle>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <FormatToggle
            label="Titre 2"
            pressed={editor.isActive('heading', { level: 2 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </FormatToggle>
          <FormatToggle
            label="Titre 3"
            pressed={editor.isActive('heading', { level: 3 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="h-4 w-4" />
          </FormatToggle>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <FormatToggle
            label="Liste à puces"
            pressed={editor.isActive('bulletList')}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </FormatToggle>
          <FormatToggle
            label="Liste numérotée"
            pressed={editor.isActive('orderedList')}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </FormatToggle>
          <FormatToggle
            label="Citation"
            pressed={editor.isActive('blockquote')}
            onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </FormatToggle>
        </ToolbarGroup>
      </ToolbarRoot>
    </TooltipProvider>
  )
}
