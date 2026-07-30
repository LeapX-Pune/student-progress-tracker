import { API_ENDPOINTS } from '../utils/constants.js';
import { getConfig, isDevelopment } from '../utils/env.js';
import { normalizeApiError } from '../utils/errors.js';
import { getAuthToken } from './authStorage.js';
import { setupMockServer } from './mock.js';
import { enqueueRequest, initOfflineSync } from './offlineSync.js';

let mockHandlers = null;

/**
 *
 */
export async function initApi() {
    console.log('[API] Initializing API...');
    try {
        const config = getConfig();
        console.log('[API] Config:', config);

        if (config.apiMockEnabled) {
            console.log('[API] Mock API is enabled, setting up server...');
            mockHandlers = setupMockServer();
        } else {
            console.log('[API] Mock API is disabled.');
        }
    } catch (err) {
        console.warn('[API] Failed to initialize mock server:', err);
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
        this.baseUrl =
            baseUrl ||
            (window.CONFIG && window.CONFIG.API_BASE_URL) ||
            getConfig().apiBaseUrl ||
            '/api';

        this.pendingRequests = new Map();
        this.responseCache = new Map();
        this.timeoutMs = 10000;
        this.maxRetries = 3;
        this.activeRequests = 0;

        // Initialize offline sync to replay queued requests when online
        initOfflineSync(this);
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
            const clonedResponse = response.clone();
            try {
                const errorData = await clonedResponse.json();
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
            const data = await response.json();
            return data;
        }
        const text = await response.text();
        return text;
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
            cacheTTL = 0, // Time-to-live in seconds
            ...otherOptions
        } = options;

        const url = `${this.baseUrl}${endpoint}`;

        // Check deduplication (and cache key)
        const requestKey = !skipDedup && this._getRequestKey(method, url, body);

        // Check Cache
        if (method === 'GET' && cacheTTL > 0 && requestKey) {
            const cached = this.responseCache.get(requestKey);
            if (cached && Date.now() < cached.expiry) {
                if (isDevelopment())
                    console.log(`[API Cache] Returning cached response for ${url}`);
                return Promise.resolve(cached.data);
            }
        }
        if (requestKey && this.pendingRequests.has(requestKey)) {
            if (isDevelopment())
                console.log(`[API Dedup] Returning existing request for ${method} ${url}`);
            return this.pendingRequests.get(requestKey);
        }

        this.activeRequests++;
        if (this.activeRequests === 1) {
            window.dispatchEvent(new CustomEvent('api:loading-changed', { detail: { active: true } }));
        }

        const decrementActive = () => {
            this.activeRequests--;
            if (this.activeRequests <= 0) {
                this.activeRequests = 0;
                window.dispatchEvent(new CustomEvent('api:loading-changed', { detail: { active: false } }));
            }
        };

        if (isDevelopment()) {
            console.log(`[API Request] ${method} ${url}`, {
                body: body ? JSON.parse(body) : null,
                ...otherOptions,
            });
        }
        const requestStartTime = Date.now();

        // 1. Run request interceptor
        const fetchOptions = this._requestInterceptor({ method, body, ...otherOptions }, endpoint);

        // Timeout handling
        const controller = new AbortController();

        // Link external signal if provided (API-016 Cancel requests on unmount)
        if (otherOptions.signal) {
            otherOptions.signal.addEventListener('abort', () => controller.abort());
        }
        fetchOptions.signal = controller.signal;

        const timeoutPromise = new Promise((_resolve, reject) => {
            setTimeout(() => {
                controller.abort();
                reject(new Error('Request timeout'));
            }, this.timeoutMs);
        });

        // The actual fetch wrapped in our interceptors
        const fetchPromise = fetch(url, fetchOptions)
            .then(async response => {
                decrementActive();
                if (requestKey) this.pendingRequests.delete(requestKey);
                if (isDevelopment()) {
                    console.log(
                        `[API Response] ${method} ${url} (${response.status}) took ${Date.now() - requestStartTime}ms`
                    );
                }

                if (options.onDownloadProgress && response.body) {
                    const contentLength = response.headers.get('content-length');
                    const total = contentLength ? parseInt(contentLength, 10) : 0;
                    let loaded = 0;

                    const reader = response.body.getReader();
                    const chunks = [];

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        if (value) {
                            loaded += value.length;
                            chunks.push(value);
                        }

                        if (total) {
                            options.onDownloadProgress({ loaded, total, progress: loaded / total });
                        } else {
                            options.onDownloadProgress({ loaded, total: 0, progress: 0 }); // Indeterminate
                        }
                    }

                    const blob = new window.Blob(chunks);
                    const newResponse = new Response(blob, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers,
                    });

                    const finalData = await this._responseInterceptor(newResponse);
                    if (method === 'GET' && cacheTTL > 0 && requestKey) {
                        this.responseCache.set(requestKey, {
                            data: finalData,
                            expiry: Date.now() + cacheTTL * 1000,
                        });
                    }
                    return finalData;
                }

                const finalData = await this._responseInterceptor(response);
                if (method === 'GET' && cacheTTL > 0 && requestKey) {
                    this.responseCache.set(requestKey, {
                        data: finalData,
                        expiry: Date.now() + cacheTTL * 1000,
                    });
                }
                return finalData;
            })
            .catch(error => {
                decrementActive();
                if (requestKey) this.pendingRequests.delete(requestKey);
                if (isDevelopment()) {
                    console.error(
                        `[API Error] ${method} ${url} failed after ${Date.now() - requestStartTime}ms`,
                        error
                    );
                }

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

                // If it's a network error and we're out of retries, OR we're offline
                if (this._isNetworkError(error) || !window.navigator.onLine) {
                    if (method !== 'GET') {
                        enqueueRequest({ endpoint, method, options: { body, ...otherOptions } });
                        // Throw a specific offline error so components know it was queued
                        const offlineErr = new Error('Network offline, request queued for sync');
                        offlineErr.code = 'OFFLINE_QUEUED';
                        throw offlineErr;
                    }
                }

                console.error(`API Error on ${endpoint}:`, error);
                throw error;
            });

        // Race fetch against timeout
        const requestPromise = Promise.race([fetchPromise, timeoutPromise]);

        // Store for deduplication
        if (requestKey) {
            this.pendingRequests.set(requestKey, requestPromise);
            // Ensure we clean up if race resolves before finally block

            requestPromise.finally(() => this.pendingRequests.delete(requestKey)).catch(() => {}); // Prevent unhandled rejection on this detached branch
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
    /**
     * Executes multiple requests concurrently.
     * @param {Array<{endpoint: string, options: Object}>} requests - Array of request configs.
     * @returns {Promise<Array<any>>} Array of responses in the same order.
     */
    async batch(requests) {
        if (!Array.isArray(requests)) {
            throw new Error('batch() expects an array of requests');
        }
        return Promise.all(
            requests.map(req => {
                if (typeof req === 'string') {
                    return this.get(req);
                }
                return this.request(req.endpoint, req.options || {});
            })
        );
    }
}

export const api = new ApiService();

/**
 * Fetches all courses for a given student.
 *
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Array>} The student's courses.
 */
export async function getCourses(studentId) {
    try {
        const result = await api.get(API_ENDPOINTS.STUDENT_COURSES(studentId));
        return result;
    } catch (err) {
        console.error('[API] getCourses error:', err);
        throw {
            code: err.code || 'UNKNOWN',
            message: err.message || 'Failed to fetch courses',
        };
    }
}
