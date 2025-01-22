import { useState, useCallback, useEffect } from 'react'
import { NoteFile, SearchMatch, NotepadFilter } from '../types'

interface UseNotepadOptions {
  files: NoteFile[]
  onSave: (fileId: string, content: string) => void
  onUpdateFileName: (fileId: string, name: string) => void
}

interface EditorState {
  activeFileId: string | null
  editingContent: string
  hasUnsavedChanges: boolean
  isEditingName: boolean
  editingName: string
  isSidebarOpen: boolean
  isMetadataOpen: boolean
  searchMatches: SearchMatch[]
  currentMatchIndex: number
  filter: NotepadFilter
}

const DEFAULT_FILTER: NotepadFilter = {
  tagIds: [],
  categoryId: undefined,
  searchQuery: '',
}

export function useNotepad({ files, onSave, onUpdateFileName }: UseNotepadOptions) {
  // Editor UI State
  const [state, setState] = useState<EditorState>({
    activeFileId: files[0]?.id ?? null,
    editingContent: files[0]?.content ?? '',
    hasUnsavedChanges: false,
    isEditingName: false,
    editingName: '',
    isSidebarOpen: true,
    isMetadataOpen: true,
    searchMatches: [],
    currentMatchIndex: 0,
    filter: DEFAULT_FILTER,
  })

  const activeFile = files.find(f => f.id === state.activeFileId)

  // Update content when active file changes
  useEffect(() => {
    if (activeFile) {
      setState(prev => ({
        ...prev,
        editingContent: activeFile.content,
        hasUnsavedChanges: false,
        editingName: '',
        isEditingName: false,
      }))
      console.log('Current editing file:', {
        id: activeFile.id,
        name: activeFile.name,
        content: activeFile.content,
        tagIds: activeFile.tagIds,
        categoryId: activeFile.categoryId,
        createdAt: new Date(activeFile.createdAt).toLocaleString(),
        updatedAt: new Date(activeFile.updatedAt).toLocaleString(),
      })
    }
  }, [activeFile?.id])

  // Content management
  const handleContentChange = useCallback((content: string) => {
    setState(prev => ({
      ...prev,
      editingContent: content,
      hasUnsavedChanges: true,
    }))
    console.log('Editing content changed:', {
      hasUnsavedChanges: true,
      contentLength: content.length,
      preview: content.slice(0, 100) + (content.length > 100 ? '...' : '')
    })
  }, [])

  const handleSave = useCallback(() => {
    if (!activeFile || !state.hasUnsavedChanges) return
    onSave(activeFile.id, state.editingContent)
    setState(prev => ({ ...prev, hasUnsavedChanges: false }))
  }, [activeFile, state.hasUnsavedChanges, state.editingContent, onSave])

  // Name editing
  const handleStartEditName = useCallback(() => {
    if (!activeFile) return
    setState(prev => ({
      ...prev,
      editingName: activeFile.name,
      isEditingName: true,
    }))
  }, [activeFile])

  const handleUpdateEditingName = useCallback((name: string) => {
    setState(prev => ({ ...prev, editingName: name }))
  }, [])

  const handleFinishEditName = useCallback(() => {
    if (!activeFile || !state.editingName.trim()) {
      setState(prev => ({ ...prev, isEditingName: false }))
      return
    }
    onUpdateFileName(activeFile.id, state.editingName.trim())
    setState(prev => ({ ...prev, isEditingName: false }))
  }, [activeFile, state.editingName, onUpdateFileName])

  // Search operations
  const findMatches = useCallback((content: string, query: string): SearchMatch[] => {
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
  }, [])

  const updateSearchMatches = useCallback((query: string) => {
    const matches = findMatches(state.editingContent, query)
    setState(prev => ({
      ...prev,
      searchMatches: matches,
      currentMatchIndex: 0,
      filter: { ...prev.filter, searchQuery: query },
    }))
  }, [state.editingContent, findMatches])

  const navigateSearch = useCallback((direction: 'next' | 'prev') => {
    if (!state.searchMatches.length) return

    setState(prev => {
      let newIndex = prev.currentMatchIndex
      if (direction === 'next') {
        newIndex = (newIndex + 1) % prev.searchMatches.length
      } else {
        newIndex = (newIndex - 1 + prev.searchMatches.length) % prev.searchMatches.length
      }
      return { ...prev, currentMatchIndex: newIndex }
    })
  }, [])

  // Filter operations
  const setFilter = useCallback((filter: NotepadFilter) => {
    setState(prev => ({ ...prev, filter }))
    if (filter.searchQuery) {
      updateSearchMatches(filter.searchQuery)
    } else {
      setState(prev => ({
        ...prev,
        searchMatches: [],
        currentMatchIndex: 0,
      }))
    }
  }, [updateSearchMatches])

  // File operations
  const setActiveFileId = useCallback((id: string | null) => {
    if (state.hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Do you want to discard them?')) {
        return
      }
    }
    setState(prev => ({ ...prev, activeFileId: id }))
  }, [state.hasUnsavedChanges])

  // UI state management
  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }))
  }, [])

  const toggleMetadataPanel = useCallback(() => {
    setState(prev => ({ ...prev, isMetadataOpen: !prev.isMetadataOpen }))
  }, [])

  return {
    // State
    activeFile,
    activeFileId: state.activeFileId,
    editingContent: state.editingContent,
    hasUnsavedChanges: state.hasUnsavedChanges,
    isEditingName: state.isEditingName,
    editingName: state.editingName,
    isSidebarOpen: state.isSidebarOpen,
    isMetadataOpen: state.isMetadataOpen,
    searchMatches: state.searchMatches,
    currentMatchIndex: state.currentMatchIndex,
    filter: state.filter,

    // Content handlers
    handleContentChange,
    handleSave,

    // Name editing handlers
    handleStartEditName,
    handleUpdateEditingName,
    handleFinishEditName,

    // Search handlers
    updateSearchMatches,
    navigateSearch,

    // Filter handlers
    setFilter,

    // File handlers
    setActiveFileId,

    // UI handlers
    toggleSidebar,
    toggleMetadataPanel,
  }
}
