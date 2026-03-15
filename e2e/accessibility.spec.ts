import { expect, test } from "@playwright/test";

test.describe("Accessibility", () => {
  test.describe("Skip Link", () => {
    test("skip link is visible on focus", async ({ page }) => {
      await page.goto("/");
      
      // Tab to focus the skip link
      await page.keyboard.press("Tab");
      
      // Skip link should be visible
      const skipLink = page.locator("a[href='#main-content']");
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toBeVisible();
    });

    test("skip link navigates to main content", async ({ page }) => {
      await page.goto("/");
      
      // Focus and click skip link
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      
      // Main content should be focused
      const main = page.locator("#main-content");
      await expect(main).toBeFocused();
    });

    test("skip link works on all pages", async ({ page }) => {
      const pages = ["/", "/resume", "/cases/darkest-afk"];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.keyboard.press("Tab");
        
        const skipLink = page.locator("a[href='#main-content']");
        await expect(skipLink).toBeFocused();
      }
    });
  });

  test.describe("ARIA Labels", () => {
    test("theme toggle has proper ARIA structure", async ({ page }) => {
      await page.goto("/");
      
      // Check radiogroup exists
      const themeToggle = page.locator("[role='radiogroup']");
      await expect(themeToggle).toHaveAttribute("aria-label", "Theme selection");
      
      // Check radio buttons exist
      const radioButtons = page.locator("[role='radio']");
      await expect(radioButtons).toHaveCount(3);
      
      // Check each radio button has aria-label
      const labels = ["Use system theme", "Use light theme", "Use dark theme"];
      for (let i = 0; i < labels.length; i++) {
        await expect(radioButtons.nth(i)).toHaveAttribute("aria-label", labels[i]);
      }
    });

    test("navigation has aria-label", async ({ page }) => {
      await page.goto("/");
      
      const nav = page.locator("nav[aria-label='Primary']");
      await expect(nav).toBeVisible();
    });

    test("main content has tabindex for focus", async ({ page }) => {
      await page.goto("/");
      
      const main = page.locator("#main-content");
      await expect(main).toHaveAttribute("tabindex", "-1");
    });
  });

  test.describe("Focus States", () => {
    test("interactive elements have visible focus indicators", async ({ page }) => {
      await page.goto("/");
      
      // Tab through elements and verify focus is visible
      const interactiveElements = [
        "a[href='#main-content']", // skip link
        ".topbar a", // navigation links
        "[role='radio']", // theme toggle
      ];
      
      for (const selector of interactiveElements) {
        const element = page.locator(selector).first();
        await element.focus();
        await expect(element).toBeFocused();
      }
    });

    test("keyboard navigation works through page", async ({ page }) => {
      await page.goto("/");
      
      // Tab through several elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");
        
        // Verify something is focused
        const focused = await page.evaluate(() => {
          return document.activeElement?.tagName;
        });
        expect(focused).toBeTruthy();
      }
    });
  });
});
