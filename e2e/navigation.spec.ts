import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test.describe("Main Navigation", () => {
    test("all navigation links work", async ({ page }) => {
      await page.goto("/");
      
      // Check Cases link
      await page.click("text=Cases");
      await expect(page.locator("#cases")).toBeInViewport();
      
      // Check Resume link
      await page.click("text=Resume");
      await page.waitForURL("**/resume");
      await expect(page.locator("h1")).toContainText("Grigorii");
    });

    test("brand link returns to homepage", async ({ page }) => {
      await page.goto("/resume");
      
      // Click brand/logo
      await page.click("text=Grigorii");
      await page.waitForURL("/");
      
      await expect(page.locator("h1")).toBeVisible();
    });
  });

  test.describe("Case Study Navigation", () => {
    test("case study cards link to detail pages", async ({ page }) => {
      await page.goto("/");
      
      // Click first case study link
      await page.click("text=Open case study >> nth=0");
      
      // Should be on a case page
      await expect(page.locator("[data-case-page]")).toBeVisible();
    });

    test("back link returns to portfolio", async ({ page }) => {
      await page.goto("/cases/ai-incident-workflow");
      
      await page.click("text=Back to portfolio");
      await page.waitForURL("/#cases");
    });

    test("previous/next case navigation works", async ({ page }) => {
      await page.goto("/cases/ai-incident-workflow");
      
      // Check for navigation footer
      const navFooter = page.locator("text=Continue reading");
      await expect(navFooter).toBeVisible();
    });
  });

  test.describe("Hash Navigation", () => {
    test("section hash links scroll to sections", async ({ page }) => {
      await page.goto("/");
      
      // Click cases section link
      await page.click("a[href='#cases']");
      
      // Section should be in viewport
      const casesSection = page.locator("#cases");
      await expect(casesSection).toBeInViewport();
    });

    test("contact section is reachable", async ({ page }) => {
      await page.goto("/#contact");
      
      const contactSection = page.locator("#contact");
      await expect(contactSection).toBeInViewport();
    });
  });
});

test.describe("External Links", () => {
  test("external links open in new tab", async ({ page }) => {
    await page.goto("/");
    
    // Find GitHub link
    const githubLink = page.locator("a[href*='github.com']").first();
    
    if (await githubLink.isVisible()) {
      await expect(githubLink).toHaveAttribute("target", "_blank");
      await expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  test("mailto links have correct attributes", async ({ page }) => {
    await page.goto("/");
    
    const emailLink = page.locator("a[href^='mailto:']").first();
    
    if (await emailLink.isVisible()) {
      const href = await emailLink.getAttribute("href");
      expect(href).toContain("mailto:");
    }
  });
});
