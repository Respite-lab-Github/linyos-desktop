import { Save, FileText, Plus, Download, Trash2, Edit2 } from 'lucide-react'
import { useNotepad } from '@/apps/notepad/hooks/use-notepad'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useState } from 'react'

export function Editor() {
  const {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    createFile,
    updateFile,
    deleteFile,
    exportToTxt,
  } = useNotepad()

  const [isEditingName, setIsEditingName] = useState(false)
  const [editingName, setEditingName] = useState('')

  const handleSave = () => {
    if (!activeFile) return
    updateFile(activeFile.id, { content: activeFile.content })
  }

  const handleStartEditName = () => {
    if (!activeFile) return
    setEditingName(activeFile.name)
    setIsEditingName(true)
  }

  const handleFinishEditName = () => {
    if (!activeFile) return
    updateFile(activeFile.id, { name: editingName })
    setIsEditingName(false)
  }

  return (
    <div className="flex h-full">
      {/* File List */}
      <div className="flex w-48 flex-col border-r">
        <div className="flex items-center justify-between p-2">
          <span className="text-sm font-medium">Files</span>
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
                  <span className="sr-only">New File</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New File</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator />
        <div className="flex-1 overflow-auto">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={cn(
                'flex w-full items-center gap-2 px-2 py-1.5 text-sm',
                'hover:bg-accent hover:text-accent-foreground',
                activeFileId === file.id && 'bg-accent text-accent-foreground'
              )}
            >
              <FileText className="h-4 w-4" />
              <span className="flex-1 truncate text-left">{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleFinishEditName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFinishEditName()
                  if (e.key === 'Escape') setIsEditingName(false)
                }}
                className="h-7 w-48"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">
                  {activeFile?.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStartEditName}
                  className="h-6 w-6"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSave}
                    className="h-8 w-8"
                  >
                    <Save className="h-4 w-4" />
                    <span className="sr-only">Save</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save (Ctrl+S)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
                    <span className="sr-only">Export</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export as TXT</p>
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
                    <span className="sr-only">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete File</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Separator />

        {/* Editor Area */}
        <div className="flex-1 p-4">
          <Textarea
            value={activeFile?.content ?? ''}
            onChange={(e) => activeFile && updateFile(activeFile.id, { content: e.target.value })}
            className={cn(
              'h-full min-h-[calc(100vh-8rem)] resize-none',
              'border-0 focus-visible:ring-0',
              'rounded-none bg-background text-base leading-relaxed'
            )}
            placeholder={activeFile ? "Type something..." : "Select or create a file to start editing"}
            disabled={!activeFile}
          />
        </div>
      </div>
    </div>
  )
}
