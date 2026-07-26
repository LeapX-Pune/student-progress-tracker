import { getConfig } from '../utils/env.js';
import { normalizeApiError } from '../utils/errors.js';
import { getAuthToken } from './authStorage.js';

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
 * Provides a centralized fetch wrapper with automatic token injection,
 * response normalization, timeout handling, retry logic with exponential backoff,
 * and request deduplication.
 */
export class ApiService {
    /**
     *
     */
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl || (window.CONFIG && window.CONFIG.API_BASE_URL) || '/api';

        this.pendingRequests = new Map();
        this.timeoutMs = 10000;
        this.maxRetries = 3;
    }

    /**
     * Request interceptor to inject authentication tokens.
     */
    _requestInterceptor(options, endpoint) {
        const headers = new Headers(options.headers || {});
        headers.set('Content-Type', 'application/json');

        if (!options.noToken && !endpoint.startsWith('/auth/')) {
            const authData = getAuthToken();
            if (authData?.token) {
                headers.set('Authorization', `Bearer ${authData.token}`);
            }
        }

        return {
            ...options,
            headers,
        };
    }

    /**
     * Response interceptor to normalize the response format and handle common errors.
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

            const normalizedError = normalizeApiError(error);

            // Handle 401 Unauthorized globally
            if (response.status === 401) {
                window.dispatchEvent(new window.CustomEvent('auth:unauthorized'));
            }

            throw normalizedError;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }
        return response.text();
    }

    /**
     * Generate a unique key for deduplication based on method, url, and body.
     */
    _getRequestKey(method, url, body) {
        return `${method}:${url}:${body || ''}`;
    }

    /**
     * Helper to detect network errors for retry logic.
     */
    _isNetworkError(error) {
        return (
            error.name === 'TypeError' ||
            error.message === 'Failed to fetch' ||
            error.message.includes('NetworkError')
        );
    }

    /**
     * Core request method
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            body,
            retryCount = 0,
            skipDedup = false,
            ...otherOptions
        } = options;

        const url = `${this.baseUrl}${endpoint}`;

        // Check deduplication
        const requestKey = !skipDedup && this._getRequestKey(method, url, body);
        if (requestKey && this.pendingRequests.has(requestKey)) {
            return this.pendingRequests.get(requestKey);
        }

        // 1. Run request interceptor
        const fetchOptions = this._requestInterceptor({ method, body, ...otherOptions }, endpoint);

        // Timeout handling
        const controller = new AbortController();
        fetchOptions.signal = controller.signal;

        let timeoutId;
        const timeoutPromise = new Promise((_resolve, reject) => {
            timeoutId = setTimeout(() => {
                controller.abort();
                reject(new Error('Request timeout'));
            }, this.timeoutMs);
        });

        // The actual fetch wrapped in our interceptors
        const fetchPromise = fetch(url, fetchOptions)
            .then(async response => {
                if (requestKey) this.pendingRequests.delete(requestKey);
                return await this._responseInterceptor(response);
            })
            .catch(error => {
                if (requestKey) this.pendingRequests.delete(requestKey);

                // Handle abort specifically
                if (error.name === 'AbortError') {
                    throw new Error(
                        error.message === 'The user aborted a request.'
                            ? 'Request cancelled'
                            : 'Request timeout'
                    );
                }

                // Retry with exponential backoff on network errors
                if (retryCount < this.maxRetries && this._isNetworkError(error)) {
                    const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                    return new Promise(resolve =>
                        setTimeout(
                            () =>
                                resolve(
                                    this.request(endpoint, {
                                        ...options,
                                        retryCount: retryCount + 1,
                                    })
                                ),
                            delay
                        )
                    );
                }

                if (
                    typeof process !== 'undefined' &&
                    process.env &&
                    process.env.NODE_ENV !== 'test'
                ) {
                    console.error(`API Error on ${endpoint}:`, error);
                }
                throw error;
            })
            .finally(() => {
                clearTimeout(timeoutId);
            });

        // Race fetch against timeout
        const requestPromise = Promise.race([fetchPromise, timeoutPromise]);

        // Store for deduplication
        if (requestKey) {
            this.pendingRequests.set(requestKey, requestPromise);
            requestPromise.finally(() => this.pendingRequests.delete(requestKey)).catch(() => {});
        }

        return requestPromise;
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
