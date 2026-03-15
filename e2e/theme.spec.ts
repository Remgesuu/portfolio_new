import { expect, test } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test("toggles between light and dark themes", async ({ page }) => {
    await page.goto("/");
    
    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute("data-theme");
    });
    
    // Click dark theme button
    const darkButton = page.locator("[aria-label='Use dark theme']");
    await darkButton.click();
    
    // Verify theme changed
    const darkTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute("data-theme");
    });
    expect(darkTheme).toBe("dark");
    
    // Click light theme button
    const lightButton = page.locator("[aria-label='Use light theme']");
    await lightButton.click();
    
    // Verify theme changed
    const lightTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute("data-theme");
    });
    expect(lightTheme).toBe("light");
  });

  test("theme persists across page navigation", async ({ page }) => {
    await page.goto("/");
    
    // Set dark theme
    await page.locator("[aria-label='Use dark theme']").click();
    
    // Navigate to resume page
    await page.click("text=Resume");
    await page.waitForURL("**/resume");
    
    // Verify theme is still dark
    const theme = await page.evaluate(() => {
      return document.documentElement.getAttribute("data-theme");
    });
    expect(theme).toBe("dark");
  });

  test("theme toggle shows active state", async ({ page }) => {
    await page.goto("/");
    
    // Click dark theme
    const darkButton = page.locator("[aria-label='Use dark theme']");
    await darkButton.click();
    
    // Verify aria-checked
    await expect(darkButton).toHaveAttribute("aria-checked", "true");
    
    // Other buttons should not be checked
    const lightButton = page.locator("[aria-label='Use light theme']");
    await expect(lightButton).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("Theme Visual Consistency", () => {
  test("light theme has correct background", async ({ page }) => {
    await page.goto("/");
    await page.locator("[aria-label='Use light theme']").click();
    
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    
    // Should be a warm light color (not pure white or dark)
    expect(bgColor).not.toBe("rgb(0, 0, 0)");
    expect(bgColor).not.toBe("rgb(17, 22, 27)");
  });

  test("dark theme has correct background", async ({ page }) => {
    await page.goto("/");
    await page.locator("[aria-label='Use dark theme']").click();
    
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    
    // Should be a dark graphite color
    expect(bgColor).not.toBe("rgb(255, 255, 255)");
  });
});
