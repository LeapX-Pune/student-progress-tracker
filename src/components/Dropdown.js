let dropdownIdCounter = 0;

let openDropdown = null;

/**
 *
 */
function handleGlobalClose(e) {
    if (!openDropdown) return;
    const target = e.target;
    if (e.type === 'keydown') {
        if (e.key === 'Escape') {
            e.preventDefault();
            openDropdown.close();
        }
        return;
    }
    if (
        openDropdown &&
        !openDropdown.element.contains(target) &&
        !openDropdown.trigger.contains(target)
    ) {
        openDropdown.close();
    }
}

/**
 *
 */
export function createDropdown(
    triggerEl,
    { items = [], placement = 'bottom-start', onSelect } = {}
) {
    if (openDropdown) {
        openDropdown.close();
    }

    const dropdownId = `dropdown-${++dropdownIdCounter}`;
    const menuId = `${dropdownId}-menu`;

    triggerEl.setAttribute('aria-haspopup', 'true');
    triggerEl.setAttribute('aria-expanded', 'false');
    triggerEl.setAttribute('aria-controls', menuId);

    const menu = document.createElement('div');
    menu.className = `dropdown-menu dropdown-menu--${placement}`;
    menu.id = menuId;
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-labelledby', dropdownId);
    menu.hidden = true;

    let itemsMap = [];

    /**
     *
     */
    function renderItems() {
        menu.innerHTML = '';
        itemsMap = [];

        items.forEach((item, index) => {
            if (item.separator) {
                const sep = document.createElement('div');
                sep.className = 'dropdown-menu__separator';
                sep.setAttribute('role', 'separator');
                menu.appendChild(sep);
                return;
            }

            const btn = document.createElement('button');
            btn.className = 'dropdown-menu__item';
            btn.setAttribute('role', 'menuitem');
            if (item.danger) btn.classList.add('dropdown-menu__item--danger');
            btn.textContent = item.label;
            if (item.icon) {
                btn.insertAdjacentHTML(
                    'afterbegin',
                    `<span class="dropdown-menu__icon">${item.icon}</span>`
                );
            }
            btn.disabled = item.disabled || false;
            if (item.disabled) btn.setAttribute('aria-disabled', 'true');

            btn.addEventListener('click', () => {
                if (item.disabled) return;
                if (onSelect) onSelect(item, index);
                dropdownObj.close();
            });

            btn.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });

            menu.appendChild(btn);
            itemsMap.push(btn);
        });
    }

    renderItems();

    document.body.appendChild(menu);

    /**
     *
     */
    function positionMenu() {
        const triggerRect = triggerEl.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        menu.style.position = 'fixed';

        switch (placement) {
            case 'bottom-start':
                menu.style.top = `${triggerRect.bottom + 4}px`;
                menu.style.left = `${triggerRect.left}px`;
                break;
            case 'bottom-end':
                menu.style.top = `${triggerRect.bottom + 4}px`;
                menu.style.left = `${triggerRect.right - menuRect.width}px`;
                break;
            case 'top-start':
                menu.style.top = `${triggerRect.top - menuRect.height - 4}px`;
                menu.style.left = `${triggerRect.left}px`;
                break;
            case 'top-end':
                menu.style.top = `${triggerRect.top - menuRect.height - 4}px`;
                menu.style.left = `${triggerRect.right - menuRect.width}px`;
                break;
        }
    }

    const dropdownObj = {
        element: menu,
        trigger: triggerEl,

        /**
         *
         */
        open() {
            if (openDropdown && openDropdown !== dropdownObj) {
                openDropdown.close();
            }
            positionMenu();
            menu.hidden = false;
            triggerEl.setAttribute('aria-expanded', 'true');
            requestAnimationFrame(() => {
                menu.classList.add('dropdown-menu--open');
            });
            openDropdown = dropdownObj;
            document.addEventListener('mousedown', handleGlobalClose);
            document.addEventListener('keydown', handleGlobalClose);
            requestAnimationFrame(() => {
                const first = itemsMap.find(b => !b.disabled);
                if (first) first.focus();
            });
        },

        /**
         *
         */
        close() {
            menu.classList.remove('dropdown-menu--open');
            menu.hidden = true;
            triggerEl.setAttribute('aria-expanded', 'false');
            if (openDropdown === dropdownObj) {
                openDropdown = null;
            }
            document.removeEventListener('mousedown', handleGlobalClose);
            document.removeEventListener('keydown', handleGlobalClose);
            triggerEl.focus();
        },

        /**
         *
         */
        toggle() {
            if (menu.hidden) {
                dropdownObj.open();
            } else {
                dropdownObj.close();
            }
        },

        /**
         *
         */
        update(newItems) {
            items = newItems;
            renderItems();
        },

        /**
         *
         */
        destroy() {
            dropdownObj.close();
            menu.remove();
            triggerEl.removeAttribute('aria-haspopup');
            triggerEl.removeAttribute('aria-expanded');
            triggerEl.removeAttribute('aria-controls');
        },
    };

    triggerEl.addEventListener('click', e => {
        e.stopPropagation();
        dropdownObj.toggle();
    });

    triggerEl.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            dropdownObj.open();
        }
    });

    menu.addEventListener('keydown', e => {
        const focusable = itemsMap.filter(b => !b.disabled);
        if (focusable.length === 0) return;

        const currentIndex = focusable.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (currentIndex + 1) % focusable.length;
            focusable[next].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = (currentIndex - 1 + focusable.length) % focusable.length;
            focusable[prev].focus();
        } else if (e.key === 'Home') {
            e.preventDefault();
            focusable[0].focus();
        } else if (e.key === 'End') {
            e.preventDefault();
            focusable[focusable.length - 1].focus();
        }
    });

    return dropdownObj;
}
