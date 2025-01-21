import { useState, useEffect } from 'react'
import { metadata } from '../config'

export function useNotepad() {
  const [content, setContent] = useState('')
  const { getAppData, setAppData } = window.linyos.usePersistStore.getState()

  useEffect(() => {
    const savedContent = getAppData<string>(metadata.id, 'content')
    if (savedContent) {
      setContent(savedContent)
    }
  }, [])

  const handleSave = () => {
    setAppData(metadata.id, 'content', content)
  }

  return {
    content,
    setContent,
    handleSave,
  }
}
