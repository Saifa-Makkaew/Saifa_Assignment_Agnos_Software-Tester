# Saifa Assignment Agnos Software Tester

## 📊 Test Case Document
- 📄 Test Cases (located in `test-report/` folder):  
  [Download](./test-report/Test_Cases_AGNOS.xlsx)   
👉 https://docs.google.com/spreadsheets/d/1SY28-SgIbtM-40UFHpj4AlnloG1FvNq28qtNhQ8aF60/edit?usp=sharing

## 📌 Description
This project contains automated UI tests for the Agnos Health registration page using Playwright.  
The tests cover both positive and negative scenarios to validate form behavior and user input handling.

---

## ⚙️ Setup

1. Clone the repository:
```bash
git clone https://github.com/Saifa-Makkaew/Saifa_Assignment_Agnos_Software-Tester.git
cd Saifa_Assignment_Agnos_Software-Tester

2.Install dependencies:npm install

3.Install Playwright browsers:npx playwright install

Running Tests   
Run all tests in headed mode (browser visible): npx playwright test

Run tests in headless mode: npx playwright test --headed=false

Test Structure
All test scripts are located in the tests/ folder.
example.spec.ts – Contains registration test scenarios

Playwright Configuration
The test configuration is defined in:
playwright.config.ts – Controls test settings such as browser, reporter, screenshot, video, and trace

Test Artifacts  
Screenshots: test-results/test-name/    
Videos: test-results/test-name/video.webm   
Trace: test-results/test-name/trace.zip 

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
Screenshots and videos are captured automatically for each test.
HTML reports are generated after test execution.
Test steps and results are clearly structured for debugging and analysis.
