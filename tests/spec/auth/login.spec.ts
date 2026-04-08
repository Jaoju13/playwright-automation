import { test, expect } from '@playwright/test'; 
import { LoginPage,OtpPage,HomePage} from '../../pages/auth/login.page'; 
import { loginData } from '../../data/auth/login.data'; 

test.describe('Login - By Phone', () => { 

      test('Login with Phone- Both inputs are NULL', async ({ page }) => {
            const loginPage = new LoginPage(page);

            await loginPage.goto(loginData.PATH);
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.LoginByPhone('','');
            await page.click('body'); 
            await expect(loginPage.phoneError).toHaveText('โปรดระบุเบอร์โทรศัพท์');
            await expect(loginPage.passwordError).toHaveText('โปรดระบุรหัสผ่าน');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone - Either is null', async ({ page }) => {
            const UserAlready = loginData.UserAlready;

            const loginPage = new LoginPage(page);
            await loginPage.goto(loginData.PATH);
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');

            //Pass Null
            await loginPage.LoginByPhone(UserAlready.phone,'');
            await expect(loginPage.passwordError).toHaveText('โปรดระบุรหัสผ่าน');
            await expect(loginPage.loginBtn).toBeDisabled();

            //Phone Null
            await loginPage.LoginByPhone('',UserAlready.pass);
            await expect(loginPage.phoneError).toHaveText('โปรดระบุเบอร์โทรศัพท์');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone - Input more than 10 digit', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const UserInvalid = loginData.UserInvalid;

            await loginPage.goto(loginData.PATH);
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.LoginByPhone(UserInvalid.phonemore,UserInvalid.pass); 
            await expect(loginPage.phoneError).toHaveText('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone - Input less than 10 digit', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const UserInvalid = loginData.UserInvalid;

            await loginPage.goto(loginData.PATH);
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.LoginByPhone(UserInvalid.phoneless,UserInvalid.pass); 
            await expect(loginPage.phoneError).toHaveText('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone- Input Wrong Format', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const UserInvalid = loginData.UserInvalid;

            await loginPage.goto(loginData.PATH);
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.LoginByPhone(UserInvalid.phoneInvalid,UserInvalid.pass); 
            await expect(loginPage.phoneError).toHaveText('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone- Input with email', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const UserAlready = loginData.UserAlready;
            const UserInvalid = loginData.UserInvalid;

            await loginPage.goto(loginData.PATH); 
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.LoginByPhone(UserAlready.email,UserInvalid.pass); 
            await expect(loginPage.phoneError).toHaveText('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone- Login success', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const UserAlready = loginData.UserAlready;

            await loginPage.goto(loginData.PATH); 
            await loginPage.LoginByPhone(UserAlready.phone,UserAlready.pass); 
            await expect(loginPage.loginBtn).toBeEnabled();
            await loginPage.clickLogin();

            const otppage = new OtpPage(page);
            await otppage.InputOtp('1234');
            await otppage.ConfirmedOtp();

            const homePage = new HomePage(page);
            await expect(homePage.homepageTitle).toContainText(/อัตราค่าเบี้ยประกันภัย\s*พ\.ร\.บ\.\s*รถจักรยานยนต์\s*ตามที่กฎหมายกำหนด/) // \s* มีช่องว่างหรือเว้นบรรทัดทั้งหมด จับหมด 
      });
});

//Email
test.describe('Login - By Email', () => { 

      test('Login with Email- Both inputs are NULL', async ({ page }) => {
            const loginPage = new LoginPage(page);

            await loginPage.goto(loginData.PATH);
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.ChangeMethod();
            await loginPage.LoginByEmail('','');
            await page.click('body'); 
            await expect(loginPage.emailError).toHaveText('โปรดระบุอีเมล');
            await expect(loginPage.passwordError).toHaveText('โปรดระบุรหัสผ่าน');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Email - Either is null', async ({ page }) => {
            const UserAlready = loginData.UserAlready;

            const loginPage = new LoginPage(page);
            await loginPage.goto(loginData.PATH);
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.ChangeMethod();

            //Pass Null
            await loginPage.LoginByEmail(UserAlready.email,'');
            await expect(loginPage.passwordError).toHaveText('โปรดระบุรหัสผ่าน');
            await expect(loginPage.loginBtn).toBeDisabled();

            //email Null
            await loginPage.LoginByEmail ('',UserAlready.pass);
            await expect(loginPage.emailError).toHaveText('โปรดระบุอีเมล');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Email- Input Wrong Format', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const UserInvalid = loginData.UserInvalid;

            await loginPage.goto(loginData.PATH);
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.ChangeMethod();

            await loginPage.LoginByEmail(UserInvalid.emailInvalid,UserInvalid.pass); 
            await expect(loginPage.emailError).toHaveText('รูปแบบอีเมลไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Email- Input with Phone', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const UserAlready = loginData.UserAlready;
            const UserInvalid = loginData.UserInvalid;

            await loginPage.goto(loginData.PATH); 
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.ChangeMethod();

            await loginPage.LoginByEmail(UserAlready.phone,UserInvalid.pass); 
            await expect(loginPage.emailError).toHaveText('รูปแบบอีเมลไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone- Login success', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const UserAlready = loginData.UserAlready;

            await loginPage.goto(loginData.PATH);
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล'); 
            await loginPage.ChangeMethod();

            await loginPage.LoginByEmail(UserAlready.email,UserAlready.pass); 
            await expect(loginPage.loginBtn).toBeEnabled();
            await loginPage.clickLogin();

            const otppage = new OtpPage(page);
            await otppage.InputOtp('1234');
            await otppage.ConfirmedOtp();

            const homePage = new HomePage(page);
            await expect(homePage.homepageTitle).toContainText(/อัตราค่าเบี้ยประกันภัย\s*พ\.ร\.บ\.\s*รถจักรยานยนต์\s*ตามที่กฎหมายกำหนด/) // \s* มีช่องว่างหรือเว้นบรรทัดทั้งหมด จับหมด 
      });
});