import { DesignSystemV2Example } from '@/components/ui/v2/example';

export default function DesignSystemV2Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <h1 className="mb-2 text-4xl font-bold">Design System v2.0</h1>
          <p className="text-muted-foreground">
            Nouveau design system avec gradients Bleu → Turquoise et Jaune → Or
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Route : <code className="rounded bg-muted px-2 py-1">/design-system-v2</code>
          </p>
        </div>
      </header>

      <main>
        <DesignSystemV2Example />
      </main>

      <footer className="mt-16 border-t-2 border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Design System v2.0 - Make the CHANGE
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Documentation complète : <code>/DESIGN_SYSTEM_V2.md</code>
          </p>
        </div>
      </footer>
    </div>
  );
}
