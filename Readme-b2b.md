# B2B Ecomm QA Automation

This project is built using the **Page Object Model (POM)** design pattern for end-to-end testing of B2B E-commerce applications.

## Project Structure

```
b2b-ecomm-qa-automation/
│
├── pageFactory/                 # Contains all Page Object files
│   └── b2b/                     # B2B-related page object files
│       ├── forgotPassword.page.ts
│       ├── home.page.ts
│       └── login.page.ts
│
├── tests/                       # Contains all test files
│   └── b2b/                     # B2B-related test scripts
│       ├── forgotPassword.test.ts
│       ├── home.test.ts
│       └── login.test.ts
│
├── utilities/                   # Common utilities
│   ├── constants.ts             # Static values and constants
│   ├── helper.ts                # Common helper functions
│   └── testdata.ts              # Test data for various test cases
│
├── fixture/                     # Test fixtures
│   └── pomFixture.ts
│
├── .env                         # Environment variables
├── .env.qa
├── .env.staging
├── .gitlab-ci.yml               # GitLab CI configuration
├── .eslintrc.json               # Linting rules
├── .prettierrc                  # Prettier configuration
└── README.md                    # Project overview (this file)
```

## Key Highlights

- **Framework**: TypeScript
- **Design Pattern**: Page Object Model (POM)
- **Test Organization**: Tests are cleanly separated from the page logic.
- **Utilities**: Common utilities are provided to make test writing easier and reusable.
- **CI/CD**: Integrated with GitLab CI for pipeline automation.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Set environment variables as needed using `.env.qa` or `.env.staging`.
