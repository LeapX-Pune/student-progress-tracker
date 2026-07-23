import { calculateProgress } from '../../utils/courseHelpers.js';

export function createProgressBar(completedModules, totalModules, status) {
    const percentage = calculateProgress(completedModules, totalModules);
    
    const section = document.createElement('div');
    section.className = 'course-progress-section';
    
    const header = document.createElement('div');
    header.className = 'course-progress-header';
    
    const label = document.createElement('span');
    label.className = 'course-progress-label';
    label.textContent = 'Progress';
    
    const percentageText = document.createElement('span');
    percentageText.className = 'course-progress-percentage';
    percentageText.textContent = `${percentage}%`;
    
    header.appendChild(label);
    header.appendChild(percentageText);
    
    const container = document.createElement('div');
    container.className = 'course-progress-bar';
    
    const track = document.createElement('div');
    track.className = 'course-progress-bar__track';
    
    const fill = document.createElement('div');
    fill.className = 'course-progress-bar__fill';
    
    if (status === 'completed' || percentage === 100) {
        fill.classList.add('course-progress-bar__fill--completed');
    } else if (status === 'not-started' || percentage === 0) {
        fill.classList.add('course-progress-bar__fill--not-started');
    }
    
    fill.style.width = '0%';
    
    requestAnimationFrame(() => {
        setTimeout(() => {
            fill.style.width = `${percentage}%`;
        }, 50);
    });
    
    track.appendChild(fill);
    container.appendChild(track);
    
    section.appendChild(header);
    section.appendChild(container);
    
    return section;
}
