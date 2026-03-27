import { Page, Locator, expect} from '@playwright/test';

export class LoginPage {
      readonly page: Page;
      readonly acceptCookieBtn: Locator;
      readonly phoneInput: Locator;
      readonly emailInput: Locator;
      readonly passwordInput: Locator;
      readonly changeBtn: Locator;
      readonly loginBtn: Locator;
      readonly phoneError: Locator;
      readonly emailError: Locator;
      readonly passwordError: Locator;
      readonly ModalError: Locator;
      

      constructor(page: Page) {
            this.page = page;
            this.acceptCookieBtn = page.locator('footer button');
            this.phoneInput = page.locator('#phoneNumber');
            this.emailInput = page.locator('#email');
            this.passwordInput = page.locator('#password');
            this.changeBtn = page.locator('#direct-change-username');
            this.loginBtn = page.locator('#direct-login-submit');
            this.phoneError = page.locator('#phoneNumber + small');
            this.emailError = page.locator('#email + small');
            this.passwordError = page.locator('#password + small');
            this.ModalError = page.locator('#errorCustomerServiceModal_container__kNURz');
      }

      //เข้าหน้า login
      async goto(Path : string) {
            await this.page.goto(Path);
      }

      async LoginByPhone(phone: string, password: string) {
            await this.phoneInput.fill(phone);
            await this.passwordInput.fill(password);
            await this.page.click('body');
      }

      async LoginByEmail(email: string, password: string) {
            await this.emailInput.fill(email);
            await this.passwordInput.fill(password);
            await this.page.click('body');
      }
      
      async ChangeMethod(){
            await this.changeBtn.click();
      }

      async clickLogin(){
            await this.loginBtn.click();
      }
}

export class OtpPage {
      readonly page: Page;
      readonly OtpInput: Locator;
      readonly ReqOtpBtn: Locator;
      readonly NextBtn: Locator;


      constructor(page: Page) {
            this.page = page;
            this.OtpInput = page.locator('#otp');
            this.ReqOtpBtn = page.getByRole('button', { name: 'ขอรหัสยืนยัน' });
            this.NextBtn = page.getByRole('button', { name: 'ถัดไป' });
      }

      async InputOtp(otp: string) {
            await this.OtpInput.fill(otp);
            await this.page.click('body');
      }

      async ConfirmedOtp(){
            await this.NextBtn.click();
      }
}

export class HomePage {
      readonly page: Page;
      readonly homepageTitle: Locator;


      constructor(page: Page) {
            this.page = page;
            this.homepageTitle = page.locator('.homepage_premiumRate__3oyDf').locator('p').first();
      }
}