import { test, expect } from '@playwright/test';

test.describe('Valentine Escape Room Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173/valentine-escape-room/');
  });

  test('should load the entry room', async ({ page }) => {
    await expect(page.locator('text=You\'ve been pulled into the spaces between moments')).toBeVisible();
    await expect(page.locator('input[placeholder*="MM.DD.YYYY"]')).toBeVisible();
  });

  test('should complete the entry room', async ({ page }) => {
    const input = page.locator('input[placeholder*="MM.DD.YYYY"]');
    await input.fill('10.05.2024');
    await page.keyboard.press('Enter');
    
    // Should transition to Room 1
    await expect(page.locator('text=What word do the stalls whisper')).toBeVisible({ timeout: 10000 });
  });

  test('should bypass rooms using localStorage and load Room 6', async ({ page }) => {
    await page.evaluate(() => {
      window.localStorage.setItem('valentine-escape-state', JSON.stringify({
        currentRoom: 6,
        rooms: {
          0: { completed: true },
          1: { completed: true },
          2: { completed: true },
          3: { completed: true },
          4: { completed: true },
          5: { completed: true },
          6: { completed: false }
        },
        totalHintsUsed: 0,
        startTime: Date.now(),
        endTime: null
      }));
    });
    await page.reload();
    
    await expect(page.locator('text=Will you be my Valentine')).toBeVisible();
    await expect(page.locator('button:has-text("YES")')).toBeVisible();
  });
});
