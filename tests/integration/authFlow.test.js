import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login } from '../../src/services/authApi.js';
import { api } from '../../src/services/api.js';

beforeEach(() => {
    document.body.innerHTML = '';
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(api, '_isNetworkError').mockReturnValue(false);
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('Auth API — login', () => {
    it('returns token and user on successful login', async () => {
        const mockResponse = {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: () =>
                Promise.resolve({
                    token: 'mock-jwt-token',
                    expiresAt: Date.now() + 3600000,
                    user: { id: 'stu_001', name: 'Alex Johnson', email: 'a@b.com' },
                }),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await login({ email: 'student@demo.com', password: 'demo123' });
        expect(result.token).toBe('mock-jwt-token');
        expect(result.user.name).toBe('Alex Johnson');
    });

    it('throws INVALID_CREDENTIALS on 401', async () => {
        const mockResponse = {
            ok: false,
            status: 401,
            headers: new Headers({ 'content-type': 'application/json' }),
            clone: () => mockResponse,
            json: () => Promise.resolve({ message: 'Invalid email or password.' }),
        };
        fetch.mockResolvedValue(mockResponse);

        await expect(login({ email: 'wrong@demo.com', password: 'wrong' })).rejects.toMatchObject({
            code: 'INVALID_CREDENTIALS',
        });
    });

    it('throws NETWORK_ERROR on network failure', async () => {
        fetch.mockRejectedValue(new TypeError('Failed to fetch'));

        await expect(
            login({ email: 'student@demo.com', password: 'demo123' })
        ).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
    });
});
