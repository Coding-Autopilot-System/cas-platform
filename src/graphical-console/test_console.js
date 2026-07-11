const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('domcontentloaded');
  
  console.log("Clicking Bug Fix Blueprint...");
  await page.locator('text=Bug Fix Blueprint').click();
  
  try {
    await page.waitForSelector('text=Autonomous Bug Fix Workflow', { timeout: 10000 });
    console.log("Found text!");
  } catch (e) {
    console.log("Timeout waiting for text!");
  }
  
  await browser.close();
})();
