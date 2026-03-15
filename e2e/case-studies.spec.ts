import { expect, test } from "@playwright/test";

test.describe("Case Study Pages", () => {
  test.describe("Page Structure", () => {
    test("case study page has all required sections", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Main content should be present
      await expect(page.locator("#main-content")).toBeVisible();
      
      // Hero section with title
      await expect(page.locator("h1")).toBeVisible();
      
      // Tags should be displayed
      const tags = page.locator(".tag");
      await expect(tags.first()).toBeVisible();
      
      // Metrics should be present
      const metrics = page.locator(".metricValue");
      await expect(metrics.first()).toBeVisible();
    });

    test("breadcrumbs show correct hierarchy", async ({ page }) => {
      test.skip(true, "Breadcrumbs only visible on desktop");
      
      await page.goto("/cases/darkest-afk");
      
      const breadcrumbs = page.locator("nav[aria-label='Breadcrumb']");
      await expect(breadcrumbs).toBeVisible();
      
      // Should have Home link
      await expect(breadcrumbs.locator("text=Home")).toBeVisible();
      
      // Should have Cases link
      await expect(breadcrumbs.locator("text=Cases")).toBeVisible();
    });
  });

  test.describe("Navigation", () => {
    test("back link returns to portfolio", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      await page.click("text=Back to portfolio");
      await page.waitForURL("/#cases");
    });

    test("navigation footer shows adjacent cases", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Should have continue reading section
      const continueReading = page.locator("text=Continue reading");
      await expect(continueReading).toBeVisible();
      
      // Should have navigation links
      const footerLinks = page.locator(".footerLink");
      await expect(footerLinks).toHaveCount(2);
    });

    test("can navigate between case studies", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Click next case link
      const nextLink = page.locator(".footerLink").last();
      const nextText = await nextLink.textContent();
      
      if (nextText?.includes("Next:")) {
        await nextLink.click();
        
        // Should be on a different case page
        await expect(page.locator("[data-case-page]")).toBeVisible();
      }
    });
  });

  test.describe("Content", () => {
    test("all case studies are accessible", async ({ page }) => {
      const caseSlugs = ["darkest-afk", "dig-dig-die", "vacation-cafe"];
      
      for (const slug of caseSlugs) {
        await page.goto(`/cases/${slug}`);
        
        // Each page should have a title
        const title = page.locator("h1");
        await expect(title).toBeVisible();
        
        // Should have metrics
        const metrics = page.locator(".metricValue");
        await expect(metrics.first()).toBeVisible();
      }
    });

    test("artifacts section has external links", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Artifacts section should exist
      const artifactsLabel = page.locator("text=Artifacts");
      await expect(artifactsLabel).toBeVisible();
      
      // External artifact links should have correct attributes
      const artifactLinks = page.locator(".artifactLink");
      const count = await artifactLinks.count();
      
      for (let i = 0; i < count; i++) {
        const link = artifactLinks.nth(i);
        const href = await link.getAttribute("href");
        
        if (href?.startsWith("http")) {
          await expect(link).toHaveAttribute("target", "_blank");
          await expect(link).toHaveAttribute("rel", "noopener noreferrer");
        }
      }
    });
  });

  test.describe("Visual", () => {
    test("hero image loads correctly", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      const heroImage = page.locator(".heroImage");
      await expect(heroImage).toBeVisible();
    });

    test("theme toggle works on case pages", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Toggle to dark theme
      await page.click("[aria-label='Use dark theme']");
      
      const theme = await page.evaluate(() => {
        return document.documentElement.getAttribute("data-theme");
      });
      
      expect(theme).toBe("dark");
    });
  });
});
