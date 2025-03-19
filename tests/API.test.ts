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





import { test } from '@playwright/test';
import oracledb from 'oracledb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Function to execute the SQL query
async function runQuery(query: string) {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectionString: process.env.DB_CONNECTION_NAME || process.env.DB_CONNECTION_STRING, 
            // Uses Connection Name if provided, otherwise falls back to JDBC URL
        });

        console.log(`Connected to Oracle DB using: ${process.env.DB_CONNECTION_NAME || 'Custom JDBC URL'}`);

        // Execute query
        const result = await connection.execute(query);
        console.log('Query executed successfully:', result.rows);

        return result.rows;
    } catch (err) {
        console.error('Database error:', err);
    } finally {
        if (connection) {
            await connection.close();
            console.log('Database connection closed');
        }
    }
}

// Playwright test to run the query
test('Run Oracle DB Query', async () => {
    const query = `SELECT * FROM Customers ORDER BY Country ASC, CustomerName DESC`;
    const data = await runQuery(query);

    // Assert that data is returned
    test.expect(data).not.toBeNull();
    console.log('Query Result:', data);
});


import { addTags } from '../utilities/tagHelper';

test('Verify Login Page Title', async ({ page }, testInfo) => {
    addTags(testInfo, ['@smoke', '@reg']); // Pass multiple tags dynamically

    await checkPageTitle(page, expectedHomePageTitleTxt);
});

test('Verify Login', async ({ page, loginPage }, testInfo) => {
    addTags(testInfo, ['@smoke']); // Only tag as @smoke

    await logIn(loginPage, testData.Email!, testData.Password!);
    await wait(20000);
});

export function addTags(testInfo: any, tags: string[]) {
    tags.forEach(tag => {
        testInfo.annotations.push({ type: 'tag', description: tag });
    });
}

npx playwright test --grep "@smoke|@reg"

npx playwright test --grep "@smoke&@reg"

npx playwright test --grep @smoke

import { Page, Locator, expect } from '@playwright/test';

// Function to check button visibility, enabled state, and text
export async function checkButtonState(button: Locator, expectedText?: string) {
    // Check if the button is visible
    await expect(button).toBeVisible();

    // Check if the button is enabled
    await expect(button).toBeEnabled();

    // If expected text is provided, verify button text
    if (expectedText) {
        await expect(button).toHaveText(expectedText);
    }
}


import { Page, Locator } from '@playwright/test';
import { checkButtonState } from '../utilities/helper';

export class LoginPage {
    readonly page: Page;
    readonly signInBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInBtn = page.locator('[data-testid="login_page_sign-in-button_test-id"]'); // Adjust selector
    }

    // Method to check the Sign-In button state
    async verifySignInButton() {
        await checkButtonState(this.signInBtn, 'Sign In');
    }
}

import { test } from '@playwright/test';
import { LoginPage } from '../pageFactory/b2b/login.page';

test('Verify Sign-In Button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.verifySignInButton();
});




