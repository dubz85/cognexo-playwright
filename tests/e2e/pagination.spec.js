import { test, expect } from '@playwright/test';
import { APPAREL } from '../../commonUtils/selectors.js';

test.describe('Apparel & Shoes - Pagination', () => {
  test('every single product should be different between pages when page size = 4', async ({ page }) => {
    await page.goto('/');
    await page.click(APPAREL.categoryLink);
    await expect(page).toHaveURL(/apparel-shoes/);

    // Set page size to 4
    await page.selectOption('#products-pagesize', { label: '4' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector(APPAREL.productItems);

    // Collect titles on page 1
    const titlesPage1 = await page.locator(APPAREL.productTitle).allTextContents();
    console.log('Page 1 titles:', titlesPage1);
    expect(titlesPage1.length).toBeLessThanOrEqual(4);

    // Navigate to next page (page 2)
    const page2Link = page.locator('.pager a', { hasText: '2' });
    if (await page2Link.count() > 0) {
      await page2Link.first().click();
      await page.waitForLoadState('networkidle');

      const titlesPage2 = await page.locator(APPAREL.productTitle).allTextContents();
      console.log('Page 2 titles:', titlesPage2);
      expect(titlesPage2.length).toBeLessThanOrEqual(4);

      // Check that **all products are different** between page 1 and page 2
      const overlap = titlesPage1.filter(t => titlesPage2.includes(t));
      console.log('Overlapping titles between page 1 and 2:', overlap);

      expect(overlap.length).toBe(0); 
    } else {
      test.skip('Pagination not available for this category');
    }
  });
});

