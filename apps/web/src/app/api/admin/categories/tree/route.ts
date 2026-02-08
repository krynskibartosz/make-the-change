import { db } from '@make-the-change/core/db'
import { categories } from '@make-the-change/core/schema'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'

type CategoryNode = {
  id: string
  name: string
  slug: string | null
  is_active: boolean | null
  parent_id: string | null
  sort_order: number | null
  children: CategoryNode[]
}

export async function GET(_request: NextRequest) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const rows = await db
      .select({
        id: categories.id,
        name: categories.name_default,
        slug: categories.slug,
        is_active: categories.is_active,
        parent_id: categories.parent_id,
        sort_order: categories.sort_order,
      })
      .from(categories)
      .orderBy(categories.sort_order)

    const nodes = new Map<string, CategoryNode>()
    for (const category of rows || []) {
      nodes.set(category.id, {
        id: category.id,
        name: category.name ?? '',
        slug: category.slug ?? null,
        is_active: category.is_active ?? null,
        parent_id: category.parent_id ?? null,
        sort_order: category.sort_order ?? null,
        children: [],
      })
    }

    const roots: CategoryNode[] = []
    for (const node of nodes.values()) {
      if (node.parent_id && nodes.has(node.parent_id)) {
        nodes.get(node.parent_id)?.children.push(node)
      } else {
        roots.push(node)
      }
    }

    const sortTree = (items: CategoryNode[]) => {
      items.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      for (const item of items) sortTree(item.children)
    }
    sortTree(roots)

    return NextResponse.json({ data: roots })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
