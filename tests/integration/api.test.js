import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiService } from '../../src/services/api.js';

describe('ApiService', () => {
    let api;

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
        api = new ApiService('/api');
        api.maxRetries = 0;
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('performs GET request', async () => {
        fetch.mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: () => Promise.resolve({ data: 'test' }),
        });

        const result = await api.get('/students/stu_001');
        expect(result).toEqual({ data: 'test' });
    });

    it('performs POST request with body', async () => {
        fetch.mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: () => Promise.resolve({ token: 'abc' }),
        });

        const result = await api.post('/auth/login', { email: 'a@b.com', password: 'pwd' });
        expect(result.token).toBe('abc');
    });

    it('throws on 404 response', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 404,
            headers: new Headers({ 'content-type': 'application/json' }),
            clone: function () {
                return this;
            },
            json: () => Promise.resolve({ message: 'Not found' }),
        });

        await expect(api.get('/unknown')).rejects.toThrow();
    });

    it('handles non-retryable network errors', async () => {
        fetch.mockRejectedValue(new TypeError('Failed to fetch'));
        await expect(api.get('/test')).rejects.toThrow();
    });
});
