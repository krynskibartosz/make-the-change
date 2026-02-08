'use client';

import { type FC } from 'react';
import { useSpeciesForm } from '../hooks/use-species-form';
import { type Species } from '@make-the-change/api/validators/species';

interface SpeciesFormProps {
  initialData?: Partial<Species>;
  speciesId?: string;
  children?: React.ReactNode;
}

export const SpeciesForm: FC<SpeciesFormProps> = ({ 
  initialData,
  speciesId,
  children 
}) => {
  const { form } = useSpeciesForm({
    initialData,
    speciesId,
  });

  return (
    <form.AppForm>
      {children}
    </form.AppForm>
  );
};