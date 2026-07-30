import { getConfig } from '../utils/env.js';

/**
 *
 */
export function healthCheck() {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        env: getConfig().appEnv || 'development',
    };
}
