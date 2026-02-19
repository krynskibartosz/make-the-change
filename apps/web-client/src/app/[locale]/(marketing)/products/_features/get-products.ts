import { unstable_cache } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/static'
import {
    applyProductsFilters,
    applyProductsSort,
    toProductsPagination,
    getPaginationRange,
    clampPage,
} from '@/app/[locale]/(marketing)/products/_features/products-query'
import { PRODUCTS_PAGE_SIZE, type ProductsQueryState } from '@/app/[locale]/(marketing)/products/_features/query-state'

export const getProducts = unstable_cache(
    async (queryState: ProductsQueryState) => {
        const supabase = createStaticClient()

        // 1. Fetch Count
        // @ts-ignore - public_products view might be missing in generated types
        let countQuery = supabase.from('public_products' as any).select('id', { count: 'exact', head: true })
        countQuery = applyProductsFilters(countQuery, queryState)
        const { count, error: countError } = await countQuery

        if (countError) {
            console.error('[products] fetch count failed', countError)
            throw countError
        }

        const totalItems = count ?? 0
        const pagination = toProductsPagination(totalItems, queryState.page, PRODUCTS_PAGE_SIZE)
        const currentPage = clampPage(queryState.page, pagination.totalPages)
        const { from, to } = getPaginationRange(currentPage, PRODUCTS_PAGE_SIZE)

        // 2. Fetch Products
        // @ts-ignore
        let productsQuery = supabase.from('public_products' as any).select('*')
        productsQuery = applyProductsFilters(productsQuery, queryState)
        productsQuery = applyProductsSort(productsQuery, queryState.sort)
        productsQuery = productsQuery.range(from, to)

        const { data: productsList, error: productsError } = await productsQuery

        if (productsError) {
            console.error('[products] fetch products failed', productsError)
            throw productsError
        }

        return {
            products: (productsList || []) as any[],
            pagination: {
                ...pagination,
                currentPage,
            },
            totalItems,
        }
    },
    ['products-list'],
    {
        revalidate: 3600,
        tags: ['products-list'],
    }
)

// Helper to fetch static lists (Categories, Producers, Tags)
export const getProductStaticResources = unstable_cache(
    async () => {
        const supabase = createStaticClient()

        const [categoriesResult, producersResult, tagsResult] = await Promise.all([
            supabase.from('categories').select('*').order('name_default', { ascending: true }),
            supabase.from('producers').select('id, name_default').order('name_default', { ascending: true }),
            // @ts-ignore
            supabase.from('public_products' as any).select('tags'),
        ])

        const availableTags = Array.from(
            new Set<string>(((tagsResult.data as any[]) || []).flatMap((row: { tags?: string[] | null }) => row.tags || [])),
        ).sort((a, b) => a.localeCompare(b))

        return {
            categories: categoriesResult.data || [],
            producers: producersResult.data || [],
            availableTags,
        }
    },
    ['products-static-resources'],
    {
        revalidate: 86400, // 24 hours
        tags: ['products-static'],
    }
)
