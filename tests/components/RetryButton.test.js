import { describe, it, expect, vi } from 'vitest'
import { createRetryButton } from '../../src/components/RetryButton.js'

describe('RetryButton', () => {
  it('creates a button with default label', () => {
    const btn = createRetryButton()
    expect(btn.textContent).toContain('Retry')
    expect(btn.classList.contains('btn--primary')).toBe(true)
  })

  it('uses custom label', () => {
    const btn = createRetryButton({ label: 'Reload' })
    expect(btn.textContent).toContain('Reload')
  })

  it('applies custom class', () => {
    const btn = createRetryButton({ className: 'custom-class' })
    expect(btn.classList.contains('custom-class')).toBe(true)
  })

  it('calls onClick handler and shows loading state', async () => {
    const fn = vi.fn().mockResolvedValue()
    const btn = createRetryButton({ onClick: fn })
    btn.click()
    expect(btn.disabled).toBe(true)
    expect(btn.classList.contains('btn--loading')).toBe(true)
    await vi.waitFor(() => {
      expect(fn).toHaveBeenCalled()
    })
    expect(btn.disabled).toBe(false)
  })
})
