import { Page, Locator, expect} from '@playwright/test';

export class LoginPage {
      readonly page: Page;
      readonly acceptCookieBtn: Locator;
      readonly Forgotpassword: Locator;
      readonly nationality: Locator;
      readonly citizenNo: Locator;
      readonly dateOfBirth: Locator;
      readonly NextBtn: Locator;
      readonly nationalityError: Locator;
      readonly citizenNoError: Locator;
      readonly ModalError: Locator;
      

      constructor(page: Page) {
            this.page = page;
            this.acceptCookieBtn = page.locator('footer button');
            this.Forgotpassword  = page.locator('#phoneNumber');
            this.nationality = page.locator('#email');
            this.citizenNo = page.locator('#password');
            this.dateOfBirth = page.locator('#direct-change-username');
            this.NextBtn = page.locator('#direct-login-submit');
            this.nationalityError = page.locator('#phoneNumber + small');
            this.citizenNoError = page.locator('#email + small');
            this.ModalError = page.locator('#errorCustomerServiceModal_container__kNURz');
      }

      //เข้าหน้า login
      async goto(Path : string) {
            await this.page.goto(Path);
      }

      // async LoginByPhone(phone: string, password: string) {
      //       await this.phoneInput.fill(phone);
      //       await this.passwordInput.fill(password);
      //       await this.page.click('body');
      // }

      // async LoginByEmail(email: string, password: string) {
      //       await this.emailInput.fill(email);
      //       await this.passwordInput.fill(password);
      //       await this.page.click('body');
      // }
      
      // async ChangeMethod(){
      //       await this.changeBtn.click();
      // }

      // async clickLogin(){
      //       await this.loginBtn.click();
      // }
}
