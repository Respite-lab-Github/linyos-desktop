import { Plus, Edit2, Trash2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { NoteFile, Tag, Category } from '../types'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const NO_CATEGORY = '__none__'

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#22c55e', '#06b6d4', '#3b82f6', '#6366f1',
  '#a855f7', '#ec4899', '#f43f5e'
]

interface FileMetadataProps {
  activeFile: NoteFile | undefined
  tags: Tag[]
  categories: Category[]
  createTag: (name: string, color: string) => Tag
  createCategory: (name: string, description?: string) => Category
  updateTag: (id: string, updates: Partial<Tag>) => void
  deleteTag: (id: string) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  addTagToFile: (fileId: string, tagId: string) => void
  removeTagFromFile: (fileId: string, tagId: string) => void
  setCategoryForFile: (fileId: string, categoryId: string | undefined) => void
}

export function FileMetadata({
  activeFile,
  tags,
  categories,
  createTag,
  createCategory,
  updateTag,
  deleteTag,
  updateCategory,
  deleteCategory,
  addTagToFile,
  removeTagFromFile,
  setCategoryForFile,
}: FileMetadataProps) {
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [isTagsOpen, setIsTagsOpen] = useState(true)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)

  const handleCreateTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name') as string
    const color = formData.get('color') as string

    if (!name.trim()) return
    createTag(name.trim(), color)
    form.reset()
    setIsAddingTag(false)
  }

  const handleCreateCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!name.trim()) return
    createCategory(name.trim(), description)
    form.reset()
    setIsAddingCategory(false)
  }

  const handleCategoryChange = (value: string) => {
    if (!activeFile) return
    setCategoryForFile(activeFile.id, value === NO_CATEGORY ? undefined : value)
  }

  const handleEditTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTagId) return

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name') as string
    const color = formData.get('color') as string

    if (!name.trim()) return
    updateTag(editingTagId, {
      name: name.trim(),
      color,
    })
    setEditingTagId(null)
  }

  const handleUpdateCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingCategoryId) return

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!name.trim()) return
    updateCategory(editingCategoryId, {
      name: name.trim(),
      description,
    })
    setEditingCategoryId(null)
  }

  if (!activeFile) return null

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        {/* Tags Section */}
        <Collapsible open={isTagsOpen} onOpenChange={setIsTagsOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronDown className={cn("h-4 w-4 transition-transform", !isTagsOpen && "-rotate-90")} />
                <Label className="cursor-pointer">标签</Label>
              </Button>
            </CollapsibleTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingTag(true)}
                    className="h-8 px-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    添加标签
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>创建新标签</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <CollapsibleContent className="space-y-2">
            {/* Tag List */}
            <Card className="mt-2">
              <CardContent className="p-4">
                <div className="grid gap-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="group flex items-center space-x-2 rounded-md hover:bg-accent p-1">
                      <Checkbox
                        id={tag.id}
                        checked={activeFile?.tagIds.includes(tag.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            addTagToFile(activeFile.id, tag.id)
                          } else {
                            removeTagFromFile(activeFile.id, tag.id)
                          }
                        }}
                      />
                      <Label
                        htmlFor={tag.id}
                        className="flex flex-1 items-center gap-2 cursor-pointer text-sm"
                      >
                        <Badge
                          variant="secondary"
                          style={{ backgroundColor: tag.color }}
                          className="px-2 font-normal"
                        >
                          {tag.name}
                        </Badge>
                      </Label>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setEditingTagId(tag.id)}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>编辑标签</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={() => deleteTag(tag.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>删除标签</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                  {tags.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      暂无标签
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Categories Section */}
        <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronDown className={cn("h-4 w-4 transition-transform", !isCategoriesOpen && "-rotate-90")} />
                <Label className="cursor-pointer">分类</Label>
              </Button>
            </CollapsibleTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingCategory(true)}
                    className="h-8 px-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    添加分类
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>创建新分类</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <CollapsibleContent className="space-y-2">
            <Select
              value={activeFile.categoryId ?? NO_CATEGORY}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CATEGORY}>无分类</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span>{category.name}</span>
                      {category.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-40 overflow-auto">
                          {category.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2 mt-4">
              {categories.map(category => (
                <Card key={category.id} className="group">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-40 overflow-auto">
                            {category.description}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setEditingCategoryId(category.id)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>编辑分类</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={() => deleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>删除分类</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {activeFile.categoryId === category.id && (
                      <Badge variant="secondary" className="mt-2">
                        当前分类
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Dialog for adding tag */}
        <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加标签</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTag} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名称</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="输入标签名称"
                  className="h-8"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">颜色</Label>
                <Select name="color" defaultValue={DEFAULT_COLORS[0]}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="选择颜色" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_COLORS.map((color) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded"
                            style={{ backgroundColor: color }}
                          />
                          <span>{color}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAddingTag(false)}
                >
                  取消
                </Button>
                <Button type="submit">添加</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog for editing tag */}
        <Dialog open={!!editingTagId} onOpenChange={(open) => !open && setEditingTagId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑标签</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditTag} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名称</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={tags.find(t => t.id === editingTagId)?.name}
                  className="h-8"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">颜色</Label>
                <Select
                  name="color"
                  defaultValue={tags.find(t => t.id === editingTagId)?.color}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="选择颜色" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_COLORS.map((color) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded"
                            style={{ backgroundColor: color }}
                          />
                          <span>{color}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingTagId(null)}
                >
                  取消
                </Button>
                <Button type="submit">更新</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog for adding category */}
        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加分类</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名称</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="输入分类名称"
                  className="h-8"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="输入分类描述（可选）"
                  className="h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAddingCategory(false)}
                >
                  取消
                </Button>
                <Button type="submit">添加</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog for editing category */}
        <Dialog open={!!editingCategoryId} onOpenChange={(open) => !open && setEditingCategoryId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑分类</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名称</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={categories.find(c => c.id === editingCategoryId)?.name}
                  className="h-8"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={categories.find(c => c.id === editingCategoryId)?.description}
                  className="h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingCategoryId(null)}
                >
                  取消
                </Button>
                <Button type="submit">更新</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  )
}
