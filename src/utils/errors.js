export class AppError extends Error {
  constructor(message, { status, code, data } = {}) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.data = data
  }
}

export function normalizeApiError(error) {
  if (error instanceof AppError) return error

  const status = error.status || 0
  const statusMessages = {
    0: { title: 'Network Error', message: 'Unable to connect to the server. Please check your internet connection.' },
    400: { title: 'Bad Request', message: 'The request was invalid. Please check your input.' },
    401: { title: 'Session Expired', message: 'Your session has expired. Please log in again.' },
    403: { title: 'Access Denied', message: 'You do not have permission to perform this action.' },
    404: { title: 'Not Found', message: 'The requested resource could not be found.' },
    429: { title: 'Too Many Requests', message: 'Please wait a moment before trying again.' },
    500: { title: 'Server Error', message: 'An unexpected server error occurred. Please try again later.' },
    503: { title: 'Service Unavailable', message: 'The service is temporarily unavailable. Please try again later.' },
  }

  const info = statusMessages[status] || { title: 'Error', message: error.message || 'An unexpected error occurred.' }

  return new AppError(info.message, { status, data: error.data })
}

export function handleGlobalErrors() {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error || event.message)
    event.preventDefault()
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    event.preventDefault()
  })
}
