# COSC2759 Assignment 1

# Alpine Inc Notes Application CI Pipeline

## Author Information
- Full Name/Names: Gia Tin Huynh Duc
- Student ID/IDs: 3962053


## Overview

This repository contains the source code for the Alpine Inc Notes Application, along with a Continuous Integration (CI) pipeline configured using GitHub Actions. The CI pipeline automates the build, testing, and artifact generation processes, ensuring high-quality and reliable deployments. The application is built using Node.js, Express, and MongoDB, and includes comprehensive unit, integration, and end-to-end tests.

## Table of Contents

1. [Installation and Setup](#installation-and-setup)
2. [Repository Structure](#repository-structure)
3. [CI Pipeline Configurations](#ci-pipeline-configurations)
   - [Linting](#linting)
   - [Unit Testing](#unit-testing)
   - [Integration Testing](#integration-testing)
   - [End-to-End Testing](#end-to-end-testing)
   - [Code Coverage](#code-coverage)
   - [Build](#build)
4. [Contribution Guidelines](#contribution-guidelines)
5. [Contact Information](#contact-information)

## Installation and Setup
 
### Prerequisites
- Node.js: Install Node.js from [the Node.js official website](https://nodejs.org/).
- MongoDB: Install MongoDB Community Edition from [the official MongoDB website](https://www.mongodb.com/try/download/community) and ensure it is running locally.

### Steps to Set Up the Project Locally
1. Clone the repository:
First, clone the repository to your local machine using the following command:
bash
```
git clone https://github.com/rmit-sdo-2024-s2/s3962053-assignment-1.git
cd s3962053-assignment-1
```

2. Install dependencies:
Next, install the necessary Node.js dependencies:
bash
```
npm install
```

3. Set up environment variables
Ensure you have a .env file in the src/ directory with the necessary environment variables configured. This file should include details like the MongoDB connection string and any other configuration variables your application requires.

4. Start the MongoDB Server:
Before running the application, you need to start the MongoDB server. Use the following command:
bash 
```
sudo systemctl start mongod
```
- You can check the status of the MongoDB service with `sudo systemctl status mongod` to ensure it is running.
5. Start the Application
bash 
```
npm start
```
The application should start successfully, and it should be accessible at http://localhost:3000 (or the port specified in your  environment variables).

## Repository Structure
```
S3962053-ASSIGNMENT-1/
├── .github/
│   └── workflows/
│       └── ci-pipeline.yml         # CI pipeline configuration
├── img/                            # Screenshots
├── src/
│   ├── .env                        # Environment variables
│   ├── .eslintrc.yml               # ESLint configuration
│   ├── README.md                   # Additional project information
│   ├── app.js                      # Main application code
│   ├── jest.config.js              # Jest configuration for testing
│   ├── package-lock.json           # Lockfile for Node.js dependencies
│   ├── package.json                # Project dependencies and scripts
│   ├── playwright.config.ts        # Playwright configuration for e2e testing
│   ├── coverage/                   # Code coverage reports
│   ├── models/
│   │   └── note.js                 # Mongoose model for notes
│   ├── routes/
│   │   └── notes.js                # Express routes for notes
│   ├── tests/
│   │   ├── e2e/
│   │   │   └── newnote.spec.ts     # End-to-end tests using Playwright
│   │   ├── integration/
│   │   │   └── note.test.js        # Integration tests
│   │   └── unit/
│   │       └── model.note.test.js  # Unit tests
│   ├── views/
│   │   ├── index.ejs               # Homepage view
│   │   └── new.ejs                 # View for creating a new note
└── README.md                       # This README file
```

## CI Pipeline Configurations

### Pipeline Triggers
The CI pipeline is defined in the `.github/workflows/ci-pipeline.yml` file and is automatically triggered on the following events:
- Pushes to the main branch: This includes any direct commits to the main branch.
- Pushes to any feature/* branch: This ensures that new features are tested before being merged into the main branch.
- Pull requests to the main branch: Any pull request targeting the main branch will trigger the pipeline to validate the changes.

### Pipeline Stages
The pipeline consists of several stages, each responsible for a specific task in the CI process. Here’s a breakdown of each stage:

1. Checkout Code:
Action:
yaml
```
- name: Checkout code
  uses: actions/checkout@v2
```
- Purpose:
  - This stage clones the repository to the GitHub runner, ensuring that the latest version of the code is available for subsequent stages.
- Expected Output:
  - The repository should be successfully checked out with the latest code ready for the next steps.
- Screenshot:
  <div style="text-align: center;">
      <img src="/img/CI Stage 1.png" style="width: 200px; height: auto;" />
  </div>

2. Set Up Node.js Environment 
- Action:
yaml
```
- name: Set up Node.js
  uses: actions/setup-node@v2
  with:
    node-version: 18
```
- Purpose:
  - This stage sets up the Node.js environment on the runner using Node.js version 18, which is necessary for running the application and its tests.
Expected Output:
  - Node.js should be installed and configured correctly without errors.
- Screenshot:
  <div style="text-align: center;">
      <img src="/img/CI Stage 2.png" style="width: 200px; height: auto;" />
  </div>

3. Install Dependencies
- Action:
yaml
```
- name: Install dependencies
  run: |
        npm install
        npx playwright install-deps
  working-directory: ./src
```
- Purpose:
  - This stage installs all necessary dependencies for the project, including the Playwright dependencies needed for end-to-end testing.
- Expected Output:
  - All dependencies should be installed without any issues, preparing the environment for the following stages.
- Screenshot:
  <div style="text-align: center;">
      <img src="/img/CI Stage 3.png" style="width: 200px; height: auto;" />
  </div>

4. Install Playwright Browsers
- Action:
yaml
```
- name: Install Playwright browsers
  run: npx playwright install
  working-directory: ./src
```
- Purpose:
  - This stage installs the required browsers for Playwright, which will be used in the end-to-end testing stage.
- Expected Output:
  - Playwright browsers should be installed successfully, with the environment ready for end-to-end tests.
- Screenshot:
  <div style="text-align: center;">
      <img src="/img/CI Stage 4.png" style="width: 200px; height: auto;" />
  </div>

5. Run Linting
- Action:
yaml
```
- name: Run lint
  run: npm run test-lint
  working-directory: ./src
```
- Purpose:
  - This stage runs ESLint to check the codebase for any style or syntax errors. It helps maintain code quality by catching issues early.
- Expected Output:
  - The linting process should complete successfully if there are no issues. If there are any linting errors, they will be reported, and the pipeline may fail at this stage.
- Screenshot:
  <div style="text-align: center;">
      <img src="/img/CI Stage 5.png" style="width: 200px; height: auto;" />
  </div>

6. Run Unit Tests
- Action:
yaml
```
- name: Run unit tests
  run: npm run test-unit
  working-directory: ./src
```
- Purpose:
  - This stage runs unit tests using Jest, verifying that individual parts of the code function as expected.
- Expected Output:
  - The test results should indicate how many tests passed or failed. Code coverage information will also be displayed.
- Screenshot:
  <div style="text-align: center;">
      <img src="/img/CI Stage 6.png" style="width: 200px; height: auto;" />
  </div>

7. Run Unit Tests
- Action:
yaml
```
- name: Run integration tests
  run: npm run test-integration
  working-directory: ./src
```
- Purpose:
  - This stage runs integration tests to ensure that different modules of the application work together correctly.
Expected Output:
  - Integration tests should pass, showing that the application’s components are correctly integrated. Any failures will be reported in the output.
- Screenshot:
  <div style="text-align: center;">
      <img src="/img/CI Stage 7.png" style="width: 200px; height: auto;" />
  </div>

8. Run End-to-End Tests
- Action:
yaml
```
- name: Run end-to-end tests
  run: npm run test-e2e
  working-directory: ./src
```
- Purpose:
  - This stage runs end-to-end tests using Playwright, simulating user interactions with the application to verify its overall behavior.
- Expected Output:
  - The results should show the success or failure of the end-to-end tests, with detailed error messages if any test fails.
- Screenshot:
  <div style="text-align: center;">
      <img src="/img/CI Stage 8.png" style="width: 200px; height: auto;" />
  </div>

9. Upload Code Coverage
- Action:
yaml
```
- name: Upload code coverage
  uses: actions/upload-artifact@v2
  with:
    name: code-coverage
    path: src/coverage
```
- Purpose:
  - This stage uploads the code coverage reports generated by Jest during the unit and integration testing stages as artifacts, which can be reviewed later.
- Expected Output:
  - The code coverage report should be successfully uploaded and available as an artifact in the CI pipeline.
Screenshot:
  <center>
      <img src="/img/CI Stage 9.png" style="width: 200px; height: auto;" />
  <center>

10. Build Artifacts (Main Branch Only)
- Action:
yaml
```
- name: Build application
  run: npm run build
  working-directory: ./src
```
- Purpose:   
  - This stage builds the application and uploads the build artifacts. It only runs when changes are pushed to the main branch, ensuring that only tested and approved code is packaged for deployment.
- Expected Output:
  - The build process should complete without errors, and the artifacts should be uploaded successfully.
- Screenshot:
  <div style="text-align: center;">
      <img src="/img/CI Stage 1.png" style="width: 200px; height: auto;" />
  </div>

## Commands and Functionalities / Running the CI Pipeline Locally 

### 1. Starting the Application
- Command:
bash
```
sudo systemctl start mongod
npm start
```
- Purpose:
  - The `sudo systemctl start mongod` command ensures that the MongoDB service is running locally, which is required for the application to function properly.
  - The `npm start` command starts the Notes application, making it available at `http://localhost:3000` (or another specified port).
- Expected Output:
 - Confirmation that the MongoDB service has started successfully.
 - A message indicating that the server is running and listening on the specified port.
- Screenshot:

### 2. Static Code Analysis (Linting)
- Command: 
bash
```
npm run test-lint
```
- Tool: ESLint
- Purpose: The purpose of linting in this project is to maintain high code quality and prevent common issues that can arise from poorly written code. By catching these issues early in the CI pipeline, we ensure that only high-quality code is merged into the main branch.
- Integration: Linting runs automatically on every push and pull request. If any linting errors are detected, the pipeline fails, and the issues must be resolved before the code can be merged.
- Expected Output:
 -  If there are no issues, the output will indicate that all files passed the linting checks.
 -  If there are errors or warnings, the output will display them with details about the file and line number where the issue occurred.
- Screenshot:

### 3. Unit Testing
- Command:
bash 
```
npm run test-unit
```
- Tool: Jest
- Purpose: Unit tests help to ensure that each individual function in the application works correctly. In the context of the Notes application, this means verifying that each function related to note management behaves as expected, independent of other parts of the system.
- Integration: Unit tests are automatically executed as part of the CI pipeline whenever changes are pushed or a pull request is made. This helps to catch and fix issues early, before they can affect other parts of the application or be deployed to production.
- Expected Output:
  - A summary of the test results, including the number of tests passed, failed, and skipped.
  - Details of any failed tests, including error messages and stack traces.
  - Code coverage statistics indicating the percentage of code that was tested.
- Screenshot: 

### 4. Integration Testing
- Command: 
bash 
```
npm run test-integration
```
- Tool: Jest
- Purpose: These tests are critical for validating that the Notes application functions correctly as a whole, rather than just in isolated units. This is particularly important for a web application where the frontend, backend, and database must all work together seamlessly.
- Integration: Integration tests run as part of the CI pipeline to validate the interactions between components. Any failure in these tests indicates a potential issue in how the parts of the application work together, which must be resolved before proceeding.
- Expected Output:
  - A summary of the integration test results, showing the number of tests that passed, failed, or were skipped.
  - Specific details on any failed tests or integration issues.
  - Code coverage statistics for the integrated components.
- Screenshot: 

### 5. End-to-End Testing
- Command: 
bash 
```
npm run test-e2e
```
- Tool: Playwright
- Purpose: End-to-end tests ensure that the entire application, including all its components, functions correctly in a production-like environment. This is the final validation step to ensure that users will not encounter issues when using the application.
- Integration: End-to-end tests are run as part of the CI pipeline to validate the full application workflow. The pipeline will fail if any of these tests fail, ensuring that only fully functional and user-ready code is deployed.
- Expected Output:
  - A summary of the end-to-end test results, showing which tests passed or failed.
  - Detailed error messages if any tests fail, including the part of the user flow that encountered an issue.
- Screenshot:

### 6. Building and Deploying Artifacts
- Command: 
bash
```
npm run build
```
- Purpose: Generates build artifacts for deployment, ensuring the application is packaged correctly.
- Integration: The build process is automatically triggered in the CI pipeline but is restricted to the main branch to ensure that only tested and approved code is deployed.
- Expected Output:
  - Confirmation that the build process completed without errors.
  - Details on the build artifacts, including their location and size.
- Screenshot:

### 7. Running All Tests at Once
- Command: 
bash
```
npm run test
```
- Tool: ESLint, Jest, Playwright
- Purpose: This command sequentially runs all the tests configured in the pipeline: linting, unit tests, integration tests, and end-to-end tests. It's a comprehensive command to ensure that all aspects of the application are functioning correctly.
- Expected Output:
  - Linting results (whether any style issues or potential errors were found).
  - Unit Testing results (including the number of tests passed, failed, and the code coverage).
  - Integration Testing results (showing the interaction between various components and their code coverage).
  - End-to-End Testing results (verifying the full user workflow).
- Screenshot:

## Contribution Guidelines

### Working on a New Feature
1. Create a new branch for your feature:
bash
```
git checkout -b feature/your-feature-name
```

2. Commit your changes:
bash
```
git commit -m 'Add some feature'
```

3. Push your branch:
bash
```
git push origin feature/your-feature-name
```

4. Create a pull request against the main branch.

### Review Process
- Make sure your code passes all CI checks before merging.
- Ensure your pull request is reviewed and approved before merging into the main branch.

## Contact Information
For any questions or support, please contact Gia Tin Huynh Duc at s3962053@rmit.edu.vn.
