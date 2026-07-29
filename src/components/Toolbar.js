/**
 * @fileoverview Reusable Toolbar component for search, filter, and sort operations.
 *
 * @module components/Toolbar
 */

/**
 * Creates a toolbar with search, filter, and sort controls.
 *
 * @param {Object} options Configuration options for the toolbar.
 * @param {string} options.searchPlaceholder Placeholder for the search input.
 * @param {Array<{value: string, label: string}>} options.filterOptions Options for the filter dropdown.
 * @param {Array<{value: string, label: string}>} options.sortOptions Options for the sort dropdown.
 * @param {Function} options.onSearch Callback for when search query changes.
 * @param {Function} options.onFilter Callback for when filter changes.
 * @param {Function} options.onSort Callback for when sort changes.
 * @returns {HTMLElement} The constructed toolbar element.
 */
export function createToolbar({
    searchPlaceholder = 'Search...',
    filterOptions = [],
    sortOptions = [],
    onSearch,
    onFilter,
    onSort,
}) {
    const toolbar = document.createElement('div');
    toolbar.className = 'dashboard-toolbar';
    toolbar.style.display = 'flex';
    toolbar.style.flexWrap = 'wrap';
    toolbar.style.gap = '1rem';
    toolbar.style.marginBottom = '2rem';
    toolbar.style.alignItems = 'center';
    toolbar.style.justifyContent = 'space-between';
    toolbar.style.background = 'var(--bg-surface)';
    toolbar.style.padding = '1rem';
    toolbar.style.borderRadius = '12px';
    toolbar.style.border = '1px solid var(--border-color)';

    // Search Input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'toolbar-search';
    searchContainer.style.flex = '1 1 300px';
    searchContainer.style.position = 'relative';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = searchPlaceholder;
    searchInput.setAttribute('aria-label', searchPlaceholder);
    searchInput.style.width = '100%';
    searchInput.style.padding = '0.75rem 1rem 0.75rem 2.5rem';
    searchInput.style.borderRadius = '8px';
    searchInput.style.border = '1px solid var(--border-color)';
    searchInput.style.background = 'var(--bg-body)';
    searchInput.style.color = 'var(--text-primary)';

    // Simple search icon using Lucide (assuming icons will be initialized)
    const searchIcon = document.createElement('i');
    searchIcon.setAttribute('data-lucide', 'search');
    searchIcon.style.position = 'absolute';
    searchIcon.style.left = '0.75rem';
    searchIcon.style.top = '50%';
    searchIcon.style.transform = 'translateY(-50%)';
    searchIcon.style.color = 'var(--text-secondary)';
    searchIcon.style.width = '16px';
    searchIcon.style.height = '16px';

    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);

    if (onSearch) {
        searchInput.addEventListener('input', e => {
            onSearch(e.target.value);
        });
    }

    // Controls Container
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'toolbar-controls';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.gap = '1rem';
    controlsContainer.style.flexWrap = 'wrap';

    // Filter Dropdown
    if (filterOptions.length > 0) {
        const filterSelect = document.createElement('select');
        filterSelect.setAttribute('aria-label', 'Filter options');
        filterSelect.style.padding = '0.75rem 2rem 0.75rem 1rem';
        filterSelect.style.borderRadius = '8px';
        filterSelect.style.border = '1px solid var(--border-color)';
        filterSelect.style.background = 'var(--bg-body)';
        filterSelect.style.color = 'var(--text-primary)';
        filterSelect.style.cursor = 'pointer';

        filterOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            filterSelect.appendChild(option);
        });

        if (onFilter) {
            filterSelect.addEventListener('change', e => {
                onFilter(e.target.value);
            });
        }
        controlsContainer.appendChild(filterSelect);
    }

    // Sort Dropdown
    if (sortOptions.length > 0) {
        const sortSelect = document.createElement('select');
        sortSelect.setAttribute('aria-label', 'Sort options');
        sortSelect.style.padding = '0.75rem 2rem 0.75rem 1rem';
        sortSelect.style.borderRadius = '8px';
        sortSelect.style.border = '1px solid var(--border-color)';
        sortSelect.style.background = 'var(--bg-body)';
        sortSelect.style.color = 'var(--text-primary)';
        sortSelect.style.cursor = 'pointer';

        sortOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            sortSelect.appendChild(option);
        });

        if (onSort) {
            sortSelect.addEventListener('change', e => {
                onSort(e.target.value);
            });
        }
        controlsContainer.appendChild(sortSelect);
    }

    toolbar.appendChild(searchContainer);
    if (controlsContainer.children.length > 0) {
        toolbar.appendChild(controlsContainer);
    }

    return toolbar;
}
