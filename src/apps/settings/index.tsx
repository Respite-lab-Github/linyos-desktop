import React from 'react'
import { Settings } from './components/Settings'
import { metadata } from './config'

export { metadata }

export function render(container: HTMLElement) {
  window.linyos.renderApi.render(container, <Settings />)
}

export function destroy(container: HTMLElement) {
  window.linyos.renderApi.destroy(container)
}

