const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: '/tmp/room0-screenshot.png', fullPage: false });
  console.log('Screenshot 1 saved to /tmp/room0-screenshot.png');
  
  await page.waitForTimeout(5000);
  await page.screenshot({ path: '/tmp/room0-typewriter.png', fullPage: false });
  console.log('Screenshot 2 saved to /tmp/room0-typewriter.png');
  
  await browser.close();
})();
