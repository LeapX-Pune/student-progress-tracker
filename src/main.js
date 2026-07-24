import './styles/main.css';
import { initApi } from './services/api.js';
import { initMotionPreferences } from './utils/animations.js';
import { initScrollRestoration, updateDocumentTitle } from './utils/router.js';

/**
 *
 */
async function init() {
    initMotionPreferences();
    initScrollRestoration();
    updateDocumentTitle();

    await initApi();

    const app = document.querySelector('.app-shell');
    if (app) {
        app.classList.add('app--ready');
    }
}

document.addEventListener('DOMContentLoaded', init);
