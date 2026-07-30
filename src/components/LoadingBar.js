let _bar = null;
let _activeCount = 0;

/**
 *
 */
export function createLoadingBar() {
    if (_bar) return _bar;
    _bar = document.createElement('div');
    _bar.className = 'loading-bar';
    _bar.setAttribute('role', 'progressbar');
    _bar.setAttribute('aria-hidden', 'true');
    _bar.style.cssText =
        'position:fixed;top:0;left:0;width:0;height:3px;z-index:9999;' +
        'background:linear-gradient(90deg,#4F46E5,#3B82F6);' +
        'transition:width 0.3s ease,opacity 0.3s ease;opacity:0;';
    document.body.appendChild(_bar);
    return _bar;
}

/**
 *
 */
export function showLoadingBar() {
    const bar = createLoadingBar();
    _activeCount++;
    if (_activeCount > 1) return;
    bar.style.opacity = '1';
    bar.style.width = '30%';
    requestAnimationFrame(() => {
        bar.style.width = '60%';
    });
}

/**
 *
 */
export function hideLoadingBar() {
    if (_activeCount <= 0) return;
    _activeCount--;
    if (_activeCount > 0) return;
    const bar = createLoadingBar();
    bar.style.width = '100%';
    setTimeout(() => {
        bar.style.opacity = '0';
        bar.style.width = '0';
    }, 200);
}

/**
 *
 */
export function initLoadingBar() {
    createLoadingBar();
    window.addEventListener('api:loading-changed', event => {
        if (event.detail?.active) showLoadingBar();
        else hideLoadingBar();
    });
}

export default { createLoadingBar, showLoadingBar, hideLoadingBar, initLoadingBar };
