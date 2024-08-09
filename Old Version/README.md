# Alpine Inc Notes Application CI Pipeline

## Overview
This project implements a Continuous Integration (CI) pipeline using GitHub Actions to automate the build, testing, and deployment processes for the Alpine Inc Notes application. The CI pipeline ensures code quality and consistency by running various checks and tests on every code change.

## How to Trigger the Pipeline
The pipeline is automatically triggered on the following events:
- Push to the `main` branch
- Push to any `feature/*` branch
- Pull requests to the `main` branch

## Prerequisites
Before running any commands, ensure you have Node.js installed. You can download it from [Node.js official website](https://nodejs.org/).

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/your-repo.git
    ```

2. Navigate to the project directory:
    ```bash
    cd your-repo
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

## Starting the Application
To start the application, use the following command:
```bash
npm start
```
The application will be available at http://localhost:3000 (or the port specified in your environment variables).

## Commands and Their Functionality

### Linting
- `npm run test-lint`: This command runs ESLint to check for code style issues and potential errors in the codebase.

### Unit Testing
- `npm run test-unit`: This command runs unit tests using Jest. It also generates code coverage reports.

### Integration Testing
- `npm run test-integration`: This command runs integration tests using Jest. It ensures that different parts of the application work together correctly.

### End-to-End Testing
- `npm run test-e2e`: This command runs end-to-end tests using Playwright. It simulates user interactions to verify the application's behavior.

### Build
- `npm run build`: This command generates the build artifacts for the application. Note that this is only run on the `main` branch.

### Running All Tests
- `npm run test`: This command runs all the tests (unit, integration, and end-to-end) sequentially.

## Expected Output
- **Linting**: The output will indicate whether there are any linting errors or warnings. The pipeline will fail if there are any errors.
- **Unit Testing**: The output will show the results of the unit tests, including pass/fail status and code coverage reports.
- **Integration Testing**: The output will show the results of the integration tests, including pass/fail status and coverage reports.
- **End-to-End Testing**: The output will show the results of the end-to-end tests, including pass/fail status. The pipeline will fail if any test fails.
- **Build**: If running on the `main` branch, the build artifacts will be generated and stored as part of the CI workflow.

## Solution Explanation and Screenshots

### Introduction
This section provides an explanation of each element of the CI pipeline, how it works, and how it integrates into the overall DevOps process. Screenshots are provided to demonstrate the completion of each requirement.

### Static Code Analysis (Linting)
- Explanation: We use ESLint for static code analysis to ensure that the code adheres to a consistent style and to catch potential errors early.
- Purpose: Improves code quality and maintainability.
- Integration: Integrated into the CI pipeline to run on every push and pull request.
- Screenshot: 

### Unit Testing
- Explanation: Jest is used for unit testing to verify that individual units of the code function as expected.
- Purpose: Ensures code correctness and prevents regressions.
- Integration: Runs as part of the CI pipeline to validate code changes.
- Screenshot: 

### Integration Testing
- Explanation: Integration tests are used to ensure that different parts of the application work together correctly.
- Purpose: Validates the interactions between different components of the application.
- Integration: Executed during the CI pipeline to catch issues in integrated code.
- Screenshot: 

### End-to-End Testing
- Explanation: Playwright is used for end-to-end testing to simulate user interactions and verify the application's behavior from the user interface perspective.
- Purpose: Ensures that the application functions as expected in a real-world scenario.
- Integration: Part of the CI pipeline to validate the entire application workflow.
- Screenshot: 

### Code Coverage
- Explanation: Code coverage tools are used to measure the percentage of code that is tested by unit and integration tests.
- Purpose: Ensures that the most critical parts of the codebase are tested.
- Integration: Coverage reports are generated and checked as part of the CI pipeline.
- Screenshot: 

## Repository Structure
```
S3962053-ASSIGNMENT-1/
├── .github/
│ └── workflows/
│ └── ci.yml
├── models/
│ └── note.js
├── routes/
│ └── notes.js
├── views/
│ ├── index.ejs
│ └── new.ejs
├── tests/
│ ├── unit/
│ │ └── notes.test.js
│ ├── integration/
│ │ └── notes.integration.test.js
│ └── e2e/
│ └── notes.e2e.test.js
├── app.js
├── package-lock.json
├── package.json
├── .env
├── .gitignore
├── .gitattributes
├── README.md
└── analysis.txt
```

## How to Contribute
1. Create a new branch for your feature:
    ```bash
    git checkout -b feature/your-feature-name
    ```

2. Commit your changes:
    ```bash
    git commit -m 'Add some feature'
    ```

3. Push to the branch:
    ```bash
    git push origin feature/your-feature-name
    ```

4. Create a pull request.

## Contact Information
For any questions or support, please contact Gia Tin Huynh Duc at s3962053@rmit.edu.vn.

