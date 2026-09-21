const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
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
  const port = 4195;
  const projectRoot = 'C:/Users/nilav/OneDrive/文档/portfolio project/files/personal-portfolio/UDHAYA-NILAVAN-PERSONAL-PORTFOLIO';
  const artifactDir = 'C:/Users/nilav/.gemini/antigravity/brain/ff458db1-8482-4a97-89f6-55fd58c76800';

  console.log('Starting preview server on port', port);
  const server = spawn('cmd.exe', ['/c', 'npx vite preview --port ' + port], {
    cwd: projectRoot,
    stdio: 'pipe'
  });

  server.stdout.on('data', d => console.log('[Server]', d.toString().trim()));
  server.stderr.on('data', d => console.error('[Server Error]', d.toString().trim()));

  try {
    await waitForServer(port);
    console.log('Preview server ready! Launching Puppeteer...');

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

    // 1. Verify section flow
    const sectionIds = await page.evaluate(() => {
      const main = document.getElementById('main');
      if (!main) return [];
      return Array.from(main.querySelectorAll('section')).map(s => s.id || s.className);
    });
    console.log('1. Sections in <main>:', sectionIds);

    // 2. Test Skills Section
    console.log('\n--- TESTING SKILLS SECTION ---');
    await page.evaluate(() => {
      const el = document.getElementById('skills');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    // Check active card name and total cards rendered in deck
    const skillsDeckInfo = await page.evaluate(() => {
      const cards = document.querySelectorAll('.smooth-skill-card');
      const activeCard = document.querySelector('.smooth-skill-card.is-active h3');
      const activeCategory = document.querySelector('.smooth-skill-card.is-active .smooth-card-category');
      const detailsTitle = document.querySelector('.smooth-details__identity h3');
      return {
        totalCardsInDeck: cards.length,
        activeCardName: activeCard ? activeCard.textContent.trim() : null,
        activeCategoryName: activeCategory ? activeCategory.textContent.trim() : null,
        detailsSkillName: detailsTitle ? detailsTitle.textContent.trim() : null
      };
    });
    console.log('2. Skills Deck Info:', skillsDeckInfo);

    // Test clicking Next button
    await page.evaluate(() => {
      const nextBtn = document.querySelector('.smooth-deck-controls button:last-child');
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const skillAfterNext = await page.evaluate(() => {
      const activeCard = document.querySelector('.smooth-skill-card.is-active h3');
      const progress = document.querySelector('.smooth-deck-progress span');
      return {
        name: activeCard ? activeCard.textContent.trim() : null,
        progress: progress ? progress.textContent.trim() : null
      };
    });
    console.log('3. After Next Button click:', skillAfterNext);

    // Test clicking Previous button
    await page.evaluate(() => {
      const prevBtn = document.querySelector('.smooth-deck-controls button:first-child');
      if (prevBtn) prevBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const skillAfterPrev = await page.evaluate(() => {
      const activeCard = document.querySelector('.smooth-skill-card.is-active h3');
      return activeCard ? activeCard.textContent.trim() : null;
    });
    console.log('4. After Prev Button click (should be back to initial):', skillAfterPrev);

    // Test Category filter switch (e.g. Machine Learning)
    const categorySwitch = await page.evaluate(() => {
      const catButtons = Array.from(document.querySelectorAll('.smooth-category'));
      const mlBtn = catButtons.find(b => b.textContent.includes('Machine Learning'));
      if (mlBtn) {
        mlBtn.click();
        return mlBtn.textContent.trim();
      }
      return null;
    });
    await new Promise(r => setTimeout(r, 600));

    const deckAfterCategory = await page.evaluate((cs) => {
      const cards = document.querySelectorAll('.smooth-skill-card');
      const activeCard = document.querySelector('.smooth-skill-card.is-active h3');
      const progress = document.querySelector('.smooth-deck-progress span');
      return {
        clickedCategory: cs,
        cardsInDeck: cards.length,
        activeCard: activeCard ? activeCard.textContent.trim() : null,
        progress: progress ? progress.textContent.trim() : null
      };
    }, categorySwitch);
    console.log('5. After Category Filter switch:', deckAfterCategory);

    // Switch back to "All skills"
    await page.evaluate(() => {
      const allBtn = document.querySelector('.smooth-category');
      if (allBtn) allBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture desktop Skills screenshot
    await page.screenshot({ path: artifactDir + '/screenshot_smooth_skills_desktop.png' });
    console.log('Saved screenshot_smooth_skills_desktop.png');

    // 3. Test Certifications Section
    console.log('\n--- TESTING CERTIFICATIONS SECTION ---');
    await page.evaluate(() => {
      const el = document.getElementById('certifications');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    const certsInfo = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.smooth-certificate-card'));
      return cards.map(c => {
        const title = c.querySelector('h3')?.textContent.trim();
        const issuer = c.querySelector('.smooth-certificate-issuer')?.textContent.trim();
        const img = c.querySelector('img');
        return {
          title,
          issuer,
          hasImage: img !== null,
          imgSrcPrefix: img ? img.getAttribute('src')?.slice(0, 30) : null
        };
      });
    });
    console.log('6. Certifications rendered:', certsInfo);

    // Test opening certificate modal (image view)
    await page.evaluate(() => {
      const viewButtons = document.querySelectorAll('.smooth-certificate-actions button.primary');
      if (viewButtons.length > 0) viewButtons[viewButtons.length - 1].click(); // click LPU or last
    });
    await new Promise(r => setTimeout(r, 600));

    const modalState = await page.evaluate(() => {
      const modal = document.querySelector('.certificate-modal');
      const img = modal?.querySelector('.certificate-modal__image-wrap img');
      return {
        isModalOpen: modal !== null,
        hasImage: img !== null,
        imgSrcPrefix: img ? img.getAttribute('src')?.slice(0, 30) : null
      };
    });
    console.log('7. Certificate Modal (Image mode):', modalState);

    // Capture Certificate Modal screenshot
    await page.screenshot({ path: artifactDir + '/screenshot_cert_modal_open.png' });
    console.log('Saved screenshot_cert_modal_open.png');

    // Test closing modal via Escape key
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
    const modalAfterEsc = await page.evaluate(() => document.querySelector('.certificate-modal') !== null);
    console.log('8. Is modal closed after Escape key?:', !modalAfterEsc);

    // Capture desktop Certifications screenshot
    await page.screenshot({ path: artifactDir + '/screenshot_smooth_certifications_desktop.png' });
    console.log('Saved screenshot_smooth_certifications_desktop.png');

    // 4. Test Mobile Viewport (375px)
    console.log('\n--- TESTING MOBILE VIEWPORT (375px) ---');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.evaluate(() => {
      const el = document.getElementById('skills');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log('9. Mobile horizontal overflow detected?:', mobileOverflow);

    await page.screenshot({ path: artifactDir + '/screenshot_smooth_skills_mobile.png' });
    console.log('Saved screenshot_smooth_skills_mobile.png');

    // Scroll to mobile Certifications
    await page.evaluate(() => {
      const el = document.getElementById('certifications');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: artifactDir + '/screenshot_smooth_certs_mobile.png' });
    console.log('Saved screenshot_smooth_certs_mobile.png');

    console.log('\n--- CONSOLE ERRORS ---');
    console.log('Console errors count:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }

    await browser.close();
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    try {
      process.kill(-server.pid);
    } catch (e) {
      server.kill();
    }
    console.log('Preview server terminated.');
  }
})();
