import { faker } from '@faker-js/faker';
import { getAssetPath } from '../../utils/path-helper';

export const registerData = {

  // ======================== // 🔹 Base Config // ========================
      //เก็บค่าคงที่ของ feature นั้น ๆ
  PATH: '/direct/login', //property


  // ======================== // 🔹 Utilities // ==========================
      //ฟังก์ชันช่วยเหลือ (Helper functions)

  //สุ่มเลขบัตรประชาชน  
  generateThaiIdCard() {
      const digits = [1,...Array.from({ length: 11 }, () => Math.floor(Math.random() * 10))];
      /*  สุ่ม 12 หลักแรก
      ... (spread operator) หมายถึง: เอาค่าข้างใน array ออกมาเรียงต่อกัน เป็น 123456789102
      ถ้าไม่ใส่จะกลายเป็น array ซ้อน array (nested array) [1, [3, 5, 7, 1, 9, ...]]
      */

      const sum = digits.reduce((acc, digit, index) => {
        return acc + digit * (13 - index);
      }, 0); // คำนวณเลขหลักสุดท้าย (check digit)

      const checkDigit = (11 - (sum % 11)) % 10; // const ThaiID = ;

    return digits.join('') + checkDigit; // รวมเป็นเลข 13 หลักติดกัน
  },

// ======================== // 🔹 Valid Date // ========================

  // 👉 เปลี่ยนจาก object → function ต้อง random / สร้างใหม่ทุกครั้ง
  validContact() { //method
      const phoneRandom = '08' + faker.string.numeric(8);  // 0812345678 (ไว้กรอก)
      const phoneFormat = phoneRandom.replace(/(\d{3})(\d{3})(\d{4})/,'$1-$2-$3') ; 
      // 081-234-5678 (ไว้ assert หน้า review)
      //replace() = เอาข้อความเดิมมา ค้นหา pattern แล้ว แทนที่ replace('0812345678', '081-234-5678')
      // ส่วน Regex 👉 /(\d{3})(\d{3})(\d{4})/ : แบ่งเลขเป็น 3 กลุ่ม >> \d = ตัวเลข 0-9 , {3} = จำนวน 3 ตัว
      // '$1-$2-$3' เอา 3 ส่วนมารวมกันเป็น format นี้

      const emailRandom = faker.internet.email().toLowerCase();
      const otp ='12345';
      const password = 'Be220216'

      return { phoneRandom, phoneFormat, emailRandom, otp,password};
    },

  validProfileInfo(){
      const ThaiID = this.generateThaiIdCard();
      const PathIDcard = getAssetPath('auth/id-card.jpg'); //เรียกใช้ helper
      const Title = 'นางสาว';
      const FName = 'ทดสอบ';
      const LName = 'ระบบ';
      const Exday = '22';
      const Exmonth = 'ก.พ.';
      const Exyear= '2570';
      const BDay = '22';
      const Bmonth = 'ก.พ.';
      const Bfullmonth = 'กุมภาพันธ์';
      const Byear = '2540';

      return {ThaiID,Title,PathIDcard,FName,LName,Exday,Exmonth,Exyear,BDay,Bmonth,Bfullmonth,Byear}

  },

  CurrentAddressInfo(){
      const houseNo = 'บ้านเลขที่ 1A-B';
      const villageNo = '2'; 
      const buildingNo = '3';
      const roomNo = '4';
      const floorNo = '5';
      const street= '6';
      const alley= '7';
      const province = 'กรุงเทพมหานคร';
      const district = 'จตุจักร';
      const subDistrict = 'จอมพล';
      const postcode = '10900';

      return {houseNo,villageNo,buildingNo,roomNo,floorNo,alley,street,province,district,subDistrict,postcode}

  },

 idCardAddressInfo(){
      const houseNo = 'เลขที่ 11A';
      const villageNo = '22'; 
      const buildingNo = '33';
      const roomNo = '44';
      const floorNo = '55';
      const street= '66';
      const alley= '77';
      const province = 'จันทบุรี';
      const district = 'ท่าใหม่';
      const subDistrict = 'เขาแก้ว';
      const postcode = '22170';

      return {houseNo,villageNo,buildingNo,roomNo,floorNo,alley,street,province,district,subDistrict,postcode}
  },
  

// ======================== // 🔹 Invalid Data // ========================

  WrongFormatUser: { // property ชนิด object ค่าเดิมใช้ซ้ำได้
    phone: '0272201973',
    email: 'bbubble1a@',
    id : '112654',
    confirmpassword : '1234'
  },

  alreadyUser: { // property ชนิด object ค่าเดิมใช้ซ้ำได้
    phone: '0972201973',
    email: 'bbubble1a@gmail.com',
    id : '1600100791371',
    FName: /ภัคจิรา/,
    LName: /เหมือนครุฑ/,
    ExDat: /4\s+ก\.ค\.\s+(พ\.ศ\.\s+)?2571/,
    BDay: /5\s+ก\.ค\.\s+(พ\.ศ\.\s+)?2542/
    /*
    สีแดง : Regex (Regular Expression) คือ “รูปแบบข้อความ” ที่ใช้สำหรับ ค้นหา / ตรวจสอบ / จับคู่ (match) ตัวอักษร แบบยืดหยุ่น
      - ขอแค่มีคำว่า สัญชาติ อยู่ในข้อความก็พอ

    (พ\.ศ\.\s+)? = มีหรือไม่มีก็ได้
    */
  }
};
