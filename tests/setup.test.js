import { describe, it, expect } from 'vitest'

describe('Testing Framework Setup', () => {
  it('vitest runs correctly', () => {
    expect(1 + 1).toBe(2)
  })

  it('jsdom environment works', () => {
    document.body.innerHTML = '<div id="app">Hello</div>'
    const app = document.getElementById('app')
    expect(app).not.toBeNull()
    expect(app.textContent).toBe('Hello')
  })

  it('localStorage mock works', () => {
    localStorage.setItem('test', 'value')
    expect(localStorage.getItem('test')).toBe('value')
    localStorage.removeItem('test')
    expect(localStorage.getItem('test')).toBeNull()
  })
})
