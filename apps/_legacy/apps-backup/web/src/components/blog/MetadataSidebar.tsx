// in /apps/web/src/components/blog/MetadataSidebar.tsx

export const MetadataSidebar = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Status</h3>
        <p className="text-sm text-muted-foreground">Set the status of the post.</p>
      </div>
      <div>
        <h3 className="text-lg font-medium">Categories</h3>
        <p className="text-sm text-muted-foreground">Organize your post.</p>
      </div>
      <div>
        <h3 className="text-lg font-medium">Cover Image</h3>
        <p className="text-sm text-muted-foreground">Upload a cover image.</p>
      </div>
      <div>
        <h3 className="text-lg font-medium">SEO</h3>
        <p className="text-sm text-muted-foreground">Configure search engine optimization.</p>
      </div>
    </div>
  );
};
