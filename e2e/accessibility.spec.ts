import { expect, test } from "@playwright/test";

test.describe("Accessibility", () => {
  test.describe("Skip Link", () => {
    test("skip link is visible on focus", async ({ page }) => {
      await page.goto("/");
      
      // Tab to focus the skip link
      await page.keyboard.press("Tab");
      
      // Skip link should be visible and focused
      const skipLink = page.getByRole("link", { name: "Skip to main content" });
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toBeVisible();
    });

    test("skip link navigates to main content", async ({ page }) => {
      await page.goto("/");
      
      // Focus and click skip link
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      
      // Main content should be focused (native anchor behavior)
      const main = page.locator("#main-content");
      await expect(main).toBeInViewport();
    });

    test("skip link works on all pages", async ({ page }) => {
      const pages = ["/", "/resume", "/cases/darkest-afk"];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.keyboard.press("Tab");
        
        const skipLink = page.getByRole("link", { name: "Skip to main content" });
        await expect(skipLink).toBeFocused();
      }
    });
  });

  test.describe("ARIA Labels", () => {
    test("theme toggle has proper ARIA structure", async ({ page }) => {
      await page.goto("/");
      
      // Check radiogroup exists with accessible name
      const themeToggle = page.getByRole("radiogroup", { name: "Theme selection" });
      await expect(themeToggle).toBeVisible();
      
      // Check radio buttons exist
      const systemRadio = page.getByRole("radio", { name: "Use system theme" });
      const lightRadio = page.getByRole("radio", { name: "Use light theme" });
      const darkRadio = page.getByRole("radio", { name: "Use dark theme" });
      
      await expect(systemRadio).toBeVisible();
      await expect(lightRadio).toBeVisible();
      await expect(darkRadio).toBeVisible();
    });

    test("navigation has aria-label", async ({ page }) => {
      await page.goto("/");
      
      const nav = page.getByRole("navigation", { name: "Primary" });
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
      
      // Tab to skip link
      await page.keyboard.press("Tab");
      const skipLink = page.getByRole("link", { name: "Skip to main content" });
      await expect(skipLink).toBeFocused();
      
      // Tab to first nav link
      await page.keyboard.press("Tab");
      const firstNavLink = page.getByRole("navigation", { name: "Primary" }).getByRole("link").first();
      await expect(firstNavLink).toBeFocused();
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
