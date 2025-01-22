import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Tag, Category, NotepadFilter } from '../types'

const NO_CATEGORY = '__none__'
const SELECT_TAG = '__select_tag__'

interface FileFilterProps {
  tags: Tag[]
  categories: Category[]
  activeFilter: NotepadFilter
  setActiveFilter: (filter: NotepadFilter) => void
}

export function FileFilter({ tags, categories, activeFilter, setActiveFilter }: FileFilterProps) {
  const selectedTags = tags.filter(tag => activeFilter.tagIds.includes(tag.id))
  const selectedCategory = categories.find(cat => cat.id === activeFilter.categoryId)

  const handleAddTag = (tagId: string) => {
    if (tagId === SELECT_TAG) return
    setActiveFilter({
      ...activeFilter,
      tagIds: [...activeFilter.tagIds, tagId],
    })
  }

  const handleRemoveTag = (tagId: string) => {
    setActiveFilter({
      ...activeFilter,
      tagIds: activeFilter.tagIds.filter(id => id !== tagId),
    })
  }

  const handleSetCategory = (categoryId: string) => {
    setActiveFilter({
      ...activeFilter,
      categoryId: categoryId === NO_CATEGORY ? undefined : categoryId,
    })
  }

  const handleSearch = (query: string) => {
    setActiveFilter({
      ...activeFilter,
      searchQuery: query,
    })
  }

  const clearFilters = () => {
    setActiveFilter({
      tagIds: [],
      categoryId: undefined,
      searchQuery: '',
    })
  }

  const hasFilters = activeFilter.tagIds.length > 0 ||
                    activeFilter.categoryId !== undefined ||
                    activeFilter.searchQuery !== ''

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索文件..."
          value={activeFilter.searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-9 pl-8"
        />
      </div>

      <div className="flex flex-col gap-2">
        {/* Filters Row */}
        <div className="grid gap-2 grid-cols-1 sm:items-center">
          {/* Tag Filter */}
          <Select
            value={SELECT_TAG}
            onValueChange={handleAddTag}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="按标签过滤..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SELECT_TAG}>选择标签...</SelectItem>
              {tags
                .filter(tag => !activeFilter.tagIds.includes(tag.id))
                .map(tag => (
                  <SelectItem key={tag.id} value={tag.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={activeFilter.categoryId ?? NO_CATEGORY}
            onValueChange={handleSetCategory}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="按分类过滤..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_CATEGORY}>所有分类</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-2 text-muted-foreground justify-start sm:justify-center"
            >
              清除过滤
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className={cn(
            'flex flex-wrap items-center gap-2',
            (selectedTags.length > 0 || selectedCategory) && 'pt-2'
          )}>
            {selectedTags.map(tag => (
              <Badge
                key={tag.id}
                style={{ backgroundColor: tag.color }}
                className="gap-1 text-white"
              >
                {tag.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-black/20"
                  onClick={() => handleRemoveTag(tag.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {selectedCategory && (
              <Badge variant="outline" className="gap-1">
                {selectedCategory.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => handleSetCategory(NO_CATEGORY)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
