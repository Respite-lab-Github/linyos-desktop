import React from 'react'
import { Editor } from './components/Editor'
import { metadata } from './config'

export { metadata }

export function render(container: HTMLElement) {
  window.linyos.renderApi.render(container, <Editor key={crypto.randomUUID()} />)
}

export function destroy(container: HTMLElement) {
  window.linyos.renderApi.destroy(container)
}
