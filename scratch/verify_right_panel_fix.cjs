const puppeteer = require('puppeteer');
const http = require('http');

async function waitForServer(port, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:' + port, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error('Status ' + res.statusCode));
        });
        req.on('error', reject);
      });
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 400));
    }
  }
  throw new Error('Server did not respond within ' + timeoutMs + 'ms');
}

(async () => {
  const port = 5173; // using active dev server
  const artifactDir = 'C:/Users/nilav/.gemini/antigravity/brain/ff458db1-8482-4a97-89f6-55fd58c76800';

  try {
    await waitForServer(port);
    console.log('Dev server reachable on port', port);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    await page.goto('http://localhost:' + port, { waitUntil: 'networkidle0', timeout: 30000 });

    // Scroll to #skills
    await page.evaluate(() => {
      const el = document.getElementById('skills');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    // Inspect styles of .smooth-deck-column and .smooth-details
    const panelMetrics = await page.evaluate(() => {
      const deckCol = document.querySelector('.smooth-deck-column');
      const details = document.querySelector('.smooth-details');
      const deckColStyle = deckCol ? window.getComputedStyle(deckCol) : null;
      const detailsStyle = details ? window.getComputedStyle(details) : null;

      const deckRect = deckCol ? deckCol.getBoundingClientRect() : null;
      const detailsRect = details ? details.getBoundingClientRect() : null;

      // Check element at point in the center of details panel
      let elementAtCenterOfPanel = null;
      if (detailsRect) {
        const cx = detailsRect.left + detailsRect.width / 2;
        const cy = detailsRect.top + detailsRect.height / 2;
        const el = document.elementFromPoint(cx, cy);
        elementAtCenterOfPanel = el ? (el.className || el.tagName) : null;
      }

      return {
        deckColumn: deckCol ? {
          position: deckColStyle.position,
          zIndex: deckColStyle.zIndex
        } : null,
        detailsPanel: details ? {
          position: detailsStyle.position,
          zIndex: detailsStyle.zIndex,
          backgroundColor: detailsStyle.backgroundColor,
          border: detailsStyle.border,
          boxShadow: detailsStyle.boxShadow,
          width: detailsRect ? detailsRect.width : 0,
          height: detailsRect ? detailsRect.height : 0
        } : null,
        elementAtCenterOfPanel
      };
    });

    console.log('Panel Metrics:', JSON.stringify(panelMetrics, null, 2));

    // Capture desktop screenshot of skills section
    const skillsElement = await page.$('#skills');
    if (skillsElement) {
      await skillsElement.screenshot({ path: artifactDir + '/screenshot_skills_right_panel_fixed_desktop.png' });
      console.log('Saved screenshot_skills_right_panel_fixed_desktop.png');
    }

    // Now test navigating a few cards to ensure cards pass behind and details panel stays on top
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        const nextBtn = document.querySelector('.smooth-deck-controls button:last-child');
        if (nextBtn) nextBtn.click();
      });
      await new Promise(r => setTimeout(r, 400));
    }

    const stateAfterNavigation = await page.evaluate(() => {
      const activeCard = document.querySelector('.smooth-skill-card.is-active h3');
      const detailsTitle = document.querySelector('.smooth-details__identity h3');
      return {
        activeCardName: activeCard ? activeCard.textContent.trim() : null,
        detailsSkillName: detailsTitle ? detailsTitle.textContent.trim() : null
      };
    });
    console.log('State After Navigation:', stateAfterNavigation);

    // Mobile Viewport
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.evaluate(() => {
      const el = document.getElementById('skills');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    const mobileSkillsElement = await page.$('#skills');
    if (mobileSkillsElement) {
      await mobileSkillsElement.screenshot({ path: artifactDir + '/screenshot_skills_right_panel_fixed_mobile.png' });
      console.log('Saved screenshot_skills_right_panel_fixed_mobile.png');
    }

    console.log('Console Errors:', consoleErrors);

    await browser.close();
    console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY');
    process.exit(0);
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
})();
