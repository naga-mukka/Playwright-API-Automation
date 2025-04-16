import dotenv from 'dotenv';
import { expect, test } from '../fixture/pomFixture';
import { logIn, navigateTo, openLogInPopup, wait } from '../utilities/helpers';

dotenv.config();

const fs = require('fs');
const filePath = './testdata/testdata.json'
// Read and parse the JSON file
const rawData = fs.readFileSync(filePath);
const testData = JSON.parse(rawData);

test.beforeEach(async ({ page }) => {
    const url = process.env.URL!;
    await navigateTo(page, url);
});

test('Verify LogIn Up PopUp Page', { tag: ['@visual', '@reg', '@smoke'] }, async ({ homePage }) => {
    await openLogInPopup(homePage);
    // Capture the screenshot and perform the assertion
    const logInPopUpScreenshot = await homePage.signUpOrLoginPopUpPageScreenshot();
    expect(logInPopUpScreenshot).toMatchSnapshot('LogInPopUpPage.png');
});

test('Verify LogIn PopUp With Error Msg Page', { tag: ['@visual', '@reg', '@smoke'] }, async ({ page, homePage, logInPage }) => {
    await openLogInPopup(homePage);
    await logInPage.clickIntoEnterEmailPhoneInputField();
    await logInPage.clickIntoPasswordInputField();
    await logInPage.clickOnLogInPopUpBtn();
    await wait(page, 2000);
    // Capture the screenshot and perform the assertion
    const logInPopUpScreenshot: Buffer = await homePage.signUpOrLoginPopUpPageScreenshot();
    expect(logInPopUpScreenshot).toMatchSnapshot('LogInPopUpWithErrorMsgPage.png');
});

test('Verify Forgot Password PopUp Page', { tag: ['@visual', '@reg', '@smoke'] }, async ({ homePage, logInPage }) => {
    await openLogInPopup(homePage);
    await logInPage.clickOnForgotPasswordLinkBtn();
    // Capture the screenshot and perform the assertion
    const logInPopUpScreenshot = await homePage.signUpOrLoginPopUpPageScreenshot();
    expect(logInPopUpScreenshot).toMatchSnapshot('ForgotPasswordPage.png');
});

test('Verify Forgot Password PopUp with Error Msg Page', { tag: ['@visual', '@reg', '@smoke'] }, async ({ page, homePage, logInPage, signUpPage }) => {
    await openLogInPopup(homePage);
    await logInPage.clickOnForgotPasswordLinkBtn();
    await signUpPage.clickIntoEnterEmailInputField();
    await logInPage.clickOnResetPwdBtn();
    await wait(page, 2000);
    // Capture the screenshot and perform the assertion
    const logInPopUpScreenshot = await homePage.signUpOrLoginPopUpPageScreenshot();
    expect(logInPopUpScreenshot).toMatchSnapshot('ForgotPasswordWithErrorMsgPage.png');
});

test('Verify LogIn with Existing Renter', { tag: ['@reg', '@smoke'] }, async ({ homePage, logInPage }) => {
    await logIn(homePage, logInPage, testData.ExistingRenterEmail!, testData.Password!);
});

test('Verify LogIn with Existing Landlord', { tag: ['@reg', '@smoke'] }, async ({ homePage, logInPage }) => {
    await logIn(homePage, logInPage, testData.ExistingLandlordEmail!, testData.Password!);
});