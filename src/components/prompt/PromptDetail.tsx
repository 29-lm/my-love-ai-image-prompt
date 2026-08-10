import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { PromptItem } from '@/data/types'

interface PromptDetailProps {
  item: PromptItem
}

export function PromptDetail({ item }: PromptDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('zh')

  const images = item.images
  const currentPrompt = activeTab === 'zh' ? item.zh_prompt : item.en_prompt

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = currentPrompt
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6 max-w-5xl"
    >
      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="relative mb-8 overflow-hidden rounded-xl bg-muted">
          <div className="relative aspect-[3/4] sm:aspect-[16/10] max-h-[600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`${item.title} - ${currentImageIndex + 1}`}
                className="h-full w-full object-contain"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-background/80 rounded-full px-3 py-1 text-xs font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Title & Meta */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{item.title}</h1>
        <Badge variant="secondary" className="text-xs">
          {item.slug}
        </Badge>
      </div>

      {/* Prompt Tabs */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-3">
            <TabsList>
              <TabsTrigger value="zh">中文提示词</TabsTrigger>
              <TabsTrigger value="en">English Prompt</TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              size="sm"
              onClick={copyPrompt}
              className="gap-2"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    已复制
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    复制
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>

          <TabsContent value="zh">
            <motion.div
              key="zh"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border bg-card p-4 sm:p-6"
            >
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-card-foreground">
                {item.zh_prompt}
              </pre>
            </motion.div>
          </TabsContent>

          <TabsContent value="en">
            <motion.div
              key="en"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border bg-card p-4 sm:p-6"
            >
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-card-foreground">
                {item.en_prompt}
              </pre>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">所有图片</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {images.map((img, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentImageIndex(idx)}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                  idx === currentImageIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-muted-foreground/30'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
