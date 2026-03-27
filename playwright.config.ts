import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// 🔧 แก้: โหลด .env เฉพาะตอน local (ถ้า CI มี env แล้วจะไม่โหลดซ้ำ + ไม่ spam log)
if (!process.env.BASE_URL) {
  dotenv.config({ quiet: true });
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests', //บอกว่า test อยู่โฟลเดอร์ไหน Playwright จะไปหาไฟล์ .spec.ts ในโฟลเดอร์นี้ ถ้าเปลี่ยนชื่อโฟลเดอร์ → ต้องมาแก้ตรงนี้

  fullyParallel: true, 
  /* รันพร้อมกันหลายไฟล์ได้ใช่หรือไม่ (ถ้า F แล้วไฟล์พึ่งพาข้อมูลกันตอนรันอาจจะพัง) 
  Fail the build on CI if you accidentally left test.only in the source code. */

  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0, 
  /*ถ้ารัน fail บน ci ให้ retry เทส 2 ครั้ง บนเครืองเรา 0
   Opt out of parallel tests on CI. */

  // 🔧 แก้: เปิด parallel ใน CI ด้วย (จากเดิม 1 worker → ช้ามาก)
  workers: process.env.CI ? 4 : undefined, 
  /*จำนวนเครื่องรัน test : CI ทีละ 1, เครื่องเราพร้อมกันได้ เช่น A หยิบไฟล์เคส 1-2 B หยิบ 3-4 แต่ CI จะเป็น A 1-4 / undefined พร้อมๆกันไปเลอ ให้ Playwright จะใช้จำนวน CPU core อัตโนมัติ
  แปลว่าถ้าไฟล์ 2 กับ 3 ต่อกันแต่คนงานทำไม่พร้อมกันก็พังได้
      → ถ้า process.env.CI เป็นจริง → ใช้ workers = 4
      → ถ้าไม่ใช่ (รันบนเครื่องเรา) → ใช้ undefined
  Reporter to use. See https://playwright.dev/docs/test-reporters */

  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: { //ค่าตั้งต้นของ browser/test ทุกตัว ตั้งค่า default ให้ทุก test ใช้เหมือนกัน

    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL, //เวลามันใช้มันจะดึงตัวนี้ไปต่อให้กับ PATH ที่ตั้งไว้เลย

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry', 
    /*trace = การอัดวิดีโอ + step + network + action ของ test 
    จะเก็บ trace ก็ต่อเมื่อ test fail แล้ว retry รอบแรก */
  },

  /* Configure projects for major browsers เป็นของชีเอง ไม่ใช่ของที่มีในเครื่องเรา*/
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
/*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});