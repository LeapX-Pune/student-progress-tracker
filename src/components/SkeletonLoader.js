export function createSkeletonText(lines = 3) {
    const wrapper = document.createElement('div');
    wrapper.className = 'skeleton-text-group';
    wrapper.setAttribute('role', 'status');
    wrapper.setAttribute('aria-label', 'Loading content');

    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading...';
    wrapper.appendChild(srOnly);

    const group = document.createElement('div');
    group.style.cssText = 'display:flex;flex-direction:column;gap:0.75rem;';
    group.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < lines; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton skeleton--text';
        if (i === lines - 1) {
            skeleton.style.width = '40%';
        }
        group.appendChild(skeleton);
    }

    wrapper.appendChild(group);
    return wrapper;
}

export function createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.setAttribute('role', 'status');
    card.setAttribute('aria-label', 'Loading card content');

    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading...';
    card.appendChild(srOnly);

    const content = document.createElement('div');
    content.setAttribute('aria-hidden', 'true');
    content.innerHTML = `
    <div class="skeleton-card__thumbnail"></div>
    <div class="skeleton-card__lines">
      <div class="skeleton-card__line" style="width:70%"></div>
      <div class="skeleton-card__line"></div>
      <div class="skeleton-card__line"></div>
    </div>
  `;
    card.appendChild(content);

    return card;
}

export function createSkeletonChart() {
    const chart = document.createElement('div');
    chart.className = 'skeleton-chart';
    chart.setAttribute('role', 'status');
    chart.setAttribute('aria-label', 'Loading chart');

    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading chart...';
    chart.appendChild(srOnly);

    const content = document.createElement('div');
    content.setAttribute('aria-hidden', 'true');
    content.innerHTML = '<div class="skeleton-chart__bar"></div>';
    const bar = content.querySelector('.skeleton-chart__bar');

    for (let i = 0; i < 5; i++) {
        const item = document.createElement('div');
        item.className = 'skeleton-chart__bar-item';
        bar.appendChild(item);
    }

    chart.appendChild(content);
    return chart;
}

export function renderSkeleton(container, type = 'card', count = 1) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        let el;
        switch (type) {
            case 'card':
                el = createSkeletonCard();
                break;
            case 'chart':
                el = createSkeletonChart();
                break;
            case 'text':
                el = createSkeletonText(3);
                break;
            default:
                el = createSkeletonCard();
        }
        fragment.appendChild(el);
    }

    container.innerHTML = '';
    container.appendChild(fragment);
}

export function removeSkeletons(container) {
    const skeletons = container.querySelectorAll(
        '.skeleton-card, .skeleton-chart, .skeleton-text-group'
    );
    skeletons.forEach(el => el.remove());
}
