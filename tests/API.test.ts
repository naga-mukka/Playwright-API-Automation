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






import { BrowserContext, expect, Locator, Page } from '@playwright/test';
import { handleUrlAndTitleOfNewTab, handleUrlAndTitleOnSameTab } from '../utilities/helpers';

export class HomePage {
  readonly page: Page;
  readonly menuBtn: Locator;
  readonly menuSignUpBtn: Locator;
  readonly menulogInBtn: Locator;
  readonly menulogOutBtn: Locator;
  readonly menuProfileBtn: Locator;
  readonly landlordDropdownMenuBtn: Locator;
  readonly rentersDropdownMenuBtn: Locator;
  readonly resourcesDropdownMenuBtn: Locator;
  readonly pricingMenuBtn: Locator;
  readonly postAListingMenuBtn: Locator;
  readonly postAListingNextBtn: Locator;
  readonly postAListingSpaceNextBtn: Locator;
  readonly postAListingLocationNextBtn: Locator;
  readonly postAListingApartmentRadioBtn: Locator;
  readonly postAListingHomeRadioBtn: Locator;
  readonly postAListingTownhouseRadioBtn: Locator;
  readonly postAListingEntireRadioBtn: Locator;
  readonly postAListingPartialRadioBtn: Locator;
  readonly postAListingRoomRadioBtn: Locator;
  readonly postAListingBuildingSearchInputBtn: Locator;
  readonly postAListingSelectFirstListingBtn: Locator;
  readonly postAListingEnterUnitNumberBtn: Locator;
  readonly postAListingCreateAccountContinueBtn: Locator;

  // Footer
  readonly aboutFooterBtn: Locator;
  readonly blogFooterBtn: Locator;
  readonly privacyFooterBtn: Locator;
  readonly fqaFooterBtn: Locator;
  readonly termsFooterBtn: Locator;
  readonly joinUsFooterBtn: Locator;
  readonly signContractFooterBtn: Locator;
  readonly verifySigningFooterBtn: Locator;
  readonly appleAndPlayStoreFooterBtn: Locator;
  readonly socialMediaFooterBtn: Locator;

  // Visual Testing Locators
  readonly signUpOrLogInPopUp: Locator;
  readonly chatBotSectionSelector: Locator;
  readonly companySectionSelector: Locator;
  readonly headerMenuDropdownSectionSelector: Locator;
  readonly landlordDropdownMenuSection: Locator;
  readonly rentersDropdownMenuSection: Locator;
  readonly resourcesDropdownMenuSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuBtn = page.locator('[id="btn-menu"]');
    this.menuSignUpBtn = page.locator('[id="menu-account-signup"]');
    this.menulogInBtn = page.locator('[id="menu-account-login"]');
    this.menulogOutBtn = page.locator('[id="menu-manage-logged-logout"]');
    this.menuProfileBtn = page.locator('[id="menu-account-logged-profile"]');
    this.landlordDropdownMenuBtn = page.locator('[id="header-landlords-main"]');
    this.rentersDropdownMenuBtn = page.locator('[id="header-renters-main"]');
    this.resourcesDropdownMenuBtn = page.locator('[id="header-resources-main"]');
    this.pricingMenuBtn = page.locator('[id="menu-pricing-link"]');
    this.postAListingMenuBtn = page.locator('[id="btn-post-listing"]');
    this.postAListingNextBtn = page.locator('[id="landlord-postlisting-essentials-property-next"]');
    this.postAListingSpaceNextBtn = page.locator('[id="landlord-postlisting-essentials-space-next"]');
    this.postAListingLocationNextBtn = page.locator('[id="landlord-postlisting-essentials-location-next"]');
    this.postAListingApartmentRadioBtn = page.locator('[id="condo"]');
    this.postAListingHomeRadioBtn = page.locator('[id="house"]');
    this.postAListingTownhouseRadioBtn = page.locator('[id="townhouse"]');
    this.postAListingEntireRadioBtn = page.locator('[id="entire"]');
    this.postAListingPartialRadioBtn = page.locator('[id="partial"]');
    this.postAListingRoomRadioBtn = page.locator('[id="room"]');
    this.postAListingBuildingSearchInputBtn = page.locator('[id="building-search-input"]');
    this.postAListingSelectFirstListingBtn = page.locator('[id="react-select-2-option-0"]');
    this.postAListingEnterUnitNumberBtn = page.locator('[id="suite"]');
    this.postAListingCreateAccountContinueBtn = page.locator('[id="landlord-postlisting-essentials-createaccount-continue"]');

    // Footer
    this.aboutFooterBtn = page.locator("//a[normalize-space()='About']");
    this.blogFooterBtn = page.locator("//a[normalize-space()='Blog']");
    this.privacyFooterBtn = page.locator("//a[normalize-space()='Privacy']");
    this.fqaFooterBtn = page.locator("//a[normalize-space()='FAQ']");
    this.termsFooterBtn = page.locator("//a[normalize-space()='Terms']");
    this.joinUsFooterBtn = page.locator("(//a[normalize-space()='Join Us'])[1]");
    this.signContractFooterBtn = page.locator("//a[normalize-space()='Sign Contract']");
    this.verifySigningFooterBtn = page.locator("//a[normalize-space()='Verify Signing']");
    this.appleAndPlayStoreFooterBtn = page.locator(".sc-8517d321-10.loKKdF > a");
    this.socialMediaFooterBtn = page.locator(".sc-8517d321-12.eSxmiC > a");

    // Visual Testing Constructors
    this.signUpOrLogInPopUp = page.locator(".sc-6a617a92-0 > ._17j34wv0");
    this.chatBotSectionSelector = page.locator(".cc-157aw.cc-l22u7");
    this.headerMenuDropdownSectionSelector = page.locator('#header-menu-popper > div');
    this.landlordDropdownMenuSection = page.locator('.sc-ec94aa0a-15');
    this.rentersDropdownMenuSection = page.locator('.sc-ec94aa0a-3');
    this.resourcesDropdownMenuSection = page.locator('.sc-ec94aa0a-15');

    //Mock CSS Selectors
    this.companySectionSelector = page.locator('.sc-e804c457-2.jDIoji');
  }

  async goto() {
    await this.page.goto(process.env.URL!);
  }

  async checkBannerAndClose() {
    const giveawayText = this.page.getByText('🎉 GIVEAWAY 🎉 We\'re giving $');
    const isVisible = await giveawayText.isVisible();

    if (isVisible) {
      await this.page.getByLabel('close giveaway banner').getByRole('button').click({ force: true });
    }
  }

  async checkPageTitle(expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async clickOnHeaderDropdownMenuBtn() {
    await this.menuBtn.isVisible();
    await this.menuBtn.click({ force: true });
  }

  async clickOnHeaderLandlordDropdownMenuBtn() {
    await this.landlordDropdownMenuBtn.click({ force: true });
  }

  async clickOnHeaderRentersDropdownMenuBtn() {
    await this.rentersDropdownMenuBtn.click({ force: true });
  }

  async clickOnHeaderResourcesDropdownMenuBtn() {
    await this.resourcesDropdownMenuBtn.click({ force: true });
  }

  async clickOnPricingMenuBtn() {
    await this.pricingMenuBtn.click({ force: true });
  }

  async clickOnPostAListingMenuBtn() {
    await this.postAListingMenuBtn.click({ force: true });
  }

  async clickOnPostAListingNextBtn() {
    await this.postAListingNextBtn.click({ force: true });
  }

  async clickOnPostAListingApartmentRadioBtn() {
    await this.postAListingApartmentRadioBtn.click({ force: true });
  }

  async clickOnPostAListingHomeRadioBtn() {
    await this.postAListingHomeRadioBtn.click({ force: true });
  }

  async clickOnPostAListingTownhouseRadioBtn() {
    await this.postAListingTownhouseRadioBtn.click({ force: true });
  }

  async clickOnPostAListingEntireSpaceRadioBtn() {
    await this.postAListingEntireRadioBtn.click({ force: true });
  }

  async clickOnPostAListingPartialSpaceRadioBtn() {
    await this.postAListingPartialRadioBtn.click({ force: true });
  }

  async clickOnPostAListingRoomRadioBtn() {
    await this.postAListingRoomRadioBtn.click({ force: true });
  }

  async clickOnPostAListingSpaceNextBtn() {
    await this.postAListingSpaceNextBtn.click({ force: true });
  }

  async clickOnPostAListingLocationNextBtn() {
    await this.postAListingLocationNextBtn.click({ force: true });
  }

  async typeIntoBuildingSearchInputField(AddressTxt: string) {
    await this.postAListingBuildingSearchInputBtn.fill(AddressTxt);
  }

  async clickAndSelectFirstListingFromDowndownListBtn() {
    await this.postAListingSelectFirstListingBtn.click({ force: true });
  }

  async typeEnterUnitNumberBtn(UnitNo: string) {
    await this.postAListingEnterUnitNumberBtn.fill(UnitNo);
  }

  async clickCreateAccountContinueBtn() {
    await this.postAListingCreateAccountContinueBtn.click({ force: true });
  }

  async clickOnHeaderDropdownMenuSignUpBtn() {
    await this.menuSignUpBtn.click({ force: true });
  }

  async clickOnHeaderDropdownMenuLogInBtn() {
    await this.menulogInBtn.isVisible();
    await this.menulogInBtn.click({ force: true });
  }

  async clickOnHeaderDropdownMenuLogOutBtn() {
    await this.menulogOutBtn.isVisible();
    await this.menulogOutBtn.click({ force: true });
  }

  async clickHeaderDropdownMenuLogOutBtnVisibility() {
    await this.menulogOutBtn.isVisible();
  }

  async clickOnHeaderDropdownMenuProfileBtn() {
    await this.menuBtn.isVisible();
    await this.menuProfileBtn.click({ force: true });
  }

  async checkPricingPageTitleAndURl(expectedUrl: string, expectedTitle: string) {
    const clickLocator = this.pricingMenuBtn; // Use the locator from the constructor
    const newPage = await handleUrlAndTitleOnSameTab(this.page, expectedUrl, expectedTitle, clickLocator);
    return newPage;
  }

  async checkPostAListingPageTitleAndURl(expectedUrl: string, expectedTitle: string) {
    const clickLocator = this.postAListingMenuBtn; // Use the locator from the constructor
    const newPage = await handleUrlAndTitleOnSameTab(this.page, expectedUrl, expectedTitle, clickLocator);
    return newPage;
  }

  // Visual Testing Actions

  async isChatbotVisible() {
    return await this.chatBotSectionSelector.isVisible();
  }

  async homePageScreehshotWithMaskArea() {
    return await this.page.screenshot({ fullPage: true, mask: [this.companySectionSelector] });
  }

  async headerMenuDropdownScreenshot(): Promise<Buffer> {
    await this.headerMenuDropdownSectionSelector.waitFor({ state: 'visible' });
    return await this.headerMenuDropdownSectionSelector.screenshot();
  }

  async headerLandlordMenuDropdownScreenshot(): Promise<Buffer> {
    await this.landlordDropdownMenuSection.waitFor({ state: 'visible' });
    return await this.landlordDropdownMenuSection.screenshot();
  }

  async headerRentersMenuDropdownScreenshot(): Promise<Buffer> {
    await this.rentersDropdownMenuSection.waitFor({ state: 'visible' });
    return await this.rentersDropdownMenuSection.screenshot();
  }

  async headerResourcesMenuDropdownScreenshot(): Promise<Buffer> {
    await this.resourcesDropdownMenuSection.waitFor({ state: 'visible' });
    return await this.resourcesDropdownMenuSection.screenshot();
  }

  async signUpOrLoginPopUpPageScreenshot(): Promise<Buffer> {
    return await this.signUpOrLogInPopUp.screenshot();
  }

  async fullPageScreenshot() {
    return await this.page.screenshot({ fullPage: true });
  }

  async checkAboutPageTitleAndURl(page: Page, expectedUrl: string, expectedTitle: string) {
    const clickLocator = this.aboutFooterBtn; // Use the locator from the constructor
    await page.waitForTimeout(3000);
    const newPage = await handleUrlAndTitleOnSameTab(this.page, expectedUrl, expectedTitle, clickLocator);
    return newPage;
  }

  async checkBlogPageTitleAndURl(page: Page, expectedUrl: string, expectedTitle: string) {
    const clickLocator = this.blogFooterBtn; // Use the locator from the constructor
    await page.waitForTimeout(3000);
    const newPage = await handleUrlAndTitleOnSameTab(this.page, expectedUrl, expectedTitle, clickLocator);
    return newPage;
  }

  async getBlogBtnHrefAttr() {
    return await this.blogFooterBtn.evaluateAll(elements =>
      elements.map(element => element.getAttribute('href'))
    );
  }

  async doesBlogBtnHaveHref(hrefValue: string) {
    const hrefs = await this.getBlogBtnHrefAttr();
    return hrefs.includes(hrefValue);
  }

  async checkPrivacyPageTitleAndURl(page: Page, expectedUrl: string, expectedTitle: string) {
    const clickLocator = this.privacyFooterBtn; // Use the locator from the constructor
    await page.waitForTimeout(3000);
    const newPage = await handleUrlAndTitleOnSameTab(this.page, expectedUrl, expectedTitle, clickLocator);
    return newPage;
  }

  async checkFAQPageTitleAndURl(page: Page, expectedUrl: string, expectedTitle: string) {
    const clickLocator = this.fqaFooterBtn; // Use the locator from the constructor
    await page.waitForTimeout(3000);
    const newPage = await handleUrlAndTitleOnSameTab(this.page, expectedUrl, expectedTitle, clickLocator);
    return newPage;
  }

  async checkTermsPageTitleAndURl(page: Page, expectedUrl: string, expectedTitle: string) {
    const clickLocator = this.termsFooterBtn; // Use the locator from the constructor
    await page.waitForTimeout(3000);
    await this.aboutFooterBtn.scrollIntoViewIfNeeded();
    const newPage = await handleUrlAndTitleOnSameTab(this.page, expectedUrl, expectedTitle, clickLocator);
    return newPage;
  }

  async getJoinUsBtnHrefAttr() {
    return await this.joinUsFooterBtn.evaluateAll(elements =>
      elements.map(element => element.getAttribute('href'))
    );
  }

  async doesjoinUsBtnHaveHref(hrefValue: string) {
    const hrefs = await this.getJoinUsBtnHrefAttr();
    return hrefs.includes(hrefValue);
  }

  async checkJoinUsPageTitleAndURl(page: Page, expectedUrl: string, expectedTitle: string) {
    const clickLocator = this.joinUsFooterBtn; // Use the locator from the constructor
    await page.waitForTimeout(3000);
    const newPage = await handleUrlAndTitleOnSameTab(this.page, expectedUrl, expectedTitle, clickLocator);
    return newPage;
  }

  async checkSignContractPageTitleAndURl(page: Page, context: BrowserContext, expectedUrl: string, expectedTitle: string) {
    const clickLocator = this.signContractFooterBtn; // Use the locator from the constructor
    const newPage = await handleUrlAndTitleOfNewTab(this.page, context, expectedUrl, expectedTitle, clickLocator);
    return newPage;
  }

  async checkVerifySignIngPageTitleAndURl(page: Page, context: BrowserContext, expectedUrl: string, expectedTitle: string) {
    const clickLocator = this.verifySigningFooterBtn; // Use the locator from the constructor
    const newPage = await handleUrlAndTitleOfNewTab(this.page, context, expectedUrl, expectedTitle, clickLocator);
    return newPage;
  }

  async getAppleAndPlayStoreBtnHrefAttr() {
    return await this.appleAndPlayStoreFooterBtn.evaluateAll(elements =>
      elements.map(element => element.getAttribute('href'))
    );
  }

  async doesAppleAndPlayStoreBtnHaveHref(hrefValue: string) {
    const hrefs = await this.getAppleAndPlayStoreBtnHrefAttr();
    return hrefs.includes(hrefValue);
  }

  async getSocialMediaBtnHrefAttr() {
    return await this.socialMediaFooterBtn.evaluateAll(elements =>
      elements.map(element => element.getAttribute('href'))
    );
  }

  async doesSocialMediaBtnHaveHref(hrefValue: string) {
    const hrefs = await this.getSocialMediaBtnHrefAttr();
    return hrefs.includes(hrefValue);
  }
}












