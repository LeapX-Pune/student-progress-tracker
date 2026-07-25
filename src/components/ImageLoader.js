/**
 *
 */
export function createImageLoader({ src, alt, className = '', width, height } = {}) {
    const container = document.createElement('div');
    container.className = `image-loader ${className}`.trim();
    container.setAttribute('role', 'img');

    const placeholder = document.createElement('div');
    placeholder.className = 'image-loader__placeholder';

    const img = document.createElement('img');
    img.className = 'image-loader__img';
    img.alt = alt || '';
    if (width) img.width = width;
    if (height) img.height = height;
    if (src) img.src = src;

    container.appendChild(placeholder);
    container.appendChild(img);

    if (img.complete && img.naturalWidth > 0) {
        placeholder.remove();
        img.classList.add('image-loader__img--loaded');
        return container;
    }

    let destroyed = false;

    img.addEventListener('load', () => {
        if (destroyed) return;
        placeholder.remove();
        img.classList.add('image-loader__img--loaded');
    });

    img.addEventListener('error', () => {
        if (destroyed) return;
        placeholder.className = 'image-loader__placeholder image-loader__placeholder--error';
        placeholder.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
        `;
    });

    return {
        element: container,
        /**
         *
         */
        destroy() {
            destroyed = true;
        },
    };
}
