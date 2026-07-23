const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

let openModal = null;
let modalIdCounter = 0;

export function createModal({ title, body, footer, onClose, size = 'md', ariaDescription } = {}) {
    if (openModal) {
        openModal.close();
    }

    const modalId = `modal-${++modalIdCounter}`;
    const titleId = `${modalId}-title`;
    const descId = `${modalId}-desc`;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', titleId);
    if (ariaDescription) overlay.setAttribute('aria-describedby', descId);

    const modal = document.createElement('div');
    modal.className = 'modal';
    if (size === 'lg') modal.style.maxWidth = '700px';
    if (size === 'sm') modal.style.maxWidth = '360px';

    modal.innerHTML = `
    <div class="modal__header">
      <h2 class="modal__title" id="${titleId}">${title || ''}</h2>
      <button class="modal__close" aria-label="Close dialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
  `;

    const bodyEl = document.createElement('div');
    bodyEl.className = 'modal__body';
    if (ariaDescription) bodyEl.id = descId;
    if (typeof body === 'string') {
        bodyEl.innerHTML = body;
    } else if (body instanceof HTMLElement) {
        bodyEl.appendChild(body);
    }
    modal.appendChild(bodyEl);

    if (footer) {
        const footerEl = document.createElement('div');
        footerEl.className = 'modal__footer';
        if (typeof footer === 'string') {
            footerEl.innerHTML = footer;
        } else if (footer instanceof HTMLElement) {
            footerEl.appendChild(footer);
        } else if (Array.isArray(footer)) {
            footer.forEach(el => footerEl.appendChild(el));
        }
        modal.appendChild(footerEl);
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.classList.add('modal-overlay--open');
    });

    const modalObj = {
        element: overlay,
        close: () => {
            overlay.classList.remove('modal-overlay--open');
            overlay.addEventListener(
                'transitionend',
                () => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                },
                { once: true }
            );
            if (openModal === modalObj) openModal = null;
            if (onClose) onClose();
            document.removeEventListener('keydown', handleKeydown);
            document.body.style.overflow = '';
        },
    };

    openModal = modalObj;

    function handleKeydown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            modalObj.close();
        }

        if (e.key === 'Tab') {
            const focusable = modal.querySelectorAll(FOCUSABLE_SELECTOR);
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    document.addEventListener('keydown', handleKeydown);

    const closeBtn = modal.querySelector('.modal__close');
    closeBtn.addEventListener('click', () => modalObj.close());

    overlay.addEventListener('mousedown', e => {
        if (e.target === overlay) modalObj.close();
    });

    requestAnimationFrame(() => {
        const firstFocusable = modal.querySelector(FOCUSABLE_SELECTOR);
        if (firstFocusable) firstFocusable.focus();
    });

    document.body.style.overflow = 'hidden';

    return modalObj;
}
