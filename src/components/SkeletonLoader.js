/**
 *
 */
export function createSkeletonText(lines = 3) {
  const wrapper = document.createElement('div');
  wrapper.className = 'skeleton-text-group';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.cssText = 'display:flex;flex-direction:column;gap:0.75rem;';

  for (let i = 0; i < lines; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton skeleton--text';
    if (i === lines - 1) {
      skeleton.style.width = '40%';
    }
    wrapper.appendChild(skeleton);
  }

  return wrapper;
}

/**
 *
 */
export function createSkeletonCard() {
  const card = document.createElement('div');
  card.className = 'skeleton-card';
  card.setAttribute('aria-hidden', 'true');

  card.innerHTML = `
    <div class="skeleton-card__thumbnail"></div>
    <div class="skeleton-card__lines">
      <div class="skeleton-card__line" style="width:70%"></div>
      <div class="skeleton-card__line"></div>
      <div class="skeleton-card__line"></div>
    </div>
  `;

  return card;
}

/**
 *
 */
export function createSkeletonChart() {
  const chart = document.createElement('div');
  chart.className = 'skeleton-chart';
  chart.setAttribute('aria-hidden', 'true');

  chart.innerHTML = '<div class="skeleton-chart__bar"></div>';
  const bar = chart.querySelector('.skeleton-chart__bar');

  for (let i = 0; i < 5; i++) {
    const item = document.createElement('div');
    item.className = 'skeleton-chart__bar-item';
    bar.appendChild(item);
  }

  return chart;
}

/**
 *
 */
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

/**
 *
 */
export function removeSkeletons(container) {
  const skeletons = container.querySelectorAll(
    '.skeleton-card, .skeleton-chart, .skeleton-text-group'
  );
  skeletons.forEach(el => el.remove());
}
