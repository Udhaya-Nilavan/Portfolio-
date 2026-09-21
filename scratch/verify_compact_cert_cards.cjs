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
    console.log('Server is reachable on port', port);

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

    // Scroll to #certifications
    await page.evaluate(() => {
      const el = document.getElementById('certifications');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    // 1. Inspect Certifications Grid and Card Metrics on Desktop
    const certMetrics = await page.evaluate(() => {
      const grid = document.querySelector('.smooth-certifications__grid');
      const cards = Array.from(document.querySelectorAll('.smooth-certificate-card'));
      const firstCard = cards[0];
      const firstImgContainer = firstCard ? firstCard.querySelector('.smooth-certificate-image') : null;
      const firstImg = firstCard ? firstCard.querySelector('.smooth-certificate-image img') : null;
      const firstTitle = firstCard ? firstCard.querySelector('.smooth-certificate-content h3') : null;
      const firstIssuer = firstCard ? firstCard.querySelector('.smooth-certificate-issuer') : null;
      const firstButton = firstCard ? firstCard.querySelector('.smooth-certificate-actions button') : null;

      const cardRect = firstCard ? firstCard.getBoundingClientRect() : null;
      const imgContainerRect = firstImgContainer ? firstImgContainer.getBoundingClientRect() : null;
      const imgStyle = firstImg ? window.getComputedStyle(firstImg) : null;
      const titleStyle = firstTitle ? window.getComputedStyle(firstTitle) : null;
      const issuerStyle = firstIssuer ? window.getComputedStyle(firstIssuer) : null;
      const btnRect = firstButton ? firstButton.getBoundingClientRect() : null;

      // Check 2 columns layout
      let isTwoColumns = false;
      if (cards.length >= 2) {
        const r0 = cards[0].getBoundingClientRect();
        const r1 = cards[1].getBoundingClientRect();
        isTwoColumns = Math.abs(r0.top - r1.top) < 10 && r1.left > r0.right;
      }

      return {
        totalCards: cards.length,
        isTwoColumns,
        cardWidth: cardRect ? cardRect.width : 0,
        cardHeight: cardRect ? cardRect.height : 0,
        imgContainerHeight: imgContainerRect ? imgContainerRect.height : 0,
        imgObjectFit: imgStyle ? imgStyle.objectFit : null,
        titleFontSize: titleStyle ? titleStyle.fontSize : null,
        issuerFontSize: issuerStyle ? issuerStyle.fontSize : null,
        btnHeight: btnRect ? btnRect.height : 0,
        titles: cards.map(c => c.querySelector('h3')?.textContent.trim()),
        hasImages: cards.map(c => !!c.querySelector('.smooth-certificate-image img'))
      };
    });

    console.log('Certifications Desktop Metrics:', JSON.stringify(certMetrics, null, 2));

    // Capture desktop screenshot of certifications section
    const certsSection = await page.$('#certifications');
    if (certsSection) {
      await certsSection.screenshot({ path: artifactDir + '/screenshot_certifications_compact_desktop.png' });
      console.log('Saved screenshot_certifications_compact_desktop.png');
    }

    // 2. Test Modal Functionality
    // Click "VIEW CERTIFICATE" on card with image (e.g. card index 2 or 3: iHUB or LPU)
    console.log('\n--- TESTING CERTIFICATE LIGHTBOX MODAL ---');
    await page.evaluate(() => {
      const viewBtns = document.querySelectorAll('.smooth-certificate-actions button.primary');
      if (viewBtns[2]) viewBtns[2].click();
    });
    await new Promise(r => setTimeout(r, 600));

    const modalState = await page.evaluate(() => {
      const modal = document.querySelector('.certificate-modal');
      const img = document.querySelector('.certificate-modal__image-wrap img');
      return {
        isOpen: !!modal,
        hasImage: !!img,
        srcPrefix: img ? img.getAttribute('src')?.slice(0, 30) : null
      };
    });
    console.log('Modal State after VIEW CERTIFICATE click:', modalState);

    await page.screenshot({ path: artifactDir + '/screenshot_cert_modal_compact_open.png' });
    console.log('Saved screenshot_cert_modal_compact_open.png');

    // Test Escape to close
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
    const isModalClosed = await page.evaluate(() => !document.querySelector('.certificate-modal'));
    console.log('Is Modal closed via Escape?:', isModalClosed);

    // 3. Test Mobile Viewport (375px)
    console.log('\n--- TESTING MOBILE VIEWPORT (375px) ---');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.evaluate(() => {
      const el = document.getElementById('certifications');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    const mobileMetrics = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.smooth-certificate-card'));
      const firstCard = cards[0];
      const firstImg = firstCard ? firstCard.querySelector('.smooth-certificate-image') : null;
      const cardRect = firstCard ? firstCard.getBoundingClientRect() : null;
      const imgRect = firstImg ? firstImg.getBoundingClientRect() : null;

      const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
      return {
        cardWidth: cardRect ? cardRect.width : 0,
        imgHeight: imgRect ? imgRect.height : 0,
        hasHorizontalOverflow
      };
    });
    console.log('Mobile Metrics:', mobileMetrics);

    const mobileCertsSection = await page.$('#certifications');
    if (mobileCertsSection) {
      await mobileCertsSection.screenshot({ path: artifactDir + '/screenshot_certifications_compact_mobile.png' });
      console.log('Saved screenshot_certifications_compact_mobile.png');
    }

    // 4. Verify Skills section was untouched
    console.log('\n--- VERIFYING SKILLS SECTION UNTOUCHED ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluate(() => {
      const el = document.getElementById('skills');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    const skillsCheck = await page.evaluate(() => {
      const activeCard = document.querySelector('.smooth-skill-card.is-active h3');
      const detailsTitle = document.querySelector('.smooth-details__identity h3');
      const detailsZIndex = window.getComputedStyle(document.querySelector('.smooth-details')).zIndex;
      return {
        activeCard: activeCard?.textContent.trim(),
        detailsTitle: detailsTitle?.textContent.trim(),
        detailsZIndex
      };
    });
    console.log('Skills Check:', skillsCheck);

    console.log('\nConsole Errors:', consoleErrors);
    await browser.close();
    console.log('VERIFICATION COMPLETE');
    process.exit(0);
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
})();
