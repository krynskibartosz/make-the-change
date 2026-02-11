'use client'

import { Toggle } from '@make-the-change/core/ui'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, Link as LinkIcon } from 'lucide-react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Toolbar } from './toolbar'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isTipTapDoc = (value: unknown): boolean => {
  if (!isRecord(value) || value.type !== 'doc') {
    return false
  }

  if (value.content !== undefined && !Array.isArray(value.content)) {
    return false
  }

  return true
}

const parseEditorContent = (content: string): string | Record<string, unknown> => {
  const trimmed = content.trim()
  if (!trimmed) {
    return '<p></p>'
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown
    if (isTipTapDoc(parsed) && isRecord(parsed)) {
      return parsed
    }
  } catch {
    // Keep legacy HTML/string support for already stored posts.
  }

  return content
}

interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export const EditorComponent = ({
  content,
  onChange,
  placeholder = 'Commencez à écrire...',
  className,
}: EditorProps) => {
  const initialContentRef = useRef(parseEditorContent(content))

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContentRef.current,
    editorProps: {
      attributes: {
        class: cn(
          'prose dark:prose-invert prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4',
          className,
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()))
    },
  })

  return (
    <div className="flex flex-col justify-stretch border border-input rounded-lg bg-background overflow-hidden">
      <Toolbar editor={editor} />
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center gap-1 p-1 border rounded-md bg-background shadow-md">
            <Toggle
              size="sm"
              pressed={editor.isActive('bold')}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('italic')}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('link')}
              onPressedChange={() => {
                const url = window.prompt('URL')
                if (url) {
                  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                }
              }}
            >
              <LinkIcon className="h-4 w-4" />
            </Toggle>
          </div>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
