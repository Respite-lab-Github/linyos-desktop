import type { FC } from 'react'
import { useMemo } from 'react'

interface HighlightTextProps {
  text: string | undefined
  highlight: string | undefined
  highlightClassName?: string
}

const HighlightText: FC<HighlightTextProps> = ({
  text = '',
  highlight = '',
  highlightClassName = 'bg-yellow-200 dark:bg-yellow-900/50',
}) => {
  const parts = useMemo(() => {
    if (!text || !highlight.trim()) {
      return [{ text: text || '', highlight: false }]
    }

    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, i) => ({
      text: part,
      highlight: i % 2 === 1,
    }))
  }, [text, highlight])

  return (
    <span>
      {parts.map((part, i) => (
        part.highlight
          ? (
              <mark key={i} className={highlightClassName}>
                {part.text}
              </mark>
            )
          : (
              <span key={i}>{part.text}</span>
            )
      ))}
    </span>
  )
}

export default HighlightText
