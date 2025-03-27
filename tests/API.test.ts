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
  



import { BrowserContext, Page } from '@playwright/test';

export async function tabHandler(
  context: BrowserContext,
  trigger: Promise<void>,
  waitState: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'
): Promise<Page> {
  const [newTab] = await Promise.all([
    context.waitForEvent('page'),
    trigger
  ]);
  await newTab.waitForLoadState(waitState);
  return newTab;
}


import { test, expect } from '@playwright/test';
import { tabHandler } from './tab-handler'; // adjust the path accordingly

test('Verify California Privacy Rights page content', async ({ context, page }) => {
  await page.goto('https://stg-npd.wholesale.lululemon.com');

  // Call the tabHandler to manage new tab opening
  const newTab = await tabHandler(context, page.click('text=California Privacy Rights'));

  // Handle location popup
  const shopUS = newTab.locator('button', { hasText: 'Shop in the United States' });
  if (await shopUS.isVisible()) {
    await shopUS.click();
  }

  // Assert privacy content is visible
  await expect(newTab.locator('text=Your Privacy: Overview')).toBeVisible();
});


import { Page, BrowserContext } from '@playwright/test';
import { tabHandler } from '../helpers/tab-helper';

export class HomePage {
  constructor(private page: Page, private context: BrowserContext) {}

  async openPrivacyPolicyInNewTab(linkLocator: string): Promise<Page> {
    return await tabHandler(this.context, this.page.click(linkLocator));
  }

  async selectUSRegion(tab: Page) {
    const usButton = tab.locator('button', { hasText: 'Shop in the United States' });
    if (await usButton.isVisible()) {
      await usButton.click();
    }
  }
}

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('Verify US privacy policy after location confirmation', async ({ page, context }) => {
  const home = new HomePage(page, context);

  await page.goto('https://stg-npd.wholesale.lululemon.com');

  // Open new tab using custom helper via page object
  const newTab = await home.openPrivacyPolicyInNewTab('text=California Privacy Rights');

  // Select US region if popup shows up
  await home.selectUSRegion(newTab);

  // Assertion: Check the policy heading is visible
  await expect(newTab.locator('text=Your Privacy: Overview')).toBeVisible();
});

