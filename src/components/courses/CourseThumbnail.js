/**
 *
 */
export function createCourseThumbnail(thumbnailUrl, title) {
    const wrapper = document.createElement('div');
    wrapper.className = 'course-thumbnail';

    const container = document.createElement('div');
    container.className = 'course-thumbnail__container';

    if (thumbnailUrl) {
        const img = document.createElement('img');
        img.className = 'course-thumbnail__img';
        img.src = thumbnailUrl;
        img.alt = `${title} thumbnail`;
        img.loading = 'lazy';

        /**
         *
         */
        img.onerror = () => {
            img.style.display = 'none';
        };

        container.appendChild(img);
    }

    wrapper.appendChild(container);
    return wrapper;
}
