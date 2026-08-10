import { useState, useEffect } from 'react'
import type { PromptIndexItem } from '@/data/types'

let cachedIndex: PromptIndexItem[] | null = null

export function useIndexData() {
  const [data, setData] = useState<PromptIndexItem[]>(cachedIndex || [])
  const [loading, setLoading] = useState(!cachedIndex)

  useEffect(() => {
    if (cachedIndex) {
      setData(cachedIndex)
      setLoading(false)
      return
    }

    fetch('/data/index.json')
      .then((res) => res.json())
      .then((json) => {
        cachedIndex = json
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load index data:', err)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
