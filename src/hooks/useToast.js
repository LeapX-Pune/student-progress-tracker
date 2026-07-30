import { showToast, showSuccess, showError, showWarning, showInfo } from '../components/Toast.js';

/**
 *
 */
export function useToast() {
    return { showToast, showSuccess, showError, showWarning, showInfo };
}

export default useToast;
