import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PromptDetail } from '@/components/prompt/PromptDetail'
import { usePromptDetail } from '@/hooks/usePromptDetail'

export function DetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { item, loading } = usePromptDetail(slug)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Skeleton className="aspect-[16/10] w-full rounded-xl mb-8" />
        <Skeleton className="h-8 w-2/3 mb-3" />
        <Skeleton className="h-5 w-32 mb-6" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">提示词未找到</h1>
        <p className="text-muted-foreground mb-6">
          抱歉，找不到对应的提示词内容
        </p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回首页
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Back button */}
      <div className="container mx-auto px-4 pt-4 max-w-5xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
      </div>

      <PromptDetail item={item} />
    </motion.div>
  )
}
