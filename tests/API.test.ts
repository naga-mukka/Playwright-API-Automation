import { expect, test } from "@playwright/test";

const GetLocationEndpoint = '/getLocation'
const SearchEndPoint = '/searchCruises'

// Define a global variable to store the destinationId
let globalDestinationId;

test.describe('Cruises API Tests', {}, () => {
    test("Get Cruises Location", async ({ request, baseURL }) => {
        const _response = await request.get(`${baseURL}${GetLocationEndpoint}`);

        // Check if the response status is 200
        expect(_response.status()).toBe(200);
        expect(_response.ok()).toBeTruthy(); // Ensure the response is Ok
        const res = await _response.json(); // Parse the JSON response
        console.log(res);

        // Searching the json response array with name = Caribbean 
        const locationName = res.data.find(location => location.name === 'Caribbean');
        expect(locationName).toBeDefined();
        // Store the destinationId in the global variable
        globalDestinationId = locationName.destinationId;
        console.log("This is the destinationId for Caribbean Locaiton : " + globalDestinationId);
    });

    test("Get Search Cruises", async ({ request, baseURL }) => {
        //const destinationId = '147237';
        console.log("This is the destinationId for Caribbean Locaiton in the Search Cruises API: " + globalDestinationId);
        const _response = await request.get(`${baseURL}${SearchEndPoint}?destinationId=${globalDestinationId}&order=popularity&page=1&currencyCode=USD`);

        // Check if the response status is 200
        expect(_response.status()).toBe(200);
        expect(_response.ok()).toBeTruthy(); // Ensure the response is Ok
        const res = await _response.json(); // Parse the JSON response

        // Check if filters is an object and contains the ship array
        const filters = res.data.filters;
        if (filters && typeof filters === 'object') {
            // Assuming filters.ship is the key where the ship data is stored
            const ships = filters.ship || [];

            // Sort the ships by crew size in descending order (or by totalResults)
            const sortedShips = ships.sort((a, b) => b.totalResults - a.totalResults); // Assuming totalResults is the key
            
            // Print the total Ships count.
            console.log("Total Ships Items:" + sortedShips.length);

            // Display each ship's name and TotalResults size
            sortedShips.forEach(ship => {
                console.log(`Ship Name: ${ship.name}, Total Results (Crew): ${ship.totalResults}`);
            });
        } else {
            console.error("Filters is not an object or is missing.");
        }
    });
})






import { expect, Locator, Page } from '@playwright/test';

export class CustomHelper {
  /**
   * Checks the href and inner text of a link
   * @param locator - Playwright Locator object or a selector string
   * @param expectedHref - Expected href value
   * @param expectedText - Expected inner text
   */
  static async verifyLinkAttributes(
    locator: Locator | string,
    expectedHref: string,
    expectedText: string,
    page?: Page // optional if using string selector
  ) {
    let element: Locator;

    if (typeof locator === 'string') {
      if (!page) throw new Error('Page object is required when passing a selector string.');
      element = page.locator(locator);
    } else {
      element = locator;
    }

    await expect(element).toHaveAttribute('href', expectedHref);
    await expect(element).toHaveText(expectedText);
  }
}





import { BrowserContext, Page } from '@playwright/test';

export class TabHelper {
  static async waitForNewTab(context: BrowserContext, trigger: Promise<void>): Promise<Page> {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      trigger
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}

import { test, expect } from '@playwright/test';
import { TabHelper } from './helpers'; // Adjust the path accordingly

test('Handle California Privacy Rights in new tab', async ({ context, page }) => {
  await page.goto('https://stg-npd.wholesale.lululemon.com');

  // Use the helper to handle the new tab
  const newTab = await TabHelper.waitForNewTab(context, page.click('text=California Privacy Rights'));

  // Handle location confirmation modal
  const shopUS = newTab.locator('button', { hasText: 'Shop in the United States' });
  if (await shopUS.isVisible()) {
    await shopUS.click();
  }

  // Check for expected privacy policy content
  await expect(newTab.locator('text=Your Privacy: Overview')).toBeVisible();
});

static async waitForNewTab(
  context: BrowserContext,
  trigger: Promise<void>,
  timeout: number = 10000
): Promise<Page> {
  const [newPage] = await Promise.all([
    context.waitForEvent('page', { timeout }),
    trigger
  ]);
  console.log(`New tab opened: ${newPage.url()}`);
  await newPage.waitForLoadState('domcontentloaded');
  return newPage;
}
