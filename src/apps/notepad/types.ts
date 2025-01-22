export interface NoteFile {
  id: string
  name: string
  content: string
  createdAt: number
  updatedAt: number
}

export interface NotepadState {
  files: NoteFile[]
  activeFileId: string | null
}
