import { networkService } from '../services/network/NetworkService.js';

/**
 *
 */
export function useNetworkStatus(onChange) {
    const unsubscribe = networkService.subscribe(onChange);
    return {
        isOnline: networkService.isOnline(),
        /**
         *
         */
        destroy() {
            unsubscribe();
        },
    };
}

export default useNetworkStatus;
