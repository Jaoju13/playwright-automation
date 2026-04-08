
import { test, expect } from '../../fixtures/register.fixture';
/* 
ของเดิม : import { test, expect } from '@playwright/test'; //library ที่ติดตั้ง จะได้ test ธรรมดา แต่ถ้าใช้ตัวบน
จะได้ test + fixture ทั้งหมดที่ทำไว้ ส่วนอันเดิมไป import ไว้ใน fixture แล้ว 
ส่วนอันนี้ต้องใช้ import จาก fixture เพราะ :
     - คุณ extend test แล้ว
     - เพิ่ม fixture เข้าไป
     - ต้องใช้ “test ตัวใหม่” เท่านั้น
*/
import { LoginPage,RegisterContactPage, RegisterOtpmailPage,RegisterOtpPhonePage,RegisterProfilePage,Checkregistrationinformation,RegisterSuccessPage} from '../../pages/auth/register.page'; //import class ในไฟล์ POM ที่เราจะใช้ทุกอันใน test นี้
import { registerData } from '../../data/auth/register.data';//import class ในไฟล์ data ที่เราจะใช้


test.describe('Register - Contact info', () => { // ชื่อกลุ่มเทสเคส 

      test('Contact info - ERROR NULL', async ({ registerContact, page }) => {  //ส่งค่าไปใช้ { registerContact, page } จากไฟล์ fixture
            await registerContact.fillContact('', ''); //ไม่ต้องเรียก await loginPage.openRegisterForm(); จาก page ใหม่ เพราะ fixture ถูก run ก่อน test แล้ว ใช้ต่อได้เลย
            await page.click('body');
            
            await expect(registerContact.phoneError).toHaveText('โปรดระบุเบอร์โทรศัพท์');
            await expect(registerContact.emailError).toHaveText('โปรดระบุอีเมล'); 
      }); 

      test('Contact info - ERROR WrongFormat', async ({ registerContact, page }) => { 
            await registerContact.fillContact(registerData.WrongFormatUser.phone,  registerData.WrongFormatUser.email);
            await page.click('body');

            await expect(registerContact.phoneError).toHaveText('เบอร์โทรศัพท์ไม่ถูกต้อง');
            await expect(registerContact.emailError).toHaveText('รูปแบบอีเมลไม่ถูกต้อง');
      });

      test('Contact info - ERROR ALREADY', async ({ registerContact}) => { //ไม่มีตรงไหนใช้ page เลยไม่ต้องใส่เหมือนเคสบนที่ยังใช้ตรง await page.click('body');
            // 1️⃣ Arrange → เตรียมข้อมูล
            // ค่าคงที่ → ใช้ตรง ๆ ได้เลย เช่น registerData.PATH
            const phone = registerData.alreadyUser.phone;
            const email = registerData.alreadyUser.email;
            
            // 2️⃣ Act → ทำ action บนหน้าเว็บ : object.method()
            await registerContact.fillContact(phone, email);
            await registerContact.clickVerify();

            await expect(registerContact.phoneErrorAlready).toHaveText('เบอร์โทรศัพท์นี้เคยลงทะเบียนใช้งานแล้ว'); 
            await expect(registerContact.emailErrorAlready).toHaveText('อีเมลนี้เคยลงทะเบียนใช้งานแล้ว'); 
      });

      test('Personal info - Valid Contact', async ({ registerContact,otpMail,otpPhone,profilePage }) => {  
            const Contact = registerData.validContact(); //⭐⭐ จะสุ่มใหม่เมื่อมีการเขียนแบบนี้ซ้ำเท่านั้น 

            await registerContact.fillContact(Contact.phoneRandom, Contact.emailRandom); //⭐⭐ อันนี้แค่บอกว่าจะเอาค่าที่ได้จากฟังก์ชันมาใช้ ไม่ใช่เรียกใหม่
            await registerContact.clickVerify();

            //หน้า ยืนยันเมล
            await expect(otpMail.emailText).toHaveText(Contact.emailRandom);
            await otpMail.InputOTP(Contact.otp);
            await otpMail.clickVerify();

            //หน้า ยืนยันเบอร์
            await expect(otpPhone.PhoneText).toHaveText(Contact.phoneFormat);
            await otpPhone.InputOTP(Contact.otp);
            await otpPhone.clickVerify();

            //หน้า PersonalInfo
            await expect(profilePage.sectioncontactname).toHaveText("ข้อมูลติดต่อ")
            await expect(profilePage.PhoneText).toHaveValue(Contact.phoneRandom);
            await expect(profilePage.emailText).toHaveValue(Contact.emailRandom);
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
      test('Personal info - ERROR Password NULL', async ({registerContact,otpMail,otpPhone,profilePage }) => {  
            const Contact = registerData.validContact(); //⭐⭐ จะสุ่มใหม่เมื่อมีการเขียนแบบนี้ซ้ำเท่านั้น 

            await registerContact.fillContact(Contact.phoneRandom, Contact.emailRandom); //⭐⭐ อันนี้แค่บอกว่าจะเอาค่าที่ได้จากฟังก์ชันมาใช้ ไม่ใช่เรียกใหม่
            await registerContact.clickVerify();

            //หน้า ยืนยันเมล
            await otpMail.InputOTP(Contact.otp);
            await otpMail.clickVerify();

            //หน้า ยืนยันเบอร์
            await otpPhone.InputOTP(Contact.otp);
            await otpPhone.clickVerify();

            //หน้า Profile - Contact
            await profilePage.fillpassword('','');
            await expect(profilePage.passwordError).toHaveText("โปรดระบุรหัสผ่าน");
            await expect(profilePage.confirmPasswordError).toHaveText("โปรดระบุยืนยันรหัสผ่าน");
            
      });

      test('Personal info - ERROR Passwords do not match', async ({ registerContact,otpMail,otpPhone,profilePage }) => {  
            const Contact = registerData.validContact(); 

            await registerContact.fillContact(Contact.phoneRandom, Contact.emailRandom);
            await registerContact.clickVerify();

            //หน้า ยืนยันเมล
            await otpMail.InputOTP(Contact.otp);
            await otpMail.clickVerify();

            //หน้า ยืนยันเบอร์
            await otpPhone.InputOTP(Contact.otp);
            await otpPhone.clickVerify();

            //หน้า Profile - Contact
            await profilePage.fillpassword(Contact.password,registerData.WrongFormatUser.confirmpassword);
            await expect(profilePage.confirmPasswordError).toHaveText("รหัสผ่านไม่ตรงกัน");
            
      });

      test('Personal info - ERROR ID ALREADY', async ({ registerContact,otpMail,otpPhone,profilePage  }) => {  
            const Contact = registerData.validContact(); //⭐⭐ จะสุ่มใหม่เมื่อมีการเขียนแบบนี้ซ้ำเท่านั้น 
            const personalInfo = registerData.validProfileInfo();
            const CurrentAddress = registerData.CurrentAddressInfo();

            //หน้า contact
            await registerContact.fillContact(Contact.phoneRandom, Contact.emailRandom); //⭐⭐ อันนี้แค่บอกว่าจะเอาค่าที่ได้จากฟังก์ชันมาใช้ ไม่ใช่เรียกใหม่
            await registerContact.clickVerify();

            //หน้า ยืนยันเมล
            await otpMail.InputOTP(Contact.otp);
            await otpMail.clickVerify();

            //หน้า ยืนยันเบอร์
            await otpPhone.InputOTP(Contact.otp);
            await otpPhone.clickVerify();
            
            //หน้า Profile - Contact
            await expect(profilePage.sectioncontactname).toHaveText("ข้อมูลติดต่อ");
            await profilePage.fillpassword(Contact.password,Contact.password);

            //หน้า Profile - personalInfo
            await expect(profilePage.sectionpersonalname).toHaveText("ข้อมูลส่วนตัว");
            await expect(profilePage.nationalityDropdown).toContainText('ไทย');
            await expect(profilePage.documentTypeKyc).toContainText('บัตรประชาชน');
            await profilePage.Uploadfile(personalInfo.PathIDcard);
            await expect(profilePage.citizenNo).toHaveValue(registerData.alreadyUser.id);
            await expect(profilePage.cardexpirydate).toHaveValue(registerData.alreadyUser.ExDat);
            /*👉 อธิบาย:
                  \. = escape จุด
                  \s+ = ช่องว่างกี่ตัวก็ได้
            */
            await expect(profilePage.firstname).toHaveValue(registerData.alreadyUser.FName);
            await expect(profilePage.lastname).toHaveValue(registerData.alreadyUser.LName);
            await expect(profilePage.dateOfBirth).toHaveValue(registerData.alreadyUser.BDay);
            await profilePage.Selecttitlename(personalInfo.Title);
            await expect(profilePage.titlename).toContainText(personalInfo.Title);

            //หน้า Profile - addressInfo
            await profilePage.fillCurrentAddress(CurrentAddress.houseNo,CurrentAddress.villageNo,CurrentAddress.buildingNo,CurrentAddress.roomNo,CurrentAddress.floorNo,CurrentAddress.alley,CurrentAddress.street);
            await profilePage.selectCurrentprovince(CurrentAddress.province);
            await profilePage.selectCurrentdistrict(CurrentAddress.district);
            await profilePage.selectCurrentsubDistrict(CurrentAddress.subDistrict);
            await expect(profilePage.CurrentpostcodeInput.locator('.css-1t3kefa-singleValue')).toContainText(CurrentAddress.postcode);
            await expect(profilePage.sameAddressCheckbox).toBeChecked();

            //อื่นๆ
            await profilePage.choosereceiveNoti();
            await profilePage.submit();


            // Check error
            await expect(profilePage.errorModal).toBeVisible;
            await expect(profilePage.errorModal).toHaveText('ข้อมูลผู้ใช้งานนี้เคยลงทะเบียนใช้งานแล้ว');
      });

      test('Personal info - Success', async ({loginPage,registerContact,otpMail,otpPhone,profilePage,CheckInfoPage,registersuccesspage }) => {  
            // 1️⃣ Arrange → เตรียมข้อมูล
            //ข้อมูลสุ่ม / function → เก็บตัวแปร
            const Contact = registerData.validContact(); //⭐⭐ จะสุ่มใหม่เมื่อมีการเขียนแบบนี้ซ้ำเท่านั้น 
            const personalInfo = registerData.validProfileInfo();
            const CurrentAddress = registerData.CurrentAddressInfo();
            const idCardAddress = registerData.idCardAddressInfo();
 
            //หน้า contact
            await registerContact.fillContact(Contact.phoneRandom, Contact.emailRandom); //⭐⭐ อันนี้แค่บอกว่าจะเอาค่าที่ได้จากฟังก์ชันมาใช้ ไม่ใช่เรียกใหม่
            await registerContact.clickVerify();

            //หน้า ยืนยันเมล
            await otpMail.InputOTP(Contact.otp);
            await otpMail.clickVerify();

            //หน้า ยืนยันเบอร์
            await otpPhone.InputOTP(Contact.otp);
            await otpPhone.clickVerify();

            //หน้า Profile - Contact
            await expect(profilePage.sectioncontactname).toHaveText("ข้อมูลติดต่อ");
            await profilePage.fillpassword(Contact.password,Contact.password);

            //หน้า Profile - personalInfo
            await expect(profilePage.sectionpersonalname).toHaveText("ข้อมูลส่วนตัว");
            await profilePage.Uploadfile(personalInfo.PathIDcard);
            await profilePage.FillcitizenNo(personalInfo.ThaiID)
            await profilePage.selectCardExpiryDate(personalInfo.Exyear,personalInfo.Exmonth,personalInfo.Exday);
            await profilePage.Selecttitlename(personalInfo.Title);
            await profilePage.FillName(personalInfo.FName,personalInfo.LName);
            await profilePage.selectBirthDate(personalInfo.Byear,personalInfo.Bmonth,personalInfo.BDay);

            //หน้า Profile - CurrentAddressInfo
            await profilePage.fillCurrentAddress(CurrentAddress.houseNo,CurrentAddress.villageNo,CurrentAddress.buildingNo,CurrentAddress.roomNo,CurrentAddress.floorNo,CurrentAddress.alley,CurrentAddress.street);
            await profilePage.selectCurrentprovince(CurrentAddress.province);
            await profilePage.selectCurrentdistrict(CurrentAddress.district);
            await profilePage.selectCurrentsubDistrict(CurrentAddress.subDistrict);
            await expect(profilePage.CurrentpostcodeInput.locator('.css-1t3kefa-singleValue')).toContainText(CurrentAddress.postcode);

            //หน้า Profile - idCardAddressInfo 
            await profilePage.sameAddressCheckbox.locator('..').click();
            await profilePage.fillidCardAddress( idCardAddress.houseNo, idCardAddress.villageNo, idCardAddress.buildingNo, idCardAddress.roomNo, idCardAddress.floorNo, idCardAddress.alley, idCardAddress.street);
            await profilePage.selectidCardprovince( idCardAddress.province);
            await profilePage.selectidCarddistrict( idCardAddress.district);
            await profilePage.selectidCardsubDistrict( idCardAddress.subDistrict);
            await expect(profilePage.idCardpostcodeInput.locator('.css-1t3kefa-singleValue')).toContainText( idCardAddress.postcode);
            
            //อื่นๆ 
            await profilePage.choosereceiveNoti();
            await expect(profilePage.emailChannelRadio).toBeChecked

            //submit 
            await profilePage.submit();

            // ตรวจสอบข้อมูล
            await expect(CheckInfoPage.Heading).toBeVisible();
            await expect(CheckInfoPage.Heading).toContainText('ตรวจสอบข้อมูลลงทะเบียน');
            await expect(CheckInfoPage.Nationality).toContainText('ไทย');

            const Fullname = CheckInfoPage.expectedName(personalInfo.Title,personalInfo.FName,personalInfo.LName);
            await expect(CheckInfoPage.Name).toContainText(Fullname);      

            await expect(CheckInfoPage.CitizenNo).toContainText(personalInfo.ThaiID);
            
            const BrithDay = CheckInfoPage.expectedBrithDay(personalInfo.BDay,personalInfo.Bfullmonth,personalInfo.Byear);
            await expect(CheckInfoPage.BirthDay).toContainText(BrithDay);

            const Address = CheckInfoPage.expectedAddress(CurrentAddress);
            await expect(CheckInfoPage.CurrentAddress).toContainText(Address);
            
            await expect(CheckInfoPage.Phone).toContainText(Contact.phoneFormat);
            await expect(CheckInfoPage.Email).toContainText(Contact.emailRandom);

            // Policy
            await expect(CheckInfoPage.Channels).toContainText('อีเมล');
            await expect(CheckInfoPage.receive).toContainText('รับ');
            
            // Click
            await CheckInfoPage.AcceptConsent();
            await expect(CheckInfoPage.EditBtn).toBeEnabled();
            await CheckInfoPage.SubmitBtn();

            // Register Success
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