/**
 *
 */
export function createSkeletonCard() {
    const card = document.createElement('article');
    card.className = 'skeleton-card';

    // Thumbnail area
    const thumbnail = document.createElement('div');
    thumbnail.className = 'skeleton-card__thumbnail skeleton-bone';
    card.appendChild(thumbnail);

    // Content area
    const content = document.createElement('div');
    content.className = 'skeleton-card__content';

    // Title and instructor
    const title = document.createElement('div');
    title.className = 'skeleton-card__title skeleton-bone';
    const instructor = document.createElement('div');
    instructor.className = 'skeleton-card__subtitle skeleton-bone';

    // Status badge
    const badge = document.createElement('div');
    badge.className = 'skeleton-card__badge skeleton-bone';

    // Modules row
    const modulesRow = document.createElement('div');
    modulesRow.className = 'skeleton-card__row';
    const modulesLabel = document.createElement('div');
    modulesLabel.className = 'skeleton-card__label skeleton-bone';
    const modulesValue = document.createElement('div');
    modulesValue.className = 'skeleton-card__value skeleton-bone';
    modulesRow.append(modulesLabel, modulesValue);

    // Grade row
    const gradeRow = document.createElement('div');
    gradeRow.className = 'skeleton-card__row';
    const gradeLabel = document.createElement('div');
    gradeLabel.className = 'skeleton-card__label skeleton-bone';
    const gradeValue = document.createElement('div');
    gradeValue.className = 'skeleton-card__value skeleton-bone';
    gradeRow.append(gradeLabel, gradeValue);

    // Next module row
    const nextRow = document.createElement('div');
    nextRow.className = 'skeleton-card__row';
    const nextLabel = document.createElement('div');
    nextLabel.className = 'skeleton-card__label skeleton-bone';
    const nextValue = document.createElement('div');
    nextValue.className = 'skeleton-card__title skeleton-bone';
    nextValue.style.width = '60%'; // slightly shorter
    nextRow.append(nextLabel, nextValue);

    // Progress row
    const progressRow = document.createElement('div');
    progressRow.className = 'skeleton-card__row';
    progressRow.style.marginTop = '0.5rem';
    const progressLabel = document.createElement('div');
    progressLabel.className = 'skeleton-card__label skeleton-bone';
    const progressValue = document.createElement('div');
    progressValue.className = 'skeleton-card__value skeleton-bone';
    progressRow.append(progressLabel, progressValue);

    // Progress bar
    const bar = document.createElement('div');
    bar.className = 'skeleton-card__bar skeleton-bone';

    content.append(title, instructor, badge, modulesRow, gradeRow, nextRow, progressRow, bar);

    card.appendChild(content);

    return card;
}
