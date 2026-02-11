'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Toolbar } from './toolbar'
import { Bold, Italic, Link as LinkIcon } from 'lucide-react'
import { Toggle } from '@make-the-change/core/ui'
import { cn } from '@/lib/utils'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export const EditorComponent = ({ content, onChange, placeholder = 'Commencez à écrire...', className }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          'prose dark:prose-invert prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4',
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
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
