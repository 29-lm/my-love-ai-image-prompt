import { useEffect, useCallback, useRef } from 'react'
import { PromptCard } from './PromptCard'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { PromptIndexItem } from '@/data/types'

interface PromptGridProps {
  items: PromptIndexItem[]
  visibleCount: number
  hasMore: boolean
  loading: boolean
  newlyLoadedStart: number
  onLoadMore: () => void
}

export function PromptGrid({
  items,
  visibleCount,
  hasMore,
  loading,
  newlyLoadedStart,
  onLoadMore,
}: PromptGridProps) {
  const visibleItems = items.slice(0, visibleCount)
  const observerRef = useRef<HTMLDivElement>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore()
      }
    },
    [hasMore, loading, onLoadMore]
  )

  useEffect(() => {
    const el = observerRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '200px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleObserver])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">没有找到匹配的提示词</p>
        <p className="text-sm mt-1">尝试其他关键词搜索</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {visibleItems.map((item, index) => {
          const isNew = index >= newlyLoadedStart && newlyLoadedStart > 0
          const delay = isNew ? Math.min((index - newlyLoadedStart) * 0.04, 0.6) : 0

          return (
            <div
              key={item.id}
              className={isNew ? 'animate-fade-in-up' : ''}
              style={{
                animationDelay: isNew ? `${delay}s` : undefined,
                animationFillMode: 'both',
              }}
            >
              <PromptCard item={item} index={index} />
            </div>
          )
        })}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerRef} className="h-4" />

      {/* Subtle loading indicator */}
      {loading && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>加载中...</span>
          </div>
        </div>
      )}

      {/* Manual load more fallback */}
      {hasMore && !loading && (
        <div className="flex justify-center py-6">
          <Button variant="outline" onClick={onLoadMore} className="gap-2">
            加载更多
          </Button>
        </div>
      )}
    </div>
  )
}
