const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\nilav\\.gemini\\antigravity\\brain\\8a8cd17b-3533-4560-bf3e-b3709e8aa678';

async function verifySite(url, prefix) {
  console.log(`\n========================================`);
  console.log(`Verifying: ${url} (${prefix})`);
  console.log(`========================================`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();

  const viewports = [
    { name: '1440_desktop', width: 1440, height: 900 },
    { name: '1280_desktop', width: 1280, height: 800 },
    { name: '1024_tablet', width: 1024, height: 768 },
    { name: '768_tablet', width: 768, height: 1024 },
    { name: '390_mobile', width: 390, height: 844 },
    { name: '375_mobile', width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
    await new Promise(r => setTimeout(r, 600));

    // Evaluate orb measurements and layout
    const info = await page.evaluate(() => {
      const container = document.querySelector('.floating-ai-container');
      const trigger = document.querySelector('.floating-ai-trigger');
      const stage = document.querySelector('.fai-stage');
      const canvas = document.querySelector('.floating-ai-canvas');
      const fallback = document.querySelector('.fai-fallback');
      const label = document.querySelector('.floating-ai-label');

      const triggerRect = trigger ? trigger.getBoundingClientRect() : null;
      const stageRect = stage ? stage.getBoundingClientRect() : null;
      const labelRect = label ? label.getBoundingClientRect() : null;

      const hasHorizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;

      return {
        hasContainer: !!container,
        hasTrigger: !!trigger,
        hasStage: !!stage,
        hasCanvas: !!canvas,
        hasFallback: !!fallback,
        hasLabel: !!label,
        labelText: label ? label.innerText.trim() : null,
        triggerWidth: triggerRect ? triggerRect.width : null,
        triggerHeight: triggerRect ? triggerRect.height : null,
        stageWidth: stageRect ? stageRect.width : null,
        stageHeight: stageRect ? stageRect.height : null,
        hasHorizontalOverflow,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });

    console.log(`[${vp.name}] Trigger: ${info.triggerWidth}x${info.triggerHeight}, Stage: ${info.stageWidth}x${info.stageHeight}, Overflow: ${info.hasHorizontalOverflow}, Label: "${info.labelText}"`);

    // Capture screenshot of the orb area or full viewport
    const shotPath = path.join(ARTIFACTS_DIR, `${prefix}_${vp.name}_orb.png`);
    await page.screenshot({ path: shotPath });
  }

  // 1440px desktop: Test Hover state
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  await page.hover('.floating-ai-trigger');
  await new Promise(r => setTimeout(r, 400));

  const hoverInfo = await page.evaluate(() => {
    const container = document.querySelector('.floating-ai-container');
    const label = document.querySelector('.floating-ai-label');
    const stage = document.querySelector('.fai-stage');
    const labelStyle = label ? window.getComputedStyle(label) : null;
    return {
      isHoveredContainer: container ? container.classList.contains('floating-ai-container--hovered') : false,
      isHoveredStage: stage ? stage.classList.contains('fai-hovered') : false,
      labelOpacity: labelStyle ? labelStyle.opacity : null,
      labelText: label ? label.textContent.trim() : null,
    };
  });
  console.log(`Hover info:`, hoverInfo);

  const hoverShot = path.join(ARTIFACTS_DIR, `${prefix}_hover_state.png`);
  await page.screenshot({ path: hoverShot });

  // Test Click to Open Chatbot Drawer
  await page.click('.floating-ai-trigger');
  await new Promise(r => setTimeout(r, 600));

  const drawerInfo = await page.evaluate(() => {
    const drawer = document.querySelector('.chatbot-drawer');
    const backdrop = document.querySelector('.chatbot-backdrop');
    const container = document.querySelector('.floating-ai-container');
    return {
      drawerOpen: !!drawer,
      backdropVisible: !!backdrop,
      containerHidden: container ? container.classList.contains('floating-ai-container--hidden') : false,
      ariaExpanded: document.querySelector('.floating-ai-trigger')?.getAttribute('aria-expanded'),
    };
  });
  console.log(`Drawer open info:`, drawerInfo);

  const drawerShot = path.join(ARTIFACTS_DIR, `${prefix}_drawer_open.png`);
  await page.screenshot({ path: drawerShot });

  // Test Esc key to close drawer
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  const closedInfo = await page.evaluate(() => {
    const drawer = document.querySelector('.chatbot-drawer');
    const container = document.querySelector('.floating-ai-container');
    return {
      drawerPresent: !!drawer,
      containerHidden: container ? container.classList.contains('floating-ai-container--hidden') : false,
    };
  });
  console.log(`After Escape info:`, closedInfo);

  await browser.close();
}

async function run() {
  try {
    await verifySite('http://localhost:5173', 'personal');
    await verifySite('http://localhost:5174', 'portfolio2');
    console.log('\nAll browser verifications completed successfully!');
  } catch (err) {
    console.error('Verification error:', err);
    process.exit(1);
  }
}

run();
