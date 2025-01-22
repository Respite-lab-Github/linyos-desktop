import { Save, FileText, Plus, Download, Trash2, Edit2, PanelLeftClose, PanelRightClose, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMemo, useRef } from 'react'
import { FileFilter } from './FileFilter'
import { FileMetadata } from './FileMetadata'
import HighlightText from './HighlightText'
import { NoteFile, Tag, Category, NotepadState, SearchMatch } from '../types'
import { metadata } from '../config'
import { useNotepad } from '../hooks/use-notepad'

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#22c55e', '#06b6d4', '#3b82f6', '#6366f1',
  '#a855f7', '#ec4899', '#f43f5e'
]

const DEFAULT_STATE: NotepadState = {
  files: [{
    id: 'default',
    name: 'Untitled',
    content: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tagIds: [],
  }],
  tags: [],
  categories: [],
}

const findMatches = (content: string, query: string): SearchMatch[] => {
  if (!query) return []
  const lines = content.split('\n')
  const matches: SearchMatch[] = []
  const searchRegex = new RegExp(query, 'gi')

  lines.forEach((line, lineIndex) => {
    let match
    while ((match = searchRegex.exec(line)) !== null) {
      matches.push({
        line: lineIndex + 1,
        start: match.index,
        end: match.index + match[0].length,
        text: line
      })
    }
  })
  return matches
}

interface HighlightedTextAreaProps {
  value: string
  onChange: (value: string) => void
  searchMatches: SearchMatch[]
  currentMatchIndex: number
  className?: string
  placeholder?: string
  disabled?: boolean
}

function HighlightedTextArea({
  value,
  onChange,
  searchMatches,
  currentMatchIndex,
  className,
  placeholder,
  disabled
}: HighlightedTextAreaProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sync scroll position between textarea and overlay
  const handleScroll = () => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  // Render highlighted content
  const renderHighlightedContent = () => {
    if (!searchMatches.length) return value

    const lines = value.split('\n')
    const highlightedLines = lines.map((line, lineIndex) => {
      const lineMatches = searchMatches.filter(m => m.line === lineIndex + 1)
      if (!lineMatches.length) return line

      let result = ''
      let lastIndex = 0
      lineMatches.forEach((match, i) => {
        const isCurrentMatch = i === currentMatchIndex
        result += line.slice(lastIndex, match.start)
        result += `<span class="${isCurrentMatch ? 'bg-yellow-400' : 'bg-yellow-200'}">`
        result += line.slice(match.start, match.end)
        result += '</span>'
        lastIndex = match.end
      })
      result += line.slice(lastIndex)
      return result
    })

    return highlightedLines.join('\n')
  }

  return (
    <div className="relative h-full w-full">
      <div
        ref={overlayRef}
        className={cn(
          'absolute inset-0 pointer-events-none whitespace-pre-wrap break-words overflow-auto',
          'font-mono text-transparent',
          className
        )}
        style={{
          padding: '16px', // Match textarea padding
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
        }}
        dangerouslySetInnerHTML={{ __html: renderHighlightedContent() }}
      />
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className={cn(
          'absolute inset-0 bg-transparent',
          className
        )}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

export function Editor() {
  // App Data Store
  const { appData, setAppData } = window.linyos.usePersistStore()
  const state = (appData[metadata.id]?.state ?? DEFAULT_STATE) as NotepadState

  // Save state
  const saveState = (newState: Partial<NotepadState>) => {
    setAppData(metadata.id, 'state', {
      ...state,
      ...newState,
    })
  }

  // Window-level state and handlers
  const {
    activeFile,
    activeFileId,
    editingContent,
    hasUnsavedChanges,
    isEditingName,
    editingName,
    isSidebarOpen,
    isMetadataOpen,
    searchMatches,
    currentMatchIndex,
    filter,
    handleContentChange,
    handleSave,
    handleStartEditName,
    handleUpdateEditingName,
    handleFinishEditName,
    navigateSearch,
    setFilter,
    setActiveFileId,
    toggleSidebar,
    toggleMetadataPanel,
  } = useNotepad({
    files: state.files,
    onSave: (fileId, content) => {
      saveState({
        files: state.files.map(file => {
          if (file.id === fileId) {
            return {
              ...file,
              content,
              updatedAt: Date.now(),
            }
          }
          return file
        })
      })
    },
    onUpdateFileName: (fileId, name) => {
      saveState({
        files: state.files.map(file => {
          if (file.id === fileId) {
            return {
              ...file,
              name,
              updatedAt: Date.now(),
            }
          }
          return file
        })
      })
    },
  })

  // File operations
  const createFile = () => {
    const newFile: NoteFile = {
      id: Date.now().toString(),
      name: 'Untitled',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tagIds: [],
    }
    saveState({
      files: [...state.files, newFile],
    })
    setActiveFileId(newFile.id)
  }

  const deleteFile = (id: string) => {
    const newFiles = state.files.filter(f => f.id !== id)
    saveState({ files: newFiles })
    if (id === activeFileId) {
      setActiveFileId(newFiles[0]?.id ?? null)
    }
  }

  // Tag operations
  const createTag = (name: string) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name,
      color: DEFAULT_COLORS[state.tags.length % DEFAULT_COLORS.length],
    }
    saveState({
      tags: [...state.tags, newTag],
    })
    return newTag
  }

  const updateTag = (id: string, updates: Partial<Tag>) => {
    saveState({
      tags: state.tags.map(tag => {
        if (tag.id === id) {
          return { ...tag, ...updates }
        }
        return tag
      })
    })
  }

  const deleteTag = (id: string) => {
    saveState({
      tags: state.tags.filter(t => t.id !== id),
      files: state.files.map(file => ({
        ...file,
        tagIds: file.tagIds.filter(tagId => tagId !== id),
        updatedAt: Date.now(),
      }))
    })
  }

  // Category operations
  const createCategory = (name: string, description?: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      description,
    }
    saveState({
      categories: [...state.categories, newCategory],
    })
    return newCategory
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    saveState({
      categories: state.categories.map(category => {
        if (category.id === id) {
          return { ...category, ...updates }
        }
        return category
      })
    })
  }

  const deleteCategory = (id: string) => {
    saveState({
      categories: state.categories.filter(c => c.id !== id),
      files: state.files.map(file => {
        if (file.categoryId === id) {
          return {
            ...file,
            categoryId: undefined,
            updatedAt: Date.now(),
          }
        }
        return file
      })
    })
  }

  // File metadata operations
  const addTagToFile = (fileId: string, tagId: string) => {
    saveState({
      files: state.files.map(file => {
        if (file.id === fileId && !file.tagIds.includes(tagId)) {
          return {
            ...file,
            tagIds: [...file.tagIds, tagId],
            updatedAt: Date.now(),
          }
        }
        return file
      })
    })
  }

  const removeTagFromFile = (fileId: string, tagId: string) => {
    saveState({
      files: state.files.map(file => {
        if (file.id === fileId) {
          return {
            ...file,
            tagIds: file.tagIds.filter(id => id !== tagId),
            updatedAt: Date.now(),
          }
        }
        return file
      })
    })
  }

  const setCategoryForFile = (fileId: string, categoryId: string | undefined) => {
    saveState({
      files: state.files.map(file => {
        if (file.id === fileId) {
          return {
            ...file,
            categoryId,
            updatedAt: Date.now(),
          }
        }
        return file
      })
    })
  }

  // Export operation
  const exportToTxt = (file: NoteFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // File filtering
  const filteredFiles = useMemo(() => {
    return state.files.filter(file => {
      // Search query filter
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase()
        const nameMatch = file.name.toLowerCase().includes(query)
        const contentMatch = findMatches(file.content, query).length > 0
        if (!nameMatch && !contentMatch) {
          return false
        }
      }

      // Tag filter
      if (filter.tagIds.length > 0) {
        const hasMatchingTag = filter.tagIds.some(tagId =>
          file.tagIds.includes(tagId)
        )
        if (!hasMatchingTag) {
          return false
        }
      }

      // Category filter
      if (filter.categoryId) {
        if (file.categoryId !== filter.categoryId) {
          return false
        }
      }

      return true
    })
  }, [state.files, filter])

  return (
    <div className="flex h-full">
      {/* File List */}
      <div className={cn(
        'border-r transition-all duration-200',
        isSidebarOpen ? 'w-1/4 min-w-[200px] max-w-sm' : 'w-0'
      )}>
        {isSidebarOpen && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium">文件</span>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={createFile}
                        className="h-6 w-6"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">新建文件</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>新建文件</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Separator />
            <FileFilter
              tags={state.tags}
              categories={state.categories}
              activeFilter={filter}
              setActiveFilter={setFilter}
            />
            <div className="flex-1 overflow-auto">
              {filteredFiles.length > 0 ? (
                filteredFiles.map(file => (
                  <button
                    key={file.id}
                    onClick={() => setActiveFileId(file.id)}
                    className={cn(
                      'flex w-full items-center gap-2 px-2 py-1.5 text-sm',
                      'hover:bg-accent hover:text-accent-foreground',
                      activeFile?.id === file.id && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <div className="flex-1 truncate text-left">
                      <HighlightText
                        text={file.name}
                        highlight={filter.searchQuery}
                      />
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p className="text-sm">找不到你想要的文件</p>
                  {filter.searchQuery && (
                    <p className="text-xs mt-1">
                      没有文件匹配 "{filter.searchQuery}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 px-4 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 shrink-0 lg:hidden"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
            {isEditingName ? (
              <Input
                value={editingName}
                onChange={(e) => handleUpdateEditingName(e.target.value)}
                onBlur={handleFinishEditName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFinishEditName()
                  if (e.key === 'Escape') handleFinishEditName()
                }}
                className="h-7 min-w-0"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm font-medium truncate">
                  {activeFile?.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStartEditName}
                  className="h-6 w-6 shrink-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSave}
                    className={cn(
                      'h-8 w-8',
                      hasUnsavedChanges && 'text-yellow-600 hover:text-yellow-700'
                    )}
                    disabled={!activeFile || !hasUnsavedChanges}
                  >
                    <Save className="h-4 w-4" />
                    <span className="sr-only">保存 (Ctrl+S)</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>保存 (Ctrl+S)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {searchMatches.length > 0 && (
              <>
                <span className="text-sm text-muted-foreground">
                  {currentMatchIndex + 1} / {searchMatches.length}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateSearch('prev')}
                        className="h-8 w-8"
                      >
                        <ChevronUp className="h-4 w-4" />
                        <span className="sr-only">上一个匹配 (Shift+Enter)</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>上一个匹配 (Shift+Enter)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateSearch('next')}
                        className="h-8 w-8"
                      >
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">下一个匹配 (Enter)</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>下一个匹配 (Enter)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => activeFile && exportToTxt(activeFile)}
                    className="h-8 w-8"
                    disabled={!activeFile}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">导出为文本文件</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>导出为文本文件</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => activeFile && deleteFile(activeFile.id)}
                    className="h-8 w-8"
                    disabled={!activeFile}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">删除文件</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>删除文件</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMetadataPanel}
              className="h-8 w-8 lg:hidden"
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex flex-1 min-h-0">
          {/* Editor Area */}
          <div className="flex-1 p-4 min-w-0">
            <HighlightedTextArea
              value={editingContent}
              onChange={handleContentChange}
              searchMatches={searchMatches}
              currentMatchIndex={currentMatchIndex}
              className={cn(
                'h-full w-full resize-none',
                'border-0 focus-visible:ring-0',
                'rounded-none bg-background text-base leading-relaxed'
              )}
              placeholder={activeFile ? "开始输入..." : "选择或创建一个文件开始编辑"}
              disabled={!activeFile}
            />
          </div>

          {/* Metadata Panel */}
          <div className={cn(
            'border-l transition-all duration-200',
            isMetadataOpen ? 'w-1/4 min-w-[200px] max-w-sm' : 'w-0'
          )}>
            {isMetadataOpen && (
              <FileMetadata
                activeFile={activeFile}
                tags={state.tags}
                categories={state.categories}
                createTag={createTag}
                createCategory={createCategory}
                updateTag={updateTag}
                deleteTag={deleteTag}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory}
                addTagToFile={addTagToFile}
                removeTagFromFile={removeTagFromFile}
                setCategoryForFile={setCategoryForFile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
