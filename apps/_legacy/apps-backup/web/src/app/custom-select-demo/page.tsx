import { CustomSelectExample } from '@/components/ui/custom-select-example';

export default function CustomSelectDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <h1 className="mb-2 text-4xl font-bold">CustomSelect Component</h1>
          <p className="text-muted-foreground">
            Composant de sélection premium qui remplace les <code className="rounded bg-muted px-2 py-1">&lt;select&gt;</code> natifs
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Route : <code className="rounded bg-muted px-2 py-1">/custom-select-demo</code>
          </p>
        </div>
      </header>

      <main>
        <CustomSelectExample />
      </main>

      <footer className="mt-16 border-t-2 border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            CustomSelect Component - Make the CHANGE
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Mission : Remplacer tous les &lt;select&gt; natifs par ce composant customisé
          </p>
        </div>
      </footer>
    </div>
  );
}
