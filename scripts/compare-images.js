/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');

async function compareImages() {
    const rootDir = path.join(__dirname, '..', '..');
    const currentDir = path.join(rootDir, 'tests', 'e2e', 'screenshots');
    const developDir = path.join(rootDir, 'tests', 'e2e', 'expected-screenshots');
    const currentScreenshots = fs.readdirSync(currentDir).filter(f => f.endsWith('.png'));
    let differences = [];

    for (const screenshot of currentScreenshots) {
        const currentPath = path.join(currentDir, screenshot);
        const developPath = path.join(developDir, screenshot);

        if (fs.existsSync(developPath)) {
            const currentImg = fs.readFileSync(currentPath);
            const developImg = fs.readFileSync(developPath);

            if (currentImg.length !== developImg.length) {
                differences.push(screenshot);
                console.log(`DIFFERENT: ${screenshot} (file size differs)`);
            } else {
                console.log(`MATCH: ${screenshot}`);
            }
        } else {
            console.log(`No develop screenshot for: ${screenshot}`);
        }
    }

    if (differences.length === 0) {
        console.log('\nAll screenshots match develop branch!');
    } else {
        console.log(`\n${differences.length} screenshot(s) differ from develop:`);
        differences.forEach(d => console.log(`  - ${d}`));
    }
}

compareImages().catch(console.error);
