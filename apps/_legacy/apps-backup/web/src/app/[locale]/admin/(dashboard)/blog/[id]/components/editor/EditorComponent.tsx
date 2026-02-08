// in /apps/web/src/components/blog/EditorComponent.tsx
'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './Toolbar';
import { Bold, Italic, Link } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { SlashCommand } from './slash-command';
import Image from '@tiptap/extension-image';


interface EditorProps {
    content: string;
    onChange: (content: string) => void;
}

export const EditorComponent = ({ content, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable heading levels that we don't want
        heading: {
          levels: [2, 3],
        },
        // Re-enable blockquote for the slash command
        blockquote: true,
      }),
      Image,
      SlashCommand,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
      handleDrop: async function (view, event, slice, moved) {
        event.preventDefault();

        if (!event.dataTransfer || !event.dataTransfer.files.length) {
          return false;
        }

        const files = Array.from(event.dataTransfer.files);

        // Handle multiple files if needed, for now just take the first one
        const file = files[0];
        if (!file) return false;

        // Show a loading state in the editor
        const { schema } = view.state;
        const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (!coordinates) return false;

        const node = schema.nodes.image.create({ src: '' });
        const transaction = view.state.tr.insert(coordinates.pos, node);
        view.dispatch(transaction);

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const { url, error } = await response.json();

          if (error) {
            console.error('Upload failed:', error);
            // Remove the placeholder image
            const tr = view.state.tr.delete(coordinates.pos, coordinates.pos + 1);
            view.dispatch(tr);
            return;
          }

          // Update the placeholder image with the real URL
          const pos = coordinates.pos;
          const tr = view.state.tr.setNodeMarkup(pos, undefined, { src: url });
          view.dispatch(tr);

        } catch (e) {
          console.error('Upload request failed:', e);
          // Remove the placeholder image on failure
          const tr = view.state.tr.delete(coordinates.pos, coordinates.pos + 1);
          view.dispatch(tr);
        }

        return true;
      },
    },
    onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-stretch min-h-[500px] border border-input rounded-lg">
      <Toolbar editor={editor} />
      {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex items-center gap-1 p-1 border rounded-md bg-background border-input">
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
              const url = window.prompt('URL');
              if (url) {
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
              }
            }}
          >
            <Link className="h-4 w-4" />
          </Toggle>
        </div>
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </div>
  );
};
