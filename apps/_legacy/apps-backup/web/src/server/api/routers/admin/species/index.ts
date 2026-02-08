import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../../trpc';

// Schéma de validation pour les paramètres de liste
const listInputSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(18),
  search: z.string().optional(),
  sortBy: z.enum(['created_at_desc', 'created_at_asc', 'name_asc', 'name_desc']).optional(),
});

// Schéma de validation pour la création/mise à jour d'une espèce
const speciesSchema = z.object({
  name: z.string().min(1),
  scientific_name: z.string().optional(),
  description: z.string().optional(),
  icon_url: z.string().url().optional(),
  image_url: z.string().url().optional(),
  content_levels: z.record(z.string(), z.object({
    title: z.string()
  })).optional(),
});

export const speciesRouter = createTRPCRouter({
  // Liste des espèces avec pagination et filtres
  list: protectedProcedure
    .input(listInputSchema)
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 18;
      const { cursor, search, sortBy } = input;

      // Construire la requête de base
      const baseQuery = ctx.db
        .selectFrom('species')
        .select([
          'id',
          'name',
          'scientific_name',
          'description',
          'icon_url',
          'image_url',
          'content_levels',
          'created_at',
        ]);

      // Appliquer les filtres de recherche
      if (search) {
        baseQuery.where((eb) =>
          eb.or([
            eb('name', 'ilike', `%${search}%`),
            eb('scientific_name', 'ilike', `%${search}%`),
            eb('description', 'ilike', `%${search}%`),
          ])
        );
      }

      // Appliquer le tri
      switch (sortBy) {
        case 'created_at_asc':
          baseQuery.orderBy('created_at', 'asc');
          break;
        case 'name_asc':
          baseQuery.orderBy('name', 'asc');
          break;
        case 'name_desc':
          baseQuery.orderBy('name', 'desc');
          break;
        case 'created_at_desc':
        default:
          baseQuery.orderBy('created_at', 'desc');
      }

      // Appliquer la pagination
      if (cursor) {
        const cursorSpecies = await ctx.db
          .selectFrom('species')
          .select('created_at')
          .where('id', '=', cursor)
          .executeTakeFirst();

        if (cursorSpecies) {
          baseQuery.where('created_at', '<', cursorSpecies.created_at);
        }
      }

      // Exécuter la requête avec la limite
      const items = await baseQuery.limit(limit + 1).execute();

      // Calculer le total
      const totalQuery = ctx.db
        .selectFrom('species')
        .select(eb => eb.fn.count('id').as('total'));

      if (search) {
        totalQuery.where((eb) =>
          eb.or([
            eb('name', 'ilike', `%${search}%`),
            eb('scientific_name', 'ilike', `%${search}%`),
            eb('description', 'ilike', `%${search}%`),
          ])
        );
      }

      const [{ total }] = await totalQuery.execute();

      let nextCursor: string | undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        total: Number(total),
        nextCursor,
      };
    }),

  // Récupérer une espèce par son ID
  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const species = await ctx.db
        .selectFrom('species')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirst();

      if (!species) {
        throw new Error('Species not found');
      }

      return species;
    }),

  // Créer une nouvelle espèce
  create: protectedProcedure
    .input(speciesSchema)
    .mutation(async ({ ctx, input }) => {
      const species = await ctx.db
        .insertInto('species')
        .values(input)
        .returningAll()
        .executeTakeFirst();

      return species;
    }),

  // Mettre à jour une espèce
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: speciesSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const species = await ctx.db
        .updateTable('species')
        .set(input.data)
        .where('id', '=', input.id)
        .returningAll()
        .executeTakeFirst();

      if (!species) {
        throw new Error('Species not found');
      }

      return species;
    }),

  // Supprimer une espèce
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .deleteFrom('species')
        .where('id', '=', input.id)
        .execute();

      return { success: true };
    }),
});