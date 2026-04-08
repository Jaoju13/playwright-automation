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

export class ModelError {
      readonly page: Page;
      readonly Model: Locator;
      readonly Title: Locator;
      readonly Description: Locator;
      readonly OkBtn: Locator;


      constructor(page: Page) {
            this.page = page;
            this.Model = page.locator('.modal_inside__WQvUw'); // container ของ modal
            this.Title = this.Model.locator('h1');
            this.Description = this.Model.locator('p');  
            this.OkBtn = this.Model.locator('#direct-warning-login-confirm');
      }

      async clickOk() {
            await this.OkBtn.click();
      }

      async getErrorMessage(): Promise<string> {
            return await this.Description.textContent() ?? ''; 
      /*
            .textContent() เป็น Playwright method ที่ดึงข้อความทั้งหมดใน element
                 - จะได้ "บัญชีหรือรหัสผ่านไม่ถูกต้อง\nโปรดลองอีกครั้ง"
                 - จะไม่รวม tag <br> แต่จะแปลงเป็น newline \n
                 
            ?? '' หมายถึง ถ้าไม่ได้ข้อความ จะคืนค่าเป็น string ว่าง ไม่ทำให้เกิด error
      */
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