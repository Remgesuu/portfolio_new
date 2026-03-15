import { expect, test } from "@playwright/test";

test.describe("Case Study Pages", () => {
  test.describe("Page Structure", () => {
    test("case study page has all required sections", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Main content should be present
      await expect(page.locator("#main-content")).toBeVisible();
      
      // Hero section with title
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      
      // Tags should be displayed
      const tags = page.getByTestId("case-tag");
      await expect(tags.first()).toBeVisible();
      
      // Metrics should be present
      const metrics = page.getByTestId("metric-value");
      await expect(metrics.first()).toBeVisible();
    });

    test("breadcrumbs show correct hierarchy", async ({ page }) => {
      test.skip(true, "Breadcrumbs only visible on desktop");
      
      await page.goto("/cases/darkest-afk");
      
      const breadcrumbs = page.getByRole("navigation", { name: "Breadcrumb" });
      await expect(breadcrumbs).toBeVisible();
      
      // Should have Home link
      await expect(breadcrumbs.getByRole("link", { name: "Home" })).toBeVisible();
      
      // Should have Cases link
      await expect(breadcrumbs.getByRole("link", { name: "Cases" })).toBeVisible();
    });
  });

  test.describe("Navigation", () => {
    test("back link returns to portfolio", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      await page.getByTestId("back-link").click();
      await page.waitForURL("/#cases");
    });

    test("navigation footer shows adjacent cases", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Should have continue reading section
      const continueReading = page.getByText("Continue reading");
      await expect(continueReading).toBeVisible();
      
      // Should have navigation links (previous and next)
      const prevLink = page.getByTestId("nav-previous");
      const nextLink = page.getByTestId("nav-next");
      await expect(prevLink).toBeVisible();
      await expect(nextLink).toBeVisible();
    });

    test("can navigate between case studies", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Click next case link
      const nextLink = page.getByTestId("nav-next");
      await nextLink.click();
      
      // Should be on a different case page
      await expect(page.locator("[data-case-page]")).toBeVisible();
      await expect(page).not.toHaveURL("/cases/darkest-afk");
    });
  });

  test.describe("Content", () => {
    test("all case studies are accessible", async ({ page }) => {
      const caseSlugs = ["darkest-afk", "dig-dig-die", "vacation-cafe"];
      
      for (const slug of caseSlugs) {
        await page.goto(`/cases/${slug}`);
        
        // Each page should have a title
        const title = page.getByRole("heading", { level: 1 });
        await expect(title).toBeVisible();
        
        // Should have metrics
        const metrics = page.getByTestId("metric-value");
        await expect(metrics.first()).toBeVisible();
      }
    });

    test("artifacts section has external links", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Artifacts section should exist
      const artifactsLabel = page.getByText("Artifacts");
      await expect(artifactsLabel).toBeVisible();
      
      // External artifact links should have correct attributes
      const artifactLinks = page.getByTestId("artifact-link");
      const count = await artifactLinks.count();
      
      for (let i = 0; i < count; i++) {
        const link = artifactLinks.nth(i);
        const href = await link.getAttribute("href");
        
        if (href?.startsWith("http")) {
          await expect(link).toHaveAttribute("target", "_blank");
          await expect(link).toHaveAttribute("rel", /noopener/);
        }
      }
    });
  });

  test.describe("Visual", () => {
    test("hero image loads correctly", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      const heroImage = page.getByTestId("hero-image");
      await expect(heroImage).toBeVisible();
    });

    test("theme toggle works on case pages", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Toggle to dark theme using accessible name
      await page.getByRole("radio", { name: "Use dark theme" }).click();
      
      const theme = await page.evaluate(() => {
        return document.documentElement.getAttribute("data-theme");
      });
      
      expect(theme).toBe("dark");
    });
  });
});
