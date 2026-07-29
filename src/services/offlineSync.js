/**
 * @fileoverview offlineSync — Manages an offline queue for API mutation requests.
 */

const QUEUE_KEY = 'offline_sync_queue';

/**
 * Gets the current offline queue from localStorage.
 */
export function getOfflineQueue() {
    try {
        const data = localStorage.getItem(QUEUE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

/**
 * Saves the offline queue to localStorage.
 */
export function saveOfflineQueue(queue) {
    try {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (err) {
        console.error('[OfflineSync] Failed to save queue', err);
    }
}

/**
 * Enqueues a failed request config for later sync.
 */
export function enqueueRequest(requestConfig) {
    const queue = getOfflineQueue();

    // Only queue mutations (POST, PUT, PATCH, DELETE)
    if (requestConfig.method === 'GET') return;

    // Strip headers to prevent storing sensitive tokens in plain text in localStorage.
    // The ApiService will regenerate headers (including current Auth token) on replay.
    const configToSave = { ...requestConfig };
    if (configToSave.options && configToSave.options.headers) {
        delete configToSave.options.headers;
    }

    queue.push({
        id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
        ...configToSave,
    });
    saveOfflineQueue(queue);
    console.log(
        `[OfflineSync] Request queued for sync: ${requestConfig.method} ${requestConfig.endpoint}`
    );
}

/**
 * Initializes the online event listener to replay queued requests.
 * @param {Object} apiInstance - The ApiService instance to use for replay.
 */
export function initOfflineSync(apiInstance) {
    window.addEventListener('online', async () => {
        console.log('[OfflineSync] Browser is online. Processing offline queue...');
        const queue = getOfflineQueue();
        if (queue.length === 0) return;

        const newQueue = [];

        for (const req of queue) {
            try {
                // Ensure method is correctly set in options during replay
                const options = req.options || {};
                options.method = req.method;

                await apiInstance.request(req.endpoint, options);
                console.log(`[OfflineSync] Successfully synced: ${req.method} ${req.endpoint}`);
            } catch (err) {
                console.error(`[OfflineSync] Sync failed for ${req.method} ${req.endpoint}`, err);
                newQueue.push(req); // Retain in queue for next time
            }
        }

        saveOfflineQueue(newQueue);
        if (newQueue.length === 0) {
            console.log('[OfflineSync] Offline queue completely synced.');
        } else {
            console.log(`[OfflineSync] ${newQueue.length} requests remaining in queue.`);
        }
    });
}
