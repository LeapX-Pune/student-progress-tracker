import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createTooltip } from '../../src/components/Tooltip.js'

describe('Tooltip', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates a tooltip and appends it to body', () => {
    const btn = document.createElement('button')
    btn.textContent = 'Hover me'
    document.body.appendChild(btn)
    createTooltip(btn, { content: 'Tooltip text' })
    expect(document.querySelector('.tooltip')).toBeTruthy()
    expect(document.querySelector('.tooltip').textContent).toBe('Tooltip text')
  })

  it('wraps trigger in tooltip-wrapper', () => {
    const btn = document.createElement('button')
    btn.textContent = 'Hover me'
    document.body.appendChild(btn)
    createTooltip(btn, { content: 'Tooltip text' })
    expect(document.querySelector('.tooltip-wrapper')).toBeTruthy()
    expect(document.querySelector('.tooltip-wrapper button')).toBe(btn)
  })

  it('applies correct position class', () => {
    const btn = document.createElement('button')
    btn.textContent = 'Test'
    document.body.appendChild(btn)
    createTooltip(btn, { content: 'Tooltip', position: 'bottom' })
    expect(document.querySelector('.tooltip--bottom')).toBeTruthy()
  })

  it('uses top position by default', () => {
    const btn = document.createElement('button')
    btn.textContent = 'Test'
    document.body.appendChild(btn)
    createTooltip(btn, { content: 'Tooltip' })
    expect(document.querySelector('.tooltip--top')).toBeTruthy()
  })

  it('destroy removes tooltip from DOM', () => {
    const btn = document.createElement('button')
    btn.textContent = 'Test'
    document.body.appendChild(btn)
    const tooltip = createTooltip(btn, { content: 'Tooltip' })
    tooltip.destroy()
    expect(document.querySelector('.tooltip')).toBeFalsy()
  })

  it('update changes tooltip content', () => {
    const btn = document.createElement('button')
    btn.textContent = 'Test'
    document.body.appendChild(btn)
    const tooltip = createTooltip(btn, { content: 'Old content' })
    tooltip.update('New content')
    expect(document.querySelector('.tooltip').textContent).toBe('New content')
  })

  it('shows tooltip on mouseenter and hides on mouseleave', () => {
    const btn = document.createElement('button')
    btn.textContent = 'Test'
    document.body.appendChild(btn)
    createTooltip(btn, { content: 'Tooltip', delay: 0 })

    btn.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(0)
    expect(document.querySelector('.tooltip--visible')).toBeTruthy()

    btn.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(100)
    expect(document.querySelector('.tooltip--visible')).toBeFalsy()
  })
})
