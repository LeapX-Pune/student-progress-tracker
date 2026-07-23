import { describe, it, expect, vi } from 'vitest'
import { createErrorBoundary, withErrorBoundary } from '../../src/components/ErrorBoundary.js'

describe('ErrorBoundary', () => {
  it('creates error boundary with default messages', () => {
    const el = createErrorBoundary()
    expect(el.querySelector('.error-boundary__title').textContent).toBe('Something went wrong')
    expect(el.querySelector('.error-boundary__message').textContent).toBe('An unexpected error occurred. Please try again.')
  })

  it('creates error boundary with custom messages', () => {
    const el = createErrorBoundary({ title: 'Oops!', message: 'Custom error message.' })
    expect(el.querySelector('.error-boundary__title').textContent).toBe('Oops!')
    expect(el.querySelector('.error-boundary__message').textContent).toBe('Custom error message.')
  })

  it('includes retry button when onRetry is provided', () => {
    const retryFn = vi.fn()
    const el = createErrorBoundary({ onRetry: retryFn })
    const btn = el.querySelector('.btn--primary')
    expect(btn).toBeTruthy()
    expect(btn.textContent).toBe('Try again')
  })

  it('does not include retry button when onRetry is missing', () => {
    const el = createErrorBoundary()
    expect(el.querySelector('.btn--primary')).toBeFalsy()
  })

  it('calls onRetry when retry button is clicked', async () => {
    const retryFn = vi.fn()
    const el = createErrorBoundary({ onRetry: retryFn })
    const btn = el.querySelector('.btn--primary')
    btn.click()
    await vi.waitFor(() => {
      expect(retryFn).toHaveBeenCalled()
    })
  })

  it('sets role alert', () => {
    const el = createErrorBoundary()
    expect(el.getAttribute('role')).toBe('alert')
  })

  it('withErrorBoundary replaces container content', () => {
    const container = document.createElement('div')
    container.innerHTML = '<span class="old-content">Existing</span>'
    withErrorBoundary(container)
    expect(container.querySelector('.error-boundary')).toBeTruthy()
    expect(container.querySelector('.old-content')).toBeFalsy()
  })
})
