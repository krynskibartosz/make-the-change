// in /apps/web/src/app/admin/blog/[id]/page.tsx

'use client';

import { EditorComponent } from "@/components/blog/EditorComponent";
import { MetadataSidebar } from "@/components/blog/MetadataSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState, useEffect, useCallback } from "react";

// A simple debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}


export default function EditPostPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState("<p>This is the initial content of the editor.</p>");
  const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Mock tRPC mutation
  const savePost = async (postContent: string) => {
    console.log("Saving content:", postContent);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Content saved!");
    return { success: true };
  };

  const debouncedSave = useCallback(
    debounce(async (newContent: string) => {
      setStatus('saving');
      await savePost(newContent);
      setStatus('saved');
    }, 2000),
    []
  );

  const handleContentChange = (newContent: string) => {
    setStatus('unsaved');
    setContent(newContent);
    debouncedSave(newContent);
  };
  
  const post = { title: "Example Title" }; // Placeholder

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        breadcrumbs={[{ name: 'Blog', href: '/admin/blog' }, { name: post?.title || '...' }]}
        actions={<button>Prévisualiser</button>}
        statusIndicator={status} // "saving", "saved", etc.
      />
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 lg:p-8 flex-grow">
        
        <div className="lg:col-span-2 flex flex-col gap-4">
          <input
            placeholder="Titre de l'article..."
            className="text-4xl font-bold font-serif bg-transparent focus:outline-none"
            defaultValue={post.title}
          />
          <EditorComponent
            content={content}
            onChange={handleContentChange}
          />
        </div>

        <aside className="lg:col-span-1">
          <MetadataSidebar />
        </aside>

      </main>
    </div>
  );
}
