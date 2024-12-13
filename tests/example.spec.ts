import { test, expect } from '@playwright/test';

test('Verify search works', async ({ page }) => {
  test.setTimeout(60000); // My connection is slow :(
  // Goto site
  await page.goto('https://onlinelibrary.wiley.com');
  // Enter input (fill() didn't work for me)
  await page.locator('#searchField1').pressSequentially('Quality Engineering');
  await Promise.all([
    page.waitForNavigation(), // Waits for the navigation to complete
    await page.click('button[title="Search"]')
  ]);
  await page.waitForURL('**/doSearch?AllField=Quality+Engineering');
  // Couldn't test further due to human user checks of the site
  await expect(page.locator(`text=results for "Quality Engineering" anywhere`)).toBeVisible(); 
});

test('Verify subjects list can expand', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto("https://onlinelibrary.wiley.com"); // Goto page
  let medicine = await page.locator(`//*[@id="accordionHeader-12"]`); // Locate Medicine from Subjects
  await medicine.scrollIntoViewIfNeeded(); // Scroll to that
  await medicine.click(); // Open
  await expect(page.locator("text=Emergency Medicine")).toBeVisible(); // Check opened correctly and content inside is shown

});

test('Verify advanced search works', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('https://onlinelibrary.wiley.com/search/advanced');  // Goto advanced search page
  await page.getByLabel('Context for search term 1').selectOption('Title'); // Select title
  // await page.getByLabel('Search Term  1').fill("Quality Assurance for the Analytical Chemistry Laboratory. Von D. Brynn Hibbert.");
  await page.locator('#text1').pressSequentially('Quality Assurance for the Analytical Chemistry Laboratory. Von D. Brynn Hibbert.'); // Enter book name
  await page.getByLabel('Context for search term 2').selectOption('Author'); // Select author
  // await page.getByLabel('Search Term  2').fill("Martin Vogel");
  await page.locator('#text2').pressSequentially('Martin Vogel');  // Enter author name
  await Promise.all([
    page.waitForNavigation(),
    await page.locator("#advanced-search-btn").click()
  ]); // Search
  await page.waitForURL('**/doSearch/**');
  // Couldn't test further due to human user checks of the site
  await expect(page.locator(`text=1 results for`)).toBeVisible();
});