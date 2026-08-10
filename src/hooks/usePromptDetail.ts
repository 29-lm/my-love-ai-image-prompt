import { useState, useEffect } from 'react'
import type { PromptItem } from '@/data/types'

const detailCache = new Map<string, PromptItem>()

export function usePromptDetail(slug: string | undefined) {
  const [item, setItem] = useState<PromptItem | null>(
    slug ? detailCache.get(slug) || null : null
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    if (detailCache.has(slug)) {
      setItem(detailCache.get(slug)!)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch('/data/prompts.json')
      .then((res) => res.json())
      .then((allPrompts: PromptItem[]) => {
        // Cache all prompts for future lookups
        for (const p of allPrompts) {
          detailCache.set(p.slug, p)
        }
        setItem(detailCache.get(slug) || null)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load prompt data:', err)
        setLoading(false)
      })
  }, [slug])

  return { item, loading }
}
