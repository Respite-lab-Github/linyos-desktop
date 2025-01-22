import { useState, useEffect } from 'react'
import { metadata } from '../config'
import { NoteFile, NotepadState } from '../types'

export function useNotepad() {
  const [files, setFiles] = useState<NoteFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const { getAppData, setAppData } = window.linyos.usePersistStore()

  useEffect(() => {
    const savedState = getAppData<NotepadState>(metadata.id, 'state')
    if (savedState) {
      setFiles(savedState.files)
      setActiveFileId(savedState.activeFileId)
    } else {
      // Create default file
      const defaultFile: NoteFile = {
        id: 'default',
        name: 'Untitled',
        content: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setFiles([defaultFile])
      setActiveFileId(defaultFile.id)
    }
  }, [])

  const activeFile = files.find(f => f.id === activeFileId)

  const saveState = () => {
    setAppData(metadata.id, 'state', {
      files,
      activeFileId,
    })
  }

  const createFile = () => {
    const newFile: NoteFile = {
      id: Date.now().toString(),
      name: 'Untitled',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setFiles(prev => [...prev, newFile])
    setActiveFileId(newFile.id)
    saveState()
  }

  const updateFile = (id: string, updates: Partial<NoteFile>) => {
    setFiles(prev => prev.map(file => {
      if (file.id === id) {
        return {
          ...file,
          ...updates,
          updatedAt: Date.now(),
        }
      }
      return file
    }))
    saveState()
  }

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    if (activeFileId === id) {
      setActiveFileId(files[0]?.id ?? null)
    }
    saveState()
  }

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

  return {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    createFile,
    updateFile,
    deleteFile,
    exportToTxt,
  }
}
