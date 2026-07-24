const OBSERVER_CONFIG = {
    rootMargin: '200px 0px',
    threshold: 0,
};

let observer = null;

/**
 *
 */
function getObserver() {
    if (!observer && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const load = el._lazyLoad;
                    if (load) {
                        load();
                        el._lazyLoad = null;
                        observer.unobserve(el);
                    }
                }
            });
        }, OBSERVER_CONFIG);
    }
    return observer;
}

/**
 *
 */
export function createLazyLoader({ onLoad, placeholder } = {}) {
    const container = document.createElement('div');
    container.className = 'lazy-loader';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-live', 'polite');

    const placeholderEl = placeholder || document.createElement('div');
    if (!placeholder || placeholder instanceof HTMLElement === false) {
        placeholderEl.className = 'lazy-loader__placeholder';
        placeholderEl.innerHTML = `
            <div class="skeleton" style="width:100%;height:100%;min-height:100px;"></div>
        `;
    }
    container.appendChild(placeholderEl);

    let loaded = false;
    let destroyed = false;

    /**
     *
     */
    container._lazyLoad = async () => {
        if (loaded || destroyed) return;
        loaded = true;
        try {
            const content = await onLoad();
            if (destroyed) return;
            container.innerHTML = '';
            if (content instanceof HTMLElement) {
                container.appendChild(content);
            } else if (typeof content === 'string') {
                container.insertAdjacentHTML('beforeend', content);
            }
            container.classList.add('lazy-loader--loaded');
        } catch (_err) {
            if (destroyed) return;
            container.classList.add('lazy-loader--error');
            container.innerHTML = `
                <div class="lazy-loader__error" role="alert">
                    <p>Failed to load content.</p>
                </div>
            `;
        }
    };

    const obs = getObserver();
    if (obs) {
        obs.observe(container);
    }

    return {
        element: container,
        /**
         *
         */
        load() {
            if (container._lazyLoad) {
                const fn = container._lazyLoad;
                container._lazyLoad = null;
                fn();
            }
        },
        /**
         *
         */
        destroy() {
            destroyed = true;
            if (obs && container) obs.unobserve(container);
            container._lazyLoad = null;
            loaded = true;
        },
    };
}

/**
 *
 */
export function createLazyImage({ src, alt, width, height } = {}) {
    return createLazyLoader({
        /**
         *
         */
        async onLoad() {
            const img = new Image();
            img.className = 'lazy-loader__img';
            img.alt = alt || '';
            if (width) img.width = width;
            if (height) img.height = height;
            img.loading = 'lazy';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            });

            return img;
        },
        placeholder: (() => {
            const ph = document.createElement('div');
            ph.className = 'lazy-loader__image-placeholder';
            ph.style.cssText = width
                ? `width:${typeof width === 'number' ? width + 'px' : width};`
                : '';
            ph.style.minHeight = height
                ? typeof height === 'number'
                    ? height + 'px'
                    : height
                : '150px';
            return ph;
        })(),
    });
}
