import { useMemo } from 'react'
import type { PromptIndexItem } from '@/data/types'

export function useSearch(items: PromptIndexItem[], query: string) {
  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase().trim()
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q)
    )
  }, [items, query])

  return filtered
}
