import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const logs = [];
page.on('console', msg => logs.push({ t: msg.type(), text: msg.text().substring(0, 200) }));
page.on('pageerror', e => logs.push({ t: 'pageerror', text: e.message.substring(0, 200) }));

await page.goto('http://localhost:4173/');
await page.waitForTimeout(3000);

console.log('=== DEVELOP BRANCH UI ===');
console.log('URL:', page.url());
console.log('Title:', await page.title());

// Screenshot initial state
await page.screenshot({ path: '/tmp/develop-initial.png', fullPage: true });

// Get visible elements
const text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
console.log('\n=== PAGE TEXT ===');
console.log(text);

// Check containers
const containers = await page.evaluate(() => ({
    hasAuthRoot: !!document.getElementById('auth-root'),
    authRootDisplay: document.getElementById('auth-root')?.style.display,
    hasAppShell: !!document.querySelector('.app-shell'),
    appShellDisplay: document.querySelector('.app-shell')?.style.display,
    hasSidebar: !!document.querySelector('.sidebar'),
    sidebarVisible: document.querySelector('.sidebar')?.offsetParent !== null,
    hasPageContent: !!document.querySelector('[data-page-content]'),
    pageContentHTML: document.querySelector('[data-page-content]')?.innerHTML?.substring(0, 150),
}));
console.log('\n=== CONTAINERS ===');
for (const [k, v] of Object.entries(containers)) console.log(`  ${k}: ${v}`);

// Check visible buttons
const visButtons = await page.evaluate(() => {
    return [...document.querySelectorAll('button, a, input')]
        .filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && el.offsetParent !== null;
        })
        .map(el => ({
            tag: el.tagName,
            text: el.textContent.trim().substring(0, 40),
            id: el.id || el.name || '',
        }));
});
console.log('\n=== VISIBLE INTERACTIVE ELEMENTS ===');
for (const b of visButtons) console.log(`  [${b.tag}] "${b.text}"`);

// Check auth state
const authState = await page.evaluate(() => ({
    token: !!localStorage.getItem('student_tracker_auth'),
    keys: Object.keys(localStorage),
}));
console.log('\n=== AUTH STATE ===');
console.log('  Token:', authState.token);
console.log('  Keys:', authState.keys);

// Try to navigate to overview
await page.evaluate(() => {
    window.location.hash = '#/overview';
});
await page.waitForTimeout(1500);
console.log('\n=== AFTER NAV TO #/OVERVIEW ===');
console.log('URL:', page.url());
const overviewContent = await page.evaluate(() =>
    document.querySelector('[data-page-content]')?.innerHTML?.substring(0, 200)
);
console.log('Content:', overviewContent);

// Try students
await page.evaluate(() => {
    window.location.hash = '#/students';
});
await page.waitForTimeout(1000);
console.log('\n=== AFTER NAV TO #/STUDENTS ===');
console.log('URL:', page.url());
const studentsContent = await page.evaluate(() =>
    document.querySelector('[data-page-content]')?.innerHTML?.substring(0, 200)
);
console.log('Content:', studentsContent);

// Print any errors
const errors = logs.filter(l => l.t === 'error' || l.t === 'pageerror');
if (errors.length) {
    console.log('\n=== ERRORS ===');
    errors.forEach(e => console.log(`  [${e.t}] ${e.text.substring(0, 150)}`));
}

await page.screenshot({ path: '/tmp/develop-final.png', fullPage: true });
await browser.close();
console.log('\nDone');
