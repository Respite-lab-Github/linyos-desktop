import React from 'react'
import { Save } from 'lucide-react'
import { useNotepad } from '@/apps/notepad/hooks/use-notepad'
import { cn } from '@/lib/utils'

export function Editor() {
  const { content, setContent, handleSave } = useNotepad()

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <button
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md',
              'bg-transparent text-sm font-medium opacity-70 ring-offset-background',
              'transition-opacity hover:opacity-100',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={cn(
          'flex-1 resize-none rounded-md border-0 bg-transparent p-0',
          'text-sm ring-offset-background placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-0'
        )}
        placeholder="Type something..."
      />
    </div>
  )
}
