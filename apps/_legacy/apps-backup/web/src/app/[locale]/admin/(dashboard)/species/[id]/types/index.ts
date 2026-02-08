import { type DeepKeys } from '@tanstack/react-form';
import { type z } from 'zod';

export interface SpeciesFormData {
  name: string;
  description?: string;
  image_url?: string;
  icon_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Helper type for field paths
export type SpeciesFormField = DeepKeys<SpeciesFormData>;

// Helper type for field values by key
export type SpeciesFormFieldValue<K extends SpeciesFormField> = SpeciesFormData[K];