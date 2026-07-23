import { getConfig } from '../utils/env.js';

let mockHandlers = null;

/**
 *
 */
export async function initApi() {
  const config = getConfig();

  if (config.apiMockEnabled) {
    const { setupMockServer } = await import('./mock.js');
    mockHandlers = setupMockServer();
  }
}

/**
 *
 */
export function getMockServer() {
  return mockHandlers;
}

/**
 * ApiService class handles all API requests.
 * Implements core logic for Day 1 tasks:
 * - API-001: Core ApiService class
 * - API-002: Request interceptor (auth token injection)
 * - API-003: Response interceptor (error handling and normalization)
 * - API-015: Configurable base URL
 */
export class ApiService {
  /**
   *
   */
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl || (window.CONFIG && window.CONFIG.API_BASE_URL) || '/api';
  }

  /**
   *
   */
  _requestInterceptor(options, endpoint) {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (!options.noToken && !endpoint.startsWith('/auth/')) {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return {
      ...options,
      headers,
    };
  }

  /**
   *
   */
  async _responseInterceptor(response) {
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.data = errorData;
      } catch (_e) {
        const errorText = await response.text();
        error.message = errorText || error.message;
      }
      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  /**
   *
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const fetchOptions = this._requestInterceptor(options, endpoint);

    try {
      const response = await fetch(url, fetchOptions);
      return await this._responseInterceptor(response);
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   *
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  /**
   *
   */
  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   *
   */
  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   *
   */
  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   *
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export const api = new ApiService();
