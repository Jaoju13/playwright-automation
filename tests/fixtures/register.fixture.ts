import { test as base } from '@playwright/test'; 
/*test เดิมของ Playwright → เปลี่ยนชื่อเป็น base เพราะเราจะ “extend” มัน
เปรียบเทียบ:
      base = test ดั้งเดิม
      test ใหม่ = test + ของที่เราเพิ่มเข้าไป (fixtures)
*/

import {
  LoginPage,
  RegisterContactPage,
  RegisterOtpmailPage,
  RegisterOtpPhonePage,
  RegisterProfilePage,
  Checkregistrationinformation,
  RegisterSuccessPage
} from '../pages/auth/register.page';

import { registerData } from '../data/auth/register.data';

type RegisterFixtures = { //Type ของ fixtures
  loginPage: LoginPage;
  registerContact: RegisterContactPage;
  otpMail: RegisterOtpmailPage;
  otpPhone: RegisterOtpPhonePage;
  profilePage: RegisterProfilePage;
  CheckInfoPage: Checkregistrationinformation
  registersuccesspage:RegisterSuccessPage
};
/*
ความหมาย
      บอก TypeScript ว่า fixture เรามีอะไรบ้าง
      เพื่อให้ autocomplete / ไม่ error
*/

export const test = base.extend<RegisterFixtures>({ //extend fixtures : สร้าง test เวอร์ชันใหม่ ที่มี fixture เพิ่มเข้ามา
  
  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto(registerData.PATH);
    await use(login); 
  },
/*
1. loginPage: async (...) => {} 
      - loginPage : ชื่อ fixture 
      - async (...) => {} : function คล้ายกับ const myFunc = async () => {} แค่เขียนแบบ object property
2. ({ page }, use) 👉 parameter ของ functionมี 2 ตัว
      ✅ page
            ของ built-in จาก Playwright
            browser page
      ✅ use
            function สำคัญมาก
            ใช้ “ส่งค่าออกจาก fixture”

3. const login = new LoginPage(page); 👉 สร้าง POM
4. await login.goto(...) 👉 setup ก่อนใช้
5. await use(login); 👉 จุดสำคัญที่สุด
แปลว่า: ส่ง login ไปให้ spec ใช้ เหมือนคำสั่ง return login;

fixture = เตรียมของ → ส่งให้ test ใช้

โครงสร้าง
      ชื่อ fixture = (ของที่มีอยู่, use) => {
      เตรียมของใหม่
      use(ของใหม่)
      }
Fixture จะถูกสร้าง ต่อ test case ไม่ใช่ต่อ group ดังนั้นในไฟล์ spec ต้องไปใส่ใน test('ชื่อเคส', async ({ชื่อ Fixture, page }) => {
*/

  registerContact: async ({ loginPage, page }, use) => { 
  //fixture นี้ “เรียกใช้ fixture อื่นได้” 👉 loginPage ถูก inject(ใส่เข้ามา) มาให้เลย

    await loginPage.openRegisterForm();
    const register = new RegisterContactPage(page);
    await use(register);
  },
/*
 ไปเรียกใช้ตัว loginPage ข้างบนให้ login มาให้เลย ถูก inject มาให้เลย
*/


  otpMail: async ({ page }, use) => {
    const otp = new RegisterOtpmailPage(page); //ไปเรียกใช้ฟังชันก์ใน page ที่เขียนไว้ 
    await use(otp);
  },

  otpPhone: async ({ page }, use) => {
    const otp = new RegisterOtpPhonePage(page);
    await use(otp);
  },

  profilePage: async ({ page }, use) => {
    const profile = new RegisterProfilePage(page);
    await use(profile);
  },

  CheckInfoPage: async ({ page }, use) => {
    const CheckInfo = new Checkregistrationinformation(page);
    await use(CheckInfo);
  },

  registersuccesspage: async ({ page }, use) => {
    const registersuccess = new RegisterSuccessPage(page);
    await use(registersuccess);
  },

});

export { expect } from '@playwright/test'; //ทำให้ import จากที่เดียวได้:

/*
lifecycle
      fixture เริ่ม
      ↓
      setup
      ↓
      use() ← test รันตรงนี้
      ↓
      cleanup (ถ้ามี)

สรุปสั้นมาก
      base.extend() → สร้าง test ใหม่
      fixture: async ({}, use) → นิยาม fixture
      use() → ส่งค่าให้ test ส่งไปให้ไฟล์ spec ใช้
      ใช้ fixture อื่นได้ใน fixture
*/