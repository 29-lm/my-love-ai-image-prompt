import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { PromptIndexItem } from '@/data/types'

interface PromptCardProps {
  item: PromptIndexItem
  index: number
}

export const PromptCard = memo(function PromptCard({ item }: PromptCardProps) {
  const coverImage = item.images[0] || ''

  return (
    <Link to={`/prompt/${item.slug}`}>
      <motion.div
        className="group relative overflow-hidden rounded-lg border bg-card shadow-sm"
        whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.12)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">暂无图片</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-sm font-medium text-white leading-tight line-clamp-2">
            {item.title}
          </h3>
        </div>
      </motion.div>
    </Link>
  )
})
