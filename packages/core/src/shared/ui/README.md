# Core UI Components Library

## Architecture Overview

This is a **production-ready** component library built with:
- **Base UI Philosophy** - Composable, unstyled, accessible patterns
- **Class Variance Authority (CVA)** - Type-safe variant styling
- **Tailwind CSS** - Utility-first styling framework
- **TypeScript** - Full type safety
- **React 19** - Latest React features

## Design Principles

1. **Composable** - Build complex UIs from simple components
2. **Accessible** - WCAG 2.1 compliant with semantic HTML
3. **Type-Safe** - Full TypeScript support with proper inference
4. **Utility-Driven** - Tailwind CSS for consistent styling
5. **Framework Agnostic** - Works across web, web-client, and mobile

## Base UI Governance

`packages/core/src/shared/ui` follows a strict governance model:

1. **Use Base UI primitives first for interactive behavior**  
   Any reusable interaction (`button`, `input`, `select`, `textarea`, menus, dialogs, etc.) must be built through wrappers in `base/**`.

2. **No direct `@base-ui/react*` imports outside `base/**`**  
   The only accepted exceptions are explicit file-level allowlist entries enforced by CI.

3. **Intentional custom components stay documented**  
   Components that are intentionally custom (layout/composition patterns without direct Base UI primitive parity) are listed in:
   - `packages/core/src/shared/ui/base-ui-exceptions.ts`

4. **Raw interactives are guarded**  
   CI blocks new raw interactive tags outside `base/**`, except for files explicitly allowlisted in `BASE_UI_RAW_INTERACTIVE_ALLOWLIST`.

5. **Public API stability first**  
   Migrations should keep public exports and signatures stable for `web-client`, unless a dedicated breaking-change cycle is approved.

## Directory Structure

```
ui/
├── base/                    # Base components (primitives)
│   ├── button.tsx          # Button component (CVA + Tailwind)
│   ├── input.tsx           # Input component
│   ├── checkbox.tsx        # Checkbox component
│   ├── select.tsx          # Select component
│   ├── dialog.tsx          # Dialog component
│   └── badge.tsx           # Badge component
│
├── forms/                   # Form-specific components (NEW)
│   ├── form-field.tsx      # FormField wrapper with validation
│   ├── form-input.tsx      # Form input with field integration
│   ├── form-checkbox.tsx   # Form checkbox with field integration
│   └── form-select.tsx     # Form select with field integration
│
├── composites/             # Composed components (NEW)
│   ├── data-list.tsx       # Data list component
│   ├── data-card.tsx       # Data card component
│   ├── date-picker.tsx     # Date picker with calendar (NEW)
│   ├── image-upload.tsx    # Image upload with callbacks (NEW)
│   ├── filters/            # Filter components module (NEW)
│   │   └── index.tsx
│   ├── map-container.tsx   # Leaflet-based map (NEW)
│   ├── image-masonry.tsx   # Optimized image grid (NEW)
│   ├── subscription-badge.tsx # Domain-specific badge (NEW)
│   └── product-card-skeleton.tsx # Skeleton loader (NEW)
│
├── globals.css             # Global styles
├── tokens.ts               # Design tokens
├── types.ts                # Shared types (NEW)
├── index.ts                # Main exports
└── README.md               # This file
```

## Component Categories

### Base Components (Primitives)

Base components are production-ready, styled with CVA + Tailwind:

```typescript
import { Button, Input, Select, Dialog } from '@core/shared/ui';

<Button variant="primary" size="md">Click me</Button>
<Input type="email" placeholder="you@example.com" />
<Select options={items} value={value} onValueChange={setValue} />
<Dialog open={open} onOpenChange={setOpen} title="Title">Content</Dialog>
```

**Status**: ✅ Production Ready  
**Components**: Button, Input, Checkbox, Select, Dialog, Badge

### Form Components (PHASE 2)

Form components are React Hook Form bindings for base UI components:

```typescript
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput, FormCheckbox, FormSelect } from '@core/shared/ui';

type Values = {
  email: string;
  role: string;
  accepted: boolean;
};

const form = useForm<Values>({
  defaultValues: { email: '', role: '', accepted: false },
});

<FormProvider {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormInput name="email" label="Email" />
    <FormSelect name="role" label="Role" options={roles} />
    <FormCheckbox name="accepted" label="Accept terms" />
  </form>
</FormProvider>
```

**Status**: ✅ Production Ready (RHF)  
**Components**: FieldShell, FormField, FormInput, FormTextArea, FormSelect, FormCheckbox, FormSubmitButton

### Composite Components (PHASE 3)

Composites combine multiple components with domain logic:

```typescript
import { DataList, DataCard, Filters } from '@core/shared/ui';

<DataList items={items} onSelect={handleSelect} />
<Filters filters={filterOptions} onFilterChange={handleFilter} />
<DataCard title="Item" description="Description" />
```

**Status**: 🔄 In Development  
**Components**: DataList, DataCard, Filters, DatePicker, ImageUpload

### Specialized Components (PHASE 4)

Specialized components handle specific use cases:

```typescript
import { MapComponent, ImageMasonry, SubscriptionBadge } from '@core/shared/ui';

<MapComponent locations={locations} />
<ImageMasonry images={images} columns={3} />
<SubscriptionBadge status="active" />
```

**Status**: ⏳ Planned  
**Components**: MapContainer, ImageMasonry, SubscriptionBadge, ProductCardSkeleton

## Implementation Patterns

### Pattern 1: CVA Variants (Base Components)

Class Variance Authority provides type-safe variant styling:

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        ghost: 'text-gray-700 hover:bg-gray-100',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
  }
);
```

### Pattern 2: Composition (Composite Components)

Combine multiple base components:

```typescript
export function DataList<T>({ items, onSelect }: DataListProps<T>) {
  return (
    <div className="space-y-2">
      {items.map(item => (
        <Button
          key={item.id}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onSelect(item)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
```

### Pattern 3: Form Integration (Form Components)

Integrate with TanStack Form for validation:

```typescript
export function FormInput({ field, error, ...props }: FormInputProps) {
  return (
    <div>
      <Input
        value={field.state.value}
        onChange={e => field.handleChange(e.target.value)}
        {...props}
      />
      {field.state.meta.errors && (
        <span className="text-red-600">{field.state.meta.errors[0]}</span>
      )}
    </div>
  );
}
```

## Design Tokens

Design tokens in `tokens.ts` provide consistent values:

```typescript
export const colors = {
  primary: '#0066CC',
  secondary: '#6C757D',
  success: '#28A745',
  danger: '#DC3545',
};

export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
};
```

## Accessibility

All components follow WCAG 2.1:

- **Keyboard navigation** - Tab, Enter, Escape support
- **Screen readers** - ARIA labels and descriptions
- **Focus management** - Visible focus indicators
- **Semantic HTML** - Proper heading/list structure
- **Color contrast** - WCAG AA compliant ratios

```typescript
<Button
  aria-label="Close dialog"
  className="focus:ring-2 focus:ring-blue-500"
>
  ✕
</Button>
```

## Usage in Apps

### Web App

```typescript
import { Button, Input, Dialog } from '@core/shared/ui';

export function LoginPage() {
  return (
    <Dialog open={open} onOpenChange={setOpen} title="Login">
      <Input type="email" />
      <Button variant="primary">Sign In</Button>
    </Dialog>
  );
}
```

### Web-Client App

```typescript
import { DataList, Button } from '@core/shared/ui';

export function Dashboard() {
  return (
    <>
      <Button>New Item</Button>
      <DataList items={items} onSelect={handleSelect} />
    </>
  );
}
```

### Mobile App

Components work on mobile with appropriate sizes and touch targets.

## Development Workflow

### Adding a New Base Component

1. Create file: `base/new-component.tsx`
2. Define CVA variants
3. Create component with forwardRef
4. Add TypeScript types
5. Export from `index.ts`
6. Write tests
7. Document in README

### Adding a Composite Component

1. Create file: `composites/new-composite.tsx`
2. Combine base components
3. Add form logic if needed
4. Create TypeScript types
5. Export from `index.ts`
6. Write tests
7. Document usage

## Testing

Components are tested with:

```bash
pnpm test                  # Run all tests
pnpm test:ui               # Open test UI
pnpm type-check            # Type checking
pnpm lint                  # Linting
```

## Performance

- **Tree-shaking** - All named exports
- **Code splitting** - Independent component imports
- **Bundle size** - ~15KB gzipped (core components)
- **Rendering** - Proper memoization and optimization

## Styling Best Practices

### ✅ Do

```typescript
// Use Tailwind utilities
className="px-4 py-2 bg-blue-600 text-white rounded-md"

// Use CVA for variants
<Button variant="primary" size="lg" />

// Use twMerge for composition
className={twMerge(baseStyles, variantStyles, customClass)}
```

### ❌ Don't

```typescript
// Don't use inline styles
style={{ padding: '1rem', backgroundColor: 'blue' }}

// Don't create custom classes
className="custom-button-style"

// Don't hardcode colors
className="p-4" // instead: use tokens
```

## Migration Guide

### From Old Components

```typescript
// Old
import { Button } from '@/components/ui/button';

// New
import { Button } from '@core/shared/ui';
```

The API remains the same - just change the import path.

## Contributing

When adding components:

1. **Follow the structure** - base, forms, or composites
2. **Use TypeScript** - Proper Props interfaces
3. **Apply Tailwind** - Utility classes only
4. **Write tests** - Unit + integration
5. **Document** - JSDoc + README
6. **Export** - Add to index.ts

## Resources

- [CVA Documentation](https://cva.style)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Accessibility Best Practices](https://www.a11y-101.com)

## Status

| Phase | Status | Components |
|-------|--------|------------|
| Base Primitives | ✅ Complete | Button, Input, Checkbox, Select, Dialog, Badge |
| Forms | 🔄 In Progress | FormField, FormInput, FormCheckbox, FormSelect |
| Composites | 🔄 In Progress | DataList, DataCard, Filters, DatePicker, ImageUpload |
| Specialized | ⏳ Planned | Map, Masonry, Badges, Skeletons |

## License

Same as main project.

---

**Last Updated**: February 4, 2026  
**Maintained By**: Development Team  
**Production Ready**: ✅ Yes
