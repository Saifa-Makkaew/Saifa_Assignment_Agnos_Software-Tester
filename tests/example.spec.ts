import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';  // ใช้ fs ของ Node.js ปกติ

const URL = 'https://dev.app.agnoshealth.com/ai_dashboard/agnos/sign_up/';
const VALID_PASSWORD = 'Valid@123';

// ======================
// Helper Functions
// ======================

// Replace illegal Windows filename chars
function sanitizeFileName(name: string) {
  return name.replace(/[<>:"/\\|?*]/g, '_');
}

// สร้าง folder ถ้ายังไม่มี
function ensureDirSync(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// สร้าง screenshot และเก็บตามชื่อ TC + step
async function shot(page, testInfo, step: string) {
  const sanitizedTitle = sanitizeFileName(testInfo.title); // sanitize ชื่อเทส
  const dir = path.join('test-results', sanitizedTitle);
  ensureDirSync(dir);
  const filePath = path.join(dir, `TC_${sanitizedTitle}-${step}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
}

// แสดงข้อความ note บนหน้าเว็บ
async function addHTMLNote(page, message: string, type: 'info' | 'success' | 'fail' = 'info') {
  const colors = { info: 'rgba(0,0,255,0.8)', success: 'rgba(0,128,0,0.8)', fail: 'rgba(255,0,0,0.8)' };
  await page.evaluate(({ msg, color }) => {
    const note = document.createElement('div');
    note.id = 'playwright-note';
    note.style.position = 'fixed';
    note.style.bottom = '0';
    note.style.left = '0';
    note.style.width = '100%';
    note.style.background = color;
    note.style.color = 'white';
    note.style.fontSize = '14px';
    note.style.padding = '8px';
    note.style.zIndex = '9999';
    note.innerHTML = msg;
    document.body.appendChild(note);
  }, { msg: message, color: colors[type] });
}

// ลบ HTML note
async function removeHTMLNote(page) {
  await page.evaluate(() => {
    const note = document.getElementById('playwright-note');
    if (note) note.remove();
  });
}

// กรอกฟอร์ม registration
async function fillForm(page, email: string, password: string, confirm: string) {
  const inputs = page.locator('input');
  await inputs.nth(0).fill(email);
  await inputs.nth(1).fill(password);
  await inputs.nth(2).fill(confirm);
}

// ตรวจสอบการ submit ฟอร์ม + บันทึก screenshot + HTML note
async function checkSubmission(page, testInfo, stepName: string, expectedFail: boolean, descTH: string, descEN: string) {
  const btn = page.getByRole('button', { name: 'Confirm' });
  const fullDesc = `${descTH} / ${descEN}`;

  // แสดง note ก่อน submit
  await addHTMLNote(page, fullDesc, 'info');
  testInfo.annotations.push({ type: 'note', description: fullDesc });
  await shot(page, testInfo, `${stepName}-before-click`);

  if (await btn.isEnabled()) await btn.click();

  // รอ redirect ไป login/sign_in
  let redirectedToLogin = false;
  try { 
    await page.waitForURL(/login|sign_in/, { timeout: 10000 });
    redirectedToLogin = true; 
  } catch {}

  await shot(page, testInfo, `${stepName}-after-click`);
  await removeHTMLNote(page);

  // ตรวจสอบผลลัพธ์
  if (redirectedToLogin && expectedFail) {
    await addHTMLNote(page, 'BUG: Form submitted แต่ควร fail / Form submitted — BUG!', 'fail');
    testInfo.annotations.push({ type: 'bug', description: 'Form submitted — BUG!' });
    await shot(page, testInfo, `${stepName}-bug`);
    await removeHTMLNote(page);
    test.fail(true, 'Form submitted — BUG!');
  } else if (!redirectedToLogin && !expectedFail) {
    await addHTMLNote(page, 'BUG: Form ไม่ submit ทั้งที่ควรผ่าน / Form not submitted — BUG!', 'fail');
    testInfo.annotations.push({ type: 'bug', description: 'Form not submitted — BUG!' });
    await shot(page, testInfo, `${stepName}-bug`);
    await removeHTMLNote(page);
    test.fail(true, 'Form not submitted — BUG!');
  } else {
    await addHTMLNote(page, 'ผลลัพธ์ตรงตามคาด / As expected', 'success');
    await shot(page, testInfo, `${stepName}-pass`);
    await removeHTMLNote(page);
  }
}

// ======================
// Test Cases
// ======================

// TC01: Load registration page
test('TC_Register_0001: Load page', async ({ page }, testInfo) => {
  await page.goto(URL);
  const descTH = 'โหลดหน้า register';
  const descEN = 'Load registration page';
  await addHTMLNote(page, `${descTH} / ${descEN}`, 'info');
  testInfo.annotations.push({ type: 'note', description: `${descTH} / ${descEN}` });
  await shot(page, testInfo, 'load-page');
  await removeHTMLNote(page);
  await expect(page.getByText('Create Account')).toBeVisible();
});

// TC02: Empty form
test('TC_Register_0002: Empty form', async ({ page }, testInfo) => {
  await page.goto(URL);
  const descTH = 'ฟอร์มว่าง → ปุ่ม disabled';
  const descEN = 'Empty form → button disabled';
  await addHTMLNote(page, `${descTH} / ${descEN}`, 'info');
  testInfo.annotations.push({ type: 'note', description: `${descTH} / ${descEN}` });
  await shot(page, testInfo, 'empty-form');
  await removeHTMLNote(page);

  const btn = page.getByRole('button', { name: 'Confirm' });
  await expect(btn).toBeDisabled();
});

// TC03 : Only email filled
test('TC_Register_0003: Only email filled', async ({ page }, testInfo) => {
  await page.goto(URL);
  await fillForm(page, 'test@mail.com', '', '');
  await checkSubmission(page, testInfo, 'email-only', true, 
    'กรอกแค่ email → ปุ่ม disabled', 
    'Only email filled → button disabled'
  );
});

// TC04 : Email+Password filled
test('TC_Register_0004: Email+Password filled', async ({ page }, testInfo) => {
  await page.goto(URL);
  await fillForm(page, 'test@mail.com', VALID_PASSWORD, '');
  await checkSubmission(page, testInfo, 'email-password', true, 
    'Email+Password, confirm empty → ปุ่ม disabled', 
    'Email+Password, confirm empty → Button disabled'
  );
});

// TC05 : All fields invalid
test('TC_Register_0005: All fields invalid', async ({ page }, testInfo) => {
  await page.goto(URL);
  await fillForm(page, 'invalid-email', 'short', 'Mismatch@1');
  await checkSubmission(page, testInfo, 'all-invalid', true, 
    'กรอกผิดทั้ง 3 ช่อง → ควร fail', 
    'All fields invalid should fail'
  );
});

// TC06 : Invalid email
test('TC_Register_0006: Invalid email', async ({ page }, testInfo) => {
  await page.goto(URL);
  await fillForm(page, 'invalid-email', VALID_PASSWORD, VALID_PASSWORD);
  await checkSubmission(page, testInfo, 'invalid-email', true, 
    'Email ไม่ถูกต้อง → ควร fail', 
    'Invalid email should fail'
  );
});

// TC07 : Password mismatch
test('TC_Register_0007: Password mismatch', async ({ page }, testInfo) => {
  await page.goto(URL);
  await fillForm(page, 'test@mail.com', VALID_PASSWORD, 'Wrong@123');
  await checkSubmission(page, testInfo, 'password-mismatch', true, 
    'Password และ confirm ไม่ตรงกัน → ควร fail', 
    'Password mismatch should fail'
  );
});

// TC08 : Invalid password
test('TC_Register_0008: Invalid password', async ({ page }, testInfo) => {
  await page.goto(URL);
  await fillForm(page, 'test@mail.com', 'short', 'short');
  await checkSubmission(page, testInfo, 'invalid-password', true, 
    'รหัสผ่านไม่ถูกต้อง → ควร fail', 
    'Invalid password should fail'
  );
});

// TC09 : Register success
test('TC_Register_0009: Register success', async ({ page }, testInfo) => {
  await page.goto(URL);
  await fillForm(page, `test+${Date.now()}@mail.com`, VALID_PASSWORD, VALID_PASSWORD);
  await checkSubmission(page, testInfo, 'register-success', false, 
    'ข้อมูลถูกต้อง → ควรสมัครสำเร็จ', 
    'Valid data → Registration success'
  );
});