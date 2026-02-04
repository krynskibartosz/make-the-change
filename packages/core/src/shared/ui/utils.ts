/**
 * Utility function to merge class names safely
 */
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

/**
 * Merge classNames with Tailwind CSS support
 * Combines clsx for conditional classes with twMerge for Tailwind merging
 * 
 * @example
 * ```typescript
 * cn('px-4 py-2', 'px-8 py-4') // => 'px-8 py-4'
 * cn('px-4 py-2', condition && 'bg-blue-500') // => 'px-4 py-2 bg-blue-500'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
