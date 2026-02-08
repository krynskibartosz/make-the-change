'use client';

import { useState, type FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import { EssentialInfoSection } from './rhf/essential-info-section';
import { CharacteristicsSection } from './rhf/characteristics-section';
import { StatusSection } from './rhf/status-section';
import { AdditionalInfoSection } from './rhf/additional-info-section';
import { MediaSection } from './rhf/media-section';
import type { SpeciesFormData } from '../types/species-form.types';

interface SpeciesFormProps {
  form: UseFormReturn<SpeciesFormData>;
  onSubmit: (data: SpeciesFormData) => Promise<void>;
  isLoading?: boolean;
}

export const SpeciesForm: FC<SpeciesFormProps> = ({
  form,
  onSubmit,
  isLoading = false,
}) => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('essential_info');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="essential_info">
                {t('admin.biodex.sections.essential_info')}
              </TabsTrigger>
              <TabsTrigger value="characteristics">
                {t('admin.biodex.sections.characteristics')}
              </TabsTrigger>
              <TabsTrigger value="status">
                {t('admin.biodex.sections.status')}
              </TabsTrigger>
              <TabsTrigger value="additional_info">
                {t('admin.biodex.sections.additional_info')}
              </TabsTrigger>
              <TabsTrigger value="media">
                {t('admin.biodex.sections.media')}
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="essential_info">
                <EssentialInfoSection />
              </TabsContent>
              <TabsContent value="characteristics">
                <CharacteristicsSection />
              </TabsContent>
              <TabsContent value="status">
                <StatusSection />
              </TabsContent>
              <TabsContent value="additional_info">
                <AdditionalInfoSection />
              </TabsContent>
              <TabsContent value="media">
                <MediaSection />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t('admin.biodex.actions.saving')
              : t('admin.biodex.actions.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
};