// Dashboard theme synchronization
/**
 *
 */
function applyTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

// Initial application
applyTheme();

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded');
    applyTheme();
});
