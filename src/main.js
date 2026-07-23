import './styles/main.css';
import { initApi } from './services/api.js';

/**
 *
 */
async function init() {
    await initApi();

    const app = document.getElementById('app');
    if (app) {
        app.classList.add('app--ready');
    }
}

document.addEventListener('DOMContentLoaded', init);
