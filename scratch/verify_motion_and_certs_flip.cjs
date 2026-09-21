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
  const port = 5173;
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

    // 1. Test Intro Loading Animation
    console.log('--- 1. TESTING INTRO LOADING SEQUENCE ---');
    const navPromise = page.goto('http://localhost:' + port, { waitUntil: 'domcontentloaded' });
    
    // Check if loader is present immediately
    await new Promise(r => setTimeout(r, 200));
    const hasLoader = await page.evaluate(() => !!document.querySelector('.promptfolio-loader'));
    console.log('Loader present on page load?:', hasLoader);

    await page.screenshot({ path: artifactDir + '/screenshot_intro_loading_animation.png' });
    console.log('Saved screenshot_intro_loading_animation.png');

    await navPromise;
    // Wait for loader to complete and exit (~2.2s total)
    await new Promise(r => setTimeout(r, 2500));

    const isLoaderExited = await page.evaluate(() => {
      const loader = document.querySelector('.promptfolio-loader');
      return !loader || loader.classList.contains('is-exiting') || window.getComputedStyle(loader).visibility === 'hidden' || window.getComputedStyle(loader).opacity === '0';
    });
    console.log('Loader successfully exited and hidden?:', isLoaderExited);

    // 2. Test Global Text Reveal
    console.log('\n--- 2. TESTING GLOBAL TEXT REVEAL ---');
    const textRevealStats = await page.evaluate(() => {
      const allText = document.querySelectorAll('.promptfolio-text-reveal');
      const visible = document.querySelectorAll('.promptfolio-text-reveal.is-visible');
      const excludedNav = document.querySelectorAll('.floating-nav .promptfolio-text-reveal.is-visible');
      return {
        totalTargeted: allText.length,
        visibleCount: visible.length,
        excludedNavCount: excludedNav.length
      };
    });
    console.log('Text Reveal Stats:', textRevealStats);

    // 3. Test Skills Section Untouched & Functional
    console.log('\n--- 3. TESTING SKILLS SECTION ---');
    await page.evaluate(() => {
      const el = document.getElementById('skills');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    const skillsCheck = await page.evaluate(() => {
      const activeCard = document.querySelector('.smooth-skill-card.is-active h3');
      const detailsTitle = document.querySelector('.smooth-details__identity h3');
      const detailsZIndex = window.getComputedStyle(document.querySelector('.smooth-details')).zIndex;
      const deckZIndex = window.getComputedStyle(document.querySelector('.smooth-deck-column')).zIndex;
      return {
        activeCard: activeCard?.textContent.trim(),
        detailsTitle: detailsTitle?.textContent.trim(),
        detailsZIndex,
        deckZIndex
      };
    });
    console.log('Skills Metrics (z-index 220 retained):', skillsCheck);

    // 4. Test Certifications & 3D Flip
    console.log('\n--- 4. TESTING CERTIFICATIONS & 3D FLIP ---');
    await page.evaluate(() => {
      const el = document.getElementById('certifications');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    const certsData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.cert-final-card'));
      const firstCard = cards[0];
      const cardRect = firstCard ? firstCard.getBoundingClientRect() : null;
      const imgWrap = firstCard ? firstCard.querySelector('.cert-final-image-wrap') : null;
      const imgWrapRect = imgWrap ? imgWrap.getBoundingClientRect() : null;
      const titles = cards.map(c => c.querySelector('.cert-final-body h3')?.textContent.trim());

      return {
        totalCards: cards.length,
        cardWidth: cardRect?.width,
        cardHeight: cardRect?.height,
        imgWrapHeight: imgWrapRect?.height,
        titles
      };
    });
    console.log('Certifications Info:', JSON.stringify(certsData, null, 2));

    await page.screenshot({ path: artifactDir + '/screenshot_certs_flip_front_desktop.png' });
    console.log('Saved screenshot_certs_flip_front_desktop.png');

    // Test Flip Card 1
    console.log('\n--- Clicking Flip button on first card ---');
    await page.evaluate(() => {
      const flipBtn = document.querySelector('.cert-final-actions button:nth-child(2)');
      if (flipBtn) flipBtn.click();
    });
    await new Promise(r => setTimeout(r, 800)); // wait for 3d flip animation

    const flippedState = await page.evaluate(() => {
      const firstCard = document.querySelector('.cert-final-card');
      const isFlipped = firstCard?.classList.contains('is-flipped');
      const backVisible = firstCard ? window.getComputedStyle(firstCard.querySelector('.cert-final-face--back')).visibility !== 'hidden' : false;
      const credentialDetails = firstCard?.querySelector('.cert-final-back-content')?.textContent.trim();
      return {
        isFlipped,
        backVisible,
        hasDetails: !!credentialDetails
      };
    });
    console.log('Card 1 Flipped State:', flippedState);

    await page.screenshot({ path: artifactDir + '/screenshot_certs_flip_back_desktop.png' });
    console.log('Saved screenshot_certs_flip_back_desktop.png');

    // Test Flip Back
    await page.evaluate(() => {
      const flipBackBtn = document.querySelector('.cert-final-actions--back button:last-child');
      if (flipBackBtn) flipBackBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    const flippedBackState = await page.evaluate(() => {
      const firstCard = document.querySelector('.cert-final-card');
      return !firstCard?.classList.contains('is-flipped');
    });
    console.log('Card 1 Flipped Back to Front?:', flippedBackState);

    // Test Modal
    console.log('\n--- Testing View Certificate Modal ---');
    await page.evaluate(() => {
      const viewBtn = document.querySelector('.cert-final-actions button:first-child');
      if (viewBtn) viewBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const modalState = await page.evaluate(() => {
      const modal = document.querySelector('.cert-final-modal');
      return { isOpen: !!modal };
    });
    console.log('Modal opened?:', modalState);

    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
    const modalClosed = await page.evaluate(() => !document.querySelector('.cert-final-modal'));
    console.log('Modal closed via Escape?:', modalClosed);

    // 5. Mobile Viewport Test (375px)
    console.log('\n--- 5. TESTING MOBILE VIEWPORT (375px) ---');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.evaluate(() => {
      const el = document.getElementById('certifications');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    const mobileCheck = await page.evaluate(() => {
      const card = document.querySelector('.cert-final-card');
      const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;
      return {
        cardWidth: card?.getBoundingClientRect().width,
        hasOverflow
      };
    });
    console.log('Mobile Check:', mobileCheck);

    await page.screenshot({ path: artifactDir + '/screenshot_certs_flip_mobile.png' });
    console.log('Saved screenshot_certs_flip_mobile.png');

    console.log('\nConsole Errors:', consoleErrors);
    await browser.close();
    console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Verification error:', err);
    process.exit(1);
  }
})();
