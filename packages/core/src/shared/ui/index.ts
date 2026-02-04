/**
 * UI Module - Composable Component Library
 * 
 * Exports organized by category:
 * - base: Base components (Button, Input, Select, Dialog, etc.)
 * - forms: Form-specific components (TBD)
 * - composites: Composed components (TBD)
 * - types: Shared TypeScript types
 * - tokens: Design tokens
 */

// Base UI Components
export { Button, buttonVariants } from './base/button';
export { Input } from './base/input';
export { Checkbox, CheckboxWithLabel } from './base/checkbox';
export { Select, SelectGroup } from './base/select';
export { Dialog } from './base/dialog';
export { Badge, badgeVariants } from './base/badge';

// Legacy Composites (to be refactored)
export * from './card';
export * from './data-list';
export * from './data-card';
export * from './pagination';
export * from './progress';

// Design System
export * from './tokens';
export * from './types';
