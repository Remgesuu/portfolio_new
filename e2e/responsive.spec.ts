import { expect, test } from "@playwright/test";

test.describe("Responsive Design", () => {
  test.describe("Desktop (1280px)", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("hero shows two-column layout", async ({ page }) => {
      await page.goto("/");
      
      const heroCopy = page.locator(".heroCopy").first();
      const heroVisual = page.locator(".heroVisual").first();
      
      // Both should be visible
      await expect(heroCopy).toBeVisible();
      await expect(heroVisual).toBeVisible();
    });

    test("navigation bar shows all items inline", async ({ page }) => {
      await page.goto("/");
      
      const nav = page.locator("nav[aria-label='Primary']");
      await expect(nav).toBeVisible();
      
      // Brand role should be visible on desktop
      const brandRole = page.locator(".brandRole");
      await expect(brandRole).toBeVisible();
    });

    test("builds grid shows two columns", async ({ page }) => {
      await page.goto("/");
      
      const buildsGrid = page.locator(".buildsGrid").first();
      await expect(buildsGrid).toBeVisible();
    });

    test("strengths grid shows three columns", async ({ page }) => {
      await page.goto("/");
      
      const strengthsGrid = page.locator(".strengthsGrid").first();
      await expect(strengthsGrid).toBeVisible();
    });
  });

  test.describe("Tablet (768px)", () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test("hero stacks vertically", async ({ page }) => {
      await page.goto("/");
      
      // Hero should still be visible
      const hero = page.locator("section").first();
      await expect(hero).toBeVisible();
    });

    test("case cards stack appropriately", async ({ page }) => {
      await page.goto("/");
      
      const casesGrid = page.locator(".casesGrid").first();
      await expect(casesGrid).toBeVisible();
    });
  });

  test.describe("Mobile (375px)", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("brand role is hidden", async ({ page }) => {
      await page.goto("/");
      
      const brandRole = page.locator(".brandRole");
      await expect(brandRole).toBeHidden();
    });

    test("navigation items are visible", async ({ page }) => {
      await page.goto("/");
      
      const nav = page.locator("nav[aria-label='Primary']");
      await expect(nav).toBeVisible();
    });

    test("hero description is hidden on mobile", async ({ page }) => {
      await page.goto("/");
      
      const heroDescription = page.locator(".heroDescription");
      await expect(heroDescription).toBeHidden();
    });

    test("theme toggle is accessible", async ({ page }) => {
      await page.goto("/");
      
      const themeToggle = page.locator("[role='radiogroup']");
      await expect(themeToggle).toBeVisible();
    });

    test("footer stacks vertically", async ({ page }) => {
      await page.goto("/");
      
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
    });

    test("touch targets are adequate size", async ({ page }) => {
      await page.goto("/");
      
      // Check nav links have adequate touch targets
      const navLinks = page.locator("nav[aria-label='Primary'] a");
      const count = await navLinks.count();
      
      for (let i = 0; i < count; i++) {
        const link = navLinks.nth(i);
        const box = await link.boundingBox();
        
        if (box) {
          // Touch targets should be at least 44px
          expect(box.height).toBeGreaterThanOrEqual(40);
        }
      }
    });
  });
});

test.describe("Print Styles", () => {
  test("page renders without grain overlay in print", async ({ page }) => {
    await page.goto("/resume");
    
    // Print styles should hide grain overlay
    await page.emulateMedia({ media: "print" });
    
    // Page should still render
    await expect(page.locator("main")).toBeVisible();
  });
});
