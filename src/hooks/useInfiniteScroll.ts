import { useState, useCallback, useRef } from 'react'

export function useInfiniteScroll(totalItems: number, pageSize: number = 30) {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const prevVisibleRef = useRef(0)
  const loadingTimerRef = useRef<number | null>(null)

  const loadMore = useCallback(() => {
    if (loading) return
    setLoading(true)

    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current)
    }

    // Brief delay to show loading indicator, then reveal new content
    loadingTimerRef.current = window.setTimeout(() => {
      setPage((prev) => {
        const next = prev + 1
        prevVisibleRef.current = Math.min(prev * pageSize, totalItems)
        return next
      })
      setLoading(false)
    }, 300)
  }, [loading, pageSize, totalItems])

  const visibleCount = Math.min(page * pageSize, totalItems)
  const hasMore = visibleCount < totalItems
  const newlyLoadedStart = prevVisibleRef.current

  const reset = useCallback(() => {
    setPage(1)
    setLoading(false)
    prevVisibleRef.current = 0
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current)
    }
  }, [])

  return { visibleCount, hasMore, loadMore, reset, page, loading, newlyLoadedStart }
}
