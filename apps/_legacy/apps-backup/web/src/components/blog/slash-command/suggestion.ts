// in /apps/web/src/components/blog/slash-command/suggestion.ts
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import {
  Heading2,
  List,
  Code,
  Image as ImageIcon,
  Quote,
} from 'lucide-react';
import { CommandList } from './CommandList';
import { Editor, Range } from '@tiptap/core';

const commandItems = [
  {
    title: 'Heading 2',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
    icon: <Heading2 size={18} />,
  },
  {
    title: 'List',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
    icon: <List size={18} />,
  },
  {
    title: 'Image',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      // For now, just a placeholder
      const url = window.prompt('URL');
      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
      }
    },
    icon: <ImageIcon size={18} />,
  },
  {
    title: 'Quote',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
    icon: <Quote size={18} />,
  },
  {
    title: 'Code',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
    icon: <Code size={18} />,
  },
];

export const suggestion = {
  items: ({ query }: { query: string }) => {
    return commandItems.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    );
  },

  render: () => {
    let component: ReactRenderer;
    let popup: any;

    return {
      onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: { editor: Editor; clientRect: DOMRect }) {
        component.updateProps(props);

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
