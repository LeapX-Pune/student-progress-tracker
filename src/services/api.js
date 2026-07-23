import { getConfig } from '../utils/env.js'

let mockHandlers = null

export async function initApi() {
  const config = getConfig()

  if (config.apiMockEnabled) {
    const { setupMockServer } = await import('./mock.js')
    mockHandlers = setupMockServer()
  }
}

export function getMockServer() {
  return mockHandlers
}

export async function request(endpoint, options = {}) {
  const config = getConfig()
  const url = `${config.apiBaseUrl}${endpoint}`
  const token = localStorage.getItem(config.authTokenKey)

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status}`)
    error.status = response.status
    error.data = await response.json().catch(() => null)
    throw error
  }

  return response.json()
}
