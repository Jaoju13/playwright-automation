/* 
1. ไฟล์ที่เป็นโฟลเดอร์ page คือ POM (Page Object Model) เป็นไฟล์สำหรับเก็บ ชุดคำสั่งที่มันซ้ำๆกัน ของแต่ละเคสไว้ 
async login(username: string, password: string) {
      await this.page.fill('#username', username);
      await this.page.fill('#password', password);
      await this.page.click('#loginBtn');
    }

2. ไฟล์ที่เป็นโฟลเดอร์ test คือไว้เก็บโค้ดเทสที่เราเขียนจริงๆ เช่น อยากเทส register ซึ่งจะแยกเคส สำเร็จ ไม่สำเร็จไว้ที่นี้ 
แต่พวกชุดคำสั่งที่ซ้ำๆกันจะเก็บไว้ pom เวลาเรียกใช้ก็เรียกเป็น 
test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);   // สร้าง object ของหน้า login
  await loginPage.login('aaa','bbb');      // เรียกใช้ method login
});


import { Page, Locator } from '@playwright/test'; //ขอหยิบเครื่องมือที่ชื่อ  Page, Locator จากกล่อง'@playwright/test มาใช้ 

export class RegisterPage { //สร้างชื่อคลาส RegisterPage และใส่ export เพื่อให้ไฟล์อื่นเรียกใช้ได้ ถ้าไม่ใส่ export → import ไม่ได้
      //  คือบอกว่าคลาสนี้มีอะไรในตัวมันบ้าง (property) : element ที่ใช้จริงทั้งหมดของหน้าที่เทส ที่ 👉 test ต้อง “กด / พิมพ์ / อ่านค่า 
      //  เก็บ element + action ของหน้าเว็บ เช่น Locator ไว้เก็บที่อยู่ของช่องหรือปุ่มที่เราเลือก
      //  โดยคำว่า readonly = ห้ามเปลี่ยนค่าในอนาคต 
      readonly page: Page;  //readonly ชื่อตัวแปร: ประเภทข้อมูล (type) เช่น readonly phoneInput: Locator หรือ let age: number

      constructor(page: Page) { //คือ function ที่จะถูกเรียก ตอน new class >> ชนิดของค่าที่รับได้ (type) : ตัวแปลรับค่าชั่วคราว (parameter)
            this.page = page;
            // ตัวแปรของ class (this = คือบอกว่าเป็นตัวแปรของคลาสนี้เอง) : ค่าที่รับมา
      }

      //อันนี้คือสร้างชุดคำสั่งย่อยได้เลย คือ method (ฟังก์ชันของ class)
      async goToRegisterPage() {
            await this.page.goto('https://st.rvpdplus.com/direct');
      }
}
*/

import { Page, Locator, expect} from '@playwright/test';

export class LoginPage {
      readonly page: Page;
      readonly acceptCookieBtn: Locator;
      readonly phoneInput: Locator;
      readonly passwordInput: Locator;
      readonly loginBtn: Locator;
      readonly registerBtn: Locator;
      readonly PhoneOtp: Locator;

      constructor(page: Page) {
            this.page = page;
            this.acceptCookieBtn = page.locator('footer button');
            this.phoneInput = page.locator('#phoneNumber');
            this.passwordInput = page.locator('#password');
            this.loginBtn = page.locator('#direct-login-submit');
            this.registerBtn = page.locator('#direct-path-register-login');
            this.PhoneOtp = page.locator('.verification_phone__hZvcb'); 
      }

      //เข้าหน้า login
      async goto(Path : string) {
            await this.page.goto(Path);
      }

      async LoginByPhone(phone: string, password: string) {
            await this.phoneInput.isVisible();
            await this.phoneInput.fill(phone);
            await this.passwordInput.fill(password);
            await this.page.click('body');
      }

       async clickLogin(){
            await this.loginBtn.click();
      }

      //กดไปหน้า register
      async openRegisterForm() {
            await this.acceptCookieBtn.click();
            await this.registerBtn.click();
      }
}

export class RegisterContactPage {
      readonly page: Page;
      readonly phoneInput: Locator;
      readonly emailInput: Locator;
      readonly phoneError: Locator; //แบบ 1 
      readonly emailError: Locator; 
      readonly phoneErrorAlready: Locator; //แบบ 2
      readonly emailErrorAlready: Locator;
      readonly verifyBtn: Locator;

      constructor(page: Page) {
            this.page = page;
            this.phoneInput = page.locator('#phone');
            this.emailInput = page.locator('#email');
            this.verifyBtn = page.getByRole('button', { name: 'ตรวจสอบข้อมูล' });
            
            // error message แบบ 1: คือไปหาจุดที่่อยู่เป็น small ของช่องชื่อ phone เลย จะใช้ได้ 
            this.phoneError = page.locator('#phone + small');
            this.emailError = page.locator('#email + small');
            /*
                  Attribute / ค่า / ใช้ selector แบบไหน
                  id / phone / #phone
                  name / phone / [name="phone"]
                  class / phon /.phone 
                  หลาย class / .input.phone.primary
                  class + context / #parent .input-phone

                        เช่น มาจาก 
                              <div class="register_expand__cIGMY" id="contactInfo">
                                    <p class="register_title__1daAe">ข้อมูลติดต่อ</p>
                              </div>
                        
      
                              A) Class ปกติ : จะใช้ page.locator('.verificationCard_primaryText');                               
                              B) p คือ tag name selector หมายถึงเลือกเฉพาะ <p> เท่านั้น ใส่หรือไม่ใส่ก็ได้ แต่ใส่แล้วหาง่ายกว่า
                                    page.locator('p[class*="register_title__1daAe"]'); หรือ
                                    page.locator('p.register_title__1daAe');
                              C) กรณีมีหลาย class ที่ชื่อเดียวกัน >> class + context
                                    ใช้แบบนี้แทน page.locator('#contactInfo p.register_title__1daAe'); 

                              ตัว selector | ความหมาย
                                   1) .verificationCard_primaryText__02bp	ชื่อคลาสต้องตรง 100%
                                   2) [class*="verificationCard_primaryText"]	ขอแค่มีคำนี้อยู่ใน class *= แปลว่า: เลือก element ที่ class มีคำนี้อยู่ข้างใน โดยไม่สนใจ hash ข้างหลัง (ที่มันจะมีต่อท้ายอันนี้) ขอแค่มีคำว่า verificationCard_primaryText ก็พอ
                                   3) [class^="verificationCard_primaryText"]	ต้องขึ้นต้นด้วยคำนี้

                  ส่วน small เป็น tag ธรรมดา เวลาเรียกใช้ต้องพ่วงอย่างอื่นไปด้วยว่ามันเป็น tag ของอันไหน
            */

            // error message แบบ 2
            this.phoneErrorAlready = page.locator('small').filter({ hasText: 'เบอร์โทรศัพท์นี้เคยลงทะเบียนใช้งานแล้ว' });
            this.emailErrorAlready = page.locator('small').filter({ hasText: 'อีเมลนี้เคยลงทะเบียนใช้งานแล้ว' });
            //ใช้ได้ 2 แบบ โดย .filter คือเอาเฉพาะจุดตรง ({ hasText: ที่มีข้อความตรงกับอันนี้ คล้ายๆ like =xx%}) แต่แบบนี้จะเจาะจงไป ต้องสร้างเยอะ
      }

      async fillContact(phone: string, email: string) {
            await this.phoneInput.fill(phone);
            await this.emailInput.fill(email);
      }
      
      async clickVerify(){
            await this.verifyBtn.click();
      }
      /*
      ถ้าใช้ .tobe() ที่ไฟล์ Test ต้องมีแบบนี้มาเรียกข้อความที่แสดงและตัดช่องว่างด้วย
      async getphoneErrorNull(): Promise<string> {
            return (await this.phoneErrorNull.textContent())?.trim() ?? ''; 
      }

      .textContent() = ไปอ่าน “ข้อความใน element : phoneErrorAlready”
      .trim() = ลบช่องว่างหน้า + หลังออก
     */
}

export class RegisterOtpmailPage {
      readonly page: Page;
      readonly emailText: Locator;
      readonly emailOtp: Locator;
      readonly submitBtn: Locator;

      constructor(page: Page) {
            this.page = page;
            this.emailText = page.locator('p[class*="verificationCard_primaryText"]');
            this.emailOtp = page.locator('#verificationEmail'); //Id
            this.submitBtn = page.getByRole('button', { name: 'ถัดไป' }); // ชื่อปุ่มที่เห็นบนหน้าจอ
      }

      async InputOTP(Otp: string) {
            await this.emailOtp.fill(Otp);
      }

      async clickVerify() {
            await this.submitBtn.click();
      }
}

export class RegisterOtpPhonePage {
      readonly page: Page;
      readonly PhoneText: Locator;
      readonly PhoneOtp: Locator;
      readonly submitBtn: Locator;

      constructor(page: Page) {
            this.page = page;
            this.PhoneText = page.locator('p[class*="verificationCard_primaryText"]'); 
            this.PhoneOtp = page.locator('#verificationPhoneNo'); //Id
            this.submitBtn = page.getByRole('button', { name: 'ถัดไป' }); // ชื่อปุ่มที่เห็นบนหน้าจอ
      }

      async InputOTP(Otp: string) {
            await this.PhoneOtp.fill(Otp);
      }

      async clickVerify() {
            await this.submitBtn.click();
      }
}

export class RegisterProfilePage {
      readonly page: Page;

      // ===== contact =====
      readonly sectioncontactname:Locator;
      readonly PhoneText: Locator;
      readonly emailText: Locator;
      readonly passwordInput: Locator;
      readonly passwordError: Locator;
      readonly confirmPasswordInput: Locator;
      readonly confirmPasswordError: Locator;

      // ===== personal =====
      readonly sectionpersonalname:Locator;
      readonly nationalityDropdown: Locator;
      readonly documentTypeKyc: Locator;
      readonly citizenNo: Locator;
      readonly cardexpirydate: Locator;
      readonly titlename: Locator;
      readonly firstname: Locator;
      readonly lastname: Locator;
      readonly dateOfBirth: Locator;

      // ===== Current address =====
      readonly Currentsectionaddress:Locator;
      readonly CurrenthouseNoInput: Locator;
      readonly CurrentvillageNoInput: Locator;
      readonly CurrentbuildingNoInput: Locator;
      readonly CurrentroomNoInput: Locator;
      readonly CurrentfloorNoInput: Locator;
      readonly CurrentalleyInput: Locator;
      readonly CurrentstreetInput: Locator;
      readonly CurrentprovinceDropdown: Locator;
      readonly CurrentdistrictDropdown: Locator;
      readonly CurrentsubDistrictDropdown: Locator;
      readonly CurrentpostcodeInput: Locator;

      // ===== idCard address =====
      readonly sameAddressCheckbox: Locator;

      readonly idCardhouseNoInput: Locator;
      readonly idCardvillageNoInput: Locator;
      readonly idCardbuildingNoInput: Locator;
      readonly idCardroomNoInput: Locator;
      readonly idCardfloorNoInput: Locator;
      readonly idCardalleyInput: Locator;
      readonly idCardstreetInput: Locator;
      readonly idCardprovinceDropdown: Locator;
      readonly idCarddistrictDropdown: Locator;
      readonly idCardsubDistrictDropdown: Locator;
      readonly idCardpostcodeInput: Locator;
      

      // ===== policy =====
      readonly emailChannelRadio: Locator;
      readonly marketingAcceptRadio: Locator;

      // ===== Summit BTN =====  
      readonly submitBtn: Locator;

      // ===== Error =====  
      readonly errorModal: Locator;

      constructor(page: Page) {
            this.page = page;

            // contact
            this.sectioncontactname = page.locator('#contactInfo p.register_title__1daAe'); //#คลาส 
            this.PhoneText = page.locator('#phone');
            this.emailText = page.locator('#email');
            this.passwordInput = page.locator('#password');
            this.passwordError = page.locator('#password + small');
            this.confirmPasswordInput = page.locator('#confirmPassword');
            this.confirmPasswordError = page.locator('#confirmPassword + small');

            // personal
            this.sectionpersonalname = page.locator('#personalInfo p.register_title__1daAe'); 
            this.nationalityDropdown = page.locator('label:has-text("สัญชาติ")').locator('..');
            /*
                  .locator('..') คือ การ “เลื่อนขึ้นไปหา parent element (ตัวแม่)” ของ element ปัจจุบัน
                        .. = ขึ้นแค่ 1 level ถ้าโครงสร้างลึก → อาจต้องใช้หลายครั้ง
                              ✔ จำกัด scope เฉพาะ “สัญชาติ”
                              ✔ ไม่ชน element อื่น
                              ✔ stable มาก

                  เปรียบเทียบให้เข้าใจ
                        syntax	      ความหมาย
                        '..'	            parent
                        'div'	            ลูก
                        '.class'	      เลือก class
                        :has-text()	      filter text

                  ตัวอย่าง
                        <div class="customSelect_container__WH3Vv">   👈 (A) container หลัก
                              <label>สัญชาติ</label>                     👈 (B)

                              <div class="css-3iigni-container">          👈 (C)
                              <div class="css-10pw96-control">
                                    <div class="css-13jgwga">
                                    <div class="css-1t3kefa-singleValue">ไทย</div>  👈 (D)

                        page.locator('label:has-text("สัญชาติ")') 👉 ได้ (B)
                        .locator('..') 👉 ขึ้นไป 1 ชั้น → ได้ (A)

                        คำสั่งคือ หา label ชื่อสัญชาติ(B) แล้วขึ้นไปหาตัวแม่ container (A) 
                        ใช้กับ await expect(nationality).toContainText('ไทย'); 
                        toContainText('ไทย') = ดูทุก text ข้างใน container นี้ว่ามีค่าตรงไหนมีคำว่า 'ไทย' ไหม
            */

            this.documentTypeKyc = page.locator('label:has-text("เลือกเอกสารที่ใช้ยืนยันตัวตน")').locator('..');
            this.citizenNo = page.locator('#citizenNo');
            this.cardexpirydate = page.locator('#cardExpiryDate');
            this.titlename = page.locator('label:has-text("คำนำหน้า")').locator('..');
            this.firstname = page.locator('#firstName');
            this.lastname = page.locator('#lastName');
            this.dateOfBirth = page.locator('#dateOfBirth');

            // currentAddress
            this.Currentsectionaddress = page.locator('#addressInfo p.register_title__1daAe'); 
            this.CurrenthouseNoInput = page.locator('[name="currentAddress.addressNo"]');
            this.CurrentvillageNoInput = page.locator('[name="currentAddress.villageNo"]');
            this.CurrentbuildingNoInput = page.locator('[name="currentAddress.buildingNo"]');
            this.CurrentroomNoInput = page.locator('[name="currentAddress.roomNo"]').nth(1);
            this.CurrentfloorNoInput = page.locator('[name="currentAddress.floorNo"]').nth(1);
            this.CurrentalleyInput = page.locator('[name="currentAddress.alley"]');
            this.CurrentstreetInput = page.locator('[name="currentAddress.street"]');

            this.CurrentprovinceDropdown = page.locator('[name="currentAddress.provinceCode"]').locator('..').locator('..');
            /*
                <div class="customSelect_container__WH3Vv">   👈 (A) container หลัก
                  <label>จังหวัด</label>                     👈 (B)

                  <div class="...-control">                  👈 (C) ตัว dropdown
                        <div>
                              <div class="placeholder">โปรดระบุ</div> 👈 (D) ค่า (ยังไม่เลือก)
                              <input role="combobox">               👈 (E)
                        </div>
                  </div>

                  <input name="currentAddress.provinceCode" type="hidden"> 👈 (F) key สำคัญ
                  </div>  
                
            */
            this.CurrentdistrictDropdown = page.locator('[name="currentAddress.districtCode"]').locator('..').locator('..');
            this.CurrentsubDistrictDropdown = page.locator('[name="currentAddress.subDistrictCode"]').locator('..').locator('..');
            this.CurrentpostcodeInput = page.locator('.customSelect_container__WH3Vv', {has: this.page.locator('label:has-text("รหัสไปรษณีย์")')});
            /*
                 1) .customSelect_container__WH3Vv → เลือก container หลักของ dropdown/field ทั้ง block
                 2) has: this.page.locator('label:has-text("รหัสไปรษณีย์")') → filter ให้เลือกเฉพาะ container ที่มี label “รหัสไปรษณีย์”
                 3) ยังไม่เจาะ value → locator นี้จับ ทั้ง container ไม่สนใจว่า value ตอนนี้มีหรือยัง
                 4) ใช้ทำอะไรได้ → รอ render, click dropdown, หรือเช็ค placeholder → value transition
                 5) ถ้าจะเช็คค่า → ต้องต่อด้วย .locator('.css-1t3kefa-singleValue') เพื่อเข้าถึงตัวเลข postcode
            */

            // idCardAddress
            this.sameAddressCheckbox = page.locator('#isSameAddress');

            this.idCardhouseNoInput = page.locator('[name="idCardAddress.addressNo"]');
            this.idCardvillageNoInput = page.locator('[name="idCardAddress.villageNo"]');
            this.idCardbuildingNoInput = page.locator('[name="idCardAddress.buildingNo"]');
            this.idCardroomNoInput = page.locator('[name="idCardAddress.roomNo"]').nth(1);
            this.idCardfloorNoInput = page.locator('[name="idCardAddress.floorNo"]').nth(1);
            this.idCardalleyInput = page.locator('[name="idCardAddress.alley"]');
            this.idCardstreetInput = page.locator('[name="idCardAddress.street"]');

            this.idCardprovinceDropdown = page.locator('[name="idCardAddress.provinceCode"]').locator('..').locator('..');
            /*
                <div class="customSelect_container__WH3Vv">   👈 (A) container หลัก
                  <label>จังหวัด</label>                     👈 (B)

                  <div class="...-control">                  👈 (C) ตัว dropdown
                        <div>
                              <div class="placeholder">โปรดระบุ</div> 👈 (D) ค่า (ยังไม่เลือก)
                              <input role="combobox">               👈 (E)
                        </div>
                  </div>

                  <input name="currentAddress.provinceCode" type="hidden"> 👈 (F) key สำคัญ
                  </div>  
                
            */
            this.idCarddistrictDropdown = page.locator('[name="idCardAddress.districtCode"]').locator('..').locator('..');
            this.idCardsubDistrictDropdown = page.locator('[name="idCardAddress.subDistrictCode"]').locator('..').locator('..');
            this.idCardpostcodeInput = page.locator('.customSelect_container__WH3Vv', {has: this.page.locator('label:has-text("รหัสไปรษณีย์")')}).last();
            
            // policy
            this.emailChannelRadio = page.locator('[name = "receivingChannel"]').getByRole('radio');
            this.marketingAcceptRadio = page.locator('div').filter({ hasText: /^รับ$/ }).getByRole('radio')

            this.submitBtn = page.getByRole('button', { name: 'ตรวจสอบข้อมูล' });

            // error
            this.errorModal  = page.locator('.errorValidateCustomerModal_container__D0utg p');
                  /*
                        <div class="errorValidateCustomerModal_container__D0utg">
                              <h1>ขออภัยในความไม่สะดวก</h1>
                              <p>ข้อมูลผู้ใช้งานนี้เคยลงทะเบียนใช้งานแล้ว</p>
                              <button type="button">ตกลง</button>
                        </div>

                        '.errorValidateCustomerModal_container__D0utg p' --> เอาเฉพาะค่าใน <p>
                        
                  */
      }

      //Contact Info
      async fillpassword(password: string,confirm: string) {
            await this.passwordInput.fill(password);
            await this.confirmPasswordInput.fill(confirm);
            await this.page.mouse.click(1, 1); //คลิกพื้นที่ว่าง ตามตำแหน่งที่บอก เพราะใช้ await this.page.click('body') แล้วมันไปโดนปุ่ม
      }

      //Personal Info
      async Uploadfile(PathIDcard: string){
            await this.page.locator('#cardImageBase64').setInputFiles(PathIDcard); 
            /* 
                  มี <input type="file"> 
                        ใช้ setInputFiles() ✅
                        ปุ่ม upload → ไม่ต้องยุ่ง ถึงจะ hidden ก็ใช้ได้ ✅
                  
                  ถ้าไม่มี 
                        this.uploadInput = page.locator('#cardImageBase64');
                        await this.uploadInput.setInputFiles('tests/files/idcard.png');
            */
           await expect(this.page.locator('div.uploadImage_success__P2CYB')).toBeVisible({ timeout: 10000 }); //{ timeout: 10000 } ใส่กันไว้เฉยๆ ปกติมันจะรอแค่ 5 วิ
      }

      async FillcitizenNo (citizenNo: string){
            await this.citizenNo.fill(citizenNo)
      }

      async selectCardExpiryDate( year: string, month: string, day: string) {
            // 1️⃣ คลิก input ให้ปฏิทินโผล่
            await this.cardexpirydate.click();

            // 2️⃣ เลือกปี
            await this.page.locator('.css-1y5c9uy-control').first().click(); // assume first dropdown ของปฏิทินคือปี คลิกเปิด DD
            await this.page.locator('div[role="option"]',{ hasText: year }).click(); // หาค่าใน dd ที่มีค่าตรงกับ year และคลิกเลือก
             /* 
             role="combobox" 👉 ใช้ “ตอนยังไม่เปิด / ตอนพิมพ์ค้นหา”
             role="option" 👉 ใช้ “ตอน dropdown เปิดแล้ว / ตอนเลือกค่า” ใช้ง่ายกว่า
             
                  ใช้ combobox ใช้กับพวกที่เป็นช่อง Dropdownlist / Autocomplete ที่ Enable เท่านั้น ถ้าฟิลด์ Disable ใช้ไม่ได้
                        A) getByRole + name แต่จะใช้ combobox ต้องมี <input ... role="combobox" ...> 
                        B) ต้องมี <label>สัญชาติ</label> หรือ <input aria-label="สัญชาติ">
                        C) แต่ถ้า name: 'สัญชาติ *' แบบนี้ถ้าใช้ { name: 'สัญชาติ' } อาจหาไม่เจอ ให้ใช้ regex: {name: /สัญชาติ/}
                        เรื่อง	       cardExpiryDate	      สัญชาติ
                        type	           <input>	      <div> (custom)
                        มี value	      ✅ มี	            ❌ ไม่มี
                        ใช้ fill	      ✅ ได้	            ❌ ไม่ได้
                        ใช้ toHaveValue	✅ ได้	            ❌ ไม่ได้
                        ใช้ toHaveText	❌ ไม่ใช่หลัก	  ✅ ใช้
                        locator	      #id	            getByRole()
            */

            // 3️⃣ เลือกเดือน
            await this.page.locator('.css-1y5c9uy-control').last().click(); // assume ตัวสุดท้าย dropdown คือเดือน //.css-1y5c9uy-control มี 2 อัน แต่ลองใช้ ntp(1) แล้วไม่เจอเลยใช้ last
            await this.page.locator('div[role="option"]',{ hasText: month }).click();

            // 4️⃣ เลือกวัน
            await this.page.locator(`div.react-datepicker__day--0${day.padStart(2,'0')}`).click();
            /*
                  .padStart(2, '0') = ถ้า 2 ตัวอักษร จะ เติม '0' ด้านหน้าให้ครบ 2 ตัว
            */
      
      }

      async Selecttitlename (titel: string){
            await this.titlename.click();
            await this.page.locator('div[role="option"]', { hasText: titel }).first().click();
      }

      async FillName (name: string, last: string){
            await this.firstname.fill(name);
            await this.lastname.fill(last);
      }

      async selectBirthDate( year: string, month: string, day: string) {
            await this.dateOfBirth.click();

            await this.page.locator('.css-1y5c9uy-control').first().click();
            await this.page.locator('div[role="option"]',{ hasText: year }).click();
            
            await this.page.locator('.css-1y5c9uy-control').last().click(); 
            await this.page.locator('div[role="option"]',{ hasText: month }).click();
            await this.page.locator(`div.react-datepicker__day--0${day.padStart(2,'0')}`).click();
      }

      //Current Address Info
      async fillCurrentAddress(houseNo: string,  villageNo: string,  buildingNo: string,  roomNo: string,  floorNo: string,  alley: string,  street: string) {
            await this.CurrenthouseNoInput.fill(houseNo);
            await this.CurrentvillageNoInput.fill(villageNo);
            await this.CurrentbuildingNoInput.fill(buildingNo);
            await this.CurrentroomNoInput.fill(roomNo);
            await this.CurrentfloorNoInput.fill(floorNo);
            await this.CurrentalleyInput.fill(alley);
            await this.CurrentstreetInput.fill(street);
      }

      async selectCurrentprovince(province: string) {
            await this.CurrentprovinceDropdown.click();
            await this.page.locator('div[role="option"]', { hasText: province }).first().click();
      }

      async selectCurrentdistrict(district: string) {
            await this.CurrentdistrictDropdown.click();
            await this.page.locator('div[role="option"]', { hasText: district }).first().click();
      }

      async selectCurrentsubDistrict(subDistrict: string) {
            await this.CurrentsubDistrictDropdown.click();
            await this.page.locator('div[role="option"]', { hasText: subDistrict }).first().click();
      }

      //idCard Address Info
      async fillidCardAddress(houseNo: string,  villageNo: string,  buildingNo: string,  roomNo: string,  floorNo: string,  alley: string,  street: string) {
            await this.page.waitForTimeout(500); // ไม่ใส่ ไม่ได้ มันไม่กรอกเลขที่บ้าน
            //await this.idCardhouseNoInput.click();
            await this.idCardhouseNoInput.type(houseNo);
            await this.idCardvillageNoInput.type(villageNo);
            await this.idCardbuildingNoInput.type(buildingNo);
            await this.idCardroomNoInput.type(roomNo);
            await this.idCardfloorNoInput.type(floorNo);
            await this.idCardalleyInput.type(alley);
            await this.idCardstreetInput.type(street);
      }

      async selectidCardprovince(province: string) {
            await this.idCardprovinceDropdown.click();
            await this.page.locator('div[role="option"]', { hasText: province }).first().click();
      }

      async selectidCarddistrict(district: string) {
            await this.idCarddistrictDropdown.click();
            await this.page.locator('div[role="option"]', { hasText: district }).first().click();
      }

      async selectidCardsubDistrict(subDistrict: string) {
            await this.idCardsubDistrictDropdown.click();
            await this.page.locator('div[role="option"]', { hasText: subDistrict }).first().click();
      }


      //Do you want to receive information?
      async choosereceiveNoti() {
            await this.marketingAcceptRadio.check();
      }
      
      async submit() {
            await this.submitBtn.click();
      }

}

export class Checkregistrationinformation {
      readonly page: Page;

      readonly Heading : Locator;
      readonly Nationality :Locator;
      readonly Name :Locator;
      readonly CitizenNo :Locator;
      readonly BirthDay :Locator;
      readonly CurrentAddress :Locator;
      readonly Phone :Locator;
      readonly Email :Locator;
      readonly Channels :Locator;
      readonly receive :Locator;
      readonly acceptPrivacy :Locator;
      readonly acceptConsent :Locator;
      readonly EditBtn :Locator;
      readonly NextBtn :Locator;

      constructor(page: Page) {
            this.page = page;
            this.Heading = page.locator('h1.my-6.w-full');

            //userSection
            const userSection = page.locator('li:has(img[alt="registerUser.svg"])'); //ที่ <li> ที่มี img[alt="registerUser.svg"] ข้างใน
            this.Nationality = userSection.locator('p').nth(0);
            this.Name = userSection.locator('p').nth(1);

            //ข้อมูลส่วนตัวอื่นๆ  
            this.CitizenNo = page.locator('li:has(img[alt="registerIdCard.svg"])').locator('p').first();
            this.BirthDay = page.locator('li:has(img[alt="registerBirthDate.svg"])').locator('p').first();
            this.CurrentAddress = page.locator('li:has(img[alt="registerLocation.svg"])').locator('p').first();
            this.Phone = page.locator('li:has(img[alt="registerCall.svg"])').locator('p').first();
            this.Email = page.locator('li:has(img[alt="registerMail.svg"])').locator('p').first();

            //กรมธรรม์
            this.Channels = page.locator('div:has-text("ช่องทางรับกรมธรรม์อิเล็กทรอนิกส์") p', { hasText: 'อีเมล' }); // ขึ้นกับข้อความใน <p> ภายใน div อาจเจอหลาย element → error
            this.receive = page.locator('div:has-text("ต้องการรับข้อมูลข่าวสาร") p:has-text("· รับ")'); // :has-text() จะแม่นยำกว่า เจาะจงข้อความและ element

            //Consent
            this.acceptPrivacy = page.locator('label:has(input[name="acceptPrivacy"]) span');
            this.acceptConsent = page.locator('label:has(input[name="acceptConsent"]) span');

            //ปุ่ม
            this.EditBtn = page.getByRole('button', { name: 'แก้ไข' });
            this.NextBtn = page.getByRole('button', { name: 'ถัดไป' });
      }

      expectedName(Title: string, FName: string, LName: string) {
            return new RegExp(`${Title}\\s+${FName}\\s+${LName}`); // เอาชื่อมารวมต่อกันเป็น string และ new RegExp() ทำให้ string กลายเป็น regex 
      }

      expectedBrithDay(BDay: string, Bfullmonth: string, Byear: string) {
            return new RegExp(`${BDay}\\s+${Bfullmonth}\\s+(พ\\.ศ\\.\\s+)?${Byear}`); 
      }

      expectedAddress(addr: {
            houseNo: string;
            villageNo: string;
            buildingNo: string;
            roomNo: string;
            floorNo: string;
            alley: string;
            street: string;
            subDistrict: string;
            district: string;
            province: string;
            postcode: string;
      }) {
            return new RegExp(`เลขที่\\s+${addr.houseNo}\\s+หมู่ที่\\s+${addr.villageNo}\\s+อาคาร\\s+${addr.buildingNo}\\s+ห้องเลขที่\\s+${addr.roomNo}\\s+ชั้น\\s+${addr.floorNo}\\s+ซอย\\s+${addr.alley}\\s+ถนน\\s+${addr.street}\\s+ตำบล\\s+${addr.subDistrict}\\s+อำเภอ\\s+${addr.district}\\s+จังหวัด\\s+${addr.province}\\s+${addr.postcode}`); 
      }

      async AcceptConsent (){
            await this.acceptPrivacy.click();
            await this.acceptConsent.click();
      }

      async SubmitBtn (){
            await this.NextBtn.isEnabled()
            await this.NextBtn.click();
      }
}

export class RegisterSuccessPage {
      readonly page: Page;

      readonly Heading : Locator;
      readonly LoginBtn :Locator;

      constructor(page: Page) {
            this.page = page;
            this.Heading = page.locator('h1.my-6.w-full');
            this.LoginBtn = page.locator('button:has-text("เข้าสู่ระบบ")');
      }
      async SubmitBtn (){
            await this.LoginBtn.isEnabled()
            await this.LoginBtn.click();
      }
}