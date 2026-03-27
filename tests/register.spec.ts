import { test, expect } from '@playwright/test'; //library ที่ติดตั้ง
import { LoginPage,RegisterContactPage, RegisterOtpmailPage,RegisterOtpPhonePage,RegisterProfilePage,Checkregistrationinformation,RegisterSuccessPage} from '../pages/register.page'; //import class ในไฟล์ POM ที่เราจะใช้ทุกอันใน test นี้
import { registerData } from '../test-data/Register/register.data'; //import class ในไฟล์ data ที่เราจะใช้


test.describe('Register - Contact info', () => { // ชื่อกลุ่มเทสเคส

      test('Contact info - ERROR NULL', async ({ page }) => {  //test case จริง
            const loginPage = new LoginPage(page);
            await loginPage.goto(registerData.PATH);
            await loginPage.openRegisterForm();

            const registerPage = new RegisterContactPage(page); 
            await registerPage.fillContact('', '');
            await page.click('body');
            
            // POM แบบ 1 เวลาใช้ และใช้แบบ toHaveText
            await expect(registerPage.phoneError).toHaveText('โปรดระบุเบอร์โทรศัพท์');
            await expect(registerPage.emailError).toHaveText('โปรดระบุอีเมล'); 
            /* 
            แบบ toHaveText : จุดที่เรียกมาต้องมี text ตรงกับข้อความนี้ถึงจะถูก
            แบบ toBe : ต้องสร้าง () เพื่อไป get ข้อความที่จุดมาก่อนแล้วเอามาเปรียบเทียบกับข้อความใน Tobe() ว่าตรงกันไหม
                  const phoneError = await registerPage.getphoneErrorNull();
                  expect(emailError).toBe('โปรดระบุอีเมล'); เป็นการเปรียบเทียบค่าว่าค่า A ที่ไป get มาตรงกับข้อความ tobe ไหม
                  
            สรุป
                  เรื่อง / toBe / toHaveText
                  ใช้กับ / value / locator
                  auto-wait / ❌ / ✅
                  retry	/ ❌ / ✅
                  ตัดช่องว่างให้เลย / ❌ / ✅
                  เหมาะกับ UI test	/ ไม่แนะนำ / แนะนำ
            
            */
      });

      test('Contact info - ERROR WrongFormat', async ({ page }) => {  
            const loginPage = new LoginPage(page);
            await loginPage.goto(registerData.PATH);
            await loginPage.openRegisterForm();

            const registerPage = new RegisterContactPage(page); 
            await registerPage.fillContact(registerData.WrongFormatUser.phone,registerData.WrongFormatUser.email );
            
            await page.click('body');
            await expect(registerPage.phoneError).toHaveText('เบอร์โทรศัพท์ไม่ถูกต้อง');
            await expect(registerPage.emailError).toHaveText('รูปแบบอีเมลไม่ถูกต้อง');
      });

      test('Contact info - ERROR ALREADY', async ({ page }) => {
            // 1️⃣ Arrange → เตรียมข้อมูล
            // ค่าคงที่ → ใช้ตรง ๆ ได้เลย เช่น registerData.PATH
            const phone = registerData.alreadyUser.phone;
            const email = registerData.alreadyUser.email;

            // ⭐ สำคัญมาก: สร้าง POM object >> เรียกใช้ class POM เช่น RegisterContactPage
            const loginPage = new LoginPage(page);
            
            // 2️⃣ Act → ทำ action บนหน้าเว็บ : object.method()
            await loginPage.goto(registerData.PATH);
            await loginPage.openRegisterForm();

            const registerPage = new RegisterContactPage(page); 
            await registerPage.fillContact(phone, email);
            await registerPage.clickVerify();

            // POM แบบ 2 เวลาใช้
            await expect(registerPage.phoneErrorAlready).toHaveText('เบอร์โทรศัพท์นี้เคยลงทะเบียนใช้งานแล้ว'); 
            await expect(registerPage.emailErrorAlready).toHaveText('อีเมลนี้เคยลงทะเบียนใช้งานแล้ว'); 
      });

      test('Personal info - Valid Contact', async ({ page }) => {  
            const Contact = registerData.validContact(); //⭐⭐ จะสุ่มใหม่เมื่อมีการเขียนแบบนี้ซ้ำเท่านั้น 

            //หน้า login
            const loginPage = new LoginPage(page);
            await loginPage.goto(registerData.PATH);

            //ไปหน้า Contact register
            await loginPage.openRegisterForm();
            
            //หน้า contact
            const registerPage = new RegisterContactPage(page); 
            await registerPage.fillContact(Contact.phoneRandom, Contact.emailRandom); //⭐⭐ อันนี้แค่บอกว่าจะเอาค่าที่ได้จากฟังก์ชันมาใช้ ไม่ใช่เรียกใหม่
            await registerPage.clickVerify();

            //หน้า ยืนยันเมล
            const OTPmaillPage = new RegisterOtpmailPage(page);
            await expect(OTPmaillPage.emailText).toHaveText(Contact.emailRandom);
            await OTPmaillPage.InputOTP(Contact.otp);
            await OTPmaillPage.clickVerify();

            //หน้า ยืนยันเบอร์
            const OTPPhonePage = new RegisterOtpPhonePage(page);
            await expect(OTPPhonePage.PhoneText).toHaveText(Contact.phoneFormat);
            await OTPPhonePage.InputOTP(Contact.otp);
            await OTPPhonePage.clickVerify();

            //หน้า PersonalInfo
            const Prof = new RegisterProfilePage(page);
            await expect(Prof.sectioncontactname).toHaveText("ข้อมูลติดต่อ")
            await expect(Prof.PhoneText).toHaveValue(Contact.phoneRandom);
            await expect(Prof.emailText).toHaveValue(Contact.emailRandom);
            /*
                  Element Type	      Use
                  <div>, <p>, <span>	toHaveText()
                  <input>, <textarea>	toHaveValue()

                  ต้องใช้ valuse เพราะ <input id="email" value="0999925454@gmail.com"> */
      });
});


test.describe('Register - Personal info', () => { 
/*⭐⭐ ถ้าใช้ค่าเดียวกันหลายเคส ก็มาสร้างไว้ตรงนี้ได้ 
 let user; // ใช้ let เพราะ จะมีการเปลี่ยน/ใส่ค่าทีหลัง ถ้าใช้ const คือเปลี่ยนค่าไม่ได้
- beforeAll : เรียกใช้ทีเดียว ใช้ค่าเดียวกันทุกเคส
- beforeEach : เรียกใช้ใหม่เสมอก่อนเริ่มทุกเคส

Hook | รันกี่ครั้ง | ใช้เมื่อ | สำหรับ 
beforeEach	ก่อนทุก test	setup fresh state ใช้ค่าเดียวกันทุกเคส
afterEach	หลังทุก test	cleanup per test
beforeAll	ครั้งเดียวก่อนทั้งหมด	create shared data
afterAll	ครั้งเดียวหลังทั้งหมด	cleanup shared data

** เป็น lifecycle hook ที่ Playwright รู้จักอยู่แล้ว เราไม่ต้อง “เรียก” มันเอง ระบบจะเรียกให้อัตโนมัติก่อนทุก test แค่ประกาศคำสั่งไว้พอ

EX. 

  test.beforeAll(() => {
    user = registerData.validContact(); // ✅ generate ครั้งเดียว
  }); */
      test('Personal info - ERROR Password NULL', async ({ page }) => {  
            const Contact = registerData.validContact(); //⭐⭐ จะสุ่มใหม่เมื่อมีการเขียนแบบนี้ซ้ำเท่านั้น 

            //หน้า login
            const loginPage = new LoginPage(page);
            await loginPage.goto(registerData.PATH);

            //ไปหน้า Contact register
            await loginPage.openRegisterForm();
            
            //หน้า contact
            const registerPage = new RegisterContactPage(page); 
            await registerPage.fillContact(Contact.phoneRandom, Contact.emailRandom); //⭐⭐ อันนี้แค่บอกว่าจะเอาค่าที่ได้จากฟังก์ชันมาใช้ ไม่ใช่เรียกใหม่
            await registerPage.clickVerify();

            //หน้า ยืนยันเมล
            const OTPmaillPage = new RegisterOtpmailPage(page);
            await OTPmaillPage.InputOTP(Contact.otp);
            await OTPmaillPage.clickVerify();

            //หน้า ยืนยันเบอร์
            const OTPPhonePage = new RegisterOtpPhonePage(page);
            await OTPPhonePage.InputOTP(Contact.otp);
            await OTPPhonePage.clickVerify();

            //หน้า Profile
            const Profile = new RegisterProfilePage(page);

            //หน้า Profile - Contact
            await Profile.fillpassword('','');
            await expect(Profile.passwordError).toHaveText("โปรดระบุรหัสผ่าน");
            await expect(Profile.confirmPasswordError).toHaveText("โปรดระบุยืนยันรหัสผ่าน");
            
      });

      test('Personal info - ERROR Passwords do not match', async ({ page }) => {  
            const Contact = registerData.validContact(); 

            //หน้า login
            const loginPage = new LoginPage(page);
            await loginPage.goto(registerData.PATH);

            //ไปหน้า Contact register
            await loginPage.openRegisterForm();
            
            //หน้า contact
            const registerPage = new RegisterContactPage(page); 
            await registerPage.fillContact(Contact.phoneRandom, Contact.emailRandom);
            await registerPage.clickVerify();

            //หน้า ยืนยันเมล
            const OTPmaillPage = new RegisterOtpmailPage(page);
            await OTPmaillPage.InputOTP(Contact.otp);
            await OTPmaillPage.clickVerify();

            //หน้า ยืนยันเบอร์
            const OTPPhonePage = new RegisterOtpPhonePage(page);
            await OTPPhonePage.InputOTP(Contact.otp);
            await OTPPhonePage.clickVerify();

            //หน้า Profile
            const Profile = new RegisterProfilePage(page);

            //หน้า Profile - Contact
            await Profile.fillpassword(Contact.password,registerData.WrongFormatUser.confirmpassword);
            await expect(Profile.confirmPasswordError).toHaveText("รหัสผ่านไม่ตรงกัน");
            
      });

      test('Personal info - ERROR ID ALREADY', async ({ page }) => {  
            const Contact = registerData.validContact(); //⭐⭐ จะสุ่มใหม่เมื่อมีการเขียนแบบนี้ซ้ำเท่านั้น 
            const personalInfo = registerData.validProfileInfo();
            const CurrentAddress = registerData.CurrentAddressInfo();
            const idCardAddress = registerData.idCardAddressInfo();

            //หน้า login
            const loginPage = new LoginPage(page);
            await loginPage.goto(registerData.PATH);

            //ไปหน้า Contact register
            await loginPage.openRegisterForm();
            
            //หน้า contact
            const registerPage = new RegisterContactPage(page); 
            await registerPage.fillContact(Contact.phoneRandom, Contact.emailRandom); //⭐⭐ อันนี้แค่บอกว่าจะเอาค่าที่ได้จากฟังก์ชันมาใช้ ไม่ใช่เรียกใหม่
            await registerPage.clickVerify();

            //หน้า ยืนยันเมล
            const OTPmaillPage = new RegisterOtpmailPage(page);
            await OTPmaillPage.InputOTP(Contact.otp);
            await OTPmaillPage.clickVerify();

            //หน้า ยืนยันเบอร์
            const OTPPhonePage = new RegisterOtpPhonePage(page);
            await OTPPhonePage.InputOTP(Contact.otp);
            await OTPPhonePage.clickVerify();

            //หน้า Profile
            const Profile = new RegisterProfilePage(page);

            //หน้า Profile - Contact
            await expect(Profile.sectioncontactname).toHaveText("ข้อมูลติดต่อ");
            await Profile.fillpassword(Contact.password,Contact.password);

            //หน้า Profile - personalInfo
            await expect(Profile.sectionpersonalname).toHaveText("ข้อมูลส่วนตัว");
            await expect(Profile.nationalityDropdown).toContainText('ไทย');
            await expect(Profile.documentTypeKyc).toContainText('บัตรประชาชน');
            await Profile.Uploadfile(personalInfo.PathIDcard);
            await expect(Profile.citizenNo).toHaveValue(registerData.alreadyUser.id);
            await expect(Profile.cardexpirydate).toHaveValue(registerData.alreadyUser.ExDat);
            /*👉 อธิบาย:
                  \. = escape จุด
                  \s+ = ช่องว่างกี่ตัวก็ได้
            */
            await expect(Profile.firstname).toHaveValue(registerData.alreadyUser.FName);
            await expect(Profile.lastname).toHaveValue(registerData.alreadyUser.LName);
            await expect(Profile.dateOfBirth).toHaveValue(registerData.alreadyUser.BDay);
            await Profile.Selecttitlename(personalInfo.Title);
            await expect(Profile.titlename).toContainText(personalInfo.Title);

            //หน้า Profile - addressInfo
            await Profile.fillCurrentAddress(CurrentAddress.houseNo,CurrentAddress.villageNo,CurrentAddress.buildingNo,CurrentAddress.roomNo,CurrentAddress.floorNo,CurrentAddress.alley,CurrentAddress.street);
            await Profile.selectCurrentprovince(CurrentAddress.province);
            await Profile.selectCurrentdistrict(CurrentAddress.district);
            await Profile.selectCurrentsubDistrict(CurrentAddress.subDistrict);
            await expect(Profile.CurrentpostcodeInput.locator('.css-1t3kefa-singleValue')).toContainText(CurrentAddress.postcode);
            await expect(Profile.sameAddressCheckbox).toBeChecked();

            //อื่นๆ
            await Profile.choosereceiveNoti();
            await Profile.submit();


            // Check error
            await expect(Profile.errorModal).toBeVisible;
            await expect(Profile.errorModal).toHaveText('ข้อมูลผู้ใช้งานนี้เคยลงทะเบียนใช้งานแล้ว');
      });

      test('Personal info - Success', async ({ page }) => {  
            // 1️⃣ Arrange → เตรียมข้อมูล
            //ข้อมูลสุ่ม / function → เก็บตัวแปร
            const Contact = registerData.validContact(); //⭐⭐ จะสุ่มใหม่เมื่อมีการเขียนแบบนี้ซ้ำเท่านั้น 
            const personalInfo = registerData.validProfileInfo();
            const CurrentAddress = registerData.CurrentAddressInfo();
            const idCardAddress = registerData.idCardAddressInfo();

            //หน้า login
            const loginPage = new LoginPage(page);
            await loginPage.goto(registerData.PATH);

            //ไปหน้า Contact register
            await loginPage.openRegisterForm();
            
            //หน้า contact
            const registerPage = new RegisterContactPage(page); 
            await registerPage.fillContact(Contact.phoneRandom, Contact.emailRandom); //⭐⭐ อันนี้แค่บอกว่าจะเอาค่าที่ได้จากฟังก์ชันมาใช้ ไม่ใช่เรียกใหม่
            await registerPage.clickVerify();

            //หน้า ยืนยันเมล
            const OTPmaillPage = new RegisterOtpmailPage(page);
            await OTPmaillPage.InputOTP(Contact.otp);
            await OTPmaillPage.clickVerify();

            //หน้า ยืนยันเบอร์
            const OTPPhonePage = new RegisterOtpPhonePage(page);
            await OTPPhonePage.InputOTP(Contact.otp);
            await OTPPhonePage.clickVerify();

            //หน้า Profile
            const Profile = new RegisterProfilePage(page);

            //หน้า Profile - Contact
            await expect(Profile.sectioncontactname).toHaveText("ข้อมูลติดต่อ");
            await Profile.fillpassword(Contact.password,Contact.password);

            //หน้า Profile - personalInfo
            await expect(Profile.sectionpersonalname).toHaveText("ข้อมูลส่วนตัว");
            await Profile.Uploadfile(personalInfo.PathIDcard);
            await Profile.FillcitizenNo(personalInfo.ThaiID)
            await Profile.selectCardExpiryDate(personalInfo.Exyear,personalInfo.Exmonth,personalInfo.Exday);
            await Profile.Selecttitlename(personalInfo.Title);
            await Profile.FillName(personalInfo.FName,personalInfo.LName);
            await Profile.selectBirthDate(personalInfo.Byear,personalInfo.Bmonth,personalInfo.BDay);

            //หน้า Profile - CurrentAddressInfo
            await Profile.fillCurrentAddress(CurrentAddress.houseNo,CurrentAddress.villageNo,CurrentAddress.buildingNo,CurrentAddress.roomNo,CurrentAddress.floorNo,CurrentAddress.alley,CurrentAddress.street);
            await Profile.selectCurrentprovince(CurrentAddress.province);
            await Profile.selectCurrentdistrict(CurrentAddress.district);
            await Profile.selectCurrentsubDistrict(CurrentAddress.subDistrict);
            await expect(Profile.CurrentpostcodeInput.locator('.css-1t3kefa-singleValue')).toContainText(CurrentAddress.postcode);

            //หน้า Profile - idCardAddressInfo 
            await Profile.sameAddressCheckbox.locator('..').click();
            await Profile.fillidCardAddress( idCardAddress.houseNo, idCardAddress.villageNo, idCardAddress.buildingNo, idCardAddress.roomNo, idCardAddress.floorNo, idCardAddress.alley, idCardAddress.street);
            await Profile.selectidCardprovince( idCardAddress.province);
            await Profile.selectidCarddistrict( idCardAddress.district);
            await Profile.selectidCardsubDistrict( idCardAddress.subDistrict);
            await expect(Profile.idCardpostcodeInput.locator('.css-1t3kefa-singleValue')).toContainText( idCardAddress.postcode);
            
            //อื่นๆ 
            await Profile.choosereceiveNoti();
            await expect(Profile.emailChannelRadio).toBeChecked

            //submit 
            await Profile.submit();

            // ตรวจสอบข้อมูล

            const CheckInfo = new Checkregistrationinformation(page)

            await expect(CheckInfo.Heading).toBeVisible();
            await expect(CheckInfo.Heading).toContainText('ตรวจสอบข้อมูลลงทะเบียน');
            await expect(CheckInfo.Nationality).toContainText('ไทย');

            const Fullname = CheckInfo.expectedName(personalInfo.Title,personalInfo.FName,personalInfo.LName);
            await expect(CheckInfo.Name).toContainText(Fullname);      

            await expect(CheckInfo.CitizenNo).toContainText(personalInfo.ThaiID);
            
            const BrithDay = CheckInfo.expectedBrithDay(personalInfo.BDay,personalInfo.Bfullmonth,personalInfo.Byear);
            await expect(CheckInfo.BirthDay).toContainText(BrithDay);

            const Address = CheckInfo.expectedAddress(CurrentAddress);
            await expect(CheckInfo.CurrentAddress).toContainText(Address);
            
            await expect(CheckInfo.Phone).toContainText(Contact.phoneFormat);
            await expect(CheckInfo.Email).toContainText(Contact.emailRandom);

            // Policy
            await expect(CheckInfo.Channels).toContainText('อีเมล');
            await expect(CheckInfo.receive).toContainText('รับ');
            
            // Click
            await CheckInfo.AcceptConsent();
            await expect(CheckInfo.EditBtn).toBeEnabled();
            await CheckInfo.SubmitBtn();

            // Register Success
            const registersuccesspage = new RegisterSuccessPage(page);
            await expect(registersuccesspage.LoginBtn).toBeVisible();
            await expect(registersuccesspage.Heading).toHaveText('ลงทะเบียนสำเร็จ');
            await registersuccesspage.SubmitBtn();

            // Login
            await loginPage.LoginByPhone(Contact.phoneRandom,Contact.password);
            await loginPage.clickLogin();
           
            await loginPage.PhoneOtp.isVisible()
            await expect(loginPage.PhoneOtp).toContainText(Contact.phoneFormat);
      });
      
});