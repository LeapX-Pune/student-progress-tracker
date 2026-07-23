import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createModal } from '../../src/components/Modal.js'

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('creates a modal with title and body', () => {
    const modal = createModal({ title: 'My Modal', body: '<p>Content</p>' })
    expect(document.querySelector('.modal-overlay')).toBeTruthy()
    expect(document.querySelector('.modal__title').textContent).toBe('My Modal')
    expect(document.querySelector('.modal__body p').textContent).toBe('Content')
  })

  it('closes modal when close button is clicked', () => {
    const modal = createModal({ title: 'Test' })
    const closeBtn = document.querySelector('.modal__close')
    closeBtn.click()
    expect(document.querySelector('.modal-overlay--open')).toBeFalsy()
  })

  it('closes modal on Escape key', () => {
    const modal = createModal({ title: 'Test' })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(document.querySelector('.modal-overlay--open')).toBeFalsy()
  })

  it('sets aria attributes', () => {
    createModal({ title: 'Test' })
    const overlay = document.querySelector('.modal-overlay')
    expect(overlay.getAttribute('role')).toBe('dialog')
    expect(overlay.getAttribute('aria-modal')).toBe('true')
  })

  it('calls onClose callback when closing', () => {
    const onClose = vi.fn()
    createModal({ title: 'Test', onClose })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('accepts HTMLElement as body', () => {
    const bodyEl = document.createElement('p')
    bodyEl.textContent = 'Element content'
    createModal({ title: 'Test', body: bodyEl })
    expect(document.querySelector('.modal__body p').textContent).toBe('Element content')
  })

  it('accepts footer as string', () => {
    createModal({ title: 'Test', body: 'Body', footer: '<button>Save</button>' })
    expect(document.querySelector('.modal__footer button').textContent).toBe('Save')
  })

  it('accepts footer as array of elements', () => {
    const btn1 = document.createElement('button')
    btn1.textContent = 'Cancel'
    const btn2 = document.createElement('button')
    btn2.textContent = 'Save'
    createModal({ title: 'Test', body: 'Body', footer: [btn1, btn2] })
    expect(document.querySelectorAll('.modal__footer button').length).toBe(2)
  })
})
