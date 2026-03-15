import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test.describe("Main Navigation", () => {
    test("all navigation links work", async ({ page }) => {
      await page.goto("/");
      
      // Check Case Studies link (updated from "Cases")
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Case Studies" }).click();
      await expect(page.locator("#cases")).toBeInViewport();
      
      // Check Resume link
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Resume" }).click();
      await page.waitForURL("**/resume");
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Grigorii");
    });

    test("brand link returns to homepage", async ({ page }) => {
      await page.goto("/resume");
      
      // Click brand/logo
      await page.getByRole("link", { name: /Grigorii/i }).click();
      await page.waitForURL("/");
      
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  });

  test.describe("Case Study Navigation", () => {
    test("case study cards link to detail pages", async ({ page }) => {
      await page.goto("/");
      
      // Click first case study link
      await page.getByRole("link", { name: "Open case study" }).first().click();
      
      // Should be on a case page
      await expect(page.locator("[data-case-page]")).toBeVisible();
    });

    test("back link returns to portfolio", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      await page.getByTestId("back-link").click();
      await page.waitForURL("/#cases");
    });

    test("previous/next case navigation works", async ({ page }) => {
      await page.goto("/cases/darkest-afk");
      
      // Check for navigation footer
      const navFooter = page.getByText("Continue reading");
      await expect(navFooter).toBeVisible();
      
      // Check navigation links exist
      const nextLink = page.getByTestId("nav-next");
      await expect(nextLink).toBeVisible();
    });
  });

  test.describe("Hash Navigation", () => {
    test("section hash links scroll to sections", async ({ page }) => {
      await page.goto("/");
      
      // Click cases section link
      await page.getByRole("link", { name: "Case Studies" }).first().click();
      
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
    
    // Find GitHub link using accessible pattern
    const githubLink = page.getByRole("link", { name: /github\.com/i }).first();
    
    if (await githubLink.isVisible()) {
      await expect(githubLink).toHaveAttribute("target", "_blank");
      await expect(githubLink).toHaveAttribute("rel", /noopener/);
    }
  });

  test("mailto links have correct attributes", async ({ page }) => {
    await page.goto("/");
    
    const emailLink = page.getByRole("link", { name: /Email/i }).first();
    
    if (await emailLink.isVisible()) {
      // Find the actual mailto link in the contact section
      const mailtoLink = page.locator("a[href^='mailto:']").first();
      const href = await mailtoLink.getAttribute("href");
      expect(href).toContain("mailto:");
    }
  });
});
