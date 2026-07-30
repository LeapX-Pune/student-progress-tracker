/**
 *
 */
export class NetworkService {
    /**
     *
     */
    constructor() {
        this._isOnline = navigator.onLine;
        this._listeners = new Set();
        this._handleOnline = this._handleOnline.bind(this);
        this._handleOffline = this._handleOffline.bind(this);
        window.addEventListener('online', this._handleOnline);
        window.addEventListener('offline', this._handleOffline);
    }

    /**
     *
     */
    _handleOnline() {
        this._isOnline = true;
        this._notify(true);
    }

    /**
     *
     */
    _handleOffline() {
        this._isOnline = false;
        this._notify(false);
    }

    /**
     *
     */
    isOnline() {
        return this._isOnline;
    }

    /**
     *
     */
    subscribe(listener) {
        this._listeners.add(listener);
        listener(this._isOnline);
        return () => {
            this._listeners.delete(listener);
        };
    }

    /**
     *
     */
    _notify(status) {
        this._listeners.forEach(fn => {
            try {
                fn(status);
            } catch (err) {
                console.error('[NetworkService] Listener error:', err);
            }
        });
    }

    /**
     *
     */
    destroy() {
        window.removeEventListener('online', this._handleOnline);
        window.removeEventListener('offline', this._handleOffline);
        this._listeners.clear();
    }
}

export const networkService = new NetworkService();
