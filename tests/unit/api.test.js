import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ApiService } from '../../src/services/api.js';

// Mock the offline sync module
vi.mock('../../src/services/offlineSync.js', () => ({
    getOfflineQueue: vi.fn(),
    saveOfflineQueue: vi.fn(),
    enqueueRequest: vi.fn(),
    initOfflineSync: vi.fn(),
}));

describe('ApiService', () => {
    let api;
    let originalFetch;

    beforeEach(() => {
        vi.clearAllMocks();
        api = new ApiService('http://localhost:3000');
        originalFetch = window.fetch;
        window.fetch = vi.fn();
    });

    afterEach(() => {
        window.fetch = originalFetch;
    });

    it('should deduplicate simultaneous requests', async () => {
        const mockResponse = new Response(JSON.stringify({ data: 'ok' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

        window.fetch.mockImplementation(() => {
            return new Promise(resolve => setTimeout(() => resolve(mockResponse.clone()), 50));
        });

        // Fire two requests simultaneously
        const p1 = api.get('/test');
        const p2 = api.get('/test');

        const [r1, r2] = await Promise.all([p1, p2]);

        expect(r1).toEqual({ data: 'ok' });
        expect(r2).toEqual({ data: 'ok' });
        // Fetch should only be called once due to deduplication
        expect(window.fetch).toHaveBeenCalledTimes(1);
    });

    it('should cache GET responses if cacheTTL is provided', async () => {
        const mockResponse = new Response(JSON.stringify({ data: 'cached' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

        window.fetch.mockResolvedValueOnce(mockResponse);

        // First request populates cache
        const res1 = await api.get('/cache-test', { cacheTTL: 60 });
        expect(res1).toEqual({ data: 'cached' });
        expect(window.fetch).toHaveBeenCalledTimes(1);

        // Second request should hit cache
        const res2 = await api.get('/cache-test', { cacheTTL: 60 });
        expect(res2).toEqual({ data: 'cached' });
        expect(window.fetch).toHaveBeenCalledTimes(1); // No new fetch
    });

    it('should batch requests correctly', async () => {
        window.fetch.mockImplementation(url => {
            const data = url.includes('/r1') ? 'res1' : 'res2';
            return Promise.resolve(
                new Response(JSON.stringify({ data }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                })
            );
        });

        const results = await api.batch([
            { endpoint: '/r1', options: {} },
            { endpoint: '/r2', options: {} },
        ]);

        expect(results).toHaveLength(2);
        expect(results[0]).toEqual({ data: 'res1' });
        expect(results[1]).toEqual({ data: 'res2' });
        expect(window.fetch).toHaveBeenCalledTimes(2);
    });

    it('should invalidate cache on successful mutation (POST)', async () => {
        // Mock GET response
        const getMockResponse = new Response(JSON.stringify({ data: 'cached_data' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

        // Mock POST response
        const postMockResponse = new Response(JSON.stringify({ success: true }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });

        window.fetch
            .mockResolvedValueOnce(getMockResponse.clone()) // First GET
            .mockResolvedValueOnce(postMockResponse.clone()) // POST
            .mockResolvedValueOnce(getMockResponse.clone()); // Second GET

        // 1. Fetch and cache
        await api.get('/cache-test', { cacheTTL: 60 });
        expect(window.fetch).toHaveBeenCalledTimes(1);

        // 2. Fetch again, should hit cache
        await api.get('/cache-test', { cacheTTL: 60 });
        expect(window.fetch).toHaveBeenCalledTimes(1); // Still 1

        // 3. Perform a mutation (POST)
        await api.post('/cache-test', { updated: true });
        expect(window.fetch).toHaveBeenCalledTimes(2);

        // 4. Fetch GET again, should miss cache and hit network because POST invalidated it
        await api.get('/cache-test', { cacheTTL: 60 });
        expect(window.fetch).toHaveBeenCalledTimes(3);
    });
});
