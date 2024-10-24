## Page Object Model Pattern with Playwright

![alt text](./playwright-logo.png)

**API Automation Project using Playwright**

This project is designed for API automation testing using Playwright and leverages environment variables through the dotenv library. It allows testing different API endpoints and is configured to manage secrets (such as API keys) in a secure manner using an .env file.

If you want to run test locally, please follow these steps:

**Prerequisites**

Make sure you have `node.js` installed. If you don't, please visit [official website](https://nodejs.org/en/download/) for instructions 

Getting Started
1. Clone the Repository

2. **Install Dependencies** 
Run `npm install` to install node modules

3. **Create the .env file**
You need to create a .env file at the root of your project directory. This file will store the environment variables like the base URL, API Key, and API Host for API testing. Please find the example below

`URL='https://example-api.com/v1'`
`RAPIDAPI_KEY='your-api-key-here'`
`RAPIDAPI_HOST='example-api-host.com'`

4. **Run All Tests in tests folder**
Now you can run the tests `npm test` 
Playwright will execute all tests located in the tests folder, including test.ts under tests/API. And this will open the Playwright generates HTML report in your default browser, where you can analyze test results.

5. **Ignored Files**
The project has a .gitignore file to prevent sensitive files and unnecessary directories from being committed to the repository. The following items are ignored:

`node_modules/`
`test-results/`
`playwright-report/`
`blob-report/`
`playwright/.cache/`
`.env (to protect your API keys and sensitive data)`
