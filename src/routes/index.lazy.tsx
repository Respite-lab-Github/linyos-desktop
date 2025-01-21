import { createLazyFileRoute } from '@tanstack/react-router'
import { Desktop } from '@/components/desktop/Desktop'
import { Taskbar } from '@/components/taskbar/Taskbar'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
      <Desktop />
      <Taskbar />
    </>
  )
}
