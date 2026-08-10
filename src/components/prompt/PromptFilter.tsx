import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface PromptFilterProps {
  query: string
  onQueryChange: (query: string) => void
  total: number
  filtered: number
}

export function PromptFilter({ query, onQueryChange, total, filtered }: PromptFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索提示词标题..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <p className="text-sm text-muted-foreground whitespace-nowrap">
        共 {filtered} / {total} 个提示词
      </p>
    </div>
  )
}
