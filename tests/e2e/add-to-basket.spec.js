import { test, expect } from "@playwright/test";
import { APPAREL } from "../../commonUtils/selectors.js";

test.describe("Apparel & Shoes - Add products and verify basket", () => {
  test("adds two products and verifies basket subtotal stability", async ({
    page,
  }) => {
    await page.goto("/");
    await page.click(APPAREL.categoryLink);
    await expect(page).toHaveURL(/apparel-shoes/);

    // Set display to 4 per page
    await page.selectOption("#products-pagesize", { label: "4" });
    await page.waitForLoadState("networkidle");
    await page.waitForSelector(APPAREL.productItems);

    const parsePrice = (txt) => Number(txt.replace(/[^0-9.]/g, ""));
    let expectedSubtotal = 0;

    const products = page.locator(APPAREL.productItems);
    const count = await products.count();

    for (let i = 0; i < Math.min(count, 2); i++) {
      const product = products.nth(i);
      const title = (
        await product.locator(APPAREL.productTitle).textContent()
      ).trim();
      const price = parsePrice(
        await product.locator(APPAREL.productPrice).textContent()
      );
      expectedSubtotal += price;

      await product.locator("a").first().click();
      await page.waitForSelector(APPAREL.addToCartButton);

      await page.click(APPAREL.addToCartButton);

      const successBar = page.locator(".bar-notification.success");
      await expect(successBar).toContainText(
        "The product has been added to your shopping cart"
      );

      await page.click(APPAREL.categoryLink);
      await page.waitForLoadState("networkidle");
    }

    // Verify basket subtotal
    await page.click(APPAREL.cartLink);
    await page.waitForLoadState("networkidle");

    const subtotalCell = page
      .locator("tr", { hasText: "Sub-Total:" })
      .locator("td")
      .last();
    const subtotalBefore = parsePrice(
      (await subtotalCell.textContent()).trim()
    );
    expect(subtotalBefore).toBeCloseTo(expectedSubtotal, 2);

    //  Change country
    const countrySelect = page.locator("select#CountryId");
    if ((await countrySelect.count()) > 0) {
      await countrySelect.selectOption({ label: "United Kingdom" });
      await page.waitForLoadState("networkidle");
    }

    // Verify subtotal remains the same
    const subtotalAfter = parsePrice((await subtotalCell.textContent()).trim());
    expect(subtotalAfter).toBe(subtotalBefore);
  });
});

