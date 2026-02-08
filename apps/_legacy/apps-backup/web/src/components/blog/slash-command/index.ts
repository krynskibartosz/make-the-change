// in /apps/web/src/components/blog/slash-command/index.ts
import { Extension } from '@tiptap/core';
import { suggestion } from './suggestion';

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      suggestion({
        char: '/',
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      }),
    ];
  },
});
