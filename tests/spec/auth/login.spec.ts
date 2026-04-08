import { test, expect } from '@playwright/test'; 
import { LoginPage,OtpPage,HomePage,ModelError} from '../../pages/auth/login.page'; 
import { loginData } from '../../data/auth/login.data'; 

test.describe('Login - By Phone', () => {  
      let loginPage: LoginPage; 
      /*
      จองที่ : let loginPage; = ตัวแปรกลางไว้แชร์ ใช้คู่กับ beforeEach ทำให้ทุก test ใช้ object เดียวกันได้
      ถ้า let loginPage; ตัว TypeScript infer จะไม่รู้ว่าเป็นตัวแปรประเภทอะไร
      
      let loginPage: LoginPage;
            แปลว่า: “จองตัวแปรชื่อ loginPage ไว้ และมันจะต้องเก็บ object ที่เป็น LoginPage เท่านั้น”
      */
      test.beforeEach(async ({ page }) => { // code ที่อยากให้รันก่อนจะเริ่มทุก test
            loginPage = new LoginPage(page); //เรียกใช้ loginPage
            await loginPage.goto(loginData.PATH);
      });

      test('Login with Phone- Both inputs are NULL', async ({ page }) => {
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.LoginByPhone('','');
            await page.click('body'); 
            await expect(loginPage.phoneError).toHaveText('โปรดระบุเบอร์โทรศัพท์');
            await expect(loginPage.passwordError).toHaveText('โปรดระบุรหัสผ่าน');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone - Password is null', async ({ page }) => {
            const UserAlready = loginData.UserAlready;
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');

            //Pass Null
            await loginPage.LoginByPhone(UserAlready.phone,'');
            await expect(loginPage.passwordError).toHaveText('โปรดระบุรหัสผ่าน');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone - Phone is null', async ({ page }) => {
            const UserAlready = loginData.UserAlready;
            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');

            //Phone Null
            await loginPage.LoginByPhone('',UserAlready.pass);
            await expect(loginPage.phoneError).toHaveText('โปรดระบุเบอร์โทรศัพท์');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone - Input more than 10 digit', async ({ page }) => {
            const UserInvalid = loginData.UserInvalid;

            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.LoginByPhone(UserInvalid.phonemore,UserInvalid.pass); 
            await expect(loginPage.phoneError).toHaveText('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone - Input less than 10 digit', async ({ page }) => {
            const UserInvalid = loginData.UserInvalid;

            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.LoginByPhone(UserInvalid.phoneless,UserInvalid.pass); 
            await expect(loginPage.phoneError).toHaveText('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone- Input Wrong Format', async ({ page }) => {
            const UserInvalid = loginData.UserInvalid;

            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.LoginByPhone(UserInvalid.phoneInvalid,UserInvalid.pass); 
            await expect(loginPage.phoneError).toHaveText('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone- Input with email', async ({ page }) => {
            const UserAlready = loginData.UserAlready;
            const UserInvalid = loginData.UserInvalid;

            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.LoginByPhone(UserAlready.email,UserInvalid.pass); 
            await expect(loginPage.phoneError).toHaveText('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Phone- Incorrect phone number', async ({ page }) => {
            const UserAlready = loginData.UserAlready;
            const UserNoData = loginData.UserNoData;

            await loginPage.LoginByPhone(UserNoData.phone,UserAlready.pass); 
            await expect(loginPage.loginBtn).toBeEnabled();
            await loginPage.clickLogin();

            const modelError = new ModelError(page);
            await modelError.Model.isVisible();
            await expect(modelError.Title).toContainText('ขออภัยในความไม่สะดวก');
            await expect(modelError.Description).toContainText(/บัญชีหรือรหัสผ่านไม่ถูกต้อง\s*โปรดลองอีกครั้ง/);

           await modelError.clickOk();

            // ตรวจสอบว่า modal หายไป
            await expect(modelError.Model).toHaveCount(0);
      });

      test('Login with Phone- Incorrect Password', async ({ page }) => {
            const UserAlready = loginData.UserAlready;
            const UserNoData = loginData.UserNoData;

            await loginPage.LoginByPhone(UserAlready.phone,UserNoData.pass); 
            await expect(loginPage.loginBtn).toBeEnabled();
            await loginPage.clickLogin();

            const modelError = new ModelError(page);
            await modelError.Model.isVisible();
            await expect(modelError.Title).toContainText('ขออภัยในความไม่สะดวก');
            await expect(modelError.Description).toContainText(/บัญชีหรือรหัสผ่านไม่ถูกต้อง\s*โปรดลองอีกครั้ง/);

           await modelError.clickOk();

            // ตรวจสอบว่า modal หายไป
            await expect(modelError.Model).toHaveCount(0);
      });

      test('Login with Phone- Login success', async ({ page }) => {
            const UserAlready = loginData.UserAlready;

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
      let loginPage: LoginPage; 
      test.beforeEach(async ({ page }) => { 
            loginPage = new LoginPage(page); 
            await loginPage.goto(loginData.PATH);

            await expect(loginPage.changeBtn).toHaveText('เข้าสู่ระบบด้วยอีเมล');
            await loginPage.ChangeMethod();
      });

      test('Login with Email- Both inputs are NULL', async ({ page }) => {
            await loginPage.LoginByEmail('','');
            await page.click('body'); 
            await expect(loginPage.emailError).toHaveText('โปรดระบุอีเมล');
            await expect(loginPage.passwordError).toHaveText('โปรดระบุรหัสผ่าน');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Email - password null', async ({ page }) => {
            const UserAlready = loginData.UserAlready;

            //Pass Null
            await loginPage.LoginByEmail(UserAlready.email,'');
            await expect(loginPage.passwordError).toHaveText('โปรดระบุรหัสผ่าน');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Email - email is null', async ({ page }) => {
            const UserAlready = loginData.UserAlready;

            //email Null
            await loginPage.LoginByEmail ('',UserAlready.pass);
            await expect(loginPage.emailError).toHaveText('โปรดระบุอีเมล');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Email- Input Wrong Format', async ({ page }) => {
            const UserInvalid = loginData.UserInvalid;

            await loginPage.LoginByEmail(UserInvalid.emailInvalid,UserInvalid.pass); 
            await expect(loginPage.emailError).toHaveText('รูปแบบอีเมลไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Email- Input with Phone', async ({ page }) => {
            const UserAlready = loginData.UserAlready;
            const UserInvalid = loginData.UserInvalid;


            await loginPage.LoginByEmail(UserAlready.phone,UserInvalid.pass); 
            await expect(loginPage.emailError).toHaveText('รูปแบบอีเมลไม่ถูกต้อง');
            await expect(loginPage.loginBtn).toBeDisabled();
      });

      test('Login with Email- Incorrect Email', async ({ page }) => {
            const UserAlready = loginData.UserAlready;
            const UserNoData = loginData.UserNoData;

            await loginPage.LoginByEmail(UserNoData.email,UserAlready.pass); 
            await expect(loginPage.loginBtn).toBeEnabled();
            await loginPage.clickLogin();

            const modelError = new ModelError(page);
            await modelError.Model.isVisible();
            await expect(modelError.Title).toContainText('ขออภัยในความไม่สะดวก');
            await expect(modelError.Description).toContainText(/บัญชีหรือรหัสผ่านไม่ถูกต้อง\s*โปรดลองอีกครั้ง/);

           await modelError.clickOk();

            // ตรวจสอบว่า modal หายไป
            await expect(modelError.Model).toHaveCount(0);
      });

      test('Login with Email- Incorrect Password', async ({ page }) => {
            const UserAlready = loginData.UserAlready;
            const UserNoData = loginData.UserNoData;

            await loginPage.LoginByEmail(UserAlready.email,UserNoData.pass); 
            await expect(loginPage.loginBtn).toBeEnabled();
            await loginPage.clickLogin();

            const modelError = new ModelError(page);
            await modelError.Model.isVisible();
            await expect(modelError.Title).toContainText('ขออภัยในความไม่สะดวก');
            await expect(modelError.Description).toContainText(/บัญชีหรือรหัสผ่านไม่ถูกต้อง\s*โปรดลองอีกครั้ง/);

           await modelError.clickOk();

            // ตรวจสอบว่า modal หายไป
            await expect(modelError.Model).toHaveCount(0);
      });

      test('Login with Phone- Login success', async ({ page }) => {
            const UserAlready = loginData.UserAlready;

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