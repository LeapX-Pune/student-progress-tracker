import { screen } from '@testing-library/dom'
import { expect } from 'vitest'

export function getByTestId(id) {
  return screen.getByTestId(id)
}

export function queryByTestId(id) {
  return screen.queryByTestId(id)
}

export function render(htmlString, container) {
  container = container || document.body
  container.innerHTML = htmlString
  return container
}

export function cleanup(container) {
  if (container) container.innerHTML = ''
}

export function mockFetch(responseData, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(responseData),
  })
}

expect.extend({
  toBeInTheDocument(received) {
    const pass = received && document.body.contains(received)
    return {
      pass,
      message: () =>
        pass
          ? 'expected element not to be in document'
          : 'expected element to be in document',
    }
  },
  toHaveClass(received, className) {
    const pass = received && received.classList.contains(className)
    return {
      pass,
      message: () =>
        pass
          ? `expected element not to have class "${className}"`
          : `expected element to have class "${className}"`,
    }
  },
  toHaveAttribute(received, attr, value) {
    const pass = received && received.hasAttribute(attr) && (value === undefined || received.getAttribute(attr) === value)
    return {
      pass,
      message: () =>
        pass
          ? `expected element not to have attribute "${attr}"`
          : `expected element to have attribute "${attr}"`,
    }
  },
})
