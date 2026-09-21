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
  const port = 4198;
  const projectRoot = 'C:/Users/nilav/OneDrive/文档/portfolio project/files/personal-portfolio/UDHAYA-NILAVAN-PERSONAL-PORTFOLIO';
  const artifactDir = 'C:/Users/nilav/.gemini/antigravity/brain/ff458db1-8482-4a97-89f6-55fd58c76800';

  console.log('Starting vite preview on port', port);
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

    // 1. Verify #what-i-do is gone
    const whatIDoEl = await page.$('#what-i-do');
    console.log('1. Is #what-i-do present?:', whatIDoEl !== null);

    // 2. Search for kicker and title
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasKicker = bodyText.includes('SYSTEM // CAPABILITIES');
    const hasTitle = bodyText.includes('What I do with data & AI');
    console.log('2. Has kicker text "SYSTEM // CAPABILITIES":', hasKicker);
    console.log('   Has title text "What I do with data & AI":', hasTitle);

    // 3. Inspect section order in main
    const sectionIds = await page.evaluate(() => {
      const main = document.getElementById('main');
      if (!main) return [];
      const sections = Array.from(main.querySelectorAll('section'));
      return sections.map(s => s.id || s.className);
    });
    console.log('3. Sections rendered in <main> in order:', sectionIds);

    // 4. Verify FloatingNav items
    const navItems = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      return links.map(a => ({ href: a.getAttribute('href'), text: a.innerText.trim() }));
    });
    console.log('4. Desktop FloatingNav links:', navItems);

    // 5. Test Skills functionality
    const skillsSection = await page.$('#skills');
    console.log('5. Skills section present:', skillsSection !== null);

    // Check center active card in Skills
    const activeSkillName = await page.evaluate(() => {
      const activeCard = document.querySelector('.phase9c-card-hero h3');
      return activeCard ? activeCard.textContent.trim() : null;
    });
    console.log('   Active skill name:', activeSkillName);

    // Test clicking next skill button
    await page.evaluate(() => {
      const nextBtn = document.querySelector('.phase9c-side-card--right');
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const nextSkillName = await page.evaluate(() => {
      const activeCard = document.querySelector('.phase9c-card-hero h3');
      return activeCard ? activeCard.textContent.trim() : null;
    });
    console.log('   Active skill after clicking Next:', nextSkillName);

    // Test category filter click
    const categoryClicked = await page.evaluate(() => {
      const categories = Array.from(document.querySelectorAll('.phase9c-category'));
      if (categories.length > 2) {
        categories[2].click();
        return categories[2].textContent.trim();
      }
      return null;
    });
    console.log('   Clicked category filter:', categoryClicked);

    await new Promise(r => setTimeout(r, 500));
    const categoryActiveSkill = await page.evaluate(() => {
      const activeCard = document.querySelector('.phase9c-card-hero h3');
      return activeCard ? activeCard.textContent.trim() : null;
    });
    console.log('   Active skill after category switch:', categoryActiveSkill);

    // 6. Test AI assistant presence
    const assistantOrb = await page.evaluate(() => {
      const orbs = document.querySelectorAll('.floating-assistant-container, .floating-ai-assistant, [data-testid="floating-ai-assistant"]');
      return orbs.length;
    });
    console.log('6. Floating AI Assistant instances count:', assistantOrb);

    // 7. Check horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log('7. Horizontal overflow detected?:', hasOverflow);

    // 8. Capture screenshot of About to Skills transition
    await page.evaluate(() => {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 800));
    const screenshotPath = artifactDir + '/screenshot_about_to_skills.png';
    await page.screenshot({ path: screenshotPath });
    console.log('8. Saved About->Skills transition screenshot to:', screenshotPath);

    console.log('9. Console errors count:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('   Console errors:', consoleErrors);
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
