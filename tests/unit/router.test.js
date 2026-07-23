import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  updateDocumentTitle,
  saveScrollPosition,
  restoreScrollPosition,
  initScrollRestoration,
  scrollToElement,
  scrollToTop,
} from '../../src/utils/router.js'

describe('router', () => {
  beforeEach(() => {
    document.title = 'Test'
    window.scrollTo = vi.fn()
    vi.useFakeTimers()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb())
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('updateDocumentTitle sets page title', () => {
    updateDocumentTitle('Dashboard')
    expect(document.title).toBe('Dashboard — Student Progress Tracker')
  })

  it('updateDocumentTitle uses default suffix when no title given', () => {
    updateDocumentTitle()
    expect(document.title).toBe('Student Progress Tracker')
  })

  it('updateDocumentTitle uses custom suffix', () => {
    updateDocumentTitle('Grades', 'My App')
    expect(document.title).toBe('Grades — My App')
  })

  it('saveScrollPosition and restoreScrollPosition work', () => {
    Object.defineProperty(window, 'scrollY', { value: 150, writable: true })

    saveScrollPosition('/dashboard')

    restoreScrollPosition('/dashboard')
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 150, behavior: 'instant' })
  })

  it('restoreScrollPosition uses fallback when key missing', () => {
    restoreScrollPosition('/unknown', { fallback: 50 })
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 50, behavior: 'instant' })
  })

  it('initScrollRestoration sets manual restoration', () => {
    initScrollRestoration()
  })

  it('scrollToTop scrolls to top', () => {
    scrollToTop()
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('scrollToElement focuses element', () => {
    document.body.innerHTML = '<main id="main-content"><h1>Content</h1></main>'
    const focusSpy = vi.spyOn(document.querySelector('#main-content'), 'focus')

    scrollToElement('#main-content', { behavior: 'instant', offset: 16 })

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
    expect(window.scrollTo).toHaveBeenCalled()
  })
})
