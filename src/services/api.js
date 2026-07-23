// assets/js/api.js

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
    // Configurable base URL fallback:
    // If not provided in constructor, it checks for a global config or defaults to '/api'
    this.baseUrl = baseUrl || (window.CONFIG && window.CONFIG.API_BASE_URL) || '/api';
  }

  /**
   * Request interceptor to inject authentication tokens.
   * (API-002: Implement request interceptor)
   */
  _requestInterceptor(options, endpoint) {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    // Skip token for auth endpoints if necessary (e.g. login)
    if (!options.noToken && !endpoint.startsWith('/auth/')) {
      // In a real scenario, this would come from the Storage Module (Part 9)
      // Using localStorage directly as a fallback for now
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
   * Response interceptor to normalize the response format and handle common errors.
   * (API-003: Implement response interceptor)
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

    // Try to parse JSON response, fallback to text or null
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  /**
   * Core request method
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // 1. Run request interceptor
    const fetchOptions = this._requestInterceptor(options, endpoint);

    try {
      // 2. Perform fetch
      const response = await fetch(url, fetchOptions);

      // 3. Run response interceptor
      return await this._responseInterceptor(response);
    } catch (error) {
      // Catch network errors and intercepted HTTP errors
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  // Convenience methods
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

// Export a singleton instance for global use
export const api = new ApiService();
