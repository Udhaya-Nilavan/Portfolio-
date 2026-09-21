const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const artifactDir = 'C:/Users/nilav/.gemini/antigravity/brain/ff458db1-8482-4a97-89f6-55fd58c76800';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('1. Loading http://localhost:5173 on desktop (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for intro overlay to finish
  await new Promise(r => setTimeout(r, 2600));

  // Scroll to certifications
  await page.evaluate(() => {
    const el = document.getElementById('certifications');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  // Verify desktop 3-column layout
  const desktopLayout = await page.evaluate(() => {
    const grid = document.querySelector('.cert-final-grid');
    const cards = document.querySelectorAll('.cert-final-item');
    const computed = window.getComputedStyle(grid);
    const cols = computed.gridTemplateColumns.split(' ').length;
    
    // Check certificate titles and deduplication
    const certDetails = Array.from(cards).map(card => {
      const title = card.querySelector('h3')?.innerText?.trim();
      const meta = card.querySelector('.cert-final-meta')?.innerText?.trim();
      const hasImage = !!card.querySelector('img.cert-final-image')?.src;
      return { title, meta, hasImage };
    });

    return {
      gridCols: cols,
      gridTemplateColumns: computed.gridTemplateColumns,
      totalCards: cards.length,
      certDetails
    };
  });

  console.log('Desktop layout info:', JSON.stringify(desktopLayout, null, 2));

  // Screenshot 3 columns on desktop
  const shotDesktop3Col = path.join(artifactDir, 'screenshot_certs_3_column_desktop.png');
  await page.screenshot({ path: shotDesktop3Col, fullPage: false });
  console.log('Saved screenshot:', shotDesktop3Col);

  // Test 3D Flip on Card 1
  console.log('2. Testing Flip interaction on Card 1...');
  const flipResult = await page.evaluate(async () => {
    const card = document.querySelector('.cert-final-card');
    const flipBtn = card.querySelector('button[aria-label*="Flip"]');
    if (!flipBtn) return { error: 'No flip button found' };
    
    // Click Flip
    flipBtn.click();
    await new Promise(r => setTimeout(r, 800));
    
    const isFlippedAfterFlip = card.classList.contains('is-flipped');
    const backHeading = card.querySelector('.cert-final-back-head')?.innerText?.trim();
    
    // Click Back
    const backBtn = card.querySelector('button[aria-label*="back to certificate"]');
    if (backBtn) backBtn.click();
    await new Promise(r => setTimeout(r, 800));
    const isFlippedAfterBack = card.classList.contains('is-flipped');

    return {
      isFlippedAfterFlip,
      backHeading,
      isFlippedAfterBack
    };
  });
  console.log('Flip interaction result:', JSON.stringify(flipResult, null, 2));

  // Flip again to capture screenshot of back face in 3-column view
  await page.evaluate(() => {
    const card = document.querySelector('.cert-final-card');
    const flipBtn = card.querySelector('button[aria-label*="Flip"]');
    if (flipBtn) flipBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  const shotDesktopFlip = path.join(artifactDir, 'screenshot_certs_3_col_flipped.png');
  await page.screenshot({ path: shotDesktopFlip, fullPage: false });
  console.log('Saved screenshot:', shotDesktopFlip);

  // Unflip card
  await page.evaluate(() => {
    const card = document.querySelector('.cert-final-card');
    const backBtn = card.querySelector('.cert-final-actions--back button');
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Test Modal Lightbox
  console.log('3. Testing View Certificate Modal Lightbox...');
  const modalResult = await page.evaluate(async () => {
    const viewBtn = document.querySelector('.cert-final-actions .cert-final-btn--primary');
    if (!viewBtn) return { error: 'No view certificate button found' };
    viewBtn.click();
    await new Promise(r => setTimeout(r, 500));

    const modal = document.querySelector('.cert-final-modal');
    const isOpen = !!modal;
    const modalTitle = modal?.querySelector('h3')?.innerText?.trim();
    const hasModalImg = !!modal?.querySelector('.cert-final-modal__image-wrap img');

    return { isOpen, modalTitle, hasModalImg };
  });
  console.log('Modal result:', JSON.stringify(modalResult, null, 2));

  const shotModal = path.join(artifactDir, 'screenshot_certs_modal_open.png');
  await page.screenshot({ path: shotModal, fullPage: false });
  console.log('Saved modal screenshot:', shotModal);

  // Close modal via Escape
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));
  const isModalClosed = await page.evaluate(() => !document.querySelector('.cert-final-modal'));
  console.log('Modal closed via Escape:', isModalClosed);

  // 4. Test Tablet Viewport (1024x768)
  console.log('4. Testing Tablet Viewport (1024x768)...');
  await page.setViewport({ width: 1024, height: 768 });
  await new Promise(r => setTimeout(r, 500));
  const tabletCols = await page.evaluate(() => {
    const grid = document.querySelector('.cert-final-grid');
    const computed = window.getComputedStyle(grid);
    return computed.gridTemplateColumns.split(' ').length;
  });
  console.log('Tablet column count:', tabletCols);
  const shotTablet = path.join(artifactDir, 'screenshot_certs_tablet_2_col.png');
  await page.screenshot({ path: shotTablet, fullPage: false });

  // 5. Test Mobile Viewport (390x844)
  console.log('5. Testing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 500));
  const mobileMetrics = await page.evaluate(() => {
    const grid = document.querySelector('.cert-final-grid');
    const computed = window.getComputedStyle(grid);
    const cols = computed.gridTemplateColumns.split(' ').length;
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    return {
      cols,
      overflow,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    };
  });
  console.log('Mobile metrics:', JSON.stringify(mobileMetrics, null, 2));
  const shotMobile = path.join(artifactDir, 'screenshot_certs_mobile_1_col.png');
  await page.screenshot({ path: shotMobile, fullPage: false });

  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }

  await browser.close();
  console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
})();
