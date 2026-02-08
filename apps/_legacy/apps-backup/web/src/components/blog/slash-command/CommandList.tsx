// in /apps/web/src/components/blog/slash-command/CommandList.tsx
import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from 'react';
import { Editor, Range } from '@tiptap/core';

interface Command {
  title: string;
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
  icon: ReactNode;
}

interface CommandListProps {
  items: Command[];
  command: any;
  editor: Editor;
  range: Range;
}

export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
      (index: number) => {
        const item = props.items[index];
        if (item) {
          props.command({ editor: props.editor, range: props.range });
        }
      },
      [props]
    );

    useEffect(() => {
      const navigation = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length
          );
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % props.items.length);
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      };
      document.addEventListener('keydown', navigation);
      return () => {
        document.removeEventListener('keydown', navigation);
      };
    }, [props, selectedIndex, setSelectedIndex, selectItem]);

    useEffect(() => setSelectedIndex(0), [props.items]);

    return (
      <div
        ref={ref}
        className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all"
      >
        {props.items.length ? (
          props.items.map((item: Command, index: number) => (
            <button
              className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 ${
                index === selectedIndex ? 'bg-stone-100 text-stone-900' : ''
              }`}
              key={index}
              onClick={() => selectItem(index)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
              </div>
            </button>
          ))
        ) : (
          <div className="p-2">No results</div>
        )}
      </div>
    );
  }
);

CommandList.displayName = 'CommandList';
