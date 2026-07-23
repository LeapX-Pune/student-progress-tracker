import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { showToast, showSuccess, showError, showWarning, showInfo } from '../../src/components/Toast.js'

describe('Toast', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates a toast with title and message', () => {
    const toast = showToast({ title: 'Success', message: 'Operation completed', type: 'success' })
    expect(toast.querySelector('.toast__title').textContent).toBe('Success')
    expect(toast.querySelector('.toast__message').textContent).toBe('Operation completed')
  })

  it('applies correct type class', () => {
    const toast = showToast({ title: 'Error', type: 'error' })
    expect(toast.classList.contains('toast--error')).toBe(true)
  })

  it('adds toast to the container', () => {
    showToast({ title: 'Test', type: 'info' })
    const container = document.querySelector('.toast-container')
    expect(container).toBeTruthy()
    expect(container.children.length).toBe(1)
  })

  it('removes toast on close button click', () => {
    const toast = showToast({ title: 'Test', type: 'info' })
    const closeBtn = toast.querySelector('.toast__close')
    closeBtn.click()
    expect(toast.classList.contains('toast--removing')).toBe(true)
  })

  it('auto-removes toast after duration', () => {
    showToast({ title: 'Test', type: 'info', duration: 3000 })
    const container = document.querySelector('.toast-container')
    expect(container.children.length).toBe(1)
    vi.advanceTimersByTime(3000)
    expect(container.children[0].classList.contains('toast--removing')).toBe(true)
  })

  it('does not auto-remove when duration is 0', () => {
    showToast({ title: 'Test', type: 'info', duration: 0 })
    const container = document.querySelector('.toast-container')
    vi.advanceTimersByTime(5000)
    expect(container.children[0].classList.contains('toast--removing')).toBe(false)
  })

  it('exports convenience functions', () => {
    expect(showSuccess).toBeDefined()
    expect(showError).toBeDefined()
    expect(showWarning).toBeDefined()
    expect(showInfo).toBeDefined()
  })

  it('creates correct type for showSuccess', () => {
    const toast = showSuccess('Done', 'Task completed')
    expect(toast.classList.contains('toast--success')).toBe(true)
  })

  it('creates correct type for showError', () => {
    const toast = showError('Failed', 'Task failed')
    expect(toast.classList.contains('toast--error')).toBe(true)
  })

  it('sets aria-live on container', () => {
    showToast({ title: 'Test', type: 'info' })
    const container = document.querySelector('.toast-container')
    expect(container.getAttribute('aria-live')).toBe('polite')
  })
})
