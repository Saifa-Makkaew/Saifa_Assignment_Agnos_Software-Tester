Saifa_Assignment_Agnos_Software-Tester
Automated UI tests for the Agnos Health registration page using Playwright.

 Prerequisites
Node.js >= 18.x
npm (comes with Node.js)
Playwright
Setup
Clone the repository:
git clone https://github.com/Saifa-Makkaew/Saifa_Assignment_Agnos_Software-Tester.git
cd Saifa_Assignment_Agnos_Software-Tester

2.Install dependencies:npm install

3.Install Playwright browsers:npx playwright install

Running Tests  
Run all tests in headed mode (browser visible): npx playwright test

Run tests in headless mode: npx playwright test --headed=false

Test Artifacts  
Screenshots: test-results/<test-name>/  
Videos: test-results/<test-name>/video.webm  
Trace: test-results/<test-name>/trace.zip  

Test Cases  
TC_Register_0001: Load registration page  
TC_Register_0002: Empty form → button disabled  
TC_Register_0003: Only email filled → should fail  
TC_Register_0004: Email+Password filled → should fail  
TC_Register_0005: All fields invalid → should fail  
TC_Register_0006: Invalid email → should fail  
TC_Register_0007: Password mismatch → should fail  
TC_Register_0008: Invalid password → should fail  
TC_Register_0009: Valid registration → should pass  

Notes  
Screenshots and videos are automatically captured for each test.  
HTML notes are injected to indicate the test step and result.  
