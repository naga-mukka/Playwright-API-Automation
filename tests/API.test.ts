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











import dotenv from 'dotenv';
import { expect, test } from '../fixture/pomFixture';
import { checkPageTitle, lazyScroll, navigateTo } from '../utilities/helpers';

dotenv.config();

const fs = require('fs');
const filePath = './testdata/testdata.json'
// Read and parse the JSON file
const rawData = fs.readFileSync(filePath);
const testData = JSON.parse(rawData);

const expectedHomePageTitleTxt = 'Apartments, Condos and Houses for Rent in Canada | liv.rent';
const expectedPricingPageTitleTxt = 'Landlord Pricing Plans | liv.rent';
const expectedPostAListingPageTitleTxt = 'Landlords Create Unlimited Listings | liv.rent';

const expectedAboutPageTitleTxt = 'About Us | liv.rent - Apartments & Houses for Rent Canada';
const expectedBlogPageTitleTxt = 'Liv Rent Blog - Vancouver Apartment Rental Tips and Advice | liv.rent blog';
const expectedPrivacyPageTitleTxt = 'Privacy Policy | liv.rent - Apartments and Houses for Rent';
const expectedFAQPageTitleTxt = 'Renters & Landlords FAQ | liv.rent - Apartments & Homes for Rent';
const expectedTermsPageTitleTxt = 'Terms and Conditions | liv.rent - Apartments and Houses for Rent';
const expectedJoinUsPageTitleTxt = 'Liv.Rent Jobs | Wellfound (formerly AngelList Talent)';
const expectedSignContractPageTitleTxt = 'Log in - Sign up | liv.rent';
const expectedVerifySigningPageTitleTxt = 'Liv Verify';

// href
const expectedAppleStoreHrefURL = 'https://apps.apple.com/ca/app/liv-apartment-houses-rental/id1321741040';
const expectedPlayStoreHrefURL = 'https://play.google.com/store/apps/details?id=rent.liv.ether';
const expectedTwitterHrefURL = 'https://twitter.com/liv_rent';
const expectedInstagramHrefURL = 'https://www.instagram.com/liv.rent/';
const expectedPFaceBookHrefURL = 'https://www.facebook.com/liv.rent/';

// Handle the new tab and verify the URL and title
const expectedPricingUrl = '/pricing';
const expectedPostAListingUrl = '/post-a-listing';
const expectedAboutUrl = '/about';
const expectedBlogUrl = 'https://liv.rent/blog/';
const expectedPrivacyUrl = '/privacy';
const expectedFAQUrl = '/faq';
const expectedTermsUrl = '/terms';
const expectedJoinUsUrl = 'https://angel.co/liv-rent/jobs';
const expectedSignContractUrl = '/app';
const expectedVerifySigningUrl = 'verify';

// Mask CSS Selectors
const aboutPeopleSayingMaskSelector = '.sc-ded8468b-0.hXGkDx';
const aboutContactUsMaskSelector = '.leaflet-pane.leaflet-tile-pane';
const blogVideoLibraryMaskSelector = '.et_pb_row.et_pb_row_19';

test.beforeEach(async ({ page, homePage }) => {
    const url = process.env.URL!;
    await navigateTo(page, url);
    await homePage.checkBannerAndClose();
});

test.only('Verify Home Page Title', { tag: ['@reg', '@visual'] }, async ({ page }) => {
    await checkPageTitle(page, expectedHomePageTitleTxt);
});

test('Verify Home Page Screenshot', { tag: ['@visual'] }, async ({ page, homePage }) => {
    // Capture the screenshot and perform the assertion
    await lazyScroll(page);
    const fullHomePage = await homePage.homePageScreehshotWithMaskArea();
    expect(fullHomePage).toMatchSnapshot('HomePage.png');
});

test('Verify Header Menu Dropdown Screenshot', { tag: ['@visual'] }, async ({ homePage }) => {
    await homePage.clickOnHeaderDropdownMenuBtn();
    // Capture the screenshot and perform the assertion
    const headerMenuDropdown = await homePage.headerMenuDropdownScreenshot();
    expect(headerMenuDropdown).toMatchSnapshot('HeaderMenuDropdownScreenshot.png');
});

test('Verify Header Landlord Menu Dropdown Screenshot', { tag: ['@visual'] }, async ({ homePage }) => {
    await homePage.clickOnHeaderLandlordDropdownMenuBtn();
    // Capture the screenshot and perform the assertion
    const headerLandlordMenuDropdown = await homePage.headerLandlordMenuDropdownScreenshot();
    expect(headerLandlordMenuDropdown).toMatchSnapshot('HeaderLandlordMenuDropdownScreenshot.png');
});

test('Verify Header Renters Menu Dropdown Screenshot', { tag: ['@visual'] }, async ({ homePage }) => {
    await homePage.clickOnHeaderRentersDropdownMenuBtn();
    // Capture the screenshot and perform the assertion
    const headerRentersMenuDropdown = await homePage.headerRentersMenuDropdownScreenshot();
    expect(headerRentersMenuDropdown).toMatchSnapshot('HeaderRentersMenuDropdownScreenshot.png');
});

test('Verify Header Resources Menu Dropdown Screenshot', { tag: ['@visual'] }, async ({ homePage }) => {
    await homePage.clickOnHeaderResourcesDropdownMenuBtn();
    // Capture the screenshot and perform the assertion
    const headerResourcesMenuDropdown = await homePage.headerResourcesMenuDropdownScreenshot();
    expect(headerResourcesMenuDropdown).toMatchSnapshot('HeaderResourcesMenuDropdownScreenshot.png');
});

test('Verify Pricing Page Title and Capture Screenshot', { tag: ['@visual'] }, async ({ page, homePage }) => {
    await homePage.checkPricingPageTitleAndURl(expectedPricingUrl, expectedPricingPageTitleTxt);
    await lazyScroll(page);
    // Capture the screenshot and perform the assertion
    const fullPricingPage = await homePage.fullPageScreenshot();
    expect(fullPricingPage).toMatchSnapshot('PricingPage.png');
});

test('Verify Post A Listing Page Screenshot', { tag: ['@visual'] }, async ({ homePage }) => {
    await homePage.checkPostAListingPageTitleAndURl(expectedPostAListingUrl, expectedPostAListingPageTitleTxt);
    // Capture the screenshot and perform the assertion
    const fullPostAListingPage = await homePage.fullPageScreenshot();
    expect(fullPostAListingPage).toMatchSnapshot('PostAListingPage.png');
});

test('Verify Post A Listing Apartment Flow Screenshots', { tag: ['@visual'] }, async ({ page, homePage }) => {
    await homePage.checkPostAListingPageTitleAndURl(expectedPostAListingUrl, expectedPostAListingPageTitleTxt);
    await homePage.clickOnPostAListingNextBtn();
    // Capture the screenshot and perform the assertion
    const fullPostAListingFirstErrorPage = await homePage.fullPageScreenshot();
    expect(fullPostAListingFirstErrorPage).toMatchSnapshot('PostAListing_PropertyTypeRequiredErrorPage.png');
    await homePage.clickOnPostAListingApartmentRadioBtn();
    // Capture the screenshot and perform the assertion
    const fullPropertyTypeApartmentPage = await homePage.fullPageScreenshot();
    expect(fullPropertyTypeApartmentPage).toMatchSnapshot('PostAListing_PropertyTypeApartmentPage.png');
    await homePage.clickOnPostAListingNextBtn();
    // Capture the screenshot and perform the assertion
    const fullSpaceRentingOutApartmentPage = await homePage.fullPageScreenshot();
    expect(fullSpaceRentingOutApartmentPage).toMatchSnapshot('PostAListing_SpaceRentingOutApartmentPage.png');
    await homePage.clickOnPostAListingSpaceNextBtn();
    // Capture the screenshot and perform the assertion
    const fullPostAListingSecondErrorPage = await homePage.fullPageScreenshot();
    expect(fullPostAListingSecondErrorPage).toMatchSnapshot('PostAListing_SpaceRentingOutErrorPage.png');
    await homePage.clickOnPostAListingEntireSpaceRadioBtn();
    await homePage.clickOnPostAListingSpaceNextBtn();
    await page.waitForTimeout(3000);
    // Capture the screenshot and perform the assertion
    const fullWhereIsLocatedApartmentPage = await homePage.fullPageScreenshot();
    expect(fullWhereIsLocatedApartmentPage).toMatchSnapshot('PostAListing_WhereIsLocatedApartmentPage.png');
    await homePage.clickOnPostAListingLocationNextBtn();
    // Capture the screenshot and perform the assertion
    const fullPostAListingThirdErrorPage = await homePage.fullPageScreenshot();
    expect(fullPostAListingThirdErrorPage).toMatchSnapshot('PostAListing_StreetNameRequiredErrorPage.png');
    await homePage.typeIntoBuildingSearchInputField(testData.ListingAddressHint);
    await page.waitForTimeout(3000);
    // Capture the screenshot and perform the assertion
    const fullPostAListingAddressHintPage = await homePage.fullPageScreenshot();
    expect(fullPostAListingAddressHintPage).toMatchSnapshot('PostAListing_AddressHintPage.png');
    await page.waitForTimeout(1000);
    await homePage.clickAndSelectFirstListingFromDowndownListBtn();
    // Capture the screenshot and perform the assertion
    const fullPostAListingSelectAddressPage = await homePage.fullPageScreenshot();
    expect(fullPostAListingSelectAddressPage).toMatchSnapshot('PostAListing_UnitNoRequiredErrorPage.png');
    await homePage.typeEnterUnitNumberBtn(testData.ListingUnit);
    await homePage.clickOnPostAListingLocationNextBtn();
    // Capture the screenshot and perform the assertion
    const fullPostAListingCreateAnAccountPage = await homePage.fullPageScreenshot();
    expect(fullPostAListingCreateAnAccountPage).toMatchSnapshot('PostAListing_CreateAnAccountPage.png');
    await homePage.clickCreateAccountContinueBtn();
    // Capture the screenshot and perform the assertion
    const fullPostAListingCreateAccountErrorsPage = await homePage.fullPageScreenshot();
    expect(fullPostAListingCreateAccountErrorsPage).toMatchSnapshot('PostAListing_CreateAccountErrorsPage.png');
});

test('Verify About Page Title And Screenshot', { tag: ['@visual'] }, async ({ page, homePage }) => {
    await homePage.checkAboutPageTitleAndURl(page, expectedAboutUrl, expectedAboutPageTitleTxt);
    await lazyScroll(page);
    // Capture the screenshot and perform the assertion
    const fullScreeningPage = await page.screenshot({
        fullPage: true, mask: [
            page.locator(aboutPeopleSayingMaskSelector),
            page.locator(aboutContactUsMaskSelector)
        ]
    });
    expect(fullScreeningPage).toMatchSnapshot('AboutPage.png');
});

test.skip('Verify Blog Page Title And Screenshot', { tag: ['@visual'] }, async ({ page, homePage }) => {
    await homePage.checkBlogPageTitleAndURl(page, expectedBlogUrl, expectedBlogPageTitleTxt);
    // Capture the screenshot and perform the assertion
    const fullScreeningPage = await page.screenshot({
        fullPage: true, mask: [
            page.locator(blogVideoLibraryMaskSelector)
        ]
    });
});

test('Verify Blog Page href', { tag: ['@visual'] }, async ({ homePage }) => {
    // Note: This will only capture up to the 19.13 point because the image is too large.
    console.log('As this Blog Page needs some additional permission so checking only the href');
    const hasFaceBookHref = await homePage.doesBlogBtnHaveHref(expectedBlogUrl);
    expect(hasFaceBookHref).toBeTruthy();
});

test('Verify Privacy Page Title And Screenshot', { tag: ['@visual'] }, async ({ page, homePage }) => {
    await homePage.checkPrivacyPageTitleAndURl(page, expectedPrivacyUrl, expectedPrivacyPageTitleTxt);
    // Capture the screenshot and perform the assertion
    const fullScreeningPage = await page.screenshot({
        fullPage: true, mask: [
            page.locator(blogVideoLibraryMaskSelector)
        ]
    });
    expect(fullScreeningPage).toMatchSnapshot('PrivacyPage.png');
});

test('Verify FAQ Page Title And Screenshot', { tag: ['@visual'] }, async ({ page, homePage }) => {
    await homePage.checkFAQPageTitleAndURl(page, expectedFAQUrl, expectedFAQPageTitleTxt);
    // Capture the screenshot and perform the assertion
    const fullScreeningPage = await page.screenshot({ fullPage: true });
    expect(fullScreeningPage).toMatchSnapshot('FAQPage.png');
});

test('Verify Terms Page Title And Screenshot', { tag: ['@visual'] }, async ({ page, homePage }) => {
    // Note: This will only capture up to the 19.13 point because the image is too large.
    console.log('Terms Page - This will only capture up to the 19.13 point because the image is too large');
    await homePage.checkTermsPageTitleAndURl(page, expectedTermsUrl, expectedTermsPageTitleTxt);
    // Capture the screenshot and perform the assertion
    const fullScreeningPage = await page.screenshot({ fullPage: true });
    expect(fullScreeningPage).toMatchSnapshot('TermsPage.png');
});

test.skip('Verify Join Us Page Title And Screenshot', { tag: ['@visual'] }, async ({ page, homePage }) => {
    await homePage.checkJoinUsPageTitleAndURl(page, expectedJoinUsUrl, expectedJoinUsPageTitleTxt);
    // Capture the screenshot and perform the assertion
    const fullScreeningPage = await page.screenshot({ fullPage: true });
    expect(fullScreeningPage).toMatchSnapshot('JoinUsPage.png');
});

test('Verify Join Us Page href', { tag: ['@visual'] }, async ({ page, homePage }) => {
    // Note: This will only capture up to the 19.13 point because the image is too large.
    console.log('As this Join Us needs some additional permission so checking only the href');
    const hasFaceBookHref = await homePage.doesjoinUsBtnHaveHref(expectedJoinUsUrl);
    expect(hasFaceBookHref).toBeTruthy();
});

test('Verify Sign Contract Page Title And Screenshot', { tag: ['@visual'] }, async ({ page, context, homePage }) => {
    const newPage = await homePage.checkSignContractPageTitleAndURl(page, context, expectedSignContractUrl, expectedSignContractPageTitleTxt);
    // Capture the screenshot and perform the assertion
    const fullScreeningPage = await newPage.screenshot({ fullPage: true });
    expect(fullScreeningPage).toMatchSnapshot('SignContractPage.png');
});

test('Verify Singing Page Title And Screenshot', { tag: ['@visual'] }, async ({ page, context, homePage }) => {
    const newPage = await homePage.checkVerifySignIngPageTitleAndURl(page, context, expectedVerifySigningUrl, expectedVerifySigningPageTitleTxt);
    // Capture the screenshot and perform the assertion
    const fullScreeningPage = await newPage.screenshot({ fullPage: true });
    expect(fullScreeningPage).toMatchSnapshot('VerifySigningPage.png');
});

test('Verify Apple Store and Google Play Store links has href', { tag: ['@reg'] }, async ({ homePage }) => {
    const hasAppleStoreHref = await homePage.doesAppleAndPlayStoreBtnHaveHref(expectedAppleStoreHrefURL);
    const hasPlayStoreHref = await homePage.doesAppleAndPlayStoreBtnHaveHref(expectedPlayStoreHrefURL);

    expect(hasAppleStoreHref).toBeTruthy();
    expect(hasPlayStoreHref).toBeTruthy();
});

test('Verify Social Media links has href', { tag: ['@reg'] }, async ({ homePage }) => {
    const hasTwitterHref = await homePage.doesSocialMediaBtnHaveHref(expectedTwitterHrefURL);
    const hasInstagramHref = await homePage.doesSocialMediaBtnHaveHref(expectedInstagramHrefURL);
    const hasFaceBookHref = await homePage.doesSocialMediaBtnHaveHref(expectedPFaceBookHrefURL);

    expect(hasTwitterHref).toBeTruthy();
    expect(hasInstagramHref).toBeTruthy();
    expect(hasFaceBookHref).toBeTruthy();
});
