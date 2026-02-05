import { chromium } from 'playwright';

(async () => {
  console.log('Starting verification flow...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // ROOM 0
    console.log('Navigating to Room 0...');
    await page.goto('http://localhost:5173');
    await page.waitForSelector('input[placeholder="Enter date (MM.DD.YYYY)"]');
    await page.screenshot({ path: 'verification-room0.png' });
    console.log('Room 0 verified.');

    // Solve Room 0
    await page.fill('input[placeholder="Enter date (MM.DD.YYYY)"]', '10.05.2024');
    await page.press('input[placeholder="Enter date (MM.DD.YYYY)"]', 'Enter');
    
    // ROOM 1
    console.log('Transitioning to Room 1...');
    // Wait for Room 1 input (might take 4s transition)
    await page.waitForSelector('input[placeholder="Enter the word..."]', { timeout: 10000 });
    await page.screenshot({ path: 'verification-room1.png' });
    console.log('Room 1 verified.');

    // Solve Room 1
    await page.fill('input[placeholder="Enter the word..."]', 'Ristora');
    await page.press('input[placeholder="Enter the word..."]', 'Enter');

    // ROOM 2
    console.log('Transitioning to Room 2...');
    // Wait for "Nash Photos" text or specific Room 2 element
    await page.waitForSelector('.Room2_room2__gY2kP', { timeout: 10000 }).catch(() => {
        // If class name is hashed/module, try searching for text
        return page.waitForSelector('text=Nash Photos', { timeout: 10000 });
    });
    
    // Allow a moment for images to render
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verification-room2.png' });
    console.log('Room 2 verified.');

    console.log('SUCCESS: Flow Room 0 -> Room 2 complete.');
  } catch (error) {
    console.error('FAILED:', error);
    await page.screenshot({ path: 'verification-failed.png' });
  } finally {
    await browser.close();
  }
})();
