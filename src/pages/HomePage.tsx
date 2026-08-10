import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PromptFilter } from '@/components/prompt/PromptFilter'
import { PromptGrid } from '@/components/prompt/PromptGrid'
import { useIndexData } from '@/hooks/useIndexData'
import { useSearch } from '@/hooks/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Skeleton } from '@/components/ui/skeleton'

export function HomePage() {
  const [query, setQuery] = useState('')
  const { data, loading: dataLoading } = useIndexData()
  const filtered = useSearch(data, query)
  const { visibleCount, hasMore, loadMore, reset, loading: scrollLoading, newlyLoadedStart } = useInfiniteScroll(filtered.length, 30)

  // Reset pagination when search query changes
  useEffect(() => {
    reset()
  }, [query, reset])

  if (dataLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <Skeleton className="h-10 w-full max-w-md mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          AI 生图提示词库
        </motion.h1>
        <motion.p
          className="text-muted-foreground"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          精选 {data.length}+ 高质量 AI 绘画提示词，点击卡片查看详情
        </motion.p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <PromptFilter
          query={query}
          onQueryChange={setQuery}
          total={data.length}
          filtered={filtered.length}
        />
      </div>

      {/* Grid */}
      <PromptGrid
        items={filtered}
        visibleCount={visibleCount}
        hasMore={hasMore}
        loading={scrollLoading}
        newlyLoadedStart={newlyLoadedStart}
        onLoadMore={loadMore}
      />
    </motion.div>
  )
}
