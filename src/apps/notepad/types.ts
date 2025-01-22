export interface Tag {
  id: string
  name: string
  color: string
}

export interface Category {
  id: string
  name: string
  description?: string
}

export interface NoteFile {
  id: string
  name: string
  content: string
  createdAt: number
  updatedAt: number
  tagIds: string[]
  categoryId?: string
}

export interface SearchMatch {
  line: number
  start: number
  end: number
  text: string
}

// 只保留持久化数据
export interface NotepadState {
  files: NoteFile[]
  tags: Tag[]
  categories: Category[]
}

// 窗口级状态接口
export interface NotepadFilter {
  tagIds: string[]
  categoryId?: string
  searchQuery: string
}
